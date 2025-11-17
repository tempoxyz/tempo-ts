import type * as Query from '@tanstack/query-core'
import { type Config, getConnectorClient } from '@wagmi/core'
import type { ChainIdParameter, ConnectorParameter } from '@wagmi/core/internal'
import type { Account } from 'viem'
import type { RequiredBy, UnionOmit } from '../../internal/types.js'
import * as viem_Actions from '../../viem/Actions/policy.js'

export type { PolicyType } from '../../viem/Actions/policy.js'

/**
 * Creates a new policy.
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
 * const hash = await Actions.policy.create(config, {
 *   type: 'whitelist',
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns Transaction hash.
 */
export async function create<config extends Config>(
  config: config,
  parameters: create.Parameters<config>,
): Promise<viem_Actions.create.ReturnValue> {
  const { account, chainId, connector } = parameters

  const client = await getConnectorClient(config, {
    account,
    assertChainId: false,
    chainId,
    connector,
  })

  return viem_Actions.create(client, parameters as never)
}

export declare namespace create {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    ConnectorParameter &
    UnionOmit<
      viem_Actions.create.Parameters<config['chains'][number], Account>,
      'chain' | 'admin'
    >

  export type ReturnValue = viem_Actions.create.ReturnValue
}

/**
 * Creates a new policy.
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
 *   chains: [tempo({ feeToken: '0x20c0000000000000000000000000000000000001' })],
 *   transports: {
 *     [tempo.id]: http(),
 *   },
 * })
 *
 * const result = await Actions.policy.createSync(config, {
 *   type: 'whitelist',
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns The transaction receipt and event data.
 */
export async function createSync<config extends Config>(
  config: config,
  parameters: createSync.Parameters<config>,
): Promise<viem_Actions.createSync.ReturnValue> {
  const { account, chainId, connector } = parameters

  const client = await getConnectorClient(config, {
    account,
    assertChainId: false,
    chainId,
    connector,
  })

  return viem_Actions.createSync(client, parameters as never)
}

export declare namespace createSync {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    ConnectorParameter &
    UnionOmit<
      viem_Actions.createSync.Parameters<config['chains'][number], Account>,
      'chain' | 'admin'
    >

  export type ReturnValue = viem_Actions.createSync.ReturnValue
}

/**
 * Sets the admin for a policy.
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
 * const hash = await Actions.policy.setAdmin(config, {
 *   policyId: 2n,
 *   admin: '0x...',
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns Transaction hash.
 */
export async function setAdmin<config extends Config>(
  config: config,
  parameters: setAdmin.Parameters<config>,
): Promise<viem_Actions.setAdmin.ReturnValue> {
  const { account, chainId, connector } = parameters

  const client = await getConnectorClient(config, {
    account,
    assertChainId: false,
    chainId,
    connector,
  })

  return viem_Actions.setAdmin(client, parameters as never)
}

export declare namespace setAdmin {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    ConnectorParameter &
    UnionOmit<
      viem_Actions.setAdmin.Parameters<config['chains'][number], Account>,
      'chain'
    >

  export type ReturnValue = viem_Actions.setAdmin.ReturnValue
}

/**
 * Sets the admin for a policy.
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
 *   chains: [tempo({ feeToken: '0x20c0000000000000000000000000000000000001' })],
 *   transports: {
 *     [tempo.id]: http(),
 *   },
 * })
 *
 * const result = await Actions.policy.setAdminSync(config, {
 *   policyId: 2n,
 *   admin: '0x...',
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns The transaction receipt and event data.
 */
export async function setAdminSync<config extends Config>(
  config: config,
  parameters: setAdminSync.Parameters<config>,
): Promise<viem_Actions.setAdminSync.ReturnValue> {
  const { account, chainId, connector } = parameters

  const client = await getConnectorClient(config, {
    account,
    assertChainId: false,
    chainId,
    connector,
  })

  return viem_Actions.setAdminSync(client, parameters as never)
}

export declare namespace setAdminSync {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    ConnectorParameter &
    UnionOmit<
      viem_Actions.setAdminSync.Parameters<config['chains'][number], Account>,
      'chain'
    >

  export type ReturnValue = viem_Actions.setAdminSync.ReturnValue
}

/**
 * Modifies a policy whitelist.
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
 * const hash = await Actions.policy.modifyWhitelist(config, {
 *   policyId: 2n,
 *   address: '0x...',
 *   allowed: true,
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns Transaction hash.
 */
export async function modifyWhitelist<config extends Config>(
  config: config,
  parameters: modifyWhitelist.Parameters<config>,
): Promise<viem_Actions.modifyWhitelist.ReturnValue> {
  const { account, chainId, connector } = parameters

  const client = await getConnectorClient(config, {
    account,
    assertChainId: false,
    chainId,
    connector,
  })

  return viem_Actions.modifyWhitelist(client, parameters as never)
}

