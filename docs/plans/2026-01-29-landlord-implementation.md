# LandLord Token Improvements Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add 3% quarterly minting restriction to smart contract, refactor frontend with best practices, and implement working Collect Profit feature with individual + batch claiming.

**Architecture:** Smart contract gets new state variables and modified mint function. Frontend gets centralized types, custom hooks for contract/toast/distributions, and refactored components with proper error handling and loading states.

**Tech Stack:** Solidity 0.8.20, OpenZeppelin, Next.js 14, React 18, Material UI, ethers.js v6, TypeScript, Zustand

---

## Task 1: Smart Contract - Add Minting Restriction

**Files:**
- Modify: `web3/contracts/LandLordToken.sol:9-14` (add state variables)
- Modify: `web3/contracts/LandLordToken.sol:185-189` (modify mint function)

**Step 1: Add new state variables and event after ReentrancyGuard import**

Add after line 14 (after `uint256 private constant INITIAL_SUPPLY`):

```solidity
// Minting restriction: 3% max every 90 days
uint256 public lastMintTimestamp;
uint256 public constant MINT_INTERVAL = 90 days;
uint256 public constant MAX_MINT_PERCENTAGE = 3;

// Events
event TokensMinted(address indexed to, uint256 amount, uint256 timestamp);
```

**Step 2: Replace the generateTokensForRealEstatePurchase function**

Replace lines 185-189 with:

```solidity
function generateTokensForRealEstatePurchase(uint256 amount) public onlyOwner {
    require(
        lastMintTimestamp == 0 || block.timestamp >= lastMintTimestamp + MINT_INTERVAL,
        "Must wait 90 days between mints"
    );

    uint256 maxMintAmount = (totalSupply() * MAX_MINT_PERCENTAGE) / 100;
    require(amount <= maxMintAmount, "Minting amount exceeds 3% of total supply");

    lastMintTimestamp = block.timestamp;
    _mint(owner(), amount);

    emit TokensMinted(owner(), amount, block.timestamp);
}
```

**Step 3: Compile contract to verify no errors**

Run: `cd web3 && npx hardhat compile`
Expected: Compiled successfully

**Step 4: Commit**

```bash
git add web3/contracts/LandLordToken.sol
git commit -m "feat(contract): add 3% quarterly minting restriction

- Add lastMintTimestamp state variable
- Add MINT_INTERVAL (90 days) and MAX_MINT_PERCENTAGE (3%) constants
- Add TokensMinted event for transparency
- Modify generateTokensForRealEstatePurchase to enforce restrictions"
```

---

## Task 2: Frontend - Create TypeScript Types

**Files:**
- Create: `nextjs/src/types/index.ts`

**Step 1: Create types directory and file**

```typescript
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
```

**Step 2: Commit**

```bash
git add nextjs/src/types/index.ts
git commit -m "feat(frontend): add centralized TypeScript types"
```

---

## Task 3: Frontend - Create Utility Functions

**Files:**
- Create: `nextjs/src/utils/constants.ts`
- Create: `nextjs/src/utils/formatters.ts`

**Step 1: Create constants file**

```typescript
export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '';

export const TOAST_DURATION = {
  success: 5000,
  error: 7000,
  pending: null, // No auto-dismiss for pending
} as const;
```

**Step 2: Create formatters file**

```typescript
import { ethers } from 'ethers';

export function formatTokenAmount(amount: string, decimals: number = 18): string {
  try {
    const formatted = ethers.formatUnits(amount, decimals);
    const num = parseFloat(formatted);
    if (num >= 1000000) {
      return (num / 1000000).toFixed(2) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(2) + 'K';
    }
    return num.toFixed(4);
  } catch {
    return '0';
  }
}

export function formatAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatDate(timestamp: string | number): string {
  const date = new Date(Number(timestamp) * 1000);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatTxHash(hash: string): string {
  return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
}
```

**Step 3: Commit**

```bash
git add nextjs/src/utils/constants.ts nextjs/src/utils/formatters.ts
git commit -m "feat(frontend): add utility functions and constants"
```

---

## Task 4: Frontend - Create Toast Hook

