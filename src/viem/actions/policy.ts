// TODO:
// - add `.call` to namespaces
// - add `.simulate` to namespaces
// - add `.estimateGas` to namespaces

import type {
  Account,
  Address,
  Chain,
  Client,
  ExtractAbiItem,
  GetEventArgs,
  ReadContractParameters,
  ReadContractReturnType,
  Transport,
  Log as viem_Log,
  WatchContractEventParameters,
  WriteContractParameters,
  WriteContractReturnType,
} from 'viem'
import {
  readContract,
  simulateContract,
  watchContractEvent,
  writeContract,
} from 'viem/actions'
import type { Compute } from '../../internal/types.js'
import { tip403RegistryAbi } from '../abis.js'
import { tip403RegistryAddress } from '../addresses.js'
import { parseAccount } from 'viem/accounts'

export type PolicyType = 'whitelist' | 'blacklist'

const policyTypeMap = {
  whitelist: 0,
  blacklist: 1,
} as const

/**
 * Creates a new policy.
 *
 * @example
 * ```ts
 * import { createClient, http } from 'viem'
 * import { tempo } from 'tempo/chains'
 * import * as actions from 'tempo/viem/actions'
 * import { privateKeyToAccount } from 'viem/accounts'
 *
 * const client = createClient({
 *   account: privateKeyToAccount('0x...'),
 *   chain: tempo,
 *   transport: http(),
 * })
 *
 * const { hash, policyId } = await actions.policy.create(client, {
 *   admin: '0x...',
 *   type: 'whitelist',
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The transaction hash and policy ID.
 */
export async function create<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: create.Parameters<chain, account>,
): Promise<create.ReturnType> {
  const {
    account = client.account,
    addresses,
    chain = client.chain,
    type,
    ...rest
  } = parameters

  if (!account) throw new Error('`account` is required')

  const admin = parseAccount(account).address!

  const args = addresses
    ? ([admin, policyTypeMap[type], addresses] as const)
    : ([admin, policyTypeMap[type]] as const)

  const { request, result } = await simulateContract(client, {
    ...rest,
    account,
    address: tip403RegistryAddress,
    abi: tip403RegistryAbi,
    chain,
    functionName: 'createPolicy',
    args,
  } as never)
  const hash = await writeContract(client, request as never)
  return { hash, policyId: result }
}

export declare namespace create {
  type Parameters<
    chain extends Chain | undefined = Chain | undefined,
    account extends Account | undefined = Account | undefined,
  > = Omit<
    WriteContractParameters<never, never, never, chain, account>,
    'abi' | 'address' | 'functionName' | 'args' | 'type'
  > & {
    /** Optional array of accounts to initialize the policy with. */
    addresses?: readonly Address[] | undefined
    /** Address of the policy admin. */
    admin?: Address | undefined
    /** Type of policy to create. */
    type: PolicyType
  }

  type ReturnType = { hash: WriteContractReturnType; policyId: bigint }
}

/**
 * Sets the admin for a policy.
 *
 * @example
 * ```ts
 * import { createClient, http } from 'viem'
 * import { tempo } from 'tempo/chains'
 * import * as actions from 'tempo/viem/actions'
 * import { privateKeyToAccount } from 'viem/accounts'
 *
 * const client = createClient({
 *   account: privateKeyToAccount('0x...'),
 *   chain: tempo,
 *   transport: http(),
 * })
 *
 * const hash = await actions.policy.setAdmin(client, {
 *   policyId: 2n,
 *   admin: '0x...',
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The transaction hash.
 */
export async function setAdmin<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: setAdmin.Parameters<chain, account>,
): Promise<setAdmin.ReturnType> {
  const {
    account = client.account,
    admin,
    chain = client.chain,
    policyId,
    ...rest
  } = parameters
  return writeContract(client, {
    ...rest,
    account,
    address: tip403RegistryAddress,
    abi: tip403RegistryAbi,
    chain,
    functionName: 'setPolicyAdmin',
    args: [policyId, admin],
  } as never)
}

export namespace setAdmin {
  export type Parameters<
    chain extends Chain | undefined = Chain | undefined,
    account extends Account | undefined = Account | undefined,
  > = Omit<
    WriteContractParameters<never, never, never, chain, account>,
    'abi' | 'address' | 'functionName' | 'args'
  > & {
    /** New admin address. */
    admin: Address
    /** Policy ID. */
    policyId: bigint
  }

