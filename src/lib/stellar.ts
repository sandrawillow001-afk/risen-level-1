import {
  TransactionBuilder,
  Networks,
  Operation,
  Asset,
  BASE_FEE,
  Horizon,
} from "@stellar/stellar-sdk";

const server = new Horizon.Server("https://horizon-testnet.stellar.org");

const FRIENDBOT_URL = "https://friendbot.stellar.org";

export async function fundTestnetAccount(publicKey: string): Promise<boolean> {
  try {
    const response = await fetch(`${FRIENDBOT_URL}?addr=${publicKey}`);
    if (!response.ok) {
      const text = await response.text();
      throw new Error(text);
    }
    return true;
  } catch (error) {
    console.error("Friendbot funding failed:", error);
    throw error;
  }
}

export async function fetchBalance(
  publicKey: string
): Promise<string | null> {
  try {
    const account = await server.loadAccount(publicKey);
    const balance = account.balances.find(
      (b) => b.asset_type === "native"
    );
    return balance ? balance.balance : "0";
  } catch (error: unknown) {
    if (error instanceof Error && "response" in error) {
      const horizonError = error as { response?: { status?: number } };
      if (horizonError.response?.status === 404) {
        return null;
      }
    }
    throw error;
  }
}

export async function buildAndSubmitPayment(
  signedXdr: string
): Promise<string> {
  const transaction = TransactionBuilder.fromXDR(
    signedXdr,
    Networks.TESTNET
  );

  const result = await server.submitTransaction(transaction);
  return result.hash;
}

export async function buildPaymentTransaction(
  sourcePublicKey: string,
  destination: string,
  amount: string
): Promise<string> {
  const account = await server.loadAccount(sourcePublicKey);

  const transaction = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: Networks.TESTNET,
  })
    .addOperation(
      Operation.payment({
        destination,
        asset: Asset.native(),
        amount,
      })
    )
    .setTimeout(30)
    .build();

  return transaction.toXDR();
}

export const STELLAR_EXPERT_URL = "https://stellar.expert/explorer/testnet/tx";
