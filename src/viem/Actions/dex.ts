import {
  type Account,
  type Address,
  type Chain,
  type Client,
  type ExtractAbiItem,
  type GetEventArgs,
  type Log,
  parseEventLogs,
  type ReadContractReturnType,
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
import * as Abis from '../Abis.js'
import * as Addresses from '../Addresses.js'
import type {
  GetAccountParameter,
  ReadParameters,
  WriteParameters,
} from '../internal/types.js'
import { defineCall } from '../internal/utils.js'

/**
 * Order type for limit orders.
 */
type OrderType = 'buy' | 'sell'

/**
 * Buys a specific amount of tokens.
 *
 * @example
 * ```ts
 * import { createClient, http, parseUnits } from 'viem'
 * import { tempo } from 'tempo.ts/chains'
 * import { Actions } from 'tempo.ts/viem'
 * import { privateKeyToAccount } from 'viem/accounts'
 *
 * const client = createClient({
 *   account: privateKeyToAccount('0x...'),
 *   chain: tempo,
 *   transport: http(),
 * })
 *
 * const hash = await Actions.dex.buy(client, {
 *   tokenIn: '0x20c...11',
 *   tokenOut: '0x20c...20',
 *   amountOut: parseUnits('100', 6),
 *   maxAmountIn: parseUnits('105', 6),
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The transaction hash.
 */
export async function buy<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: buy.Parameters<chain, account>,
): Promise<buy.ReturnValue> {
  return buy.inner(writeContract, client, parameters)
}

export namespace buy {
  export type Parameters<
    chain extends Chain | undefined = Chain | undefined,
    account extends Account | undefined = Account | undefined,
  > = WriteParameters<chain, account> & Args

  export type Args = {
    /** Amount of tokenOut to buy. */
    amountOut: bigint
    /** Maximum amount of tokenIn to spend. */
    maxAmountIn: bigint
    /** Address of the token to spend. */
    tokenIn: Address
    /** Address of the token to buy. */
    tokenOut: Address
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
    parameters: buy.Parameters<chain, account>,
  ): Promise<ReturnType<action>> {
    const call = buy.call(parameters)
    return (await action(client, {
      ...parameters,
      ...call,
    } as never)) as never
  }

  /**
   * Defines a call to the `buy` function.
   *
   * Can be passed as a parameter to:
   * - [`estimateContractGas`](https://viem.sh/docs/contract/estimateContractGas): estimate the gas cost of the call
   * - [`simulateContract`](https://viem.sh/docs/contract/simulateContract): simulate the call
   * - [`sendCalls`](https://viem.sh/docs/actions/wallet/sendCalls): send multiple calls
   *
   * @example
   * ```ts
   * import { createClient, http, parseUnits, walletActions } from 'viem'
   * import { tempo } from 'tempo.ts/chains'
   * import { Actions } from 'tempo.ts/viem'
   *
   * const client = createClient({
   *   chain: tempo,
   *   transport: http(),
   * }).extend(walletActions)
   *
   * const { result } = await client.sendCalls({
   *   calls: [
   *     actions.dex.buy.call({
   *       tokenIn: '0x20c0...beef',
   *       tokenOut: '0x20c0...babe',
   *       amountOut: parseUnits('100', 6),
   *       maxAmountIn: parseUnits('105', 6),
   *     }),
   *   ]
   * })
   * ```
   *
   * @param args - Arguments.
   * @returns The call.
   */
  export function call(args: Args) {
    const { tokenIn, tokenOut, amountOut, maxAmountIn } = args
    return defineCall({
      address: Addresses.stablecoinExchange,
      abi: Abis.stablecoinExchange,
      functionName: 'buy',
      args: [tokenIn, tokenOut, amountOut, maxAmountIn],
    })
  }
}

/**
 * Buys a specific amount of tokens.
 *
 * @example
 * ```ts
 * import { createClient, http, parseUnits } from 'viem'
 * import { tempo } from 'tempo.ts/chains'
 * import { Actions } from 'tempo.ts/viem'
 * import { privateKeyToAccount } from 'viem/accounts'
 *
 * const client = createClient({
 *   account: privateKeyToAccount('0x...'),
 *   chain: tempo,
 *   transport: http(),
 * })
 *
 * const result = await Actions.dex.buySync(client, {
 *   tokenIn: '0x20c...11',
 *   tokenOut: '0x20c...20',
 *   amountOut: parseUnits('100', 6),
 *   maxAmountIn: parseUnits('105', 6),
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The transaction receipt.
 */
export async function buySync<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: buySync.Parameters<chain, account>,
): Promise<buySync.ReturnValue> {
  const receipt = await buy.inner(writeContractSync, client, parameters)
  return { receipt }
}

export namespace buySync {
  export type Parameters<
    chain extends Chain | undefined = Chain | undefined,
    account extends Account | undefined = Account | undefined,
  > = buy.Parameters<chain, account>

