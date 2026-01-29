import { useState, useCallback } from 'react';
import { ToastState, ToastType } from '@/types';
import { TOAST_DURATION } from '@/utils/constants';

const initialState: ToastState = {
  open: false,
  message: '',
  type: 'success',
  txHash: undefined,
};

export function useToast() {
  const [toast, setToast] = useState<ToastState>(initialState);

  const showToast = useCallback((message: string, type: ToastType, txHash?: string) => {
    setToast({ open: true, message, type, txHash });

    const duration = TOAST_DURATION[type];
    if (duration) {
      setTimeout(() => {
        setToast((prev) => ({ ...prev, open: false }));
      }, duration);
    }
  }, []);

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, open: false }));
  }, []);

  const showSuccess = useCallback((message: string, txHash?: string) => {
    showToast(message, 'success', txHash);
  }, [showToast]);

  const showError = useCallback((message: string) => {
    showToast(message, 'error');
  }, [showToast]);

  const showPending = useCallback((message: string) => {
    showToast(message, 'pending');
  }, [showToast]);

  return {
    toast,
    showToast,
    hideToast,
    showSuccess,
    showError,
    showPending,
  };
}
