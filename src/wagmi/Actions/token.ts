import type * as Query from '@tanstack/query-core'
import { type Config, getConnectorClient } from '@wagmi/core'
import type { ChainIdParameter, ConnectorParameter } from '@wagmi/core/internal'
import type { Account } from 'viem'
import type { RequiredBy, UnionOmit } from '../../internal/types.js'
import * as viem_Actions from '../../viem/Actions/token.js'

/**
 * Approves a spender to transfer TIP20 tokens on behalf of the caller.
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
 * const hash = await Actions.token.approve(config, {
 *   spender: '0x...',
 *   amount: 100n,
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns Transaction hash.
 */
export async function approve<config extends Config>(
  config: config,
  parameters: approve.Parameters<config>,
): Promise<viem_Actions.approve.ReturnValue> {
  const { account, chainId, connector } = parameters

  const client = await getConnectorClient(config, {
    account,
    assertChainId: false,
    chainId,
    connector,
  })

  return viem_Actions.approve(client, parameters as never)
}

export declare namespace approve {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    ConnectorParameter &
    UnionOmit<
      viem_Actions.approve.Parameters<config['chains'][number], Account>,
      'chain'
    >

  export type ReturnValue = viem_Actions.approve.ReturnValue

  export type ErrorType = viem_Actions.approve.ErrorType
}

/**
 * Approves a spender to transfer TIP20 tokens on behalf of the caller.
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
 * const result = await Actions.token.approveSync(config, {
 *   spender: '0x...',
 *   amount: 100n,
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns The transaction receipt and event data.
 */
export async function approveSync<config extends Config>(
  config: config,
  parameters: approveSync.Parameters<config>,
): Promise<viem_Actions.approveSync.ReturnValue> {
  const { account, chainId, connector } = parameters

  const client = await getConnectorClient(config, {
    account,
    assertChainId: false,
    chainId,
    connector,
  })

  return viem_Actions.approveSync(client, parameters as never)
}

export declare namespace approveSync {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    ConnectorParameter &
    UnionOmit<
      viem_Actions.approveSync.Parameters<config['chains'][number], Account>,
      'chain'
    >

  export type ReturnValue = viem_Actions.approveSync.ReturnValue

  export type ErrorType = viem_Actions.approveSync.ErrorType
}

/**
 * Burns TIP20 tokens from the caller's balance.
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
 * const hash = await Actions.token.burn(config, {
 *   amount: 100n,
 *   token: '0x...',
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns Transaction hash.
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

  export type ErrorType = viem_Actions.burn.ErrorType
}

/**
 * Burns TIP20 tokens from a blocked address.
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
 * const hash = await Actions.token.burnBlocked(config, {
 *   from: '0x...',
 *   amount: 100n,
 *   token: '0x...',
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns Transaction hash.
 */
export async function burnBlocked<config extends Config>(
  config: config,
  parameters: burnBlocked.Parameters<config>,
): Promise<viem_Actions.burnBlocked.ReturnValue> {
  const { account, chainId, connector } = parameters

  const client = await getConnectorClient(config, {
    account,
    assertChainId: false,
    chainId,
    connector,
  })

  return await viem_Actions.burnBlocked(client, parameters as never)
}

export declare namespace burnBlocked {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    ConnectorParameter &
    UnionOmit<
      viem_Actions.burnBlocked.Parameters<config['chains'][number], Account>,
      'chain'
    >

  export type ReturnValue = viem_Actions.burnBlocked.ReturnValue

  export type ErrorType = viem_Actions.burnBlocked.ErrorType
}

/**
 * Burns TIP20 tokens from a blocked address.
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
 * const result = await Actions.token.burnBlockedSync(config, {
 *   from: '0x...',
 *   amount: 100n,
 *   token: '0x...',
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns The transaction receipt and event data.
 */
export async function burnBlockedSync<config extends Config>(
  config: config,
  parameters: burnBlockedSync.Parameters<config>,
): Promise<viem_Actions.burnBlockedSync.ReturnValue> {
  const { account, chainId, connector } = parameters

  const client = await getConnectorClient(config, {
    account,
    assertChainId: false,
    chainId,
    connector,
  })

  return viem_Actions.burnBlockedSync(client, parameters as never)
}

export declare namespace burnBlockedSync {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    ConnectorParameter &
    UnionOmit<
      viem_Actions.burnBlockedSync.Parameters<
        config['chains'][number],
        Account
      >,
      'chain'
    >

  export type ReturnValue = viem_Actions.burnBlockedSync.ReturnValue

  export type ErrorType = viem_Actions.burnBlockedSync.ErrorType
}

/**
 * Burns TIP20 tokens from the caller's balance.
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
 * const result = await Actions.token.burnSync(config, {
 *   amount: 100n,
 *   token: '0x...',
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

  export type ErrorType = viem_Actions.burnSync.ErrorType
}

/**
 * Changes the transfer policy ID for a TIP20 token.
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
 * const hash = await Actions.token.changeTransferPolicy(config, {
 *   token: '0x...',
 *   policyId: 1n,
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns Transaction hash.
 */
