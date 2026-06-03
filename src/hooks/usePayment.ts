"use client";

import { useState, useCallback } from "react";
import { signTransaction } from "@stellar/freighter-api";
import { buildPaymentTransaction, buildAndSubmitPayment } from "@/lib/stellar";
import { STELLAR_EXPERT_URL } from "@/lib/stellar";
import type { TransactionState } from "@/types";

export function usePayment(publicKey: string | null) {
  const [txState, setTxState] = useState<TransactionState>({
    status: "idle",
    hash: null,
    error: null,
  });

  const sendPayment = useCallback(
    async (destination: string, amount: string) => {
      if (!publicKey) return;

      setTxState({ status: "building", hash: null, error: null });

      try {
        const transactionXdr = await buildPaymentTransaction(
          publicKey,
          destination,
          amount
        );

        setTxState({ status: "signing", hash: null, error: null });

        const { signedTxXdr } = await signTransaction(transactionXdr);

        setTxState({ status: "submitting", hash: null, error: null });

        const hash = await buildAndSubmitPayment(
          publicKey,
          destination,
          amount,
          signedTxXdr
        );

        setTxState({ status: "success", hash, error: null });
      } catch (err: unknown) {
        let message = "Transaction failed";
        if (err instanceof Error) {
          if (
            err.message.includes("User declined") ||
            err.message.includes("cancel") ||
            err.message.includes("reject")
          ) {
            message = "Transaction was rejected in Freighter";
          } else {
            message = err.message;
          }
        }
        setTxState({ status: "error", hash: null, error: message });
      }
    },
    [publicKey]
  );

  const resetTxState = useCallback(() => {
    setTxState({ status: "idle", hash: null, error: null });
  }, []);

  const explorerUrl = txState.hash
    ? `${STELLAR_EXPERT_URL}/${txState.hash}`
    : null;

  return {
    ...txState,
    explorerUrl,
    sendPayment,
    resetTxState,
  };
}
