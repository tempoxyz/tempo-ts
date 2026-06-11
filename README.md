<br>
<br>

<p align="center">
  <a href="https://tempo.xyz">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/tempoxyz/tempo/refs/heads/main/.github/assets/tempo-wordmark-white.svg">
      <img alt="Tempo wordmark" src="https://raw.githubusercontent.com/tempoxyz/tempo/refs/heads/main/.github/assets/tempo-wordmark-black.svg" width="360">
    </picture>
  </a>
</p>

<br>
<br>

# Tempo TypeScript SDK

> [!IMPORTANT]
> This repository is archived. New Tempo TypeScript integrations should use the
> maintained packages listed below instead of adding new `tempo.ts` usage.

## Migration paths

| `tempo.ts` usage                         | Use instead                                                                                                                                       |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Fee payer / sponsored transaction server | [`accounts`](https://github.com/tempoxyz/accounts) via `accounts/server` `Handler.relay({ feePayer })`; see the [fee payer example](https://github.com/tempoxyz/accounts/tree/main/examples/fee-payer) and [fee sponsorship guide](https://accounts.tempo.xyz/docs/guides/fee-sponsorship). |
| `tempo.ts/viem` and chain definitions    | [`viem`](https://github.com/wevm/viem), where Tempo chain support has been upstreamed.                                                            |
| `tempo.ts/wagmi`                         | [`wagmi/tempo`](https://wagmi.sh) or [`@wagmi/core/tempo`](https://wagmi.sh/core), where Tempo support has been upstreamed.                       |
| `tempo.ts/ox`                            | [`ox/tempo`](https://github.com/wevm/ox).                                                                                                         |
| `tempo.ts/prool`                         | [`prool`](https://github.com/wevm/prool), which includes the Tempo instance directly.                                                             |

## Install

```sh
pnpm i tempo.ts
```

## Entrypoints

| Entrypoint        | Description                              |
| ----------------- | ---------------------------------------- |
| `tempo.ts/server` | Framework-agnostic server handlers.      |

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
