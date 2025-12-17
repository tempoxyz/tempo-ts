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
> `tempo.ts/viem` & `tempo.ts/wagmi` have been upstreamed into Viem and Wagmi, and removed as of `tempo.ts@0.12.0`.
> See [Migrating from `tempo.ts` to Wagmi or Viem](./.github/viem-wagmi-migration.md)

## Install

```sh
pnpm i tempo.ts
```

## Entrypoints

| Entrypoint       | Description                              |
| ---------------- | ---------------------------------------- |
| `tempo.ts/server`  | Server handlers for Tempo.               |

## Usage

### `tempo.ts/server`

```ts
import { createServer } from 'node:http'
import { createClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { tempoTestnet } from 'viem/chains'
import { Handler } from 'tempo.ts/server'

const client = createClient({
  chain: tempoTestnet.extend({ 
    feeToken: '0x20c0000000000000000000000000000000000001' 
  }),
  transport: http(),
})

const handler = Handler.feePayer({
  account: privateKeyToAccount('0x...'),
  client,
})

const server = createServer(handler.listener)
server.listen(3000)
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
