'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { ethers } from 'ethers';
import {
  Button,
  Box,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import theme from '../theme/theme';
import { useActionStore } from '@/store/store';
import { useWalletContext } from '@/providers/WalletProvider';
import { useRouter } from 'next/navigation';
import { formatAddress } from '@/utils/formatters';
import { getExplorerUrl } from '@/utils/constants';

interface WalletNotification {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'info' | 'warning';
}

export default function WalletConnectButton() {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { isInitialized, isConnecting: autoConnecting } = useWalletContext();

  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const { signer, chainId, setWalletConnected, setWalletDisconnected, setChainId } = useActionStore();

  const addressRef = useRef<string | null>(null);
  addressRef.current = address;

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

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = useCallback((): void => {
    setWalletDisconnected();
    router.push('/');
    setAddress(null);
    handleMenuClose();
  }, [setWalletDisconnected, router]);

  const goToControlPanel = useCallback((): void => {
    router.push('/control');
    handleMenuClose();
  }, [router]);

  const handleCopyAddress = useCallback(async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      showNotification('Address copied!', 'success');
    }
    handleMenuClose();
  }, [address, showNotification]);

  const handleViewOnExplorer = useCallback(() => {
    if (address) {
      const explorerUrl = getExplorerUrl(chainId);
      window.open(`${explorerUrl}/address/${address}`, '_blank');
    }
    handleMenuClose();
  }, [address, chainId]);

  const handleConnectWallet = useCallback(async (): Promise<void> => {
    if (typeof window === 'undefined' || !window.ethereum) {
      showNotification('MetaMask not available. Please install it.', 'error');
      return;
    }

    setIsConnecting(true);

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const newSigner = await provider.getSigner();

      await setWalletConnected(newSigner);

      const addr = await newSigner.getAddress();
      setAddress(addr);
      showNotification('Wallet connected!', 'success');
      goToControlPanel();
    } catch (err) {
      console.error('Error connecting wallet:', err);
      showNotification('Failed to connect wallet.', 'error');
    } finally {
      setIsConnecting(false);
    }
  }, [setWalletConnected, goToControlPanel, showNotification]);

  const handleAccountsChanged = useCallback(
    async (accounts: string[]) => {
      if (accounts.length === 0) {
        handleLogout();
        showNotification('Wallet disconnected', 'info');
      } else if (accounts[0] !== addressRef.current) {
        try {
          if (typeof window !== 'undefined' && window.ethereum) {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const newSigner = await provider.getSigner();
            await setWalletConnected(newSigner);
            setAddress(accounts[0]);
            showNotification(`Switched to ${formatAddress(accounts[0])}`, 'success');
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

  const handleChainChanged = useCallback(
    async (chainIdHex: string) => {
      try {
        const newChainId = parseInt(chainIdHex, 16);
        setChainId(newChainId);

        if (typeof window !== 'undefined' && window.ethereum && addressRef.current) {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const newSigner = await provider.getSigner();
          await setWalletConnected(newSigner);
          showNotification(`Switched to chain ${newChainId}`, 'info');
        }
      } catch (err) {
        console.error('Error handling chain change:', err);
        showNotification('Failed to handle chain change', 'error');
      }
    },
    [setChainId, setWalletConnected, showNotification]
  );

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

      return () => {
        ethereum.removeListener?.('accountsChanged', accountsHandler);
        ethereum.removeListener?.('chainChanged', chainHandler);
      };
    }
  }, [handleAccountsChanged, handleChainChanged]);

  useEffect(() => {
    if (signer) {
      signer.getAddress().then(setAddress).catch(() => setAddress(null));
    }
  }, [signer]);

  const showLoading = !isInitialized || autoConnecting || isConnecting;

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {showLoading ? (
          <CircularProgress size={24} sx={{ color: theme.palette.primary.main, mx: 2 }} />
        ) : !address ? (
          <>
            {/* Desktop Connect Button */}
            <Button
              variant="contained"
              onClick={handleConnectWallet}
              startIcon={<AccountBalanceWalletIcon />}
              sx={{
                display: { xs: 'none', md: 'flex' },
                ml: 2,
                fontWeight: 600,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                '&:hover': {
                  background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                },
              }}
            >
              Connect Wallet
            </Button>

            {/* Mobile Connect Button */}
            <IconButton
              onClick={handleConnectWallet}
              sx={{
                display: { xs: 'flex', md: 'none' },
                ml: 1,
                bgcolor: theme.palette.primary.main,
                '&:hover': { bgcolor: theme.palette.primary.dark },
              }}
            >
              <VpnKeyIcon sx={{ color: '#fff' }} />
            </IconButton>
          </>
        ) : (
          <>
            {/* Connected State - Desktop */}
            <Button
              variant="outlined"
              onClick={handleMenuOpen}
              startIcon={<AccountBalanceWalletIcon />}
              sx={{
                display: { xs: 'none', md: 'flex' },
                ml: 2,
                fontWeight: 600,
                borderColor: theme.palette.primary.main,
                color: theme.palette.primary.main,
                '&:hover': {
                  borderColor: theme.palette.primary.light,
                  bgcolor: 'rgba(29, 205, 159, 0.1)',
                },
              }}
            >
              {formatAddress(address)}
            </Button>

            {/* Connected State - Mobile */}
            <IconButton
              onClick={handleMenuOpen}
              sx={{
                display: { xs: 'flex', md: 'none' },
                ml: 1,
                bgcolor: theme.palette.primary.main,
                '&:hover': { bgcolor: theme.palette.primary.dark },
              }}
            >
              <AccountBalanceWalletIcon sx={{ color: '#fff' }} />
            </IconButton>

            {/* Dropdown Menu */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              PaperProps={{
                sx: {
                  mt: 1,
                  minWidth: 200,
                  bgcolor: '#1a1a2e',
                  border: '1px solid rgba(255,255,255,0.1)',
                  '& .MuiMenuItem-root': {
                    color: 'white',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
                  },
                },
              }}
            >
              <MenuItem onClick={goToControlPanel}>
                <ListItemIcon>
                  <DashboardIcon sx={{ color: theme.palette.primary.main }} />
                </ListItemIcon>
                <ListItemText>Control Panel</ListItemText>
              </MenuItem>

              <MenuItem onClick={handleCopyAddress}>
                <ListItemIcon>
                  <ContentCopyIcon sx={{ color: 'rgba(255,255,255,0.7)' }} />
                </ListItemIcon>
                <ListItemText>Copy Address</ListItemText>
              </MenuItem>

              <MenuItem onClick={handleViewOnExplorer}>
                <ListItemIcon>
                  <OpenInNewIcon sx={{ color: 'rgba(255,255,255,0.7)' }} />
                </ListItemIcon>
                <ListItemText>View on Explorer</ListItemText>
              </MenuItem>

              <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', my: 1 }} />

              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon sx={{ color: '#ff6b6b' }} />
                </ListItemIcon>
                <ListItemText sx={{ '& .MuiTypography-root': { color: '#ff6b6b' } }}>
                  Disconnect
                </ListItemText>
              </MenuItem>
            </Menu>
          </>
        )}
      </Box>

      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
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
