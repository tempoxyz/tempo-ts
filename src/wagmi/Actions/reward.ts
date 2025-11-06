import type * as Query from '@tanstack/query-core'
import { type Config, getConnectorClient } from '@wagmi/core'
import type { ChainIdParameter, ConnectorParameter } from '@wagmi/core/internal'
import type { Account } from 'viem'
import type { RequiredBy } from '../../internal/types.js'
import * as viem_Actions from '../../viem/Actions/reward.js'

/**
 * Cancels an active reward stream and refunds remaining tokens.
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
 * const hash = await Actions.reward.cancel(config, {
 *   id: 1n,
 *   token: '0x20c0000000000000000000000000000000000001',
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
  export type Parameters<config extends Config = Config> =
    ChainIdParameter<config> &
      ConnectorParameter &
      Omit<viem_Actions.cancel.Parameters<undefined, Account>, 'chain'>

  export type ReturnValue = viem_Actions.cancel.ReturnValue

  export type ErrorType = viem_Actions.cancel.ErrorType
}

/**
 * Cancels an active reward stream and waits for confirmation.
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
 * const result = await Actions.reward.cancelSync(config, {
 *   id: 1n,
 *   token: '0x20c0000000000000000000000000000000000001',
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
  export type Parameters<config extends Config = Config> =
    ChainIdParameter<config> &
      ConnectorParameter &
      Omit<viem_Actions.cancelSync.Parameters<undefined, Account>, 'chain'>

  export type ReturnValue = viem_Actions.cancelSync.ReturnValue

  export type ErrorType = viem_Actions.cancelSync.ErrorType
}

/**
 * Claims accumulated rewards for a recipient.
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
): Promise<viem_Actions.claim.ReturnValue> {
  const { account, chainId, connector } = parameters

  const client = await getConnectorClient(config, {
    account,
    assertChainId: false,
    chainId,
    connector,
  })

  return viem_Actions.claim(client, parameters as viem_Actions.claim.Parameters)
}

export declare namespace claim {
  export type Parameters<config extends Config = Config> =
    ChainIdParameter<config> &
      ConnectorParameter &
      Omit<viem_Actions.claim.Parameters<undefined, Account>, 'chain'>

  export type ReturnValue = viem_Actions.claim.ReturnValue

  export type ErrorType = viem_Actions.claim.ErrorType
}

/**
 * Claims accumulated rewards for a recipient and waits for confirmation.
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
): Promise<viem_Actions.claimSync.ReturnValue> {
  const { account, chainId, connector } = parameters

  const client = await getConnectorClient(config, {
    account,
    assertChainId: false,
    chainId,
    connector,
  })

  return viem_Actions.claimSync(
    client,
    parameters as viem_Actions.claimSync.Parameters,
  )
}

export declare namespace claimSync {
  export type Parameters<config extends Config = Config> =
    ChainIdParameter<config> &
      ConnectorParameter &
      Omit<viem_Actions.claimSync.Parameters<undefined, Account>, 'chain'>

  export type ReturnValue = viem_Actions.claimSync.ReturnValue

  export type ErrorType = viem_Actions.claimSync.ErrorType
}

/**
 * Gets a reward stream by its ID.
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
 * const stream = await Actions.reward.getStream(config, {
 *   id: 1n,
 *   token: '0x20c0000000000000000000000000000000000001',
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns The reward stream details.
 */
export function getStream<config extends Config>(
  config: config,
  parameters: getStream.Parameters<config>,
) {
  const { chainId, ...rest } = parameters
  const client = config.getClient({ chainId })
  return viem_Actions.getStream(client, rest)
}

export namespace getStream {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    viem_Actions.getStream.Parameters

  export type ReturnValue = viem_Actions.getStream.ReturnValue

