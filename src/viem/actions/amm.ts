import {
  type Account,
  type Address,
  type Chain,
  type Client,
  type ExtractAbiItem,
  type GetEventArgs,
  type Hex,
  type Log,
  parseEventLogs,
  type ReadContractReturnType,
  type TransactionReceipt,
  type Transport,
  type Log as viem_Log,
  type WatchContractEventParameters,
} from 'viem'
import {
  readContract,
  watchContractEvent,
  writeContractSync,
} from 'viem/actions'
import type { Compute, UnionOmit } from '../../internal/types.js'
import * as TokenId from '../../ox/TokenId.js'
import { feeAmmAbi } from '../abis.js'
import { feeManagerAddress } from '../addresses.js'
import type { ReadParameters, WriteParameters } from '../types.js'
import { defineCall } from '../utils.js'

/**
 * Gets the pool ID for a token pair.
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
 * const poolId = await actions.amm.getPoolId(client, {
 *   userToken: '0x...',
 *   validatorToken: '0x...',
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The pool ID.
 */
export async function getPoolId<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  parameters: getPoolId.Parameters,
): Promise<getPoolId.ReturnType> {
  return readContract(client, {
    ...parameters,
    ...getPoolId.call(parameters),
  })
}

export namespace getPoolId {
  export type Parameters = ReadParameters & Args

  export type Args = {
    /** Address or ID of the user token. */
    userToken: TokenId.TokenIdOrAddress
    /** Address or ID of the validator token. */
    validatorToken: TokenId.TokenIdOrAddress
  }

  export type ReturnType = ReadContractReturnType<
    typeof feeAmmAbi,
    'getPoolId',
    never
  >

  /**
   * Defines a call to the `getPoolId` function.
   *
   * @param args - Arguments.
   * @returns The call.
   */
  export function call(args: Args) {
    const { userToken, validatorToken } = args
    return defineCall({
      address: feeManagerAddress,
      abi: feeAmmAbi,
      args: [TokenId.toAddress(userToken), TokenId.toAddress(validatorToken)],
      functionName: 'getPoolId',
    })
  }
}

/**
 * Gets the reserves for a liquidity pool.
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
 * const pool = await actions.amm.getPool(client, {
 *   userToken: '0x...',
 *   validatorToken: '0x...',
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The pool reserves.
 */
export async function getPool<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  parameters: getPool.Parameters,
): Promise<getPool.ReturnType> {
  return readContract(client, {
    ...parameters,
    ...getPool.call(parameters),
  })
}

export namespace getPool {
  export type Parameters = ReadParameters & Args

  export type Args = {
    /** Address or ID of the user token. */
    userToken: TokenId.TokenIdOrAddress
    /** Address or ID of the validator token. */
    validatorToken: TokenId.TokenIdOrAddress
  }

  export type ReturnType = Compute<{
    /** Reserve of user token. */
    reserveUserToken: bigint
    /** Reserve of validator token. */
    reserveValidatorToken: bigint
  }>

  /**
   * Defines a call to the `getPool` function.
   *
   * @param args - Arguments.
   * @returns The call.
   */
  export function call(args: Args) {
    const { userToken, validatorToken } = args
    return defineCall({
      address: feeManagerAddress,
      abi: feeAmmAbi,
      args: [TokenId.toAddress(userToken), TokenId.toAddress(validatorToken)],
      functionName: 'getPool',
    })
  }
}

/**
 * Gets the total supply of LP tokens for a pool.
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
 * const poolId = await actions.amm.getPoolId(client, {
 *   userToken: '0x...',
 *   validatorToken: '0x...',
 * })
 *
 * const totalSupply = await actions.amm.getTotalSupply(client, { poolId })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The total supply of LP tokens.
 */
export async function getTotalSupply<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  parameters: getTotalSupply.Parameters,
): Promise<getTotalSupply.ReturnType> {
  return readContract(client, {
    ...parameters,
    ...getTotalSupply.call(parameters),
  })
}

export namespace getTotalSupply {
  export type Parameters = ReadParameters & Args

  export type Args = {
    /** Pool ID. */
    poolId: Hex
  }

  export type ReturnType = ReadContractReturnType<
    typeof feeAmmAbi,
    'totalSupply',
    never
  >

  /**
   * Defines a call to the `totalSupply` function.
   *
   * @param args - Arguments.
   * @returns The call.
   */
  export function call(args: Args) {
    const { poolId } = args
    return defineCall({
      address: feeManagerAddress,
      abi: feeAmmAbi,
      args: [poolId],
      functionName: 'totalSupply',
    })
  }
}

