import * as Signature from 'ox/Signature'
import {
  type Account,
  type TransactionSerializable,
  type Signature as viem_Signature,
  serializeTransaction as viem_serializeTransaction,
} from 'viem'
import type { OneOf } from '../internal/types.js'
import * as TxFeeToken from '../ox/TransactionEnvelopeFeeToken.js'

export async function serializeTransaction(
  transaction: OneOf<
    TxFeeToken.TransactionEnvelopeFeeToken | TransactionSerializable
  > & {
    feePayer?: Account | undefined
  },
  signature?: viem_Signature | undefined,
) {
  if (
    transaction.type === 'feeToken' ||
    typeof transaction.feePayer !== 'undefined' ||
    typeof transaction.feeToken !== 'undefined'
  ) {
    if (signature && transaction.feePayer) {
      const tx = TxFeeToken.from(transaction as never, {
        signature: signature as never,
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
    return TxFeeToken.serialize(transaction as never, {
      signature: signature as never,
    })
  }
  return viem_serializeTransaction(transaction, signature)
}