**Files:**
- Create: `nextjs/src/hooks/useToast.ts`

**Step 1: Create useToast hook**

```typescript
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
```

**Step 2: Commit**

```bash
git add nextjs/src/hooks/useToast.ts
git commit -m "feat(frontend): add useToast hook for notifications"
```

---

## Task 5: Frontend - Create Contract Hook

**Files:**
- Create: `nextjs/src/hooks/useContract.ts`

**Step 1: Create useContract hook**

```typescript
import { useMemo } from 'react';
import { ethers, BrowserProvider, Contract } from 'ethers';
import LandLordToken from '@/LandLordToken.json';
import { CONTRACT_ADDRESS } from '@/utils/constants';

declare global {
  interface Window {
    ethereum?: ethers.Eip1193Provider;
  }
}

export function useContract() {
  const getProvider = useMemo(() => {
    return async (): Promise<BrowserProvider> => {
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed');
      }
      return new BrowserProvider(window.ethereum);
    };
  }, []);

  const getSigner = async () => {
    const provider = await getProvider();
    return provider.getSigner();
  };

  const getContract = async (): Promise<Contract> => {
    const signer = await getSigner();
    return new Contract(CONTRACT_ADDRESS, LandLordToken.abi, signer);
  };

  const claimProfit = async (
    distributionId: string,
    balanceAtDistribution: string,
    signature: string
  ): Promise<string> => {
    const contract = await getContract();
    const tx = await contract.claimProfit(
      distributionId,
      balanceAtDistribution,
      signature
    );
    const receipt = await tx.wait();
    return receipt.hash;
  };

  return {
    getProvider,
    getSigner,
    getContract,
    claimProfit,
  };
}
```

**Step 2: Commit**

```bash
git add nextjs/src/hooks/useContract.ts
git commit -m "feat(frontend): add useContract hook for blockchain interactions"
```

---

## Task 6: Frontend - Create Distributions Hook

**Files:**
- Create: `nextjs/src/hooks/useDistributions.ts`

**Step 1: Create useDistributions hook**

```typescript
import { useState, useEffect, useCallback } from 'react';
import { Distribution, BalanceResponse, SignatureResponse, ClaimStatus } from '@/types';

interface UseDistributionsResult {
  balance: string | null;
  distributions: Distribution[];
  claimStatuses: Map<string, ClaimStatus>;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  fetchSignature: (distribution: Distribution) => Promise<string>;
  updateClaimStatus: (distributionId: string, status: Partial<ClaimStatus>) => void;
  isAnyClaiming: boolean;
}

export function useDistributions(walletAddress: string | null): UseDistributionsResult {
  const [balance, setBalance] = useState<string | null>(null);
  const [distributions, setDistributions] = useState<Distribution[]>([]);
  const [claimStatuses, setClaimStatuses] = useState<Map<string, ClaimStatus>>(new Map());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!walletAddress) {
      setBalance(null);
      setDistributions([]);
      setClaimStatuses(new Map());
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/balance?userAddress=${walletAddress}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.details || 'Failed to fetch data');
      }

      const data: BalanceResponse = await res.json();
      setBalance(data.balance);
      setDistributions(data.availableDistributions);

      // Initialize claim statuses for new distributions
      const newStatuses = new Map<string, ClaimStatus>();
      data.availableDistributions.forEach((dist) => {
        newStatuses.set(dist.id, {
          distributionId: dist.id,
          status: 'idle',
        });
      });
      setClaimStatuses(newStatuses);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [walletAddress]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const fetchSignature = async (distribution: Distribution): Promise<string> => {
    const res = await fetch('/api/signature', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userAddress: walletAddress,
        distributionId: distribution.id,
        balanceAtDistribution: distribution.userBalanceAtDistributionBlock,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Failed to get signature');
    }

    const data: SignatureResponse = await res.json();
    return data.signature;
  };

  const updateClaimStatus = (distributionId: string, status: Partial<ClaimStatus>) => {
    setClaimStatuses((prev) => {
      const newMap = new Map(prev);
      const existing = newMap.get(distributionId) || { distributionId, status: 'idle' };
      newMap.set(distributionId, { ...existing, ...status });
      return newMap;
    });
  };

  const isAnyClaiming = Array.from(claimStatuses.values()).some(
    (s) => s.status === 'signing' || s.status === 'pending'
  );

  return {
    balance,
    distributions,
    claimStatuses,
    loading,
    error,
    refresh: fetchData,
    fetchSignature,
    updateClaimStatus,
    isAnyClaiming,
  };
}
```