/**
 * Gets the LP token balance for an account in a specific pool.
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
 * const poolId = await actions.amm.getPoolId(client, {
 *   userToken: '0x...',
 *   validatorToken: '0x...',
 * })
 *
 * const balance = await actions.amm.getLiquidityBalance(client, {
 *   poolId,
 *   address: '0x...',
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The LP token balance.
 */
export async function getLiquidityBalance<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  parameters: getLiquidityBalance.Parameters,
): Promise<getLiquidityBalance.ReturnType> {
  return readContract(client, {
    ...parameters,
    ...getLiquidityBalance.call(parameters),
  })
}

export namespace getLiquidityBalance {
  export type Parameters = ReadParameters & Args

  export type Args = {
    /** Address to check balance for. */
    address: Address
    /** Pool ID. */
    poolId: Hex
  }

  export type ReturnType = ReadContractReturnType<
    typeof feeAmmAbi,
    'liquidityBalances',
    never
  >

  /**
   * Defines a call to the `liquidityBalances` function.
   *
   * @param args - Arguments.
   * @returns The call.
   */
  export function call(args: Args) {
    const { address, poolId } = args
    return defineCall({
      address: feeManagerAddress,
      abi: feeAmmAbi,
      args: [poolId, address],
      functionName: 'liquidityBalances',
    })
  }
}

/**
 * Performs a rebalance swap from validator token to user token.
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
 * const hash = await actions.amm.rebalanceSwap(client, {
 *   userToken: '0x...',
 *   validatorToken: '0x...',
 *   amountOut: 100n,
 *   to: '0x...',
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The transaction hash.
 */
export async function rebalanceSwap<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: rebalanceSwap.Parameters<chain, account>,
): Promise<rebalanceSwap.ReturnType> {
  const call = rebalanceSwap.call(parameters)
  const receipt = await writeContractSync(client, {
    ...parameters,
    ...call,
  } as never)
  const { args } = rebalanceSwap.extractEvent(receipt.logs)
  return {
    ...args,
    receipt,
  } as never
}

export namespace rebalanceSwap {
  export type Parameters<
    chain extends Chain | undefined = Chain | undefined,
    account extends Account | undefined = Account | undefined,
  > = WriteParameters<chain, account> & Args

  export type Args = {
    /** Amount of user token to receive. */
    amountOut: bigint
    /** Address to send the user token to. */
    to: Address
    /** Address or ID of the user token. */
    userToken: TokenId.TokenIdOrAddress
    /** Address or ID of the validator token. */
    validatorToken: TokenId.TokenIdOrAddress
  }

  export type ReturnType = Compute<
    GetEventArgs<
      typeof feeAmmAbi,
      'RebalanceSwap',
      { IndexedOnly: false; Required: true }
    > & {
      /** Transaction receipt. */
      receipt: TransactionReceipt
    }
  >

  /**
   * Defines a call to the `rebalanceSwap` function.
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
   *     actions.amm.rebalanceSwap.call({
   *       userToken: '0x20c0...beef',
   *       validatorToken: '0x20c0...babe',
   *       amountOut: 100n,
   *       to: '0xfeed...fede',
   *     }),
   *     actions.amm.rebalanceSwap.call({
   *       userToken: '0x20c0...babe',
   *       validatorToken: '0x20c0...babe',
   *       amountOut: 100n,
   *       to: '0xfeed...fede',
   *     }),
   *   ]
   * })
   * ```
   *
   * @param args - Arguments.
   * @returns The call.
   */
  export function call(args: Args) {
    const { userToken, validatorToken, amountOut, to } = args
    return defineCall({
      address: feeManagerAddress,
      abi: feeAmmAbi,
      functionName: 'rebalanceSwap',
      args: [
        TokenId.toAddress(userToken),
        TokenId.toAddress(validatorToken),
        amountOut,
        to,
      ],
    })
  }

  /**
   * Extracts the `RebalanceSwap` event from logs.
   *
   * @param logs - The logs.
   * @returns The `RebalanceSwap` event.
   */
  export function extractEvent(logs: Log[]) {
    const [log] = parseEventLogs({
      abi: feeAmmAbi,
      logs,
      eventName: 'RebalanceSwap',
      strict: true,
    })
    if (!log) throw new Error('`RebalanceSwap` event not found.')
    return log
  }
}

/**
 * Adds liquidity to a pool.
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
 * const hash = await actions.amm.mint(client, {
 *   userToken: {
 *     address: '0x20c0...beef',
 *     amount: 100n,
 *   },
 *   validatorToken: {
 *     address: '0x20c0...babe',
 *     amount: 100n,
 *   },
 *   to: '0xfeed...fede',
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The transaction hash.
 */
