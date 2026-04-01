# Key Manager Example

This example runs a minimal Tempo key manager service backed by in-memory
storage.

## What It Demonstrates

- `Handler.keyManager`
- challenge generation for WebAuthn registration
- storing and retrieving credential public keys

## Run

From the repository root:

```sh
pnpm build
pnpm --filter @tempo-ts-example/key-manager-node start
```

## Endpoints

- `GET /challenge`
- `POST /:id`
- `GET /:id`

## Notes

- This uses `Kv.memory()`, so data is lost when the process exits.
- For production, replace the KV implementation with a durable backing store.
