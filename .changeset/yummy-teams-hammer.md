---
"tempo.ts": minor
---

**Breaking:** `feeToken` is now required on all transaction actions. You must either pass `feeToken` explicitly, or hoist a 
`feeToken` on the Client:

### Non-hoisted Fee Token

`feeToken` will need to be set per-action.

```ts
// fee token NOT set on client
const client2 = createClient({
  chain: tempo,
  transport: http()
})

// ⚠️ `feeToken` needs to be set per-action
await sendTransaction(client2, {
  feeToken: '0x20c...0001',
  to: '0x0000000000000000000000000000000000000000'
})
```

### Hoisted Fee Token

Pass `feeToken` to the Client to apply it to all transactions.

```ts
const client1 = createClient({
  chain: tempo({ feeToken: '0x20c...001' }), // note: pass `null` to opt-in to protocol preferences.
  transport: http()
})

// ✅ no fee token needed, hoisted on client
await sendTransaction(client1, {
  to: '0x0000000000000000000000000000000000000000'
})
```