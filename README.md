# 🌟 Stellar Journey to Mastery: White Belt Challenge

A production-ready, highly responsive Stellar Testnet Decentralized Application (dApp) built to satisfy all requirements for the **Level 1 – White Belt Challenge** in the Stellar Journey to Mastery Program.

This application acts as a **Simple Payment Portal**, allowing users to seamlessly securely authenticate via their Freighter browser extension, fetch real-time native Lumens (XLM) balances, utilize an in-app Friendbot faucet auto-funding utility for newly generated unactivated accounts, and process atomic peer-to-peer asset transfers with rich feedback loops.

---

## 🚀 Live Demo & Repository Details
- **Developer:** Jerome Onoja ([@jerryidoko](https://github.com/jerryidoko))
- **Repository URL:** [https://github.com/jerryidoko/stellar-frontend-challenge](https://github.com/jerryidoko/stellar-frontend-challenge)
- **Target Network:** Stellar Testnet
- **Supported Wallet:** Freighter Extension

---

## 🛠️ Tech Stack & Architecture
- **Framework:** React / Next.js with TypeScript (Strict Type Safety)
- **Styling:** Tailwind CSS (Fluid responsive components and real-time status alerts)
- **Stellar Tooling:**
  - `@stellar/stellar-sdk` (Horizon ledger querying, XDR Transaction Building, Network Passphrases)
  - `@stellar/freighter-api` (Browser extension communication, asymmetric cryptographic signing)

---

## ✨ Features Implemented

1. **Freighter Wallet Guard & Authentication:**
   - Detects if the Freighter browser extension is missing on startup and renders a clear installation callout banner.
   - Secure asynchronous `connect` routine using `requestAccess()` to capture the active public key.
   - Comprehensive `disconnect` routine to scrub localized sessions and component state cleanly.

2. **Resilient Horizon Balance Fetching:**
   - Tracks live XLM balances by querying the Testnet Horizon server (`https://horizon-testnet.stellar.org`).
   - Gracefully intercepts network `404 Not Found` state triggers caused by newly created, unactivated blockchain accounts.

3. **In-App Friendbot Account Activator:**
   - When a 404 state is captured, the app renders a dedicated **"Fund & Activate via Friendbot"** trigger.
   - Programmatically executes background HTTP requests directly to the network testnet faucet to deposit 10,000 testnet XLM and instantly updates the live UI context.

4. **Atomic Transaction Builder & P2P Payment Flow:**
   - Collects dynamic recipient addresses and precise asset quantities through an intuitive form module.
   - Leverages `TransactionBuilder` to dynamically fetch source account sequence numbers, inject base fees in Stroops, attach native operations, and compile an envelope.
   - Forwards compiled XDR payloads to Freighter for user authorization and securely broadcasts signed objects back to the Horizon cluster.

5. **Granular Visual Feedback Loops:**
   - Disables forms and buttons during cryptographic operations or pending network validations to block race conditions.
   - Renders error alerts with explicit handling for user transaction cancellations or insufficient network gas.
   - Displays a green success banner showcasing a fully hyperlinked Transaction Hash directing straight to the `stellar.expert` ledger explorer.

---

## ⚙️ Local Installation & Setup

Follow these simple steps to spin up the development environment locally:

### 1. Clone the Repository
```bash
git clone https://github.com/jerryidoko/stellar-frontend-challenge.git
cd stellar-frontend-challenge
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run the Development Server
```bash
npm run dev
```

### 4. Open in Browser
Navigate to [http://localhost:3000](http://localhost:3000).

> **Prerequisite:** Ensure the [Freighter browser extension](https://freighter.app) is installed and configured to connect to the **Stellar Testnet**.

---

## 📖 Usage Guide

1. **Connect Wallet** — Click the "Connect Freighter Wallet" button and approve the connection request in the Freighter popup.
2. **Fund Account (if needed)** — If your account is unfunded, a "Fund & Activate Account via Friendbot" button will appear. Click it to receive 10,000 testnet XLM.
3. **Check Balance** — Your XLM balance will be displayed prominently after connection or funding.
4. **Send Payment** — Enter a valid Stellar Testnet recipient address and the XLM amount, then click "Send Payment".
5. **Sign Transaction** — Review and sign the transaction in the Freighter popup.
6. **View Result** — A success banner will appear with the transaction hash linked directly to the Stellar Expert block explorer.

---

## 📸 Screenshots

### Wallet Connected State
<!-- TODO: Insert screenshot showing connected wallet with public key displayed prominently -->

### Balance Displayed
<!-- TODO: Insert screenshot showing XLM balance prominently displayed -->

### Successful Testnet Transaction
<!-- TODO: Insert screenshot showing transaction confirmation with hash and explorer link -->

---

## 📄 License

This project is submitted as part of the **Stellar Journey to Mastery Program** and is open-sourced under the MIT License.
