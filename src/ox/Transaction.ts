import type * as AccessList from 'ox/AccessList'
import type * as Address from 'ox/Address'
import type * as Authorization from 'ox/Authorization'
import type * as Errors from 'ox/Errors'
import * as Hex from 'ox/Hex'
import * as Secp256k1 from 'ox/Secp256k1'
import * as Signature from 'ox/Signature'
import * as ox_Transaction from 'ox/Transaction'
import type { Compute, OneOf, UnionCompute } from '../internal/types.js'
import * as TransactionEnvelopeFeeToken from './TransactionEnvelopeFeeToken.js'

/**
 * A Transaction as defined in the [Execution API specification](https://github.com/ethereum/execution-apis/blob/main/src/schemas/transaction.yaml).
 */
export type Transaction<
  pending extends boolean = false,
  bigintType = bigint,
  numberType = number,
> = UnionCompute<
  OneOf<
    | FeeToken<pending, bigintType, numberType>
    | ox_Transaction.Transaction<pending, bigintType, numberType>
  >
>

/**
 * An RPC Transaction as defined in the [Execution API specification](https://github.com/ethereum/execution-apis/blob/main/src/schemas/transaction.yaml).
 */
export type Rpc<pending extends boolean = false> = UnionCompute<
  OneOf<FeeTokenRpc<pending> | ox_Transaction.Rpc<pending>>
>

/**
 * Fee token transaction.
 */
export type FeeToken<
  pending extends boolean = false,
  bigintType = bigint,
  numberType = number,
  type extends string = 'feeToken',
> = Compute<
  ox_Transaction.Base<type, pending, bigintType, numberType> & {
    /** EIP-2930 Access List. */
    accessList: AccessList.AccessList
    /** EIP-7702 Authorization list for the transaction. */
    authorizationList: Authorization.ListSigned<bigintType, numberType>
    /** Fee token preference. */
    feeToken: Address.Address
    /** Fee payer address. */
    feePayer?: Address.Address | undefined
    /** Fee payer signature. */
    feePayerSignature?:
      | {
          /** ECDSA signature r. */
          r: bigintType
          /** ECDSA signature s. */
          s: bigintType
          /** ECDSA signature yParity. */
          yParity: numberType
          /** @deprecated ECDSA signature v (for backwards compatibility). */
          v?: numberType | undefined
        }
      | undefined
    /** Effective gas price paid by the sender in wei. */
    gasPrice?: bigintType | undefined
    /** Total fee per gas in wei (gasPrice/baseFeePerGas + maxPriorityFeePerGas). */
    maxFeePerGas: bigintType
    /** Max priority fee per gas (in wei). */
    maxPriorityFeePerGas: bigintType
  }
>

/**
 * Fee token transaction in RPC format.
 */
export type FeeTokenRpc<pending extends boolean = false> = Compute<
  FeeToken<pending, Hex.Hex, Hex.Hex, ToRpcType['feeToken']>
>

/** Type to RPC Type mapping. */
export const toRpcType = {
  ...ox_Transaction.toRpcType,
  feeToken: '0x77',
} as const

/** Type to RPC Type mapping. */
export type ToRpcType = typeof toRpcType & {
  [type: string]: `0x${string}`
}

/** RPC Type to Type mapping. */
export const fromRpcType = {
  ...ox_Transaction.fromRpcType,
  '0x77': 'feeToken',
} as const

/** RPC Type to Type mapping. */

export type FromRpcType = typeof fromRpcType & {
  [type: `0x${string}`]: string
}

/**
 * Converts an {@link ox#Transaction.Rpc} to an {@link ox#Transaction.Transaction}.
 *
 * @example
 * ```ts twoslash
 * import { Transaction } from 'ox/tempo'
 *
 * const transaction = Transaction.fromRpc({
 *   hash: '0x353fdfc38a2f26115daadee9f5b8392ce62b84f410957967e2ed56b35338cdd0',
 *   nonce: '0x357',
 *   blockHash:
 *     '0xc350d807505fb835650f0013632c5515592987ba169bbc6626d9fc54d91f0f0b',
 *   blockNumber: '0x12f296f',
 *   feeToken: '0x20c0000000000000000000000000000000000000',
 *   transactionIndex: '0x2',
 *   from: '0x814e5e0e31016b9a7f138c76b7e7b2bb5c1ab6a6',
 *   to: '0x3fc91a3afd70395cd496c647d5a6cc9d4b2b7fad',
 *   value: '0x9b6e64a8ec60000',
 *   gas: '0x43f5d',
 *   maxFeePerGas: '0x2ca6ae494',
 *   maxPriorityFeePerGas: '0x41cc3c0',
 *   input:
 *     '0x3593564c000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000006643504700000000000000000000000000000000000000000000000000000000000000040b080604000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000002800000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000009b6e64a8ec600000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000009b6e64a8ec60000000000000000000000000000000000000000000000000000019124bb5ae978c000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2000000000000000000000000c56c7a0eaa804f854b536a5f3d5f49d2ec4b12b80000000000000000000000000000000000000000000000000000000000000060000000000000000000000000c56c7a0eaa804f854b536a5f3d5f49d2ec4b12b8000000000000000000000000000000fee13a103a10d593b9ae06b3e05f2e7e1c00000000000000000000000000000000000000000000000000000000000000190000000000000000000000000000000000000000000000000000000000000060000000000000000000000000c56c7a0eaa804f854b536a5f3d5f49d2ec4b12b800000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000190240001b9872b',
 *   r: '0x635dc2033e60185bb36709c29c75d64ea51dfbd91c32ef4be198e4ceb169fb4d',
 *   s: '0x50c2667ac4c771072746acfdcf1f1483336dcca8bd2df47cd83175dbe60f0540',
 *   yParity: '0x0',
 *   chainId: '0x1',
 *   accessList: [],
 *   type: '0x77',
 * })
 * ```
 *
 * @param transaction - The RPC transaction to convert.
 * @returns An instantiated {@link ox#Transaction.Transaction}.
 */
