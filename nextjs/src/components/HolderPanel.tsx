'use client';

import { Box, Typography, Button, Divider, Paper, Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import theme from '../theme/theme';
import { useActionStore } from '@/store/store';
import { ethers } from 'ethers';

// Define an interface for the distribution data received from your API
interface DistributionInfo {
  id: string; // The distribution ID (index)
  totalAmount: string; // Total profit distributed
  distributionDate: string; // ISO string date
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
        
        // Keep balance as the raw string from the API
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
        alignItems: 'center', // This centers direct children horizontally
        borderRadius: 4,
        boxShadow: 3,
        width: { xs: '90%', md: '80%' },
        mx: 'auto',
        bgcolor: theme.palette.background.default + 'B3',
      }}
    >
      <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold', color: theme.palette.primary.main }}>
        ⚙️ Holder Dashboard
      </Typography>

      <Box sx={{ alignSelf: 'flex-start', width: '100%' }}>
        <Typography variant="body1" sx={{ mb: 1 }}>
          🔐 Connected Wallet: <strong>{walletAdresse || 'Not Connected'}</strong>
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
          textAlign: 'center', // ADDED: Centers the text of this Typography component
          width: '100%' // Ensure it takes full width to center effectively
        }}
      >
        🎁 Available Distributions
      </Typography>

      {loading ? (
        <Typography>⏳ Loading distributions...</Typography>
      ) : error ? (
        <Typography color="error">❌ Error: {error}</Typography>
      ) : availableDistributions.length === 0 ? (
        <Typography>No unclaimed distributions available for you.</Typography>
      ) : (
        <Grid
          container
          spacing={2}
          justifyContent="center" // ADDED: Centers items within the grid
          sx={{ width: '100%' }}
        >
          {availableDistributions.map((dist) => (
            <Grid item xs={12} sm={6} md={4} key={dist.id}>
              <Paper sx={{ p: 2, bgcolor: theme.palette.background.paper, boxShadow: 1, height: '100%' }}>
                <Typography variant="h6" sx={{ mb: 1, color: theme.palette.primary.light, fontSize: '1rem' }}>
                  Distribution ID: {dist.id}
                </Typography>
                <Typography variant="body2">
                  Total Distributed: <strong>{ethers.formatUnits(dist.totalAmount, 18)} LND</strong>
                </Typography>
                <Typography variant="body2">
                  Distribution Date: <strong>{new Date(dist.distributionDate).toLocaleDateString()}</strong> (Block: {dist.distributionBlock})
                </Typography>
                <Typography variant="body2">
                  Your Balance at Dist. Time: <strong>{ethers.formatUnits(dist.userBalanceAtDistributionBlock, 18)} LND</strong>
                </Typography>
                <Typography variant="body1" sx={{ mt: 1, fontWeight: 'bold', color: theme.palette.success.main, fontSize: '1.1rem' }}>
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
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default HolderPanel;