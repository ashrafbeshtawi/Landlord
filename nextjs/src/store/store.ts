import { create } from 'zustand';

interface ActionState {
  walletConnected: boolean;
  walletAdresse: string;
  setWalletConnected: (walletAdresse: string) => void;
  setWalletDisconnected: () => void;
}

export const useActionStore = create<ActionState>((set) => ({
    walletConnected: false,
    walletAdresse: '',
    setWalletConnected: (walletAdresse: string) => set({ walletConnected: true, walletAdresse: walletAdresse }),
    setWalletDisconnected: () => set({ walletConnected: false, walletAdresse: '' }),
}));
