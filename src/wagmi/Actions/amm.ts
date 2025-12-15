import type * as Query from '@tanstack/query-core'
import { type Config, getConnectorClient } from '@wagmi/core'
import type { ChainIdParameter, ConnectorParameter } from '@wagmi/core/internal'
import type { Account } from 'viem'
import { amm } from 'viem/tempo/actions'
import type { RequiredBy, UnionOmit } from '../../internal/types.js'

/**
 * Gets the reserves for a liquidity pool.
 *
 * @example
 * ```ts
 * import { createConfig, http } from '@wagmi/core'
 * import { tempo } from '@wagmi/core/chains'
 * import { Actions } from 'tempo.ts/wagmi'
 *
 * const config = createConfig({
 *   chains: [tempo],
 *   transports: {
 *     [tempo.id]: http(),
 *   },
 * })
 *
 * const pool = await Actions.amm.getPool(config, {
 *   userToken: '0x...',
 *   validatorToken: '0x...',
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns The pool reserves.
 */
export function getPool<config extends Config>(
  config: config,
  parameters: getPool.Parameters<config>,
) {
  const { chainId, ...rest } = parameters
  const client = config.getClient({ chainId })
  return amm.getPool(client, rest)
}

export namespace getPool {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    amm.getPool.Parameters

  export type ReturnValue = amm.getPool.ReturnValue

  export function queryKey<config extends Config>(
    parameters: Parameters<config>,
  ) {
    return ['getPool', parameters] as const
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
        return await getPool(config, parameters)
      },
    }
  }

  export declare namespace queryOptions {
    export type Parameters<
      config extends Config,
      selectData = getPool.ReturnValue,
    > = getPool.Parameters<config> & {
      query?:
        | Omit<ReturnValue<config, selectData>, 'queryKey' | 'queryFn'>
        | undefined
    }

    export type ReturnValue<
      config extends Config,
      selectData = getPool.ReturnValue,
    > = RequiredBy<
      Query.QueryOptions<
        getPool.ReturnValue,
        Query.DefaultError,
        selectData,
        getPool.QueryKey<config>
      >,
      'queryKey' | 'queryFn'
    >
  }
}

/**
 * Gets the LP token balance for an account in a specific pool.
 *
 * @example
 * ```ts
 * import { createConfig, http } from '@wagmi/core'
 * import { tempo } from '@wagmi/core/chains'
 * import { Actions } from 'tempo.ts/wagmi'
 *
 * const config = createConfig({
 *   chains: [tempo],
 *   transports: {
 *     [tempo.id]: http(),
 *   },
 * })
 *
 * const poolId = await Actions.amm.getPoolId(config, {
 *   userToken: '0x...',
 *   validatorToken: '0x...',
 * })
 *
 * const balance = await Actions.amm.getLiquidityBalance(config, {
 *   poolId,
 *   address: '0x...',
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns The LP token balance.
 */
export function getLiquidityBalance<config extends Config>(
  config: config,
  parameters: getLiquidityBalance.Parameters<config>,
) {
  const { chainId, ...rest } = parameters
  const client = config.getClient({ chainId })
  return amm.getLiquidityBalance(client, rest)
}

export namespace getLiquidityBalance {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    amm.getLiquidityBalance.Parameters

  export type ReturnValue = amm.getLiquidityBalance.ReturnValue

  export function queryKey<config extends Config>(
    parameters: Parameters<config>,
  ) {
    return ['getLiquidityBalance', parameters] as const
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
        return await getLiquidityBalance(config, parameters)
      },
    }
  }

  export declare namespace queryOptions {
    export type Parameters<
      config extends Config,
      selectData = getLiquidityBalance.ReturnValue,
    > = getLiquidityBalance.Parameters<config> & {
      query?:
        | Omit<ReturnValue<config, selectData>, 'queryKey' | 'queryFn'>
        | undefined
    }

    export type ReturnValue<
      config extends Config,
      selectData = getLiquidityBalance.ReturnValue,
    > = RequiredBy<
      Query.QueryOptions<
        getLiquidityBalance.ReturnValue,
        Query.DefaultError,
        selectData,
        getLiquidityBalance.QueryKey<config>
      >,
      'queryKey' | 'queryFn'
    >
  }
}

