import {
  defineTransaction,
  defineTransactionRequest,
  type SerializeTransactionFn,
  type Chain as viem_Chain,
} from 'viem'
import type { IsUndefined } from '../internal/types.js'
import type * as TokenId from '../ox/TokenId.js'
import * as Formatters from './Formatters.js'
import * as Transaction from './Transaction.js'

export type Chain<
  feeToken extends TokenId.TokenIdOrAddress | null | undefined =
    | TokenId.TokenIdOrAddress
    | null
    | undefined,
> = viem_Chain &
  (IsUndefined<feeToken> extends true
    ? {
        feeToken?: TokenId.TokenIdOrAddress | null | undefined
      }
    : {
        feeToken: feeToken
      })

export function define<chain extends viem_Chain>(chain: chain) {
  function inner<const chain extends Chain>(chain: chain) {
    return {
      blockTime: 1_000,
      contracts: {
        multicall3: {
          address: '0xca11bde05977b3631167028862be2a173976ca11',
          blockCreated: 0,
        },
      },
      formatters: {
        transaction: defineTransaction({
          format: Formatters.formatTransaction,
        }),
        transactionRequest: defineTransactionRequest({
          format: (
            ...args: Parameters<
              typeof Formatters.formatTransactionRequest<chain>
            >
          ) => Formatters.formatTransactionRequest<chain>(...args),
        }),
      },
      serializers: {
        // TODO: casting to satisfy viem – viem v3 to have more flexible serializer type.
        transaction: Transaction.serialize as SerializeTransactionFn,
      },
      ...chain,
    } as const
  }

  return Object.assign(
    <properties extends define.Properties | undefined>(
      properties: properties = {} as properties,
    ) => inner({ ...chain, ...properties }),
    { id: chain.id },
  )
}

export declare namespace define {
  type Properties = {
    /**
     * Fee token to set for mutable actions.
     *
     * Pass `null` to opt-in to protocol preferences.
     *
     * @example '0x20c0000000000000000000000000000000000001'
     * @example 1n
     * @example null
     */
    feeToken?: TokenId.TokenIdOrAddress | null | undefined
  }
}
