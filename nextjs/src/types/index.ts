// Distribution data from API
export interface Distribution {
  id: string;
  totalAmount: string;
  distributionDate: string;
  distributionBlock: string;
  tokensExcludingOwner: string;
  userBalanceAtDistributionBlock: string;
  userShare: string;
}

// API response from /api/balance
export interface BalanceResponse {
  balance: string;
  availableDistributions: Distribution[];
}

// API response from /api/signature
export interface SignatureResponse {
  signature: string;
}

// Claim operation result
export interface ClaimResult {
  success: boolean;
  txHash?: string;
  error?: string;
  distributionId: string;
}

// Toast notification types
export type ToastType = 'success' | 'error' | 'pending';

export interface ToastState {
  open: boolean;
  message: string;
  type: ToastType;
  txHash?: string;
}

// Claim status for tracking individual claims
export interface ClaimStatus {
  distributionId: string;
  status: 'idle' | 'signing' | 'pending' | 'success' | 'error';
  txHash?: string;
  error?: string;
}