/**
 * Performs a rebalance swap from validator token to user token.
 *
 * @example
 * ```ts
 * import { createConfig, http } from '@wagmi/core'
 * import { tempo } from '@wagmi/core/chains'
 * import { Actions } from 'tempo.ts/wagmi'
 *
 * const config = createConfig({
 *   chains: [tempo],
 *   transports: {
 *     [tempo.id]: http(),
 *   },
 * })
 *
 * const hash = await Actions.amm.rebalanceSwap(config, {
 *   userToken: '0x...',
 *   validatorToken: '0x...',
 *   amountOut: 100n,
 *   to: '0x...',
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns The transaction hash.
 */
export async function rebalanceSwap<config extends Config>(
  config: config,
  parameters: rebalanceSwap.Parameters<config>,
): Promise<amm.rebalanceSwap.ReturnValue> {
  const { account, chainId, connector } = parameters

  const client = await getConnectorClient(config, {
    account,
    assertChainId: false,
    chainId,
    connector,
  })

  return amm.rebalanceSwap(client, parameters as never)
}

export declare namespace rebalanceSwap {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    ConnectorParameter &
    UnionOmit<
      amm.rebalanceSwap.Parameters<config['chains'][number], Account>,
      'chain'
    >

  export type ReturnValue = amm.rebalanceSwap.ReturnValue
}

/**
 * Performs a rebalance swap from validator token to user token.
 *
 * @example
 * ```ts
 * import { createConfig, http } from '@wagmi/core'
 * import { tempo } from '@wagmi/core/chains'
 * import { Actions } from 'tempo.ts/wagmi'
 *
 * const config = createConfig({
 *   chains: [tempo],
 *   transports: {
 *     [tempo.id]: http(),
 *   },
 * })
 *
 * const result = await Actions.amm.rebalanceSwapSync(config, {
 *   userToken: '0x...',
 *   validatorToken: '0x...',
 *   amountOut: 100n,
 *   to: '0x...',
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns The transaction receipt and event data.
 */
export async function rebalanceSwapSync<config extends Config>(
  config: config,
  parameters: rebalanceSwapSync.Parameters<config>,
): Promise<amm.rebalanceSwapSync.ReturnValue> {
  const { account, chainId, connector } = parameters

  const client = await getConnectorClient(config, {
    account,
    assertChainId: false,
    chainId,
    connector,
  })

  return amm.rebalanceSwapSync(client, parameters as never)
}

export declare namespace rebalanceSwapSync {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    ConnectorParameter &
    UnionOmit<
      amm.rebalanceSwapSync.Parameters<config['chains'][number], Account>,
      'chain'
    >

  export type ReturnValue = amm.rebalanceSwapSync.ReturnValue
}

/**
 * Adds liquidity to a pool.
 *
 * @example
 * ```ts
 * import { createConfig, http } from '@wagmi/core'
 * import { tempo } from '@wagmi/core/chains'
 * import { Actions } from 'tempo.ts/wagmi'
 *
 * const config = createConfig({
 *   chains: [tempo],
 *   transports: {
 *     [tempo.id]: http(),
 *   },
 * })
 *
 * const hash = await Actions.amm.mint(config, {
 *   userTokenAddress: '0x20c0...beef',
 *   validatorTokenAddress: '0x20c0...babe',
 *   validatorTokenAmount: 100n,
 *   to: '0xfeed...fede',
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns The transaction hash.
 */
export async function mint<config extends Config>(
  config: config,
  parameters: mint.Parameters<config>,
): Promise<amm.mint.ReturnValue> {
  const { account, chainId, connector } = parameters

  const client = await getConnectorClient(config, {
    account,
    assertChainId: false,
    chainId,
    connector,
  })

  return amm.mint(client, parameters as never)
}

