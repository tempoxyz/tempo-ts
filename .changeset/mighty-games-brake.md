---
"tempo.ts": minor
---

**Breaking:** As of `viem@2.43.0`, `tempo.ts/chains` and `tempo.ts/viem` have been upstreamed into Viem, and are no longer maintained in this repository.

Follow the instructions below to migrate:

### Update Viem

```bash
pnpm i viem@2.43.0
```

### Modify `chain` configuration

The `tempo` chain has been renamed to `tempoTestnet`, and now becomes a standard chain object that can be `.extend`ed with a fee token, instead of a function.

```diff
const client = createClient({
- chain: tempo({
-   feeToken: '0x20c0000000000000000000000000000000000001'
- }),
+ chain: tempoTestnet.extend({ 
+   feeToken: '0x20c0000000000000000000000000000000000001' 
+ }),
  transport: http(),
})
```

### Removed `tempo` chain

The `tempo` chain has been removed. Use `tempoTestnet` instead.

```diff
- import { tempo } from 'tempo.ts/chains'
+ import { tempoTestnet } from 'viem/chains'
```

### `Account#assignKeyAuthorization` has been removed

The `Account#assignKeyAuthorization` function has been removed. Instead, you will need to assign the key authorization on a transaction manually on the next transaction.

```diff
const accessKey = Account.fromP256(generatePrivateKey(), {
  access: account,
})

const keyAuthorization = await account.signKeyAuthorization(accessKey)
- await account.assignKeyAuthorization(keyAuthorization)

const receipt = await client.sendTransactionSync({
  account: accessKey,
+ keyAuthorization,
})
```