  export type Args = buy.Args

  export type ReturnValue = Compute<{
    /** Transaction receipt. */
    receipt: TransactionReceipt
  }>
}

/**
 * Cancels an order from the orderbook.
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
 *   chain: tempo,
 *   transport: http(),
 * })
 *
 * const hash = await Actions.dex.cancel(client, {
 *   orderId: 123n,
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The transaction hash.
 */
export async function cancel<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: cancel.Parameters<chain, account>,
): Promise<cancel.ReturnValue> {
  return cancel.inner(writeContract, client, parameters)
}

export namespace cancel {
  export type Parameters<
    chain extends Chain | undefined = Chain | undefined,
    account extends Account | undefined = Account | undefined,
  > = WriteParameters<chain, account> & Args

  export type Args = {
    /** Order ID to cancel. */
    orderId: bigint
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
    parameters: cancel.Parameters<chain, account>,
  ): Promise<ReturnType<action>> {
    const call = cancel.call(parameters)
    return (await action(client, {
      ...parameters,
      ...call,
    } as never)) as never
  }

  /**
   * Defines a call to the `cancel` function.
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
   *   chain: tempo,
   *   transport: http(),
   * }).extend(walletActions)
   *
   * const { result } = await client.sendCalls({
   *   calls: [
   *     actions.dex.cancel.call({
   *       orderId: 123n,
   *     }),
   *   ]
   * })
   * ```
   *
   * @param args - Arguments.
   * @returns The call.
   */
  export function call(args: Args) {
    const { orderId } = args
    return defineCall({
      address: Addresses.stablecoinExchange,
      abi: Abis.stablecoinExchange,
      functionName: 'cancel',
      args: [orderId],
    })
  }

  /**
   * Extracts the `OrderCancelled` event from logs.
   *
   * @param logs - The logs.
   * @returns The `OrderCancelled` event.
   */
  export function extractEvent(logs: Log[]) {
    const [log] = parseEventLogs({
      abi: Abis.stablecoinExchange,
      logs,
      eventName: 'OrderCancelled',
      strict: true,
    })
    if (!log) throw new Error('`OrderCancelled` event not found.')
    return log
  }
}

/**
 * Cancels an order from the orderbook.
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
 *   chain: tempo,
 *   transport: http(),
 * })
 *
 * const result = await Actions.dex.cancelSync(client, {
 *   orderId: 123n,
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The transaction receipt and event data.
 */
export async function cancelSync<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: cancelSync.Parameters<chain, account>,
): Promise<cancelSync.ReturnValue> {
  const receipt = await cancel.inner(writeContractSync, client, parameters)
  const { args } = cancel.extractEvent(receipt.logs)
  return {
    ...args,
    receipt,
  } as never
}

export namespace cancelSync {
  export type Parameters<
    chain extends Chain | undefined = Chain | undefined,
    account extends Account | undefined = Account | undefined,
  > = cancel.Parameters<chain, account>

  export type Args = cancel.Args

  export type ReturnValue = Compute<
    GetEventArgs<
      typeof Abis.stablecoinExchange,
      'OrderCancelled',
      { IndexedOnly: false; Required: true }
    > & {
      /** Transaction receipt. */
      receipt: TransactionReceipt
    }
  >
}

/**
 * Gets a user's token balance on the DEX.
 *
 * @example
 * ```ts
 * import { createClient, http } from 'viem'
 * import { tempo } from 'tempo.ts/chains'
 * import { Actions } from 'tempo.ts/viem'
 *
 * const client = createClient({
 *   chain: tempo,
 *   transport: http(),
 * })
 *
 * const balance = await Actions.dex.getBalance(client, {
 *   account: '0x...',
 *   token: '0x20c...11',
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The user's token balance on the DEX.
 */
export async function getBalance<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: getBalance.Parameters<account>,
): Promise<getBalance.ReturnValue> {
  const { account = client.account } = parameters
  const address = account ? parseAccount(account).address : undefined
  if (!address) throw new Error('account is required.')
  return readContract(client, {
    ...parameters,
    ...getBalance.call(parameters as never),
  })
}

export namespace getBalance {
  export type Parameters<
    account extends Account | undefined = Account | undefined,
  > = ReadParameters & GetAccountParameter<account> & Args

  export type Args = {
    /** Address of the account. */
    account: Address
    /** Address of the token. */
    token: Address
  }

  export type ReturnValue = ReadContractReturnType<
    typeof Abis.stablecoinExchange,
    'balanceOf',
    never
  >

  /**
   * Defines a call to the `balanceOf` function.
   *
   * @param args - Arguments.
   * @returns The call.
   */
  export function call(args: Args) {
    const { account, token } = args
    return defineCall({
      address: Addresses.stablecoinExchange,
      abi: Abis.stablecoinExchange,
      args: [account, token],
      functionName: 'balanceOf',
    })
  }
}

