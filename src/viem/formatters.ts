import type { Account } from 'viem'
import { parseAccount } from 'viem/accounts'
import * as Transaction from '../ox/Transaction.js'
import * as TransactionRequest from '../ox/TransactionRequest.js'

export const formatTransaction = Transaction.fromRpc

export const formatTransactionRequest = (
  request: TransactionRequest.TransactionRequest & {
    feePayer?: Account | undefined
  },
): TransactionRequest.Rpc & {
  feePayer?: Account | undefined
} => {
  const rpc = TransactionRequest.toRpc(request)
  return {
    ...rpc,
    ...(request.feePayer
      ? {
          feePayer: parseAccount(request.feePayer),
          maxFeePerGas: '0x0',
          maxPriorityFeePerGas: '0x0',
        }
      : {}),
  }
}
