---
"tempo.ts": patch
---

Added `tempo.ts/server` entrypoint with a `Handler` module. The `Handler` module provides a `keyManager` handler to instantiate a lightweight Key Manager API to use for WebAuthn credential management.

```ts
import { Handler, Kv } from 'tempo.ts/server'
import { env } from 'cloudflare:workers'

export default {
  fetch(request) {
    return Handler.keyManager({
      kv: Kv.cloudflare(env.KEY_STORE),
    }).fetch(request)
  },
} satisfies ExportedHandler<Env>
```