export declare namespace modifyWhitelist {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    ConnectorParameter &
    UnionOmit<
      viem_Actions.modifyWhitelist.Parameters<
        config['chains'][number],
        Account
      >,
      'chain'
    >

  export type ReturnValue = viem_Actions.modifyWhitelist.ReturnValue
}

/**
 * Modifies a policy whitelist.
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
 *   chains: [tempo({ feeToken: '0x20c0000000000000000000000000000000000001' })],
 *   transports: {
 *     [tempo.id]: http(),
 *   },
 * })
 *
 * const result = await Actions.policy.modifyWhitelistSync(config, {
 *   policyId: 2n,
 *   address: '0x...',
 *   allowed: true,
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns The transaction receipt and event data.
 */
export async function modifyWhitelistSync<config extends Config>(
  config: config,
  parameters: modifyWhitelistSync.Parameters<config>,
): Promise<viem_Actions.modifyWhitelistSync.ReturnValue> {
  const { account, chainId, connector } = parameters

  const client = await getConnectorClient(config, {
    account,
    assertChainId: false,
    chainId,
    connector,
  })

  return viem_Actions.modifyWhitelistSync(client, parameters as never)
}

export declare namespace modifyWhitelistSync {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    ConnectorParameter &
    UnionOmit<
      viem_Actions.modifyWhitelistSync.Parameters<
        config['chains'][number],
        Account
      >,
      'chain'
    >

  export type ReturnValue = viem_Actions.modifyWhitelistSync.ReturnValue
}

/**
 * Modifies a policy blacklist.
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
 * const hash = await Actions.policy.modifyBlacklist(config, {
 *   policyId: 2n,
 *   address: '0x...',
 *   restricted: true,
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns Transaction hash.
 */
export async function modifyBlacklist<config extends Config>(
  config: config,
  parameters: modifyBlacklist.Parameters<config>,
): Promise<viem_Actions.modifyBlacklist.ReturnValue> {
  const { account, chainId, connector } = parameters

  const client = await getConnectorClient(config, {
    account,
    assertChainId: false,
    chainId,
    connector,
  })

  return viem_Actions.modifyBlacklist(client, parameters as never)
}

export declare namespace modifyBlacklist {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    ConnectorParameter &
    UnionOmit<
      viem_Actions.modifyBlacklist.Parameters<
        config['chains'][number],
        Account
      >,
      'chain'
    >

  export type ReturnValue = viem_Actions.modifyBlacklist.ReturnValue
}

/**
 * Modifies a policy blacklist.
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
 *   chains: [tempo({ feeToken: '0x20c0000000000000000000000000000000000001' })],
 *   transports: {
 *     [tempo.id]: http(),
 *   },
 * })
 *
 * const result = await Actions.policy.modifyBlacklistSync(config, {
 *   policyId: 2n,
 *   address: '0x...',
 *   restricted: true,
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns The transaction receipt and event data.
 */
export async function modifyBlacklistSync<config extends Config>(
  config: config,
  parameters: modifyBlacklistSync.Parameters<config>,
): Promise<viem_Actions.modifyBlacklistSync.ReturnValue> {
  const { account, chainId, connector } = parameters

  const client = await getConnectorClient(config, {
    account,
    assertChainId: false,
    chainId,
    connector,
  })

  return viem_Actions.modifyBlacklistSync(client, parameters as never)
}

export declare namespace modifyBlacklistSync {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    ConnectorParameter &
    UnionOmit<
      viem_Actions.modifyBlacklistSync.Parameters<
        config['chains'][number],
        Account
      >,
      'chain'
    >

  export type ReturnValue = viem_Actions.modifyBlacklistSync.ReturnValue
}

/**
 * Gets policy data.
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
 * const data = await Actions.policy.getData(config, {
 *   policyId: 2n,
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns The policy data.
 */
export function getData<config extends Config>(
  config: config,
  parameters: getData.Parameters<config>,
): Promise<getData.ReturnValue> {
  const { chainId, ...rest } = parameters
  const client = config.getClient({ chainId })
  return viem_Actions.getData(client, rest)
}

export namespace getData {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    viem_Actions.getData.Parameters

  export type ReturnValue = viem_Actions.getData.ReturnValue

