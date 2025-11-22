# With Fee Payer Example

This example demonstrates how to use Tempo's fee payer functionality to sponsor transaction fees for users. It includes a relay server that signs transactions as a sponsor, allowing users to send transactions without paying gas fees.

## Features

- **Fee Payer Pattern**: Uses `withFeePayer` transport to route sponsored transactions through a relay server
- **Relay Server**: Local server that co-signs transactions with a sponsor account
- **WebAuthn Authentication**: Secure user authentication using WebAuthn
- **Transaction Sponsorship**: Demonstrates the complete flow of preparing, signing, and submitting sponsored transactions

## Getting Started

```sh
pnpx gitpick tempoxyz/tempo-ts/tree/main/examples/with-fee-payer with-fee-payer && cd with-fee-payer
pnpm i
pnpm dev
```

The `pnpm dev` command will automatically start both:
1. The Vite development server (frontend)
2. The relay server (backend sponsor)

## How It Works

### 1. Wagmi Configuration

The `wagmi.config.ts` uses `withFeePayer` to configure two transports:

```typescript
withFeePayer(
  // Transport for regular transactions
  http('https://rpc.testnet.tempo.xyz...'),
  // Transport for sponsored transactions (feePayer: true)
  http('http://localhost:3050'),
)
```

### 2. Relay Server

The `relay-server.ts` runs locally and:
1. Receives partially signed transactions from the client
2. Deserializes the transaction
3. Co-signs with the sponsor account
4. Submits the fully signed transaction to Tempo

### 3. Client Flow

When sending a sponsored transaction:

```typescript
// Step 1: Prepare transaction with feePayer: true
const request = await walletClient.prepareTransactionRequest({
  data: '0xdeadbeef',
  to: '0xcafe...',
  feePayer: true,
})

// Step 2: Sign transaction (creates partial signature)
const signedTransaction = await walletClient.signTransaction(request)

// Step 3: Submit via sendRawTransaction - relay picks it up, signs, and submits
const hash = await walletClient.sendRawTransaction({
  serializedTransaction: signedTransaction,
})
```

## Architecture

```
User's Browser          Relay Server             Tempo Network
     │                       │                         │
     │ 1. Prepare tx         │                         │
     │ (feePayer: true)      │                         │
     │                       │                         │
     │ 2. Sign tx            │                         │
     │ (partial signature)   │                         │
     │                       │                         │
     │ 3. Send to relay ───>│                         │
     │                       │ 4. Co-sign with         │
     │                       │    sponsor account      │
     │                       │                         │
     │                       │ 5. Submit tx ─────────>│
     │                       │                         │
     │                       │<──── 6. tx hash ────────│
     │<──── 7. tx hash ──────│                         │
```

## Learn More

- [Tempo Documentation](https://docs.tempo.xyz)
- [Fee Payer Pattern](https://docs.tempo.xyz/developers/fee-payer)
