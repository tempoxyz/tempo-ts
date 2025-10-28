import type * as Query from '@tanstack/query-core'
import { type Config, getConnectorClient } from '@wagmi/core'
import type { ChainIdParameter, ConnectorParameter } from '@wagmi/core/internal'
import type { Account } from 'viem'
import type { PartialBy, RequiredBy } from '../../internal/types.js'
import * as viem_Actions from '../../viem/Actions/dex.js'

/**
 * Buys a specific amount of tokens.
 *
 * @example
 * ```ts
 * import { createConfig, http } from '@wagmi/core'
 * import { tempo } from 'tempo.ts/chains'
 * import { Actions } from 'tempo.ts/wagmi'
 *
 * const config = createConfig({
 *   chains: [tempo],
 *   transports: {
 *     [tempo.id]: http(),
 *   },
 * })
 *
 * const hash = await Actions.dex.buy(config, {
 *   tokenIn: '0x20c...11',
 *   tokenOut: '0x20c...20',
 *   amountOut: parseUnits('100', 6),
 *   maxAmountIn: parseUnits('105', 6),
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns The transaction hash.
 */
export async function buy<config extends Config>(
  config: config,
  parameters: buy.Parameters<config>,
): Promise<viem_Actions.buy.ReturnValue> {
  const { account, chainId, connector } = parameters

  const client = await getConnectorClient(config, {
    account,
    assertChainId: false,
    chainId,
    connector,
  })

  return viem_Actions.buy(client, parameters as viem_Actions.buy.Parameters)
}

export declare namespace buy {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    ConnectorParameter &
    Omit<viem_Actions.buy.Parameters<undefined, Account>, 'chain'>

  export type ReturnValue = viem_Actions.buy.ReturnValue

  export type ErrorType = viem_Actions.buy.ErrorType
}

/**
 * Buys a specific amount of tokens.
 *
 * Note: This is a synchronous action that waits for the transaction to
 * be included on a block before returning a response.
 *
 * @example
 * ```ts
 * import { createConfig, http } from '@wagmi/core'
 * import { tempo } from 'tempo.ts/chains'
 * import { Actions } from 'tempo.ts/wagmi'
 *
 * const config = createConfig({
 *   chains: [tempo],
 *   transports: {
 *     [tempo.id]: http(),
 *   },
 * })
 *
 * const result = await Actions.dex.buySync(config, {
 *   tokenIn: '0x20c...11',
 *   tokenOut: '0x20c...20',
 *   amountOut: parseUnits('100', 6),
 *   maxAmountIn: parseUnits('105', 6),
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns The transaction receipt.
 */
export async function buySync<config extends Config>(
  config: config,
  parameters: buySync.Parameters<config>,
): Promise<viem_Actions.buySync.ReturnValue> {
  const { account, chainId, connector } = parameters

  const client = await getConnectorClient(config, {
    account,
    assertChainId: false,
    chainId,
    connector,
  })

  return viem_Actions.buySync(
    client,
    parameters as viem_Actions.buySync.Parameters,
  )
}

export declare namespace buySync {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    ConnectorParameter &
    Omit<viem_Actions.buySync.Parameters<undefined, Account>, 'chain'>

  export type ReturnValue = viem_Actions.buySync.ReturnValue

  export type ErrorType = viem_Actions.buySync.ErrorType
}

/**
 * Cancels an order from the orderbook.
 *
 * @example
 * ```ts
 * import { createConfig, http } from '@wagmi/core'
 * import { tempo } from 'tempo.ts/chains'
 * import { Actions } from 'tempo.ts/wagmi'
 *
 * const config = createConfig({
 *   chains: [tempo],
 *   transports: {
 *     [tempo.id]: http(),
 *   },
 * })
 *
 * const hash = await Actions.dex.cancel(config, {
 *   orderId: 123n,
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns The transaction hash.
 */
export async function cancel<config extends Config>(
  config: config,
  parameters: cancel.Parameters<config>,
): Promise<viem_Actions.cancel.ReturnValue> {
  const { account, chainId, connector } = parameters

  const client = await getConnectorClient(config, {
    account,
    assertChainId: false,
    chainId,
    connector,
  })

  return viem_Actions.cancel(
    client,
    parameters as viem_Actions.cancel.Parameters,
  )
}

export declare namespace cancel {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    ConnectorParameter &
    Omit<viem_Actions.cancel.Parameters<undefined, Account>, 'chain'>

  export type ReturnValue = viem_Actions.cancel.ReturnValue

  export type ErrorType = viem_Actions.cancel.ErrorType
}

