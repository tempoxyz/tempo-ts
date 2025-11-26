---
"tempo.ts": patch
---

Added `tempo.ts/server` entrypoint with a `Handler` module. The `Handler` module provides a `keyManager` handler to instantiate a lightweight Key Manager API to use for WebAuthn credential management.

Each `Handler` function returns a `fetch` or `listener` handler that can be used by the majority of
server frameworks.

For example:

```ts
import { Handler, Kv } from 'tempo.ts/server'

const handler = Handler.keyManager({ kv: Kv.memory() })

// Node.js
import { createServer } from 'node:http'
const server = createServer(handler.listener)
server.listen(3000)

// Bun
Bun.serve(handler)

// Cloudflare
export default {
  fetch(request) {
    return handler.fetch(request)
  }
}

// Express
import express from 'express'
const app = express()
app.use(handler.listener)
app.listen(3000)
```