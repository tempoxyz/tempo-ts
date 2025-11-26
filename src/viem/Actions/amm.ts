import {
  type Account,
  type Address,
  type Chain,
  type Client,
  type ExtractAbiItem,
  type GetEventArgs,
  type Hex,
  type Log,
  type MulticallParameters,
  parseEventLogs,
  type ReadContractReturnType,
  type TransactionReceipt,
  type Transport,
  type Log as viem_Log,
  type WatchContractEventParameters,
  type WriteContractReturnType,
} from 'viem'
import {
  multicall,
  readContract,
  watchContractEvent,
  writeContract,
  writeContractSync,
} from 'viem/actions'
import type { Compute, OneOf, UnionOmit } from '../../internal/types.js'
import * as PoolId from '../../ox/PoolId.js'
import * as TokenId from '../../ox/TokenId.js'
import * as Abis from '../Abis.js'
import * as Addresses from '../Addresses.js'
import type { ReadParameters, WriteParameters } from '../internal/types.js'
import { defineCall } from '../internal/utils.js'

/**
 * Gets the reserves for a liquidity pool.
 *
 * @example
 * ```ts
 * import { createClient, http } from 'viem'
 * import { tempo } from 'tempo.ts/chains'
 * import { Actions } from 'tempo.ts/viem'
 *
 * const client = createClient({
 *   chain: tempo({ feeToken: '0x20c0000000000000000000000000000000000001' })
 *   transport: http(),
 * })
 *
 * const pool = await Actions.amm.getPool(client, {
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
): Promise<getPool.ReturnValue> {
  const { userToken, validatorToken, ...rest } = parameters
  const [pool, totalSupply] = await multicall(client, {
    ...rest,
    contracts: getPool.calls({ userToken, validatorToken }),
    allowFailure: false,
    deployless: true,
  })
  return {
    reserveUserToken: pool.reserveUserToken,
    reserveValidatorToken: pool.reserveValidatorToken,
    totalSupply,
  }
}

export namespace getPool {
  export type Parameters = UnionOmit<
    MulticallParameters,
    'allowFailure' | 'contracts' | 'deployless'
  > &
    Args

  export type Args = {
    /** Address or ID of the user token. */
    userToken: TokenId.TokenIdOrAddress
    /** Address or ID of the validator token. */
    validatorToken: TokenId.TokenIdOrAddress
  }

  export type ReturnValue = Compute<{
    /** Reserve of user token. */
    reserveUserToken: bigint
    /** Reserve of validator token. */
    reserveValidatorToken: bigint
    /** Total supply of LP tokens. */
    totalSupply: bigint
  }>

  /**
   * Defines calls to the `getPool` and `totalSupply` functions.
   *
   * @param args - Arguments.
   * @returns The calls.
   */
  export function calls(args: Args) {
    const { userToken, validatorToken } = args
    return [
      defineCall({
        address: Addresses.feeManager,
        abi: Abis.feeAmm,
        args: [TokenId.toAddress(userToken), TokenId.toAddress(validatorToken)],
        functionName: 'getPool',
      }),
      defineCall({
        address: Addresses.feeManager,
        abi: Abis.feeAmm,
        args: [PoolId.from({ userToken, validatorToken })],
        functionName: 'totalSupply',
      }),
    ] as const
  }
}

/**
 * Gets the LP token balance for an account in a specific pool.
 *
 * @example
 * ```ts
 * import { createClient, http } from 'viem'
 * import { tempo } from 'tempo.ts/chains'
 * import { Actions } from 'tempo.ts/viem'
 *
 * const client = createClient({
 *   chain: tempo({ feeToken: '0x20c0000000000000000000000000000000000001' })
 *   transport: http(),
 * })
 *
 * const poolId = await Actions.amm.getPoolId(client, {
 *   userToken: '0x...',
 *   validatorToken: '0x...',
 * })
 *
 * const balance = await Actions.amm.getLiquidityBalance(client, {
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
): Promise<getLiquidityBalance.ReturnValue> {
  const { address, poolId, userToken, validatorToken, ...rest } = parameters
  return readContract(client, {
    ...rest,
    ...getLiquidityBalance.call({
      address,
      poolId,
      userToken,
      validatorToken,
    } as never),
  })
}

export namespace getLiquidityBalance {
  export type Parameters = ReadParameters & Args

  export type Args = {
    /** Address to check balance for. */
    address: Address
  } & OneOf<
    | {
        /** Pool ID. */
        poolId: Hex
      }
    | {
        /** User token. */
        userToken: TokenId.TokenIdOrAddress
        /** Validator token. */
        validatorToken: TokenId.TokenIdOrAddress
      }
  >

  export type ReturnValue = ReadContractReturnType<
    typeof Abis.feeAmm,
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
    const { address } = args
    const poolId = (() => {
      if ('poolId' in args && args.poolId) return args.poolId!
      if ('userToken' in args && 'validatorToken' in args)
        return PoolId.from({
          userToken: args.userToken,
          validatorToken: args.validatorToken,
        })
      throw new Error(
        '`poolId`, or `userToken` and `validatorToken` must be provided.',
      )
    })()
    return defineCall({
      address: Addresses.feeManager,
      abi: Abis.feeAmm,
      args: [poolId, address],
      functionName: 'liquidityBalances',
    })
  }
}