/**
 * Cancels an order from the orderbook.
 *
 * Note: This is a synchronous action that waits for the transaction to
 * be included on a block before returning a response.
 *
 * @example
 * ```ts
 * import { createConfig, http } from '@wagmi/core'
 * import { tempo } from 'tempo.ts/chains'
 * import { Actions } from 'tempo.ts/wagmi'
 *
 * const config = createConfig({
 *   chains: [tempo],
 *   transports: {
 *     [tempo.id]: http(),
 *   },
 * })
 *
 * const result = await Actions.dex.cancelSync(config, {
 *   orderId: 123n,
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns The transaction receipt and event data.
 */
export async function cancelSync<config extends Config>(
  config: config,
  parameters: cancelSync.Parameters<config>,
): Promise<viem_Actions.cancelSync.ReturnValue> {
  const { account, chainId, connector } = parameters

  const client = await getConnectorClient(config, {
    account,
    assertChainId: false,
    chainId,
    connector,
  })

  return viem_Actions.cancelSync(
    client,
    parameters as viem_Actions.cancelSync.Parameters,
  )
}

export declare namespace cancelSync {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    ConnectorParameter &
    Omit<viem_Actions.cancelSync.Parameters<undefined, Account>, 'chain'>

  export type ReturnValue = viem_Actions.cancelSync.ReturnValue

  export type ErrorType = viem_Actions.cancelSync.ErrorType
}

/**
 * Creates a new trading pair on the DEX.
 *
 * @example
 * ```ts
 * import { createConfig, http } from '@wagmi/core'
 * import { tempo } from 'tempo.ts/chains'
 * import { Actions } from 'tempo.ts/wagmi'
 *
 * const config = createConfig({
 *   chains: [tempo],
 *   transports: {
 *     [tempo.id]: http(),
 *   },
 * })
 *
 * const hash = await Actions.dex.createPair(config, {
 *   base: '0x20c...11',
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns The transaction hash.
 */
export async function createPair<config extends Config>(
  config: config,
  parameters: createPair.Parameters<config>,
): Promise<viem_Actions.createPair.ReturnValue> {
  const { account, chainId, connector } = parameters

  const client = await getConnectorClient(config, {
    account,
    assertChainId: false,
    chainId,
    connector,
  })

  return viem_Actions.createPair(
    client,
    parameters as viem_Actions.createPair.Parameters,
  )
}

export declare namespace createPair {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    ConnectorParameter &
    Omit<viem_Actions.createPair.Parameters<undefined, Account>, 'chain'>

  export type ReturnValue = viem_Actions.createPair.ReturnValue

  export type ErrorType = viem_Actions.createPair.ErrorType
}

/**
 * Creates a new trading pair on the DEX.
 *
 * Note: This is a synchronous action that waits for the transaction to
 * be included on a block before returning a response.
 *
 * @example
 * ```ts
 * import { createConfig, http } from '@wagmi/core'
 * import { tempo } from 'tempo.ts/chains'
 * import { Actions } from 'tempo.ts/wagmi'
 *
 * const config = createConfig({
 *   chains: [tempo],
 *   transports: {
 *     [tempo.id]: http(),
 *   },
 * })
 *
 * const result = await Actions.dex.createPairSync(config, {
 *   base: '0x20c...11',
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns The transaction receipt and event data.
 */
export async function createPairSync<config extends Config>(
  config: config,
  parameters: createPairSync.Parameters<config>,
): Promise<viem_Actions.createPairSync.ReturnValue> {
  const { account, chainId, connector } = parameters

  const client = await getConnectorClient(config, {
    account,
    assertChainId: false,
    chainId,
    connector,
  })

  return viem_Actions.createPairSync(
    client,
    parameters as viem_Actions.createPairSync.Parameters,
  )
}

export declare namespace createPairSync {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    ConnectorParameter &
    Omit<viem_Actions.createPairSync.Parameters<undefined, Account>, 'chain'>

  export type ReturnValue = viem_Actions.createPairSync.ReturnValue

  export type ErrorType = viem_Actions.createPairSync.ErrorType
}

/**
 * Gets a user's token balance on the DEX.
 *
 * @example
 * ```ts
 * import { createConfig, http } from '@wagmi/core'
 * import { tempo } from 'tempo.ts/chains'
 * import { Actions } from 'tempo.ts/wagmi'
 *
 * const config = createConfig({
 *   chains: [tempo],
 *   transports: {
 *     [tempo.id]: http(),
 *   },
 * })
 *
 * const balance = await Actions.dex.getBalance(config, {
 *   account: '0x...',
 *   token: '0x20c...11',
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns The user's token balance on the DEX.
 */
export function getBalance<config extends Config>(
  config: config,
  parameters: getBalance.Parameters<config>,
): Promise<getBalance.ReturnValue> {
  const { chainId, ...rest } = parameters
  const client = config.getClient({ chainId })
  return viem_Actions.getBalance(client, rest)
}

export namespace getBalance {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    viem_Actions.getBalance.Parameters

  export type ReturnValue = viem_Actions.getBalance.ReturnValue