  export type ReturnType = WriteContractReturnType
}

/**
 * Modifies a policy whitelist.
 *
 * @example
 * ```ts
 * import { createClient, http } from 'viem'
 * import { tempo } from 'tempo/chains'
 * import * as actions from 'tempo/viem/actions'
 * import { privateKeyToAccount } from 'viem/accounts'
 *
 * const client = createClient({
 *   account: privateKeyToAccount('0x...'),
 *   chain: tempo,
 *   transport: http(),
 * })
 *
 * const hash = await actions.policy.modifyWhitelist(client, {
 *   policyId: 2n,
 *   account: '0x...',
 *   allowed: true,
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The transaction hash.
 */
export async function modifyWhitelist<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: modifyWhitelist.Parameters<chain, account>,
): Promise<modifyWhitelist.ReturnType> {
  const {
    account = client.account,
    address: targetAccount,
    allowed,
    chain = client.chain,
    policyId,
    ...rest
  } = parameters
  return writeContract(client, {
    ...rest,
    account,
    address: tip403RegistryAddress,
    abi: tip403RegistryAbi,
    chain,
    functionName: 'modifyPolicyWhitelist',
    args: [policyId, targetAccount, allowed],
  } as never)
}

export namespace modifyWhitelist {
  export type Parameters<
    chain extends Chain | undefined = Chain | undefined,
    account extends Account | undefined = Account | undefined,
  > = Omit<
    WriteContractParameters<never, never, never, chain, account>,
    'abi' | 'address' | 'functionName' | 'args'
  > & {
    /** Target account address. */
    address: Address
    /** Whether the account is allowed. */
    allowed: boolean
    /** Policy ID. */
    policyId: bigint
  }

  export type ReturnType = WriteContractReturnType
}

/**
 * Modifies a policy blacklist.
 *
 * @example
 * ```ts
 * import { createClient, http } from 'viem'
 * import { tempo } from 'tempo/chains'
 * import * as actions from 'tempo/viem/actions'
 * import { privateKeyToAccount } from 'viem/accounts'
 *
 * const client = createClient({
 *   account: privateKeyToAccount('0x...'),
 *   chain: tempo,
 *   transport: http(),
 * })
 *
 * const hash = await actions.policy.modifyBlacklist(client, {
 *   policyId: 2n,
 *   account: '0x...',
 *   restricted: true,
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The transaction hash.
 */
export async function modifyBlacklist<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: modifyBlacklist.Parameters<chain, account>,
): Promise<modifyBlacklist.ReturnType> {
  const {
    account = client.account,
    address: targetAccount,
    chain = client.chain,
    policyId,
    restricted,
    ...rest
  } = parameters
  return writeContract(client, {
    ...rest,
    account,
    address: tip403RegistryAddress,
    abi: tip403RegistryAbi,
    chain,
    functionName: 'modifyPolicyBlacklist',
    args: [policyId, targetAccount, restricted],
  } as never)
}

export namespace modifyBlacklist {
  export type Parameters<
    chain extends Chain | undefined = Chain | undefined,
    account extends Account | undefined = Account | undefined,
  > = Omit<
    WriteContractParameters<never, never, never, chain, account>,
    'abi' | 'address' | 'functionName' | 'args'
  > & {
    /** Target account address. */
    address: Address
    /** Policy ID. */
    policyId: bigint
    /** Whether the account is restricted. */
    restricted: boolean
  }

  export type ReturnType = WriteContractReturnType
}

/**
 * Gets policy data.
 *
 * @example
 * ```ts
 * import { createClient, http } from 'viem'
 * import { tempo } from 'tempo/chains'
 * import * as actions from 'tempo/viem/actions'
 *
 * const client = createClient({
 *   chain: tempo,
 *   transport: http(),
 * })
 *
 * const data = await actions.policy.getData(client, {
 *   policyId: 2n,
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The policy data.
 */
export async function getData<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  parameters: getData.Parameters,
): Promise<getData.ReturnType> {
  const { policyId, ...rest } = parameters
  const result = await readContract(client, {
    ...rest,
    address: tip403RegistryAddress,
    abi: tip403RegistryAbi,
    functionName: 'policyData',
    args: [policyId],
  })
  return {
    admin: result[1],
    type: result[0] === 0 ? 'whitelist' : 'blacklist',
  }
}

