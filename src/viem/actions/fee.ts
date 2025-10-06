import type {
  Account,
  Address,
  Chain,
  Client,
  ExtractAbiItem,
  GetEventArgs,
  ReadContractParameters,
  Transport,
  Log as viem_Log,
  WatchContractEventParameters,
  WriteContractParameters,
  WriteContractReturnType,
} from 'viem'
import { parseAccount } from 'viem/accounts'
import { readContract, watchContractEvent, writeContract } from 'viem/actions'
import type { Compute, UnionOmit } from '../../internal/types.js'
import * as TokenId from '../../ox/TokenId.js'
import { feeManagerAbi } from '../abis.js'
import { feeManagerAddress } from '../addresses.js'
import type { GetAccountParameter } from '../types.js'
import { defineCall } from '../utils.js'

/**
 * Gets the user's default fee token.
 *
 * @example
 * ```ts
 * import { createClient, http } from 'viem'
 * import { tempo } from 'tempo/chains'
 * import * as actions from 'tempo/viem/actions'
 * import { privateKeyToAccount } from 'viem/accounts'
 *
 * const client = createClient({
 *   account: privateKeyToAccount('0x...'),
 *   chain: tempo,
 *   transport: http(),
 * })
 *
 * const { address, id } = await actions.fee.getUserToken(client)
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The transaction hash.
 */
export async function getUserToken<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  ...parameters: account extends Account
    ? [getUserToken.Parameters<account>] | []
    : [getUserToken.Parameters<account>]
): Promise<getUserToken.ReturnType> {
  const { account: account_ = client.account, ...rest } = parameters[0] ?? {}
  if (!account_) throw new Error('account is required.')
  const account = parseAccount(account_)
  const address = await readContract(client, {
    ...rest,
    ...getUserToken.call({ account: account.address }),
  })
  return {
    address,
    id: TokenId.fromAddress(address),
  }
}

export namespace getUserToken {
  export type Parameters<
    account extends Account | undefined = Account | undefined,
  > = UnionOmit<
    ReadContractParameters<never, never, never>,
    'abi' | 'address' | 'functionName' | 'args'
  > &
    GetAccountParameter<account>

  export type Args = {
    /** Account address. */
    account: Address
  }

  export type ReturnType = Compute<{
    address: Address
    id: bigint
  }>

  /**
   * Defines a call to the `userTokens` function.
   *
   * @param args - Arguments.
   * @returns The call.
   */
  export function call(args: Args) {
    const { account } = args
    return defineCall({
      address: feeManagerAddress,
      abi: feeManagerAbi,
      args: [account],
      functionName: 'userTokens',
    })
  }
}

/**
 * Sets the user's default fee token.
 *
 * @example
 * ```ts
 * import { createClient, http } from 'viem'
 * import { tempo } from 'tempo/chains'
 * import * as actions from 'tempo/viem/actions'
 * import { privateKeyToAccount } from 'viem/accounts'
 *
 * const client = createClient({
 *   account: privateKeyToAccount('0x...'),
 *   chain: tempo,
 *   transport: http(),
 * })
 *
 * const hash = await actions.fee.setUserToken(client, {
 *   token: '0x...',
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The transaction hash.
 */
export async function setUserToken<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: setUserToken.Parameters<chain, account>,
): Promise<setUserToken.ReturnType> {
  const call = setUserToken.call(parameters)
  return writeContract(client, {
    ...parameters,
    ...call,
  } as never)
}

export namespace setUserToken {
  export type Parameters<
    chain extends Chain | undefined = Chain | undefined,
    account extends Account | undefined = Account | undefined,
  > = UnionOmit<
    WriteContractParameters<never, never, never, chain, account>,
    'abi' | 'address' | 'functionName' | 'args'
  > &
    Args

  export type Args = {
    /** Address or ID of the TIP20 token. */
    token: TokenId.TokenIdOrAddress
  }

  export type ReturnType = WriteContractReturnType

  /**
   * Defines a call to the `setUserToken` function.
   *
   * Can be passed as a parameter to:
   * - [`estimateContractGas`](https://viem.sh/docs/contract/estimateContractGas): estimate the gas cost of the call
   * - [`simulateContract`](https://viem.sh/docs/contract/simulateContract): simulate the call
   * - [`sendCalls`](https://viem.sh/docs/actions/wallet/sendCalls): send multiple calls
   *
   * @example
   * ```ts
   * import { createClient, http, walletActions } from 'viem'
   * import { tempo } from 'tempo/chains'
   * import * as actions from 'tempo/viem/actions'
   *
   * const client = createClient({
   *   chain: tempo,
   *   transport: http(),
   * }).extend(walletActions)
   *
   * const { result } = await client.sendCalls({
   *   calls: [
   *     actions.fee.setUserToken.call({
   *       token: '0x20c0...beef',
   *     }),
   *     actions.fee.setUserToken.call({
   *       token: '0x20c0...babe',
   *     }),
   *   ]
   * })
   * ```
   *
   * @param args - Arguments.
   * @returns The call.
   */
  export function call(args: Args) {
    const { token } = args
    return defineCall({
      address: feeManagerAddress,
      abi: feeManagerAbi,
      functionName: 'setUserToken',
      args: [TokenId.toAddress(token)],
    })
  }
}

/**
 * Watches for user token set events.
 *
 * @example
 * ```ts
 * import { createClient, http } from 'viem'
 * import { tempo } from 'tempo/chains'
 * import * as actions from 'tempo/viem/actions'
 *
 * const client = createClient({
 *   chain: tempo,
 *   transport: http(),
 * })
 *
 * const unwatch = actions.fee.watchSetUserToken(client, {
 *   onUserTokenSet: (args, log) => {
 *     console.log('User token set:', args)
 *   },
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns A function to unsubscribe from the event.
 */
export function watchSetUserToken<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: watchSetUserToken.Parameters,
) {
  const { onUserTokenSet, ...rest } = parameters
  return watchContractEvent(client, {
    ...rest,
    address: feeManagerAddress,
    abi: feeManagerAbi,
    eventName: 'UserTokenSet',
    onLogs: (logs) => {
      for (const log of logs) onUserTokenSet(log.args, log)
    },
    strict: true,
  })
}

export declare namespace watchSetUserToken {
  export type Args = GetEventArgs<
    typeof feeManagerAbi,
    'UserTokenSet',
    { IndexedOnly: false; Required: true }
  >

  export type Log = viem_Log<
    bigint,
    number,
    false,
    ExtractAbiItem<typeof feeManagerAbi, 'UserTokenSet'>,
    true
  >

  export type Parameters = UnionOmit<
    WatchContractEventParameters<typeof feeManagerAbi, 'UserTokenSet', true>,
    'abi' | 'address' | 'batch' | 'eventName' | 'onLogs' | 'strict'
  > & {
    /** Callback to invoke when a user token is set. */
    onUserTokenSet: (args: Args, log: Log) => void
  }
}