  export function queryKey<config extends Config>(
    parameters: PartialBy<Parameters<config>, 'account'>,
  ) {
    return ['getBalance', parameters] as const
  }

  export type QueryKey<config extends Config> = ReturnType<
    typeof queryKey<config>
  >

  export function queryOptions<config extends Config, selectData = ReturnValue>(
    config: Config,
    parameters: queryOptions.Parameters<config, selectData>,
  ): queryOptions.ReturnValue<config, selectData> {
    const { query, ...rest } = parameters
    return {
      ...query,
      queryKey: queryKey(rest),
      async queryFn({ queryKey }) {
        const [, { account, ...parameters }] = queryKey
        if (!account) throw new Error('account is required.')
        return await getBalance(config, { account, ...parameters })
      },
    }
  }

  export declare namespace queryOptions {
    export type Parameters<
      config extends Config,
      selectData = getBalance.ReturnValue,
    > = PartialBy<getBalance.Parameters<config>, 'account'> & {
      query?:
        | Omit<ReturnValue<config, selectData>, 'queryKey' | 'queryFn'>
        | undefined
    }

    export type ReturnValue<
      config extends Config,
      selectData = getBalance.ReturnValue,
    > = RequiredBy<
      Query.QueryOptions<
        getBalance.ReturnValue,
        Query.DefaultError,
        selectData,
        getBalance.QueryKey<config>
      >,
      'queryKey' | 'queryFn'
    >
  }
}

/**
 * Gets the quote for buying a specific amount of tokens.
 *
 * @example
 * ```ts
 * import { createConfig, http } from '@wagmi/core'
 * import { tempo } from 'tempo.ts/chains'
 * import { Actions } from 'tempo.ts/wagmi'
 *
 * const config = createConfig({
 *   chains: [tempo],
 *   transports: {
 *     [tempo.id]: http(),
 *   },
 * })
 *
 * const amountIn = await Actions.dex.getBuyQuote(config, {
 *   amountOut: parseUnits('100', 6),
 *   tokenIn: '0x20c...11',
 *   tokenOut: '0x20c...20',
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns The amount of tokenIn needed to buy the specified amountOut.
 */
export function getBuyQuote<config extends Config>(
  config: config,
  parameters: getBuyQuote.Parameters<config>,
): Promise<getBuyQuote.ReturnValue> {
  const { chainId, ...rest } = parameters
  const client = config.getClient({ chainId })
  return viem_Actions.getBuyQuote(client, rest)
}

export namespace getBuyQuote {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    viem_Actions.getBuyQuote.Parameters

  export type ReturnValue = viem_Actions.getBuyQuote.ReturnValue

  export function queryKey<config extends Config>(
    parameters: Parameters<config>,
  ) {
    return ['getBuyQuote', parameters] as const
  }

  export type QueryKey<config extends Config> = ReturnType<
    typeof queryKey<config>
  >

  export function queryOptions<config extends Config, selectData = ReturnValue>(
    config: Config,
    parameters: queryOptions.Parameters<config, selectData>,
  ): queryOptions.ReturnValue<config, selectData> {
    const { query, ...rest } = parameters
    return {
      ...query,
      queryKey: queryKey(rest),
      async queryFn({ queryKey }) {
        const [, parameters] = queryKey
        return await getBuyQuote(config, parameters)
      },
    }
  }

  export declare namespace queryOptions {
    export type Parameters<
      config extends Config,
      selectData = getBuyQuote.ReturnValue,
    > = getBuyQuote.Parameters<config> & {
      query?:
        | Omit<ReturnValue<config, selectData>, 'queryKey' | 'queryFn'>
        | undefined
    }

    export type ReturnValue<
      config extends Config,
      selectData = getBuyQuote.ReturnValue,
    > = RequiredBy<
      Query.QueryOptions<
        getBuyQuote.ReturnValue,
        Query.DefaultError,
        selectData,
        getBuyQuote.QueryKey<config>
      >,
      'queryKey' | 'queryFn'
    >
  }
}

/**
 * Gets an order's details from the orderbook.
 *
 * @example
 * ```ts
 * import { createConfig, http } from '@wagmi/core'
 * import { tempo } from 'tempo.ts/chains'
 * import { Actions } from 'tempo.ts/wagmi'
 *
 * const config = createConfig({
 *   chains: [tempo],
 *   transports: {
 *     [tempo.id]: http(),
 *   },
 * })
 *
 * const order = await Actions.dex.getOrder(config, {
 *   orderId: 123n,
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns The order details.
 */
export function getOrder<config extends Config>(
  config: config,
  parameters: getOrder.Parameters<config>,
): Promise<getOrder.ReturnValue> {
  const { chainId, ...rest } = parameters
  const client = config.getClient({ chainId })
  return viem_Actions.getOrder(client, rest)
}

