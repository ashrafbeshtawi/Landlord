'use client';

import { useState } from 'react';
import { Box, Button, TextField, Typography, Grid, Card, CardContent } from '@mui/material';
import { ethers } from 'ethers';
import { useActionStore } from '@/store/store';
import LandLordToken from '@/LandLordToken.json';
import theme from '@/theme/theme';
import { motion } from 'framer-motion';

const ERC20Actions = () => {
  const { walletAdresse } = useActionStore();
  const [formState, setFormState] = useState({
    Transfer: { toAddress: '', amount: '' },
    Approve: { spenderAddress: '', amount: '' },
    'Transfer From': { fromAddress: '', toAddress: '', amount: '' },
    Burn: { amount: '' },
  });
  const [status, setStatus] = useState('');

  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '';

  const getSigner = async () => {
    if (!window.ethereum) {
      throw new Error("MetaMask is not installed.");
    }
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return signer;
  };

  const getContract = async () => {
    const signer = await getSigner();
    return new ethers.Contract(contractAddress, LandLordToken.abi, signer);
  };

  const handleInputChange = (actionTitle: string, fieldName: string, value: string) => {
    setFormState(prevState => ({
      ...prevState,
      [actionTitle]: {
        ...prevState[actionTitle as keyof typeof prevState],
        [fieldName]: value,
      },
    }));
  };

  const handleTransfer = async () => {
    try {
      setStatus('Processing transfer...');
      const contract = await getContract();
      const { toAddress, amount } = formState.Transfer;
      const tx = await contract.transfer(toAddress, ethers.parseUnits(amount, 18));
      await tx.wait();
      setStatus('Transfer successful!');
    } catch (error) {
      console.error(error);
      setStatus('Transfer failed.');
    }
  };

  const handleApprove = async () => {
    try {
      setStatus('Processing approval...');
      const contract = await getContract();
      const { spenderAddress, amount } = formState.Approve;
      const tx = await contract.approve(spenderAddress, ethers.parseUnits(amount, 18));
      await tx.wait();
      setStatus('Approval successful!');
    } catch (error) {
      console.error(error);
      setStatus('Approval failed.');
    }
  };

  const handleTransferFrom = async () => {
    try {
      setStatus('Processing transfer from...');
      const contract = await getContract();
      const { fromAddress, toAddress, amount } = formState['Transfer From'];
      const tx = await contract.transferFrom(fromAddress, toAddress, ethers.parseUnits(amount, 18));
      await tx.wait();
      setStatus('Transfer from successful!');
    } catch (error) {
      console.error(error);
      setStatus('Transfer from failed.');
    }
  };

  const handleBurn = async () => {
    try {
      setStatus('Processing burn...');
      const contract = await getContract();
      const { amount } = formState.Burn;
      const tx = await contract.burn(ethers.parseUnits(amount, 18));
      await tx.wait();
      setStatus('Burn successful!');
    } catch (error) {
      console.error(error);
      setStatus('Burn failed.');
    }
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: "easeOut" }
  };

  const actionCards = [
    {
      title: 'Transfer',
      handler: handleTransfer,
      fields: [
        { label: 'To Address', name: 'toAddress' },
        { label: 'Amount', name: 'amount' }
      ]
    },
    {
      title: 'Approve',
      handler: handleApprove,
      fields: [
        { label: 'Spender Address', name: 'spenderAddress' },
        { label: 'Amount', name: 'amount' }
      ]
    },
    {
      title: 'Transfer From',
      handler: handleTransferFrom,
      fields: [
        { label: 'From Address', name: 'fromAddress' },
        { label: 'To Address', name: 'toAddress' },
        { label: 'Amount', name: 'amount' }
      ]
    },
    {
      title: 'Burn',
      handler: handleBurn,
      fields: [
        { label: 'Amount', name: 'amount' }
      ]
    }
  ];

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
          borderRadius: '5px 5px 0 0'
        }
      }}
    >
      <motion.div initial="initial" animate="animate" variants={fadeInUp}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', color: 'white' }}>ERC20 Actions</Typography>
        <Grid container spacing={2}>
          {actionCards.map((action, index) => (
            <Grid key={index}>
              <Card
                sx={{
                  background: 'linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                  backdropFilter: 'blur(15px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 3,
                  height: '100%',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 15px 30px rgba(0,0,0,0.3)',
                    border: '1px solid rgba(255,255,255,0.3)'
                  }
                }}
              >
                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ color: 'white' }}>{action.title}</Typography>
                  {action.fields.map((field, i) => (
                    <TextField
                      key={i}
                      label={field.label}
                      fullWidth
                      margin="normal"
                      value={formState[action.title as keyof typeof formState][field.name as keyof typeof formState[keyof typeof formState]]}
                      onChange={(e) => handleInputChange(action.title, field.name, e.target.value)}
                      InputLabelProps={{
                        style: { color: 'rgba(255,255,255,0.7)' },
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: 'rgba(255,255,255,0.5)',
                          },
                          '&:hover fieldset': {
                            borderColor: 'white',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: theme.palette.primary.main,
                          },
                          '& input': {
                            color: 'white',
                          },
                        },
                      }}
                    />
                  ))}
                  <Button
                    variant="contained"
                    onClick={action.handler}
                    disabled={!walletAdresse}
                    sx={{
                      mt: 1,
                      background: `linear-gradient(45deg, ${theme.palette.primary.main}, #4CAF50)`,
                      px: 4,
                      py: 1.5,
                      fontSize: '1rem',
                      fontWeight: 600,
                      borderRadius: 3,
                      textTransform: 'none',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                      '&:hover': {
                        background: `linear-gradient(45deg, ${theme.palette.primary.dark}, #45a049)`,
                        transform: 'translateY(-2px)',
                        boxShadow: '0 15px 30px rgba(0,0,0,0.4)'
                      }
                    }}
                  >
                    {action.title}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        {status && <Typography sx={{ mt: 2, color: 'white' }}>{status}</Typography>}
      </motion.div>
    </Box>
  );
};

export default ERC20Actions;
