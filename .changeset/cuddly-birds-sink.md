---
"tempo.ts": minor
---

**Breaking:** As of `wagmi@3.2.0` and `@wagmi/core@3.1.0`, `tempo.ts/wagmi` has been upstreamed into `wagmi` and `@wagmi/core`, and is no longer maintained in this repository.

```bash
pnpm i wagmi@3.2.0
pnpm i @wagmi/core@3.1.0
```

Import from the `/tempo` entrypoint.

```diff
- import { Actions, Hooks } from 'tempo.ts/wagmi'
+ import { Actions, Hooks } from 'wagmi/tempo'
- import { Actions } from 'tempo.ts/wagmi'
+ import { Actions } from '@wagmi/core/tempo'
```