export namespace getOrder {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    viem_Actions.getOrder.Parameters

  export type ReturnValue = viem_Actions.getOrder.ReturnValue

  export function queryKey<config extends Config>(
    parameters: Parameters<config>,
  ) {
    return ['getOrder', parameters] as const
  }

  export type QueryKey<config extends Config> = ReturnType<
    typeof queryKey<config>
  >

  export function queryOptions<config extends Config, selectData = ReturnValue>(
    config: Config,
    parameters: queryOptions.Parameters<config, selectData>,
  ): queryOptions.ReturnValue<config, selectData> {
    const { query, ...rest } = parameters
    return {
      ...query,
      queryKey: queryKey(rest),
      async queryFn({ queryKey }) {
        const [, parameters] = queryKey
        return await getOrder(config, parameters)
      },
    }
  }

  export declare namespace queryOptions {
    export type Parameters<
      config extends Config,
      selectData = getOrder.ReturnValue,
    > = getOrder.Parameters<config> & {
      query?:
        | Omit<ReturnValue<config, selectData>, 'queryKey' | 'queryFn'>
        | undefined
    }

    export type ReturnValue<
      config extends Config,
      selectData = getOrder.ReturnValue,
    > = RequiredBy<
      Query.QueryOptions<
        getOrder.ReturnValue,
        Query.DefaultError,
        selectData,
        getOrder.QueryKey<config>
      >,
      'queryKey' | 'queryFn'
    >
  }
}

/**
 * Gets orderbook information for a trading pair.
 *
 * @example
 * ```ts
 * import { createConfig, http } from '@wagmi/core'
 * import { tempo } from 'tempo.ts/chains'
 * import { Actions } from 'tempo.ts/wagmi'
 *
 * const config = createConfig({
 *   chains: [tempo],
 *   transports: {
 *     [tempo.id]: http(),
 *   },
 * })
 *
 * const book = await Actions.dex.getOrderbook(config, {
 *   base: '0x20c...11',
 *   quote: '0x20c...20',
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns The orderbook information.
 */
export function getOrderbook<config extends Config>(
  config: config,
  parameters: getOrderbook.Parameters<config>,
): Promise<getOrderbook.ReturnValue> {
  const { chainId, ...rest } = parameters
  const client = config.getClient({ chainId })
  return viem_Actions.getOrderbook(client, rest)
}

export namespace getOrderbook {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    viem_Actions.getOrderbook.Parameters

  export type ReturnValue = viem_Actions.getOrderbook.ReturnValue

  export function queryKey<config extends Config>(
    parameters: Parameters<config>,
  ) {
    return ['getOrderbook', parameters] as const
  }

  export type QueryKey<config extends Config> = ReturnType<
    typeof queryKey<config>
  >

  export function queryOptions<config extends Config, selectData = ReturnValue>(
    config: Config,
    parameters: queryOptions.Parameters<config, selectData>,
  ): queryOptions.ReturnValue<config, selectData> {
    const { query, ...rest } = parameters
    return {
      ...query,
      queryKey: queryKey(rest),
      async queryFn({ queryKey }) {
        const [, parameters] = queryKey
        return await getOrderbook(config, parameters)
      },
    }
  }

  export declare namespace queryOptions {
    export type Parameters<
      config extends Config,
      selectData = getOrderbook.ReturnValue,
    > = getOrderbook.Parameters<config> & {
      query?:
        | Omit<ReturnValue<config, selectData>, 'queryKey' | 'queryFn'>
        | undefined
    }

    export type ReturnValue<
      config extends Config,
      selectData = getOrderbook.ReturnValue,
    > = RequiredBy<
      Query.QueryOptions<
        getOrderbook.ReturnValue,
        Query.DefaultError,
        selectData,
        getOrderbook.QueryKey<config>
      >,
      'queryKey' | 'queryFn'
    >
  }
}

/**
 * Gets the price level information at a specific tick.
 *
 * @example
 * ```ts
 * import { createConfig, http } from '@wagmi/core'
 * import { tempo } from 'tempo.ts/chains'
 * import { Actions, Tick } from 'tempo.ts/wagmi'
 *
 * const config = createConfig({
 *   chains: [tempo],
 *   transports: {
 *     [tempo.id]: http(),
 *   },
 * })
 *
 * const level = await Actions.dex.getPriceLevel(config, {
 *   base: '0x20c...11',
 *   tick: Tick.fromPrice('1.001'),
 *   isBid: true,
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns The price level information.
 */
export function getPriceLevel<config extends Config>(
  config: config,
  parameters: getPriceLevel.Parameters<config>,
): Promise<getPriceLevel.ReturnValue> {
  const { chainId, ...rest } = parameters
  const client = config.getClient({ chainId })
  return viem_Actions.getPriceLevel(client, rest)
}

