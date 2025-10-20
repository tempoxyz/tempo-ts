import {
  type Chain,
  type ChainConfig,
  defineTransaction,
  defineTransactionRequest,
  type SerializeTransactionFn,
} from 'viem'
import * as Formatters from './Formatters.js'
import * as Transaction from './Transaction.js'

export const config = {
  blockTime: 1_000,
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 0,
    },
  },
  formatters: {
    transaction: defineTransaction({ format: Formatters.formatTransaction }),
    transactionRequest: defineTransactionRequest({
      format: Formatters.formatTransactionRequest,
    }),
  },
  serializers: {
    // TODO: casting to satisfy viem – viem v3 to have more flexible serializer type.
    transaction: Transaction.serialize as SerializeTransactionFn,
  },
} satisfies Pick<Chain, 'blockTime' | 'contracts'> & ChainConfig
