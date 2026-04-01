import { createServer } from 'node:http'
import { Handler, Kv } from 'tempo.ts/server'

const port = Number(process.env.PORT ?? 3000)
const rpId = process.env.RP_ID ?? 'localhost'
const rpName = process.env.RP_NAME ?? 'Tempo Demo'

const handler = Handler.keyManager({
  kv: Kv.memory(),
  path: '/',
  rp: {
    id: rpId,
    name: rpName,
  },
})

createServer(handler.listener).listen(port, () => {
  console.log(`key-manager listening on http://localhost:${port}`)
  console.log(`rp.id=${rpId} rp.name=${rpName}`)
})
