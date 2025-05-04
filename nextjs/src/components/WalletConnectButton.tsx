'use client';

import { useState } from 'react';
import { ethers } from 'ethers';
import { Button, Box, IconButton } from '@mui/material';
import WalletIcon from '@mui/icons-material/AccountBalanceWallet';
import theme from '../theme/theme';

declare global {
  interface Window {
    ethereum?: undefined;
  }
}

export default function WalletConnectButton() {
  const [address, setAddress] = useState<string | null>(null);

  const handleConnectWallet = async (): Promise<void> => {
    if (typeof window === 'undefined' || !window.ethereum) {
      console.error('MetaMask not available');
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();
      const addr = await signer.getAddress();
      console.log('Wallet connected:', addr);
      setAddress(addr);
    } catch (err) {
      console.error('Error connecting wallet:', err);
    }
  };

  const handleLogout = (): void => {
    console.log('Wallet disconnected');
    setAddress(null);
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
      {!address ? (
        <>
          <Button
            variant="contained"
            color="primary"
            onClick={handleConnectWallet}
            sx={{ display: { xs: 'none', md: 'flex' }, ml: 2, fontWeight: 'bold', color: theme.palette.text.primary }}
          >
            Connect Wallet
          </Button>
          <IconButton
            sx={{ display: { xs: 'flex', md: 'none' }, ml: 1, backgroundColor: theme.palette.primary.main }}
            onClick={handleConnectWallet}
          >
            <WalletIcon sx={{ color: '#fff' }} />
          </IconButton>
        </>
      ) : (
        <>
          <Box sx={{ mr: 2, color: theme.palette.primary.main }}>
            Connected to: {address.slice(0, 6)}…{address.slice(-4)}
          </Box>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleLogout}
            sx={{
              ml: 1,
              fontWeight: 'bold',
              borderColor: theme.palette.secondary.main,
              color: theme.palette.secondary.main
            }}
          >
            Disconnect
          </Button>
        </>
      )}
    </Box>
  );
}
