import type * as Authorization from 'ox/Authorization'
import type * as Errors from 'ox/Errors'
import type * as Calls from 'ox/erc7821/Calls'
import * as Execute from 'ox/erc7821/Execute'
import type * as Hex from 'ox/Hex'
import * as ox_TransactionRequest from 'ox/TransactionRequest'
import type { Compute } from '../internal/types.js'
import * as TokenId from './TokenId.js'
import * as Transaction from './Transaction.js'

/** A Transaction Request that is generic to all transaction types, as defined in the [Execution API specification](https://github.com/ethereum/execution-apis/blob/4aca1d7a3e5aab24c8f6437131289ad386944eaa/src/schemas/transaction.yaml#L358-L423). */
export type TransactionRequest<
  bigintType = bigint,
  numberType = number,
  type extends string = string,
> = Compute<
  ox_TransactionRequest.TransactionRequest<bigintType, numberType, type> & {
    calls?: readonly Calls.Call[] | undefined
    feeToken?: TokenId.TokenIdOrAddress | undefined
  }
>

/** RPC representation of a {@link ox#TransactionRequest.TransactionRequest}. */
export type Rpc = TransactionRequest<Hex.Hex, Hex.Hex, string>

/**
 * Converts a {@link ox#TransactionRequest.TransactionRequest} to a {@link ox#TransactionRequest.Rpc}.
 *
 * @example
 * ```ts twoslash
 * import { Value } from 'ox'
 * import { TransactionRequest } from 'ox/tempo'
 *
 * const request = TransactionRequest.toRpc({
 *   feeToken: '0x20c0000000000000000000000000000000000000',
 *   to: '0x0000000000000000000000000000000000000000',
 *   value: Value.fromEther('0.01'),
 * })
 * ```
 *
 * @example
 * ### Using with a Provider
 *
 * You can use {@link ox#Provider.(from:function)} to instantiate an EIP-1193 Provider and
 * send a transaction to the Wallet using the `eth_sendTransaction` method.
 *
 * ```ts twoslash
 * import 'ox/window'
 * import { Provider, Value } from 'ox'
 * import { TransactionRequest } from 'ox/tempo'
 *
 * const provider = Provider.from(window.ethereum!)
 *
 * const request = TransactionRequest.toRpc({
 *   feeToken: '0x20c0000000000000000000000000000000000000',
 *   to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
 *   value: Value.fromEther('0.01'),
 * })
 *
 * const hash = await provider.request({ // [!code focus]
 *   method: 'eth_sendTransaction', // [!code focus]
 *   params: [request], // [!code focus]
 * }) // [!code focus]
 * ```
 *
 * @param request - The request to convert.
 * @returns An RPC request.
 */
export function toRpc(request: TransactionRequest): Rpc {
  const request_rpc = ox_TransactionRequest.toRpc(request) as Rpc
  if (typeof request.feeToken !== 'undefined')
    request_rpc.feeToken = TokenId.toAddress(request.feeToken)
  if (request.calls && request.from) {
    delete request_rpc.to
    delete request_rpc.value
    delete request_rpc.data
    request_rpc.to = request.from
    request_rpc.data = Execute.encodeData(request.calls)
  }
  if (
    request.calls ||
    typeof request.feeToken !== 'undefined' ||
    request.type === 'feeToken'
  )
    request_rpc.type = Transaction.toRpcType.feeToken
  return request_rpc
}

export declare namespace toRpc {
  export type ErrorType =
    | Authorization.toRpcList.ErrorType
    | Hex.fromNumber.ErrorType
    | Errors.GlobalErrorType
}