export async function changeTransferPolicy<config extends Config>(
  config: config,
  parameters: changeTransferPolicy.Parameters<config>,
): Promise<viem_Actions.changeTransferPolicy.ReturnValue> {
  const { account, chainId, connector } = parameters

  const client = await getConnectorClient(config, {
    account,
    assertChainId: false,
    chainId,
    connector,
  })

  return viem_Actions.changeTransferPolicy(client, parameters as never)
}

export declare namespace changeTransferPolicy {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    ConnectorParameter &
    UnionOmit<
      viem_Actions.changeTransferPolicy.Parameters<
        config['chains'][number],
        Account
      >,
      'chain'
    >

  export type ReturnValue = viem_Actions.changeTransferPolicy.ReturnValue

  export type ErrorType = viem_Actions.changeTransferPolicy.ErrorType
}

/**
 * Changes the transfer policy ID for a TIP20 token.
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
 * const result = await Actions.token.changeTransferPolicySync(config, {
 *   token: '0x...',
 *   policyId: 1n,
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns The transaction receipt and event data.
 */
export async function changeTransferPolicySync<config extends Config>(
  config: config,
  parameters: changeTransferPolicySync.Parameters<config>,
): Promise<viem_Actions.changeTransferPolicySync.ReturnValue> {
  const { account, chainId, connector } = parameters

  const client = await getConnectorClient(config, {
    account,
    assertChainId: false,
    chainId,
    connector,
  })

  return viem_Actions.changeTransferPolicySync(client, parameters as never)
}

export declare namespace changeTransferPolicySync {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    ConnectorParameter &
    UnionOmit<
      viem_Actions.changeTransferPolicySync.Parameters<
        config['chains'][number],
        Account
      >,
      'chain'
    >

  export type ReturnValue = viem_Actions.changeTransferPolicySync.ReturnValue

  export type ErrorType = viem_Actions.changeTransferPolicySync.ErrorType
}

/**
 * Creates a new TIP20 token.
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
 * const hash = await Actions.token.create(config, {
 *   name: 'My Token',
 *   symbol: 'MTK',
 *   currency: 'USD',
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
      'chain'
    >

  export type ReturnValue = viem_Actions.create.ReturnValue

  export type ErrorType = viem_Actions.create.ErrorType
}

/**
 * Creates a new TIP20 token.
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
 * const result = await Actions.token.createSync(config, {
 *   name: 'My Token',
 *   symbol: 'MTK',
 *   currency: 'USD',
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
      'chain'
    >

  export type ReturnValue = viem_Actions.createSync.ReturnValue

  export type ErrorType = viem_Actions.createSync.ErrorType
}

/**
 * Updates the quote token for a TIP20 token.
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
 * const hash = await Actions.token.updateQuoteToken(config, {
 *   token: '0x...',
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns Transaction hash.
 */
export async function updateQuoteToken<config extends Config>(
  config: config,
  parameters: updateQuoteToken.Parameters<config>,
): Promise<viem_Actions.updateQuoteToken.ReturnValue> {
  const { account, chainId, connector } = parameters

  const client = await getConnectorClient(config, {
    account,
    assertChainId: false,
    chainId,
    connector,
  })

  return viem_Actions.updateQuoteToken(client, parameters as never)
}

export declare namespace updateQuoteToken {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    ConnectorParameter &
    UnionOmit<
      viem_Actions.updateQuoteToken.Parameters<
        config['chains'][number],
        Account
      >,
      'chain'
    >

  export type ReturnValue = viem_Actions.updateQuoteToken.ReturnValue

  export type ErrorType = viem_Actions.updateQuoteToken.ErrorType
}

/**
 * Updates the quote token for a TIP20 token.
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
 * const result = await Actions.token.updateQuoteTokenSync(config, {
 *   token: '0x...',
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns The transaction receipt and event data.
 */
export async function updateQuoteTokenSync<config extends Config>(
  config: config,
  parameters: updateQuoteTokenSync.Parameters<config>,
): Promise<viem_Actions.updateQuoteTokenSync.ReturnValue> {
  const { account, chainId, connector } = parameters

  const client = await getConnectorClient(config, {
    account,
    assertChainId: false,
    chainId,
    connector,
  })

  return viem_Actions.updateQuoteTokenSync(client, parameters as never)
}

export declare namespace updateQuoteTokenSync {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    ConnectorParameter &
    UnionOmit<
      viem_Actions.updateQuoteTokenSync.Parameters<
        config['chains'][number],
        Account
      >,
      'chain'
    >

  export type ReturnValue = viem_Actions.updateQuoteTokenSync.ReturnValue

  export type ErrorType = viem_Actions.updateQuoteTokenSync.ErrorType
}

