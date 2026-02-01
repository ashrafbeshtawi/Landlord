import { create } from 'zustand';
import { ethers } from 'ethers';

interface ActionState {
  walletConnected: boolean;
  walletAdresse: string;
  signer: ethers.JsonRpcSigner | null;
  chainId: number | null;

  setWalletConnected: (signer: ethers.JsonRpcSigner) => Promise<void>;
  setWalletDisconnected: () => void;
  setChainId: (chainId: number | null) => void;
}

export const useActionStore = create<ActionState>((set) => ({
  walletConnected: false,
  walletAdresse: '',
  signer: null,
  chainId: null,

  setWalletConnected: async (signer: ethers.JsonRpcSigner) => {
    try {
      const address = await signer.getAddress();
      const provider = signer.provider;
      let chainId: number | null = null;

      if (provider) {
        const network = await provider.getNetwork();
        chainId = Number(network.chainId);
      }

      set({
        walletConnected: true,
        walletAdresse: address,
        signer: signer,
        chainId: chainId,
      });
    } catch (error) {
      console.error('Failed to get wallet address:', error);
      set({
        walletConnected: false,
        walletAdresse: '',
        signer: null,
        chainId: null,
      });
    }
  },

  setWalletDisconnected: () =>
    set({
      walletConnected: false,
      walletAdresse: '',
      signer: null,
      chainId: null,
    }),

  setChainId: (chainId: number | null) => set({ chainId }),
}));
