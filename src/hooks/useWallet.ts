"use client";

import { useState, useCallback, useEffect } from "react";
import { isConnected, requestAccess } from "@stellar/freighter-api";
import type { WalletState } from "@/types";

export function useWallet() {
  const [wallet, setWallet] = useState<WalletState>({
    publicKey: null,
    isConnected: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { address } = await requestAccess();
      setWallet({ publicKey: address, isConnected: true });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to connect wallet";
      setError(message);
      setWallet({ publicKey: null, isConnected: false });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setWallet({ publicKey: null, isConnected: false });
    setError(null);
  }, []);

  useEffect(() => {
    isConnected()
      .then(({ isConnected: connected }) => {
        if (connected) {
          connect();
        }
      })
      .catch(() => {});
  }, [connect]);

  return {
    ...wallet,
    isLoading,
    error,
    connect,
    disconnect,
  };
}
