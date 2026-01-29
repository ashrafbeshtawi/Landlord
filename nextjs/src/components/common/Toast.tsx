'use client';

import { Snackbar, Alert, AlertColor, Link, Box, CircularProgress } from '@mui/material';
import { ToastState } from '@/types';
import { formatTxHash } from '@/utils/formatters';

interface ToastProps {
  toast: ToastState;
  onClose: () => void;
}

const typeToSeverity: Record<string, AlertColor> = {
  success: 'success',
  error: 'error',
  pending: 'info',
};

export default function Toast({ toast, onClose }: ToastProps) {
  const { open, message, type, txHash } = toast;

  return (
    <Snackbar
      open={open}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      autoHideDuration={type === 'pending' ? null : type === 'error' ? 7000 : 5000}
    >
      <Alert
        onClose={onClose}
        severity={typeToSeverity[type]}
        sx={{ width: '100%', alignItems: 'center' }}
        icon={type === 'pending' ? <CircularProgress size={20} color="inherit" /> : undefined}
      >
        <Box>
          {message}
          {txHash && (
            <Link
              href={`https://bscscan.com/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ ml: 1, color: 'inherit' }}
            >
              View TX: {formatTxHash(txHash)}
            </Link>
          )}
        </Box>
      </Alert>
    </Snackbar>
  );
}
