'use client';

import { useState, useMemo } from 'react';
import { Box, Button, TextField, Typography, Grid, Card, CardContent } from '@mui/material';
import { ethers } from 'ethers';
import { motion } from 'framer-motion';
import { useActionStore } from '@/store/store';
import { useContract } from '@/hooks/useContract';
import { useToast } from '@/hooks/useToast';
import Toast from '@/components/common/Toast';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import theme from '@/theme/theme';

interface ActionField {
  label: string;
  name: string;
  type: 'address' | 'amount';
}

interface ActionConfig {
  id: string; // Unique ID for key prop
  title: string;
  fields: ActionField[];
}

type FormState = {
  [key: string]: { [field: string]: string };
};

// Memoized action configs with stable IDs
const ACTION_CONFIGS: ActionConfig[] = [
  {
    id: 'transfer',
    title: 'Transfer',
    fields: [
      { label: 'To Address', name: 'toAddress', type: 'address' },
      { label: 'Amount', name: 'amount', type: 'amount' },
    ],
  },
  {
    id: 'approve',
    title: 'Approve',
    fields: [
      { label: 'Spender Address', name: 'spenderAddress', type: 'address' },
      { label: 'Amount', name: 'amount', type: 'amount' },
    ],
  },
  {
    id: 'transfer-from',
    title: 'Transfer From',
    fields: [
      { label: 'From Address', name: 'fromAddress', type: 'address' },
      { label: 'To Address', name: 'toAddress', type: 'address' },
      { label: 'Amount', name: 'amount', type: 'amount' },
    ],
  },
  {
    id: 'burn',
    title: 'Burn',
    fields: [{ label: 'Amount', name: 'amount', type: 'amount' }],
  },
];

const initialFormState: FormState = {
  Transfer: { toAddress: '', amount: '' },
  Approve: { spenderAddress: '', amount: '' },
  'Transfer From': { fromAddress: '', toAddress: '', amount: '' },
  Burn: { amount: '' },
};

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: 'easeOut' },
};

// Type guard for ethers errors
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

// Validation helpers
function isValidAddress(address: string): boolean {
  return ethers.isAddress(address);
}

function isValidAmount(amount: string): boolean {
  if (!amount || amount.trim() === '') return false;
  try {
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) return false;
    // Check it can be parsed as BigInt with 18 decimals
    ethers.parseUnits(amount, 18);
    return true;
  } catch {
    return false;
  }
}

function ERC20ActionsContent() {
  const { walletAdresse } = useActionStore();
  const { getContract } = useContract();
  const { toast, showSuccess, showError, showPending, hideToast } = useToast();

  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [processingAction, setProcessingAction] = useState<string | null>(null);

  // Memoize action configs to prevent recreation
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
    // Validate before executing
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

      // Clear form after success
      setFormState((prev) => ({
        ...prev,
        [actionTitle]: initialFormState[actionTitle],
      }));
    } catch (err: unknown) {
      // Use type guard for proper error handling
      let errorMessage = `${actionTitle} failed`;

      if (isEthersError(err)) {
        errorMessage = err.reason || err.message || errorMessage;

        // Handle common error codes
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

  // Memoized styles
  const cardStyles = useMemo(
    () => ({
      background: 'linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
      backdropFilter: 'blur(15px)',
      border: '1px solid rgba(255,255,255,0.2)',
      borderRadius: 3,
      minWidth: 260,
      transition: 'all 0.3s ease',
      '&:hover': {
        boxShadow: '0 15px 30px rgba(0,0,0,0.3)',
        border: '1px solid rgba(255,255,255,0.3)',
      },
    }),
    []
  );

  const textFieldStyles = useMemo(
    () => ({
      '& .MuiOutlinedInput-root': {
        '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
        '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
        '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
        '& input': { color: 'white' },
      },
    }),
    []
  );

  return (
    <Box
      sx={{
        p: { xs: 4, md: 6 },
        background: 'linear-gradient(145deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 100%)',
        backdropFilter: 'blur(25px)',
        border: '1px solid rgba(255,255,255,0.25)',
        borderRadius: 5,
        boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'center',
        width: { xs: '90%', md: '80%' },
        mx: 'auto',
        mt: 4,
        color: 'white',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: `linear-gradient(90deg, ${theme.palette.primary.main}, #4CAF50, #2196F3)`,
          borderRadius: '5px 5px 0 0',
        },
      }}
    >
      <motion.div initial="initial" animate="animate" variants={fadeInUp}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: 'white' }}>
          Token Actions
        </Typography>

        <Grid container spacing={3} justifyContent="center">
          {actionConfigs.map((action) => (
            <Grid key={action.id}>
              <Card sx={cardStyles}>
                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                    {action.title}
                  </Typography>

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
                      InputLabelProps={{ style: { color: 'rgba(255,255,255,0.7)' } }}
                      sx={textFieldStyles}
                    />
                  ))}

                  <Button
                    variant="contained"
                    onClick={handlers[action.title]}
                    disabled={!walletAdresse || processingAction !== null}
                    fullWidth
                    sx={{
                      mt: 2,
                      background:
                        processingAction === action.title
                          ? 'rgba(255,255,255,0.1)'
                          : `linear-gradient(45deg, ${theme.palette.primary.main}, #4CAF50)`,
                      py: 1.5,
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      borderRadius: 2,
                      textTransform: 'none',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
                      '&:hover': {
                        background: `linear-gradient(45deg, ${theme.palette.primary.dark}, #45a049)`,
                        transform: 'translateY(-2px)',
                      },
                      '&:disabled': {
                        background: 'rgba(255,255,255,0.1)',
                        color: 'rgba(255,255,255,0.5)',
                      },
                    }}
                  >
                    {processingAction === action.title ? 'Processing...' : action.title}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </motion.div>

      <Toast toast={toast} onClose={hideToast} />
    </Box>
  );
}

export default function ERC20Actions() {
  return (
    <ErrorBoundary>
      <ERC20ActionsContent />
    </ErrorBoundary>
  );
}
