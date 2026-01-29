export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '';

export const TOAST_DURATION = {
  success: 5000,
  error: 7000,
  pending: null, // No auto-dismiss for pending
} as const;
