'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { useActionStore } from '@/store/store';
import { useWalletContext } from '@/providers/WalletProvider';
import theme from '@/theme/theme';

interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

export default function ProtectedRoute({ children, redirectTo = '/' }: ProtectedRouteProps) {
  const router = useRouter();
  const { walletConnected, walletAdresse } = useActionStore();
  const { isInitialized, isConnecting } = useWalletContext();

  // Redirect if not connected after initialization
  useEffect(() => {
    if (isInitialized && !walletConnected && !isConnecting) {
      // Small delay to allow for auto-connect to complete
      const timeout = setTimeout(() => {
        if (!useActionStore.getState().walletConnected) {
          router.push(redirectTo);
        }
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [isInitialized, walletConnected, isConnecting, router, redirectTo]);

  // Show loading while checking wallet status
  if (!isInitialized || isConnecting) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        }}
      >
        <CircularProgress size={60} sx={{ color: theme.palette.primary.main, mb: 3 }} />
        <Typography variant="h6" sx={{ color: 'white' }}>
          Connecting to wallet...
        </Typography>
      </Box>
    );
  }

  // Show connect prompt if not connected
  if (!walletConnected || !walletAdresse) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          px: 3,
        }}
      >
        <Box
          sx={{
            p: 6,
            background: 'linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
            backdropFilter: 'blur(20px)',
            borderRadius: 4,
            border: '1px solid rgba(255,255,255,0.2)',
            textAlign: 'center',
            maxWidth: 450,
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 3,
            }}
          >
            <LockIcon sx={{ fontSize: 40, color: 'white' }} />
          </Box>

          <Typography variant="h5" sx={{ color: 'white', fontWeight: 700, mb: 2 }}>
            Wallet Required
          </Typography>

          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.7)', mb: 4 }}>
            Connect your wallet to access the Control Panel and manage your LND tokens.
          </Typography>

          <Button
            variant="contained"
            size="large"
            startIcon={<AccountBalanceWalletIcon />}
            onClick={() => router.push('/')}
            sx={{
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
              borderRadius: 3,
              textTransform: 'none',
              '&:hover': {
                background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
              },
            }}
          >
            Go to Home & Connect
          </Button>
        </Box>
      </Box>
    );
  }

  return <>{children}</>;
}