/**
 * Gets the quote for buying a specific amount of tokens.
 *
 * @example
 * ```ts
 * import { createClient, http, parseUnits } from 'viem'
 * import { tempo } from 'tempo.ts/chains'
 * import { Actions } from 'tempo.ts/viem'
 *
 * const client = createClient({
 *   chain: tempo,
 *   transport: http(),
 * })
 *
 * const amountIn = await Actions.dex.getBuyQuote(client, {
 *   tokenIn: '0x20c...11',
 *   tokenOut: '0x20c...20',
 *   amountOut: parseUnits('100', 6),
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The amount of tokenIn needed to buy the specified amountOut.
 */
export async function getBuyQuote<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  parameters: getBuyQuote.Parameters,
): Promise<getBuyQuote.ReturnValue> {
  return readContract(client, {
    ...parameters,
    ...getBuyQuote.call(parameters),
  })
}

export namespace getBuyQuote {
  export type Parameters = ReadParameters & Args

  export type Args = {
    /** Amount of tokenOut to buy. */
    amountOut: bigint
    /** Address of the token to spend. */
    tokenIn: Address
    /** Address of the token to buy. */
    tokenOut: Address
  }

  export type ReturnValue = ReadContractReturnType<
    typeof Abis.stablecoinExchange,
    'quoteBuy',
    never
  >

  /**
   * Defines a call to the `quoteBuy` function.
   *
   * @param args - Arguments.
   * @returns The call.
   */
  export function call(args: Args) {
    const { tokenIn, tokenOut, amountOut } = args
    return defineCall({
      address: Addresses.stablecoinExchange,
      abi: Abis.stablecoinExchange,
      args: [tokenIn, tokenOut, amountOut],
      functionName: 'quoteBuy',
    })
  }
}

/**
 * Gets the quote for selling a specific amount of tokens.
 *
 * @example
 * ```ts
 * import { createClient, http, parseUnits } from 'viem'
 * import { tempo } from 'tempo.ts/chains'
 * import { Actions } from 'tempo.ts/viem'
 *
 * const client = createClient({
 *   chain: tempo,
 *   transport: http(),
 * })
 *
 * const amountOut = await Actions.dex.getSellQuote(client, {
 *   tokenIn: '0x20c...11',
 *   tokenOut: '0x20c...20',
 *   amountIn: parseUnits('100', 6),
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The amount of tokenOut received for selling the specified amountIn.
 */
export async function getSellQuote<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  parameters: getSellQuote.Parameters,
): Promise<getSellQuote.ReturnValue> {
  return readContract(client, {
    ...parameters,
    ...getSellQuote.call(parameters),
  })
}

export namespace getSellQuote {
  export type Parameters = ReadParameters & Args

  export type Args = {
    /** Amount of tokenIn to sell. */
    amountIn: bigint
    /** Address of the token to sell. */
    tokenIn: Address
    /** Address of the token to receive. */
    tokenOut: Address
  }

  export type ReturnValue = ReadContractReturnType<
    typeof Abis.stablecoinExchange,
    'quoteSell',
    never
  >

  /**
   * Defines a call to the `quoteSell` function.
   *
   * @param args - Arguments.
   * @returns The call.
   */
  export function call(args: Args) {
    const { tokenIn, tokenOut, amountIn } = args
    return defineCall({
      address: Addresses.stablecoinExchange,
      abi: Abis.stablecoinExchange,
      args: [tokenIn, tokenOut, amountIn],
      functionName: 'quoteSell',
    })
  }
}

/**
 * Places a limit order on the orderbook.
 *
 * @example
 * ```ts
 * import { createClient, http, parseUnits } from 'viem'
 * import { tempo } from 'tempo.ts/chains'
 * import { Actions, Tick } from 'tempo.ts/viem'
 * import { privateKeyToAccount } from 'viem/accounts'
 *
 * const client = createClient({
 *   account: privateKeyToAccount('0x...'),
 *   chain: tempo,
 *   transport: http(),
 * })
 *
 * const hash = await Actions.dex.place(client, {
 *   token: '0x20c...11',
 *   amount: parseUnits('100', 6),
 *   type: 'buy',
 *   tick: Tick.fromPrice('0.99'),
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The transaction hash.
 */
export async function place<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: place.Parameters<chain, account>,
): Promise<place.ReturnValue> {
  return place.inner(writeContract, client, parameters)
}

export namespace place {
  export type Parameters<
    chain extends Chain | undefined = Chain | undefined,
    account extends Account | undefined = Account | undefined,
  > = WriteParameters<chain, account> & Args

  export type Args = {
    /** Amount of tokens to place in the order. */
    amount: bigint
    /** Price tick for the order. */
    tick: number
    /** Address of the base token. */
    token: Address
    /** Order type - 'buy' to buy the token, 'sell' to sell it. */
    type: OrderType
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
    parameters: place.Parameters<chain, account>,
  ): Promise<ReturnType<action>> {
    const call = place.call(parameters)
    return (await action(client, {
      ...parameters,
      ...call,
    } as never)) as never
  }

