import type * as Calls from 'ox/erc7821/Calls'
import * as Hex from 'ox/Hex'
import * as Signature from 'ox/Signature'
import {
  type AccessList,
  type Account,
  type Address,
  type AuthorizationList,
  type FeeValuesEIP1559,
  type ParseTransactionReturnType,
  type SignedAuthorizationList,
  type TransactionBase,
  type TransactionRequestBase,
  type TransactionSerializableBase,
  type TransactionSerializableGeneric,
  type TransactionSerializedGeneric,
  parseTransaction as viem_parseTransaction,
  type RpcTransaction as viem_RpcTransaction,
  type RpcTransactionRequest as viem_RpcTransactionRequest,
  type Signature as viem_Signature,
  serializeTransaction as viem_serializeTransaction,
  type Transaction as viem_Transaction,
  type TransactionRequest as viem_TransactionRequest,
  type TransactionSerializable as viem_TransactionSerializable,
  type TransactionSerialized as viem_TransactionSerialized,
  type TransactionType as viem_TransactionType,
} from 'viem'
import type { ExactPartial, OneOf } from '../internal/types.js'
import * as TxFeeToken from '../ox/TransactionEnvelopeFeeToken.js'

export type Transaction<
  bigintType = bigint,
  numberType = number,
  pending extends boolean = false,
> = OneOf<
  | viem_Transaction<bigintType, numberType, pending>
  | TransactionFeeToken<bigintType, numberType, pending>
>
export type TransactionRpc<pending extends boolean = false> = OneOf<
  | viem_RpcTransaction<pending>
  | TransactionFeeToken<Hex.Hex, Hex.Hex, pending, '0x77'>
>

export type TransactionFeeToken<
  quantity = bigint,
  index = number,
  isPending extends boolean = boolean,
  type = 'feeToken',
> = TransactionBase<quantity, index, isPending> & {
  /** EIP-2930 Access List. */
  accessList: AccessList
  /** Authorization list for the transaction. */
  authorizationList: SignedAuthorizationList
  /** Chain ID that this transaction is valid on. */
  chainId: index
  /** Fee token preference. */
  feeToken?: Address | undefined
  /** Fee payer address. */
  feePayer?: Address | undefined
  /** Fee payer signature. */
  feePayerSignature?: viem_Signature | undefined
  type: type
} & FeeValuesEIP1559<quantity>

export type TransactionRequest<
  bigintType = bigint,
  numberType = number,
> = OneOf<
  | viem_TransactionRequest<bigintType, numberType>
  | TransactionRequestFeeToken<bigintType, numberType>
>
export type TransactionRequestRpc = OneOf<
  | viem_RpcTransactionRequest
  | TransactionRequestFeeToken<Hex.Hex, Hex.Hex, '0x77'>
>

export type TransactionRequestFeeToken<
  quantity = bigint,
  index = number,
  type = 'feeToken',
> = TransactionRequestBase<quantity, index, type> &
  ExactPartial<FeeValuesEIP1559<quantity>> & {
    accessList?: AccessList | undefined
    authorizationList?: AuthorizationList<index, boolean> | undefined
    calls?: readonly Calls.Call[] | undefined
    feePayer?: Account | true | undefined
    feeToken?: Address | bigint | undefined
  }

export type TransactionSerializable = OneOf<
  viem_TransactionSerializable | TransactionSerializableFeeToken
>

export type TransactionSerializableFeeToken<
  quantity = bigint,
  index = number,
> = TransactionSerializableBase<quantity, index> &
  ExactPartial<FeeValuesEIP1559<quantity>> & {
    accessList?: AccessList | undefined
    authorizationList: SignedAuthorizationList
    feeToken?: Address | bigint | undefined
    feePayerSignature?: viem_Signature | undefined
    chainId: number
    type?: 'feeToken' | undefined
    yParity?: number | undefined
  }

export type TransactionSerialized<
  type extends TransactionType = TransactionType,
> = viem_TransactionSerialized<type> | TransactionSerializedFeeToken

export type TransactionSerializedFeeToken = `0x77${string}`

