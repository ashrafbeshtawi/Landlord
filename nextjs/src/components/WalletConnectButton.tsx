'use client';

import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { Button, Box, IconButton } from '@mui/material';
import WalletIcon from '@mui/icons-material/AccountBalanceWallet';
import theme from '../theme/theme';
import { useActionStore } from '@/store/store';
import { useRouter } from 'next/navigation';


declare global {
  interface Window {
    ethereum?: undefined;
  }
}

export default function WalletConnectButton() {
  const router = useRouter();
  const [address, setAddress] = useState<string | null>(null);
  const { signer, setWalletConnected, setWalletDisconnected } = useActionStore();

  const handleConnectWallet = async (): Promise<void> => {
    if (typeof window === 'undefined' || !window.ethereum) {
      alert('MetaMask not available on your browser. Please install it.');
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();

      setWalletConnected(signer);

      const addr = await signer.getAddress();
      console.log('Wallet connected:', addr);
      setAddress(addr);
    } catch (err) {
      console.error('Error connecting wallet:', err);
      alert('Error connecting wallet');
    }
  };

  const handleLogout = (): void => {
    setWalletDisconnected();
    console.log('Wallet disconnected');
    router.push('/');
    setAddress(null);
  };

  const goToControlPanel = (): void => {
    router.push('/control');
  }

  useEffect(() => {
    if (signer) {
      signer.getAddress().then(setAddress).catch(() => setAddress(null));
    }
  }, [signer]);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
      {!address ? (
        <>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleConnectWallet}
            sx={{ display: { xs: 'none', md: 'flex' }, ml: 2, fontWeight: 'bold' }}
          >
            Connect Wallet
          </Button>
          <IconButton
            sx={{
              display: { xs: 'flex', md: 'none' },
              ml: 1,
              backgroundColor: theme.palette.primary.main
            }}
            onClick={handleConnectWallet}
          >
            <WalletIcon sx={{ color: '#fff' }} />
          </IconButton>
        </>
      ) : (
        <>

          <Button
            variant="outlined"
            color="secondary"
            onClick={goToControlPanel}
            sx={{
              ml: 1,
              fontWeight: 'bold',
              borderColor: theme.palette.secondary.main,
              color: theme.palette.secondary.main
            }}
          >
            Control Panel
          </Button>
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