/**
 * Gets TIP20 token allowance.
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
 * const allowance = await Actions.token.getAllowance(config, {
 *   account: '0x...',
 *   spender: '0x...',
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns The token allowance.
 */
export function getAllowance<config extends Config>(
  config: config,
  parameters: getAllowance.Parameters<config>,
) {
  const { chainId, ...rest } = parameters
  const client = config.getClient({ chainId })
  return viem_Actions.getAllowance(client, rest)
}

export namespace getAllowance {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    viem_Actions.getAllowance.Parameters

  export type ReturnValue = viem_Actions.getAllowance.ReturnValue

  export function queryKey<config extends Config>(
    parameters: Parameters<config>,
  ) {
    return ['getAllowance', parameters] as const
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
        return await getAllowance(config, parameters)
      },
    }
  }

  export declare namespace queryOptions {
    export type Parameters<
      config extends Config,
      selectData = getAllowance.ReturnValue,
    > = getAllowance.Parameters<config> & {
      query?:
        | UnionOmit<ReturnValue<config, selectData>, 'queryKey' | 'queryFn'>
        | undefined
    }

    export type ReturnValue<
      config extends Config,
      selectData = getAllowance.ReturnValue,
    > = RequiredBy<
      Query.QueryOptions<
        getAllowance.ReturnValue,
        Query.DefaultError,
        selectData,
        getAllowance.QueryKey<config>
      >,
      'queryKey' | 'queryFn'
    >
  }
}

/**
 * Gets TIP20 token balance for an address.
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
 * const balance = await Actions.token.getBalance(config, {
 *   account: '0x...',
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns The token balance.
 */
export function getBalance<config extends Config>(
  config: config,
  parameters: getBalance.Parameters<config>,
) {
  const { chainId, ...rest } = parameters
  const client = config.getClient({ chainId })
  return viem_Actions.getBalance(client, rest as never)
}

export namespace getBalance {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    viem_Actions.getBalance.Parameters

  export type ReturnValue = viem_Actions.getBalance.ReturnValue

  export function queryKey<config extends Config>(
    parameters: Parameters<config>,
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
        const [, parameters] = queryKey
        return (await getBalance(config, parameters)) ?? null
      },
    }
  }

  export declare namespace queryOptions {
    export type Parameters<
      config extends Config,
      selectData = getBalance.ReturnValue,
    > = getBalance.Parameters<config> & {
      query?:
        | UnionOmit<ReturnValue<config, selectData>, 'queryKey' | 'queryFn'>
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
 * Gets TIP20 token metadata.
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
 * const metadata = await Actions.token.getMetadata(config, {
 *   token: '0x...',
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns The token metadata.
 */
export function getMetadata<config extends Config>(
  config: config,
  parameters: getMetadata.Parameters<config>,
) {
  const { chainId, ...rest } = parameters
  const client = config.getClient({ chainId })
  return viem_Actions.getMetadata(client, rest)
}

export namespace getMetadata {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    viem_Actions.getMetadata.Parameters

  export type ReturnValue = viem_Actions.getMetadata.ReturnValue

  export function queryKey<config extends Config>(
    parameters: Parameters<config>,
  ) {
    return ['getMetadata', parameters] as const
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
        return await getMetadata(config, parameters)
      },
    }
  }

  export declare namespace queryOptions {
    export type Parameters<
      config extends Config,
      selectData = getMetadata.ReturnValue,
    > = getMetadata.Parameters<config> & {
      query?:
        | UnionOmit<ReturnValue<config, selectData>, 'queryKey' | 'queryFn'>
        | undefined
    }

    export type ReturnValue<
      config extends Config,
      selectData = getMetadata.ReturnValue,
    > = RequiredBy<
      Query.QueryOptions<
        getMetadata.ReturnValue,
        Query.DefaultError,
        selectData,
        getMetadata.QueryKey<config>
      >,
      'queryKey' | 'queryFn'
    >
  }
}

/**
 * Gets the admin role for a specific role in a TIP20 token.
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
 * const adminRole = await Actions.token.getRoleAdmin(config, {
 *   role: 'minter',
 *   token: '0x...',
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns The admin role hash.
 */
export function getRoleAdmin<config extends Config>(
  config: config,
  parameters: getRoleAdmin.Parameters<config>,
) {
  const { chainId, ...rest } = parameters
  const client = config.getClient({ chainId })
  return viem_Actions.getRoleAdmin(client, rest)
}

export namespace getRoleAdmin {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    viem_Actions.getRoleAdmin.Parameters

  export type ReturnValue = viem_Actions.getRoleAdmin.ReturnValue

  export function queryKey<config extends Config>(
    parameters: Parameters<config>,
  ) {
    return ['getRoleAdmin', parameters] as const
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
        return await getRoleAdmin(config, parameters)
      },
    }
  }

  export declare namespace queryOptions {
    export type Parameters<
      config extends Config,
      selectData = getRoleAdmin.ReturnValue,
    > = getRoleAdmin.Parameters<config> & {
      query?:
        | UnionOmit<ReturnValue<config, selectData>, 'queryKey' | 'queryFn'>
        | undefined
    }

    export type ReturnValue<
      config extends Config,
      selectData = getRoleAdmin.ReturnValue,
    > = RequiredBy<
      Query.QueryOptions<
        getRoleAdmin.ReturnValue,
        Query.DefaultError,
        selectData,
        getRoleAdmin.QueryKey<config>
      >,
      'queryKey' | 'queryFn'
    >
  }
}

