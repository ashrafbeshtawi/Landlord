'use client';

import { Box, Typography, Button, Divider, Grid, Card, CardContent } from '@mui/material';
import { useEffect, useState } from 'react';
import theme from '../theme/theme';
import { useActionStore } from '@/store/store';
import { ethers } from 'ethers';
import LandLordToken from '@/LandLordToken.json';
import { motion } from 'framer-motion';

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
    try {
      if (!window.ethereum) {
        throw new Error("MetaMask is not installed.");
      }
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '';
      const contract = new ethers.Contract(contractAddress, LandLordToken.abi, signer);

      // Fetch the signature from the backend
      const signatureResponse = await fetch('/api/signature', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userAddress: walletAdresse,
          distributionId: distribution.id,
          balanceAtDistribution: distribution.userBalanceAtDistributionBlock,
        }),
      });

      if (!signatureResponse.ok) {
        throw new Error('Failed to get signature from backend.');
      }

      const { signature } = await signatureResponse.json();

      const tx = await contract.claimProfit(
        distribution.id,
        distribution.userBalanceAtDistributionBlock,
        signature
      );
      await tx.wait();
      alert('Profit claimed successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to claim profit.');
    }
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: "easeOut" }
  };

  return (
    <Box
      id="holder-panel"
      sx={{
        p: { xs: 4, md: 6 },
        background: 'linear-gradient(145deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 100%)',
        backdropFilter: 'blur(25px)',
        border: '1px solid rgba(255,255,255,0.25)',
        borderRadius: 5,
        boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'center',
        width: { xs: '90%', md: '80%' },
        mx: 'auto',
        mt: 12,
        color: 'white',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: `linear-gradient(90deg, ${theme.palette.primary.main}, #4CAF50, #2196F3)`,
          borderRadius: '5px 5px 0 0'
        }
      }}
    >
      <motion.div initial="initial" animate="animate" variants={fadeInUp}>
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold', color: 'white' }}>
          ⚙️ Holder Dashboard
        </Typography>

        <Box sx={{ alignSelf: 'flex-start', width: '100%', textAlign: 'left', mb: 2 }}>
          <Typography variant="body1" sx={{ mb: 1 }}>
            🔐 Connected Wallet: <strong>{walletAdresse ? `${walletAdresse.slice(0, 6)}…${walletAdresse.slice(-4)}` : 'Not Connected'}</strong>
          </Typography>

          <Typography variant="body1" sx={{ mb: 1 }}>
            💰 Your LND Balance:{' '}
            <strong>
              {loading ? '⏳ loading...' : error ? `❌ ${error}` : `${balance ? ethers.formatUnits(balance, 18) : '0'} LND`}
            </strong>
          </Typography>
        </Box>

        <Divider sx={{ width: '100%', my: 2, borderColor: 'rgba(255,255,255,0.2)' }} />

        <Typography
          variant="h5"
          sx={{
            mb: 2,
            fontWeight: 'bold',
            color: 'white',
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
          <Typography variant="body1" sx={{ mt: 2, mb: 2, color: 'rgba(255,255,255,0.8)', textAlign: 'center' }}>
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
              <Grid key={dist.id}>
                <Card
                  sx={{
                    background: 'linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                    backdropFilter: 'blur(15px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: 3,
                    height: '100%',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: '0 15px 30px rgba(0,0,0,0.3)',
                      border: '1px solid rgba(255,255,255,0.3)'
                    }
                  }}
                >
                  <CardContent sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ mb: 1, color: 'white', fontSize: '1.1rem' }}>
                      Distribution ID: {dist.id}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.8)' }}>
                      Total Distributed: <strong>{ethers.formatUnits(dist.totalAmount, 18)} LND</strong>
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.8)' }}>
                      Distribution Date: <strong>{new Date(Number(dist.distributionDate) * 1000).toLocaleDateString()}</strong> (Block: {dist.distributionBlock})
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.8)' }}>
                      Your Balance at Dist. Time: <strong>{ethers.formatUnits(dist.userBalanceAtDistributionBlock, 18)} LND</strong>
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1, fontWeight: 'bold', color: 'white', fontSize: '1.2rem' }}>
                      Your Estimated Share: <strong>{ethers.formatUnits(dist.userShare, 18)} LND</strong>
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={() => handleCollectProfit(dist)}
                      disabled={!walletAdresse}
                      fullWidth
                      sx={{
                        mt: 2,
                        background: `linear-gradient(45deg, ${theme.palette.primary.main}, #4CAF50)`,
                        px: 4,
                        py: 1.5,
                        fontSize: '1rem',
                        fontWeight: 600,
                        borderRadius: 3,
                        textTransform: 'none',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                        '&:hover': {
                          background: `linear-gradient(45deg, ${theme.palette.primary.dark}, #45a049)`,
                          transform: 'translateY(-2px)',
                          boxShadow: '0 15px 30px rgba(0,0,0,0.4)'
                        }
                      }}
                    >
                      Collect Profit
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </motion.div>
    </Box>
  );
};

export default HolderPanel;
