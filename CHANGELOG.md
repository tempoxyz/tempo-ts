# tempo.ts

## 0.2.1

### Patch Changes

- [`db8cfa1`](https://github.com/tempoxyz/tempo-ts/commit/db8cfa1ccf2fdfcd1ec329662bddebffa998e16d) Thanks [@jxom](https://github.com/jxom)! - Added `getOptions.getPublicKey` and `createOptions.getChallenge` to `webAuthn` connector.

- [`fec93f9`](https://github.com/tempoxyz/tempo-ts/commit/fec93f903a8ecbf8d196604d91a300b51a569424) Thanks [@jxom](https://github.com/jxom)! - Added `faucet.fund` action.

- [#44](https://github.com/tempoxyz/tempo-ts/pull/44) [`58a6a11`](https://github.com/tempoxyz/tempo-ts/commit/58a6a113b10412bde1ef69531153e400e0a95a94) Thanks [@jxom](https://github.com/jxom)! - Added `mintWithValidatorToken` support to `amm.mint` action.

## 0.2.0

### Minor Changes

- [`a90d48c`](https://github.com/tempoxyz/tempo-ts/commit/a90d48c049c48601ae4aca78334b13b3ebb2ea85) Thanks [@jxom](https://github.com/jxom)! - Added `reward` Actions on `tempo.ts/viem`.

- [`a90d48c`](https://github.com/tempoxyz/tempo-ts/commit/a90d48c049c48601ae4aca78334b13b3ebb2ea85) Thanks [@jxom](https://github.com/jxom)! - Added `dex.getOrderbook` action.

- [`a90d48c`](https://github.com/tempoxyz/tempo-ts/commit/a90d48c049c48601ae4aca78334b13b3ebb2ea85) Thanks [@jxom](https://github.com/jxom)! - Added support for Native "Account Abstraction" accounts.

  New account types supported:

  ### WebAuthn (P256)

  ```ts
  import { Account, WebAuthnP256 } from "tempo.ts/viem";

  const credential = await WebAuthnP256.createCredential({
    name: "Example",
  });
  const account = Account.fromWebAuthnP256(credential);
  ```

  ### WebCrypto (P256)

  ```ts
  import { Account, WebCryptoP256 } from "tempo.ts/viem";

  const keyPair = await WebCryptoP256.createKeyPair();
  const account = Account.fromWebCryptoP256(keyPair);
  ```

  ### P256

  ```ts
  import { Account, P256 } from "tempo.ts/viem";

  const privateKey = P256.randomPrivateKey();
  const account = Account.fromP256(privateKey);
  ```

- [`a90d48c`](https://github.com/tempoxyz/tempo-ts/commit/a90d48c049c48601ae4aca78334b13b3ebb2ea85) Thanks [@jxom](https://github.com/jxom)! - Added `dangerous_secp256k1` connector.

- [`a90d48c`](https://github.com/tempoxyz/tempo-ts/commit/a90d48c049c48601ae4aca78334b13b3ebb2ea85) Thanks [@jxom](https://github.com/jxom)! - **Breaking:** Removed `amm.getPoolId`. Use `PoolId.from` from `tempo.ts/ox` instead.

- [`a90d48c`](https://github.com/tempoxyz/tempo-ts/commit/a90d48c049c48601ae4aca78334b13b3ebb2ea85) Thanks [@jxom](https://github.com/jxom)! - Added Wagmi Actions & Hooks for `fee` and `token`.

- [`a90d48c`](https://github.com/tempoxyz/tempo-ts/commit/a90d48c049c48601ae4aca78334b13b3ebb2ea85) Thanks [@jxom](https://github.com/jxom)! - Added `WebAuthnP256`, `P256`, `WebCryptoP256` modules.

- [#43](https://github.com/tempoxyz/tempo-ts/pull/43) [`e932099`](https://github.com/tempoxyz/tempo-ts/commit/e9320992d29e26d59646251a3bccc099a002e7a2) Thanks [@jxom](https://github.com/jxom)! - **Breaking:** Removed `Addresses.defaultFeeToken` and `Addresses.defaultQuoteToken`.

- [`899c120`](https://github.com/tempoxyz/tempo-ts/commit/899c1201a563121bd08f08b012d84439e9d1b816) Thanks [@jxom](https://github.com/jxom)! - **Breaking:**
  - Renamed `updateQuoteToken` to `prepareUpdateQuoteToken`.
  - Renamed `finalizeUpdateQuoteToken` to `updateQuoteToken`.

- [`a90d48c`](https://github.com/tempoxyz/tempo-ts/commit/a90d48c049c48601ae4aca78334b13b3ebb2ea85) Thanks [@jxom](https://github.com/jxom)! - Added support for WebAuthn & P256 accounts with the `Account` module.

- [`a90d48c`](https://github.com/tempoxyz/tempo-ts/commit/a90d48c049c48601ae4aca78334b13b3ebb2ea85) Thanks [@jxom](https://github.com/jxom)! - Added `dex.getOrders`.

- [`a90d48c`](https://github.com/tempoxyz/tempo-ts/commit/a90d48c049c48601ae4aca78334b13b3ebb2ea85) Thanks [@jxom](https://github.com/jxom)! - **Breaking:** Removed `amm.getTotalSupply`. Use `amm.getPool` instead.

- [#43](https://github.com/tempoxyz/tempo-ts/pull/43) [`e932099`](https://github.com/tempoxyz/tempo-ts/commit/e9320992d29e26d59646251a3bccc099a002e7a2) Thanks [@jxom](https://github.com/jxom)! - **Breaking:** Removed `createTempoClient`. Construct your Client with `viem` primitives:

  ```diff
  -import { createTempoClient } from 'tempo.ts/viem'
  +import { createClient, http } from 'viem'
  +import { tempo } from 'tempo.ts/chains'

  -const client = createTempoClient()
  +const client = createClient({
  +  chain: tempo({
  +    feeToken: '0x20c0000000000000000000000000000000000001'
  +  }),
  +  transport: http(),
  +})
  ```

- [`a90d48c`](https://github.com/tempoxyz/tempo-ts/commit/a90d48c049c48601ae4aca78334b13b3ebb2ea85) Thanks [@jxom](https://github.com/jxom)! - Added `tempoDevnet` chain.

- [`a90d48c`](https://github.com/tempoxyz/tempo-ts/commit/a90d48c049c48601ae4aca78334b13b3ebb2ea85) Thanks [@jxom](https://github.com/jxom)! - Added `reward` actions + hooks to `tempo.ts/wagmi`

- [`210b95c`](https://github.com/tempoxyz/tempo-ts/commit/210b95c6ca7a043a7684b7ff869cdf32c7afa0ee) Thanks [@jxom](https://github.com/jxom)! - **Breaking:** Removed `permit` from `Actions.token`

- [`a90d48c`](https://github.com/tempoxyz/tempo-ts/commit/a90d48c049c48601ae4aca78334b13b3ebb2ea85) Thanks [@jxom](https://github.com/jxom)! - Added `tempo.ts/wagmi` entrypoint and `webAuthn` connector.

- [#43](https://github.com/tempoxyz/tempo-ts/pull/43) [`e932099`](https://github.com/tempoxyz/tempo-ts/commit/e9320992d29e26d59646251a3bccc099a002e7a2) Thanks [@jxom](https://github.com/jxom)! - **Breaking:** `feeToken` is now required on all transaction actions. You must either pass `feeToken` explicitly, or hoist a
  `feeToken` on the Client:

  ### Non-hoisted Fee Token

  `feeToken` will need to be set per-action.

  ```ts
  // fee token NOT set on client
  const client2 = createClient({
    chain: tempo({ feeToken: '0x20c0000000000000000000000000000000000001' })
    transport: http(),
  });

  // ⚠️ `feeToken` needs to be set per-action
  await sendTransaction(client2, {
    feeToken: "0x20c...0001",
    to: "0x0000000000000000000000000000000000000000",
  });
  ```

  ### Hoisted Fee Token

  Pass `feeToken` to the Client to apply it to all transactions.

  ```ts
  const client1 = createClient({
    chain: tempo({ feeToken: "0x20c...001" }), // note: pass `null` to opt-in to protocol preferences.
    transport: http(),
  });

  // ✅ no fee token needed, hoisted on client
  await sendTransaction(client1, {
    to: "0x0000000000000000000000000000000000000000",
  });
  ```

### Patch Changes

- [#40](https://github.com/tempoxyz/tempo-ts/pull/40) [`619b943`](https://github.com/tempoxyz/tempo-ts/commit/619b9437bc78a7ef7c7b2344fcc5f0e827a6238d) Thanks [@gorried](https://github.com/gorried)! - **Breaking:** Updated latest chain to Andantino.

- [`a90d48c`](https://github.com/tempoxyz/tempo-ts/commit/a90d48c049c48601ae4aca78334b13b3ebb2ea85) Thanks [@jxom](https://github.com/jxom)! - Added `token.getRoleAdmin`

- [#42](https://github.com/tempoxyz/tempo-ts/pull/42) [`74ed4a7`](https://github.com/tempoxyz/tempo-ts/commit/74ed4a74cc43febca597f681d0b595b242f8d619) Thanks [@gorried](https://github.com/gorried)! - Updated `chain.id` for Andantino.

## 0.1.5

### Patch Changes

- [`09eb31f`](https://github.com/tempoxyz/tempo-ts/commit/09eb31fa3050bff0f9dc9b459656c2ce4b2297f9) Thanks [@jxom](https://github.com/jxom)! - Added `log` option to `tempo` instance.

## 0.1.4

### Patch Changes

- [`c278bf5`](https://github.com/tempoxyz/tempo-ts/commit/c278bf521ffb9e07661f30fe0d2f0bc05a033091) Thanks [@tmm](https://github.com/tmm)! - Exported decorator type

## 0.1.3

### Patch Changes

- [`92312c6`](https://github.com/tempoxyz/tempo-ts/commit/92312c6a4961596de107bf75c7525e8b6c4f781f) Thanks [@jxom](https://github.com/jxom)! - Fixed dist output.

## 0.1.2

### Patch Changes

- [`287924c`](https://github.com/tempoxyz/tempo-ts/commit/287924c21ae250be0fe3d73e5f928e0f9cb1cd5b) Thanks [@jxom](https://github.com/jxom)! - Fixed `token.getMetadata` against the quote token.

- [`5c47beb`](https://github.com/tempoxyz/tempo-ts/commit/5c47bebebbc2efddb0c8cf0702afcba450c7fc80) Thanks [@jxom](https://github.com/jxom)! - `tempo.ts/prool`: Fixed `blockTime` parameter type.

- [`287924c`](https://github.com/tempoxyz/tempo-ts/commit/287924c21ae250be0fe3d73e5f928e0f9cb1cd5b) Thanks [@jxom](https://github.com/jxom)! - Added `TokenId.from` to instantiate a token id from an address or number.

## 0.1.1

### Patch Changes

- [`dd4cd43`](https://github.com/tempoxyz/tempo-ts/commit/dd4cd43fb10ac1a8d766751b1e6f958b62befa07) Thanks [@jxom](https://github.com/jxom)! - Fixed `token.getMetadata` for the default quote token.

## 0.1.0

### Minor Changes

- [#4](https://github.com/tempoxyz/tempo-ts/pull/4) [`528aa00`](https://github.com/tempoxyz/tempo-ts/commit/528aa0019876bf166724378de877a7acfd4a3013) Thanks [@jxom](https://github.com/jxom)! - **Breaking:** Removed support for `type: 'feeToken'` / `type: '0x77'` transactions. Use `type: 'aa'` / `type: '0x76'` transactions instead.

- [#4](https://github.com/tempoxyz/tempo-ts/pull/4) [`528aa00`](https://github.com/tempoxyz/tempo-ts/commit/528aa0019876bf166724378de877a7acfd4a3013) Thanks [@jxom](https://github.com/jxom)! - **Breaking:** Renamed `usdAddress` and `usdId`.

  ```diff
  - import { usdAddress, usdId } from 'tempo.ts/viem'
  + import { Addresses, TokenId } from 'tempo.ts/viem'

  - usdAddress
  + Addresses.defaultFeeToken

  - usdId
  + TokenId.defaultFeeToken
  ```

- [#4](https://github.com/tempoxyz/tempo-ts/pull/4) [`528aa00`](https://github.com/tempoxyz/tempo-ts/commit/528aa0019876bf166724378de877a7acfd4a3013) Thanks [@jxom](https://github.com/jxom)! - `tempo.ts/ox`: Added `TransactionEnvelopeAA` and `SignatureEnvelope`.

- [#4](https://github.com/tempoxyz/tempo-ts/pull/4) [`528aa00`](https://github.com/tempoxyz/tempo-ts/commit/528aa0019876bf166724378de877a7acfd4a3013) Thanks [@jxom](https://github.com/jxom)! - Added **Stablecoin Exchange** actions:
  - `dex.buy`
  - `dex.buySync`
  - `dex.cancel`
  - `dex.cancelSync`
  - `dex.createPair`
  - `dex.createPairSync`
  - `dex.getBalance`
  - `dex.getBuyQuote`
  - `dex.getOrder`
  - `dex.getPriceLevel`
  - `dex.getSellQuote`
  - `dex.place`
  - `dex.placeSync`
  - `dex.placeFlip`
  - `dex.placeFlipSync`
  - `dex.sell`
  - `dex.sellSync`
  - `dex.withdraw`
  - `dex.withdrawSync`
  - `dex.watchFlipOrderPlaced`
  - `dex.watchOrderCancelled`
  - `dex.watchOrderFilled`
  - `dex.watchOrderPlaced`

- [#4](https://github.com/tempoxyz/tempo-ts/pull/4) [`528aa00`](https://github.com/tempoxyz/tempo-ts/commit/528aa0019876bf166724378de877a7acfd4a3013) Thanks [@jxom](https://github.com/jxom)! - **Breaking:** Removed support for deprecated `tempoLento` chain. Update to use `tempoAndante` instead.

- [#4](https://github.com/tempoxyz/tempo-ts/pull/4) [`528aa00`](https://github.com/tempoxyz/tempo-ts/commit/528aa0019876bf166724378de877a7acfd4a3013) Thanks [@jxom](https://github.com/jxom)! - **Breaking:** Refactored structure to use PascalCased namespaces to future-proof against naming conflicts, excessive imports, and future versions of Viem.
  - Renamed `actions` import to `Actions`.

  ```diff
  - import { actions } from 'tempo.ts/viem'
  + import { Actions } from 'tempo.ts/viem'
  ```

  - Renamed `parseTransaction` to `deserialize`.

  ```diff
  - import { parseTransaction } from 'tempo.ts/viem'
  + import { Transaction } from 'tempo.ts/viem'

  - parseTransaction(serialized)
  + Transaction.deserialize(serialized)
  ```

  - Renamed `serializeTransaction` to `serialize`.

  ```diff
  - import { serializeTransaction } from 'tempo.ts/viem'
  + import { Transaction } from 'tempo.ts/viem'

  - serializeTransaction(transaction)
  + Transaction.serialize(transaction)
  ```

  - Placed all `*Abi` exports in the `Abis` namespace.

  ```diff
  - import { tip20Abi } from 'tempo.ts/viem'
  + import { Abis } from 'tempo.ts/viem'

  - tip20Abi
  + Abis.tip20
  ```

  - Placed all `*Address` exports in the `Addresses` namespace.

  ```diff
  - import { feeManagerAddress } from 'tempo.ts/viem'
  + import { Addresses } from 'tempo.ts/viem'

  - feeManagerAddress
  + Addresses.feeManager
  ```

### Patch Changes

- [#4](https://github.com/tempoxyz/tempo-ts/pull/4) [`528aa00`](https://github.com/tempoxyz/tempo-ts/commit/528aa0019876bf166724378de877a7acfd4a3013) Thanks [@jxom](https://github.com/jxom)! - Added `watchUpdateQuoteToken` Action.

- [#4](https://github.com/tempoxyz/tempo-ts/pull/4) [`528aa00`](https://github.com/tempoxyz/tempo-ts/commit/528aa0019876bf166724378de877a7acfd4a3013) Thanks [@jxom](https://github.com/jxom)! - Added `token.updateQuoteToken` and `token.finalizeUpdateQuoteToken` Actions.

## 0.0.6

### Patch Changes

- [`b04eb82`](https://github.com/tempoxyz/tempo-ts/commit/b04eb8278b2b88636311b1821c2238024af89f84) Thanks [@jxom](https://github.com/jxom)! - **Breaking:** `transferPolicy` renamed to `transferPolicyId` on `token.getMetadata` return value. It also now returns a `bigint` instead of a `string`.

## 0.0.5

### Patch Changes

- [`7cd6a18`](https://github.com/tempoxyz/tempo-ts/commit/7cd6a18a52f3c2c8a7b6277935cdcce6ae14511d) Thanks [@jxom](https://github.com/jxom)! - Set `*FeePerGas` fields to undefined for gas estimation.

## 0.0.4

### Patch Changes

- [`7caa3da`](https://github.com/tempoxyz/tempo-ts/commit/7caa3daf124150d254dcce09f26a8ced0bb948a6) Thanks [@jxom](https://github.com/jxom)! - Added support for `throwOnReceiptRevert` on `*Sync` actions.

## 0.0.3

### Patch Changes

- [`c74482a`](https://github.com/tempoxyz/tempo-ts/commit/c74482ace559efeaff4c49e9bcd45cdd3cf37300) Thanks [@jxom](https://github.com/jxom)! - Generated ABIs from Tempo Node precompiles.

- [`739cb02`](https://github.com/tempoxyz/tempo-ts/commit/739cb02551eb758ad556edc58c1097d78e5b6fa6) Thanks [@jxom](https://github.com/jxom)! - Narrowed `TokenRole` type.

- [#10](https://github.com/tempoxyz/tempo-ts/pull/10) [`fd0594d`](https://github.com/tempoxyz/tempo-ts/commit/fd0594df47c8fd943d7d2b95b391af53dfe8f96a) Thanks [@jxom](https://github.com/jxom)! - Added `actions.token.hasRole`.

## 0.0.2

### Patch Changes

- [#7](https://github.com/tempoxyz/tempo-ts/pull/7) [`f955968`](https://github.com/tempoxyz/tempo-ts/commit/f955968212042726fa44b0c78281b3ca502c82a1) Thanks [@tmm](https://github.com/tmm)! - Exported addresses in Viem entrypoint

## 0.0.1

### Patch Changes

- [`8e28099`](https://github.com/tempoxyz/tempo-ts/commit/8e280992b07d6cb7a096f60113cce3815ae24cb6) Thanks [@jxom](https://github.com/jxom)! - Initial release.
