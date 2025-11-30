import type * as Query from '@tanstack/query-core'
import { type Config, getConnectorClient } from '@wagmi/core'
import type { ChainIdParameter, ConnectorParameter } from '@wagmi/core/internal'
import type { Account } from 'viem'
import type { RequiredBy, UnionOmit } from '../../internal/types.js'
import * as viem_Actions from '../../viem/Actions/amm.js'

/**
 * Gets the reserves for a liquidity pool.
 *
 * @example
 * ```ts
 * import { createConfig, http } from '@wagmi/core'
 * import { tempo } from 'tempo.ts/chains'
 * import { Actions } from 'tempo.ts/wagmi'
 *
 * const config = createConfig({
 *   chains: [tempo({ feeToken: '0x20c0000000000000000000000000000000000001' })],
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
  return viem_Actions.getPool(client, rest)
}

export namespace getPool {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    viem_Actions.getPool.Parameters

  export type ReturnValue = viem_Actions.getPool.ReturnValue

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
 * import { tempo } from 'tempo.ts/chains'
 * import { Actions } from 'tempo.ts/wagmi'
 *
 * const config = createConfig({
 *   chains: [tempo({ feeToken: '0x20c0000000000000000000000000000000000001' })],
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
  return viem_Actions.getLiquidityBalance(client, rest)
}

export namespace getLiquidityBalance {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    viem_Actions.getLiquidityBalance.Parameters

  export type ReturnValue = viem_Actions.getLiquidityBalance.ReturnValue

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
 * import { tempo } from 'tempo.ts/chains'
 * import { Actions } from 'tempo.ts/wagmi'
 *
 * const config = createConfig({
 *   chains: [tempo({ feeToken: '0x20c0000000000000000000000000000000000001' })],
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
): Promise<viem_Actions.rebalanceSwap.ReturnValue> {
  const { account, chainId, connector } = parameters

  const client = await getConnectorClient(config, {
    account,
    assertChainId: false,
    chainId,
    connector,
  })

  return viem_Actions.rebalanceSwap(client, parameters as never)
}

export declare namespace rebalanceSwap {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    ConnectorParameter &
    UnionOmit<
      viem_Actions.rebalanceSwap.Parameters<config['chains'][number], Account>,
      'chain'
    >

  export type ReturnValue = viem_Actions.rebalanceSwap.ReturnValue
}

/**
 * Performs a rebalance swap from validator token to user token.
 *
 * @example
 * ```ts
 * import { createConfig, http } from '@wagmi/core'
 * import { tempo } from 'tempo.ts/chains'
 * import { Actions } from 'tempo.ts/wagmi'
 *
 * const config = createConfig({
 *   chains: [tempo({ feeToken: '0x20c0000000000000000000000000000000000001' })],
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
): Promise<viem_Actions.rebalanceSwapSync.ReturnValue> {
  const { account, chainId, connector } = parameters

  const client = await getConnectorClient(config, {
    account,
    assertChainId: false,
    chainId,
    connector,
  })

  return viem_Actions.rebalanceSwapSync(client, parameters as never)
}

export declare namespace rebalanceSwapSync {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    ConnectorParameter &
    UnionOmit<
      viem_Actions.rebalanceSwapSync.Parameters<
        config['chains'][number],
        Account
      >,
      'chain'
    >

  export type ReturnValue = viem_Actions.rebalanceSwapSync.ReturnValue
}

/**
 * Adds liquidity to a pool.
 *
 * @example
 * ```ts
 * import { createConfig, http } from '@wagmi/core'
 * import { tempo } from 'tempo.ts/chains'
 * import { Actions } from 'tempo.ts/wagmi'
 *
 * const config = createConfig({
 *   chains: [tempo({ feeToken: '0x20c0000000000000000000000000000000000001' })],
 *   transports: {
 *     [tempo.id]: http(),
 *   },
 * })
 *
 * const hash = await Actions.amm.mint(config, {
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
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns The transaction hash.
 */
export async function mint<config extends Config>(
  config: config,
  parameters: mint.Parameters<config>,
): Promise<viem_Actions.mint.ReturnValue> {
  const { account, chainId, connector } = parameters

  const client = await getConnectorClient(config, {
    account,
    assertChainId: false,
    chainId,
    connector,
  })

  return viem_Actions.mint(client, parameters as never)
}

export declare namespace mint {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    ConnectorParameter &
    UnionOmit<
      viem_Actions.mint.Parameters<config['chains'][number], Account>,
      'chain'
    >

  export type ReturnValue = viem_Actions.mint.ReturnValue
}

/**
 * Adds liquidity to a pool.
 *
 * @example
 * ```ts
 * import { createConfig, http } from '@wagmi/core'
 * import { tempo } from 'tempo.ts/chains'
 * import { Actions } from 'tempo.ts/wagmi'
 *
 * const config = createConfig({
 *   chains: [tempo({ feeToken: '0x20c0000000000000000000000000000000000001' })],
 *   transports: {
 *     [tempo.id]: http(),
 *   },
 * })
 *
 * const result = await Actions.amm.mintSync(config, {
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
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns The transaction receipt and event data.
 */
