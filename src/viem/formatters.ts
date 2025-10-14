import * as Hex from 'ox/Hex'
import {
  formatTransaction as viem_formatTransaction,
  formatTransactionRequest as viem_formatTransactionRequest,
} from 'viem'
import { parseAccount } from 'viem/accounts'
import * as ox_Transaction from '../ox/Transaction.js'
import * as ox_TransactionRequest from '../ox/TransactionRequest.js'
import {
  isTempoTransaction,
  type Transaction,
  type TransactionRequest,
  type TransactionRequestFeeToken,
  type TransactionRequestRpc,
  type TransactionRpc,
} from './transaction.js'

export const formatTransaction = (
  transaction: TransactionRpc,
): Transaction<bigint, number, boolean> => {
  if (!isTempoTransaction(transaction))
    return viem_formatTransaction(transaction as never)

  const {
    feePayerSignature,
    gasPrice: _,
    nonce,
    ...tx
  } = ox_Transaction.fromRpc(transaction as never) as ox_Transaction.FeeToken
  return {
    ...tx,
    accessList: tx.accessList!,
    authorizationList: tx.authorizationList!.map((auth) => ({
      ...auth,
      nonce: Number(auth.nonce),
      r: Hex.fromNumber(auth.r, { size: 32 }),
      s: Hex.fromNumber(auth.s, { size: 32 }),
    })),
    feePayerSignature: feePayerSignature
      ? {
          r: Hex.fromNumber(feePayerSignature.r, { size: 32 }),
          s: Hex.fromNumber(feePayerSignature.s, { size: 32 }),
          v: BigInt(feePayerSignature.v ?? 27),
          yParity: feePayerSignature.yParity,
        }
      : undefined,
    nonce: Number(nonce),
    typeHex:
      ox_Transaction.toRpcType[
        tx.type as keyof typeof ox_Transaction.toRpcType
      ],
    type: tx.type as 'feeToken',
    r: Hex.fromNumber(tx.r, { size: 32 }),
    s: Hex.fromNumber(tx.s, { size: 32 }),
    v: BigInt(tx.v ?? 27),
  }
}

export const formatTransactionRequest = (
  r: TransactionRequest,
  action?: string | undefined,
): TransactionRequestRpc => {
  const request = r as TransactionRequestFeeToken

  if (!isTempoTransaction(request))
    return viem_formatTransactionRequest(
      r as never,
      action,
    ) as TransactionRequestRpc

  const rpc = ox_TransactionRequest.toRpc({
    ...request,
    authorizationList: request.authorizationList?.map((auth) => ({
      ...auth,
      nonce: BigInt(auth.nonce),
      r: BigInt(auth.r!),
      s: BigInt(auth.s!),
      yParity: Number(auth.yParity),
    })),
    nonce: request.nonce ? BigInt(request.nonce) : undefined,
    type: 'feeToken',
  })
  return {
    ...rpc,
    ...(request.feePayer
      ? {
          feePayer:
            typeof request.feePayer === 'object'
              ? parseAccount(request.feePayer)
              : request.feePayer,
        }
      : {}),
    ...(action === 'estimateGas'
      ? {
          maxFeePerGas: undefined,
          maxPriorityFeePerGas: undefined,
        }
      : {}),
  } as never
}