  /**
   * Defines a call to the `place` function.
   *
   * Can be passed as a parameter to:
   * - [`estimateContractGas`](https://viem.sh/docs/contract/estimateContractGas): estimate the gas cost of the call
   * - [`simulateContract`](https://viem.sh/docs/contract/simulateContract): simulate the call
   * - [`sendCalls`](https://viem.sh/docs/actions/wallet/sendCalls): send multiple calls
   *
   * @example
   * ```ts
   * import { createClient, http, parseUnits, walletActions } from 'viem'
   * import { tempo } from 'tempo.ts/chains'
   * import { Actions, Tick } from 'tempo.ts/viem'
   *
   * const client = createClient({
   *   chain: tempo,
   *   transport: http(),
   * }).extend(walletActions)
   *
   * const { result } = await client.sendCalls({
   *   calls: [
   *     actions.dex.place.call({
   *       token: '0x20c0...beef',
   *       amount: parseUnits('100', 6),
   *       type: 'buy',
   *       tick: Tick.fromPrice('0.99'),
   *     }),
   *   ]
   * })
   * ```
   *
   * @param args - Arguments.
   * @returns The call.
   */
  export function call(args: Args) {
    const { token, amount, type, tick } = args
    const isBid = type === 'buy'
    return defineCall({
      address: Addresses.stablecoinExchange,
      abi: Abis.stablecoinExchange,
      functionName: 'place',
      args: [token, amount, isBid, tick],
    })
  }

  /**
   * Extracts the `OrderPlaced` event from logs.
   *
   * @param logs - The logs.
   * @returns The `OrderPlaced` event.
   */
  export function extractEvent(logs: Log[]) {
    const [log] = parseEventLogs({
      abi: Abis.stablecoinExchange,
      logs,
      eventName: 'OrderPlaced',
      strict: true,
    })
    if (!log) throw new Error('`OrderPlaced` event not found.')
    return log
  }
}

/**
 * Places a flip order that automatically flips when filled.
 *
 * @example
 * ```ts
 * import { createClient, http } from 'viem'
 * import { tempo } from 'tempo.ts/chains'
 * import { Actions, Tick } from 'tempo.ts/viem'
 * import { privateKeyToAccount } from 'viem/accounts'
 *
 * const client = createClient({
 *   account: privateKeyToAccount('0x...'),
 *   chain: tempo,
 *   transport: http(),
 * })
 *
 * const hash = await Actions.dex.placeFlip(client, {
 *   token: '0x20c...11',
 *   amount: parseUnits('100', 6),
 *   type: 'buy',
 *   tick: Tick.fromPrice('0.99'),
 *   flipTick: Tick.fromPrice('1.01'),
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The transaction hash.
 */
export async function placeFlip<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: placeFlip.Parameters<chain, account>,
): Promise<placeFlip.ReturnValue> {
  return placeFlip.inner(writeContract, client, parameters)
}

export namespace placeFlip {
  export type Parameters<
    chain extends Chain | undefined = Chain | undefined,
    account extends Account | undefined = Account | undefined,
  > = WriteParameters<chain, account> & Args

  export type Args = {
    /** Amount of tokens to place in the order. */
    amount: bigint
    /** Target tick to flip to when order is filled. */
    flipTick: number
    /** Price tick for the order. */
    tick: number
    /** Address of the base token. */
    token: Address
    /** Order type - 'buy' to buy the token, 'sell' to sell it. */
    type: OrderType
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
    parameters: placeFlip.Parameters<chain, account>,
  ): Promise<ReturnType<action>> {
    const call = placeFlip.call(parameters)
    return (await action(client, {
      ...parameters,
      ...call,
    } as never)) as never
  }

  /**
   * Defines a call to the `placeFlip` function.
   *
   * Can be passed as a parameter to:
   * - [`estimateContractGas`](https://viem.sh/docs/contract/estimateContractGas): estimate the gas cost of the call
   * - [`simulateContract`](https://viem.sh/docs/contract/simulateContract): simulate the call
   * - [`sendCalls`](https://viem.sh/docs/actions/wallet/sendCalls): send multiple calls
   *
   * @example
   * ```ts
   * import { createClient, http, parseUnits, walletActions } from 'viem'
   * import { tempo } from 'tempo.ts/chains'
   * import { Actions, Tick } from 'tempo.ts/viem'
   *
   * const client = createClient({
   *   chain: tempo,
   *   transport: http(),
   * }).extend(walletActions)
   *
   * const { result } = await client.sendCalls({
   *   calls: [
   *     actions.dex.placeFlip.call({
   *       token: '0x20c0...beef',
   *       amount: parseUnits('100', 6),
   *       type: 'buy',
   *       tick: Tick.fromPrice('0.99'),
   *       flipTick: Tick.fromPrice('1.01'),
   *     }),
   *   ]
   * })
   * ```
   *
   * @param args - Arguments.
   * @returns The call.
   */
  export function call(args: Args) {
    const { token, amount, type, tick, flipTick } = args
    const isBid = type === 'buy'
    return defineCall({
      address: Addresses.stablecoinExchange,
      abi: Abis.stablecoinExchange,
      functionName: 'placeFlip',
      args: [token, amount, isBid, tick, flipTick],
    })
  }

