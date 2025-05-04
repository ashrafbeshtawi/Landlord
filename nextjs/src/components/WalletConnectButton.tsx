'use client';

import { useState } from 'react';
import { ethers } from 'ethers';
import { Button } from '@mui/material';

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
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={handleConnectWallet}
        sx={{
          display: { xs: 'none', md: 'flex' },
          backgroundColor: '#169976',
          color: 'white',
          textTransform: 'none',
          fontWeight: 'bold',
          ml: 2,
          '&:hover': { backgroundColor: '#127a5c' },
        }}
      >
        Wallet verbinden
      </Button>

      {address && <p>Verbunden mit: {address}</p>}
    </>
  );
}
