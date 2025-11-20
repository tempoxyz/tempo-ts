// TODO: Find opportunities to make this file less duplicated + more simplified with Viem v3.

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
import type * as KeyAuthorization from '../ox/KeyAuthorization.js'
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
  | (Omit<
      TransactionAA<Hex.Hex, Hex.Hex, pending, '0x76'>,
      'keyAuthorization' | 'signature'
    > & {
      keyAuthorization?: KeyAuthorization.Rpc | null | undefined
      signature: SignatureEnvelope.SignatureEnvelopeRpc
    })
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
  keyAuthorization?: KeyAuthorization.Signed<quantity, index> | null | undefined
  nonceKey?: quantity | undefined
  signature: SignatureEnvelope.SignatureEnvelope
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
  viem_RpcTransactionRequest | TransactionRequestAA<Hex.Hex, Hex.Hex, '0x76'>
>

export type TransactionRequestAA<
  quantity = bigint,
  index = number,
  type = 'aa',
> = TransactionRequestBase<quantity, index, type> &
  ExactPartial<FeeValuesEIP1559<quantity>> & {
    accessList?: AccessList | undefined
    authorizationList?: AuthorizationList<index, boolean> | undefined
    keyAuthorization?: KeyAuthorization.Signed<quantity, index> | undefined
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
    feePayerSignature?: viem_Signature | null | undefined
    keyAuthorization?: KeyAuthorization.Signed<quantity, index> | undefined
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
  if (type === '0x76') {
    const from =
      Hex.slice(serializedTransaction, -6) === '0xfeefeefeefee'
        ? Hex.slice(serializedTransaction, -26, -6)
        : undefined
    return {
      ...deserializeAA(serializedTransaction as `0x76${string}`),
      from,
    } as never
  }
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
  signature?:
    | OneOf<SignatureEnvelope.SignatureEnvelope | viem_Signature>
    | undefined,
) {
  // Convert EIP-1559 transactions to AA transactions.
  if (transaction.type === 'eip1559') (transaction as any).type = 'aa'

  // If the transaction is not a Tempo transaction, route to Viem serializer.
  if (!isTempo(transaction)) {
    if (signature && 'type' in signature && signature.type !== 'secp256k1')
      throw new Error(
        'Unsupported signature type. Expected `secp256k1` but got `' +
          signature.type +
          '`.',
      )
    if (signature && 'type' in signature) {
      const { r, s, yParity } = signature?.signature!
      return viem_serializeTransaction(transaction as never, {
        r: Hex.fromNumber(r, { size: 32 }),
        s: Hex.fromNumber(s, { size: 32 }),
        yParity,
      })
    }
    return viem_serializeTransaction(transaction as never, signature)
  }

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
  const { authorizationList, feePayerSignature, nonce, ...tx } =
    TxAA.deserialize(serializedTransaction)
  return {
    ...tx,
    authorizationList: authorizationList?.map((auth) => ({
      ...auth,
      nonce: Number(auth.nonce ?? 0n),
      r: Hex.fromNumber(auth.r, { size: 32 }),
      s: Hex.fromNumber(auth.s, { size: 32 }),
    })),
    nonce: Number(nonce ?? 0n),
    feePayerSignature: feePayerSignature
      ? {
          r: Hex.fromNumber(feePayerSignature.r, { size: 32 }),
          s: Hex.fromNumber(feePayerSignature.s, { size: 32 }),
          yParity: feePayerSignature.yParity,
        }
      : feePayerSignature,
  } satisfies TransactionSerializableAA
}

/** @internal */
async function serializeAA(
  transaction: TransactionSerializableAA & {
    feePayer?: Account | true | undefined
    from?: Address | undefined
  },
  sig?: OneOf<SignatureEnvelope.SignatureEnvelope | viem_Signature> | undefined,
) {
  const signature = (() => {
    if (transaction.signature) return transaction.signature
    if (sig && 'type' in sig) return sig as SignatureEnvelope.SignatureEnvelope
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
            to: rest.to || '0x0000000000000000000000000000000000000000',
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
      if (transaction.from) return transaction.from
      if (signature.type === 'secp256k1')
        return Secp256k1.recoverAddress({
          payload: TxAA.getSignPayload(tx),
          signature: signature.signature,
        })
      throw new Error('Unable to extract sender from transaction or signature.')
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

  if (feePayer === true) {
    const serialized = TxAA.serialize(transaction_ox, {
      feePayerSignature: null,
      signature,
    })
    // if the transaction is ready to be sent off (signed), add the sender
    // and a fee marker to the serialized transaction, so the fee payer proxy
    // can infer the sender address.
    if (transaction.from && signature)
      return Hex.concat(serialized, transaction.from, '0xfeefeefeefee')
    return serialized
  }

  return TxAA.serialize(
    // If we have specified a fee payer, the user will not be signing over the fee token.
    // Defer the fee token signing to the fee payer.
    { ...transaction_ox, ...(feePayer ? { feeToken: undefined } : {}) },
    {
      feePayerSignature: undefined,
      signature,
    },
  )
}
