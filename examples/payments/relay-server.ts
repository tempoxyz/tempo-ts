import { RpcRequest, RpcResponse } from 'ox'
import { tempoAndantino } from 'tempo.ts/chains'
import { Transaction } from 'tempo.ts/viem'
import { createClient, http, walletActions } from 'viem'
import { alphaUsd, sponsorAccount } from './src/wagmi.config'

const client = createClient({
  account: sponsorAccount,
  chain: tempoAndantino({ feeToken: alphaUsd }),
  transport: http(
    'https://rpc.testnet.tempo.xyz?supersecretargument=pleasedonotusemeinprod',
  ),
}).extend(walletActions)

const PORT = 3050

console.log(`🚀 Fee Payer Relay Server starting...`)
console.log(`   Sponsor: ${sponsorAccount.address}`)
console.log(`   Port: ${PORT}`)

Bun.serve({
  port: PORT,
  async fetch(req) {
    console.log(`📨 Received request`)
    console.log(`   Method: ${req.method}`)
    console.log(`   URL: ${req.url}`)

    const request = RpcRequest.from(await req.json())

    console.log(`📨 Received RPC request`)
    console.log(`   Method: ${request.method}`)

    // 1. Deserialize the sender's signed transaction
    const serialized = request.params?.[0] as `0x76${string}`
    const transaction = Transaction.deserialize(serialized)
    console.log(`   From: ${transaction.from}`)

    // 2. Sign transaction with sponsor account (adds feePayerSignature)
    const serializedTransaction = await client.signTransaction({
      ...transaction,
      feePayer: client.account,
    })

    console.log(`✅ Signed transaction with sponsor account`)

    // 3. Submit to Tempo network using the original method
    const result = await client.request({
      method: request.method,
      params: [serializedTransaction],
    })

    console.log(`✅ Transaction submitted: ${result}`)

    return new Response(
      JSON.stringify(RpcResponse.from({ result }, { request })),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      },
    )
  },
})

console.log(`✅ Relay server listening on http://localhost:${PORT}`)
