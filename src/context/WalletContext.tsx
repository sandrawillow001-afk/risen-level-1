"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
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

  // Mirrors `address` so refreshBalance can stay referentially stable while
  // still falling back to the latest connected account for callers that do
  // not pass an explicit public key (e.g. the Friendbot funding flow).
  const addressRef = useRef<string | null>(null);

  const refreshBalance = useCallback(async (targetAddress?: string) => {
    const pk = targetAddress ?? addressRef.current;
    if (!pk) return;

    setIsLoading(true);
    setError(null);

    try {
      const balance = await fetchBalance(pk);

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
  }, []);

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

      const resolvedAddress = pk || grantedAddress || null;
      addressRef.current = resolvedAddress;
      setAddress(resolvedAddress);

      if (resolvedAddress) {
        void refreshBalance(resolvedAddress);
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to connect wallet";
      setError(message);
      addressRef.current = null;
      setAddress(null);
    } finally {
      setIsLoading(false);
    }
  }, [refreshBalance]);

  const disconnect = useCallback(() => {
    addressRef.current = null;
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
              addressRef.current = pk;
              setAddress(pk);
              void refreshBalance(pk);
            })
            .catch(() => {});
        }
      })
      .catch(() => {});
  }, [hasFreighter, refreshBalance]);

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