/**
 * Grants a role for a TIP20 token.
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
 * const hash = await Actions.token.grantRoles(config, {
 *   token: '0x...',
 *   to: '0x...',
 *   roles: ['issuer'],
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns Transaction hash.
 */
export async function grantRoles<config extends Config>(
  config: config,
  parameters: grantRoles.Parameters<config>,
): Promise<viem_Actions.grantRoles.ReturnValue> {
  const { account, chainId, connector } = parameters

  const client = await getConnectorClient(config, {
    account,
    assertChainId: false,
    chainId,
    connector,
  })

  return viem_Actions.grantRoles(client, parameters as never)
}

export declare namespace grantRoles {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    ConnectorParameter &
    UnionOmit<
      viem_Actions.grantRoles.Parameters<config['chains'][number], Account>,
      'chain'
    >

  export type ReturnValue = viem_Actions.grantRoles.ReturnValue

  export type ErrorType = viem_Actions.grantRoles.ErrorType
}

/**
 * Grants a role for a TIP20 token.
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
 * const result = await Actions.token.grantRolesSync(config, {
 *   token: '0x...',
 *   to: '0x...',
 *   roles: ['issuer'],
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns The transaction receipt and event data.
 */
export async function grantRolesSync<config extends Config>(
  config: config,
  parameters: grantRolesSync.Parameters<config>,
): Promise<viem_Actions.grantRolesSync.ReturnValue> {
  const { account, chainId, connector } = parameters

  const client = await getConnectorClient(config, {
    account,
    assertChainId: false,
    chainId,
    connector,
  })

  return viem_Actions.grantRolesSync(client, parameters as never)
}

export declare namespace grantRolesSync {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    ConnectorParameter &
    UnionOmit<
      viem_Actions.grantRolesSync.Parameters<config['chains'][number], Account>,
      'chain'
    >

  export type ReturnValue = viem_Actions.grantRolesSync.ReturnValue

  export type ErrorType = viem_Actions.grantRolesSync.ErrorType
}

/**
 * Checks if an account has a specific role for a TIP20 token.
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
 * const hasRole = await Actions.token.hasRole(config, {
 *   account: '0x...',
 *   role: 'issuer',
 *   token: '0x...',
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns Whether the account has the role.
 */
export function hasRole<config extends Config>(
  config: config,
  parameters: hasRole.Parameters<config>,
) {
  const { chainId, ...rest } = parameters
  const client = config.getClient({ chainId })
  return viem_Actions.hasRole(client, rest)
}

export namespace hasRole {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    viem_Actions.hasRole.Parameters

  export type ReturnValue = viem_Actions.hasRole.ReturnValue

  export function queryKey<config extends Config>(
    parameters: Parameters<config>,
  ) {
    return ['hasRole', parameters] as const
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
        return await hasRole(config, parameters)
      },
    }
  }

  export declare namespace queryOptions {
    export type Parameters<
      config extends Config,
      selectData = hasRole.ReturnValue,
    > = hasRole.Parameters<config> & {
      query?:
        | UnionOmit<ReturnValue<config, selectData>, 'queryKey' | 'queryFn'>
        | undefined
    }

    export type ReturnValue<
      config extends Config,
      selectData = hasRole.ReturnValue,
    > = RequiredBy<
      Query.QueryOptions<
        hasRole.ReturnValue,
        Query.DefaultError,
        selectData,
        hasRole.QueryKey<config>
      >,
      'queryKey' | 'queryFn'
    >
  }
}

/**
 * Mints TIP20 tokens to an address.
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
 * const hash = await Actions.token.mint(config, {
 *   to: '0x...',
 *   amount: 100n,
 *   token: '0x...',
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns Transaction hash.
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

  export type ErrorType = viem_Actions.mint.ErrorType
}

/**
 * Mints TIP20 tokens to an address.
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
 * const result = await Actions.token.mintSync(config, {
 *   to: '0x...',
 *   amount: 100n,
 *   token: '0x...',
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

  export type ErrorType = viem_Actions.mintSync.ErrorType
}

/**
 * Pauses a TIP20 token.
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
 * const hash = await Actions.token.pause(config, {
 *   token: '0x...',
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns Transaction hash.
 */
export async function pause<config extends Config>(
  config: config,
  parameters: pause.Parameters<config>,
): Promise<viem_Actions.pause.ReturnValue> {
  const { account, chainId, connector } = parameters

  const client = await getConnectorClient(config, {
    account,
    assertChainId: false,
    chainId,
    connector,
  })

  return viem_Actions.pause(client, parameters as never)
}

