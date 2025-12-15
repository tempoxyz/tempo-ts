import type * as Query from '@tanstack/query-core'
import { type Config, getConnectorClient } from '@wagmi/core'
import type { ChainIdParameter, ConnectorParameter } from '@wagmi/core/internal'
import type { Account } from 'viem'
import { reward } from 'viem/tempo/actions'
import type { RequiredBy, UnionOmit } from '../../internal/types.js'

/**
 * Claims accumulated rewards for a recipient.
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
 * const hash = await Actions.reward.claim(config, {
 *   token: '0x20c0000000000000000000000000000000000001',
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns The transaction hash.
 */
export async function claim<config extends Config>(
  config: config,
  parameters: claim.Parameters<config>,
): Promise<reward.claim.ReturnValue> {
  const { account, chainId, connector } = parameters

  const client = await getConnectorClient(config, {
    account,
    assertChainId: false,
    chainId,
    connector,
  })

  return reward.claim(client, parameters as never)
}

export declare namespace claim {
  export type Parameters<config extends Config = Config> =
    ChainIdParameter<config> &
      ConnectorParameter &
      UnionOmit<
        reward.claim.Parameters<config['chains'][number], Account>,
        'chain'
      >

  export type ReturnValue = reward.claim.ReturnValue

  export type ErrorType = reward.claim.ErrorType
}

/**
 * Claims accumulated rewards for a recipient and waits for confirmation.
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
 * const result = await Actions.reward.claimSync(config, {
 *   token: '0x20c0000000000000000000000000000000000001',
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns The transaction receipt.
 */
export async function claimSync<config extends Config>(
  config: config,
  parameters: claimSync.Parameters<config>,
): Promise<reward.claimSync.ReturnValue> {
  const { account, chainId, connector } = parameters

  const client = await getConnectorClient(config, {
    account,
    assertChainId: false,
    chainId,
    connector,
  })

  return reward.claimSync(client, parameters as never)
}

export declare namespace claimSync {
  export type Parameters<config extends Config = Config> =
    ChainIdParameter<config> &
      ConnectorParameter &
      UnionOmit<
        reward.claimSync.Parameters<config['chains'][number], Account>,
        'chain'
      >

  export type ReturnValue = reward.claimSync.ReturnValue

  export type ErrorType = reward.claimSync.ErrorType
}

/**
 * Gets the total reward per second rate for all active streams.
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
 * const rate = await Actions.reward.getTotalPerSecond(config, {
 *   token: '0x20c0000000000000000000000000000000000001',
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns The total reward per second (scaled by 1e18).
 */
export function getTotalPerSecond<config extends Config>(
  config: config,
  parameters: getTotalPerSecond.Parameters<config>,
) {
  const { chainId, ...rest } = parameters
  const client = config.getClient({ chainId })
  return reward.getTotalPerSecond(client, rest)
}

export namespace getTotalPerSecond {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    reward.getTotalPerSecond.Parameters

  export type ReturnValue = reward.getTotalPerSecond.ReturnValue

  export function queryKey<config extends Config>(
    parameters: Parameters<config>,
  ) {
    return ['getTotalPerSecond', parameters] as const
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
        return await getTotalPerSecond(config, parameters)
      },
    }
  }

  export declare namespace queryOptions {
    export type Parameters<
      config extends Config,
      selectData = getTotalPerSecond.ReturnValue,
    > = getTotalPerSecond.Parameters<config> & {
      query?:
        | Omit<ReturnValue<config, selectData>, 'queryKey' | 'queryFn'>
        | undefined
    }

    export type ReturnValue<
      config extends Config,
      selectData = getTotalPerSecond.ReturnValue,
    > = RequiredBy<
      Query.QueryOptions<
        getTotalPerSecond.ReturnValue,
        Query.DefaultError,
        selectData,
        getTotalPerSecond.QueryKey<config>
      >,
      'queryKey' | 'queryFn'
    >
  }
}

/**
 * Gets the reward information for a specific account.
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
 * const info = await Actions.reward.getUserRewardInfo(config, {
 *   token: '0x20c0000000000000000000000000000000000001',
 *   account: '0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC',
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns The user's reward information (recipient, rewardPerToken, rewardBalance).
 */
export function getUserRewardInfo<config extends Config>(
  config: config,
  parameters: getUserRewardInfo.Parameters<config>,
) {
  const { chainId, ...rest } = parameters
  const client = config.getClient({ chainId })
  return reward.getUserRewardInfo(client, rest)
}

export namespace getUserRewardInfo {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    reward.getUserRewardInfo.Parameters

  export type ReturnValue = reward.getUserRewardInfo.ReturnValue

  export function queryKey<config extends Config>(
    parameters: Parameters<config>,
  ) {
    return ['getUserRewardInfo', parameters] as const
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
        return await getUserRewardInfo(config, parameters)
      },
    }
  }

  export declare namespace queryOptions {
    export type Parameters<
      config extends Config,
      selectData = getUserRewardInfo.ReturnValue,
    > = getUserRewardInfo.Parameters<config> & {
      query?:
        | Omit<ReturnValue<config, selectData>, 'queryKey' | 'queryFn'>
        | undefined
    }

    export type ReturnValue<
      config extends Config,
      selectData = getUserRewardInfo.ReturnValue,
    > = RequiredBy<
      Query.QueryOptions<
        getUserRewardInfo.ReturnValue,
        Query.DefaultError,
        selectData,
        getUserRewardInfo.QueryKey<config>
      >,
      'queryKey' | 'queryFn'
    >
  }
}

