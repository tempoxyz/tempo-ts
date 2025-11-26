---
"tempo.ts": patch
---

Added `Handler.feePayer` server handler for fee sponsorship.

`Handler.feePayer` returns a `fetch` or `listener` handler that can be used by the majority of
server frameworks.

For example:

```ts
import { privateKeyToAccount } from 'viem/accounts'
import { Handler } from 'tempo.ts/server'
import { client } from './viem.config'

const handler = Handler.feePayer({ 
  account: privateKeyToAccount('0x...'),
  client 
})

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