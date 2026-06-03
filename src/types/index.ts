export interface TransactionState {
  status: "idle" | "building" | "signing" | "submitting" | "success" | "error";
  hash: string | null;
  error: string | null;
}

export interface PaymentFormData {
  destination: string;
  amount: string;
}