export declare namespace pause {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    ConnectorParameter &
    UnionOmit<
      viem_Actions.pause.Parameters<config['chains'][number], Account>,
      'chain'
    >

  export type ReturnValue = viem_Actions.pause.ReturnValue

  export type ErrorType = viem_Actions.pause.ErrorType
}

/**
 * Pauses a TIP20 token.
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
 * const result = await Actions.token.pauseSync(config, {
 *   token: '0x...',
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns The transaction receipt and event data.
 */
export async function pauseSync<config extends Config>(
  config: config,
  parameters: pauseSync.Parameters<config>,
): Promise<viem_Actions.pauseSync.ReturnValue> {
  const { account, chainId, connector } = parameters

  const client = await getConnectorClient(config, {
    account,
    assertChainId: false,
    chainId,
    connector,
  })

  return viem_Actions.pauseSync(client, parameters as never)
}

export declare namespace pauseSync {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    ConnectorParameter &
    UnionOmit<
      viem_Actions.pauseSync.Parameters<config['chains'][number], Account>,
      'chain'
    >

  export type ReturnValue = viem_Actions.pauseSync.ReturnValue

  export type ErrorType = viem_Actions.pauseSync.ErrorType
}

/**
 * Renounces a role for a TIP20 token.
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
 * const hash = await Actions.token.renounceRoles(config, {
 *   token: '0x...',
 *   roles: ['issuer'],
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns Transaction hash.
 */
export async function renounceRoles<config extends Config>(
  config: config,
  parameters: renounceRoles.Parameters<config>,
): Promise<viem_Actions.renounceRoles.ReturnValue> {
  const { account, chainId, connector } = parameters

  const client = await getConnectorClient(config, {
    account,
    assertChainId: false,
    chainId,
    connector,
  })

  return viem_Actions.renounceRoles(client, parameters as never)
}

export declare namespace renounceRoles {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    ConnectorParameter &
    UnionOmit<
      viem_Actions.renounceRoles.Parameters<config['chains'][number], Account>,
      'chain'
    >

  export type ReturnValue = viem_Actions.renounceRoles.ReturnValue

  export type ErrorType = viem_Actions.renounceRoles.ErrorType
}

/**
 * Renounces a role for a TIP20 token.
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
 * const result = await Actions.token.renounceRolesSync(config, {
 *   token: '0x...',
 *   roles: ['issuer'],
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns The transaction receipt and event data.
 */
export async function renounceRolesSync<config extends Config>(
  config: config,
  parameters: renounceRolesSync.Parameters<config>,
): Promise<viem_Actions.renounceRolesSync.ReturnValue> {
  const { account, chainId, connector } = parameters

  const client = await getConnectorClient(config, {
    account,
    assertChainId: false,
    chainId,
    connector,
  })

  return viem_Actions.renounceRolesSync(client, parameters as never)
}

export declare namespace renounceRolesSync {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    ConnectorParameter &
    UnionOmit<
      viem_Actions.renounceRolesSync.Parameters<
        config['chains'][number],
        Account
      >,
      'chain'
    >

  export type ReturnValue = viem_Actions.renounceRolesSync.ReturnValue

  export type ErrorType = viem_Actions.renounceRolesSync.ErrorType
}

/**
 * Revokes a role for a TIP20 token.
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
 * const hash = await Actions.token.revokeRoles(config, {
 *   token: '0x...',
 *   from: '0x...',
 *   roles: ['issuer'],
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns Transaction hash.
 */
export async function revokeRoles<config extends Config>(
  config: config,
  parameters: revokeRoles.Parameters<config>,
): Promise<viem_Actions.revokeRoles.ReturnValue> {
  const { account, chainId, connector } = parameters

  const client = await getConnectorClient(config, {
    account,
    assertChainId: false,
    chainId,
    connector,
  })

  return viem_Actions.revokeRoles(client, parameters as never)
}

export declare namespace revokeRoles {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    ConnectorParameter &
    UnionOmit<
      viem_Actions.revokeRoles.Parameters<config['chains'][number], Account>,
      'chain'
    >

  export type ReturnValue = viem_Actions.revokeRoles.ReturnValue

  export type ErrorType = viem_Actions.revokeRoles.ErrorType
}

/**
 * Revokes a role for a TIP20 token.
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
 * const result = await Actions.token.revokeRolesSync(config, {
 *   token: '0x...',
 *   from: '0x...',
 *   roles: ['issuer'],
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns The transaction receipt and event data.
 */
export async function revokeRolesSync<config extends Config>(
  config: config,
  parameters: revokeRolesSync.Parameters<config>,
): Promise<viem_Actions.revokeRolesSync.ReturnValue> {
  const { account, chainId, connector } = parameters

  const client = await getConnectorClient(config, {
    account,
    assertChainId: false,
    chainId,
    connector,
  })

  return viem_Actions.revokeRolesSync(client, parameters as never)
}