export namespace getData {
  export type Parameters = Omit<
    ReadContractParameters<never, never, never>,
    'abi' | 'address' | 'functionName' | 'args'
  > & {
    /** Policy ID. */
    policyId: bigint
  }

  export type ReturnType = Compute<{
    /** Admin address. */
    admin: Address
    /** Policy type. */
    type: PolicyType
  }>
}

/**
 * Checks if a user is authorized by a policy.
 *
 * @example
 * ```ts
 * import { createClient, http } from 'viem'
 * import { tempo } from 'tempo/chains'
 * import * as actions from 'tempo/viem/actions'
 *
 * const client = createClient({
 *   chain: tempo,
 *   transport: http(),
 * })
 *
 * const authorized = await actions.policy.isAuthorized(client, {
 *   policyId: 2n,
 *   user: '0x...',
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns Whether the user is authorized.
 */
export async function isAuthorized<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  parameters: isAuthorized.Parameters,
): Promise<isAuthorized.ReturnType> {
  const { policyId, user, ...rest } = parameters
  return readContract(client, {
    ...rest,
    address: tip403RegistryAddress,
    abi: tip403RegistryAbi,
    functionName: 'isAuthorized',
    args: [policyId, user],
  })
}

export namespace isAuthorized {
  export type Parameters = Omit<
    ReadContractParameters<never, never, never>,
    'abi' | 'address' | 'functionName' | 'args'
  > & {
    /** Policy ID. */
    policyId: bigint
    /** User address to check. */
    user: Address
  }

  export type ReturnType = ReadContractReturnType<
    typeof tip403RegistryAbi,
    'isAuthorized',
    never
  >
}

/**
 * Watches for policy creation events.
 *
 * @example
 * ```ts
 * import { createClient, http } from 'viem'
 * import { tempo } from 'tempo/chains'
 * import * as actions from 'tempo/viem/actions'
 *
 * const client = createClient({
 *   chain: tempo,
 *   transport: http(),
 * })
 *
 * const unwatch = actions.policy.watchCreate(client, {
 *   onPolicyCreated: (args, log) => {
 *     console.log('Policy created:', args)
 *   },
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns A function to unsubscribe from the event.
 */
export function watchCreate<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: watchCreate.Parameters,
) {
  const { onPolicyCreated, ...rest } = parameters
  return watchContractEvent(client, {
    ...rest,
    address: tip403RegistryAddress,
    abi: tip403RegistryAbi,
    eventName: 'PolicyCreated',
    onLogs: (logs) => {
      for (const log of logs)
        onPolicyCreated(
          {
            ...log.args,
            type: log.args.policyType === 0 ? 'whitelist' : 'blacklist',
          },
          log,
        )
    },
    strict: true,
  })
}

export namespace watchCreate {
  export type Args = {
    policyId: bigint
    updater: Address
    type: PolicyType
  }

  export type Log = viem_Log<
    bigint,
    number,
    false,
    ExtractAbiItem<typeof tip403RegistryAbi, 'PolicyCreated'>,
    true
  >

  export type Parameters = Omit<
    WatchContractEventParameters<
      typeof tip403RegistryAbi,
      'PolicyCreated',
      true
    >,
    'abi' | 'address' | 'batch' | 'eventName' | 'onLogs' | 'strict'
  > & {
    /** Callback to invoke when a policy is created. */
    onPolicyCreated: (args: Args, log: Log) => void
  }
}

/**
 * Watches for policy admin update events.
 *
 * @example
 * ```ts
 * import { createClient, http } from 'viem'
 * import { tempo } from 'tempo/chains'
 * import * as actions from 'tempo/viem/actions'
 *
 * const client = createClient({
 *   chain: tempo,
 *   transport: http(),
 * })
 *
 * const unwatch = actions.policy.watchAdminUpdated(client, {
 *   onAdminUpdated: (args, log) => {
 *     console.log('Policy admin updated:', args)
 *   },
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns A function to unsubscribe from the event.
 */
export function watchAdminUpdated<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: watchAdminUpdated.Parameters,
) {
  const { onAdminUpdated, ...rest } = parameters
  return watchContractEvent(client, {
    ...rest,
    address: tip403RegistryAddress,
    abi: tip403RegistryAbi,
    eventName: 'PolicyAdminUpdated',
    onLogs: (logs) => {
      for (const log of logs) onAdminUpdated(log.args, log)
    },
    strict: true,
  })
}