export async function mint<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: mint.Parameters<chain, account>,
): Promise<mint.ReturnType> {
  const call = mint.call(parameters)
  const receipt = await writeContractSync(client, {
    ...parameters,
    ...call,
  } as never)
  const { args } = mint.extractEvent(receipt.logs)
  return {
    ...args,
    receipt,
  } as never
}

export namespace mint {
  export type Parameters<
    chain extends Chain | undefined = Chain | undefined,
    account extends Account | undefined = Account | undefined,
  > = WriteParameters<chain, account> & Args

  export type Args = {
    /** Address to mint LP tokens to. */
    to: Address
    /** User token address and amount. */
    userToken: {
      /** Address or ID of the user token. */
      address: TokenId.TokenIdOrAddress
      /** Amount of user token to add. */
      amount: bigint
    }
    /** Validator token address and amount. */
    validatorToken: {
      /** Address or ID of the validator token. */
      address: TokenId.TokenIdOrAddress
      /** Amount of validator token to add. */
      amount: bigint
    }
  }

  export type ReturnType = Compute<
    GetEventArgs<
      typeof feeAmmAbi,
      'Mint',
      { IndexedOnly: false; Required: true }
    > & {
      /** Transaction receipt. */
      receipt: TransactionReceipt
    }
  >

  /**
   * Defines a call to the `mint` function.
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
   *     actions.amm.mint.call({
   *       userToken: {
   *         address: '0x20c0...beef',
   *         amount: 100n,
   *       },
   *       validatorToken: {
   *         address: '0x20c0...babe',
   *         amount: 100n,
   *       },
   *       to: '0xfeed...fede',
   *     }),
   *     actions.amm.mint.call({
   *       userToken: {
   *         address: '0x20c0...babe',
   *         amount: 100n,
   *       },
   *       validatorToken: {
   *         address: '0x20c0...babe',
   *         amount: 100n,
   *       },
   *       to: '0xfeed...fede',
   *     }),
   *   ]
   * })
   * ```
   *
   * @param args - Arguments.
   * @returns The call.
   */
  export function call(args: Args) {
    const { to, userToken, validatorToken } = args
    return defineCall({
      address: feeManagerAddress,
      abi: feeAmmAbi,
      functionName: 'mint',
      args: [
        TokenId.toAddress(userToken.address),
        TokenId.toAddress(validatorToken.address),
        userToken.amount,
        validatorToken.amount,
        to,
      ],
    })
  }

  /**
   * Extracts the `Mint` event from logs.
   *
   * @param logs - The logs.
   * @returns The `Mint` event.
   */
  export function extractEvent(logs: Log[]) {
    const [log] = parseEventLogs({
      abi: feeAmmAbi,
      logs,
      eventName: 'Mint',
      strict: true,
    })
    if (!log) throw new Error('`Mint` event not found.')
    return log
  }
}

/**
 * Removes liquidity from a pool.
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
 * const hash = await actions.amm.burn(client, {
 *   userToken: '0x20c0...beef',
 *   validatorToken: '0x20c0...babe',
 *   liquidity: 50n,
 *   to: '0xfeed...fede',
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The transaction hash.
 */
export async function burn<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: burn.Parameters<chain, account>,
): Promise<burn.ReturnType> {
  const call = burn.call(parameters)
  const receipt = await writeContractSync(client, {
    ...parameters,
    ...call,
  } as never)
  const { args } = burn.extractEvent(receipt.logs)
  return {
    ...args,
    receipt,
  } as never
}

export namespace burn {
  export type Parameters<
    chain extends Chain | undefined = Chain | undefined,
    account extends Account | undefined = Account | undefined,
  > = WriteParameters<chain, account> & Args

  export type Args = {
    /** Amount of LP tokens to burn. */
    liquidity: bigint
    /** Address to send tokens to. */
    to: Address
    /** Address or ID of the user token. */
    userToken: TokenId.TokenIdOrAddress
    /** Address or ID of the validator token. */
    validatorToken: TokenId.TokenIdOrAddress
  }

  export type ReturnType = Compute<
    GetEventArgs<
      typeof feeAmmAbi,
      'Burn',
      { IndexedOnly: false; Required: true }
    > & {
      /** Transaction receipt. */
      receipt: TransactionReceipt
    }
  >

