"use client";

import { useWallet } from "@/hooks/useWallet";
import { useBalance } from "@/hooks/useBalance";
import { usePayment } from "@/hooks/usePayment";
import WalletConnect from "@/components/WalletConnect";
import BalanceDisplay from "@/components/BalanceDisplay";
import PaymentForm from "@/components/PaymentForm";
import TransactionStatus from "@/components/TransactionStatus";

export default function Home() {
  const {
    publicKey,
    isConnected,
    isLoading: walletLoading,
    error: walletError,
    connect,
    disconnect,
  } = useWallet();

  const {
    xlm,
    isLoading: balanceLoading,
    error: balanceError,
    fundWithFriendbot,
    refreshBalance,
  } = useBalance(publicKey);

  const {
    status: txStatus,
    hash: txHash,
    error: txError,
    explorerUrl,
    sendPayment,
    resetTxState,
  } = usePayment(publicKey);

  const txState = { status: txStatus, hash: txHash, error: txError };

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
          publicKey={publicKey}
          isConnected={isConnected}
          isLoading={walletLoading}
          error={walletError}
          onConnect={connect}
          onDisconnect={disconnect}
        />

        {publicKey && (
          <>
            <BalanceDisplay
              xlm={xlm}
              isLoading={balanceLoading}
              error={balanceError}
              publicKey={publicKey}
              onFund={fundWithFriendbot}
              onRefresh={refreshBalance}
            />

            {xlm !== null && (
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
