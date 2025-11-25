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

    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      })
    }

    const request = RpcRequest.from(await req.json())
    console.log(`   RpcMethod: ${request.method}`)

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

    // 3. Handle based on RPC method
    if (request.method === 'eth_signTransaction') {
      // Policy: 'sign-only' - Return signed transaction without broadcasting
      console.log(`   Returning signed transaction without broadcasting`)
      return new Response(
        JSON.stringify(
          RpcResponse.from({ result: serializedTransaction }, { request }),
        ),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        },
      )
    }

    if (
      request.method === 'eth_sendRawTransaction' ||
      request.method === 'eth_sendRawTransactionSync'
    ) {
      // Policy: 'sign-and-broadcast' - Sign, broadcast, and return hash
      const result = await client.request({
        method: request.method as any,
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
    }

    // Unknown method
    console.error(`❌ Unsupported method: ${request.method}`)
    return new Response(
      JSON.stringify({
        jsonrpc: '2.0',
        id: request.id,
        error: {
          code: -32601,
          message: `Method not found: ${request.method}`,
        },
      }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      },
    )
  },
})

console.log(`✅ Relay server listening on http://localhost:${PORT}`)
