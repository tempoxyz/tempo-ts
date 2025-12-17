# Migrating from `tempo.ts` to Wagmi or Viem

As of `viem@2.43.0` & `wagmi@x.x.x`, `tempo.ts/wagmi` and `tempo.ts/viem` have been upstreamed into Viem and Wagmi, and are no longer maintained in this repository.

- See [Migrating from `tempo.ts/viem` to `viem/tempo`](#migrating-from-tempo.tsviem-to-viemtempo)
- See [Migrating from `tempo.ts/wagmi` to `wagmi/tempo`](#migrating-from-tempo.tswagmi-to-wagmitempo)

## Migrating from `tempo.ts/viem` to `viem/tempo`

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

## Migrating from `tempo.ts/wagmi` to `wagmi/tempo`

```bash
pnpm i wagmi@x.x.x
```

### Modify `chain` configuration

The `tempo` chain has been renamed to `tempoTestnet`, and now becomes a standard chain object that can be `.extend`ed with a fee token, instead of a function.

```diff
const client = createConfig({
- chains: [tempo({
-   feeToken: '0x20c0000000000000000000000000000000000001'
- })],
+ chains: [tempoTestnet.extend({ 
+   feeToken: '0x20c0000000000000000000000000000000000001' 
+ })],
  transports: {
-    [tempo.id]: http(),
+    [tempoTestnet.id]: http(),
  },
})
```