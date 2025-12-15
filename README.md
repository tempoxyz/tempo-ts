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
| `tempo.ts/wagmi` | Tempo actions/hooks for Wagmi.           |

## Usage

### `tempo.ts/wagmi`

```ts
import { createConfig, http } from 'wagmi';
import { tempoTestnet } from 'wagmi/chains';
import { Actions, Hooks, KeyManager, webauthn } from 'tempo.ts/wagmi';

export const config = createConfig({
  chains: [tempoTestnet],
  connectors: [
    webAuthn({
      keyManager: KeyManager.localStorage(),
    })
  ],
  transports: {
    [tempoTestnet.id]: http(),
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
