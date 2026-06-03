"use client";

import { useEffect, useState } from "react";

interface WalletConnectProps {
  publicKey: string | null;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
}

function truncateKey(key: string): string {
  return `${key.slice(0, 4)}...${key.slice(-4)}`;
}

export default function WalletConnect({
  publicKey,
  isConnected,
  isLoading,
  error,
  onConnect,
  onDisconnect,
}: WalletConnectProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const hasFreighter =
    typeof window !== "undefined" && "freighter" in window;

  if (!hasFreighter) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border-2 border-yellow-400 bg-yellow-50 p-5">
          <div className="flex items-start gap-3">
            <svg
              className="mt-0.5 h-6 w-6 flex-shrink-0 text-yellow-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <div>
              <p className="font-semibold text-yellow-800">
                Freighter Extension Required
              </p>
              <p className="mt-1 text-sm text-yellow-700">
                This dApp requires the Freighter browser extension to interact
                with the Stellar network. Please install it from{" "}
                <a
                  href="https://freighter.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium underline hover:text-yellow-900"
                >
                  freighter.app
                </a>
                , then refresh this page.
              </p>
            </div>
          </div>
        </div>
        <button
          disabled
          className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-lg bg-gray-300 px-6 py-3 text-sm font-semibold text-gray-500"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Connect Freighter Wallet
        </button>
      </div>
    );
  }

  if (isConnected && publicKey) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-3 w-3 rounded-full bg-green-500" />
            <div>
              <p className="text-sm font-medium text-green-800">
                Wallet Connected
              </p>
              <p className="font-mono text-sm text-green-600">
                {truncateKey(publicKey)}
              </p>
            </div>
          </div>
          <button
            onClick={onDisconnect}
            className="rounded-md bg-green-100 px-3 py-1.5 text-sm font-medium text-green-700 transition-colors hover:bg-green-200"
          >
            Disconnect
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={onConnect}
        disabled={isLoading}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? (
          <>
            <svg
              className="h-4 w-4 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Connecting...
          </>
        ) : (
          <>
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Connect Freighter Wallet
          </>
        )}
      </button>
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