export type TransactionType = viem_TransactionType | 'feeToken'

export function isTempoTransaction(transaction: Record<string, unknown>) {
  if (transaction.type === 'feeToken') return true
  if (typeof transaction.calls !== 'undefined') return true
  if (typeof transaction.feePayer !== 'undefined') return true
  if (typeof transaction.feeToken !== 'undefined') return true
  return false
}

export function parseTransaction<
  const serialized extends TransactionSerializedGeneric,
>(serializedTransaction: serialized): parseTransaction.ReturnType<serialized> {
  const type = Hex.slice(serializedTransaction, 0, 1)
  if (type === '0x77') {
    const { authorizationList, nonce, r, s, v, ...tx } = TxFeeToken.deserialize(
      serializedTransaction as `0x77${string}`,
    )
    return {
      ...tx,
      authorizationList: authorizationList?.map((auth) => ({
        ...auth,
        nonce: Number(auth.nonce ?? 0n),
        r: Hex.fromNumber(auth.r, { size: 32 }),
        s: Hex.fromNumber(auth.s, { size: 32 }),
      })),
      nonce: Number(nonce ?? 0n),
      ...(r ? { r: Hex.fromNumber(r, { size: 32 }) } : {}),
      ...(s ? { s: Hex.fromNumber(s, { size: 32 }) } : {}),
      ...(v ? { v: BigInt(v) } : {}),
    } satisfies TransactionSerializableGeneric as never
  }
  return viem_parseTransaction(serializedTransaction) as never
}

export declare namespace parseTransaction {
  export type ReturnType<
    serialized extends
      TransactionSerializedGeneric = TransactionSerializedGeneric,
  > = serialized extends TransactionSerializedFeeToken
    ? TransactionSerializableFeeToken
    : ParseTransactionReturnType<serialized>
}

export async function serializeTransaction(
  transaction: TransactionSerializable & {
    feePayer?: Account | true | undefined
  },
  signature?: viem_Signature | undefined,
) {
  // map "eip1559" to "feeToken" ;)
  if (transaction.type === 'eip1559') (transaction as any).type = 'feeToken'

  if (!isTempoTransaction(transaction))
    return viem_serializeTransaction(transaction as never, signature)

  const signature_ = transaction.r && transaction.s ? transaction : signature

  const {
    authorizationList,
    chainId,
    feePayer,
    feePayerSignature,
    nonce,
    r,
    s,
    v,
    ...rest
  } = transaction
  const transaction_ox = {
    ...rest,
    authorizationList: authorizationList?.map((auth) => ({
      ...auth,
      nonce: BigInt(auth.nonce),
      r: BigInt(auth.r!),
      s: BigInt(auth.s!),
      yParity: Number(auth.yParity),
    })),
    chainId: Number(chainId),
    ...(nonce ? { nonce: BigInt(nonce) } : {}),
    feePayerSignature: feePayerSignature
      ? {
          r: BigInt(feePayerSignature.r!),
          s: BigInt(feePayerSignature.s!),
          yParity: Number(feePayerSignature.yParity),
        }
      : feePayer
        ? null
        : undefined,
    ...(r ? { r: BigInt(r) } : {}),
    ...(s ? { s: BigInt(s) } : {}),
    ...(v ? { v: Number(v) } : {}),
    type: 'feeToken',
  } satisfies TxFeeToken.TransactionEnvelopeFeeToken

  if (signature_ && typeof transaction.feePayer === 'object') {
    const tx = TxFeeToken.from(transaction_ox, {
      signature: signature_ as never,
    })
    const hash = TxFeeToken.getSignPayload(tx, {
      feePayer: true,
    })
    const feePayerSignature = await transaction.feePayer.sign!({
      hash,
    })
    return TxFeeToken.serialize(tx, {
      feePayerSignature: Signature.from(feePayerSignature),
    })
  }
  return TxFeeToken.serialize(transaction_ox, {
    // TODO: refactor to remove `"0x00"`
    feePayerSignature: feePayer === true ? '0x00' : undefined,
    signature: signature as never,
  })
}
