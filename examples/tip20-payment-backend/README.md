# TIP-20 Payment Backend Example

This example shows the thinnest possible payment backend shape for Tempo:

- expose a health endpoint
- expose a sponsorship endpoint
- forward sender-signed Tempo transactions into `Handler.feePayer`

## What It Demonstrates

- how a payment backend can sit in front of Tempo RPC
- how to separate application routing from sponsorship logic
- how to keep `feePayer` behind a dedicated route

## Run

From the repository root:

```sh
pnpm build
pnpm --filter @tempo-ts-example/tip20-payment-backend start
```

## Routes

- `GET /health`
- `POST /sponsor`

## Notes

- This is intentionally a minimal backend pattern, not a complete merchant
  integration.
- In a real deployment, add application auth, request validation, rate limits,
  idempotency keys, and accounting logic before forwarding transactions for
  sponsorship.