export declare namespace revokeRolesSync {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    ConnectorParameter &
    UnionOmit<
      viem_Actions.revokeRolesSync.Parameters<
        config['chains'][number],
        Account
      >,
      'chain'
    >

  export type ReturnValue = viem_Actions.revokeRolesSync.ReturnValue

  export type ErrorType = viem_Actions.revokeRolesSync.ErrorType
}

/**
 * Sets the admin role for a specific role in a TIP20 token.
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
 * const hash = await Actions.token.setRoleAdmin(config, {
 *   token: '0x...',
 *   role: 'issuer',
 *   adminRole: 'pause',
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns Transaction hash.
 */
export async function setRoleAdmin<config extends Config>(
  config: config,
  parameters: setRoleAdmin.Parameters<config>,
): Promise<viem_Actions.setRoleAdmin.ReturnValue> {
  const { account, chainId, connector } = parameters

  const client = await getConnectorClient(config, {
    account,
    assertChainId: false,
    chainId,
    connector,
  })

  return viem_Actions.setRoleAdmin(client, parameters as never)
}

export declare namespace setRoleAdmin {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    ConnectorParameter &
    UnionOmit<
      viem_Actions.setRoleAdmin.Parameters<config['chains'][number], Account>,
      'chain'
    >

  export type ReturnValue = viem_Actions.setRoleAdmin.ReturnValue

  export type ErrorType = viem_Actions.setRoleAdmin.ErrorType
}

/**
 * Sets the admin role for a specific role in a TIP20 token.
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
 * const result = await Actions.token.setRoleAdminSync(config, {
 *   token: '0x...',
 *   role: 'issuer',
 *   adminRole: 'pause',
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns The transaction receipt and event data.
 */
export async function setRoleAdminSync<config extends Config>(
  config: config,
  parameters: setRoleAdminSync.Parameters<config>,
): Promise<viem_Actions.setRoleAdminSync.ReturnValue> {
  const { account, chainId, connector } = parameters

  const client = await getConnectorClient(config, {
    account,
    assertChainId: false,
    chainId,
    connector,
  })

  return viem_Actions.setRoleAdminSync(client, parameters as never)
}

export declare namespace setRoleAdminSync {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    ConnectorParameter &
    UnionOmit<
      viem_Actions.setRoleAdminSync.Parameters<
        config['chains'][number],
        Account
      >,
      'chain'
    >

  export type ReturnValue = viem_Actions.setRoleAdminSync.ReturnValue

  export type ErrorType = viem_Actions.setRoleAdminSync.ErrorType
}

/**
 * Sets the supply cap for a TIP20 token.
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
 * const hash = await Actions.token.setSupplyCap(config, {
 *   token: '0x...',
 *   supplyCap: 1000000n,
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns Transaction hash.
 */
export async function setSupplyCap<config extends Config>(
  config: config,
  parameters: setSupplyCap.Parameters<config>,
): Promise<viem_Actions.setSupplyCap.ReturnValue> {
  const { account, chainId, connector } = parameters

  const client = await getConnectorClient(config, {
    account,
    assertChainId: false,
    chainId,
    connector,
  })

  return viem_Actions.setSupplyCap(client, parameters as never)
}

export declare namespace setSupplyCap {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    ConnectorParameter &
    UnionOmit<
      viem_Actions.setSupplyCap.Parameters<config['chains'][number], Account>,
      'chain'
    >

  export type ReturnValue = viem_Actions.setSupplyCap.ReturnValue

  export type ErrorType = viem_Actions.setSupplyCap.ErrorType
}

/**
 * Sets the supply cap for a TIP20 token.
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
 * const result = await Actions.token.setSupplyCapSync(config, {
 *   token: '0x...',
 *   supplyCap: 1000000n,
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns The transaction receipt and event data.
 */
export async function setSupplyCapSync<config extends Config>(
  config: config,
  parameters: setSupplyCapSync.Parameters<config>,
): Promise<viem_Actions.setSupplyCapSync.ReturnValue> {
  const { account, chainId, connector } = parameters

  const client = await getConnectorClient(config, {
    account,
    assertChainId: false,
    chainId,
    connector,
  })

  return viem_Actions.setSupplyCapSync(client, parameters as never)
}

export declare namespace setSupplyCapSync {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    ConnectorParameter &
    UnionOmit<
      viem_Actions.setSupplyCapSync.Parameters<
        config['chains'][number],
        Account
      >,
      'chain'
    >

  export type ReturnValue = viem_Actions.setSupplyCapSync.ReturnValue

  export type ErrorType = viem_Actions.setSupplyCapSync.ErrorType
}

/**
 * Transfers TIP20 tokens to another address.
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
 * const hash = await Actions.token.transfer(config, {
 *   to: '0x...',
 *   amount: 100n,
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns Transaction hash.
 */
