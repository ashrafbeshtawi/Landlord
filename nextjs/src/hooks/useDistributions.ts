import { useState, useEffect, useCallback, useRef } from 'react';
import { ethers } from 'ethers';
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

/**
 * Type guard to check if error is an Error object
 */
function isError(error: unknown): error is Error {
  return error instanceof Error;
}

/**
 * Safely extracts error message from unknown error
 */
function getErrorMessage(error: unknown): string {
  if (isError(error)) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unknown error occurred';
}

/**
 * Generates an ownership signature proving the user controls their wallet
 */
async function generateOwnershipSignature(
  walletAddress: string
): Promise<{ signature: string; nonce: string }> {
  if (typeof window === 'undefined' || !window.ethereum) {
    throw new Error('MetaMask is not available');
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  // Generate a unique nonce
  const nonce = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;

  // Create the message to sign
  const message = `Verify ownership for LandLord claim\nAddress: ${walletAddress}\nNonce: ${nonce}`;

  // Sign the message
  const signature = await signer.signMessage(message);

  return { signature, nonce };
}

export function useDistributions(walletAddress: string | null): UseDistributionsResult {
  const [balance, setBalance] = useState<string | null>(null);
  const [distributions, setDistributions] = useState<Distribution[]>([]);
  const [claimStatuses, setClaimStatuses] = useState<Map<string, ClaimStatus>>(new Map());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Track if component is mounted to avoid state updates after unmount
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

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
      const res = await fetch(`/api/balance?userAddress=${encodeURIComponent(walletAddress)}`);

      if (!mountedRef.current) return;

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Failed to fetch data' }));
        throw new Error(errorData.error || errorData.details || 'Failed to fetch data');
      }

      const data: BalanceResponse = await res.json();

      if (!mountedRef.current) return;

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
      if (mountedRef.current) {
        setError(getErrorMessage(err));
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [walletAddress]);

  // Properly handle the promise in useEffect
  useEffect(() => {
    let cancelled = false;

    const doFetch = async () => {
      if (!cancelled) {
        await fetchData();
      }
    };

    doFetch().catch((err) => {
      if (!cancelled && mountedRef.current) {
        setError(getErrorMessage(err));
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [fetchData]);

  const fetchSignature = useCallback(
    async (distribution: Distribution): Promise<string> => {
      if (!walletAddress) {
        throw new Error('Wallet not connected');
      }

      // Generate ownership proof
      const { signature: ownershipSignature, nonce } = await generateOwnershipSignature(walletAddress);

      const res = await fetch('/api/signature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userAddress: walletAddress,
          distributionId: distribution.id,
          balanceAtDistribution: distribution.userBalanceAtDistributionBlock,
          distributionBlock: distribution.distributionBlock,
          ownershipSignature,
          nonce,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Failed to get signature' }));
        throw new Error(errorData.error || 'Failed to get signature');
      }

      const data: SignatureResponse = await res.json();
      return data.signature;
    },
    [walletAddress]
  );

  const updateClaimStatus = useCallback((distributionId: string, status: Partial<ClaimStatus>) => {
    setClaimStatuses((prev) => {
      const newMap = new Map(prev);
      const existing = newMap.get(distributionId) || { distributionId, status: 'idle' };
      newMap.set(distributionId, { ...existing, ...status });
      return newMap;
    });
  }, []);

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
