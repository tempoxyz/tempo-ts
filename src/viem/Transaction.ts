import * as Hex from 'ox/Hex'
import * as Secp256k1 from 'ox/Secp256k1'
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
  getTransactionType as viem_getTransactionType,
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
import type { ExactPartial, OneOf, PartialBy } from '../internal/types.js'
import * as SignatureEnvelope from '../ox/SignatureEnvelope.js'
import * as TxAA from '../ox/TransactionEnvelopeAA.js'

export type Transaction<
  bigintType = bigint,
  numberType = number,
  pending extends boolean = false,
> = OneOf<
  | viem_Transaction<bigintType, numberType, pending>
  | TransactionAA<bigintType, numberType, pending>
>
export type TransactionRpc<pending extends boolean = false> = OneOf<
  | viem_RpcTransaction<pending>
  | TransactionAA<Hex.Hex, Hex.Hex, pending, '0x77'>
>

export type TransactionAA<
  quantity = bigint,
  index = number,
  isPending extends boolean = boolean,
  type = 'aa',
> = PartialBy<
  Omit<
    TransactionBase<quantity, index, isPending>,
    'data' | 'input' | 'value' | 'to'
  >,
  'r' | 's' | 'v' | 'yParity'
> & {
  accessList: AccessList
  authorizationList?: SignedAuthorizationList | undefined
  calls: readonly TxAA.Call<quantity>[]
  chainId: index
  feeToken?: Address | undefined
  feePayer?: Address | undefined
  feePayerSignature?: viem_Signature | undefined
  nonceKey?: quantity | undefined
  type: type
  validBefore?: index | undefined
  validAfter?: index | undefined
} & FeeValuesEIP1559<quantity>

export type TransactionRequest<
  bigintType = bigint,
  numberType = number,
> = OneOf<
  | viem_TransactionRequest<bigintType, numberType>
  | TransactionRequestAA<bigintType, numberType>
>
export type TransactionRequestRpc = OneOf<
  viem_RpcTransactionRequest | TransactionRequestAA<Hex.Hex, Hex.Hex, '0x77'>
>

export type TransactionRequestAA<
  quantity = bigint,
  index = number,
  type = 'aa',
> = TransactionRequestBase<quantity, index, type> &
  ExactPartial<FeeValuesEIP1559<quantity>> & {
    accessList?: AccessList | undefined
    authorizationList?: AuthorizationList<index, boolean> | undefined
    calls?: readonly TxAA.Call<quantity>[] | undefined
    feePayer?: Account | true | undefined
    feeToken?: Address | bigint | undefined
  }

export type TransactionSerializable = OneOf<
  viem_TransactionSerializable | TransactionSerializableAA
>

export type TransactionSerializableAA<
  quantity = bigint,
  index = number,
> = TransactionSerializableBase<quantity, index> &
  ExactPartial<FeeValuesEIP1559<quantity>> & {
    accessList?: AccessList | undefined
    authorizationList?: SignedAuthorizationList | undefined
    calls: readonly TxAA.Call<quantity>[]
    chainId: number
    feeToken?: Address | bigint | undefined
    feePayerSignature?: viem_Signature | undefined
    nonceKey?: quantity | undefined
    signature?: SignatureEnvelope.SignatureEnvelope<quantity, index> | undefined
    validBefore?: index | undefined
    validAfter?: index | undefined
    type?: 'aa' | undefined
  }

export type TransactionSerialized<
  type extends TransactionType = TransactionType,
> = viem_TransactionSerialized<type> | TransactionSerializedAA

export type TransactionSerializedAA = `0x76${string}`

export type TransactionType = viem_TransactionType | 'aa'

export function getType(
  transaction: Record<string, unknown>,
): Transaction['type'] {
  if (
    typeof transaction.calls !== 'undefined' ||
    typeof transaction.feePayer !== 'undefined' ||
    typeof transaction.feeToken !== 'undefined' ||
    typeof transaction.signature !== 'undefined' ||
    typeof transaction.validBefore !== 'undefined' ||
    typeof transaction.validAfter !== 'undefined'
  )
    return 'aa' as never
  if (transaction.type) return transaction.type as never
  return viem_getTransactionType(transaction) as never
}

