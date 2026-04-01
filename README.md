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

# Tempo TypeScript SDK

`tempo.ts` provides server-side building blocks for Tempo onboarding and fee
handling flows.

As of `viem@2.43.0`, Tempo chain definitions and `tempo.ts/viem` helpers were
upstreamed into `viem`. This repository now focuses on framework-agnostic
server handlers you can use alongside `viem` in production Tempo apps.

## Install

```sh
pnpm i tempo.ts
```

## What You Can Build

- Passkey onboarding with a lightweight credential key manager
- Fee sponsorship services for Tempo transactions
- Payment backends that combine Tempo server handlers with `viem`

## Quickstarts

- [Key Manager](./examples/key-manager-node/README.md)
- [Fee Payer](./examples/fee-payer-node/README.md)
- [TIP-20 Payment Backend](./examples/tip20-payment-backend/README.md)

If you are running the examples from a source checkout, build the package first:

```sh
pnpm install
pnpm build
```

## viem vs tempo.ts

Use `viem` for:

- Tempo chain configuration
- Tempo transaction construction and signing
- Account abstractions and client transports

Use `tempo.ts/server` for:

- WebAuthn credential registration flows
- Fee payer / sponsorship services
- Small server-side onboarding primitives that sit in front of Tempo RPC

## Entrypoints

| Entrypoint        | Description |
| ----------------- | ----------- |
| `tempo.ts/server` | Framework-agnostic server handlers such as `Handler.keyManager` and `Handler.feePayer`. |

## Minimal Usage

### Key Manager

```ts
import { createServer } from 'node:http'
import { Handler, Kv } from 'tempo.ts/server'

const handler = Handler.keyManager({
  kv: Kv.memory(),
  rp: {
    id: 'localhost',
    name: 'Tempo Demo',
  },
})

createServer(handler.listener).listen(3000)
```

### Fee Payer

```ts
import { createServer } from 'node:http'
import { createClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { tempoModerato } from 'viem/chains'
import { Handler } from 'tempo.ts/server'

const client = createClient({
  chain: tempoModerato.extend({
    feeToken: '0x20c0000000000000000000000000000000000001',
  }),
  transport: http('https://rpc.moderato.tempo.xyz'),
})

const handler = Handler.feePayer({
  account: privateKeyToAccount('0x...'),
  client,
})

createServer(handler.listener).listen(3000)
```

See the [examples](./examples/) directory for runnable setups.

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
