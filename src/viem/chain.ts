import {
  type Chain,
  type ChainConfig,
  defineTransaction,
  defineTransactionRequest,
} from 'viem'
import { formatTransaction, formatTransactionRequest } from './formatters.js'
import { serializeTransaction } from './serializers.js'

export const chainConfig = {
  blockTime: 1_000,
  formatters: {
    transaction: defineTransaction({ format: formatTransaction }),
    transactionRequest: defineTransactionRequest({
      format: formatTransactionRequest,
    }),
  },
  serializers: {
    transaction: serializeTransaction,
  },
} satisfies Pick<Chain, 'blockTime'> & ChainConfig
