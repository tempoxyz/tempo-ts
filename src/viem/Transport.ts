import { createTransport, type Transport } from 'viem'
import * as Transaction from './Transaction.js'

export type FeePayer = Transport<typeof withFeePayer.type>

/**
 * Creates a fee payer transport that routes requests between
 * the default transport or the fee payer transport.
 *
 * @param defaultTransport - The default transport to use.
 * @param feePayerTransport - The fee payer transport to use.
 * @returns A relay transport.
 */
export function withFeePayer(
  defaultTransport: Transport,
  relayTransport: Transport,
): withFeePayer.ReturnValue {
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
          const serialized = (params as any)[0] as `0x77${string}`
          const transaction = Transaction.deserialize(serialized)
          // If the transaction is intended to be sponsored, forward it to the relay.
          if (transaction.feePayerSignature === null)
            return transport_relay.request({ method, params }, options) as never
        }
        return transport_default.request({ method, params }, options) as never
      },
      type: withFeePayer.type,
    })
  }
}

export declare namespace withFeePayer {
  export const type = 'feePayer'

  export type ReturnValue = FeePayer
}
