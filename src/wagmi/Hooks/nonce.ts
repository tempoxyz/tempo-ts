import type { DefaultError } from '@tanstack/query-core'
import type { Config, ResolvedRegister } from '@wagmi/core'
import { useEffect } from 'react'
import { useChainId, useConfig } from 'wagmi'
import type { ConfigParameter, QueryParameter } from 'wagmi/internal'
import { type UseQueryReturnType, useQuery } from 'wagmi/query'

import type { ExactPartial, UnionCompute } from '../../internal/types.js'
import {
  getNonce,
  getNonceKeyCount,
  watchActiveKeyCountChanged,
  watchNonceIncremented,
} from '../Actions/nonce.js'

/**
 * Hook for getting the nonce for an account and nonce key.
 *
 * @example
 * ```tsx
 * import { Hooks } from 'tempo.ts/wagmi'
 *
 * function App() {
 *   const { data, isLoading } = Hooks.nonce.useNonce({
 *     account: '0x...',
 *     nonceKey: 1n,
 *   })
 *
 *   if (isLoading) return <div>Loading...</div>
 *   return <div>Nonce: {data?.toString()}</div>
 * }
 * ```
 *
 * @param parameters - Parameters.
 * @returns Query result with nonce value.
 */
export function useNonce<
  config extends Config = ResolvedRegister['config'],
  selectData = getNonce.ReturnValue,
>(parameters: useNonce.Parameters<config, selectData> = {}) {
  const { account, nonceKey, query = {} } = parameters

  const config = useConfig(parameters)
  const chainId = useChainId({ config })

  const options = getNonce.queryOptions(config, {
    ...parameters,
    chainId: parameters.chainId ?? chainId,
    query: undefined,
  })
  const enabled = Boolean(
    account && nonceKey !== undefined && (query.enabled ?? true),
  )

  return useQuery({ ...query, ...options, enabled })
}

export declare namespace useNonce {
  export type Parameters<
    config extends Config = ResolvedRegister['config'],
    selectData = getNonce.ReturnValue,
  > = ConfigParameter<config> &
    QueryParameter<
      getNonce.ReturnValue,
      DefaultError,
      selectData,
      getNonce.QueryKey<config>
    > &
    ExactPartial<
      Omit<getNonce.queryOptions.Parameters<config, selectData>, 'query'>
    >

  export type ReturnValue<selectData = getNonce.ReturnValue> =
    UseQueryReturnType<selectData, Error>
}

/**
 * Hook for getting the number of active nonce keys for an account.
 *
 * @example
 * ```tsx
 * import { Hooks } from 'tempo.ts/wagmi'
 *
 * function App() {
 *   const { data, isLoading } = Hooks.nonce.useNonceKeyCount({
 *     account: '0x...',
 *   })
 *
 *   if (isLoading) return <div>Loading...</div>
 *   return <div>Active keys: {data?.toString()}</div>
 * }
 * ```
 *
 * @param parameters - Parameters.
 * @returns Query result with active nonce key count.
 */
export function useNonceKeyCount<
  config extends Config = ResolvedRegister['config'],
  selectData = getNonceKeyCount.ReturnValue,
>(parameters: useNonceKeyCount.Parameters<config, selectData> = {}) {
  const { account, query = {} } = parameters

  const config = useConfig(parameters)
  const chainId = useChainId({ config })

  const options = getNonceKeyCount.queryOptions(config, {
    ...parameters,
    chainId: parameters.chainId ?? chainId,
    query: undefined,
  })
  const enabled = Boolean(account && (query.enabled ?? true))

  return useQuery({ ...query, ...options, enabled })
}

export declare namespace useNonceKeyCount {
  export type Parameters<
    config extends Config = ResolvedRegister['config'],
    selectData = getNonceKeyCount.ReturnValue,
  > = ConfigParameter<config> &
    QueryParameter<
      getNonceKeyCount.ReturnValue,
      DefaultError,
      selectData,
      getNonceKeyCount.QueryKey<config>
    > &
    ExactPartial<
      Omit<
        getNonceKeyCount.queryOptions.Parameters<config, selectData>,
        'query'
      >
    >

  export type ReturnValue<selectData = getNonceKeyCount.ReturnValue> =
    UseQueryReturnType<selectData, Error>
}

/**
 * Hook for watching nonce incremented events.
 *
 * @example
 * ```tsx
 * import { Hooks } from 'tempo.ts/wagmi'
 *
 * function App() {
 *   Hooks.nonce.useWatchNonceIncremented({
 *     onNonceIncremented(args, log) {
 *       console.log('Nonce incremented:', args)
 *     },
 *   })
 *
 *   return <div>Watching for nonce increments...</div>
 * }
 * ```
 *
 * @param parameters - Parameters.
 */
export function useWatchNonceIncremented<
  config extends Config = ResolvedRegister['config'],
>(parameters: useWatchNonceIncremented.Parameters<config> = {}) {
  const { enabled = true, onNonceIncremented, ...rest } = parameters

  const config = useConfig({ config: parameters.config })
  const configChainId = useChainId({ config })
  const chainId = parameters.chainId ?? configChainId

  useEffect(() => {
    if (!enabled) return
    if (!onNonceIncremented) return
    return watchNonceIncremented(config, {
      ...rest,
      chainId,
      onNonceIncremented,
    })
  }, [config, enabled, onNonceIncremented, chainId, rest])
}

export declare namespace useWatchNonceIncremented {
  type Parameters<config extends Config = Config> = UnionCompute<
    ExactPartial<watchNonceIncremented.Parameters<config>> &
      ConfigParameter<config> & { enabled?: boolean | undefined }
  >
}

/**
 * Hook for watching active key count changed events.
 *
 * @example
 * ```tsx
 * import { Hooks } from 'tempo.ts/wagmi'
 *
 * function App() {
 *   Hooks.nonce.useWatchActiveKeyCountChanged({
 *     onActiveKeyCountChanged(args, log) {
 *       console.log('Active key count changed:', args)
 *     },
 *   })
 *
 *   return <div>Watching for active key count changes...</div>
 * }
 * ```
 *
 * @param parameters - Parameters.
 */
export function useWatchActiveKeyCountChanged<
  config extends Config = ResolvedRegister['config'],
>(parameters: useWatchActiveKeyCountChanged.Parameters<config> = {}) {
  const { enabled = true, onActiveKeyCountChanged, ...rest } = parameters

  const config = useConfig({ config: parameters.config })
  const configChainId = useChainId({ config })
  const chainId = parameters.chainId ?? configChainId

  useEffect(() => {
    if (!enabled) return
    if (!onActiveKeyCountChanged) return
    return watchActiveKeyCountChanged(config, {
      ...rest,
      chainId,
      onActiveKeyCountChanged,
    })
  }, [config, enabled, onActiveKeyCountChanged, chainId, rest])
}

export declare namespace useWatchActiveKeyCountChanged {
  type Parameters<config extends Config = Config> = UnionCompute<
    ExactPartial<watchActiveKeyCountChanged.Parameters<config>> &
      ConfigParameter<config> & { enabled?: boolean | undefined }
  >
}