  /**
   * Defines a call to the `burn` function.
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
   *     actions.amm.burn.call({
   *       liquidity: 100n,
   *       to: '0xfeed...fede',
   *       userToken: '0x20c0...beef',
   *       validatorToken: '0x20c0...babe',
   *     }),
   *     actions.amm.burn.call({
   *       liquidity: 100n,
   *       to: '0xfeed...fede',
   *       userToken: '0x20c0...babe',
   *       validatorToken: '0x20c0...babe',
   *     }),
   *   ]
   * })
   * ```
   *
   * @param args - Arguments.
   * @returns The call.
   */
  export function call(args: Args) {
    const { liquidity, to, userToken, validatorToken } = args
    return defineCall({
      address: feeManagerAddress,
      abi: feeAmmAbi,
      functionName: 'burn',
      args: [
        TokenId.toAddress(userToken),
        TokenId.toAddress(validatorToken),
        liquidity,
        to,
      ],
    })
  }

  /**
   * Extracts the `Burn` event from logs.
   *
   * @param logs - The logs.
   * @returns The `Burn` event.
   */
  export function extractEvent(logs: Log[]) {
    const [log] = parseEventLogs({
      abi: feeAmmAbi,
      logs,
      eventName: 'Burn',
      strict: true,
    })
    if (!log) throw new Error('`Burn` event not found.')
    return log
  }
}

/**
 * Watches for rebalance swap events.
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
 * const unwatch = actions.amm.watchRebalanceSwap(client, {
 *   onRebalanceSwap: (args, log) => {
 *     console.log('Rebalance swap:', args)
 *   },
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns A function to unsubscribe from the event.
 */
export function watchRebalanceSwap<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: watchRebalanceSwap.Parameters,
) {
  const { onRebalanceSwap, userToken, validatorToken, ...rest } = parameters
  return watchContractEvent(client, {
    ...rest,
    address: feeManagerAddress,
    abi: feeAmmAbi,
    eventName: 'RebalanceSwap',
    args:
      userToken !== undefined && validatorToken !== undefined
        ? {
            userToken: TokenId.toAddress(userToken),
            validatorToken: TokenId.toAddress(validatorToken),
          }
        : undefined,
    onLogs: (logs) => {
      for (const log of logs) onRebalanceSwap(log.args, log)
    },
    strict: true,
  })
}

export declare namespace watchRebalanceSwap {
  export type Args = GetEventArgs<
    typeof feeAmmAbi,
    'RebalanceSwap',
    { IndexedOnly: false; Required: true }
  >

  export type Log = viem_Log<
    bigint,
    number,
    false,
    ExtractAbiItem<typeof feeAmmAbi, 'RebalanceSwap'>,
    true
  >

  export type Parameters = UnionOmit<
    WatchContractEventParameters<typeof feeAmmAbi, 'RebalanceSwap', true>,
    'abi' | 'address' | 'batch' | 'eventName' | 'onLogs' | 'strict'
  > & {
    /** Callback to invoke when a rebalance swap occurs. */
    onRebalanceSwap: (args: Args, log: Log) => void
    /** Address or ID of the user token to filter events. */
    userToken?: TokenId.TokenIdOrAddress | undefined
    /** Address or ID of the validator token to filter events. */
    validatorToken?: TokenId.TokenIdOrAddress | undefined
  }
}

/**
 * Watches for fee swap events.
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
 * const unwatch = actions.amm.watchFeeSwap(client, {
 *   onFeeSwap: (args, log) => {
 *     console.log('Fee swap:', args)
 *   },
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns A function to unsubscribe from the event.
 */
export function watchFeeSwap<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: watchFeeSwap.Parameters,
) {
  const { onFeeSwap, userToken, validatorToken, ...rest } = parameters
  return watchContractEvent(client, {
    ...rest,
    address: feeManagerAddress,
    abi: feeAmmAbi,
    eventName: 'FeeSwap',
    args:
      userToken !== undefined && validatorToken !== undefined
        ? {
            userToken: TokenId.toAddress(userToken),
            validatorToken: TokenId.toAddress(validatorToken),
          }
        : undefined,
    onLogs: (logs) => {
      for (const log of logs) onFeeSwap(log.args, log)
    },
    strict: true,
  })
}

export declare namespace watchFeeSwap {
  export type Args = GetEventArgs<
    typeof feeAmmAbi,
    'FeeSwap',
    { IndexedOnly: false; Required: true }
  >

  export type Log = viem_Log<
    bigint,
    number,
    false,
    ExtractAbiItem<typeof feeAmmAbi, 'FeeSwap'>,
    true
  >