export namespace getPriceLevel {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    viem_Actions.getPriceLevel.Parameters

  export type ReturnValue = viem_Actions.getPriceLevel.ReturnValue

  export function queryKey<config extends Config>(
    parameters: Parameters<config>,
  ) {
    return ['getPriceLevel', parameters] as const
  }

  export type QueryKey<config extends Config> = ReturnType<
    typeof queryKey<config>
  >

  export function queryOptions<config extends Config, selectData = ReturnValue>(
    config: Config,
    parameters: queryOptions.Parameters<config, selectData>,
  ): queryOptions.ReturnValue<config, selectData> {
    const { query, ...rest } = parameters
    return {
      ...query,
      queryKey: queryKey(rest),
      async queryFn({ queryKey }) {
        const [, parameters] = queryKey
        return await getPriceLevel(config, parameters)
      },
    }
  }

  export declare namespace queryOptions {
    export type Parameters<
      config extends Config,
      selectData = getPriceLevel.ReturnValue,
    > = getPriceLevel.Parameters<config> & {
      query?:
        | Omit<ReturnValue<config, selectData>, 'queryKey' | 'queryFn'>
        | undefined
    }

    export type ReturnValue<
      config extends Config,
      selectData = getPriceLevel.ReturnValue,
    > = RequiredBy<
      Query.QueryOptions<
        getPriceLevel.ReturnValue,
        Query.DefaultError,
        selectData,
        getPriceLevel.QueryKey<config>
      >,
      'queryKey' | 'queryFn'
    >
  }
}

/**
 * Gets the quote for selling a specific amount of tokens.
 *
 * @example
 * ```ts
 * import { createConfig, http } from '@wagmi/core'
 * import { tempo } from 'tempo.ts/chains'
 * import { Actions } from 'tempo.ts/wagmi'
 *
 * const config = createConfig({
 *   chains: [tempo],
 *   transports: {
 *     [tempo.id]: http(),
 *   },
 * })
 *
 * const amountOut = await Actions.dex.getSellQuote(config, {
 *   amountIn: parseUnits('100', 6),
 *   tokenIn: '0x20c...11',
 *   tokenOut: '0x20c...20',
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns The amount of tokenOut received for selling the specified amountIn.
 */
export function getSellQuote<config extends Config>(
  config: config,
  parameters: getSellQuote.Parameters<config>,
): Promise<getSellQuote.ReturnValue> {
  const { chainId, ...rest } = parameters
  const client = config.getClient({ chainId })
  return viem_Actions.getSellQuote(client, rest)
}

export namespace getSellQuote {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    viem_Actions.getSellQuote.Parameters

  export type ReturnValue = viem_Actions.getSellQuote.ReturnValue

  export function queryKey<config extends Config>(
    parameters: Parameters<config>,
  ) {
    return ['getSellQuote', parameters] as const
  }

  export type QueryKey<config extends Config> = ReturnType<
    typeof queryKey<config>
  >

  export function queryOptions<config extends Config, selectData = ReturnValue>(
    config: Config,
    parameters: queryOptions.Parameters<config, selectData>,
  ): queryOptions.ReturnValue<config, selectData> {
    const { query, ...rest } = parameters
    return {
      ...query,
      queryKey: queryKey(rest),
      async queryFn({ queryKey }) {
        const [, parameters] = queryKey
        return await getSellQuote(config, parameters)
      },
    }
  }

  export declare namespace queryOptions {
    export type Parameters<
      config extends Config,
      selectData = getSellQuote.ReturnValue,
    > = getSellQuote.Parameters<config> & {
      query?:
        | Omit<ReturnValue<config, selectData>, 'queryKey' | 'queryFn'>
        | undefined
    }

    export type ReturnValue<
      config extends Config,
      selectData = getSellQuote.ReturnValue,
    > = RequiredBy<
      Query.QueryOptions<
        getSellQuote.ReturnValue,
        Query.DefaultError,
        selectData,
        getSellQuote.QueryKey<config>
      >,
      'queryKey' | 'queryFn'
    >
  }
}

/**
 * Places a limit order on the orderbook.
 *
 * @example
 * ```ts
 * import { createConfig, http } from '@wagmi/core'
 * import { tempo } from 'tempo.ts/chains'
 * import { Actions } from 'tempo.ts/wagmi'
 *
 * const config = createConfig({
 *   chains: [tempo],
 *   transports: {
 *     [tempo.id]: http(),
 *   },
 * })
 *
 * const hash = await Actions.dex.place(config, {
 *   amount: parseUnits('100', 6),
 *   tick: Tick.fromPrice('0.99'),
 *   token: '0x20c...11',
 *   type: 'buy',
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns The transaction hash.
 */