  export function queryKey<config extends Config>(
    parameters: Parameters<config>,
  ) {
    return ['getStream', parameters] as const
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
        return await getStream(config, parameters)
      },
    }
  }

  export declare namespace queryOptions {
    export type Parameters<
      config extends Config,
      selectData = getStream.ReturnValue,
    > = getStream.Parameters<config> & {
      query?:
        | Omit<ReturnValue<config, selectData>, 'queryKey' | 'queryFn'>
        | undefined
    }

    export type ReturnValue<
      config extends Config,
      selectData = getStream.ReturnValue,
    > = RequiredBy<
      Query.QueryOptions<
        getStream.ReturnValue,
        Query.DefaultError,
        selectData,
        getStream.QueryKey<config>
      >,
      'queryKey' | 'queryFn'
    >
  }
}

/**
 * Gets the total reward per second rate for all active streams.
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
  return viem_Actions.getTotalPerSecond(client, rest)
}

export namespace getTotalPerSecond {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    viem_Actions.getTotalPerSecond.Parameters

  export type ReturnValue = viem_Actions.getTotalPerSecond.ReturnValue

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
 * Sets or changes the reward recipient for a token holder.
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
): Promise<viem_Actions.setRecipient.ReturnValue> {
  const { account, chainId, connector } = parameters

  const client = await getConnectorClient(config, {
    account,
    assertChainId: false,
    chainId,
    connector,
  })

  return viem_Actions.setRecipient(
    client,
    parameters as viem_Actions.setRecipient.Parameters,
  )
}

export declare namespace setRecipient {
  export type Parameters<config extends Config = Config> =
    ChainIdParameter<config> &
      ConnectorParameter &
      Omit<viem_Actions.setRecipient.Parameters<undefined, Account>, 'chain'>

  export type ReturnValue = viem_Actions.setRecipient.ReturnValue

  export type ErrorType = viem_Actions.setRecipient.ErrorType
}

/**
 * Sets or changes the reward recipient for a token holder and waits for confirmation.
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
): Promise<viem_Actions.setRecipientSync.ReturnValue> {
  const { account, chainId, connector } = parameters

  const client = await getConnectorClient(config, {
    account,
    assertChainId: false,
    chainId,
    connector,
  })

  return viem_Actions.setRecipientSync(
    client,
    parameters as viem_Actions.setRecipientSync.Parameters,
  )
}

export declare namespace setRecipientSync {
  export type Parameters<config extends Config = Config> =
    ChainIdParameter<config> &
      ConnectorParameter &
      Omit<
        viem_Actions.setRecipientSync.Parameters<undefined, Account>,
        'chain'
      >

  export type ReturnValue = viem_Actions.setRecipientSync.ReturnValue

  export type ErrorType = viem_Actions.setRecipientSync.ErrorType
}

/**
 * Starts a new reward stream that distributes tokens to opted-in holders.
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
): Promise<viem_Actions.start.ReturnValue> {
  const { account, chainId, connector } = parameters

  const client = await getConnectorClient(config, {
    account,
    assertChainId: false,
    chainId,
    connector,
  })

  return viem_Actions.start(client, parameters as viem_Actions.start.Parameters)
}

export declare namespace start {
  export type Parameters<config extends Config = Config> =
    ChainIdParameter<config> &
      ConnectorParameter &
      Omit<viem_Actions.start.Parameters<undefined, Account>, 'chain'>

  export type ReturnValue = viem_Actions.start.ReturnValue

  export type ErrorType = viem_Actions.start.ErrorType
}

/**
 * Starts a new reward stream that distributes tokens to opted-in holders and waits for confirmation.
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
): Promise<viem_Actions.startSync.ReturnValue> {
  const { account, chainId, connector } = parameters

  const client = await getConnectorClient(config, {
    account,
    assertChainId: false,
    chainId,
    connector,
  })

  return viem_Actions.startSync(
    client,
    parameters as viem_Actions.startSync.Parameters,
  )
}

export declare namespace startSync {
  export type Parameters<config extends Config = Config> =
    ChainIdParameter<config> &
      ConnectorParameter &
      Omit<viem_Actions.startSync.Parameters<undefined, Account>, 'chain'>

  export type ReturnValue = viem_Actions.startSync.ReturnValue

  export type ErrorType = viem_Actions.startSync.ErrorType
}
