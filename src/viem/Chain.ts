import * as Hex from 'ox/Hex'
import {
  defineTransaction,
  defineTransactionReceipt,
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
  const nonceKeyManager = {
    counter: 0,
    resetScheduled: false,
    reset() {
      this.counter = 0
      this.resetScheduled = false
    },
    get() {
      if (!this.resetScheduled) {
        this.resetScheduled = true
        queueMicrotask(() => this.reset())
      }
      const count = this.counter
      this.counter++
      if (count === 0) return 0n
      return Hex.toBigInt(Hex.random(6))
    },
  }

  return {
    blockTime: 1_000,
    formatters: {
      transaction: defineTransaction({
        exclude: ['aaAuthorizationList' as never],
        format: Formatters.formatTransaction,
      }),
      transactionReceipt: defineTransactionReceipt({
        format: Formatters.formatTransactionReceipt,
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

              // Note: if we have marked the transaction as intended to be paid
              // by a fee payer (feePayer: true), we will not infer the fee token
              // as the fee payer will choose their fee token.
              ...(request.feePayer !== true &&
              (action === 'estimateGas' ||
                action === 'fillTransaction' ||
                action === 'sendTransaction')
                ? {
                    feeToken: request.feeToken ?? chain.feeToken,
                  }
                : {}),
            },
            action,
          ),
      }),
    },
    async prepareTransactionRequest(r) {
      const request = r as Transaction.TransactionRequest
      const nonceKey = (() => {
        if (typeof request.nonceKey !== 'undefined') return request.nonceKey
        const nonceKey = nonceKeyManager.get()
        if (nonceKey === 0n) return undefined
        return nonceKey
      })()

      const nonce = (() => {
        if (typeof request.nonce === 'number') return request.nonce
        // TODO: remove this line once `eth_fillTransaction` supports nonce keys.
        if (nonceKey) return 0
        return undefined
      })()

      return { ...request, nonce, nonceKey } as unknown as typeof r
    },
    serializers: {
      // TODO: casting to satisfy viem – viem v3 to have more flexible serializer type.
      transaction: ((transaction, signature) =>
        Transaction.serialize(
          {
            ...transaction,
            // If we have marked the transaction as intended to be paid
            // by a fee payer (feePayer: true), we will not infer the fee token
            // as the fee payer will choose their fee token.
            ...((transaction as { feePayer?: unknown }).feePayer !== true
              ? {
                  feeToken:
                    (transaction as { feeToken?: unknown }).feeToken ??
                    chain.feeToken ??
                    undefined,
                }
              : {}),
          } as never,
          signature,
        )) as SerializeTransactionFn,
    },
    ...chain,
  } as const satisfies viem_Chain
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
    properties?: properties | undefined,
  ) => ReturnType<typeof config<chain & properties>>) & { id: chain['id'] }
}
