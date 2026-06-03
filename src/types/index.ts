export interface WalletState {
  publicKey: string | null;
  isConnected: boolean;
}

export interface BalanceState {
  xlm: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface TransactionState {
  status: "idle" | "building" | "signing" | "submitting" | "success" | "error";
  hash: string | null;
  error: string | null;
}

export interface PaymentFormData {
  destination: string;
  amount: string;
}
