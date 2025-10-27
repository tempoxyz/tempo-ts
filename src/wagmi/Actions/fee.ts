import type * as Query from '@tanstack/query-core'
import { type Config, getConnectorClient } from '@wagmi/core'
import type { ChainIdParameter, ConnectorParameter } from '@wagmi/core/internal'
import type { Account } from 'viem'
import type { RequiredBy } from '../../internal/types.js'
import * as viem_Actions from '../../viem/Actions/fee.js'

/**
 * Gets the user's default fee token.
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
 * const hash = await Actions.fee.getUserToken(config, {
 *   account: '0x20c...0055',
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns Transaction hash.
 */
export function getUserToken<config extends Config>(
  config: config,
  parameters: getUserToken.Parameters<config>,
) {
  const { chainId, ...rest } = parameters
  const client = config.getClient({ chainId })
  return viem_Actions.getUserToken(client, rest)
}

export namespace getUserToken {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    viem_Actions.getUserToken.Parameters

  export type ReturnValue = viem_Actions.getUserToken.ReturnValue

  export function queryKey<config extends Config>(
    parameters: Parameters<config>,
  ) {
    return ['getUserToken', parameters] as const
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
        return await getUserToken(config, parameters)
      },
    }
  }

  export declare namespace queryOptions {
    export type Parameters<
      config extends Config,
      selectData = getUserToken.ReturnValue,
    > = getUserToken.Parameters<config> & {
      query?:
        | Omit<ReturnValue<config, selectData>, 'queryKey' | 'queryFn'>
        | undefined
    }

    export type ReturnValue<
      config extends Config,
      selectData = getUserToken.ReturnValue,
    > = RequiredBy<
      Query.QueryOptions<
        getUserToken.ReturnValue,
        Query.DefaultError,
        selectData,
        getUserToken.QueryKey<config>
      >,
      'queryKey' | 'queryFn'
    >
  }
}

/**
 * Sets the user's default fee token.
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
 * const result = await Actions.fee.setUserToken(config, {
 *   token: '0x20c...0055',
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns The transaction receipt and event data.
 */
export async function setUserToken<config extends Config>(
  config: config,
  parameters: setUserToken.Parameters<config>,
): Promise<viem_Actions.setUserToken.ReturnValue> {
  const { account, chainId, connector } = parameters

  const client = await getConnectorClient(config, {
    account,
    assertChainId: false,
    chainId,
    connector,
  })

  return viem_Actions.setUserToken(
    client,
    parameters as viem_Actions.setUserToken.Parameters,
  )
}

export declare namespace setUserToken {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    ConnectorParameter &
    Omit<viem_Actions.setUserToken.Parameters<undefined, Account>, 'chain'>

  export type ReturnValue = viem_Actions.setUserToken.ReturnValue

  export type ErrorType = viem_Actions.setUserToken.ErrorType
}

/**
 * Sets the user's default fee token.
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
 * const result = await Actions.fee.setUserTokenSync(config, {
 *   token: '0x20c...0055',
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns The transaction receipt and event data.
 */
export async function setUserTokenSync<config extends Config>(
  config: config,
  parameters: setUserTokenSync.Parameters<config>,
): Promise<viem_Actions.setUserTokenSync.ReturnValue> {
  const { account, chainId, connector } = parameters

  const client = await getConnectorClient(config, {
    account,
    assertChainId: false,
    chainId,
    connector,
  })

  return viem_Actions.setUserTokenSync(
    client,
    parameters as viem_Actions.setUserTokenSync.Parameters,
  )
}

export declare namespace setUserTokenSync {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    ConnectorParameter &
    Omit<viem_Actions.setUserTokenSync.Parameters<undefined, Account>, 'chain'>

  export type ReturnValue = viem_Actions.setUserTokenSync.ReturnValue

  export type ErrorType = viem_Actions.setUserTokenSync.ErrorType
}
