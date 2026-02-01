'use client';

import { useState, useMemo } from 'react';
import { Box, Typography, Divider, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import { useActionStore } from '@/store/store';
import { useDistributions } from '@/hooks/useDistributions';
import { useContract } from '@/hooks/useContract';
import { useToast } from '@/hooks/useToast';
import { Distribution } from '@/types';
import { formatTokenAmount, formatAddress } from '@/utils/formatters';
import DistributionCard from '@/components/holder/DistributionCard';
import ClaimAllButton from '@/components/holder/ClaimAllButton';
import Toast from '@/components/common/Toast';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import theme from '@/theme/theme';

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: 'easeOut' },
};

// Type guard for errors
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
    balance,
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

      // Refresh data after successful claim
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

  // Render content based on state
  const renderDistributions = () => {
    if (loading) {
      return <LoadingSpinner message="Loading distributions..." />;
    }

    if (error) {
      return (
        <Typography color="error" sx={{ mt: 2 }}>
          Error: {error}
        </Typography>
      );
    }

    if (activeDistributions.length === 0) {
      return (
        <Typography
          variant="body1"
          sx={{ mt: 2, mb: 2, color: 'rgba(255,255,255,0.8)', textAlign: 'center' }}
        >
          No unclaimed profits found. New distributions might be coming soon!
        </Typography>
      );
    }

    return (
      <>
        <ClaimAllButton
          count={activeDistributions.length}
          onClaimAll={handleClaimAll}
          disabled={!walletAddress || isAnyClaiming}
          isProcessing={isBatchClaiming}
          progress={batchProgress}
        />

        <Grid container spacing={3} justifyContent="center" sx={{ width: '100%' }}>
          {activeDistributions.map((dist) => (
            <Grid key={dist.id}>
              <DistributionCard
                distribution={dist}
                claimStatus={claimStatuses.get(dist.id) || { distributionId: dist.id, status: 'idle' }}
                onClaim={handleClaim}
                disabled={!walletAddress || (isAnyClaiming && claimStatuses.get(dist.id)?.status === 'idle')}
              />
            </Grid>
          ))}
        </Grid>
      </>
    );
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
          borderRadius: '5px 5px 0 0',
        },
      }}
    >
      <motion.div initial="initial" animate="animate" variants={fadeInUp}>
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold', color: 'white' }}>
          Holder Dashboard
        </Typography>

        <Box sx={{ alignSelf: 'flex-start', width: '100%', textAlign: 'left', mb: 2 }}>
          <Typography variant="body1" sx={{ mb: 1 }}>
            Connected Wallet:{' '}
            <strong>{walletAddress ? formatAddress(walletAddress) : 'Not Connected'}</strong>
          </Typography>

          <Typography variant="body1" sx={{ mb: 1 }}>
            Your LND Balance:{' '}
            <strong>
              {loading ? (
                'Loading...'
              ) : error ? (
                <span style={{ color: '#ff6b6b' }}>{error}</span>
              ) : (
                `${balance ? formatTokenAmount(balance) : '0'} LND`
              )}
            </strong>
          </Typography>
        </Box>

        <Divider sx={{ width: '100%', my: 2, borderColor: 'rgba(255,255,255,0.2)' }} />

        <Typography
          variant="h5"
          sx={{ mb: 2, fontWeight: 'bold', color: 'white', textAlign: 'center', width: '100%' }}
        >
          Available Distributions
        </Typography>

        {renderDistributions()}
      </motion.div>

      <Toast toast={toast} onClose={hideToast} />
    </Box>
  );
}

export default function HolderPanel() {
  return (
    <ErrorBoundary>
      <HolderPanelContent />
    </ErrorBoundary>
  );
}