/**
 * Adds liquidity to a pool.
 *
 * @example
 * ```ts
 * import { createClient, http } from 'viem'
 * import { tempo } from 'tempo.ts/chains'
 * import { Actions } from 'tempo.ts/viem'
 * import { privateKeyToAccount } from 'viem/accounts'
 *
 * const client = createClient({
 *   account: privateKeyToAccount('0x...'),
 *   chain: tempo({ feeToken: '0x20c0000000000000000000000000000000000001' })
 *   transport: http(),
 * })
 *
 * const hash = await Actions.amm.mint(client, {
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
): Promise<mint.ReturnValue> {
  return mint.inner(writeContract, client, parameters)
}

export namespace mint {
  export type Parameters<
    chain extends Chain | undefined = Chain | undefined,
    account extends Account | undefined = Account | undefined,
  > = WriteParameters<chain, account> & Args

  export type Args = {
    /** Address to mint LP tokens to. */
    to: Address
    /** User token address. */
    userTokenAddress: TokenId.TokenIdOrAddress
    /** Validator token address. */
    validatorTokenAddress: TokenId.TokenIdOrAddress
    /** Amount of validator token to add. */
    validatorTokenAmount: bigint
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
    parameters: mint.Parameters<chain, account>,
  ): Promise<ReturnType<action>> {
    const {
      to,
      userTokenAddress,
      validatorTokenAddress,
      validatorTokenAmount,
      ...rest
    } = parameters
    const call = mint.call({
      to,
      userTokenAddress,
      validatorTokenAddress,
      validatorTokenAmount,
    })
    return (await action(client, {
      ...rest,
      ...call,
    } as never)) as never
  }

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
   * import { tempo } from 'tempo.ts/chains'
   * import { Actions } from 'tempo.ts/viem'
   *
   * const client = createClient({
   *   chain: tempo({ feeToken: '0x20c0000000000000000000000000000000000001' })
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
    const {
      to,
      userTokenAddress,
      validatorTokenAddress,
      validatorTokenAmount,
    } = args
    return defineCall({
      address: Addresses.feeManager,
      abi: Abis.feeAmm,
      functionName: 'mintWithValidatorToken',
      args: [
        TokenId.toAddress(userTokenAddress),
        TokenId.toAddress(validatorTokenAddress),
        validatorTokenAmount,
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
      abi: Abis.feeAmm,
      logs,
      eventName: 'Mint',
      strict: true,
    })
    if (!log) throw new Error('`Mint` event not found.')
    return log
  }
}

/**
 * Adds liquidity to a pool.
 *
 * @example
 * ```ts
 * import { createClient, http } from 'viem'
 * import { tempo } from 'tempo.ts/chains'
 * import { Actions } from 'tempo.ts/viem'
 * import { privateKeyToAccount } from 'viem/accounts'
 *
 * const client = createClient({
 *   account: privateKeyToAccount('0x...'),
 *   chain: tempo({ feeToken: '0x20c0000000000000000000000000000000000001' })
 *   transport: http(),
 * })
 *
 * const hash = await Actions.amm.mint(client, {
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
 * @returns The transaction receipt and event data.
 */
export async function mintSync<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: mintSync.Parameters<chain, account>,
): Promise<mintSync.ReturnValue> {
  const { throwOnReceiptRevert = true, ...rest } = parameters
  const receipt = await mint.inner(writeContractSync, client, {
    ...rest,
    throwOnReceiptRevert,
  } as never)
  const { args } = mint.extractEvent(receipt.logs)
  return {
    ...args,
    receipt,
  } as never
}

export namespace mintSync {
  export type Parameters<
    chain extends Chain | undefined = Chain | undefined,
    account extends Account | undefined = Account | undefined,
  > = mint.Parameters<chain, account>

  export type Args = mint.Args

  export type ReturnValue = Compute<
    GetEventArgs<
      typeof Abis.feeAmm,
      'Mint',
      { IndexedOnly: false; Required: true }
    > & {
      /** Transaction receipt. */
      receipt: TransactionReceipt
    }
  >
}

/**
 * Watches for liquidity mint events.
 *
 * @example
 * ```ts
 * import { createClient, http } from 'viem'
 * import { tempo } from 'tempo.ts/chains'
 * import { Actions } from 'tempo.ts/viem'
 *
 * const client = createClient({
 *   chain: tempo({ feeToken: '0x20c0000000000000000000000000000000000001' })
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
    address: Addresses.feeManager,
    abi: Abis.feeAmm,
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
    ExtractAbiItem<typeof Abis.feeAmm, 'Mint'>,
    true
  >

  export type Parameters = UnionOmit<
    WatchContractEventParameters<typeof Abis.feeAmm, 'Mint', true>,
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
