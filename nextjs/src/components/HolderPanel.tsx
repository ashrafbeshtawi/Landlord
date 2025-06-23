'use client';

import { Box, Typography, Button, Divider, Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import theme from '../theme/theme';
import { useActionStore } from '@/store/store';
import { ethers } from 'ethers';

// Define an interface for the distribution data received from your API
interface DistributionInfo {
  id: string; // The distribution ID (index)
  totalAmount: string; // Total profit distributed
  distributionDate: string; // ISO string date (Unix timestamp as string)
  distributionBlock: string; // Block number of distribution
  tokensExcludingOwner: string; // Total supply minus owner ownerBalance at distribution time
  userBalanceAtDistributionBlock: string; // User's balance at the distribution block
  userShare: string; // Calculated share for the user
}

const HolderPanel = () => {
  const walletAdresse = useActionStore((state) => state.walletAdresse);

  const [balance, setBalance] = useState<string | null>(null);
  const [availableDistributions, setAvailableDistributions] = useState<DistributionInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPanelData = async () => {
      if (!walletAdresse) {
        setBalance(null);
        setAvailableDistributions([]);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/balance?userAddress=${walletAdresse}`);
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.details || 'Failed to fetch panel data');
        }
        const data = await res.json();
        
        setBalance(data.balance); 
        
        setAvailableDistributions(data.availableDistributions || []);

      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchPanelData();
  }, [walletAdresse]);

  const handleCollectProfit = async (distribution: DistributionInfo) => {
    console.log(`Dummy Collect Profit for Distribution ID: ${distribution.id}`);
    console.log(`Amount: ${ethers.formatUnits(distribution.userShare, 18)} LND`);
    alert(`Dummy: You would collect ${ethers.formatUnits(distribution.userShare, 18)} LND for Distribution ID ${distribution.id}`);
  };

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
        width: { xs: '90%', md: '80%' },
        mx: 'auto',
        bgcolor: theme.palette.background.default + 'B3', // This is the main panel background
      }}
    >
      <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold', color: theme.palette.primary.main }}>
        ⚙️ Holder Dashboard
      </Typography>

      <Box sx={{ alignSelf: 'flex-start', width: '100%' }}>
        <Typography variant="body1" sx={{ mb: 1 }}>
          🔐 Connected Wallet: <strong>{walletAdresse.slice(0, 6)}…{walletAdresse.slice(-4) || 'Not Connected'}</strong>
        </Typography>

        <Typography variant="body1" sx={{ mb: 1 }}>
          💰 Your LND Balance:{' '}
          <strong>
            {loading ? '⏳ loading...' : error ? `❌ ${error}` : `${balance ? ethers.formatUnits(balance, 18) : '0'} LND`}
          </strong>
        </Typography>
      </Box>

      <Divider sx={{ width: '100%', my: 2 }} />

      <Typography
        variant="h5"
        sx={{
          mb: 2,
          fontWeight: 'bold',
          color: theme.palette.secondary.main,
          textAlign: 'center',
          width: '100%'
        }}
      >
        🎁 Available Distributions
      </Typography>

      {loading ? (
        <Typography>⏳ Loading distributions...</Typography>
      ) : error ? (
        <Typography color="error">❌ Error: {error}</Typography>
      ) : availableDistributions.length === 0 ? (
        // Displays message when no distributions are found
        <Typography variant="body1" sx={{ mt: 2, mb: 2, color: theme.palette.text.secondary, textAlign: 'center' }}>
          No unclaimed profits found. New distributions might be coming soon, so please check back later!
        </Typography>
      ) : (
        <Grid
          container
          spacing={2}
          justifyContent="center"
          sx={{ width: '100%' }}
        >
          {availableDistributions.map((dist) => (
            <Grid key={dist.id}> {/* Restored responsive grid properties */}
              <Box
                sx={{
                  p: 2,
                  border: '1px solid #e0e0e0',
                  boxShadow: 1,
                  height: '100%',
                  borderRadius: 2, 
                }}
              >
                <Typography variant="h6" sx={{ mb: 1, color: theme.palette.text.primary, fontSize: '1.1rem' }}>
                  Distribution ID: {dist.id}
                </Typography>
                {/* Applied secondary color and increased font size for body2 elements */}
                <Typography variant="body2" sx={{ fontSize: '0.95rem', color: theme.palette.secondary.main }}>
                  Total Distributed: <strong>{ethers.formatUnits(dist.totalAmount, 18)} LND</strong>
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '0.95rem', color: theme.palette.secondary.main }}>
                  Distribution Date: <strong>{new Date(Number(dist.distributionDate) * 1000).toLocaleDateString()}</strong> (Block: {dist.distributionBlock}) {/* Corrected date formatting */}
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '0.95rem', color: theme.palette.secondary.main }}>
                  Your Balance at Dist. Time: <strong>{ethers.formatUnits(dist.userBalanceAtDistributionBlock, 18)} LND</strong>
                </Typography>
                <Typography variant="body1" sx={{ mt: 1, fontWeight: 'bold', color: theme.palette.secondary.main, fontSize: '1.2rem' }}>
                  Your Estimated Share: <strong>{ethers.formatUnits(dist.userShare, 18)} LND</strong>
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                  onClick={() => handleCollectProfit(dist)}
                  disabled={!walletAdresse}
                  fullWidth
                >
                  Collect Profit (Dummy)
                </Button>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default HolderPanel;