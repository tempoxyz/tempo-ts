import {
  type Chain,
  type ChainConfig,
  defineTransaction,
  defineTransactionRequest,
  type OneOf,
  serializeTransaction,
  type TransactionSerializable,
} from 'viem'
import * as Transaction from '../ox/Transaction.js'
import * as TxFeeToken from '../ox/TransactionEnvelopeFeeToken.js'
import * as TransactionRequest from '../ox/TransactionRequest.js'

export const config = {
  blockTime: 1_000,
  formatters: {
    transaction: defineTransaction({ format: Transaction.fromRpc }),
    transactionRequest: defineTransactionRequest({
      format: TransactionRequest.toRpc,
    }),
  },
  serializers: {
    transaction(
      transaction: OneOf<
        TxFeeToken.TransactionEnvelopeFeeToken | TransactionSerializable
      >,
    ) {
      if (transaction.type === 'feeToken')
        return TxFeeToken.serialize(transaction)
      return serializeTransaction(transaction)
    },
  },
} satisfies Pick<Chain, 'blockTime'> & ChainConfig
