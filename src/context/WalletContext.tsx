"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import {
  isConnected,
  requestAccess,
  getAddress,
} from "@stellar/freighter-api";
import { fetchBalance } from "@/lib/stellar";

export interface WalletState {
  address: string | null;
  hasFreighter: boolean;
  xlmBalance: string;
  isLoading: boolean;
  error: string | null;
}

export interface WalletContextValue extends WalletState {
  connect: () => Promise<void>;
  disconnect: () => void;
  refreshBalance: () => Promise<void>;
}

const WalletContext = createContext<WalletContextValue | null>(null);

function detectFreighter(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return "freighter" in window;
  } catch {
    return false;
  }
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [xlmBalance, setXlmBalance] = useState<string>("0");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasFreighter] = useState(detectFreighter);

  const refreshBalance = useCallback(async () => {
    if (!address) return;

    setIsLoading(true);
    setError(null);

    try {
      const balance = await fetchBalance(address);

      if (balance === null) {
        setXlmBalance("0");
        setError(
          "Account not found on Testnet. Fund & Activate your account via Friendbot below."
        );
      } else {
        setXlmBalance(balance);
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch balance";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  const connect = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Step 1 — Verify wallet permissions: check whether this dApp has
      // already been granted access to the Freighter extension.
      const { isConnected: connected } = await isConnected();

      // Step 2 — Explicitly request permission to access the wallet. This is
      // the permission-requesting step of the connection flow: requestAccess()
      // opens Freighter's permission prompt when access hasn't been granted
      // yet, and resolves immediately with the address when it already has.
      const { address: grantedAddress } = await requestAccess();

      // Step 3 — Retrieve the wallet's public address.
      const { address: pk } = await getAddress();

      if (!pk && !grantedAddress && !connected) {
        throw new Error("Wallet access was not granted");
      }

      setAddress(pk || grantedAddress || null);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to connect wallet";
      setError(message);
      setAddress(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setAddress(null);
    setXlmBalance("0");
    setError(null);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!hasFreighter) return;

    isConnected()
      .then(({ isConnected: connected }) => {
        if (connected) {
          getAddress()
            .then(({ address: pk }) => {
              setAddress(pk);
            })
            .catch(() => {});
        }
      })
      .catch(() => {});
  }, [hasFreighter]);

  useEffect(() => {
    if (address) {
      refreshBalance();
    } else {
      setXlmBalance("0");
      setError(null);
    }
  }, [address, refreshBalance]);

  return (
    <WalletContext.Provider
      value={{
        address,
        hasFreighter,
        xlmBalance,
        isLoading,
        error,
        connect,
        disconnect,
        refreshBalance,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet(): WalletContextValue {
  const ctx = useContext(WalletContext);
  if (!ctx) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return ctx;
}
