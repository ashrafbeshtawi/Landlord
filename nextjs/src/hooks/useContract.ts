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
