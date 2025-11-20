// TODO: Find opportunities to make this file less duplicated + more simplified with Viem v3.

import * as Hex from 'ox/Hex'
import {
  type Chain,
  type Account as viem_Account,
  formatTransaction as viem_formatTransaction,
  formatTransactionRequest as viem_formatTransactionRequest,
} from 'viem'
import { parseAccount } from 'viem/accounts'
import type { UnionOmit } from '../internal/types.js'
import * as ox_Transaction from '../ox/Transaction.js'
import * as ox_TransactionRequest from '../ox/TransactionRequest.js'
import type { GetFeeTokenParameter } from './internal/types.js'
import {
  isTempo,
  type Transaction,
  type TransactionRequest,
  type TransactionRequestRpc,
  type TransactionRpc,
} from './Transaction.js'

export const formatTransaction = (
  transaction: TransactionRpc,
): Transaction<bigint, number, boolean> => {
  if (!isTempo(transaction)) return viem_formatTransaction(transaction as never)

  const {
    feePayerSignature,
    gasPrice: _,
    nonce,
    ...tx
  } = ox_Transaction.fromRpc(transaction as never) as ox_Transaction.AA

  return {
    ...tx,
    accessList: tx.accessList!,
    authorizationList: tx.authorizationList?.map((auth) => ({
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
    type: tx.type as 'aa',
  }
}

type Request<chain extends Chain | undefined> = UnionOmit<
  TransactionRequest,
  'feeToken'
> &
  GetFeeTokenParameter<chain> & { account?: viem_Account | undefined }
export const formatTransactionRequest = <chain extends Chain | undefined>(
  r: Request<chain>,
  action?: string | undefined,
): TransactionRequestRpc => {
  const request = r as Request<chain>

  // Convert EIP-1559 transactions to AA transactions.
  if (request.type === 'eip1559') (request as any).type = 'aa'

  // If the request is not a Tempo transaction, route to Viem formatter.
  if (!isTempo(request))
    return viem_formatTransactionRequest(
      r as never,
      action,
    ) as TransactionRequestRpc

  if (action)
    request.calls = request.calls ?? [
      {
        to: r.to || '0x0000000000000000000000000000000000000000',
        value: r.value,
        data: r.data,
      },
    ]

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
    type: 'aa',
  } as never)

  if (action === 'estimateGas' || action === 'fillTransaction') {
    rpc.maxFeePerGas = undefined
    rpc.maxPriorityFeePerGas = undefined
  }

  // JSON-RPC accounts (wallets) don't support Tempo transactions yet,
  // we will omit the type to attempt to make them compatible
  // with the base transaction structure.
  // TODO: `calls` will not be supported by a lot of JSON-RPC accounts (wallet),
  // use `wallet_sendCalls` or sequential `eth_sendTransaction` to mimic the
  // behavior of `calls`.
  if (request.account?.type === 'json-rpc') {
    if (rpc.calls?.length && rpc.calls.length > 1)
      throw new Error(
        'Batch calls are not supported with JSON-RPC accounts yet.',
      )
    rpc.type = undefined
  }

  // We rely on `calls` for AA transactions.
  // However, `calls` may not be supported by JSON-RPC accounts (wallets) yet,
  // so we will not remove the `data`, `to`, and `value` fields to make it
  // compatible with the base transaction structure.
  if (request.account?.type !== 'json-rpc') {
    rpc.to = undefined
    rpc.data = undefined
    rpc.value = undefined
  }

  if ((request.account as any)?.parentAddress)
    rpc.from = (request.account as any).parentAddress

  const [keyType, keyData] = (() => {
    if (!r.account?.source) return [undefined, undefined]
    if (r.account.source === 'webAuthn')
      // TODO: derive correct bytes size of key data based on webauthn create metadata.
      return ['webAuthn', `0x${'ff'.repeat(1400)}`]
    if (['p256', 'secp256k1'].includes(r.account.source))
      return [r.account.source, undefined]
    return [undefined, undefined]
  })()

  return {
    ...rpc,
    ...(keyType ? { keyType } : {}),
    ...(keyData ? { keyData } : {}),
    ...(request.feePayer
      ? {
          feePayer:
            typeof request.feePayer === 'object'
              ? parseAccount(request.feePayer)
              : request.feePayer,
        }
      : {}),
  } as never
}