export async function place<config extends Config>(
  config: config,
  parameters: place.Parameters<config>,
): Promise<viem_Actions.place.ReturnValue> {
  const { account, chainId, connector } = parameters

  const client = await getConnectorClient(config, {
    account,
    assertChainId: false,
    chainId,
    connector,
  })

  return viem_Actions.place(client, parameters as viem_Actions.place.Parameters)
}

export declare namespace place {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    ConnectorParameter &
    Omit<viem_Actions.place.Parameters<undefined, Account>, 'chain'>

  export type ReturnValue = viem_Actions.place.ReturnValue

  export type ErrorType = viem_Actions.place.ErrorType
}

/**
 * Places a flip order that automatically flips when filled.
 *
 * @example
 * ```ts
 * import { createConfig, http } from '@wagmi/core'
 * import { tempo } from 'tempo.ts/chains'
 * import { Actions } from 'tempo.ts/wagmi'
 *
 * const config = createConfig({
 *   chains: [tempo],
 *   transports: {
 *     [tempo.id]: http(),
 *   },
 * })
 *
 * const hash = await Actions.dex.placeFlip(config, {
 *   amount: parseUnits('100', 6),
 *   flipTick: Tick.fromPrice('1.01'),
 *   tick: Tick.fromPrice('0.99'),
 *   token: '0x20c...11',
 *   type: 'buy',
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns The transaction hash.
 */
export async function placeFlip<config extends Config>(
  config: config,
  parameters: placeFlip.Parameters<config>,
): Promise<viem_Actions.placeFlip.ReturnValue> {
  const { account, chainId, connector } = parameters

  const client = await getConnectorClient(config, {
    account,
    assertChainId: false,
    chainId,
    connector,
  })

  return viem_Actions.placeFlip(
    client,
    parameters as viem_Actions.placeFlip.Parameters,
  )
}

export declare namespace placeFlip {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    ConnectorParameter &
    Omit<viem_Actions.placeFlip.Parameters<undefined, Account>, 'chain'>

  export type ReturnValue = viem_Actions.placeFlip.ReturnValue

  export type ErrorType = viem_Actions.placeFlip.ErrorType
}

/**
 * Places a flip order that automatically flips when filled.
 *
 * Note: This is a synchronous action that waits for the transaction to
 * be included on a block before returning a response.
 *
 * @example
 * ```ts
 * import { createConfig, http } from '@wagmi/core'
 * import { tempo } from 'tempo.ts/chains'
 * import { Actions } from 'tempo.ts/wagmi'
 *
 * const config = createConfig({
 *   chains: [tempo],
 *   transports: {
 *     [tempo.id]: http(),
 *   },
 * })
 *
 * const result = await Actions.dex.placeFlipSync(config, {
 *   amount: parseUnits('100', 6),
 *   flipTick: Tick.fromPrice('1.01'),
 *   tick: Tick.fromPrice('0.99'),
 *   token: '0x20c...11',
 *   type: 'buy',
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns The transaction receipt and event data.
 */
export async function placeFlipSync<config extends Config>(
  config: config,
  parameters: placeFlipSync.Parameters<config>,
): Promise<viem_Actions.placeFlipSync.ReturnValue> {
  const { account, chainId, connector } = parameters

  const client = await getConnectorClient(config, {
    account,
    assertChainId: false,
    chainId,
    connector,
  })

  return viem_Actions.placeFlipSync(
    client,
    parameters as viem_Actions.placeFlipSync.Parameters,
  )
}

export declare namespace placeFlipSync {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    ConnectorParameter &
    Omit<viem_Actions.placeFlipSync.Parameters<undefined, Account>, 'chain'>

  export type ReturnValue = viem_Actions.placeFlipSync.ReturnValue

  export type ErrorType = viem_Actions.placeFlipSync.ErrorType
}

/**
 * Places a limit order on the orderbook.
 *
 * Note: This is a synchronous action that waits for the transaction to
 * be included on a block before returning a response.
 *
 * @example
 * ```ts
 * import { createConfig, http } from '@wagmi/core'
 * import { tempo } from 'tempo.ts/chains'
 * import { Actions } from 'tempo.ts/wagmi'
 *
 * const config = createConfig({
 *   chains: [tempo],
 *   transports: {
 *     [tempo.id]: http(),
 *   },
 * })
 *
 * const result = await Actions.dex.placeSync(config, {
 *   amount: parseUnits('100', 6),
 *   tick: Tick.fromPrice('0.99'),
 *   token: '0x20c...11',
 *   type: 'buy',
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns The transaction receipt and event data.
 */
export async function placeSync<config extends Config>(
  config: config,
  parameters: placeSync.Parameters<config>,
): Promise<viem_Actions.placeSync.ReturnValue> {
  const { account, chainId, connector } = parameters

  const client = await getConnectorClient(config, {
    account,
    assertChainId: false,
    chainId,
    connector,
  })

  return viem_Actions.placeSync(
    client,
    parameters as viem_Actions.placeSync.Parameters,
  )
}

