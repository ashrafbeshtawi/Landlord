'use client';

import { useState } from 'react';
import { ethers } from 'ethers';
import { Button } from '@mui/material';
import {Box} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import WalletIcon from '@mui/icons-material/AccountBalanceWallet'; // Import a wallet icon
import theme from '../theme/theme'; // Import your theme

export default function WalletConnectButton() {
  const [address, setAddress] = useState<string | null>(null);

  const handleConnectWallet = async (): Promise<void> => {
    if (typeof window === 'undefined' || !window.ethereum) {
      console.error('MetaMask nicht verfügbar');
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      console.log('Wallet verbunden:', address);
      setAddress(address);
    } catch (err) {
      console.error('Fehler beim Verbinden:', err);
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
        <Button
        variant="contained"
        color="primary"
        onClick={handleConnectWallet}
        sx={{ display: { xs: 'none', md: 'flex' }, ml: 2,  fontWeight: 'bold' }}
        >
        Connect Wallet
        </Button>
        <IconButton sx={{ display: { xs: 'flex', md: 'none' }, ml: 1, backgroundColor: theme.palette.primary.main }} onClick={handleConnectWallet}>
        <WalletIcon sx={{ color: '#fff' }} />
        </IconButton>

        <IconButton onClick={handleConnectWallet} sx={{ display: { xs: 'flex', md: 'none' } }}>
        <MenuIcon />
        </IconButton>
        {address && <p>Verbunden mit: {address}</p>}
  </Box>
  );
}
