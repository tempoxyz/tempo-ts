# Fee Payer Example

This example runs a minimal sponsorship service using `Handler.feePayer`.

## What It Demonstrates

- accepting a sender-signed Tempo transaction
- applying a fee payer signature server-side
- optionally forwarding the signed transaction to Tempo RPC

## Run

From the repository root:

```sh
pnpm build
pnpm --filter @tempo-ts-example/fee-payer-node start
```

## Supported Methods

- `eth_signRawTransaction`
- `eth_sendRawTransaction`
- `eth_sendRawTransactionSync`

## Notes

- The user must sign the Tempo transaction before sending it to this service.
- This service only adds the fee payer signature. It does not validate your
  application-specific sponsorship policy. In production, use `onRequest` to
  enforce allowlists, rate limits, quotas, or application auth.
