'use client';

import { useState, useMemo } from 'react';
import { Box, Typography, Grid, Alert } from '@mui/material';
import { motion } from 'framer-motion';
import { useActionStore } from '@/store/store';
import { useDistributions } from '@/hooks/useDistributions';
import { useContract } from '@/hooks/useContract';
import { useToast } from '@/hooks/useToast';
import { Distribution } from '@/types';
import DistributionCard from '@/components/holder/DistributionCard';
import ClaimAllButton from '@/components/holder/ClaimAllButton';
import Toast from '@/components/common/Toast';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorBoundary from '@/components/common/ErrorBoundary';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: 'easeOut' },
};

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unknown error occurred';
}

function HolderPanelContent() {
  const walletAddress = useActionStore((state) => state.walletAdresse);
  const {
    distributions,
    claimStatuses,
    loading,
    error,
    refresh,
    fetchSignature,
    updateClaimStatus,
    isAnyClaiming,
  } = useDistributions(walletAddress);
  const { claimProfit } = useContract();
  const { toast, showSuccess, showError, showPending, hideToast } = useToast();

  const [batchProgress, setBatchProgress] = useState<{ current: number; total: number } | undefined>();
  const [isBatchClaiming, setIsBatchClaiming] = useState(false);

  const handleClaim = async (distribution: Distribution) => {
    const { id } = distribution;

    try {
      updateClaimStatus(id, { status: 'signing' });
      showPending('Getting signature...');

      const signature = await fetchSignature(distribution);

      updateClaimStatus(id, { status: 'pending' });
      showPending('Confirming transaction...');

      const txHash = await claimProfit(
        id,
        distribution.userBalanceAtDistributionBlock,
        signature
      );

      updateClaimStatus(id, { status: 'success', txHash });
      showSuccess('Profit claimed successfully!', txHash);

      setTimeout(() => refresh(), 2000);
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      updateClaimStatus(id, { status: 'error', error: errorMessage });
      showError(errorMessage);
    }
  };

  const handleClaimAll = async () => {
    const unclaimedDistributions = distributions.filter(
      (d) => claimStatuses.get(d.id)?.status !== 'success'
    );

    if (unclaimedDistributions.length === 0) return;

    setIsBatchClaiming(true);
    setBatchProgress({ current: 0, total: unclaimedDistributions.length });

    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < unclaimedDistributions.length; i++) {
      const distribution = unclaimedDistributions[i];
      setBatchProgress({ current: i + 1, total: unclaimedDistributions.length });

      try {
        updateClaimStatus(distribution.id, { status: 'signing' });
        const signature = await fetchSignature(distribution);

        updateClaimStatus(distribution.id, { status: 'pending' });
        const txHash = await claimProfit(
          distribution.id,
          distribution.userBalanceAtDistributionBlock,
          signature
        );

        updateClaimStatus(distribution.id, { status: 'success', txHash });
        successCount++;
      } catch (err) {
        const errorMessage = getErrorMessage(err);
        updateClaimStatus(distribution.id, { status: 'error', error: errorMessage });
        failCount++;
      }
    }

    setIsBatchClaiming(false);
    setBatchProgress(undefined);

    if (failCount === 0) {
      showSuccess(`Successfully claimed ${successCount} distributions!`);
    } else {
      showError(`Claimed ${successCount}, failed ${failCount}. Check individual cards for details.`);
    }

    setTimeout(() => refresh(), 2000);
  };

  const activeDistributions = useMemo(
    () => distributions.filter((d) => claimStatuses.get(d.id)?.status !== 'success'),
    [distributions, claimStatuses]
  );

  if (loading) {
    return (
      <Box sx={{ py: 6 }}>
        <LoadingSpinner message="Loading distributions..." />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  if (activeDistributions.length === 0) {
    return (
      <motion.div initial="initial" animate="animate" variants={fadeInUp}>
        <Box
          sx={{
            py: 8,
            textAlign: 'center',
            background: 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
            borderRadius: 3,
            border: '1px dashed rgba(255,255,255,0.2)',
          }}
        >
          <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.7)', mb: 1 }}>
            No Unclaimed Distributions
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
            New profit distributions will appear here when available.
          </Typography>
        </Box>
      </motion.div>
    );
  }

  return (
    <motion.div initial="initial" animate="animate" variants={fadeInUp}>
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, color: 'white', mb: 2 }}>
          Claim Your Profits
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
          You have {activeDistributions.length} unclaimed distribution{activeDistributions.length !== 1 ? 's' : ''}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <ClaimAllButton
          count={activeDistributions.length}
          onClaimAll={handleClaimAll}
          disabled={!walletAddress || isAnyClaiming}
          isProcessing={isBatchClaiming}
          progress={batchProgress}
        />
      </Box>

      <Grid container spacing={3} justifyContent="center">
        {activeDistributions.map((dist) => (
          <Grid key={dist.id} size={{ xs: 12, sm: 6, lg: 4 }}>
            <DistributionCard
              distribution={dist}
              claimStatus={claimStatuses.get(dist.id) || { distributionId: dist.id, status: 'idle' }}
              onClaim={handleClaim}
              disabled={!walletAddress || (isAnyClaiming && claimStatuses.get(dist.id)?.status === 'idle')}
            />
          </Grid>
        ))}
      </Grid>

      <Toast toast={toast} onClose={hideToast} />
    </motion.div>
  );
}

export default function HolderPanel() {
  return (
    <ErrorBoundary>
      <HolderPanelContent />
    </ErrorBoundary>
  );
}
