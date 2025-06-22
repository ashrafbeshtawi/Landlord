import { create } from 'zustand';
import { ethers } from 'ethers';

interface ActionState {
  walletConnected: boolean;
  walletAdresse: string;
  signer: ethers.JsonRpcSigner | null;

  setWalletConnected: (signer: ethers.JsonRpcSigner) => void;
  setWalletDisconnected: () => void;
}

export const useActionStore = create<ActionState>((set) => ({
  walletConnected: false,
  walletAdresse: '',
  signer: null,

  setWalletConnected: (signer: ethers.JsonRpcSigner) => {
    signer.getAddress().then((address) =>
      set({
        walletConnected: true,
        walletAdresse: address,
        signer: signer,
      })
    );
  },

  setWalletDisconnected: () =>
    set({
      walletConnected: false,
      walletAdresse: '',
      signer: null,
    }),
}));
