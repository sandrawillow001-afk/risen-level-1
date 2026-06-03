"use client";

import type { TransactionState } from "@/types";

interface TransactionStatusProps {
  txState: TransactionState;
  explorerUrl: string | null;
  onDismiss: () => void;
}

export default function TransactionStatus({
  txState,
  explorerUrl,
  onDismiss,
}: TransactionStatusProps) {
  if (txState.status === "idle") return null;

  return (
    <div
      className={`rounded-lg border p-4 shadow-sm ${
        txState.status === "success"
          ? "border-green-200 bg-green-50"
          : txState.status === "error"
            ? "border-red-200 bg-red-50"
            : "border-blue-200 bg-blue-50"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          {txState.status === "success" ? (
            <svg
              className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ) : txState.status === "error" ? (
            <svg
              className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ) : (
            <svg
              className="mt-0.5 h-5 w-5 animate-spin text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
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
          )}
          <div>
            {txState.status === "success" ? (
              <div>
                <p className="text-sm font-medium text-green-800">
                  Transaction Successful!
                </p>
                {explorerUrl && (
                  <a
                    href={explorerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-block break-all font-mono text-sm text-green-600 underline hover:text-green-800"
                  >
                    {txState.hash}
                  </a>
                )}
              </div>
            ) : txState.status === "error" ? (
              <div>
                <p className="text-sm font-medium text-red-800">
                  Transaction Failed
                </p>
                <p className="mt-1 text-sm text-red-600">{txState.error}</p>
              </div>
            ) : (
              <p className="text-sm font-medium text-blue-800">
                {txState.status === "building"
                  ? "Building transaction..."
                  : txState.status === "signing"
                    ? "Check Freighter to sign the transaction..."
                    : "Submitting to the Stellar network..."}
              </p>
            )}
          </div>
        </div>
        {(txState.status === "success" || txState.status === "error") && (
            <button
              onClick={onDismiss}
              className="ml-4 text-gray-400 hover:text-gray-600"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
      </div>
    </div>
  );
}
