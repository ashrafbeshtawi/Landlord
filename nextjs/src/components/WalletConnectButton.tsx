'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { ethers } from 'ethers';
import { Button, Box, IconButton, Snackbar, Alert } from '@mui/material';
import WalletIcon from '@mui/icons-material/AccountBalanceWallet';
import theme from '../theme/theme';
import { useActionStore } from '@/store/store';
import { useRouter } from 'next/navigation';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import VpnKeyIcon from '@mui/icons-material/VpnKey';

// Simple notification state for wallet-specific messages
interface WalletNotification {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'info' | 'warning';
}

export default function WalletConnectButton() {
  const router = useRouter();
  const [address, setAddress] = useState<string | null>(null);
  const { signer, setWalletConnected, setWalletDisconnected, setChainId } = useActionStore();

  // Track previous address for comparison without causing re-renders in callbacks
  const addressRef = useRef<string | null>(null);
  addressRef.current = address;

  // Notification state (replaces alert())
  const [notification, setNotification] = useState<WalletNotification>({
    open: false,
    message: '',
    severity: 'info',
  });

  const showNotification = useCallback((message: string, severity: WalletNotification['severity'] = 'info') => {
    setNotification({ open: true, message, severity });
  }, []);

  const hideNotification = useCallback(() => {
    setNotification((prev) => ({ ...prev, open: false }));
  }, []);

  const handleLogout = useCallback((): void => {
    setWalletDisconnected();
    router.push('/');
    setAddress(null);
  }, [setWalletDisconnected, router]);

  const goToControlPanel = useCallback((): void => {
    router.push('/control');
  }, [router]);

  const handleConnectWallet = useCallback(async (): Promise<void> => {
    if (typeof window === 'undefined' || !window.ethereum) {
      showNotification('MetaMask not available on your browser. Please install it.', 'error');
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const newSigner = await provider.getSigner();

      await setWalletConnected(newSigner);

      const addr = await newSigner.getAddress();
      setAddress(addr);
      goToControlPanel();
    } catch (err) {
      console.error('Error connecting wallet:', err);
      showNotification('Failed to connect wallet. Please try again.', 'error');
    }
  }, [setWalletConnected, goToControlPanel, showNotification]);

  // Handle account changes from MetaMask
  const handleAccountsChanged = useCallback(
    async (accounts: string[]) => {
      if (accounts.length === 0) {
        // User disconnected their wallet
        handleLogout();
        showNotification('Wallet disconnected', 'info');
      } else if (accounts[0] !== addressRef.current) {
        // Account changed, reconnect with new account
        try {
          if (typeof window !== 'undefined' && window.ethereum) {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const newSigner = await provider.getSigner();
            await setWalletConnected(newSigner);
            setAddress(accounts[0]);
            showNotification('Switched to account: ' + accounts[0].slice(0, 6) + '...' + accounts[0].slice(-4), 'success');
          }
        } catch (err) {
          console.error('Error switching account:', err);
          handleLogout();
          showNotification('Failed to switch account', 'error');
        }
      }
    },
    [handleLogout, setWalletConnected, showNotification]
  );

  // Handle chain/network changes - update store instead of reloading
  const handleChainChanged = useCallback(
    async (chainIdHex: string) => {
      try {
        const newChainId = parseInt(chainIdHex, 16);
        setChainId(newChainId);

        // Reconnect signer with new chain
        if (typeof window !== 'undefined' && window.ethereum && addressRef.current) {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const newSigner = await provider.getSigner();
          await setWalletConnected(newSigner);
          showNotification(`Switched to chain ID: ${newChainId}`, 'info');
        }
      } catch (err) {
        console.error('Error handling chain change:', err);
        showNotification('Failed to handle chain change', 'error');
      }
    },
    [setChainId, setWalletConnected, showNotification]
  );

  // Set up wallet event listeners
  useEffect(() => {
    if (typeof window === 'undefined' || !window.ethereum) return;

    const ethereum = window.ethereum as ethers.Eip1193Provider & {
      on?: (event: string, callback: (...args: unknown[]) => void) => void;
      removeListener?: (event: string, callback: (...args: unknown[]) => void) => void;
    };

    if (ethereum.on && ethereum.removeListener) {
      const accountsHandler = (accounts: unknown) => {
        handleAccountsChanged(accounts as string[]);
      };

      const chainHandler = (chainId: unknown) => {
        handleChainChanged(chainId as string);
      };

      ethereum.on('accountsChanged', accountsHandler);
      ethereum.on('chainChanged', chainHandler);

      // Cleanup listeners on unmount
      return () => {
        ethereum.removeListener?.('accountsChanged', accountsHandler);
        ethereum.removeListener?.('chainChanged', chainHandler);
      };
    }
  }, [handleAccountsChanged, handleChainChanged]);

  // Sync address from signer on mount/change
  useEffect(() => {
    if (signer) {
      signer.getAddress().then(setAddress).catch(() => setAddress(null));
    }
  }, [signer]);

  return (
    <>
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
                backgroundColor: theme.palette.primary.main,
              }}
              onClick={handleConnectWallet}
            >
              <VpnKeyIcon sx={{ color: '#fff' }} />
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
                color: theme.palette.secondary.main,
                display: { xs: 'none', md: 'flex' },
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
                color: theme.palette.secondary.main,
                display: { xs: 'none', md: 'flex' },
              }}
            >
              Disconnect
            </Button>

            <IconButton
              sx={{
                display: { xs: 'flex', md: 'none' },
                ml: 1,
                backgroundColor: theme.palette.primary.main,
              }}
              onClick={goToControlPanel}
            >
              <WalletIcon sx={{ color: '#fff' }} />
            </IconButton>

            <IconButton
              sx={{
                display: { xs: 'flex', md: 'none' },
                ml: 1,
                backgroundColor: theme.palette.primary.main,
              }}
              onClick={handleLogout}
            >
              <ExitToAppIcon sx={{ color: '#fff' }} />
            </IconButton>
          </>
        )}
      </Box>

      {/* Notification Snackbar (replaces alert()) */}
      <Snackbar
        open={notification.open}
        autoHideDuration={5000}
        onClose={hideNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={hideNotification} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </>
  );
}