**Step 2: Commit**

```bash
git add nextjs/src/hooks/useDistributions.ts
git commit -m "feat(frontend): add useDistributions hook for distribution management"
```

---

## Task 7: Frontend - Fix Signature API Route

**Files:**
- Modify: `nextjs/src/app/api/signature/route.ts`

**Step 1: Add POST handler to signature route**

Replace entire file with:

```typescript
import { NextResponse } from 'next/server';
import { ethers } from 'ethers';

const ERC20_ABI = ['function balanceOf(address account) external view returns (uint256)'];

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const userAddress = url.searchParams.get('userAddress');
    const distributionId = url.searchParams.get('distributionId');
    const block = url.searchParams.get('block');

    if (!userAddress || !distributionId) {
      return NextResponse.json({ error: 'userAddress and distributionId are required.' }, { status: 400 });
    }

    const distributionIdNum = parseInt(distributionId, 10);
    if (isNaN(distributionIdNum)) {
      return NextResponse.json({ error: 'distributionId must be a valid number.' }, { status: 400 });
    }

    const privateKey = process.env.PRIVATE_KEY;
    const tokenAddress = process.env.TOKEN_ADDRESS;
    const rpcUrl = process.env.RPC_URL;

    if (!privateKey || !tokenAddress || !rpcUrl) {
      return NextResponse.json(
        { error: 'Missing environment variables (PRIVATE_KEY, TOKEN_ADDRESS, RPC_URL).' },
        { status: 500 }
      );
    }

    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const backendWallet = new ethers.Wallet(privateKey, provider);
    const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);

    const blockTag = block ? parseInt(block, 10) : 'latest';
    if (block && isNaN(Number(blockTag))) {
      return NextResponse.json({ error: 'block must be a valid number if provided.' }, { status: 400 });
    }

    const balanceAtDistribution = await tokenContract.balanceOf(userAddress, { blockTag });

    const messageHash = ethers.solidityPackedKeccak256(
      ['address', 'uint256', 'uint256'],
      [userAddress, distributionIdNum, balanceAtDistribution]
    );

    const signature = await backendWallet.signMessage(ethers.getBytes(messageHash));

    return NextResponse.json({
      signature,
      balanceAtDistribution: balanceAtDistribution.toString(),
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Something went wrong', details: errorMessage },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userAddress, distributionId, balanceAtDistribution } = body;

    if (!userAddress || distributionId === undefined || !balanceAtDistribution) {
      return NextResponse.json(
        { error: 'userAddress, distributionId, and balanceAtDistribution are required.' },
        { status: 400 }
      );
    }

    const distributionIdNum = parseInt(distributionId, 10);
    if (isNaN(distributionIdNum)) {
      return NextResponse.json({ error: 'distributionId must be a valid number.' }, { status: 400 });
    }

    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) {
      return NextResponse.json(
        { error: 'Missing environment variable (PRIVATE_KEY).' },
        { status: 500 }
      );
    }

    const backendWallet = new ethers.Wallet(privateKey);

    const messageHash = ethers.solidityPackedKeccak256(
      ['address', 'uint256', 'uint256'],
      [userAddress, distributionIdNum, balanceAtDistribution]
    );

    const signature = await backendWallet.signMessage(ethers.getBytes(messageHash));

    return NextResponse.json({ signature });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Something went wrong', details: errorMessage },
      { status: 500 }
    );
  }
}
```

**Step 2: Commit**

```bash
git add nextjs/src/app/api/signature/route.ts
git commit -m "feat(api): add POST handler to signature route for claim flow"
```

---

## Task 8: Frontend - Create Toast Component

**Files:**
- Create: `nextjs/src/components/common/Toast.tsx`

