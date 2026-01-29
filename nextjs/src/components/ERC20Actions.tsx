'use client';

import { useState } from 'react';
import { Box, Button, TextField, Typography, Grid, Card, CardContent } from '@mui/material';
import { ethers } from 'ethers';
import { motion } from 'framer-motion';
import { useActionStore } from '@/store/store';
import { useContract } from '@/hooks/useContract';
import { useToast } from '@/hooks/useToast';
import Toast from '@/components/common/Toast';
import theme from '@/theme/theme';

interface ActionField {
  label: string;
  name: string;
}

interface ActionConfig {
  title: string;
  fields: ActionField[];
}

type FormState = {
  [key: string]: { [field: string]: string };
};

const actionConfigs: ActionConfig[] = [
  {
    title: 'Transfer',
    fields: [
      { label: 'To Address', name: 'toAddress' },
      { label: 'Amount', name: 'amount' },
    ],
  },
  {
    title: 'Approve',
    fields: [
      { label: 'Spender Address', name: 'spenderAddress' },
      { label: 'Amount', name: 'amount' },
    ],
  },
  {
    title: 'Transfer From',
    fields: [
      { label: 'From Address', name: 'fromAddress' },
      { label: 'To Address', name: 'toAddress' },
      { label: 'Amount', name: 'amount' },
    ],
  },
  {
    title: 'Burn',
    fields: [{ label: 'Amount', name: 'amount' }],
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

export default function ERC20Actions() {
  const { walletAdresse } = useActionStore();
  const { getContract } = useContract();
  const { toast, showSuccess, showError, showPending, hideToast } = useToast();

  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [processingAction, setProcessingAction] = useState<string | null>(null);

  const handleInputChange = (actionTitle: string, fieldName: string, value: string) => {
    setFormState((prev) => ({
      ...prev,
      [actionTitle]: {
        ...prev[actionTitle],
        [fieldName]: value,
      },
    }));
  };

  const executeAction = async (
    actionTitle: string,
    contractMethod: (contract: ethers.Contract) => Promise<ethers.ContractTransactionResponse>
  ) => {
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
    } catch (err) {
      const errorMessage = (err as Error).message || `${actionTitle} failed`;
      showError(errorMessage);
    } finally {
      setProcessingAction(null);
    }
  };

  const handleTransfer = () => {
    const { toAddress, amount } = formState.Transfer;
    if (!toAddress || !amount) {
      showError('Please fill in all fields');
      return;
    }
    executeAction('Transfer', (contract) =>
      contract.transfer(toAddress, ethers.parseUnits(amount, 18))
    );
  };

  const handleApprove = () => {
    const { spenderAddress, amount } = formState.Approve;
    if (!spenderAddress || !amount) {
      showError('Please fill in all fields');
      return;
    }
    executeAction('Approve', (contract) =>
      contract.approve(spenderAddress, ethers.parseUnits(amount, 18))
    );
  };

  const handleTransferFrom = () => {
    const { fromAddress, toAddress, amount } = formState['Transfer From'];
    if (!fromAddress || !toAddress || !amount) {
      showError('Please fill in all fields');
      return;
    }
    executeAction('Transfer From', (contract) =>
      contract.transferFrom(fromAddress, toAddress, ethers.parseUnits(amount, 18))
    );
  };

  const handleBurn = () => {
    const { amount } = formState.Burn;
    if (!amount) {
      showError('Please fill in the amount');
      return;
    }
    executeAction('Burn', (contract) => contract.burn(ethers.parseUnits(amount, 18)));
  };

  const handlers: { [key: string]: () => void } = {
    Transfer: handleTransfer,
    Approve: handleApprove,
    'Transfer From': handleTransferFrom,
    Burn: handleBurn,
  };

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
            <Grid key={action.title}>
              <Card
                sx={{
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
                }}
              >
                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                    {action.title}
                  </Typography>

                  {action.fields.map((field) => (
                    <TextField
                      key={field.name}
                      label={field.label}
                      fullWidth
                      margin="dense"
                      size="small"
                      value={formState[action.title]?.[field.name] || ''}
                      onChange={(e) => handleInputChange(action.title, field.name, e.target.value)}
                      disabled={processingAction === action.title}
                      InputLabelProps={{ style: { color: 'rgba(255,255,255,0.7)' } }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                          '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                          '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
                          '& input': { color: 'white' },
                        },
                      }}
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