  /**
   * Extracts the `FlipOrderPlaced` event from logs.
   *
   * @param logs - The logs.
   * @returns The `FlipOrderPlaced` event.
   */
  export function extractEvent(logs: Log[]) {
    const [log] = parseEventLogs({
      abi: Abis.stablecoinExchange,
      logs,
      eventName: 'FlipOrderPlaced',
      strict: true,
    })
    if (!log) throw new Error('`FlipOrderPlaced` event not found.')
    return log
  }
}

/**
 * Places a flip order that automatically flips when filled.
 *
 * @example
 * ```ts
 * import { createClient, http, parseUnits } from 'viem'
 * import { tempo } from 'tempo.ts/chains'
 * import { Actions, Tick } from 'tempo.ts/viem'
 * import { privateKeyToAccount } from 'viem/accounts'
 *
 * const client = createClient({
 *   account: privateKeyToAccount('0x...'),
 *   chain: tempo,
 *   transport: http(),
 * })
 *
 * const result = await Actions.dex.placeFlipSync(client, {
 *   token: '0x20c...11',
 *   amount: parseUnits('100', 6),
 *   type: 'buy',
 *   tick: Tick.fromPrice('0.99'),
 *   flipTick: Tick.fromPrice('1.01'),
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The transaction receipt and event data.
 */
export async function placeFlipSync<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: placeFlipSync.Parameters<chain, account>,
): Promise<placeFlipSync.ReturnValue> {
  const receipt = await placeFlip.inner(writeContractSync, client, parameters)
  const { args } = placeFlip.extractEvent(receipt.logs)
  return {
    ...args,
    receipt,
  } as never
}

export namespace placeFlipSync {
  export type Parameters<
    chain extends Chain | undefined = Chain | undefined,
    account extends Account | undefined = Account | undefined,
  > = placeFlip.Parameters<chain, account>

  export type Args = placeFlip.Args

  export type ReturnValue = Compute<
    GetEventArgs<
      typeof Abis.stablecoinExchange,
      'FlipOrderPlaced',
      { IndexedOnly: false; Required: true }
    > & {
      /** Transaction receipt. */
      receipt: TransactionReceipt
    }
  >
}

/**
 * Places a limit order on the orderbook.
 *
 * @example
 * ```ts
 * import { createClient, http, parseUnits } from 'viem'
 * import { tempo } from 'tempo.ts/chains'
 * import { Actions, Tick } from 'tempo.ts/viem'
 * import { privateKeyToAccount } from 'viem/accounts'
 *
 * const client = createClient({
 *   account: privateKeyToAccount('0x...'),
 *   chain: tempo,
 *   transport: http(),
 * })
 *
 * const result = await Actions.dex.placeSync(client, {
 *   token: '0x20c...11',
 *   amount: parseUnits('100', 6),
 *   type: 'buy',
 *   tick: Tick.fromPrice('0.99'),
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The transaction receipt and event data.
 */
export async function placeSync<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: placeSync.Parameters<chain, account>,
): Promise<placeSync.ReturnValue> {
  const receipt = await place.inner(writeContractSync, client, parameters)
  const { args } = place.extractEvent(receipt.logs)
  return {
    ...args,
    receipt,
  } as never
}

export namespace placeSync {
  export type Parameters<
    chain extends Chain | undefined = Chain | undefined,
    account extends Account | undefined = Account | undefined,
  > = place.Parameters<chain, account>

  export type Args = place.Args

  export type ReturnValue = Compute<
    GetEventArgs<
      typeof Abis.stablecoinExchange,
      'OrderPlaced',
      { IndexedOnly: false; Required: true }
    > & {
      /** Transaction receipt. */
      receipt: TransactionReceipt
    }
  >
}

/**
 * Sells a specific amount of tokens.
 *
 * @example
 * ```ts
 * import { createClient, http, parseUnits } from 'viem'
 * import { tempo } from 'tempo.ts/chains'
 * import { Actions } from 'tempo.ts/viem'
 * import { privateKeyToAccount } from 'viem/accounts'
 *
 * const client = createClient({
 *   account: privateKeyToAccount('0x...'),
 *   chain: tempo,
 *   transport: http(),
 * })
 *
 * const hash = await Actions.dex.sell(client, {
 *   tokenIn: '0x20c...11',
 *   tokenOut: '0x20c...20',
 *   amountIn: parseUnits('100', 6),
 *   minAmountOut: parseUnits('95', 6),
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The transaction hash.
 */
