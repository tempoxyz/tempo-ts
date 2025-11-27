---
"tempo.ts": patch
---

Added `Handler.compose` to compose multiple handlers into a single handler.

```ts
import { Handler, Kv } from 'tempo.ts/server'

const handler = Handler.compose([
  Handler.feePayer({ 
    account,
    client,
    path: '/fee-payer' 
  }),
  Handler.keyManager({ 
    kv: Kv.memory()
    path: '/key' 
  }),
], { path: '/api' })

Bun.serve(handler) // Bun
Deno.serve(handler) // Deno
createServer(handler.listener) // Node.js
app.use(c => handler.fetch(c.req.raw)) // Hono
app.use(handler.listener) // Express

// Exposed endpoints:
// - '/api/fee-payer'
// - '/api/key/*'
```
