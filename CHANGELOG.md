# tempo.ts

## 0.11.1

### Patch Changes

- [`337d6df`](https://github.com/tempoxyz/tempo-ts/commit/337d6df02f34804f85d3815e51e103802a9fcc56) Thanks [@jxom](https://github.com/jxom)! - Fixed missing exports.

## 0.11.0

### Minor Changes

- [#117](https://github.com/tempoxyz/tempo-ts/pull/117) [`12193a4`](https://github.com/tempoxyz/tempo-ts/commit/12193a4b8ebd92def63b30baef87035bd222a272) Thanks [@jxom](https://github.com/jxom)! - Removed `tempo.ts/prool`. The `tempo` prool instance has been upstreamed directly into `prool`.

  ```diff
  - import { Instance } from 'tempo.ts/prool'
  + import { Instance } from 'prool'

  const instance = Instance.tempo()
  ```

- [#121](https://github.com/tempoxyz/tempo-ts/pull/121) [`378f794`](https://github.com/tempoxyz/tempo-ts/commit/378f794f3dcd2de5aca3f1f67cfdbc2f0b363d33) Thanks [@jxom](https://github.com/jxom)! - **Breaking:** Removed `tempo.ts/ox` entrypoint. Use `ox/tempo` instead.

  ```
  npm i ox
  ```

  ```diff
  - import … from 'tempo.ts/ox'
  + import … from 'ox/tempo'
  ```

### Patch Changes

- [#122](https://github.com/tempoxyz/tempo-ts/pull/122) [`1b3f34f`](https://github.com/tempoxyz/tempo-ts/commit/1b3f34f5527f465617027135ce07783f0aca2ee8) Thanks [@gorried](https://github.com/gorried)! - Fixed `nonce.getNonce` return value.

- [`48a27f3`](https://github.com/tempoxyz/tempo-ts/commit/48a27f35e8de7721c7152c764b531b6d37da5300) Thanks [@jxom](https://github.com/jxom)! - `tempo.ts/viem`: Fixed contract deployments.

## 0.10.5

### Patch Changes

- [`c28007f`](https://github.com/tempoxyz/tempo-ts/commit/c28007feaba887e805a5a334a58fb5caa48a2e1a) Thanks [@jxom](https://github.com/jxom)! - Made chain parameters optional.

## 0.10.4

### Patch Changes

- [`2f1eda2`](https://github.com/tempoxyz/tempo-ts/commit/2f1eda204250e8d20e55802f884724593a65d74d) Thanks [@jxom](https://github.com/jxom)! - Removed `multicall` contracts from chain. Rely on deployless instead.

## 0.10.3

### Patch Changes

- [#112](https://github.com/tempoxyz/tempo-ts/pull/112) [`11a0ddd`](https://github.com/tempoxyz/tempo-ts/commit/11a0ddd97f8a923152415e3454e063647d9284fa) Thanks [@gorried](https://github.com/gorried)! - Added `nonce` Actions & Hooks.

## 0.10.2

### Patch Changes

- [`8204289`](https://github.com/tempoxyz/tempo-ts/commit/82042894c38404b0cd282d59819269adb4cd238d) Thanks [@jxom](https://github.com/jxom)! - Updated `tempoDev` chain id.

- [`a0e1745`](https://github.com/tempoxyz/tempo-ts/commit/a0e17454c3f8a36175b3131a3e06784b12f3d443) Thanks [@jxom](https://github.com/jxom)! - Added missing properties to actions.

- [`888f10b`](https://github.com/tempoxyz/tempo-ts/commit/888f10be87641444171572e5f2898b2e6b969402) Thanks [@jxom](https://github.com/jxom)! - Fixed issue where zeroish `nonceKey`s would not use protocol nonce. This is an issue to be fixed upstream in Tempo.

## 0.10.1

### Patch Changes

- [`e54df78`](https://github.com/tempoxyz/tempo-ts/commit/e54df7859704d2fcc3f4e712aeba9d436ca9f801) Thanks [@tmm](https://github.com/tmm)! - Added block explorer to Tempo Testnet chain definition.

## 0.10.0

### Minor Changes

- [#108](https://github.com/tempoxyz/tempo-ts/pull/108) [`c2f353a`](https://github.com/tempoxyz/tempo-ts/commit/c2f353a1e7b0da380d3600f5839cfb61fcb52b17) Thanks [@jxom](https://github.com/jxom)! - **Breaking (`tempo.ts/wagmi`):** Changed default `expiry` of `Connector.webAuthn` connector access keys to one day (previously unlimited).

- [#108](https://github.com/tempoxyz/tempo-ts/pull/108) [`c2f353a`](https://github.com/tempoxyz/tempo-ts/commit/c2f353a1e7b0da380d3600f5839cfb61fcb52b17) Thanks [@jxom](https://github.com/jxom)! - `tempo.ts/wagmi`: Added ability to pass `expiry` and `limits` to `webAuthn#grantAccessKey`.

- [#108](https://github.com/tempoxyz/tempo-ts/pull/108) [`c2f353a`](https://github.com/tempoxyz/tempo-ts/commit/c2f353a1e7b0da380d3600f5839cfb61fcb52b17) Thanks [@jxom](https://github.com/jxom)! - **Breaking (`tempo.ts/wagmi`):** Removed `"lax"` option from `Connector.webAuthn#grantAccessKey` connector. The "lax" behavior is now the default. To opt-in to "strict mode", set `strict: true` in the `grantAccessKey` options.

### Patch Changes

- [#38](https://github.com/tempoxyz/tempo-ts/pull/38) [`0861c0d`](https://github.com/tempoxyz/tempo-ts/commit/0861c0d07ccd73a3be4f2562f969df3bd43a9398) Thanks [@jxom](https://github.com/jxom)! - `tempo.ts/ox`: Added `AuthorizationTempo` for Tempo-flavoured 7702 auths.

## 0.9.0

### Minor Changes

- [#105](https://github.com/tempoxyz/tempo-ts/pull/105) [`c6a57d8`](https://github.com/tempoxyz/tempo-ts/commit/c6a57d82f2c736596553857190edbe675181dfec) Thanks [@jxom](https://github.com/jxom)! - **Breaking:** Renamed all "AA" references to "Tempo".

  ### `tempo.ts/ox`
  - `TransactionEnvelopeAA` → `TransactionEnvelopeTempo`
  - `Transaction.AA` → `Transaction.Tempo`
  - `Transaction.AARpc` → `Transaction.TempoRpc`
  - `type: 'aa'` → `type: 'tempo'`

  ### `tempo.ts/viem`
  - `TransactionAA` → `TransactionTempo`
  - `TransactionRequestAA` → `TransactionRequestTempo`
  - `TransactionSerializableAA` → `TransactionSerializableTempo`
  - `TransactionSerializedAA` → `TransactionSerializedTempo`
  - `type: 'aa'` → `type: 'tempo'`

## 0.8.3

### Patch Changes

- [`c092cfa`](https://github.com/tempoxyz/tempo-ts/commit/c092cfad47898d10f621da8bad5e414a624dd05e) Thanks [@jxom](https://github.com/jxom)! - `tempo.ts/viem`: Fixed `account` type on transaction requests.

## 0.8.2

### Patch Changes

- [#102](https://github.com/tempoxyz/tempo-ts/pull/102) [`b7d18b1`](https://github.com/tempoxyz/tempo-ts/commit/b7d18b1b1791a6c51d13fe3230f4c72e0ff8f0bd) Thanks [@gorried](https://github.com/gorried)! - Added `watchRewardRecipientSet` and `watchRewardScheduled` actions and hooks.

- [`5280a23`](https://github.com/tempoxyz/tempo-ts/commit/5280a23688c087b8e4b8c874003e536ab5874552) Thanks [@jxom](https://github.com/jxom)! - `tempo.ts/viem`: Removed `eip1559 → aa` type conversion in `Transaction.serialize`.

## 0.8.1

### Patch Changes

- [#100](https://github.com/tempoxyz/tempo-ts/pull/100) [`6df2c1a`](https://github.com/tempoxyz/tempo-ts/commit/6df2c1a34f6c8e40eebf0fa0392a21d527bccf58) Thanks [@gorried](https://github.com/gorried)! - Added `getUserRewardInfo` actions & hooks.

## 0.8.0

### Minor Changes

- [#84](https://github.com/tempoxyz/tempo-ts/pull/84) [`4524445`](https://github.com/tempoxyz/tempo-ts/commit/45244456dda69c590c912a1ea914abcdf02b2f61) Thanks [@jxom](https://github.com/jxom)! - **Breaking:** Renamed `tempoDev` chain to `tempoDevnet`.

- [#84](https://github.com/tempoxyz/tempo-ts/pull/84) [`4524445`](https://github.com/tempoxyz/tempo-ts/commit/45244456dda69c590c912a1ea914abcdf02b2f61) Thanks [@jxom](https://github.com/jxom)! - **Breaking:** Renamed `linkingUsd` to `pathUsd`.

- [#84](https://github.com/tempoxyz/tempo-ts/pull/84) [`4524445`](https://github.com/tempoxyz/tempo-ts/commit/45244456dda69c590c912a1ea914abcdf02b2f61) Thanks [@jxom](https://github.com/jxom)! - **Breaking:** Removed `createAccount` capability from `webAuthn` connector. Use `type: 'sign-up'` instead.

- [#84](https://github.com/tempoxyz/tempo-ts/pull/84) [`4524445`](https://github.com/tempoxyz/tempo-ts/commit/45244456dda69c590c912a1ea914abcdf02b2f61) Thanks [@jxom](https://github.com/jxom)! - **Breaking:** Removed `tempoAndantino` chain. Use `tempoTestnet` instead.

### Patch Changes

- [#84](https://github.com/tempoxyz/tempo-ts/pull/84) [`4524445`](https://github.com/tempoxyz/tempo-ts/commit/45244456dda69c590c912a1ea914abcdf02b2f61) Thanks [@jxom](https://github.com/jxom)! - `tempo.ts/ox`: Added `keychain` type to `SignatureEnvelope`.

- [#84](https://github.com/tempoxyz/tempo-ts/pull/84) [`4524445`](https://github.com/tempoxyz/tempo-ts/commit/45244456dda69c590c912a1ea914abcdf02b2f61) Thanks [@jxom](https://github.com/jxom)! - `tempo.ts/ox`: Added `KeyAuthorization` module.

- [#84](https://github.com/tempoxyz/tempo-ts/pull/84) [`4524445`](https://github.com/tempoxyz/tempo-ts/commit/45244456dda69c590c912a1ea914abcdf02b2f61) Thanks [@jxom](https://github.com/jxom)! - `tempo.ts/viem`: Added `signKeyAuthorization` function to the `Account` to sign over key authorizations.

- [#84](https://github.com/tempoxyz/tempo-ts/pull/84) [`4524445`](https://github.com/tempoxyz/tempo-ts/commit/45244456dda69c590c912a1ea914abcdf02b2f61) Thanks [@jxom](https://github.com/jxom)! - `tempo.ts/viem`: Added `access` attribute to `Account` to indicate if the account is an "access key" variant.

- [#84](https://github.com/tempoxyz/tempo-ts/pull/84) [`4524445`](https://github.com/tempoxyz/tempo-ts/commit/45244456dda69c590c912a1ea914abcdf02b2f61) Thanks [@jxom](https://github.com/jxom)! - `tempo.ts/ox`: Added `keyAuthorization` attribute to `Transaction` & `TransactionEnvelopeAA`.

- [#84](https://github.com/tempoxyz/tempo-ts/pull/84) [`4524445`](https://github.com/tempoxyz/tempo-ts/commit/45244456dda69c590c912a1ea914abcdf02b2f61) Thanks [@jxom](https://github.com/jxom)! - `tempo.ts/wagmi`: Added `grantAccessKey` attribute to the `webAuthn` connector.

## 0.7.6

### Patch Changes

- [#96](https://github.com/tempoxyz/tempo-ts/pull/96) [`02c4885`](https://github.com/tempoxyz/tempo-ts/commit/02c48851cb11d664fc974157c31c2cb6fb478542) Thanks [@gorried](https://github.com/gorried)! - Adds FeeAMM decorators for burn, rebalanceSwap, and associated watch events

## 0.7.5

### Patch Changes

- [`3c43d28`](https://github.com/tempoxyz/tempo-ts/commit/3c43d283b6bd841a3c67bdf765376203e2a8a28b) Thanks [@jxom](https://github.com/jxom)! - Propogated `options` in `Handler.feePayer`.

## 0.7.4

### Patch Changes

- [`1b5c63b`](https://github.com/tempoxyz/tempo-ts/commit/1b5c63bfd3ebb348049b3051baf093620af2b2a6) Thanks [@jxom](https://github.com/jxom)! - Added `headers` to `Handler` functions.

## 0.7.3

### Patch Changes

- [`f0369cd`](https://github.com/tempoxyz/tempo-ts/commit/f0369cd13c6d651c2aff1abe85e7984a60588f0f) Thanks [@jxom](https://github.com/jxom)! - Added error handling to `Handler.feePayer`.

## 0.7.2

### Patch Changes

- [#90](https://github.com/tempoxyz/tempo-ts/pull/90) [`625c8e4`](https://github.com/tempoxyz/tempo-ts/commit/625c8e4a4b0c4fac3d6c278c9a964fc5d6b7a78f) Thanks [@jxom](https://github.com/jxom)! - Added `Handler.compose` to compose multiple handlers into a single handler.

  ```ts
  import { Handler, Kv } from 'tempo.ts/server'

  const handler = Handler.compose([
    Handler.feePayer({
      account,
      client,
      path: '/fee-payer'
    }),
    Handler.keyManager({
      kv: Kv.memory()
      path: '/key'
    }),
  ], { path: '/api' })

  Bun.serve(handler) // Bun
  Deno.serve(handler) // Deno
  createServer(handler.listener) // Node.js
  app.use(c => handler.fetch(c.req.raw)) // Hono
  app.use(handler.listener) // Express

  // Exposed endpoints:
  // - '/api/fee-payer'
  // - '/api/key/*'
  ```

## 0.7.1

### Patch Changes

- [`e2c53ba`](https://github.com/tempoxyz/tempo-ts/commit/e2c53ba9bebe8cbda19dfe531fef95d963fcd8af) Thanks [@jxom](https://github.com/jxom)! - Added back `amm` actions.

## 0.7.0

### Minor Changes

- [#88](https://github.com/tempoxyz/tempo-ts/pull/88) [`f6da019`](https://github.com/tempoxyz/tempo-ts/commit/f6da019ddcef6eb5c492e6bf853d2fc4e15fac64) Thanks [@jxom](https://github.com/jxom)! - Removed `userToken.amount` from `amm.mint`, and flattened the API:

  ```diff
  Actions.amm.mint({
  - userToken: {
  -   address: '0x...',
  -   amount: 100n,
  - },
  + userTokenAddress: '0x...',
  - validatorToken: {
  -   address: '0x...',
  -   amount: 100n,
  - },
  + validatorTokenAddress: '0x...',
  + validatorTokenAmount: 100n,
    to: '0x...',
  })
  ```

- [#88](https://github.com/tempoxyz/tempo-ts/pull/88) [`f6da019`](https://github.com/tempoxyz/tempo-ts/commit/f6da019ddcef6eb5c492e6bf853d2fc4e15fac64) Thanks [@jxom](https://github.com/jxom)! - Removed the following APIs:

  #### `tempo.ts/viem`
  - `Actions.amm.rebalanceSwap`
  - `Actions.amm.rebalanceSwapSync`
  - `Actions.amm.watchRebalanceSwap`
  - `Actions.amm.watchFeeSwap`
  - `Actions.amm.watchBurn`
  - `Actions.reward.cancel`
  - `Actions.reward.cancelSync`
  - `Actions.reward.getStream`

  #### `tempo.ts/wagmi`
  - `Actions.amm.rebalanceSwap`
  - `Actions.amm.rebalanceSwapSync`
  - `Actions.amm.burn`
  - `Actions.amm.burnSync`
  - `Actions.amm.watchRebalanceSwap`
  - `Actions.amm.watchFeeSwap`
  - `Actions.amm.watchBurn`
  - `Actions.reward.cancel`
  - `Actions.reward.cancelSync`
  - `Actions.reward.getStream`
  - `Hooks.amm.useBurn`
  - `Hooks.amm.useBurnSync`
  - `Hooks.amm.useWatchMint`
  - `Hooks.reward.useCancel`
  - `Hooks.reward.useCancelSync`
  - `Hooks.reward.useGetStream`

### Patch Changes

- [#87](https://github.com/tempoxyz/tempo-ts/pull/87) [`e5ff1a4`](https://github.com/tempoxyz/tempo-ts/commit/e5ff1a41bf53834348604a55480ab5acc0492a9c) Thanks [@jxom](https://github.com/jxom)! - Added `Handler.feePayer` server handler for fee sponsorship.

  `Handler.feePayer` returns a `fetch` or `listener` handler that can be used by the majority of
  server frameworks.

  For example:

  ```ts
  import { privateKeyToAccount } from "viem/accounts";
  import { Handler } from "tempo.ts/server";
  import { client } from "./viem.config";

  const handler = Handler.feePayer({
    account: privateKeyToAccount("0x..."),
    client,
  });

  // Node.js
  import { createServer } from "node:http";
  const server = createServer(handler.listener);
  server.listen(3000);

  // Bun
  Bun.serve(handler);

  // Cloudflare
  export default {
    fetch(request) {
      return handler.fetch(request);
    },
  };

  // Express
  import express from "express";
  const app = express();
  app.use(handler.listener);
  app.listen(3000);
  ```

- [#82](https://github.com/tempoxyz/tempo-ts/pull/82) [`94388bc`](https://github.com/tempoxyz/tempo-ts/commit/94388bcaa88ae85c4848c5bdfce6254f5b21218d) Thanks [@jxom](https://github.com/jxom)! - Added `tempo.ts/server` entrypoint with a `Handler` module. The `Handler` module provides a `keyManager` handler to instantiate a lightweight Key Manager API to use for WebAuthn credential management.

  Each `Handler` function returns a `fetch` or `listener` handler that can be used by the majority of
  server frameworks.

  For example:

  ```ts
  import { Handler, Kv } from "tempo.ts/server";

  const handler = Handler.keyManager({ kv: Kv.memory() });

  // Node.js
  import { createServer } from "node:http";
  const server = createServer(handler.listener);
  server.listen(3000);

  // Bun
  Bun.serve(handler);

  // Cloudflare
  export default {
    fetch(request) {
      return handler.fetch(request);
    },
  };

  // Express
  import express from "express";
  const app = express();
  app.use(handler.listener);
  app.listen(3000);
  ```

## 0.6.2

### Patch Changes

- [#80](https://github.com/tempoxyz/tempo-ts/pull/80) [`ec4fb0d`](https://github.com/tempoxyz/tempo-ts/commit/ec4fb0d99868cb16fe28fdf0053253e01adc8c33) Thanks [@jxom](https://github.com/jxom)! - `tempo.ts/viem`: Added `verifyHash` action.

## 0.6.1

### Patch Changes

- [`82d51eb`](https://github.com/tempoxyz/tempo-ts/commit/82d51eb5dfa872b0a6b2dfdb6da78660ebb07c4e) Thanks [@jxom](https://github.com/jxom)! - Published CHANGELOG.md

## 0.6.0

### Minor Changes

- [#71](https://github.com/tempoxyz/tempo-ts/pull/71) [`95d4649`](https://github.com/tempoxyz/tempo-ts/commit/95d464995bc13d5ba46a91f9e2a6f7b1c14675e0) Thanks [@gorried](https://github.com/gorried)! - Renamed `Instance#faucet.address` to `faucet.addresses` in order to support multiple tokens.

- [#78](https://github.com/tempoxyz/tempo-ts/pull/78) [`6c20dc0`](https://github.com/tempoxyz/tempo-ts/commit/6c20dc090b21a092e90855c7244d9c9d5d22930d) Thanks [@jxom](https://github.com/jxom)! - **Breaking:** Removed `feePayer` from `Transaction`. Extract the `feePayer` from `TransactionReceipt` instead.

### Patch Changes

- [`57ee208`](https://github.com/tempoxyz/tempo-ts/commit/57ee2084c40929dba587ccd5b4ed1aac4cb327b9) Thanks [@jxom](https://github.com/jxom)! - Removed sig envelope assertions on account signing.

- [#74](https://github.com/tempoxyz/tempo-ts/pull/74) [`b604600`](https://github.com/tempoxyz/tempo-ts/commit/b604600fd2c0202807175d4f669db648cb5dae95) Thanks [@gorried](https://github.com/gorried)! - Fixed formatting of `addresses` when starting prool `Instance`

- [`e82713f`](https://github.com/tempoxyz/tempo-ts/commit/e82713f192206e94a63e425307cb1566ce800092) Thanks [@jxom](https://github.com/jxom)! - Normalized `credential` before storing.

## 0.5.4

### Patch Changes

- [`3961295`](https://github.com/tempoxyz/tempo-ts/commit/3961295ef1079deb6b5031114614216aa69bbd57) Thanks [@jxom](https://github.com/jxom)! - Added `timeout` property to `faucet.fundSync`.

## 0.5.3

### Patch Changes

- [`dd6275a`](https://github.com/tempoxyz/tempo-ts/commit/dd6275a11642d2c02c1616c7360fb91aff5bfc85) Thanks [@jxom](https://github.com/jxom)! - Added `fundSync` action and `useFundSync` hook in `tempo.ts/wagmi`.

- [`fa39d52`](https://github.com/tempoxyz/tempo-ts/commit/fa39d52fd7f4d164ab7a89a6281c7b95db139fd3) Thanks [@jxom](https://github.com/jxom)! - Fixed fee token preferences when a `feePayer` is supplied to transactions.

## 0.5.2

### Patch Changes

- [`6b0e328`](https://github.com/tempoxyz/tempo-ts/commit/6b0e328e4bff2c6e4a701487c4b41e3780396c57) Thanks [@jxom](https://github.com/jxom)! - Added `walletNamespaceCompat` transport to `tempo.ts/viem` so local accounts can leverage `wallet_` RPC actions (`sendCalls`, etc).

- [#64](https://github.com/tempoxyz/tempo-ts/pull/64) [`3aa7cb7`](https://github.com/tempoxyz/tempo-ts/commit/3aa7cb7d4fd8a7505d0752372c229ce818c47af8) Thanks [@tmm](https://github.com/tmm)! - Added Wagmi Policy Actions/Hooks

## 0.5.1

### Patch Changes

- [`640df1c`](https://github.com/tempoxyz/tempo-ts/commit/640df1cd37820bf6605724d98adb520d2b8e5a33) Thanks [@jxom](https://github.com/jxom)! - Added support for \`eth_fillTransaction\`

## 0.5.0

### Minor Changes

- [`8bb03a5`](https://github.com/tempoxyz/tempo-ts/commit/8bb03a594238897c6aa68d87ff93442069a017cc) Thanks [@jxom](https://github.com/jxom)! - **Breaking(`tempo.ts/prool`):** Migrated to support Tempo Docker container from using a standalone Tempo binary.

### Patch Changes

- [`8bb03a5`](https://github.com/tempoxyz/tempo-ts/commit/8bb03a594238897c6aa68d87ff93442069a017cc) Thanks [@jxom](https://github.com/jxom)! - Added `tempoTestnet` chain.

- [`8bb03a5`](https://github.com/tempoxyz/tempo-ts/commit/8bb03a594238897c6aa68d87ff93442069a017cc) Thanks [@jxom](https://github.com/jxom)! - Updated `tempoDev` chain ID.

## 0.4.4

### Patch Changes

- [`fd95d62`](https://github.com/tempoxyz/tempo-ts/commit/fd95d62381006f9e7bdaaee3f362977563852868) Thanks [@tmm](https://github.com/tmm)! - Fixed TSDoc using incorrect role

- [`cd5e46b`](https://github.com/tempoxyz/tempo-ts/commit/cd5e46b47d44110c7e32357b94b934f8b390cf70) Thanks [@jxom](https://github.com/jxom)! - Added ERC-5792 compatibility to Wagmi connectors.

## 0.4.3

### Patch Changes

- [`9b2ad01`](https://github.com/tempoxyz/tempo-ts/commit/9b2ad016687b06dbadd6bad2e90dfa1b2722c913) Thanks [@jxom](https://github.com/jxom)! - Fixed `feeToken` hoisting.

- [`626134c`](https://github.com/tempoxyz/tempo-ts/commit/626134c7a144af051daadc175c80f3727c4d445c) Thanks [@jxom](https://github.com/jxom)! - Enhanced wallet compatibility.

## 0.4.2

### Patch Changes

- [`e6af89f`](https://github.com/tempoxyz/tempo-ts/commit/e6af89f725633da4320d618e58d13952e758f66e) Thanks [@jxom](https://github.com/jxom)! - Tweaked Wagmi types for `feeToken`.

## 0.4.1

### Patch Changes

- [`b3aa00d`](https://github.com/tempoxyz/tempo-ts/commit/b3aa00dfa60ecf60b888104616002239d2b54323) Thanks [@jxom](https://github.com/jxom)! - Added `rpId` parameter to `webAuthn` connector.

## 0.4.0

### Minor Changes

- [#49](https://github.com/tempoxyz/tempo-ts/pull/49) [`28f1853`](https://github.com/tempoxyz/tempo-ts/commit/28f18537eda6c0e93badf0175154cc452cbd96ab) Thanks [@jxom](https://github.com/jxom)! - **Breaking:** Renamed `dex.getPriceLevel` to `dex.getTickLevel`.

## 0.3.0

### Minor Changes

- [`6230a60`](https://github.com/tempoxyz/tempo-ts/commit/6230a60f3bd55f6d98b682ea2b6bc34629c5386d) Thanks [@jxom](https://github.com/jxom)! - **Breaking:** Modified `fee.getUserToken` to return `null` when no user token is set.

### Patch Changes

- [#46](https://github.com/tempoxyz/tempo-ts/pull/46) [`4bcade6`](https://github.com/tempoxyz/tempo-ts/commit/4bcade6c284cbe6ec5fa245dcc0dd3d705ed7aae) Thanks [@jxom](https://github.com/jxom)! - Pruned `package.json` before publish of unneeded properties.

- [`3ecd488`](https://github.com/tempoxyz/tempo-ts/commit/3ecd488c8c3dfe70f6c979d353df959f0081390e) Thanks [@jxom](https://github.com/jxom)! - Added `const` to `Chain.define`

- [`5aeecc2`](https://github.com/tempoxyz/tempo-ts/commit/5aeecc2512d5dbd5c06ac5067fbe11113c1103fd) Thanks [@jxom](https://github.com/jxom)! - Fixed \`Chain.define\` type.

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
  +import { tempo } from 'viem/chains'

  -const client = createTempoClient()
  +const client = createClient({
  +  chain: tempoTestnet.extend({
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
    chain: tempoTestnet
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
    chain: tempoTestnet.extend({ feeToken: "0x20c...001" }), // note: pass `null` to opt-in to protocol preferences.
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
