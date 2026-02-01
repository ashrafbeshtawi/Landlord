import { useMemo, useCallback } from 'react';
import { ethers, BrowserProvider, Contract } from 'ethers';
import LandLordToken from '@/LandLordToken.json';
import { CONTRACT_ADDRESS } from '@/utils/constants';

declare global {
  interface Window {
    ethereum?: ethers.Eip1193Provider;
  }
}

export function useContract() {
  const getProvider = useCallback(async (): Promise<BrowserProvider> => {
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error('MetaMask is not installed');
    }
    return new BrowserProvider(window.ethereum);
  }, []);

  const getSigner = useCallback(async () => {
    const provider = await getProvider();
    return provider.getSigner();
  }, [getProvider]);

  const getContract = useCallback(async (): Promise<Contract> => {
    const signer = await getSigner();
    return new Contract(CONTRACT_ADDRESS, LandLordToken.abi, signer);
  }, [getSigner]);

  const claimProfit = useCallback(
    async (
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
    },
    [getContract]
  );

  // Memoize the return object to prevent unnecessary re-renders
  return useMemo(
    () => ({
      getProvider,
      getSigner,
      getContract,
      claimProfit,
    }),
    [getProvider, getSigner, getContract, claimProfit]
  );
}