export async function transfer<config extends Config>(
  config: config,
  parameters: transfer.Parameters<config>,
): Promise<viem_Actions.transfer.ReturnValue> {
  const { account, chainId, connector } = parameters

  const client = await getConnectorClient(config, {
    account,
    assertChainId: false,
    chainId,
    connector,
  })

  return viem_Actions.transfer(client, parameters as never)
}

export declare namespace transfer {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    ConnectorParameter &
    UnionOmit<
      viem_Actions.transfer.Parameters<config['chains'][number], Account>,
      'chain'
    >

  export type ReturnValue = viem_Actions.transfer.ReturnValue

  export type ErrorType = viem_Actions.transfer.ErrorType
}

/**
 * Transfers TIP20 tokens to another address.
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
 * const result = await Actions.token.transferSync(config, {
 *   to: '0x...',
 *   amount: 100n,
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns The transaction receipt and event data.
 */
export async function transferSync<config extends Config>(
  config: config,
  parameters: transferSync.Parameters<config>,
): Promise<viem_Actions.transferSync.ReturnValue> {
  const { account, chainId, connector } = parameters

  const client = await getConnectorClient(config, {
    account,
    assertChainId: false,
    chainId,
    connector,
  })

  return viem_Actions.transferSync(client, parameters as never)
}

export declare namespace transferSync {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    ConnectorParameter &
    UnionOmit<
      viem_Actions.transferSync.Parameters<config['chains'][number], Account>,
      'chain'
    >

  export type ReturnValue = viem_Actions.transferSync.ReturnValue

  export type ErrorType = viem_Actions.transferSync.ErrorType
}

/**
 * Unpauses a TIP20 token.
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
 * const hash = await Actions.token.unpause(config, {
 *   token: '0x...',
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns Transaction hash.
 */
export async function unpause<config extends Config>(
  config: config,
  parameters: unpause.Parameters<config>,
): Promise<viem_Actions.unpause.ReturnValue> {
  const { account, chainId, connector } = parameters

  const client = await getConnectorClient(config, {
    account,
    assertChainId: false,
    chainId,
    connector,
  })

  return viem_Actions.unpause(client, parameters as never)
}

export declare namespace unpause {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    ConnectorParameter &
    UnionOmit<
      viem_Actions.unpause.Parameters<config['chains'][number], Account>,
      'chain'
    >

  export type ReturnValue = viem_Actions.unpause.ReturnValue

  export type ErrorType = viem_Actions.unpause.ErrorType
}

/**
 * Unpauses a TIP20 token.
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
 * const result = await Actions.token.unpauseSync(config, {
 *   token: '0x...',
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns The transaction receipt and event data.
 */
export async function unpauseSync<config extends Config>(
  config: config,
  parameters: unpauseSync.Parameters<config>,
): Promise<viem_Actions.unpauseSync.ReturnValue> {
  const { account, chainId, connector } = parameters

  const client = await getConnectorClient(config, {
    account,
    assertChainId: false,
    chainId,
    connector,
  })

  return viem_Actions.unpauseSync(client, parameters as never)
}

export declare namespace unpauseSync {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    ConnectorParameter &
    UnionOmit<
      viem_Actions.unpauseSync.Parameters<config['chains'][number], Account>,
      'chain'
    >

  export type ReturnValue = viem_Actions.unpauseSync.ReturnValue

  export type ErrorType = viem_Actions.unpauseSync.ErrorType
}

/**
 * Prepares the quote token update for a TIP20 token.
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
 * const hash = await Actions.token.prepareUpdateQuoteToken(config, {
 *   token: '0x...',
 *   quoteToken: '0x...',
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns Transaction hash.
 */
export async function prepareUpdateQuoteToken<config extends Config>(
  config: config,
  parameters: prepareUpdateQuoteToken.Parameters<config>,
): Promise<viem_Actions.prepareUpdateQuoteToken.ReturnValue> {
  const { account, chainId, connector } = parameters

  const client = await getConnectorClient(config, {
    account,
    assertChainId: false,
    chainId,
    connector,
  })

  return viem_Actions.prepareUpdateQuoteToken(client, parameters as never)
}

export declare namespace prepareUpdateQuoteToken {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    ConnectorParameter &
    UnionOmit<
      viem_Actions.prepareUpdateQuoteToken.Parameters<
        config['chains'][number],
        Account
      >,
      'chain'
    >

  export type ReturnValue = viem_Actions.prepareUpdateQuoteToken.ReturnValue

  export type ErrorType = viem_Actions.prepareUpdateQuoteToken.ErrorType
}

/**
 * Prepares the quote token update for a TIP20 token.
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
 * const result = await Actions.token.prepareUpdateQuoteTokenSync(config, {
 *   token: '0x...',
 *   quoteToken: '0x...',
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns The transaction receipt and event data.
 */
