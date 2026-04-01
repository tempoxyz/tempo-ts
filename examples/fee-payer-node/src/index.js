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

const handler = Handler.feePayer({
  account: privateKeyToAccount(privateKey),
  client,
})

createServer(handler.listener).listen(port, () => {
  console.log(`fee-payer listening on http://localhost:${port}`)
  console.log(`rpc=${rpcUrl}`)
  console.log(`feeToken=${feeToken}`)
})
