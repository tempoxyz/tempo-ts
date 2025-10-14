import {
  type Account,
  type Address,
  type Chain,
  type Client,
  type ExtractAbiItem,
  type GetEventArgs,
  type Log,
  parseEventLogs,
  type TransactionReceipt,
  type Transport,
  type Log as viem_Log,
  type WatchContractEventParameters,
  type WriteContractReturnType,
} from 'viem'
import { parseAccount } from 'viem/accounts'
import {
  readContract,
  watchContractEvent,
  writeContract,
  writeContractSync,
} from 'viem/actions'
import type { Compute, UnionOmit } from '../../internal/types.js'
import * as TokenId from '../../ox/TokenId.js'
import * as Abis from '../Abis.js'
import * as Addresses from '../Addresses.js'
import type {
  GetAccountParameter,
  ReadParameters,
  WriteParameters,
} from '../internal/types.js'
import { defineCall } from '../internal/utils.js'

/**
 * Gets the user's default fee token.
 *
 * @example
 * ```ts
 * import { createClient, http } from 'viem'
 * import { tempo } from 'tempo.ts/chains'
 * import * as actions from 'tempo.ts/viem/actions'
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
): Promise<getUserToken.ReturnValue> {
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
  > = ReadParameters & GetAccountParameter<account>

  export type Args = {
    /** Account address. */
    account: Address
  }

  export type ReturnValue = Compute<{
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
      address: Addresses.feeManager,
      abi: Abis.feeManager,
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
 * import { tempo } from 'tempo.ts/chains'
 * import * as actions from 'tempo.ts/viem/actions'
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
): Promise<setUserToken.ReturnValue> {
  return setUserToken.inner(writeContract, client, parameters)
}

export namespace setUserToken {
  export type Parameters<
    chain extends Chain | undefined = Chain | undefined,
    account extends Account | undefined = Account | undefined,
  > = WriteParameters<chain, account> & Args

  export type Args = {
    /** Address or ID of the TIP20 token. */
    token: TokenId.TokenIdOrAddress
  }

  export type ReturnValue = WriteContractReturnType

  /** @internal */
  export async function inner<
    action extends typeof writeContract | typeof writeContractSync,
    chain extends Chain | undefined,
    account extends Account | undefined,
  >(
    action: action,
    client: Client<Transport, chain, account>,
    parameters: setUserToken.Parameters<chain, account>,
  ): Promise<ReturnType<action>> {
    const call = setUserToken.call(parameters)
    return (await action(client, {
      ...parameters,
      ...call,
    } as never)) as never
  }

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
   * import { tempo } from 'tempo.ts/chains'
   * import * as actions from 'tempo.ts/viem/actions'
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
      address: Addresses.feeManager,
      abi: Abis.feeManager,
      functionName: 'setUserToken',
      args: [TokenId.toAddress(token)],
    })
  }

  export function extractEvent(logs: Log[]) {
    const [log] = parseEventLogs({
      abi: Abis.feeManager,
      logs,
      eventName: 'UserTokenSet',
      strict: true,
    })
    if (!log) throw new Error('`UserTokenSet` event not found.')
    return log
  }
}

/**
 * Sets the user's default fee token.
 *
 * @example
 * ```ts
 * import { createClient, http } from 'viem'
 * import { tempo } from 'tempo.ts/chains'
 * import * as actions from 'tempo.ts/viem/actions'
 * import { privateKeyToAccount } from 'viem/accounts'
 *
 * const client = createClient({
 *   account: privateKeyToAccount('0x...'),
 *   chain: tempo,
 *   transport: http(),
 * })
 *
 * const result = await actions.fee.setUserTokenSync(client, {
 *   token: '0x...',
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The transaction receipt and event data.
 */
export async function setUserTokenSync<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: setUserTokenSync.Parameters<chain, account>,
): Promise<setUserTokenSync.ReturnValue> {
  const { throwOnReceiptRevert = true, ...rest } = parameters
  const receipt = await setUserToken.inner(writeContractSync, client, {
    ...rest,
    throwOnReceiptRevert,
  } as never)
  const { args } = setUserToken.extractEvent(receipt.logs)
  return {
    ...args,
    receipt,
  } as never
}

export namespace setUserTokenSync {
  export type Parameters<
    chain extends Chain | undefined = Chain | undefined,
    account extends Account | undefined = Account | undefined,
  > = setUserToken.Parameters<chain, account>

  export type Args = setUserToken.Args

  export type ReturnValue = Compute<
    GetEventArgs<
      typeof Abis.feeManager,
      'UserTokenSet',
      { IndexedOnly: false; Required: true }
    > & {
      receipt: TransactionReceipt
    }
  >
}

/**
 * Watches for user token set events.
 *
 * @example
 * ```ts
 * import { createClient, http } from 'viem'
 * import { tempo } from 'tempo.ts/chains'
 * import * as actions from 'tempo.ts/viem/actions'
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
    address: Addresses.feeManager,
    abi: Abis.feeManager,
    eventName: 'UserTokenSet',
    onLogs: (logs) => {
      for (const log of logs) onUserTokenSet(log.args, log)
    },
    strict: true,
  })
}

export declare namespace watchSetUserToken {
  export type Args = GetEventArgs<
    typeof Abis.feeManager,
    'UserTokenSet',
    { IndexedOnly: false; Required: true }
  >

  export type Log = viem_Log<
    bigint,
    number,
    false,
    ExtractAbiItem<typeof Abis.feeManager, 'UserTokenSet'>,
    true
  >

  export type Parameters = UnionOmit<
    WatchContractEventParameters<typeof Abis.feeManager, 'UserTokenSet', true>,
    'abi' | 'address' | 'batch' | 'eventName' | 'onLogs' | 'strict'
  > & {
    /** Callback to invoke when a user token is set. */
    onUserTokenSet: (args: Args, log: Log) => void
  }
}
