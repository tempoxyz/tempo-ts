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

## Entrypoints

| Entrypoint        | Description                              |
| ----------------- | ---------------------------------------- |
| `tempo.ts/server` | Framework-agnostic server handlers.      |

## Usage

### `tempo.ts/server`

```ts
import { Handler } from 'tempo.ts/server'
import { account, client } from './config'
 
const handler = Handler.feePayer({
  account,
  client,
  feeToken: '0x20c0…0001'
  path: '/fee-payer',
})
 
createServer(handler.listener) // Node.js
 
Bun.serve(handler) // Bun
 
Deno.serve(handler) // Deno
 
app.all('*', c => handler.fetch(c.request)) // Elysia
 
app.use(handler.listener) // Express
 
app.use(c => handler.fetch(c.req.raw)) // Hono
 
export const GET = handler.fetch // Next.js
export const POST = handler.fetch // Next.js
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