**Step 1: Create Toast component**

```typescript
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
```

**Step 2: Commit**

```bash
git add nextjs/src/components/common/Toast.tsx
git commit -m "feat(frontend): add Toast notification component"
```

---

## Task 9: Frontend - Create LoadingSpinner Component

**Files:**
- Create: `nextjs/src/components/common/LoadingSpinner.tsx`

**Step 1: Create LoadingSpinner component**

```typescript
'use client';

import { Box, CircularProgress, Typography } from '@mui/material';

interface LoadingSpinnerProps {
  message?: string;
  size?: number;
  fullScreen?: boolean;
}

export default function LoadingSpinner({
  message,
  size = 40,
  fullScreen = false
}: LoadingSpinnerProps) {
  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
      }}
    >
      <CircularProgress size={size} sx={{ color: 'white' }} />
      {message && (
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
          {message}
        </Typography>
      )}
    </Box>
  );

  if (fullScreen) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0,0,0,0.7)',
          zIndex: 9999,
        }}
      >
        {content}
      </Box>
    );
  }

  return content;
}
```

**Step 2: Commit**

```bash
git add nextjs/src/components/common/LoadingSpinner.tsx
git commit -m "feat(frontend): add LoadingSpinner component"
```

---

## Task 10: Frontend - Create DistributionCard Component

**Files:**
- Create: `nextjs/src/components/holder/DistributionCard.tsx`

**Step 1: Create DistributionCard component**

```typescript
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
```

**Step 2: Commit**

```bash
git add nextjs/src/components/holder/DistributionCard.tsx
git commit -m "feat(frontend): add DistributionCard component with claim states"
```

---

## Task 11: Frontend - Create ClaimAllButton Component

**Files:**
- Create: `nextjs/src/components/holder/ClaimAllButton.tsx`

**Step 1: Create ClaimAllButton component**

```typescript
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
```

**Step 2: Commit**

```bash
git add nextjs/src/components/holder/ClaimAllButton.tsx
git commit -m "feat(frontend): add ClaimAllButton component with progress"
```

---

## Task 12: Frontend - Refactor HolderPanel Component

**Files:**
- Modify: `nextjs/src/components/HolderPanel.tsx`

**Step 1: Replace entire HolderPanel.tsx with refactored version**

```typescript
'use client';

import { useState } from 'react';
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
import theme from '@/theme/theme';

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: 'easeOut' },
};

export default function HolderPanel() {
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
      const errorMessage = (err as Error).message || 'Failed to claim profit';
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
        const errorMessage = (err as Error).message || 'Failed to claim';
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

  const activeDistributions = distributions.filter(
    (d) => claimStatuses.get(d.id)?.status !== 'success'
  );

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

        {loading ? (
          <LoadingSpinner message="Loading distributions..." />
        ) : error ? (
          <Typography color="error">Error: {error}</Typography>
        ) : activeDistributions.length === 0 ? (
          <Typography
            variant="body1"
            sx={{ mt: 2, mb: 2, color: 'rgba(255,255,255,0.8)', textAlign: 'center' }}
          >
            No unclaimed profits found. New distributions might be coming soon!
          </Typography>
        ) : (
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
        )}
      </motion.div>

      <Toast toast={toast} onClose={hideToast} />
    </Box>
  );
}
```

**Step 2: Commit**

```bash
git add nextjs/src/components/HolderPanel.tsx
git commit -m "refactor(frontend): complete HolderPanel rewrite with hooks and components"
```

---

## Task 13: Frontend - Refactor ERC20Actions Component

**Files:**
- Modify: `nextjs/src/components/ERC20Actions.tsx`

**Step 1: Replace entire ERC20Actions.tsx with refactored version**

