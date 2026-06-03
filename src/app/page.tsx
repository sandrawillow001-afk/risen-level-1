"use client";

import { useWallet } from "@/context/WalletContext";
import { usePayment } from "@/hooks/usePayment";
import { fundTestnetAccount } from "@/lib/stellar";
import WalletConnect from "@/components/WalletConnect";
import BalanceDisplay from "@/components/BalanceDisplay";
import PaymentForm from "@/components/PaymentForm";
import TransactionStatus from "@/components/TransactionStatus";

export default function Home() {
  const {
    address,
    hasFreighter,
    xlmBalance,
    isLoading,
    error,
    connect,
    disconnect,
    refreshBalance,
  } = useWallet();

  const {
    status: txStatus,
    hash: txHash,
    error: txError,
    explorerUrl,
    sendPayment,
    resetTxState,
  } = usePayment(address);

  const txState = { status: txStatus, hash: txHash, error: txError };

  const isUnfunded =
    address !== null && xlmBalance === "0" && !isLoading && error !== null;

  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Simple Payment dApp
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Stellar Testnet Wallet & Payment Interface
          </p>
        </div>

        <WalletConnect
          publicKey={address}
          isConnected={address !== null}
          isLoading={isLoading}
          error={error}
          onConnect={connect}
          onDisconnect={disconnect}
        />

        {address && (
          <>
            <BalanceDisplay
              xlm={xlmBalance}
              isLoading={isLoading}
              error={error}
              publicKey={address}
              isUnfunded={isUnfunded}
              onFund={async () => {
                try {
                  await fundTestnetAccount(address);
                  await refreshBalance();
                } catch {
                  /* error handled by refreshBalance */
                }
              }}
              onRefresh={refreshBalance}
            />

            {!isUnfunded && (
              <PaymentForm onSend={sendPayment} txState={txState} />
            )}

            <TransactionStatus
              txState={txState}
              explorerUrl={explorerUrl}
              onDismiss={resetTxState}
            />
          </>
        )}
      </div>
    </main>
  );
}