export async function mintSync<config extends Config>(
  config: config,
  parameters: mintSync.Parameters<config>,
): Promise<viem_Actions.mintSync.ReturnValue> {
  const { account, chainId, connector } = parameters

  const client = await getConnectorClient(config, {
    account,
    assertChainId: false,
    chainId,
    connector,
  })

  return viem_Actions.mintSync(client, parameters as never)
}

export declare namespace mintSync {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    ConnectorParameter &
    UnionOmit<
      viem_Actions.mintSync.Parameters<config['chains'][number], Account>,
      'chain'
    >

  export type ReturnValue = viem_Actions.mintSync.ReturnValue
}

/**
 * Removes liquidity from a pool.
 *
 * @example
 * ```ts
 * import { createConfig, http } from '@wagmi/core'
 * import { tempo } from 'tempo.ts/chains'
 * import { Actions } from 'tempo.ts/wagmi'
 *
 * const config = createConfig({
 *   chains: [tempo({ feeToken: '0x20c0000000000000000000000000000000000001' })],
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
): Promise<viem_Actions.burn.ReturnValue> {
  const { account, chainId, connector } = parameters

  const client = await getConnectorClient(config, {
    account,
    assertChainId: false,
    chainId,
    connector,
  })

  return viem_Actions.burn(client, parameters as never)
}

export declare namespace burn {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    ConnectorParameter &
    UnionOmit<
      viem_Actions.burn.Parameters<config['chains'][number], Account>,
      'chain'
    >

  export type ReturnValue = viem_Actions.burn.ReturnValue
}

/**
 * Removes liquidity from a pool.
 *
 * @example
 * ```ts
 * import { createConfig, http } from '@wagmi/core'
 * import { tempo } from 'tempo.ts/chains'
 * import { Actions } from 'tempo.ts/wagmi'
 *
 * const config = createConfig({
 *   chains: [tempo({ feeToken: '0x20c0000000000000000000000000000000000001' })],
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
): Promise<viem_Actions.burnSync.ReturnValue> {
  const { account, chainId, connector } = parameters

  const client = await getConnectorClient(config, {
    account,
    assertChainId: false,
    chainId,
    connector,
  })

  return viem_Actions.burnSync(client, parameters as never)
}

export declare namespace burnSync {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    ConnectorParameter &
    UnionOmit<
      viem_Actions.burnSync.Parameters<config['chains'][number], Account>,
      'chain'
    >

  export type ReturnValue = viem_Actions.burnSync.ReturnValue
}

/**
 * Watches for rebalance swap events.
 *
 * @example
 * ```ts
 * import { createConfig, http } from '@wagmi/core'
 * import { tempo } from 'tempo.ts/chains'
 * import { Actions } from 'tempo.ts/wagmi'
 *
 * const config = createConfig({
 *   chains: [tempo({ feeToken: '0x20c0000000000000000000000000000000000001' })],
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
  return viem_Actions.watchRebalanceSwap(client, rest)
}

export declare namespace watchRebalanceSwap {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    viem_Actions.watchRebalanceSwap.Parameters
}

/**
 * Watches for fee swap events.
 *
 * @example
 * ```ts
 * import { createConfig, http } from '@wagmi/core'
 * import { tempo } from 'tempo.ts/chains'
 * import { Actions } from 'tempo.ts/wagmi'
 *
 * const config = createConfig({
 *   chains: [tempo({ feeToken: '0x20c0000000000000000000000000000000000001' })],
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
  return viem_Actions.watchFeeSwap(client, rest)
}

export declare namespace watchFeeSwap {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    viem_Actions.watchFeeSwap.Parameters
}

/**
 * Watches for liquidity mint events.
 *
 * @example
 * ```ts
 * import { createConfig, http } from '@wagmi/core'
 * import { tempo } from 'tempo.ts/chains'
 * import { Actions } from 'tempo.ts/wagmi'
 *
 * const config = createConfig({
 *   chains: [tempo({ feeToken: '0x20c0000000000000000000000000000000000001' })],
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
  return viem_Actions.watchMint(client, rest)
}

export declare namespace watchMint {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    viem_Actions.watchMint.Parameters
}

/**
 * Watches for liquidity burn events.
 *
 * @example
 * ```ts
 * import { createConfig, http } from '@wagmi/core'
 * import { tempo } from 'tempo.ts/chains'
 * import { Actions } from 'tempo.ts/wagmi'
 *
 * const config = createConfig({
 *   chains: [tempo({ feeToken: '0x20c0000000000000000000000000000000000001' })],
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
  return viem_Actions.watchBurn(client, rest)
}

export declare namespace watchBurn {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    viem_Actions.watchBurn.Parameters
}
