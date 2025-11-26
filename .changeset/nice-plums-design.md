---
"tempo.ts": patch
---

Added `Handler.feePayer` server handler for fee sponsorship.

Example:

```ts
import { createServer } from 'node:http'
import { createClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { tempo } from 'tempo.ts/chains'
import { Handler } from 'tempo.ts/server'

const client = createClient({
  chain: tempo({ feeToken: '0x20c0000000000000000000000000000000000001' }),
  transport: http(),
})

const handler = Handler.feePayer({ 
  account: privateKeyToAccount('0x...'),
  client 
})

const server = createServer(handler.listener)
server.listen(3000)
```