export function isTempo(transaction: Record<string, unknown>) {
  try {
    const type = getType(transaction)
    return type === 'aa'
  } catch {
    return false
  }
}

export function deserialize<
  const serialized extends TransactionSerializedGeneric,
>(serializedTransaction: serialized): deserialize.ReturnValue<serialized> {
  const type = Hex.slice(serializedTransaction, 0, 1)
  if (type === '0x76')
    return deserializeAA(serializedTransaction as `0x76${string}`) as never
  return viem_parseTransaction(serializedTransaction) as never
}

export declare namespace deserialize {
  export type ReturnValue<
    serialized extends
      TransactionSerializedGeneric = TransactionSerializedGeneric,
  > = serialized extends TransactionSerializedAA
    ? TransactionSerializableAA
    : ParseTransactionReturnType<serialized>
}

export async function serialize(
  transaction: TransactionSerializable & {
    feePayer?: Account | true | undefined
    from?: Address | undefined
  },
  signature?: viem_Signature | undefined,
) {
  if (!isTempo(transaction))
    return viem_serializeTransaction(transaction as never, signature)

  const type = getType(transaction)
  if (type === 'aa')
    return serializeAA(transaction as TransactionSerializableAA, signature)

  throw new Error('Unsupported transaction type')
}

////////////////////////////////////////////////////////////////////////////////////
// Internal

/** @internal */
function deserializeAA(
  serializedTransaction: TransactionSerializedAA,
): TransactionSerializableAA {
  const { authorizationList, nonce, ...tx } = TxAA.deserialize(
    serializedTransaction,
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
  } satisfies TransactionSerializableGeneric as never
}

/** @internal */
async function serializeAA(
  transaction: TransactionSerializableAA & {
    feePayer?: Account | true | undefined
    from?: Address | undefined
  },
  sig?: viem_Signature | undefined,
) {
  const signature = (() => {
    if (transaction.signature) return transaction.signature
    if (sig)
      return SignatureEnvelope.from({
        r: BigInt(sig.r!),
        s: BigInt(sig.s!),
        yParity: Number(sig.yParity!),
      })
    return undefined
  })()

  const {
    authorizationList,
    chainId,
    feePayer,
    feePayerSignature,
    nonce,
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
    calls: rest.calls?.length
      ? rest.calls
      : [
          {
            to: rest.to || undefined,
            value: rest.value,
            data: rest.data,
          },
        ],
    chainId: Number(chainId),
    feePayerSignature: feePayerSignature
      ? {
          r: BigInt(feePayerSignature.r!),
          s: BigInt(feePayerSignature.s!),
          yParity: Number(feePayerSignature.yParity),
        }
      : feePayer
        ? null
        : undefined,
    type: 'aa',
    ...(nonce ? { nonce: BigInt(nonce) } : {}),
  } satisfies TxAA.TransactionEnvelopeAA

  if (signature && typeof transaction.feePayer === 'object') {
    const tx = TxAA.from(transaction_ox, {
      signature,
    })

    const sender = (() => {
      if (signature.type === 'secp256k1')
        return Secp256k1.recoverAddress({
          payload: TxAA.getSignPayload(tx),
          signature: signature.signature,
        })
      throw new Error('Unsupported signature type')
    })()

    const hash = TxAA.getFeePayerSignPayload(tx, {
      sender,
    })

    const feePayerSignature = await transaction.feePayer.sign!({
      hash,
    })

    return TxAA.serialize(tx, {
      feePayerSignature: Signature.from(feePayerSignature),
    })
  }

  return TxAA.serialize(transaction_ox, {
    feePayerSignature: feePayer === true ? null : undefined,
    signature,
  })
}
