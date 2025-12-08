import type * as Query from '@tanstack/query-core'
import type { Config } from '@wagmi/core'
import type { ChainIdParameter } from '@wagmi/core/internal'
import type { PartialBy, RequiredBy } from '../../internal/types.js'
import * as viem_Actions from '../../viem/Actions/nonce.js'

/**
 * Gets the nonce for an account and nonce key.
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
 * const nonce = await Actions.nonce.getNonce(config, {
 *   account: '0x...',
 *   nonceKey: 1n,
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns The nonce value.
 */
export function getNonce<config extends Config>(
  config: config,
  parameters: getNonce.Parameters<config>,
): Promise<getNonce.ReturnValue> {
  const { chainId, ...rest } = parameters
  const client = config.getClient({ chainId })
  return viem_Actions.getNonce(client, rest)
}

export namespace getNonce {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    viem_Actions.getNonce.Parameters

  export type ReturnValue = viem_Actions.getNonce.ReturnValue

  export function queryKey<config extends Config>(
    parameters: PartialBy<Parameters<config>, 'account' | 'nonceKey'>,
  ) {
    return ['getNonce', parameters] as const
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
        const [, { account, nonceKey, ...parameters }] = queryKey
        if (!account) throw new Error('account is required.')
        if (nonceKey === undefined) throw new Error('nonceKey is required.')
        return await getNonce(config, { account, nonceKey, ...parameters })
      },
    }
  }

  export declare namespace queryOptions {
    export type Parameters<
      config extends Config,
      selectData = getNonce.ReturnValue,
    > = PartialBy<getNonce.Parameters<config>, 'account' | 'nonceKey'> & {
      query?:
        | Omit<ReturnValue<config, selectData>, 'queryKey' | 'queryFn'>
        | undefined
    }

    export type ReturnValue<
      config extends Config,
      selectData = getNonce.ReturnValue,
    > = RequiredBy<
      Query.QueryOptions<
        getNonce.ReturnValue,
        Query.DefaultError,
        selectData,
        getNonce.QueryKey<config>
      >,
      'queryKey' | 'queryFn'
    >
  }
}

/**
 * Gets the number of active nonce keys for an account.
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
 * const count = await Actions.nonce.getActiveNonceKeyCount(config, {
 *   account: '0x...',
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns The number of active nonce keys.
 */
export function getActiveNonceKeyCount<config extends Config>(
  config: config,
  parameters: getActiveNonceKeyCount.Parameters<config>,
): Promise<getActiveNonceKeyCount.ReturnValue> {
  const { chainId, ...rest } = parameters
  const client = config.getClient({ chainId })
  return viem_Actions.getActiveNonceKeyCount(client, rest)
}

export namespace getActiveNonceKeyCount {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    viem_Actions.getActiveNonceKeyCount.Parameters

  export type ReturnValue = viem_Actions.getActiveNonceKeyCount.ReturnValue

  export function queryKey<config extends Config>(
    parameters: PartialBy<Parameters<config>, 'account'>,
  ) {
    return ['getActiveNonceKeyCount', parameters] as const
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
        return await getActiveNonceKeyCount(config, { account, ...parameters })
      },
    }
  }

  export declare namespace queryOptions {
    export type Parameters<
      config extends Config,
      selectData = getActiveNonceKeyCount.ReturnValue,
    > = PartialBy<getActiveNonceKeyCount.Parameters<config>, 'account'> & {
      query?:
        | Omit<ReturnValue<config, selectData>, 'queryKey' | 'queryFn'>
        | undefined
    }

    export type ReturnValue<
      config extends Config,
      selectData = getActiveNonceKeyCount.ReturnValue,
    > = RequiredBy<
      Query.QueryOptions<
        getActiveNonceKeyCount.ReturnValue,
        Query.DefaultError,
        selectData,
        getActiveNonceKeyCount.QueryKey<config>
      >,
      'queryKey' | 'queryFn'
    >
  }
}

/**
 * Watches for nonce incremented events.
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
 * const unwatch = Actions.nonce.watchNonceIncremented(config, {
 *   onNonceIncremented: (args, log) => {
 *     console.log('Nonce incremented:', args)
 *   },
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns A function to unsubscribe from the event.
 */
export function watchNonceIncremented<config extends Config>(
  config: config,
  parameters: watchNonceIncremented.Parameters<config>,
): () => void {
  const { chainId, ...rest } = parameters
  const client = config.getClient({ chainId })
  return viem_Actions.watchNonceIncremented(client, rest)
}

export declare namespace watchNonceIncremented {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    viem_Actions.watchNonceIncremented.Parameters
}

/**
 * Watches for active key count changed events.
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
 * const unwatch = Actions.nonce.watchActiveKeyCountChanged(config, {
 *   onActiveKeyCountChanged: (args, log) => {
 *     console.log('Active key count changed:', args)
 *   },
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns A function to unsubscribe from the event.
 */
export function watchActiveKeyCountChanged<config extends Config>(
  config: config,
  parameters: watchActiveKeyCountChanged.Parameters<config>,
): () => void {
  const { chainId, ...rest } = parameters
  const client = config.getClient({ chainId })
  return viem_Actions.watchActiveKeyCountChanged(client, rest)
}

export declare namespace watchActiveKeyCountChanged {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    viem_Actions.watchActiveKeyCountChanged.Parameters
}
