"use client";

interface BalanceDisplayProps {
  xlm: string;
  isLoading: boolean;
  error: string | null;
  publicKey: string | null;
  isUnfunded: boolean;
  onFund: () => void;
  onRefresh: () => void;
}

export default function BalanceDisplay({
  xlm,
  isLoading,
  error,
  publicKey,
  isUnfunded,
  onFund,
  onRefresh,
}: BalanceDisplayProps) {
  if (!publicKey) return null;

  if (isLoading && !isUnfunded) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 text-gray-500">
          <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Loading balance...
        </div>
      </div>
    );
  }

  if (error && !isUnfunded) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 shadow-sm">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  if (isUnfunded) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 shadow-sm">
        <p className="mb-3 text-sm font-medium text-amber-800">
          Account not funded on Testnet
        </p>
        <p className="mb-3 text-sm text-amber-600">
          {error}
        </p>
        <button
          onClick={onFund}
          disabled={isLoading}
          className="rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? "Funding..." : "Fund with Friendbot (Testnet)"}
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">XLM Balance</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">
            {parseFloat(xlm).toFixed(7)}
          </p>
        </div>
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="rounded-md bg-gray-100 p-2 text-gray-600 transition-colors hover:bg-gray-200 disabled:opacity-50"
          title="Refresh balance"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
    </div>
  );
}
