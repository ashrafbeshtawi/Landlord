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
