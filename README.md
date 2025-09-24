# Tempo TS

> [!NOTE]
> This is a temporary package for TypeScript tooling for Tempo.
> It will be merged into [Wevm](https://github.com/wevm) repositories soon.

## Install

```sh
pnpm i tempo@github:tempoxyz/tempo-ts#main
```

If you wish to use `tempo/prool` for programmatic Tempo node instances, you will need
to have the `tempo` binary installed:

```sh
gh repo clone tempoxyz/tempo && cd tempo
cargo install --path bin/tempo
```

## Entrypoints

| Entrypoint | Description |
| ---------- | ----------- |
| `tempo/viem` | Tempo extension for Viem. |
| `tempo/ox` | Tempo primitives for Ox. |
| `tempo/prool` | Tempo instance for pooled HTTP/WS tests. |

## Usage

### `tempo/viem`

TODO

### `tempo/ox`

```ts
import { Secp256k1, Value } from 'ox'
import { TransactionEnvelopeFeeToken as TxFeeToken } from 'tempo/ox'

const envelope = TxFeeToken.from({
  chainId: 1,
  feeToken: '0x20c0000000000000000000000000000000000001',
  maxFeePerGas: Value.fromGwei('10'),
  maxPriorityFeePerGas: Value.fromGwei('1'),
  to: '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef',
  value: Value.fromEther('1'),
})

const signature = Secp256k1.sign({
  payload: TxFeeToken.getSignPayload(envelope),
  privateKey: '0x...',
})

const envelope_signed = TxFeeToken.from(envelope, {
  signature,
})
```

### `tempo/prool`

You can programmatically start a Tempo node instance in TypeScript using `Instance.tempo`:

```ts
import { Instance } from 'tempo/prool'

const instance = Instance.tempo()

await instance.start()
// ...
await instance.stop()
```
