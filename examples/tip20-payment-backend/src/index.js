import { createServer } from 'node:http'
import { Handler } from 'tempo.ts/server'
import { createClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { tempoModerato } from 'viem/chains'

const port = Number(process.env.PORT ?? 3000)
const rpcUrl = process.env.RPC_URL ?? 'https://rpc.moderato.tempo.xyz'
const feeToken = process.env.FEE_TOKEN_ADDRESS ?? '0x20c0000000000000000000000000000000000001'
const privateKey = process.env.FEE_PAYER_PRIVATE_KEY

if (!privateKey) throw new Error('Missing FEE_PAYER_PRIVATE_KEY')

const client = createClient({
  chain: tempoModerato.extend({
    feeToken,
  }),
  transport: http(rpcUrl),
})

const feePayer = Handler.feePayer({
  account: privateKeyToAccount(privateKey),
  client,
})

const server = createServer(async (request, response) => {
  const url = new URL(request.url ?? '/', `http://${request.headers.host}`)

  if (request.method === 'GET' && url.pathname === '/health') {
    response.writeHead(200, { 'content-type': 'application/json' })
    response.end(JSON.stringify({ ok: true }))
    return
  }

  if (request.method === 'POST' && url.pathname === '/sponsor') {
    return feePayer.listener(request, response)
  }

  response.writeHead(404, { 'content-type': 'application/json' })
  response.end(
    JSON.stringify({
      error: 'Not Found',
      routes: ['/health', '/sponsor'],
    }),
  )
})

server.listen(port, () => {
  console.log(`tip20-payment-backend listening on http://localhost:${port}`)
  console.log('POST sender-signed Tempo tx JSON-RPC payloads to /sponsor')
})
