'use client';

import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  IconButton,
  Tooltip,
  Divider,
} from '@mui/material';
import { motion } from 'framer-motion';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import RefreshIcon from '@mui/icons-material/Refresh';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import { useActionStore } from '@/store/store';
import { useDistributions } from '@/hooks/useDistributions';
import { formatTokenAmount, formatAddress } from '@/utils/formatters';
import { getExplorerUrl } from '@/utils/constants';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import HolderPanel from '@/components/HolderPanel';
import ERC20Actions from '@/components/ERC20Actions';
import Toast from '@/components/common/Toast';
import { useToast } from '@/hooks/useToast';
import theme from '@/theme/theme';

function ControlPanelContent() {
  const [copied, setCopied] = useState(false);

  const { walletAdresse, chainId } = useActionStore();
  const { balance, distributions, loading, refresh } = useDistributions(walletAdresse);
  const { toast, showSuccess, hideToast } = useToast();

  const explorerUrl = useMemo(() => getExplorerUrl(chainId), [chainId]);

  const handleCopyAddress = async () => {
    if (walletAdresse) {
      await navigator.clipboard.writeText(walletAdresse);
      setCopied(true);
      showSuccess('Address copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRefresh = () => {
    refresh();
  };

  const totalUnclaimed = useMemo(() => {
    return distributions.reduce((acc, d) => acc + BigInt(d.userShare), BigInt(0));
  }, [distributions]);

  const stats = useMemo(() => [
    {
      label: 'Your Balance',
      value: balance ? `${formatTokenAmount(balance)} LND` : '0 LND',
      icon: <AccountBalanceWalletIcon />,
      color: theme.palette.primary.main,
    },
    {
      label: 'Unclaimed Profits',
      value: totalUnclaimed > BigInt(0) ? `${formatTokenAmount(totalUnclaimed.toString())} LND` : '0 LND',
      icon: <LocalAtmIcon />,
      color: '#4CAF50',
    },
    {
      label: 'Distributions',
      value: distributions.length.toString(),
      icon: <SwapHorizIcon />,
      color: '#2196F3',
    },
  ], [balance, totalUnclaimed, distributions.length]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        pt: { xs: 10, md: 12 },
        pb: 6,
        px: { xs: 2, md: 4 },
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      }}
    >
      {/* Header Section */}
      <Box sx={{ maxWidth: 1400, mx: 'auto', mb: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 4 },
              background: 'linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
              backdropFilter: 'blur(20px)',
              borderRadius: 4,
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                justifyContent: 'space-between',
                alignItems: { xs: 'flex-start', md: 'center' },
                gap: 2,
              }}
            >
              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: 'white',
                    mb: 1,
                    background: `linear-gradient(90deg, ${theme.palette.primary.main}, #4CAF50)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Control Panel
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                  <Chip
                    icon={<AccountBalanceWalletIcon sx={{ fontSize: 16 }} />}
                    label={formatAddress(walletAdresse)}
                    size="small"
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.1)',
                      color: 'white',
                      '& .MuiChip-icon': { color: theme.palette.primary.main },
                      cursor: 'pointer',
                    }}
                    onClick={() => window.open(`${explorerUrl}/address/${walletAdresse}`, '_blank')}
                  />
                  <Tooltip title={copied ? 'Copied!' : 'Copy address'}>
                    <IconButton size="small" onClick={handleCopyAddress} sx={{ color: 'rgba(255,255,255,0.7)' }}>
                      {copied ? <CheckIcon fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
                    </IconButton>
                  </Tooltip>
                  {chainId && (
                    <Chip
                      label={`Chain ID: ${chainId}`}
                      size="small"
                      sx={{ bgcolor: 'rgba(33,150,243,0.2)', color: '#64B5F6' }}
                    />
                  )}
                </Box>
              </Box>
              <Tooltip title="Refresh data">
                <IconButton
                  onClick={handleRefresh}
                  disabled={loading}
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
                  }}
                >
                  <RefreshIcon sx={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
                </IconButton>
              </Tooltip>
            </Box>

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mt: 3 }}>
              {stats.map((stat, index) => (
                <Grid key={stat.label} size={{ xs: 12, md: 4 }}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Box
                      sx={{
                        p: 3,
                        borderRadius: 3,
                        background: `linear-gradient(135deg, ${stat.color}20, ${stat.color}10)`,
                        border: `1px solid ${stat.color}40`,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                      }}
                    >
                      <Box
                        sx={{
                          width: 50,
                          height: 50,
                          borderRadius: 2,
                          bgcolor: `${stat.color}30`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: stat.color,
                        }}
                      >
                        {stat.icon}
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 0.5 }}>
                          {stat.label}
                        </Typography>
                        <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                          {loading ? '...' : stat.value}
                        </Typography>
                      </Box>
                    </Box>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </motion.div>
      </Box>

      {/* Main Content */}
      <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
        <Grid container spacing={4}>
          {/* Distributions Section */}
          <Grid size={12}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, md: 4 },
                  background: 'linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: 4,
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <HolderPanel />
              </Paper>
            </motion.div>
          </Grid>

          {/* Divider */}
          <Grid size={12}>
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
          </Grid>

          {/* Token Actions Section */}
          <Grid size={12}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, md: 4 },
                  background: 'linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: 4,
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <ERC20Actions onActionComplete={refresh} />
              </Paper>
            </motion.div>
          </Grid>
        </Grid>
      </Box>

      <Toast toast={toast} onClose={hideToast} />

      {/* CSS for refresh animation */}
      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </Box>
  );
}

export default function ControlPanel() {
  return (
    <ProtectedRoute>
      <ErrorBoundary>
        <ControlPanelContent />
      </ErrorBoundary>
    </ProtectedRoute>
  );
}
