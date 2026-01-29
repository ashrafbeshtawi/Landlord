'use client';

import { Button, CircularProgress, Typography, Box } from '@mui/material';
import theme from '@/theme/theme';

interface ClaimAllButtonProps {
  count: number;
  onClaimAll: () => void;
  disabled: boolean;
  isProcessing: boolean;
  progress?: { current: number; total: number };
}

export default function ClaimAllButton({
  count,
  onClaimAll,
  disabled,
  isProcessing,
  progress,
}: ClaimAllButtonProps) {
  if (count < 2) {
    return null;
  }

  const getButtonContent = () => {
    if (isProcessing && progress) {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CircularProgress size={20} sx={{ color: 'white' }} />
          <Typography>
            Claiming {progress.current} of {progress.total}...
          </Typography>
        </Box>
      );
    }
    return `Claim All Profits (${count})`;
  };

  return (
    <Button
      variant="contained"
      onClick={onClaimAll}
      disabled={disabled || isProcessing}
      sx={{
        mt: 3,
        mb: 2,
        background: isProcessing
          ? 'rgba(255,255,255,0.1)'
          : `linear-gradient(45deg, #2196F3, ${theme.palette.primary.main})`,
        px: 6,
        py: 2,
        fontSize: '1.1rem',
        fontWeight: 700,
        borderRadius: 4,
        textTransform: 'none',
        boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
        '&:hover': {
          background: `linear-gradient(45deg, #1976D2, ${theme.palette.primary.dark})`,
          transform: 'translateY(-3px)',
          boxShadow: '0 15px 40px rgba(0,0,0,0.5)',
        },
        '&:disabled': {
          background: 'rgba(255,255,255,0.1)',
          color: 'rgba(255,255,255,0.5)',
        },
      }}
    >
      {getButtonContent()}
    </Button>
  );
}
