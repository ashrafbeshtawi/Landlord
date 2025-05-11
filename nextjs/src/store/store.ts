import { create } from 'zustand';

interface ActionState {
  walletConnected: boolean;
  setWalletConnected: () => void;
  setWalletDisconnected: () => void;
}

export const useActionStore = create<ActionState>((set) => ({
    walletConnected: false,
    setWalletConnected: () => set({ walletConnected: true }),
    setWalletDisconnected: () => set({ walletConnected: false }),
}));