export async function sell<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: sell.Parameters<chain, account>,
): Promise<sell.ReturnValue> {
  return sell.inner(writeContract, client, parameters)
}

export namespace sell {
  export type Parameters<
    chain extends Chain | undefined = Chain | undefined,
    account extends Account | undefined = Account | undefined,
  > = WriteParameters<chain, account> & Args

  export type Args = {
    /** Amount of tokenIn to sell. */
    amountIn: bigint
    /** Minimum amount of tokenOut to receive. */
    minAmountOut: bigint
    /** Address of the token to sell. */
    tokenIn: Address
    /** Address of the token to receive. */
    tokenOut: Address
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
    parameters: sell.Parameters<chain, account>,
  ): Promise<ReturnType<action>> {
    const call = sell.call(parameters)
    return (await action(client, {
      ...parameters,
      ...call,
    } as never)) as never
  }

  /**
   * Defines a call to the `sell` function.
   *
   * Can be passed as a parameter to:
   * - [`estimateContractGas`](https://viem.sh/docs/contract/estimateContractGas): estimate the gas cost of the call
   * - [`simulateContract`](https://viem.sh/docs/contract/simulateContract): simulate the call
   * - [`sendCalls`](https://viem.sh/docs/actions/wallet/sendCalls): send multiple calls
   *
   * @example
   * ```ts
   * import { createClient, http, parseUnits, walletActions } from 'viem'
   * import { tempo } from 'tempo.ts/chains'
   * import { Actions } from 'tempo.ts/viem'
   *
   * const client = createClient({
   *   chain: tempo,
   *   transport: http(),
   * }).extend(walletActions)
   *
   * const { result } = await client.sendCalls({
   *   calls: [
   *     actions.dex.sell.call({
   *       tokenIn: '0x20c0...beef',
   *       tokenOut: '0x20c0...babe',
   *       amountIn: parseUnits('100', 6),
   *       minAmountOut: parseUnits('95', 6),
   *     }),
   *   ]
   * })
   * ```
   *
   * @param args - Arguments.
   * @returns The call.
   */
  export function call(args: Args) {
    const { tokenIn, tokenOut, amountIn, minAmountOut } = args
    return defineCall({
      address: Addresses.stablecoinExchange,
      abi: Abis.stablecoinExchange,
      functionName: 'sell',
      args: [tokenIn, tokenOut, amountIn, minAmountOut],
    })
  }
}

/**
 * Sells a specific amount of tokens.
 *
 * @example
 * ```ts
 * import { createClient, http, parseUnits } from 'viem'
 * import { tempo } from 'tempo.ts/chains'
 * import { Actions } from 'tempo.ts/viem'
 * import { privateKeyToAccount } from 'viem/accounts'
 *
 * const client = createClient({
 *   account: privateKeyToAccount('0x...'),
 *   chain: tempo,
 *   transport: http(),
 * })
 *
 * const result = await Actions.dex.sellSync(client, {
 *   tokenIn: '0x20c...11',
 *   tokenOut: '0x20c...20',
 *   amountIn: parseUnits('100', 6),
 *   minAmountOut: parseUnits('95', 6),
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The transaction receipt.
 */
export async function sellSync<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: sellSync.Parameters<chain, account>,
): Promise<sellSync.ReturnValue> {
  const receipt = await sell.inner(writeContractSync, client, parameters)
  return { receipt }
}

export namespace sellSync {
  export type Parameters<
    chain extends Chain | undefined = Chain | undefined,
    account extends Account | undefined = Account | undefined,
  > = sell.Parameters<chain, account>

  export type Args = sell.Args

  export type ReturnValue = Compute<{
    /** Transaction receipt. */
    receipt: TransactionReceipt
  }>
}

/**
 * Watches for flip order placed events.
 *
 * @example
 * ```ts
 * import { createClient, http } from 'viem'
 * import { tempo } from 'tempo.ts/chains'
 * import { Actions } from 'tempo.ts/viem'
 *
 * const client = createClient({
 *   chain: tempo,
 *   transport: http(),
 * })
 *
 * const unwatch = actions.dex.watchFlipOrderPlaced(client, {
 *   onFlipOrderPlaced: (args, log) => {
 *     console.log('Flip order placed:', args)
 *   },
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns A function to unsubscribe from the event.
 */
export function watchFlipOrderPlaced<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: watchFlipOrderPlaced.Parameters,
) {
  const { onFlipOrderPlaced, maker, token, ...rest } = parameters
  return watchContractEvent(client, {
    ...rest,
    address: Addresses.stablecoinExchange,
    abi: Abis.stablecoinExchange,
    eventName: 'FlipOrderPlaced',
    args: {
      ...(maker !== undefined && { maker }),
      ...(token !== undefined && { token }),
    },
    onLogs: (logs) => {
      for (const log of logs) onFlipOrderPlaced(log.args, log)
    },
    strict: true,
  })
}