export declare namespace mint {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    ConnectorParameter &
    UnionOmit<amm.mint.Parameters<config['chains'][number], Account>, 'chain'>

  export type ReturnValue = amm.mint.ReturnValue
}

/**
 * Adds liquidity to a pool.
 *
 * @example
 * ```ts
 * import { createConfig, http } from '@wagmi/core'
 * import { tempo } from '@wagmi/core/chains'
 * import { Actions } from 'tempo.ts/wagmi'
 *
 * const config = createConfig({
 *   chains: [tempo],
 *   transports: {
 *     [tempo.id]: http(),
 *   },
 * })
 *
 * const result = await Actions.amm.mintSync(config, {
 *   userTokenAddress: '0x20c0...beef',
 *   validatorTokenAddress: '0x20c0...babe',
 *   validatorTokenAmount: 100n,
 *   to: '0xfeed...fede',
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns The transaction receipt and event data.
 */
export async function mintSync<config extends Config>(
  config: config,
  parameters: mintSync.Parameters<config>,
): Promise<amm.mintSync.ReturnValue> {
  const { account, chainId, connector } = parameters

  const client = await getConnectorClient(config, {
    account,
    assertChainId: false,
    chainId,
    connector,
  })

  return amm.mintSync(client, parameters as never)
}

export declare namespace mintSync {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    ConnectorParameter &
    UnionOmit<
      amm.mintSync.Parameters<config['chains'][number], Account>,
      'chain'
    >

  export type ReturnValue = amm.mintSync.ReturnValue
}

/**
 * Removes liquidity from a pool.
 *
 * @example
 * ```ts
 * import { createConfig, http } from '@wagmi/core'
 * import { tempo } from '@wagmi/core/chains'
 * import { Actions } from 'tempo.ts/wagmi'
 *
 * const config = createConfig({
 *   chains: [tempo],
 *   transports: {
 *     [tempo.id]: http(),
 *   },
 * })
 *
 * const hash = await Actions.amm.burn(config, {
 *   userToken: '0x20c0...beef',
 *   validatorToken: '0x20c0...babe',
 *   liquidity: 50n,
 *   to: '0xfeed...fede',
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns The transaction hash.
 */
export async function burn<config extends Config>(
  config: config,
  parameters: burn.Parameters<config>,
): Promise<amm.burn.ReturnValue> {
  const { account, chainId, connector } = parameters

  const client = await getConnectorClient(config, {
    account,
    assertChainId: false,
    chainId,
    connector,
  })

  return amm.burn(client, parameters as never)
}

export declare namespace burn {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    ConnectorParameter &
    UnionOmit<amm.burn.Parameters<config['chains'][number], Account>, 'chain'>

  export type ReturnValue = amm.burn.ReturnValue
}

/**
 * Removes liquidity from a pool.
 *
 * @example
 * ```ts
 * import { createConfig, http } from '@wagmi/core'
 * import { tempo } from '@wagmi/core/chains'
 * import { Actions } from 'tempo.ts/wagmi'
 *
 * const config = createConfig({
 *   chains: [tempo],
 *   transports: {
 *     [tempo.id]: http(),
 *   },
 * })
 *
 * const result = await Actions.amm.burnSync(config, {
 *   userToken: '0x20c0...beef',
 *   validatorToken: '0x20c0...babe',
 *   liquidity: 50n,
 *   to: '0xfeed...fede',
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns The transaction receipt and event data.
 */
export async function burnSync<config extends Config>(
  config: config,
  parameters: burnSync.Parameters<config>,
): Promise<amm.burnSync.ReturnValue> {
  const { account, chainId, connector } = parameters

  const client = await getConnectorClient(config, {
    account,
    assertChainId: false,
    chainId,
    connector,
  })

  return amm.burnSync(client, parameters as never)
}

export declare namespace burnSync {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    ConnectorParameter &
    UnionOmit<
      amm.burnSync.Parameters<config['chains'][number], Account>,
      'chain'
    >