  export function queryKey<config extends Config>(
    parameters: Parameters<config>,
  ) {
    return ['getData', parameters] as const
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
        return await getData(config, parameters)
      },
    }
  }

  export declare namespace queryOptions {
    export type Parameters<
      config extends Config,
      selectData = getData.ReturnValue,
    > = getData.Parameters<config> & {
      query?:
        | UnionOmit<ReturnValue<config, selectData>, 'queryKey' | 'queryFn'>
        | undefined
    }

    export type ReturnValue<
      config extends Config,
      selectData = getData.ReturnValue,
    > = RequiredBy<
      Query.QueryOptions<
        getData.ReturnValue,
        Query.DefaultError,
        selectData,
        getData.QueryKey<config>
      >,
      'queryKey' | 'queryFn'
    >
  }
}

/**
 * Checks if a user is authorized by a policy.
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
 * const authorized = await Actions.policy.isAuthorized(config, {
 *   policyId: 2n,
 *   user: '0x...',
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns Whether the user is authorized.
 */
export function isAuthorized<config extends Config>(
  config: config,
  parameters: isAuthorized.Parameters<config>,
): Promise<isAuthorized.ReturnValue> {
  const { chainId, ...rest } = parameters
  const client = config.getClient({ chainId })
  return viem_Actions.isAuthorized(client, rest)
}

export namespace isAuthorized {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    viem_Actions.isAuthorized.Parameters

  export type ReturnValue = viem_Actions.isAuthorized.ReturnValue

  export function queryKey<config extends Config>(
    parameters: Parameters<config>,
  ) {
    return ['isAuthorized', parameters] as const
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
        return await isAuthorized(config, parameters)
      },
    }
  }

  export declare namespace queryOptions {
    export type Parameters<
      config extends Config,
      selectData = isAuthorized.ReturnValue,
    > = isAuthorized.Parameters<config> & {
      query?:
        | UnionOmit<ReturnValue<config, selectData>, 'queryKey' | 'queryFn'>
        | undefined
    }

    export type ReturnValue<
      config extends Config,
      selectData = isAuthorized.ReturnValue,
    > = RequiredBy<
      Query.QueryOptions<
        isAuthorized.ReturnValue,
        Query.DefaultError,
        selectData,
        isAuthorized.QueryKey<config>
      >,
      'queryKey' | 'queryFn'
    >
  }
}

/**
 * Watches for policy creation events.
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
 * const unwatch = Actions.policy.watchCreate(config, {
 *   onPolicyCreated: (args, log) => {
 *     console.log('Policy created:', args)
 *   },
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns A function to unsubscribe from the event.
 */
export function watchCreate<config extends Config>(
  config: config,
  parameters: watchCreate.Parameters<config>,
) {
  const { chainId, ...rest } = parameters
  const client = config.getClient({ chainId })
  return viem_Actions.watchCreate(client, rest)
}

export declare namespace watchCreate {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    viem_Actions.watchCreate.Parameters
}

/**
 * Watches for policy admin update events.
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
 * const unwatch = Actions.policy.watchAdminUpdated(config, {
 *   onAdminUpdated: (args, log) => {
 *     console.log('Policy admin updated:', args)
 *   },
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns A function to unsubscribe from the event.
 */
export function watchAdminUpdated<config extends Config>(
  config: config,
  parameters: watchAdminUpdated.Parameters<config>,
) {
  const { chainId, ...rest } = parameters
  const client = config.getClient({ chainId })
  return viem_Actions.watchAdminUpdated(client, rest)
}

export declare namespace watchAdminUpdated {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    viem_Actions.watchAdminUpdated.Parameters
}

/**
 * Watches for whitelist update events.
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
 * const unwatch = Actions.policy.watchWhitelistUpdated(config, {
 *   onWhitelistUpdated: (args, log) => {
 *     console.log('Whitelist updated:', args)
 *   },
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns A function to unsubscribe from the event.
 */
export function watchWhitelistUpdated<config extends Config>(
  config: config,
  parameters: watchWhitelistUpdated.Parameters<config>,
) {
  const { chainId, ...rest } = parameters
  const client = config.getClient({ chainId })
  return viem_Actions.watchWhitelistUpdated(client, rest)
}

export declare namespace watchWhitelistUpdated {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    viem_Actions.watchWhitelistUpdated.Parameters
}

/**
 * Watches for blacklist update events.
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
 * const unwatch = Actions.policy.watchBlacklistUpdated(config, {
 *   onBlacklistUpdated: (args, log) => {
 *     console.log('Blacklist updated:', args)
 *   },
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns A function to unsubscribe from the event.
 */
export function watchBlacklistUpdated<config extends Config>(
  config: config,
  parameters: watchBlacklistUpdated.Parameters<config>,
) {
  const { chainId, ...rest } = parameters
  const client = config.getClient({ chainId })
  return viem_Actions.watchBlacklistUpdated(client, rest)
}

export declare namespace watchBlacklistUpdated {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    viem_Actions.watchBlacklistUpdated.Parameters
}
