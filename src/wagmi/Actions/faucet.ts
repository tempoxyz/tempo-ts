import type { Config } from '@wagmi/core'
import type { ChainIdParameter, UnionCompute } from '@wagmi/core/internal'
import * as viem_Actions from '../../viem/Actions/faucet.js'

/**
 * Funds an account with an initial amount of set token(s)
 * on Tempo's testnet.
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
 * const hashes = await Actions.faucet.fund(config, {
 *   account: '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef',
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns The transaction hashes.
 */
export async function fund<config extends Config>(
  config: config,
  parameters: fund.Parameters<config>,
): Promise<fund.ReturnValue> {
  const { chainId, ...rest } = parameters
  const client = config.getClient({ chainId })
  return viem_Actions.fund(client, rest)
}

export declare namespace fund {
  export type Parameters<config extends Config> = UnionCompute<
    ChainIdParameter<config> & viem_Actions.fund.Parameters
  >

  export type ReturnValue = viem_Actions.fund.ReturnValue
}

/**
 * Funds an account with an initial amount of set token(s)
 * on Tempo's testnet. Returns with the transaction receipts.
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
 * const receipts = await Actions.faucet.fundSync(config, {
 *   account: '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef',
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns The transaction hashes.
 */
export async function fundSync<config extends Config>(
  config: config,
  parameters: fundSync.Parameters<config>,
): Promise<fundSync.ReturnValue> {
  const { chainId, ...rest } = parameters
  const client = config.getClient({ chainId })
  return viem_Actions.fundSync(client, rest)
}

export declare namespace fundSync {
  export type Parameters<config extends Config> = UnionCompute<
    ChainIdParameter<config> & viem_Actions.fundSync.Parameters
  >

  export type ReturnValue = viem_Actions.fundSync.ReturnValue
}