export namespace watchAdminUpdated {
  export type Args = GetEventArgs<
    typeof tip403RegistryAbi,
    'PolicyAdminUpdated',
    { IndexedOnly: false; Required: true }
  >

  export type Log = viem_Log<
    bigint,
    number,
    false,
    ExtractAbiItem<typeof tip403RegistryAbi, 'PolicyAdminUpdated'>,
    true
  >

  export type Parameters = Omit<
    WatchContractEventParameters<
      typeof tip403RegistryAbi,
      'PolicyAdminUpdated',
      true
    >,
    'abi' | 'address' | 'batch' | 'eventName' | 'onLogs' | 'strict'
  > & {
    /** Callback to invoke when a policy admin is updated. */
    onAdminUpdated: (args: Args, log: Log) => void
  }
}

/**
 * Watches for whitelist update events.
 *
 * @example
 * ```ts
 * import { createClient, http } from 'viem'
 * import { tempo } from 'tempo/chains'
 * import * as actions from 'tempo/viem/actions'
 *
 * const client = createClient({
 *   chain: tempo,
 *   transport: http(),
 * })
 *
 * const unwatch = actions.policy.watchWhitelistUpdated(client, {
 *   onWhitelistUpdated: (args, log) => {
 *     console.log('Whitelist updated:', args)
 *   },
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns A function to unsubscribe from the event.
 */
export function watchWhitelistUpdated<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: watchWhitelistUpdated.Parameters,
) {
  const { onWhitelistUpdated, ...rest } = parameters
  return watchContractEvent(client, {
    ...rest,
    address: tip403RegistryAddress,
    abi: tip403RegistryAbi,
    eventName: 'WhitelistUpdated',
    onLogs: (logs) => {
      for (const log of logs) onWhitelistUpdated(log.args, log)
    },
    strict: true,
  })
}

export namespace watchWhitelistUpdated {
  export type Args = GetEventArgs<
    typeof tip403RegistryAbi,
    'WhitelistUpdated',
    { IndexedOnly: false; Required: true }
  >

  export type Log = viem_Log<
    bigint,
    number,
    false,
    ExtractAbiItem<typeof tip403RegistryAbi, 'WhitelistUpdated'>,
    true
  >

  export type Parameters = Omit<
    WatchContractEventParameters<
      typeof tip403RegistryAbi,
      'WhitelistUpdated',
      true
    >,
    'abi' | 'address' | 'batch' | 'eventName' | 'onLogs' | 'strict'
  > & {
    /** Callback to invoke when a whitelist is updated. */
    onWhitelistUpdated: (args: Args, log: Log) => void
  }
}

/**
 * Watches for blacklist update events.
 *
 * @example
 * ```ts
 * import { createClient, http } from 'viem'
 * import { tempo } from 'tempo/chains'
 * import * as actions from 'tempo/viem/actions'
 *
 * const client = createClient({
 *   chain: tempo,
 *   transport: http(),
 * })
 *
 * const unwatch = actions.policy.watchBlacklistUpdated(client, {
 *   onBlacklistUpdated: (args, log) => {
 *     console.log('Blacklist updated:', args)
 *   },
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns A function to unsubscribe from the event.
 */
export function watchBlacklistUpdated<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: watchBlacklistUpdated.Parameters,
) {
  const { onBlacklistUpdated, ...rest } = parameters
  return watchContractEvent(client, {
    ...rest,
    address: tip403RegistryAddress,
    abi: tip403RegistryAbi,
    eventName: 'BlacklistUpdated',
    onLogs: (logs) => {
      for (const log of logs) onBlacklistUpdated(log.args, log)
    },
    strict: true,
  })
}

export namespace watchBlacklistUpdated {
  export type Args = GetEventArgs<
    typeof tip403RegistryAbi,
    'BlacklistUpdated',
    { IndexedOnly: false; Required: true }
  >

  export type Log = viem_Log<
    bigint,
    number,
    false,
    ExtractAbiItem<typeof tip403RegistryAbi, 'BlacklistUpdated'>,
    true
  >

  export type Parameters = Omit<
    WatchContractEventParameters<
      typeof tip403RegistryAbi,
      'BlacklistUpdated',
      true
    >,
    'abi' | 'address' | 'batch' | 'eventName' | 'onLogs' | 'strict'
  > & {
    /** Callback to invoke when a blacklist is updated. */
    onBlacklistUpdated: (args: Args, log: Log) => void
  }
}