  export type Parameters = UnionOmit<
    WatchContractEventParameters<typeof feeAmmAbi, 'FeeSwap', true>,
    'abi' | 'address' | 'batch' | 'eventName' | 'onLogs' | 'strict'
  > & {
    /** Callback to invoke when a fee swap occurs. */
    onFeeSwap: (args: Args, log: Log) => void
    /** Address or ID of the user token to filter events. */
    userToken?: TokenId.TokenIdOrAddress | undefined
    /** Address or ID of the validator token to filter events. */
    validatorToken?: TokenId.TokenIdOrAddress | undefined
  }
}

/**
 * Watches for liquidity mint events.
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
 * const unwatch = actions.amm.watchMint(client, {
 *   onMint: (args, log) => {
 *     console.log('Liquidity added:', args)
 *   },
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns A function to unsubscribe from the event.
 */
export function watchMint<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(client: Client<Transport, chain, account>, parameters: watchMint.Parameters) {
  const { onMint, sender, userToken, validatorToken, ...rest } = parameters
  return watchContractEvent(client, {
    ...rest,
    address: feeManagerAddress,
    abi: feeAmmAbi,
    eventName: 'Mint',
    args: {
      ...(sender !== undefined && {
        sender: TokenId.toAddress(sender),
      }),
      ...(userToken !== undefined && {
        userToken: TokenId.toAddress(userToken),
      }),
      ...(validatorToken !== undefined && {
        validatorToken: TokenId.toAddress(validatorToken),
      }),
    },
    onLogs: (logs) => {
      for (const log of logs)
        onMint(
          {
            liquidity: log.args.liquidity,
            sender: log.args.sender,
            userToken: {
              address: log.args.userToken,
              amount: log.args.amountUserToken,
            },
            validatorToken: {
              address: log.args.validatorToken,
              amount: log.args.amountValidatorToken,
            },
          },
          log,
        )
    },
    strict: true,
  })
}

export declare namespace watchMint {
  export type Args = {
    liquidity: bigint
    sender: Address
    userToken: {
      address: Address
      amount: bigint
    }
    validatorToken: {
      address: Address
      amount: bigint
    }
  }

  export type Log = viem_Log<
    bigint,
    number,
    false,
    ExtractAbiItem<typeof feeAmmAbi, 'Mint'>,
    true
  >

  export type Parameters = UnionOmit<
    WatchContractEventParameters<typeof feeAmmAbi, 'Mint', true>,
    'abi' | 'address' | 'batch' | 'eventName' | 'onLogs' | 'strict'
  > & {
    /** Callback to invoke when liquidity is added. */
    onMint: (args: Args, log: Log) => void
    /** Address or ID of the sender to filter events. */
    sender?: TokenId.TokenIdOrAddress | undefined
    /** Address or ID of the user token to filter events. */
    userToken?: TokenId.TokenIdOrAddress | undefined
    /** Address or ID of the validator token to filter events. */
    validatorToken?: TokenId.TokenIdOrAddress | undefined
  }
}

/**
 * Watches for liquidity burn events.
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
 * const unwatch = actions.amm.watchBurn(client, {
 *   onBurn: (args, log) => {
 *     console.log('Liquidity removed:', args)
 *   },
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns A function to unsubscribe from the event.
 */
export function watchBurn<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(client: Client<Transport, chain, account>, parameters: watchBurn.Parameters) {
  const { onBurn, userToken, validatorToken, ...rest } = parameters
  return watchContractEvent(client, {
    ...rest,
    address: feeManagerAddress,
    abi: feeAmmAbi,
    eventName: 'Burn',
    args:
      userToken !== undefined && validatorToken !== undefined
        ? {
            userToken: TokenId.toAddress(userToken),
            validatorToken: TokenId.toAddress(validatorToken),
          }
        : undefined,
    onLogs: (logs) => {
      for (const log of logs) onBurn(log.args, log)
    },
    strict: true,
  })
}

export declare namespace watchBurn {
  export type Args = GetEventArgs<
    typeof feeAmmAbi,
    'Burn',
    { IndexedOnly: false; Required: true }
  >

  export type Log = viem_Log<
    bigint,
    number,
    false,
    ExtractAbiItem<typeof feeAmmAbi, 'Burn'>,
    true
  >

  export type Parameters = UnionOmit<
    WatchContractEventParameters<typeof feeAmmAbi, 'Burn', true>,
    'abi' | 'address' | 'batch' | 'eventName' | 'onLogs' | 'strict'
  > & {
    /** Callback to invoke when liquidity is removed. */
    onBurn: (args: Args, log: Log) => void
    /** Address or ID of the user token to filter events. */
    userToken?: TokenId.TokenIdOrAddress | undefined
    /** Address or ID of the validator token to filter events. */
    validatorToken?: TokenId.TokenIdOrAddress | undefined
  }
}
