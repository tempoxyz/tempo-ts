import {
  type Account,
  type Address,
  type Chain,
  type ClientConfig,
  createClient,
  http,
  type JsonRpcAccount,
  type RpcSchema,
  type Transport,
  type Client as viem_Client,
} from 'viem'
import { tempo } from '../chains.js'
import type { PartialBy } from '../internal/types.js'
import * as actions from './decorator.js'

export type Client<
  transport extends Transport = Transport,
  chain extends Chain | undefined = Chain | undefined,
  accountOrAddress extends Account | undefined = undefined,
> = viem_Client<
  transport,
  chain,
  accountOrAddress,
  undefined,
  actions.Decorator<chain, accountOrAddress>
>

/**
 * Instantiates a default Tempo client.
 *
 * @example
 * ```ts
 * import { createTempoClient } from 'tempo/viem'
 * import { privateKeyToAccount } from 'viem/accounts'
 *
 * const client = createTempoClient({
 *   account: privateKeyToAccount('0x...')
 * })
 * ```
 *
 * @param parameters - The parameters for the client.
 * @returns A Tempo client.
 */
export function createTempoClient<
  transport extends Transport,
  chain extends Chain | undefined = typeof tempo,
  accountOrAddress extends Account | Address | undefined = undefined,
  rpcSchema extends RpcSchema | undefined = undefined,
>(
  parameters: createTempoClient.Parameters<
    transport,
    chain,
    accountOrAddress,
    rpcSchema
  > = {},
): createTempoClient.ReturnType<
  transport,
  chain,
  accountOrAddress extends Address
    ? JsonRpcAccount<accountOrAddress>
    : accountOrAddress
> {
  const { chain = tempo, transport = http(), ...rest } = parameters
  return createClient({
    ...rest,
    chain,
    transport,
  }).extend(actions.decorator()) as never
}

export namespace createTempoClient {
  export type Parameters<
    transport extends Transport = Transport,
    chain extends Chain | undefined = Chain | undefined,
    accountOrAddress extends Account | Address | undefined =
      | Account
      | Address
      | undefined,
    rpcSchema extends RpcSchema | undefined = undefined,
  > = PartialBy<
    ClientConfig<transport, chain, accountOrAddress, rpcSchema>,
    'transport'
  >

  export type ReturnType<
    transport extends Transport = Transport,
    chain extends Chain | undefined = Chain | undefined,
    accountOrAddress extends Account | undefined = undefined,
  > = Client<transport, chain, accountOrAddress>
}
