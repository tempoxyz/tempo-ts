import * as Address from 'ox/Address'
import * as Hash from 'ox/Hash'
import * as Hex from 'ox/Hex'
import * as Provider from 'ox/Provider'
import * as RpcRequest from 'ox/RpcRequest'
import { createClient, createTransport, type Transport } from 'viem'
import {
  getTransactionReceipt,
  sendTransaction,
  sendTransactionSync,
} from 'viem/actions'
import type * as tempo_Chain from './Chain.js'
import * as Transaction from './Transaction.js'

export type FeePayer = Transport<typeof withFeePayer.type>

/**
 * Creates a fee payer transport that routes requests between
 * the default transport or the fee payer transport.
 *
 * The policy parameter controls how the fee payer handles transactions:
 * - `'sign-only'`: Fee payer co-signs the transaction and returns it to the client transport, which then broadcasts it via the default transport
 * - `'sign-and-broadcast'`: Fee payer co-signs and broadcasts the transaction directly
 *
 * @param defaultTransport - The default transport to use.
 * @param feePayerTransport - The fee payer transport to use.
 * @param parameters - Configuration parameters.
 * @returns A relay transport.
 */
export function withFeePayer(
  defaultTransport: Transport,
  relayTransport: Transport,
  parameters?: withFeePayer.Parameters,
): withFeePayer.ReturnValue {
  const { policy = 'sign-only' } = parameters ?? {}

  return (config) => {
    const transport_default = defaultTransport(config)
    const transport_relay = relayTransport(config)

    return createTransport({
      key: withFeePayer.type,
      name: 'Relay Proxy',
      async request({ method, params }, options) {
        if (
          method === 'eth_sendRawTransactionSync' ||
          method === 'eth_sendRawTransaction'
        ) {
          const rawSerialized = (params as any)[0]
          const serialized =
            typeof rawSerialized === 'string'
              ? rawSerialized
              : Hex.fromBytes(rawSerialized)
          const transaction = Transaction.deserialize(
            serialized as `0x76${string}`,
          )

          // If the transaction is intended to be sponsored, forward it to the relay.
          if (transaction.feePayerSignature === null) {
            if (policy === 'sign-only') {
              // Request signature from relay using eth_signTransaction
              const signedTransaction = (await transport_relay.request(
                { method: 'eth_signTransaction', params: [(params as any)[0]] },
                options,
              )) as any

              // Broadcast the signed transaction via the default transport
              return transport_default.request(
                { method, params: [signedTransaction] },
                options,
              ) as never
            }

            // For 'sign-and-broadcast', relay signs and broadcasts
            return transport_relay.request({ method, params }, options) as never
          }
        }
        return transport_default.request({ method, params }, options) as never
      },
      type: withFeePayer.type,
    })
  }
}

export declare namespace withFeePayer {
  export const type = 'feePayer'

  export type Parameters = {
    /** Policy for how the fee payer should handle transactions. Defaults to `'sign-only'`. */
    policy?: 'sign-only' | 'sign-and-broadcast' | undefined
  }

  export type ReturnValue = FeePayer
}

/**
 * Creates a transport that instruments a compatibility layer for
 * `wallet_` RPC actions (`sendCalls`, `getCallsStatus`, etc).
 *
 * @param transport - Transport to wrap.
 * @returns Transport.
 */
export function walletNamespaceCompat(transport: Transport): Transport {
  const sendCallsMagic = Hash.keccak256(Hex.fromString('TEMPO_5792'))

  return (options) => {
    const t = transport(options)

    const account = options.account

    type Chain = ReturnType<ReturnType<typeof tempo_Chain.define>>
    const chain = options.chain as Chain

    return {
      ...t,
      async request(args: never) {
        const request = RpcRequest.from(args)

        const client = createClient({
          account,
          chain,
          transport,
        })

        if (request.method === 'wallet_sendCalls') {
          const params = request.params[0] ?? {}
          const { capabilities, chainId, from } = params
          const { sync } = capabilities ?? {}

          if (!account) throw new Provider.DisconnectedError()
          if (!chainId) throw new Provider.UnsupportedChainIdError()
          if (Number(chainId) !== client.chain.id)
            throw new Provider.UnsupportedChainIdError()
          if (from && !Address.isEqual(from, account.address))
            throw new Provider.DisconnectedError()

          const calls = (params.calls ?? []).map((call) => ({
            to: call.to,
            value: call.value ? BigInt(call.value) : undefined,
            data: call.data,
          }))

          const hash = await (async () => {
            if (!sync)
              return sendTransaction(client, {
                account,
                calls,
              })

            const { transactionHash } = await sendTransactionSync(client, {
              account,
              calls,
            })
            return transactionHash
          })()

          const id = Hex.concat(hash, Hex.padLeft(chainId, 32), sendCallsMagic)

          return {
            capabilities: { sync },
            id,
          }
        }

        if (request.method === 'wallet_getCallsStatus') {
          const [id] = request.params ?? []
          if (!id) throw new Error('`id` not found')
          if (!id.endsWith(sendCallsMagic.slice(2)))
            throw new Error('`id` not supported')
          Hex.assert(id)

          const hash = Hex.slice(id, 0, 32)
          const chainId = Hex.slice(id, 32, 64)

          const receipt = await getTransactionReceipt(client, { hash })
          return {
            atomic: true,
            chainId: Number(chainId),
            receipts: [receipt],
            status: receipt.status === 'success' ? 200 : 500,
            version: '2.0.0',
          }
        }

        return t.request(args)
      },
    } as never
  }
}
