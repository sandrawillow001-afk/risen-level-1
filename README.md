# Simple Payment dApp — Stellar Journey to Mastery (White Belt)

A **Stellar Testnet** wallet connection and payment interface built with **Next.js**, **TypeScript**, **Tailwind CSS**, and the **Stellar ecosystem**.

## Project Description

This dApp allows users to:

- Connect their **Freighter** wallet to the Stellar Testnet
- View their native **XLM balance**
- Fund an unfunded account via **Friendbot** with one click
- Send **XLM payments** to any Stellar testnet address
- See real-time transaction feedback with a link to the **Stellar Expert** block explorer

Built as the Level 1 (White Belt) submission for the [Stellar Journey to Mastery Challenge](https://github.com/stellar/journey-to-mastery).

## Tech Stack

| Technology | Purpose |
|---|---|
| Next.js 16 (App Router) | React framework |
| TypeScript | Type safety |
| Tailwind CSS v4 | Styling |
| `@stellar/freighter-api` | Freighter wallet integration |
| `@stellar/stellar-sdk` | Horizon queries & transaction building |

## Architecture

```
src/
├── app/
│   ├── globals.css       # Global styles (Tailwind)
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Main page — composes all components
├── components/
│   ├── WalletConnect.tsx     # Freighter connect/disconnect UI
│   ├── BalanceDisplay.tsx    # XLM balance + Friendbot funding
│   ├── PaymentForm.tsx       # Send payment form
│   └── TransactionStatus.tsx # Success/failure feedback
├── hooks/
│   ├── useWallet.ts      # Wallet connection state
│   ├── useBalance.ts     # Balance fetching + Friendbot
│   └── usePayment.ts     # Transaction build/sign/submit flow
├── lib/
│   └── stellar.ts        # Stellar SDK helpers
└── types/
    └── index.ts          # Shared TypeScript interfaces
```

## Setup Instructions

### Prerequisites

- **Node.js** 18+
- **npm** 9+
- **Freighter** browser extension ([download](https://freighter.app))

### Install & Run

```bash
git clone https://github.com/JerryIdoko/stellar-frontend-challenge.git
cd stellar-frontend-challenge

npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Usage

1. **Connect Wallet** — Click "Connect Freighter Wallet" and approve the connection in the Freighter popup.
2. **Fund Account** — If your account is unfunded, click "Fund with Friendbot (Testnet)" to receive free test XLM.
3. **Send Payment** — Enter a valid Stellar testnet address and an XLM amount, then click "Send Payment".
4. **Sign & Confirm** — Review and sign the transaction in Freighter. The result (hash) will appear with a link to the block explorer.

## Screenshots

### Wallet Connected State
<!-- TODO: Insert screenshot showing connected wallet with public key displayed -->

### Balance Displayed
<!-- TODO: Insert screenshot showing XLM balance prominently displayed -->

### Successful Testnet Transaction
<!-- TODO: Insert screenshot showing transaction confirmation with hash and explorer link -->

## License

MIT
