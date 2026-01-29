'use client';

import { Card, CardContent, Typography, Button, CircularProgress, Box } from '@mui/material';
import { Distribution, ClaimStatus } from '@/types';
import { formatTokenAmount, formatDate } from '@/utils/formatters';
import theme from '@/theme/theme';

interface DistributionCardProps {
  distribution: Distribution;
  claimStatus: ClaimStatus;
  onClaim: (distribution: Distribution) => void;
  disabled: boolean;
}

export default function DistributionCard({
  distribution,
  claimStatus,
  onClaim,
  disabled,
}: DistributionCardProps) {
  const isProcessing = claimStatus.status === 'signing' || claimStatus.status === 'pending';
  const isSuccess = claimStatus.status === 'success';

  const getButtonContent = () => {
    switch (claimStatus.status) {
      case 'signing':
        return (
          <>
            <CircularProgress size={16} sx={{ mr: 1, color: 'white' }} />
            Getting Signature...
          </>
        );
      case 'pending':
        return (
          <>
            <CircularProgress size={16} sx={{ mr: 1, color: 'white' }} />
            Confirming...
          </>
        );
      case 'success':
        return 'Claimed!';
      case 'error':
        return 'Retry Claim';
      default:
        return 'Collect Profit';
    }
  };

  if (isSuccess) {
    return null; // Hide claimed distributions
  }

  return (
    <Card
      sx={{
        background: 'linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        backdropFilter: 'blur(15px)',
        border: claimStatus.status === 'error'
          ? '1px solid rgba(255,0,0,0.5)'
          : '1px solid rgba(255,255,255,0.2)',
        borderRadius: 3,
        minWidth: 280,
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 15px 30px rgba(0,0,0,0.3)',
          border: '1px solid rgba(255,255,255,0.3)',
        },
      }}
    >
      <CardContent sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" sx={{ mb: 1, color: 'white', fontSize: '1.1rem' }}>
          Distribution #{distribution.id}
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', mb: 0.5 }}>
            Total Pool
          </Typography>
          <Typography variant="body1" sx={{ color: 'white', fontWeight: 600 }}>
            {formatTokenAmount(distribution.totalAmount)} LND
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', mb: 0.5 }}>
            Date
          </Typography>
          <Typography variant="body1" sx={{ color: 'white' }}>
            {formatDate(distribution.distributionDate)}
          </Typography>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', mb: 0.5 }}>
            Your Balance at Distribution
          </Typography>
          <Typography variant="body1" sx={{ color: 'white' }}>
            {formatTokenAmount(distribution.userBalanceAtDistributionBlock)} LND
          </Typography>
        </Box>

        <Box sx={{ mb: 3, p: 2, bgcolor: 'rgba(76,175,80,0.2)', borderRadius: 2 }}>
          <Typography variant="body2" sx={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', mb: 0.5 }}>
            Your Share
          </Typography>
          <Typography variant="h5" sx={{ color: '#4CAF50', fontWeight: 700 }}>
            {formatTokenAmount(distribution.userShare)} LND
          </Typography>
        </Box>

        {claimStatus.status === 'error' && (
          <Typography variant="body2" sx={{ color: '#ff6b6b', mb: 2, fontSize: '0.85rem' }}>
            {claimStatus.error || 'Transaction failed. Please try again.'}
          </Typography>
        )}

        <Button
          variant="contained"
          onClick={() => onClaim(distribution)}
          disabled={disabled || isProcessing}
          fullWidth
          sx={{
            background: isProcessing
              ? 'rgba(255,255,255,0.1)'
              : `linear-gradient(45deg, ${theme.palette.primary.main}, #4CAF50)`,
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
              boxShadow: '0 15px 30px rgba(0,0,0,0.4)',
            },
            '&:disabled': {
              background: 'rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.5)',
            },
          }}
        >
          {getButtonContent()}
        </Button>
      </CardContent>
    </Card>
  );
}