export declare namespace watchFlipOrderPlaced {
  export type Args = GetEventArgs<
    typeof Abis.stablecoinExchange,
    'FlipOrderPlaced',
    { IndexedOnly: false; Required: true }
  >

  export type Log = viem_Log<
    bigint,
    number,
    false,
    ExtractAbiItem<typeof Abis.stablecoinExchange, 'FlipOrderPlaced'>,
    true
  >

  export type Parameters = UnionOmit<
    WatchContractEventParameters<
      typeof Abis.stablecoinExchange,
      'FlipOrderPlaced',
      true
    >,
    'abi' | 'address' | 'batch' | 'eventName' | 'onLogs' | 'strict'
  > & {
    /** Address of the maker to filter events. */
    maker?: Address | undefined
    /** Callback to invoke when a flip order is placed. */
    onFlipOrderPlaced: (args: Args, log: Log) => void
    /** Address of the token to filter events. */
    token?: Address | undefined
  }
}

/**
 * Watches for order cancelled events.
 *
 * @example
 * ```ts
 * import { createClient, http } from 'viem'
 * import { tempo } from 'tempo.ts/chains'
 * import { Actions } from 'tempo.ts/viem'
 *
 * const client = createClient({
 *   chain: tempo,
 *   transport: http(),
 * })
 *
 * const unwatch = actions.dex.watchOrderCancelled(client, {
 *   onOrderCancelled: (args, log) => {
 *     console.log('Order cancelled:', args)
 *   },
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns A function to unsubscribe from the event.
 */
export function watchOrderCancelled<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: watchOrderCancelled.Parameters,
) {
  const { onOrderCancelled, orderId, ...rest } = parameters
  return watchContractEvent(client, {
    ...rest,
    address: Addresses.stablecoinExchange,
    abi: Abis.stablecoinExchange,
    eventName: 'OrderCancelled',
    args: orderId !== undefined ? { orderId } : undefined,
    onLogs: (logs) => {
      for (const log of logs) onOrderCancelled(log.args, log)
    },
    strict: true,
  })
}

export declare namespace watchOrderCancelled {
  export type Args = GetEventArgs<
    typeof Abis.stablecoinExchange,
    'OrderCancelled',
    { IndexedOnly: false; Required: true }
  >

  export type Log = viem_Log<
    bigint,
    number,
    false,
    ExtractAbiItem<typeof Abis.stablecoinExchange, 'OrderCancelled'>,
    true
  >

  export type Parameters = UnionOmit<
    WatchContractEventParameters<
      typeof Abis.stablecoinExchange,
      'OrderCancelled',
      true
    >,
    'abi' | 'address' | 'batch' | 'eventName' | 'onLogs' | 'strict'
  > & {
    /** Callback to invoke when an order is cancelled. */
    onOrderCancelled: (args: Args, log: Log) => void
    /** Order ID to filter events. */
    orderId?: bigint | undefined
  }
}

/**
 * Watches for order filled events.
 *
 * @example
 * ```ts
 * import { createClient, http } from 'viem'
 * import { tempo } from 'tempo.ts/chains'
 * import { Actions } from 'tempo.ts/viem'
 *
 * const client = createClient({
 *   chain: tempo,
 *   transport: http(),
 * })
 *
 * const unwatch = actions.dex.watchOrderFilled(client, {
 *   onOrderFilled: (args, log) => {
 *     console.log('Order filled:', args)
 *   },
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns A function to unsubscribe from the event.
 */
export function watchOrderFilled<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: watchOrderFilled.Parameters,
) {
  const { onOrderFilled, maker, taker, orderId, ...rest } = parameters
  return watchContractEvent(client, {
    ...rest,
    address: Addresses.stablecoinExchange,
    abi: Abis.stablecoinExchange,
    eventName: 'OrderFilled',
    args: {
      ...(orderId !== undefined && { orderId }),
      ...(maker !== undefined && { maker }),
      ...(taker !== undefined && { taker }),
    },
    onLogs: (logs) => {
      for (const log of logs) onOrderFilled(log.args, log)
    },
    strict: true,
  })
}

export declare namespace watchOrderFilled {
  export type Args = GetEventArgs<
    typeof Abis.stablecoinExchange,
    'OrderFilled',
    { IndexedOnly: false; Required: true }
  >

  export type Log = viem_Log<
    bigint,
    number,
    false,
    ExtractAbiItem<typeof Abis.stablecoinExchange, 'OrderFilled'>,
    true
  >

  export type Parameters = UnionOmit<
    WatchContractEventParameters<
      typeof Abis.stablecoinExchange,
      'OrderFilled',
      true
    >,
    'abi' | 'address' | 'batch' | 'eventName' | 'onLogs' | 'strict'
  > & {
    /** Address of the maker to filter events. */
    maker?: Address | undefined
    /** Callback to invoke when an order is filled. */
    onOrderFilled: (args: Args, log: Log) => void
    /** Order ID to filter events. */
    orderId?: bigint | undefined
    /** Address of the taker to filter events. */
    taker?: Address | undefined
  }
}

