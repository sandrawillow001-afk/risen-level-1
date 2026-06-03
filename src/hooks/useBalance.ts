"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchBalance, fundTestnetAccount } from "@/lib/stellar";
import type { BalanceState } from "@/types";

export function useBalance(publicKey: string | null) {
  const [balance, setBalance] = useState<BalanceState>({
    xlm: null,
    isLoading: false,
    error: null,
  });

  const refreshBalance = useCallback(async () => {
    if (!publicKey) return;

    setBalance((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const result = await fetchBalance(publicKey);
      setBalance({
        xlm: result,
        isLoading: false,
        error: null,
      });
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch balance";
      setBalance({ xlm: null, isLoading: false, error: message });
    }
  }, [publicKey]);

  const fundWithFriendbot = useCallback(async () => {
    if (!publicKey) return;

    setBalance((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      await fundTestnetAccount(publicKey);
      await refreshBalance();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to fund account";
      setBalance((prev) => ({ ...prev, isLoading: false, error: message }));
    }
  }, [publicKey, refreshBalance]);

  useEffect(() => {
    if (publicKey) {
      refreshBalance();
    } else {
      setBalance({ xlm: null, isLoading: false, error: null });
    }
  }, [publicKey, refreshBalance]);

  return {
    ...balance,
    refreshBalance,
    fundWithFriendbot,
  };
}
