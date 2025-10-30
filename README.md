# Tempo TS

> [!NOTE]
> This is a temporary package for TypeScript tooling for Tempo.
> It will be merged into [Wevm](https://github.com/wevm) repositories soon.

## Install

```sh
pnpm i tempo.ts
```

If you wish to use `tempo.ts/prool` for programmatic Tempo node instances, you will need
to have the `tempo` binary installed:

```sh
gh repo clone tempoxyz/tempo && cd tempo
cargo install --path bin/tempo
```

## Entrypoints

| Entrypoint       | Description                              |
| ---------------- | ---------------------------------------- |
| `tempo.ts/viem`  | Tempo extension for Viem.                |
| `tempo.ts/wagmi` | Tempo actions/hooks for Wagmi.           |
| `tempo.ts/ox`    | Tempo primitives for Ox.                 |
| `tempo.ts/prool` | Tempo instance for pooled HTTP/WS tests. |

## Usage

### `tempo.ts/viem`

```ts
import { createClient, http, publicActions, walletActions } from 'viem';
import { tempo } from 'tempo.ts/chains';

const client = createClient({
  chain: tempo,
  transport: http(),
})
  .extend(publicActions)
  .extend(walletActions);

const hash = await client.sendTransaction({
  calls: [
    { data: '0x...', to: '0x...' },
    { data: '0x...', to: '0x...' },
  ],
  feeToken: '0x20c0000000000000000000000000000000000000',
});

const transaction = await client.getTransaction({ hash });
```

### `tempo.ts/wagmi`

```ts
import { createConfig, http } from 'wagmi';
import { tempo } from 'tempo.ts/chains';
import { Actions, Hooks, webauthn } from 'tempo.ts/wagmi';

export const config = createConfig({
  chains: [tempo],
  connectors: [webAuthn()],
  transports: {
    [tempo.id]: http(),
  },
});

const { receipt } = await Actions.dex.buySync(config, {
  tokenIn: '0x...',
  tokenOut: '0x...',
  amountOut: parseEther('100'),
  maxAmountIn: parseEther('150'),
});

const { data, mutate } = Hooks.dex.useBuySync();
mutate({
  tokenIn: '0x...',
  tokenOut: '0x...',
  amountOut: parseEther('100'),
  maxAmountIn: parseEther('150'),
});
```

### `tempo.ts/ox`

```ts
import { Secp256k1, Value } from 'ox';
import { TransactionEnvelopeFeeToken as TxFeeToken } from 'tempo.ts/ox';

const envelope = TxFeeToken.from({
  chainId: 1,
  feeToken: '0x20c0000000000000000000000000000000000001',
  maxFeePerGas: Value.fromGwei('10'),
  maxPriorityFeePerGas: Value.fromGwei('1'),
  to: '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef',
  value: Value.fromEther('1'),
});

const signature = Secp256k1.sign({
  payload: TxFeeToken.getSignPayload(envelope),
  privateKey: '0x...',
});

const envelope_signed = TxFeeToken.from(envelope, {
  signature,
});
```

### `tempo.ts/prool`

You can programmatically start a Tempo node instance in TypeScript using `Instance.tempo`:

```ts
import { Instance } from 'tempo.ts/prool';

const instance = Instance.tempo();

await instance.start();
// ...
await instance.stop();
```