/**
 * Watches for order placed events.
 *
 * @example
 * ```ts
 * import { createClient, http } from 'viem'
 * import { tempo } from 'tempo.ts/chains'
 * import { Actions } from 'tempo.ts/viem'
 *
 * const client = createClient({
 *   chain: tempo,
 *   transport: http(),
 * })
 *
 * const unwatch = actions.dex.watchOrderPlaced(client, {
 *   onOrderPlaced: (args, log) => {
 *     console.log('Order placed:', args)
 *   },
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns A function to unsubscribe from the event.
 */
export function watchOrderPlaced<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: watchOrderPlaced.Parameters,
) {
  const { onOrderPlaced, maker, token, ...rest } = parameters
  return watchContractEvent(client, {
    ...rest,
    address: Addresses.stablecoinExchange,
    abi: Abis.stablecoinExchange,
    eventName: 'OrderPlaced',
    args: {
      ...(maker !== undefined && { maker }),
      ...(token !== undefined && { token }),
    },
    onLogs: (logs) => {
      for (const log of logs) onOrderPlaced(log.args, log)
    },
    strict: true,
  })
}

export declare namespace watchOrderPlaced {
  export type Args = GetEventArgs<
    typeof Abis.stablecoinExchange,
    'OrderPlaced',
    { IndexedOnly: false; Required: true }
  >

  export type Log = viem_Log<
    bigint,
    number,
    false,
    ExtractAbiItem<typeof Abis.stablecoinExchange, 'OrderPlaced'>,
    true
  >

  export type Parameters = UnionOmit<
    WatchContractEventParameters<
      typeof Abis.stablecoinExchange,
      'OrderPlaced',
      true
    >,
    'abi' | 'address' | 'batch' | 'eventName' | 'onLogs' | 'strict'
  > & {
    /** Address of the maker to filter events. */
    maker?: Address | undefined
    /** Callback to invoke when an order is placed. */
    onOrderPlaced: (args: Args, log: Log) => void
    /** Address of the token to filter events. */
    token?: Address | undefined
  }
}

/**
 * Withdraws tokens from the DEX to the caller's wallet.
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
 *   chain: tempo,
 *   transport: http(),
 * })
 *
 * const hash = await Actions.dex.withdraw(client, {
 *   token: '0x20c...11',
 *   amount: 100n,
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The transaction hash.
 */
export async function withdraw<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: withdraw.Parameters<chain, account>,
): Promise<withdraw.ReturnValue> {
  return withdraw.inner(writeContract, client, parameters)
}

export namespace withdraw {
  export type Parameters<
    chain extends Chain | undefined = Chain | undefined,
    account extends Account | undefined = Account | undefined,
  > = WriteParameters<chain, account> & Args

  export type Args = {
    /** Amount to withdraw. */
    amount: bigint
    /** Address of the token to withdraw. */
    token: Address
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
    parameters: withdraw.Parameters<chain, account>,
  ): Promise<ReturnType<action>> {
    const call = withdraw.call(parameters)
    return (await action(client, {
      ...parameters,
      ...call,
    } as never)) as never
  }

  /**
   * Defines a call to the `withdraw` function.
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
   *   chain: tempo,
   *   transport: http(),
   * }).extend(walletActions)
   *
   * const { result } = await client.sendCalls({
   *   calls: [
   *     actions.dex.withdraw.call({
   *       token: '0x20c0...beef',
   *       amount: parseUnits('100', 6),
   *     }),
   *   ]
   * })
   * ```
   *
   * @param args - Arguments.
   * @returns The call.
   */
  export function call(args: Args) {
    const { token, amount } = args
    return defineCall({
      address: Addresses.stablecoinExchange,
      abi: Abis.stablecoinExchange,
      functionName: 'withdraw',
      args: [token, amount],
    })
  }
}

/**
 * Withdraws tokens from the DEX to the caller's wallet.
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
 *   chain: tempo,
 *   transport: http(),
 * })
 *
 * const result = await Actions.dex.withdrawSync(client, {
 *   token: '0x20c...11',
 *   amount: 100n,
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The transaction receipt.
 */
export async function withdrawSync<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: withdrawSync.Parameters<chain, account>,
): Promise<withdrawSync.ReturnValue> {
  const receipt = await withdraw.inner(writeContractSync, client, parameters)
  return { receipt }
}

export namespace withdrawSync {
  export type Parameters<
    chain extends Chain | undefined = Chain | undefined,
    account extends Account | undefined = Account | undefined,
  > = withdraw.Parameters<chain, account>

  export type Args = withdraw.Args

  export type ReturnValue = Compute<{
    /** Transaction receipt. */
    receipt: TransactionReceipt
  }>
}
