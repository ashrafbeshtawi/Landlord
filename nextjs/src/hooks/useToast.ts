import { useState, useCallback, useRef, useEffect } from 'react';
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
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const showToast = useCallback((message: string, type: ToastType, txHash?: string) => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setToast({ open: true, message, type, txHash });

    const duration = TOAST_DURATION[type];
    if (duration) {
      timeoutRef.current = setTimeout(() => {
        setToast((prev) => ({ ...prev, open: false }));
        timeoutRef.current = null;
      }, duration);
    }
  }, []);

  const hideToast = useCallback(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
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
