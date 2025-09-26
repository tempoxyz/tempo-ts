import {
  type Signature,
  type TransactionSerializable,
  serializeTransaction as viem_serializeTransaction,
} from 'viem'
import type { OneOf } from '../internal/types.js'
import * as TxFeeToken from '../ox/TransactionEnvelopeFeeToken.js'

export function serializeTransaction(
  transaction: OneOf<
    TxFeeToken.TransactionEnvelopeFeeToken | TransactionSerializable
  >,
  signature?: Signature | undefined,
) {
  if (transaction.type === 'feeToken' || transaction.feeToken)
    return TxFeeToken.serialize(transaction, {
      signature: signature as never,
    })
  return viem_serializeTransaction(transaction, signature)
}