export declare namespace placeSync {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    ConnectorParameter &
    Omit<viem_Actions.placeSync.Parameters<undefined, Account>, 'chain'>

  export type ReturnValue = viem_Actions.placeSync.ReturnValue

  export type ErrorType = viem_Actions.placeSync.ErrorType
}

/**
 * Sells a specific amount of tokens.
 *
 * @example
 * ```ts
 * import { createConfig, http } from '@wagmi/core'
 * import { tempo } from 'tempo.ts/chains'
 * import { Actions } from 'tempo.ts/wagmi'
 *
 * const config = createConfig({
 *   chains: [tempo],
 *   transports: {
 *     [tempo.id]: http(),
 *   },
 * })
 *
 * const hash = await Actions.dex.sell(config, {
 *   amountIn: parseUnits('100', 6),
 *   minAmountOut: parseUnits('95', 6),
 *   tokenIn: '0x20c...11',
 *   tokenOut: '0x20c...20',
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns The transaction hash.
 */
export async function sell<config extends Config>(
  config: config,
  parameters: sell.Parameters<config>,
): Promise<viem_Actions.sell.ReturnValue> {
  const { account, chainId, connector } = parameters

  const client = await getConnectorClient(config, {
    account,
    assertChainId: false,
    chainId,
    connector,
  })

  return viem_Actions.sell(client, parameters as viem_Actions.sell.Parameters)
}

export declare namespace sell {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    ConnectorParameter &
    Omit<viem_Actions.sell.Parameters<undefined, Account>, 'chain'>

  export type ReturnValue = viem_Actions.sell.ReturnValue

  export type ErrorType = viem_Actions.sell.ErrorType
}

/**
 * Sells a specific amount of tokens.
 *
 * Note: This is a synchronous action that waits for the transaction to
 * be included on a block before returning a response.
 *
 * @example
 * ```ts
 * import { createConfig, http } from '@wagmi/core'
 * import { tempo } from 'tempo.ts/chains'
 * import { Actions } from 'tempo.ts/wagmi'
 *
 * const config = createConfig({
 *   chains: [tempo],
 *   transports: {
 *     [tempo.id]: http(),
 *   },
 * })
 *
 * const result = await Actions.dex.sellSync(config, {
 *   amountIn: parseUnits('100', 6),
 *   minAmountOut: parseUnits('95', 6),
 *   tokenIn: '0x20c...11',
 *   tokenOut: '0x20c...20',
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns The transaction receipt.
 */
export async function sellSync<config extends Config>(
  config: config,
  parameters: sellSync.Parameters<config>,
): Promise<viem_Actions.sellSync.ReturnValue> {
  const { account, chainId, connector } = parameters

  const client = await getConnectorClient(config, {
    account,
    assertChainId: false,
    chainId,
    connector,
  })

  return viem_Actions.sellSync(
    client,
    parameters as viem_Actions.sellSync.Parameters,
  )
}

export declare namespace sellSync {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    ConnectorParameter &
    Omit<viem_Actions.sellSync.Parameters<undefined, Account>, 'chain'>

  export type ReturnValue = viem_Actions.sellSync.ReturnValue

  export type ErrorType = viem_Actions.sellSync.ErrorType
}

/**
 * Watches for flip order placement events on the DEX.
 *
 * @example
 * ```ts
 * import { createConfig, http } from '@wagmi/core'
 * import { tempo } from 'tempo.ts/chains'
 * import { Actions } from 'tempo.ts/wagmi'
 *
 * const config = createConfig({
 *   chains: [tempo],
 *   transports: {
 *     [tempo.id]: http(),
 *   },
 * })
 *
 * const unwatch = Actions.dex.watchFlipOrderPlaced(config, {
 *   onFlipOrderPlaced: (args, log) => {
 *     console.log('Flip order placed:', args)
 *   },
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns A function to unsubscribe from the event.
 */
export function watchFlipOrderPlaced<config extends Config>(
  config: config,
  parameters: watchFlipOrderPlaced.Parameters<config>,
) {
  const { chainId, ...rest } = parameters
  const client = config.getClient({ chainId })
  return viem_Actions.watchFlipOrderPlaced(client, rest)
}

export declare namespace watchFlipOrderPlaced {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    viem_Actions.watchFlipOrderPlaced.Parameters

  export type Args = viem_Actions.watchFlipOrderPlaced.Args

  export type Log = viem_Actions.watchFlipOrderPlaced.Log
}