export function fromRpc<
  const transaction extends Rpc | null,
  pending extends boolean = false,
>(
  transaction: transaction | Rpc<pending> | null,
  _options: fromRpc.Options<pending> = {},
): transaction extends Rpc<pending> ? Transaction<pending> : null {
  if (!transaction) return null as never

  const transaction_ = ox_Transaction.fromRpc(
    transaction as ox_Transaction.Rpc<pending>,
  ) as Transaction<pending>

  transaction_.type = fromRpcType[transaction.type as keyof typeof fromRpcType]
  if (transaction.feePayerSignature) {
    transaction_.feePayerSignature = Signature.fromRpc(
      transaction.feePayerSignature,
    )
    ;(transaction_.feePayerSignature as any).v = Signature.yParityToV(
      transaction_.feePayerSignature.yParity,
    )

    // TODO: remove once `feePayer` returned on `eth_getTxBy*`.
    transaction_.feePayer = Secp256k1.recoverAddress({
      payload: TransactionEnvelopeFeeToken.getSignPayload(
        transaction_ as never,
        { feePayer: true },
      ),
      signature: transaction_.feePayerSignature,
    })
  }
  if (transaction.feeToken) transaction_.feeToken = transaction.feeToken

  return transaction_ as never
}

export declare namespace fromRpc {
  type Options<pending extends boolean = false> = {
    pending?: pending | boolean | undefined
  }

  type ErrorType = ox_Transaction.fromRpc.ErrorType | Errors.GlobalErrorType
}

/**
 * Converts an {@link ox#Transaction.Transaction} to an {@link ox#Transaction.Rpc}.
 *
 * @example
 * ```ts twoslash
 * import { Transaction } from 'ox/tempo'
 *
 * const transaction = Transaction.toRpc({
 *   accessList: [],
 *   blockHash:
 *     '0xc350d807505fb835650f0013632c5515592987ba169bbc6626d9fc54d91f0f0b',
 *   blockNumber: 19868015n,
 *   chainId: 1,
 *   feeToken: '0x20c0000000000000000000000000000000000000',
 *   from: '0x814e5e0e31016b9a7f138c76b7e7b2bb5c1ab6a6',
 *   gas: 278365n,
 *   hash: '0x353fdfc38a2f26115daadee9f5b8392ce62b84f410957967e2ed56b35338cdd0',
 *   input:
 *     '0x3593564c000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000000000000000000000000000000000006643504700000000000000000000000000000000000000000000000000000000000000040b080604000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000002800000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000009b6e64a8ec600000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000009b6e64a8ec60000000000000000000000000000000000000000000000000000019124bb5ae978c000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2000000000000000000000000c56c7a0eaa804f854b536a5f3d5f49d2ec4b12b80000000000000000000000000000000000000000000000000000000000000060000000000000000000000000c56c7a0eaa804f854b536a5f3d5f49d2ec4b12b8000000000000000000000000000000fee13a103a10d593b9ae06b3e05f2e7e1c00000000000000000000000000000000000000000000000000000000000000190000000000000000000000000000000000000000000000000000000000000060000000000000000000000000c56c7a0eaa804f854b536a5f3d5f49d2ec4b12b800000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000190240001b9872b',
 *   maxFeePerGas: 11985937556n,
 *   maxPriorityFeePerGas: 68993984n,
 *   nonce: 855n,
 *   r: 44944627813007772897391531230081695102703289123332187696115181104739239197517n,
 *   s: 36528503505192438307355164441104001310566505351980369085208178712678799181120n,
 *   to: '0x3fc91a3afd70395cd496c647d5a6cc9d4b2b7fad',
 *   transactionIndex: 2,
 *   type: 'feeToken',
 *   v: 27,
 *   value: 700000000000000000n,
 *   yParity: 0,
 * })
 * ```
 *
 * @param transaction - The transaction to convert.
 * @returns An RPC-formatted transaction.
 */
export function toRpc<pending extends boolean = false>(
  transaction: Transaction<pending>,
  _options?: toRpc.Options<pending>,
): Rpc<pending> {
  const rpc = ox_Transaction.toRpc(
    transaction as ox_Transaction.Transaction<pending>,
  ) as Rpc<pending>

  rpc.type = toRpcType[transaction.type as keyof typeof toRpcType]
  if (transaction.feeToken) rpc.feeToken = transaction.feeToken
  if (transaction.feePayerSignature) {
    rpc.feePayerSignature = Signature.toRpc(
      transaction.feePayerSignature,
    ) as any
    ;(rpc.feePayerSignature as any).v = Hex.fromNumber(
      Signature.yParityToV(transaction.feePayerSignature?.yParity),
    )
    rpc.feePayer = transaction.feePayer
  }

  return rpc as Rpc<pending>
}

export declare namespace toRpc {
  type Options<pending extends boolean = false> = {
    pending?: pending | boolean | undefined
  }

  type ErrorType = ox_Transaction.toRpc.ErrorType | Errors.GlobalErrorType
}
