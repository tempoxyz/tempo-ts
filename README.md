<br>
<br>

<p align="center">
  <a href="https://tempo.xyz">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/tempoxyz/.github/refs/heads/main/assets/combomark-dark.svg">
      <img alt="tempo combomark" src="https://raw.githubusercontent.com/tempoxyz/.github/refs/heads/main/assets/combomark-bright.svg" width="auto" height="120">
    </picture>
  </a>
</p>

<br>
<br>

# Tempo TS

> [!NOTE]
> This is a temporary package for TypeScript tooling for Tempo.
> It will be merged into [Wevm](https://github.com/wevm) repositories soon.

## Install

```sh
pnpm i tempo.ts
```

If you wish to use `tempo.ts/prool` for programmatic Tempo node instances, you will need
to ensure you have access to [`tempoxyz/tempo`](https://github.com/tempoxyz/tempo) and are logged into the GitHub Container Registry:

```sh
docker login ghcr.io
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
  chain: tempo({ feeToken: '0x20c0000000000000000000000000000000000001' }),
  transport: http(),
})
  .extend(publicActions)
  .extend(walletActions);

const hash = await client.sendTransaction({
  calls: [
    { data: '0x...', to: '0x...' },
    { data: '0x...', to: '0x...' },
  ],
});

const transaction = await client.getTransaction({ hash });
```

### `tempo.ts/wagmi`

```ts
import { createConfig, http } from 'wagmi';
import { tempo } from 'tempo.ts/chains';
import { Actions, Hooks, webauthn } from 'tempo.ts/wagmi';

export const config = createConfig({
  chains: [tempo({ feeToken: '0x20c0000000000000000000000000000000000001' })],
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

## Contributing

Our contributor guidelines can be found in [`CONTRIBUTING.md`](https://github.com/tempoxyz/tempo-ts?tab=contributing-ov-file).

## Security

See [`SECURITY.md`](https://github.com/tempoxyz/tempo-ts?tab=security-ov-file).

## License

Licensed under either of [Apache License](./LICENSE-APACHE), Version
2.0 or [MIT License](./LICENSE-MIT) at your option.

Unless you explicitly state otherwise, any contribution intentionally submitted
for inclusion in these crates by you, as defined in the Apache-2.0 license,
shall be dual licensed as above, without any additional terms or conditions.