export async function prepareUpdateQuoteTokenSync<config extends Config>(
  config: config,
  parameters: prepareUpdateQuoteTokenSync.Parameters<config>,
): Promise<viem_Actions.prepareUpdateQuoteTokenSync.ReturnValue> {
  const { account, chainId, connector } = parameters

  const client = await getConnectorClient(config, {
    account,
    assertChainId: false,
    chainId,
    connector,
  })

  return viem_Actions.prepareUpdateQuoteTokenSync(client, parameters as never)
}

export declare namespace prepareUpdateQuoteTokenSync {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    ConnectorParameter &
    UnionOmit<
      viem_Actions.prepareUpdateQuoteTokenSync.Parameters<
        config['chains'][number],
        Account
      >,
      'chain'
    >

  export type ReturnValue = viem_Actions.prepareUpdateQuoteTokenSync.ReturnValue

  export type ErrorType = viem_Actions.prepareUpdateQuoteTokenSync.ErrorType
}

/**
 * Watches for TIP20 token role admin updates.
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
 * const unwatch = Actions.token.watchAdminRole(config, {
 *   onRoleAdminUpdated: (args, log) => {
 *     console.log('Role admin updated:', args)
 *   },
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns A function to unsubscribe from the event.
 */
export function watchAdminRole<config extends Config>(
  config: config,
  parameters: watchAdminRole.Parameters<config>,
) {
  const { chainId, ...rest } = parameters
  const client = config.getClient({ chainId })
  return viem_Actions.watchAdminRole(client, rest)
}

export declare namespace watchAdminRole {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    viem_Actions.watchAdminRole.Parameters
}

/**
 * Watches for TIP20 token approval events.
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
 * const unwatch = Actions.token.watchApprove(config, {
 *   onApproval: (args, log) => {
 *     console.log('Approval:', args)
 *   },
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns A function to unsubscribe from the event.
 */
export function watchApprove<config extends Config>(
  config: config,
  parameters: watchApprove.Parameters<config>,
) {
  const { chainId, ...rest } = parameters
  const client = config.getClient({ chainId })
  return viem_Actions.watchApprove(client, rest)
}

export declare namespace watchApprove {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    viem_Actions.watchApprove.Parameters
}

/**
 * Watches for TIP20 token burn events.
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
 * const unwatch = Actions.token.watchBurn(config, {
 *   onBurn: (args, log) => {
 *     console.log('Burn:', args)
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

/**
 * Watches for new TIP20 tokens created.
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
 * const unwatch = Actions.token.watchCreate(config, {
 *   onTokenCreated: (args, log) => {
 *     console.log('Token created:', args)
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
 * Watches for TIP20 token mint events.
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
 * const unwatch = Actions.token.watchMint(config, {
 *   onMint: (args, log) => {
 *     console.log('Mint:', args)
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

  export type ReturnValue = viem_Actions.watchMint.ReturnValue
}

/**
 * Watches for TIP20 token role membership updates.
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
 * const unwatch = Actions.token.watchRole(config, {
 *   onRoleUpdated: (args, log) => {
 *     console.log('Role updated:', args)
 *   },
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns A function to unsubscribe from the event.
 */
export function watchRole<config extends Config>(
  config: config,
  parameters: watchRole.Parameters<config>,
) {
  const { chainId, ...rest } = parameters
  const client = config.getClient({ chainId })
  return viem_Actions.watchRole(client, rest)
}

export declare namespace watchRole {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    viem_Actions.watchRole.Parameters
}

/**
 * Watches for TIP20 token transfer events.
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
 * const unwatch = Actions.token.watchTransfer(config, {
 *   onTransfer: (args, log) => {
 *     console.log('Transfer:', args)
 *   },
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns A function to unsubscribe from the event.
 */
export function watchTransfer<config extends Config>(
  config: config,
  parameters: watchTransfer.Parameters<config>,
) {
  const { chainId, ...rest } = parameters
  const client = config.getClient({ chainId })
  return viem_Actions.watchTransfer(client, rest)
}

export declare namespace watchTransfer {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    viem_Actions.watchTransfer.Parameters
}

/**
 * Watches for TIP20 token quote token update events.
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
 * const unwatch = Actions.token.watchUpdateQuoteToken(config, {
 *   onUpdateQuoteToken: (args, log) => {
 *     if (args.completed)
 *       console.log('quote token update completed:', args.newQuoteToken)
 *     else
 *       console.log('quote token update proposed:', args.newQuoteToken)
 *   },
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns A function to unsubscribe from the event.
 */
export function watchUpdateQuoteToken<config extends Config>(
  config: config,
  parameters: watchUpdateQuoteToken.Parameters<config>,
) {
  const { chainId, ...rest } = parameters
  const client = config.getClient({ chainId })
  return viem_Actions.watchUpdateQuoteToken(client, rest)
}

export declare namespace watchUpdateQuoteToken {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    viem_Actions.watchUpdateQuoteToken.Parameters
}
