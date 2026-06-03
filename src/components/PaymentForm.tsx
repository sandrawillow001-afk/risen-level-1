"use client";

import { useState } from "react";
import type { PaymentFormData, TransactionState } from "@/types";

interface PaymentFormProps {
  onSend: (destination: string, amount: string) => void;
  txState: TransactionState;
}

export default function PaymentForm({ onSend, txState }: PaymentFormProps) {
  const [formData, setFormData] = useState<PaymentFormData>({
    destination: "",
    amount: "",
  });

  const isProcessing =
    txState.status === "building" ||
    txState.status === "signing" ||
    txState.status === "submitting";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessing) return;
    onSend(formData.destination, formData.amount);
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">
        Send Payment
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="destination"
            className="block text-sm font-medium text-gray-700"
          >
            Recipient Address
          </label>
          <input
            id="destination"
            type="text"
            placeholder="G... (Stellar testnet address)"
            value={formData.destination}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                destination: e.target.value,
              }))
            }
            required
            disabled={isProcessing}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 font-mono text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>
        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700"
          >
            Amount (XLM)
          </label>
          <input
            id="amount"
            type="number"
            step="0.0000001"
            min="0"
            placeholder="0.0"
            value={formData.amount}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                amount: e.target.value,
              }))
            }
            required
            disabled={isProcessing}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 font-mono text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>
        <button
          type="submit"
          disabled={isProcessing}
          className={`flex w-full items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all disabled:cursor-not-allowed disabled:opacity-50 ${
            txState.status === "error"
              ? "bg-red-600 hover:bg-red-700"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {isProcessing ? (
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
              {txState.status === "building"
                ? "Building Transaction..."
                : txState.status === "signing"
                  ? "Waiting for Signature..."
                  : "Submitting..."}
            </>
          ) : (
            "Send Payment"
          )}
        </button>
      </form>
    </div>
  );
}
