---
"tempo.ts": minor
---

**Breaking (`tempo.ts/wagmi`):** Removed `"lax"` option from `Connector.webAuthn#grantAccessKey` connector. The "lax" behavior is now the default. To opt-in to "strict mode", set `strict: true` in the `grantAccessKey` options.
