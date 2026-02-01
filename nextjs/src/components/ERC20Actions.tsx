'use client';

import { useState, useMemo } from 'react';
import { Box, Button, TextField, Typography, Grid, Card, CardContent } from '@mui/material';
import { ethers } from 'ethers';
import { motion } from 'framer-motion';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import { useActionStore } from '@/store/store';
import { useContract } from '@/hooks/useContract';
import { useToast } from '@/hooks/useToast';
import Toast from '@/components/common/Toast';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import theme from '@/theme/theme';

interface ERC20ActionsProps {
  onActionComplete?: () => void;
}

interface ActionField {
  label: string;
  name: string;
  type: 'address' | 'amount';
}

interface ActionConfig {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  fields: ActionField[];
}

type FormState = {
  [key: string]: { [field: string]: string };
};

const ACTION_CONFIGS: ActionConfig[] = [
  {
    id: 'transfer',
    title: 'Transfer',
    description: 'Send tokens to another address',
    icon: <SendIcon />,
    color: theme.palette.primary.main,
    fields: [
      { label: 'Recipient Address', name: 'toAddress', type: 'address' },
      { label: 'Amount', name: 'amount', type: 'amount' },
    ],
  },
  {
    id: 'approve',
    title: 'Approve',
    description: 'Allow another address to spend tokens',
    icon: <CheckCircleIcon />,
    color: '#4CAF50',
    fields: [
      { label: 'Spender Address', name: 'spenderAddress', type: 'address' },
      { label: 'Amount', name: 'amount', type: 'amount' },
    ],
  },
  {
    id: 'transfer-from',
    title: 'Transfer From',
    description: 'Transfer tokens on behalf of another',
    icon: <SwapHorizIcon />,
    color: '#2196F3',
    fields: [
      { label: 'From Address', name: 'fromAddress', type: 'address' },
      { label: 'To Address', name: 'toAddress', type: 'address' },
      { label: 'Amount', name: 'amount', type: 'amount' },
    ],
  },
  {
    id: 'burn',
    title: 'Burn',
    description: 'Permanently destroy tokens',
    icon: <LocalFireDepartmentIcon />,
    color: '#FF5722',
    fields: [{ label: 'Amount', name: 'amount', type: 'amount' }],
  },
];

const initialFormState: FormState = {
  Transfer: { toAddress: '', amount: '' },
  Approve: { spenderAddress: '', amount: '' },
  'Transfer From': { fromAddress: '', toAddress: '', amount: '' },
  Burn: { amount: '' },
};

interface EthersError extends Error {
  reason?: string;
  code?: string;
}

function isEthersError(error: unknown): error is EthersError {
  return (
    error instanceof Error &&
    (typeof (error as EthersError).reason === 'string' ||
      typeof (error as EthersError).code === 'string')
  );
}

function isValidAddress(address: string): boolean {
  return ethers.isAddress(address);
}

function isValidAmount(amount: string): boolean {
  if (!amount || amount.trim() === '') return false;
  try {
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) return false;
    ethers.parseUnits(amount, 18);
    return true;
  } catch {
    return false;
  }
}

