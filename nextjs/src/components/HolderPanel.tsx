'use client';

import { Box, Typography, Button, Divider } from '@mui/material';
import { useEffect, useState } from 'react';
import theme from '../theme/theme';
import { useActionStore } from '@/store/store';

const HolderPanel = () => {
  const walletAdresse = useActionStore((state) => state.walletAdresse);
  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!walletAdresse) return;

      setLoading(true);
      try {
        const res = await fetch(`/api/balance?userAddress=${walletAdresse}`);
        if (!res.ok) throw new Error('Fehler beim Abrufen des Guthabens');
        const data = await res.json();
        setBalance(data.balance);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [walletAdresse]);

  return (
    <Box
      id="holder-panel"
      sx={{
        mt: 12,
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        borderRadius: 4,
        boxShadow: 3,
        width: { xs: '90%', md: '50%' },
        mx: 'auto',
        bgcolor: theme.palette.background.default + 'B3',
      }}
    >
      <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold', color: theme.palette.primary.main }}>
        ⚙️ Holder Dashboard
      </Typography>

      <Box sx={{ alignSelf: 'flex-start' }}>
        <Typography variant="body1" sx={{ mb: 1 }}>
          🔐 Connected Wallet: <strong>{walletAdresse}</strong>
        </Typography>

        <Typography variant="body1" sx={{ mb: 1 }}>
          💰 Your LND Balance:{' '}
          <strong>
            {loading ? '⏳ loading...' : error ? `❌ ${error}` : `${balance} LND`}
          </strong>
        </Typography>
      </Box>

      <Divider sx={{ width: '100%', my: 2 }} />

      <Button variant="outlined" color="secondary">
        View Distribution History
      </Button>

    </Box>
  );
};

export default HolderPanel;