```typescript
'use client';

import { useState } from 'react';
import { Box, Button, TextField, Typography, Grid, Card, CardContent } from '@mui/material';
import { ethers } from 'ethers';
import { motion } from 'framer-motion';
import { useActionStore } from '@/store/store';
import { useContract } from '@/hooks/useContract';
import { useToast } from '@/hooks/useToast';
import Toast from '@/components/common/Toast';
import theme from '@/theme/theme';

interface ActionField {
  label: string;
  name: string;
}

interface ActionConfig {
  title: string;
  fields: ActionField[];
}

type FormState = {
  [key: string]: { [field: string]: string };
};

const actionConfigs: ActionConfig[] = [
  {
    title: 'Transfer',
    fields: [
      { label: 'To Address', name: 'toAddress' },
      { label: 'Amount', name: 'amount' },
    ],
  },
  {
    title: 'Approve',
    fields: [
      { label: 'Spender Address', name: 'spenderAddress' },
      { label: 'Amount', name: 'amount' },
    ],
  },
  {
    title: 'Transfer From',
    fields: [
      { label: 'From Address', name: 'fromAddress' },
      { label: 'To Address', name: 'toAddress' },
      { label: 'Amount', name: 'amount' },
    ],
  },
  {
    title: 'Burn',
    fields: [{ label: 'Amount', name: 'amount' }],
  },
];

const initialFormState: FormState = {
  Transfer: { toAddress: '', amount: '' },
  Approve: { spenderAddress: '', amount: '' },
  'Transfer From': { fromAddress: '', toAddress: '', amount: '' },
  Burn: { amount: '' },
};

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: 'easeOut' },
};

export default function ERC20Actions() {
  const { walletAdresse } = useActionStore();
  const { getContract } = useContract();
  const { toast, showSuccess, showError, showPending, hideToast } = useToast();

  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [processingAction, setProcessingAction] = useState<string | null>(null);

  const handleInputChange = (actionTitle: string, fieldName: string, value: string) => {
    setFormState((prev) => ({
      ...prev,
      [actionTitle]: {
        ...prev[actionTitle],
        [fieldName]: value,
      },
    }));
  };

  const executeAction = async (
    actionTitle: string,
    contractMethod: (contract: ethers.Contract) => Promise<ethers.ContractTransactionResponse>
  ) => {
    try {
      setProcessingAction(actionTitle);
      showPending(`Processing ${actionTitle.toLowerCase()}...`);

      const contract = await getContract();
      const tx = await contractMethod(contract);
      await tx.wait();

      showSuccess(`${actionTitle} successful!`, tx.hash);

      // Clear form after success
      setFormState((prev) => ({
        ...prev,
        [actionTitle]: initialFormState[actionTitle],
      }));
    } catch (err) {
      const errorMessage = (err as Error).message || `${actionTitle} failed`;
      showError(errorMessage);
    } finally {
      setProcessingAction(null);
    }
  };

  const handleTransfer = () => {
    const { toAddress, amount } = formState.Transfer;
    if (!toAddress || !amount) {
      showError('Please fill in all fields');
      return;
    }
    executeAction('Transfer', (contract) =>
      contract.transfer(toAddress, ethers.parseUnits(amount, 18))
    );
  };

  const handleApprove = () => {
    const { spenderAddress, amount } = formState.Approve;
    if (!spenderAddress || !amount) {
      showError('Please fill in all fields');
      return;
    }
    executeAction('Approve', (contract) =>
      contract.approve(spenderAddress, ethers.parseUnits(amount, 18))
    );
  };

  const handleTransferFrom = () => {
    const { fromAddress, toAddress, amount } = formState['Transfer From'];
    if (!fromAddress || !toAddress || !amount) {
      showError('Please fill in all fields');
      return;
    }
    executeAction('Transfer From', (contract) =>
      contract.transferFrom(fromAddress, toAddress, ethers.parseUnits(amount, 18))
    );
  };

  const handleBurn = () => {
    const { amount } = formState.Burn;
    if (!amount) {
      showError('Please fill in the amount');
      return;
    }
    executeAction('Burn', (contract) => contract.burn(ethers.parseUnits(amount, 18)));
  };

  const handlers: { [key: string]: () => void } = {
    Transfer: handleTransfer,
    Approve: handleApprove,
    'Transfer From': handleTransferFrom,
    Burn: handleBurn,
  };

  return (
    <Box
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
        mt: 4,
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
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: 'white' }}>
          Token Actions
        </Typography>

        <Grid container spacing={3} justifyContent="center">
          {actionConfigs.map((action) => (
            <Grid key={action.title}>
              <Card
                sx={{
                  background: 'linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                  backdropFilter: 'blur(15px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 3,
                  minWidth: 260,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 15px 30px rgba(0,0,0,0.3)',
                    border: '1px solid rgba(255,255,255,0.3)',
                  },
                }}
              >
                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                    {action.title}
                  </Typography>

                  {action.fields.map((field) => (
                    <TextField
                      key={field.name}
                      label={field.label}
                      fullWidth
                      margin="dense"
                      size="small"
                      value={formState[action.title]?.[field.name] || ''}
                      onChange={(e) => handleInputChange(action.title, field.name, e.target.value)}
                      disabled={processingAction === action.title}
                      InputLabelProps={{ style: { color: 'rgba(255,255,255,0.7)' } }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                          '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.5)' },
                          '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main },
                          '& input': { color: 'white' },
                        },
                      }}
                    />
                  ))}

                  <Button
                    variant="contained"
                    onClick={handlers[action.title]}
                    disabled={!walletAdresse || processingAction !== null}
                    fullWidth
                    sx={{
                      mt: 2,
                      background:
                        processingAction === action.title
                          ? 'rgba(255,255,255,0.1)'
                          : `linear-gradient(45deg, ${theme.palette.primary.main}, #4CAF50)`,
                      py: 1.5,
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      borderRadius: 2,
                      textTransform: 'none',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
                      '&:hover': {
                        background: `linear-gradient(45deg, ${theme.palette.primary.dark}, #45a049)`,
                        transform: 'translateY(-2px)',
                      },
                      '&:disabled': {
                        background: 'rgba(255,255,255,0.1)',
                        color: 'rgba(255,255,255,0.5)',
                      },
                    }}
                  >
                    {processingAction === action.title ? 'Processing...' : action.title}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </motion.div>

      <Toast toast={toast} onClose={hideToast} />
    </Box>
  );
}
```

**Step 2: Commit**

```bash
git add nextjs/src/components/ERC20Actions.tsx
git commit -m "refactor(frontend): complete ERC20Actions rewrite with hooks and toast"
```

---

## Task 14: Create Hooks Index File

**Files:**
- Create: `nextjs/src/hooks/index.ts`

**Step 1: Create hooks barrel export**

```typescript
export { useContract } from './useContract';
export { useDistributions } from './useDistributions';
export { useToast } from './useToast';
```

**Step 2: Commit**

```bash
git add nextjs/src/hooks/index.ts
git commit -m "chore(frontend): add hooks barrel export"
```

---

## Task 15: Final Verification

**Step 1: Verify TypeScript compiles**

Run: `cd nextjs && npx tsc --noEmit`
Expected: No errors

**Step 2: Verify Next.js builds**

Run: `cd nextjs && npm run build`
Expected: Build successful

**Step 3: Final commit if any fixes needed**

```bash
git add -A
git commit -m "fix: resolve any build issues"
```

---

## Summary

| Task | Description | Files Changed |
|------|-------------|---------------|
| 1 | Smart contract minting restriction | `LandLordToken.sol` |
| 2 | TypeScript types | `types/index.ts` |
| 3 | Utility functions | `utils/constants.ts`, `utils/formatters.ts` |
| 4 | Toast hook | `hooks/useToast.ts` |
| 5 | Contract hook | `hooks/useContract.ts` |
| 6 | Distributions hook | `hooks/useDistributions.ts` |
| 7 | Fix signature API | `api/signature/route.ts` |
| 8 | Toast component | `components/common/Toast.tsx` |
| 9 | LoadingSpinner component | `components/common/LoadingSpinner.tsx` |
| 10 | DistributionCard component | `components/holder/DistributionCard.tsx` |
| 11 | ClaimAllButton component | `components/holder/ClaimAllButton.tsx` |
| 12 | Refactor HolderPanel | `components/HolderPanel.tsx` |
| 13 | Refactor ERC20Actions | `components/ERC20Actions.tsx` |
| 14 | Hooks index | `hooks/index.ts` |
| 15 | Final verification | Build check |
