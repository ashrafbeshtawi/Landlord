'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { ethers } from 'ethers';
import { useActionStore } from '@/store/store';

interface WalletContextType {
  isInitialized: boolean;
  isConnecting: boolean;
  autoConnectAttempted: boolean;
}

const WalletContext = createContext<WalletContextType>({
  isInitialized: false,
  isConnecting: false,
  autoConnectAttempted: false,
});

export const useWalletContext = () => useContext(WalletContext);

interface WalletProviderProps {
  children: ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [autoConnectAttempted, setAutoConnectAttempted] = useState(false);

  const { setWalletConnected, walletConnected } = useActionStore();

  const attemptAutoConnect = useCallback(async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      setIsInitialized(true);
      setAutoConnectAttempted(true);
      return;
    }

    setIsConnecting(true);

    try {
      const ethereum = window.ethereum as ethers.Eip1193Provider & {
        request: (args: { method: string }) => Promise<string[]>;
      };

      // Check if we have permission to access accounts (user previously connected)
      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if (accounts && accounts.length > 0) {
        // User has previously authorized, auto-connect
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        await setWalletConnected(signer);
      }
    } catch (err) {
      console.error('Auto-connect failed:', err);
    } finally {
      setIsConnecting(false);
      setIsInitialized(true);
      setAutoConnectAttempted(true);
    }
  }, [setWalletConnected]);

  // Attempt auto-connect on mount
  useEffect(() => {
    if (!autoConnectAttempted && !walletConnected) {
      attemptAutoConnect();
    } else {
      setIsInitialized(true);
      setAutoConnectAttempted(true);
    }
  }, [attemptAutoConnect, autoConnectAttempted, walletConnected]);

  return (
    <WalletContext.Provider value={{ isInitialized, isConnecting, autoConnectAttempted }}>
      {children}
    </WalletContext.Provider>
  );
}