  export type ReturnValue = amm.burnSync.ReturnValue
}

/**
 * Watches for rebalance swap events.
 *
 * @example
 * ```ts
 * import { createConfig, http } from '@wagmi/core'
 * import { tempo } from '@wagmi/core/chains'
 * import { Actions } from 'tempo.ts/wagmi'
 *
 * const config = createConfig({
 *   chains: [tempo],
 *   transports: {
 *     [tempo.id]: http(),
 *   },
 * })
 *
 * const unwatch = Actions.amm.watchRebalanceSwap(config, {
 *   onRebalanceSwap: (args, log) => {
 *     console.log('Rebalance swap:', args)
 *   },
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns A function to unsubscribe from the event.
 */
export function watchRebalanceSwap<config extends Config>(
  config: config,
  parameters: watchRebalanceSwap.Parameters<config>,
) {
  const { chainId, ...rest } = parameters
  const client = config.getClient({ chainId })
  return amm.watchRebalanceSwap(client, rest)
}

export declare namespace watchRebalanceSwap {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    amm.watchRebalanceSwap.Parameters
}

/**
 * Watches for fee swap events.
 *
 * @example
 * ```ts
 * import { createConfig, http } from '@wagmi/core'
 * import { tempo } from '@wagmi/core/chains'
 * import { Actions } from 'tempo.ts/wagmi'
 *
 * const config = createConfig({
 *   chains: [tempo],
 *   transports: {
 *     [tempo.id]: http(),
 *   },
 * })
 *
 * const unwatch = Actions.amm.watchFeeSwap(config, {
 *   onFeeSwap: (args, log) => {
 *     console.log('Fee swap:', args)
 *   },
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns A function to unsubscribe from the event.
 */
export function watchFeeSwap<config extends Config>(
  config: config,
  parameters: watchFeeSwap.Parameters<config>,
) {
  const { chainId, ...rest } = parameters
  const client = config.getClient({ chainId })
  return amm.watchFeeSwap(client, rest)
}

export declare namespace watchFeeSwap {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    amm.watchFeeSwap.Parameters
}

/**
 * Watches for liquidity mint events.
 *
 * @example
 * ```ts
 * import { createConfig, http } from '@wagmi/core'
 * import { tempo } from '@wagmi/core/chains'
 * import { Actions } from 'tempo.ts/wagmi'
 *
 * const config = createConfig({
 *   chains: [tempo],
 *   transports: {
 *     [tempo.id]: http(),
 *   },
 * })
 *
 * const unwatch = Actions.amm.watchMint(config, {
 *   onMint: (args, log) => {
 *     console.log('Liquidity added:', args)
 *   },
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns A function to unsubscribe from the event.
 */
export function watchMint<config extends Config>(
  config: config,
  parameters: watchMint.Parameters<config>,
) {
  const { chainId, ...rest } = parameters
  const client = config.getClient({ chainId })
  return amm.watchMint(client, rest)
}

export declare namespace watchMint {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    amm.watchMint.Parameters
}

/**
 * Watches for liquidity burn events.
 *
 * @example
 * ```ts
 * import { createConfig, http } from '@wagmi/core'
 * import { tempo } from '@wagmi/core/chains'
 * import { Actions } from 'tempo.ts/wagmi'
 *
 * const config = createConfig({
 *   chains: [tempo],
 *   transports: {
 *     [tempo.id]: http(),
 *   },
 * })
 *
 * const unwatch = Actions.amm.watchBurn(config, {
 *   onBurn: (args, log) => {
 *     console.log('Liquidity removed:', args)
 *   },
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns A function to unsubscribe from the event.
 */
export function watchBurn<config extends Config>(
  config: config,
  parameters: watchBurn.Parameters<config>,
) {
  const { chainId, ...rest } = parameters
  const client = config.getClient({ chainId })
  return amm.watchBurn(client, rest)
}

export declare namespace watchBurn {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    amm.watchBurn.Parameters
}
