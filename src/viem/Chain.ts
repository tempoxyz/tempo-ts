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

function config<const chain extends Chain>(chain: chain) {
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
          ...[request, action]: Parameters<
            typeof Formatters.formatTransactionRequest<chain>
          >
        ) =>
          Formatters.formatTransactionRequest<chain>(
            {
              ...request,
              ...(!request.feePayer &&
              (action === 'estimateGas' || action === 'sendTransaction')
                ? {
                    feeToken: request.feeToken ?? chain.feeToken,
                  }
                : {}),
            },
            action,
          ),
      }),
    },
    serializers: {
      // TODO: casting to satisfy viem – viem v3 to have more flexible serializer type.
      transaction: ((transaction, signature) =>
        Transaction.serialize(
          {
            ...transaction,
            ...(!(transaction as { feePayer?: unknown }).feePayer
              ? { feeToken: chain.feeToken ?? undefined }
              : {}),
          } as never,
          signature,
        )) as SerializeTransactionFn,
    },
    ...chain,
  } as const
}

export function define<const chain extends viem_Chain>(
  chain: chain,
): define.ReturnValue<chain> {
  return Object.assign(
    (properties = {}) => config({ ...chain, ...properties }),
    { id: chain.id },
  ) as never
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

  type ReturnValue<chain extends viem_Chain> = (<
    properties extends define.Properties | undefined,
  >(
    properties: properties,
  ) => ReturnType<typeof config<chain & properties>>) & { id: chain['id'] }
}