/**
 * Sets or changes the reward recipient for a token holder.
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
 * const hash = await Actions.reward.setRecipient(config, {
 *   recipient: '0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC',
 *   token: '0x20c0000000000000000000000000000000000001',
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns The transaction hash.
 */
export async function setRecipient<config extends Config>(
  config: config,
  parameters: setRecipient.Parameters<config>,
): Promise<reward.setRecipient.ReturnValue> {
  const { account, chainId, connector } = parameters

  const client = await getConnectorClient(config, {
    account,
    assertChainId: false,
    chainId,
    connector,
  })

  return reward.setRecipient(client, parameters as never)
}

export declare namespace setRecipient {
  export type Parameters<config extends Config = Config> =
    ChainIdParameter<config> &
      ConnectorParameter &
      UnionOmit<
        reward.setRecipient.Parameters<config['chains'][number], Account>,
        'chain'
      >

  export type ReturnValue = reward.setRecipient.ReturnValue

  export type ErrorType = reward.setRecipient.ErrorType
}

/**
 * Sets or changes the reward recipient for a token holder and waits for confirmation.
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
 * const result = await Actions.reward.setRecipientSync(config, {
 *   recipient: '0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC',
 *   token: '0x20c0000000000000000000000000000000000001',
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns The transaction receipt and event data.
 */
export async function setRecipientSync<config extends Config>(
  config: config,
  parameters: setRecipientSync.Parameters<config>,
): Promise<reward.setRecipientSync.ReturnValue> {
  const { account, chainId, connector } = parameters

  const client = await getConnectorClient(config, {
    account,
    assertChainId: false,
    chainId,
    connector,
  })

  return reward.setRecipientSync(client, parameters as never)
}

export declare namespace setRecipientSync {
  export type Parameters<config extends Config = Config> =
    ChainIdParameter<config> &
      ConnectorParameter &
      UnionOmit<
        reward.setRecipientSync.Parameters<config['chains'][number], Account>,
        'chain'
      >

  export type ReturnValue = reward.setRecipientSync.ReturnValue

  export type ErrorType = reward.setRecipientSync.ErrorType
}

/**
 * Starts a new reward stream that distributes tokens to opted-in holders.
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
 * const hash = await Actions.reward.start(config, {
 *   amount: 100000000000000000000n,
 *   seconds: 86400,
 *   token: '0x20c0000000000000000000000000000000000001',
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns The transaction hash.
 */
export async function start<config extends Config>(
  config: config,
  parameters: start.Parameters<config>,
): Promise<reward.start.ReturnValue> {
  const { account, chainId, connector } = parameters

  const client = await getConnectorClient(config, {
    account,
    assertChainId: false,
    chainId,
    connector,
  })

  return reward.start(client, parameters as never)
}

export declare namespace start {
  export type Parameters<config extends Config = Config> =
    ChainIdParameter<config> &
      ConnectorParameter &
      UnionOmit<
        reward.start.Parameters<config['chains'][number], Account>,
        'chain'
      >

  export type ReturnValue = reward.start.ReturnValue

  export type ErrorType = reward.start.ErrorType
}

/**
 * Starts a new reward stream that distributes tokens to opted-in holders and waits for confirmation.
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
 * const result = await Actions.reward.startSync(config, {
 *   amount: 100000000000000000000n,
 *   seconds: 86400,
 *   token: '0x20c0000000000000000000000000000000000001',
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns The transaction receipt and event data.
 */
export async function startSync<config extends Config>(
  config: config,
  parameters: startSync.Parameters<config>,
): Promise<reward.startSync.ReturnValue> {
  const { account, chainId, connector } = parameters

  const client = await getConnectorClient(config, {
    account,
    assertChainId: false,
    chainId,
    connector,
  })

  return reward.startSync(client, parameters as never)
}

export declare namespace startSync {
  export type Parameters<config extends Config = Config> =
    ChainIdParameter<config> &
      ConnectorParameter &
      UnionOmit<
        reward.startSync.Parameters<config['chains'][number], Account>,
        'chain'
      >

  export type ReturnValue = reward.startSync.ReturnValue

  export type ErrorType = reward.startSync.ErrorType
}

/**
 * Watches for reward scheduled events.
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
 * const unwatch = Actions.reward.watchRewardScheduled(config, {
 *   token: '0x20c0000000000000000000000000000000000001',
 *   onRewardScheduled: (args, log) => {
 *     console.log('Reward scheduled:', args)
 *   },
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns A function to unsubscribe from the event.
 */
export function watchRewardScheduled<config extends Config>(
  config: config,
  parameters: watchRewardScheduled.Parameters<config>,
) {
  const { chainId, ...rest } = parameters
  const client = config.getClient({ chainId })
  return reward.watchRewardScheduled(client, rest)
}

export declare namespace watchRewardScheduled {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    reward.watchRewardScheduled.Parameters
}

/**
 * Watches for reward recipient set events.
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
 * const unwatch = Actions.reward.watchRewardRecipientSet(config, {
 *   token: '0x20c0000000000000000000000000000000000001',
 *   onRewardRecipientSet: (args, log) => {
 *     console.log('Reward recipient set:', args)
 *   },
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns A function to unsubscribe from the event.
 */
export function watchRewardRecipientSet<config extends Config>(
  config: config,
  parameters: watchRewardRecipientSet.Parameters<config>,
) {
  const { chainId, ...rest } = parameters
  const client = config.getClient({ chainId })
  return reward.watchRewardRecipientSet(client, rest)
}

export declare namespace watchRewardRecipientSet {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    reward.watchRewardRecipientSet.Parameters
}