/**
 * Watches for order cancellation events on the DEX.
 *
 * @example
 * ```ts
 * import { createConfig, http } from '@wagmi/core'
 * import { tempo } from 'tempo.ts/chains'
 * import { Actions } from 'tempo.ts/wagmi'
 *
 * const config = createConfig({
 *   chains: [tempo],
 *   transports: {
 *     [tempo.id]: http(),
 *   },
 * })
 *
 * const unwatch = Actions.dex.watchOrderCancelled(config, {
 *   onOrderCancelled: (args, log) => {
 *     console.log('Order cancelled:', args)
 *   },
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns A function to unsubscribe from the event.
 */
export function watchOrderCancelled<config extends Config>(
  config: config,
  parameters: watchOrderCancelled.Parameters<config>,
) {
  const { chainId, ...rest } = parameters
  const client = config.getClient({ chainId })
  return viem_Actions.watchOrderCancelled(client, rest)
}

export declare namespace watchOrderCancelled {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    viem_Actions.watchOrderCancelled.Parameters

  export type Args = viem_Actions.watchOrderCancelled.Args

  export type Log = viem_Actions.watchOrderCancelled.Log
}

/**
 * Watches for order placement events on the DEX.
 *
 * @example
 * ```ts
 * import { createConfig, http } from '@wagmi/core'
 * import { tempo } from 'tempo.ts/chains'
 * import { Actions } from 'tempo.ts/wagmi'
 *
 * const config = createConfig({
 *   chains: [tempo],
 *   transports: {
 *     [tempo.id]: http(),
 *   },
 * })
 *
 * const unwatch = Actions.dex.watchOrderPlaced(config, {
 *   onOrderPlaced: (args, log) => {
 *     console.log('Order placed:', args)
 *   },
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns A function to unsubscribe from the event.
 */
export function watchOrderPlaced<config extends Config>(
  config: config,
  parameters: watchOrderPlaced.Parameters<config>,
) {
  const { chainId, ...rest } = parameters
  const client = config.getClient({ chainId })
  return viem_Actions.watchOrderPlaced(client, rest)
}

export declare namespace watchOrderPlaced {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    viem_Actions.watchOrderPlaced.Parameters

  export type Args = viem_Actions.watchOrderPlaced.Args

  export type Log = viem_Actions.watchOrderPlaced.Log
}

/**
 * Withdraws tokens from the DEX to the caller's wallet.
 *
 * @example
 * ```ts
 * import { createConfig, http } from '@wagmi/core'
 * import { tempo } from 'tempo.ts/chains'
 * import { Actions } from 'tempo.ts/wagmi'
 *
 * const config = createConfig({
 *   chains: [tempo],
 *   transports: {
 *     [tempo.id]: http(),
 *   },
 * })
 *
 * const hash = await Actions.dex.withdraw(config, {
 *   amount: 100n,
 *   token: '0x20c...11',
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns The transaction hash.
 */
export async function withdraw<config extends Config>(
  config: config,
  parameters: withdraw.Parameters<config>,
): Promise<viem_Actions.withdraw.ReturnValue> {
  const { account, chainId, connector } = parameters

  const client = await getConnectorClient(config, {
    account,
    assertChainId: false,
    chainId,
    connector,
  })

  return viem_Actions.withdraw(
    client,
    parameters as viem_Actions.withdraw.Parameters,
  )
}

export declare namespace withdraw {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    ConnectorParameter &
    Omit<viem_Actions.withdraw.Parameters<undefined, Account>, 'chain'>

  export type ReturnValue = viem_Actions.withdraw.ReturnValue

  export type ErrorType = viem_Actions.withdraw.ErrorType
}

/**
 * Withdraws tokens from the DEX to the caller's wallet.
 *
 * Note: This is a synchronous action that waits for the transaction to
 * be included on a block before returning a response.
 *
 * @example
 * ```ts
 * import { createConfig, http } from '@wagmi/core'
 * import { tempo } from 'tempo.ts/chains'
 * import { Actions } from 'tempo.ts/wagmi'
 *
 * const config = createConfig({
 *   chains: [tempo],
 *   transports: {
 *     [tempo.id]: http(),
 *   },
 * })
 *
 * const result = await Actions.dex.withdrawSync(config, {
 *   amount: 100n,
 *   token: '0x20c...11',
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns The transaction receipt and event data.
 */
export async function withdrawSync<config extends Config>(
  config: config,
  parameters: withdrawSync.Parameters<config>,
): Promise<viem_Actions.withdrawSync.ReturnValue> {
  const { account, chainId, connector } = parameters

  const client = await getConnectorClient(config, {
    account,
    assertChainId: false,
    chainId,
    connector,
  })

  return viem_Actions.withdrawSync(
    client,
    parameters as viem_Actions.withdrawSync.Parameters,
  )
}

export declare namespace withdrawSync {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    ConnectorParameter &
    Omit<viem_Actions.withdrawSync.Parameters<undefined, Account>, 'chain'>

  export type ReturnValue = viem_Actions.withdrawSync.ReturnValue

  export type ErrorType = viem_Actions.withdrawSync.ErrorType
}