function ERC20ActionsContent({ onActionComplete }: ERC20ActionsProps) {
  const { walletAdresse } = useActionStore();
  const { getContract } = useContract();
  const { toast, showSuccess, showError, showPending, hideToast } = useToast();

  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [processingAction, setProcessingAction] = useState<string | null>(null);

  const actionConfigs = useMemo(() => ACTION_CONFIGS, []);

  const handleInputChange = (actionTitle: string, fieldName: string, value: string) => {
    setFormState((prev) => ({
      ...prev,
      [actionTitle]: {
        ...prev[actionTitle],
        [fieldName]: value,
      },
    }));
  };

  const validateForm = (actionTitle: string): string | null => {
    const config = actionConfigs.find((c) => c.title === actionTitle);
    if (!config) return 'Invalid action';

    const formData = formState[actionTitle];

    for (const field of config.fields) {
      const value = formData[field.name];
      if (!value || value.trim() === '') {
        return `${field.label} is required`;
      }

      if (field.type === 'address' && !isValidAddress(value)) {
        return `${field.label} is not a valid Ethereum address`;
      }

      if (field.type === 'amount' && !isValidAmount(value)) {
        return `${field.label} must be a positive number`;
      }
    }

    return null;
  };

  const executeAction = async (
    actionTitle: string,
    contractMethod: (contract: ethers.Contract) => Promise<ethers.ContractTransactionResponse>
  ) => {
    const validationError = validateForm(actionTitle);
    if (validationError) {
      showError(validationError);
      return;
    }

    try {
      setProcessingAction(actionTitle);
      showPending(`Processing ${actionTitle.toLowerCase()}...`);

      const contract = await getContract();
      const tx = await contractMethod(contract);
      await tx.wait();

      showSuccess(`${actionTitle} successful!`, tx.hash);

      setFormState((prev) => ({
        ...prev,
        [actionTitle]: initialFormState[actionTitle],
      }));

      // Refresh balance after successful action
      if (onActionComplete) {
        setTimeout(() => onActionComplete(), 2000);
      }
    } catch (err: unknown) {
      let errorMessage = `${actionTitle} failed`;

      if (isEthersError(err)) {
        errorMessage = err.reason || err.message || errorMessage;

        if (err.code === 'ACTION_REJECTED') {
          errorMessage = 'Transaction was rejected by user';
        } else if (err.code === 'INSUFFICIENT_FUNDS') {
          errorMessage = 'Insufficient funds for transaction';
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      showError(errorMessage);
    } finally {
      setProcessingAction(null);
    }
  };

  const handleTransfer = () => {
    const { toAddress, amount } = formState.Transfer;
    executeAction('Transfer', (contract) =>
      contract.transfer(toAddress, ethers.parseUnits(amount, 18))
    );
  };

  const handleApprove = () => {
    const { spenderAddress, amount } = formState.Approve;
    executeAction('Approve', (contract) =>
      contract.approve(spenderAddress, ethers.parseUnits(amount, 18))
    );
  };

  const handleTransferFrom = () => {
    const { fromAddress, toAddress, amount } = formState['Transfer From'];
    executeAction('Transfer From', (contract) =>
      contract.transferFrom(fromAddress, toAddress, ethers.parseUnits(amount, 18))
    );
  };

  const handleBurn = () => {
    const { amount } = formState.Burn;
    executeAction('Burn', (contract) => contract.burn(ethers.parseUnits(amount, 18)));
  };

  const handlers: { [key: string]: () => void } = {
    Transfer: handleTransfer,
    Approve: handleApprove,
    'Transfer From': handleTransferFrom,
    Burn: handleBurn,
  };

  return (
    <Box>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, color: 'white', mb: 1 }}>
          Token Actions
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
          Manage your LND tokens
        </Typography>
      </Box>

      <Grid container spacing={3} justifyContent="center">
        {actionConfigs.map((action, index) => (
          <Grid key={action.id} size={{ xs: 12, sm: 6, lg: 3 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card
                sx={{
                  height: '100%',
                  background: 'linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
                  backdropFilter: 'blur(15px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 20px 40px rgba(0,0,0,0.3)`,
                    border: `1px solid ${action.color}40`,
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  {/* Header */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: 2,
                        bgcolor: `${action.color}20`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: action.color,
                      }}
                    >
                      {action.icon}
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, lineHeight: 1.2 }}>
                        {action.title}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                        {action.description}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Form Fields */}
                  {action.fields.map((field) => (
                    <TextField
                      key={`${action.id}-${field.name}`}
                      label={field.label}
                      fullWidth
                      margin="dense"
                      size="small"
                      value={formState[action.title]?.[field.name] || ''}
                      onChange={(e) => handleInputChange(action.title, field.name, e.target.value)}
                      disabled={processingAction === action.title}
                      placeholder={field.type === 'address' ? '0x...' : '0.0'}
                      InputLabelProps={{ style: { color: 'rgba(255,255,255,0.6)' } }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                          '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                          '&.Mui-focused fieldset': { borderColor: action.color },
                          '& input': { color: 'white' },
                        },
                      }}
                    />
                  ))}

                  {/* Submit Button */}
                  <Button
                    variant="contained"
                    onClick={handlers[action.title]}
                    disabled={!walletAdresse || processingAction !== null}
                    fullWidth
                    sx={{
                      mt: 2,
                      background: processingAction === action.title
                        ? 'rgba(255,255,255,0.1)'
                        : `linear-gradient(135deg, ${action.color}, ${action.color}CC)`,
                      py: 1.5,
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      borderRadius: 2,
                      textTransform: 'none',
                      '&:hover': {
                        background: `linear-gradient(135deg, ${action.color}DD, ${action.color}AA)`,
                      },
                      '&:disabled': {
                        background: 'rgba(255,255,255,0.1)',
                        color: 'rgba(255,255,255,0.4)',
                      },
                    }}
                  >
                    {processingAction === action.title ? 'Processing...' : action.title}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      <Toast toast={toast} onClose={hideToast} />
    </Box>
  );
}

export default function ERC20Actions({ onActionComplete }: ERC20ActionsProps = {}) {
  return (
    <ErrorBoundary>
      <ERC20ActionsContent onActionComplete={onActionComplete} />
    </ErrorBoundary>
  );
}
