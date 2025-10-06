import * as Hex from 'ox/Hex'
import * as Signature from 'ox/Signature'
import {
  type Account,
  type Address,
  type Chain,
  type Client,
  type ExtractAbiItem,
  encodeFunctionData,
  type GetEventArgs,
  type ReadContractParameters,
  type ReadContractReturnType,
  type SendTransactionParameters,
  type Transport,
  type ValueOf,
  type Log as viem_Log,
  type WatchContractEventParameters,
  type WriteContractParameters,
  type WriteContractReturnType,
} from 'viem'
import { parseAccount } from 'viem/accounts'
import {
  multicall,
  readContract,
  sendTransaction,
  simulateContract,
  watchContractEvent,
  writeContract,
} from 'viem/actions'
import type { Compute, UnionOmit } from '../../internal/types.js'
import * as TokenId from '../../ox/TokenId.js'
import * as TokenRole from '../../ox/TokenRole.js'
import { tip20Abi, tip20FactoryAbi } from '../abis.js'
import { tip20FactoryAddress, usdAddress } from '../addresses.js'
import type { GetAccountParameter } from '../types.js'
import { defineCall } from '../utils.js'

const transferPolicy = {
  0: 'always-reject',
  1: 'always-allow',
} as const
type TransferPolicy = ValueOf<typeof transferPolicy>

/**
 * Approves a spender to transfer TIP20 tokens on behalf of the caller.
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
 * const hash = await actions.token.approve(client, {
 *   spender: '0x...',
 *   amount: 100n,
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The transaction hash.
 */
export async function approve<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: approve.Parameters<chain, account>,
): Promise<approve.ReturnType> {
  const { token = usdAddress, ...rest } = parameters
  const call = approve.call({ ...rest, token })
  return writeContract(client, {
    ...parameters,
    ...call,
  } as never)
}

export namespace approve {
  export type Parameters<
    chain extends Chain | undefined = Chain | undefined,
    account extends Account | undefined = Account | undefined,
  > = UnionOmit<
    WriteContractParameters<never, never, never, chain, account>,
    'abi' | 'address' | 'functionName' | 'args'
  > &
    Args

  export type Args = {
    /** Amount of tokens to approve. */
    amount: bigint
    /** Address of the spender. */
    spender: Address
    /** Address or ID of the TIP20 token. @default `usdAddress` */
    token?: TokenId.TokenIdOrAddress | undefined
  }

  export type ReturnType = WriteContractReturnType

  /**
   * Defines a call to the `approve` function.
   *
   * Can be passed as a parameter to:
   * - [`estimateContractGas`](https://viem.sh/docs/contract/estimateContractGas): estimate the gas cost of the call
   * - [`simulateContract`](https://viem.sh/docs/contract/simulateContract): simulate the call
   * - [`sendCalls`](https://viem.sh/docs/actions/wallet/sendCalls): send multiple calls
   *
   * @example
   * ```ts
   * import { createClient, http, walletActions } from 'viem'
   * import { tempo } from 'tempo/chains'
   * import * as actions from 'tempo/viem/actions'
   *
   * const client = createClient({
   *   chain: tempo,
   *   transport: http(),
   * }).extend(walletActions)
   *
   * const { result } = await client.sendCalls({
   *   calls: [
   *     actions.token.approve.call({
   *       spender: '0x20c0...beef',
   *       amount: 100n,
   *       token: '0x20c0...babe',
   *     }),
   *   ]
   * })
   * ```
   *
   * @param args - Arguments.
   * @returns The call.
   */
  export function call(args: Args) {
    const { spender, amount, token = usdAddress } = args
    return defineCall({
      address: TokenId.toAddress(token),
      abi: tip20Abi,
      functionName: 'approve',
      args: [spender, amount],
    })
  }
}

/**
 * Burns TIP20 tokens from a blocked address.
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
 * const hash = await actions.token.burnBlocked(client, {
 *   from: '0x...',
 *   amount: 100n,
 *   token: '0x...',
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The transaction hash.
 */
export async function burnBlocked<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: burnBlocked.Parameters<chain, account>,
): Promise<burnBlocked.ReturnType> {
  const call = burnBlocked.call(parameters)
  return writeContract(client, {
    ...parameters,
    ...call,
  } as never)
}

export namespace burnBlocked {
  export type Parameters<
    chain extends Chain | undefined = Chain | undefined,
    account extends Account | undefined = Account | undefined,
  > = UnionOmit<
    WriteContractParameters<never, never, never, chain, account>,
    'abi' | 'address' | 'functionName' | 'args'
  > &
    Args

  export type Args = {
    /** Amount of tokens to burn. */
    amount: bigint
    /** Address to burn tokens from. */
    from: Address
    /** Address or ID of the TIP20 token. */
    token: TokenId.TokenIdOrAddress
  }

  export type ReturnType = WriteContractReturnType

  /**
   * Defines a call to the `burnBlocked` function.
   *
   * Can be passed as a parameter to:
   * - [`estimateContractGas`](https://viem.sh/docs/contract/estimateContractGas): estimate the gas cost of the call
   * - [`simulateContract`](https://viem.sh/docs/contract/simulateContract): simulate the call
   * - [`sendCalls`](https://viem.sh/docs/actions/wallet/sendCalls): send multiple calls
   *
   * @example
   * ```ts
   * import { createClient, http, walletActions } from 'viem'
   * import { tempo } from 'tempo/chains'
   * import * as actions from 'tempo/viem/actions'
   *
   * const client = createClient({
   *   chain: tempo,
   *   transport: http(),
   * }).extend(walletActions)
   *
   * const { result } = await client.sendCalls({
   *   calls: [
   *     actions.token.burnBlocked.call({
   *       from: '0x20c0...beef',
   *       amount: 100n,
   *       token: '0x20c0...babe',
   *     }),
   *   ]
   * })
   * ```
   *
   * @param args - Arguments.
   * @returns The call.
   */
  export function call(args: Args) {
    const { from, amount, token } = args
    return defineCall({
      address: TokenId.toAddress(token),
      abi: tip20Abi,
      functionName: 'burnBlocked',
      args: [from, amount],
    })
  }
}

/**
 * Burns TIP20 tokens from the caller's balance.
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
 * const hash = await actions.token.burn(client, {
 *   amount: 100n,
 *   token: '0x...',
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The transaction hash.
 */
export async function burn<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: burn.Parameters<chain, account>,
): Promise<burn.ReturnType> {
  const call = burn.call(parameters)
  return writeContract(client, {
    ...parameters,
    ...call,
  } as never)
}

export namespace burn {
  export type Parameters<
    chain extends Chain | undefined = Chain | undefined,
    account extends Account | undefined = Account | undefined,
  > = UnionOmit<
    WriteContractParameters<never, never, never, chain, account>,
    'abi' | 'address' | 'functionName' | 'args'
  > &
    Args

  export type Args = {
    /** Amount of tokens to burn. */
    amount: bigint
    /** Memo to include in the transfer. */
    memo?: Hex.Hex | undefined
    /** Address or ID of the TIP20 token. */
    token: TokenId.TokenIdOrAddress
  }

  export type ReturnType = WriteContractReturnType

  /**
   * Defines a call to the `burn` or `burnWithMemo` function.
   *
   * Can be passed as a parameter to:
   * - [`estimateContractGas`](https://viem.sh/docs/contract/estimateContractGas): estimate the gas cost of the call
   * - [`simulateContract`](https://viem.sh/docs/contract/simulateContract): simulate the call
   * - [`sendCalls`](https://viem.sh/docs/actions/wallet/sendCalls): send multiple calls
   *
   * @example
   * ```ts
   * import { createClient, http, walletActions } from 'viem'
   * import { tempo } from 'tempo/chains'
   * import * as actions from 'tempo/viem/actions'
   *
   * const client = createClient({
   *   chain: tempo,
   *   transport: http(),
   * }).extend(walletActions)
   *
   * const { result } = await client.sendCalls({
   *   calls: [
   *     actions.token.burn.call({
   *       amount: 100n,
   *       token: '0x20c0...babe',
   *     }),
   *   ]
   * })
   * ```
   *
   * @param args - Arguments.
   * @returns The call.
   */
  export function call(args: Args) {
    const { amount, memo, token } = args
    const callArgs = memo
      ? ({
          functionName: 'burnWithMemo',
          args: [amount, Hex.padLeft(memo, 32)],
        } as const)
      : ({
          functionName: 'burn',
          args: [amount],
        } as const)
    return defineCall({
      address: TokenId.toAddress(token),
      abi: tip20Abi,
      ...callArgs,
    })
  }
}

/**
 * Changes the transfer policy ID for a TIP20 token.
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
 * const hash = await actions.token.changeTransferPolicy(client, {
 *   token: '0x...',
 *   policyId: 1n,
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The transaction hash.
 */
export async function changeTransferPolicy<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: changeTransferPolicy.Parameters<chain, account>,
): Promise<changeTransferPolicy.ReturnType> {
  const call = changeTransferPolicy.call(parameters)
  return writeContract(client, {
    ...parameters,
    ...call,
  } as never)
}

export namespace changeTransferPolicy {
  export type Parameters<
    chain extends Chain | undefined = Chain | undefined,
    account extends Account | undefined = Account | undefined,
  > = UnionOmit<
    WriteContractParameters<never, never, never, chain, account>,
    'abi' | 'address' | 'functionName' | 'args'
  > &
    Args

  export type Args = {
    /** New transfer policy ID. */
    policyId: bigint
    /** Address or ID of the TIP20 token. */
    token: TokenId.TokenIdOrAddress
  }

  export type ReturnType = WriteContractReturnType

  /**
   * Defines a call to the `changeTransferPolicyId` function.
   *
   * Can be passed as a parameter to:
   * - [`estimateContractGas`](https://viem.sh/docs/contract/estimateContractGas): estimate the gas cost of the call
   * - [`simulateContract`](https://viem.sh/docs/contract/simulateContract): simulate the call
   * - [`sendCalls`](https://viem.sh/docs/actions/wallet/sendCalls): send multiple calls
   *
   * @example
   * ```ts
   * import { createClient, http, walletActions } from 'viem'
   * import { tempo } from 'tempo/chains'
   * import * as actions from 'tempo/viem/actions'
   *
   * const client = createClient({
   *   chain: tempo,
   *   transport: http(),
   * }).extend(walletActions)
   *
   * const { result } = await client.sendCalls({
   *   calls: [
   *     actions.token.changeTransferPolicy.call({
   *       token: '0x20c0...babe',
   *       policyId: 1n,
   *     }),
   *   ]
   * })
   * ```
   *
   * @param args - Arguments.
   * @returns The call.
   */
  export function call(args: Args) {
    const { token, policyId } = args
    return defineCall({
      address: TokenId.toAddress(token),
      abi: tip20Abi,
      functionName: 'changeTransferPolicyId',
      args: [policyId],
    })
  }
}

/**
 * Creates a new TIP20 token.
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
 * const { hash, id, address } = await actions.token.create(client, {
 *   name: 'My Token',
 *   symbol: 'MTK',
 *   currency: 'USD',
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The transaction hash.
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
    admin: admin_ = client.account,
    chain = client.chain,
    ...rest
  } = parameters
  const admin = admin_ ? parseAccount(admin_) : undefined
  if (!admin) throw new Error('admin is required.')

  const call = create.call({ ...rest, admin: admin.address })
  const { request, result } = await simulateContract(client, {
    ...rest,
    account,
    chain,
    ...call,
  } as never)
  const hash = await writeContract(client as never, request as never)
  const id = Hex.toBigInt(result as Hex.Hex)
  const address = TokenId.toAddress(id)
  return {
    address,
    admin: admin.address,
    hash,
    id,
  }
}

export namespace create {
  export type Parameters<
    chain extends Chain | undefined = Chain | undefined,
    account extends Account | undefined = Account | undefined,
  > = UnionOmit<
    WriteContractParameters<never, never, never, chain, account>,
    'abi' | 'address' | 'functionName' | 'args'
  > &
    Omit<Args, 'admin'> &
    (account extends Account
      ? { admin?: Account | Address | undefined }
      : { admin: Account | Address })

  export type Args = {
    /** Admin address. */
    admin: Address
    /** Currency (e.g. "USD"). */
    currency: string
    /** Token name. */
    name: string
    /** Token symbol. */
    symbol: string
  }

  export type ReturnType = Compute<{
    /** Address of the created TIP20 token. */
    address: Address
    /** Admin of the token. */
    admin: Address
    /** Transaction hash. */
    hash: Hex.Hex
    /** ID of the TIP20 token. */
    id: bigint
  }>

  /**
   * Defines a call to the `createToken` function.
   *
   * Can be passed as a parameter to:
   * - [`estimateContractGas`](https://viem.sh/docs/contract/estimateContractGas): estimate the gas cost of the call
   * - [`simulateContract`](https://viem.sh/docs/contract/simulateContract): simulate the call
   * - [`sendCalls`](https://viem.sh/docs/actions/wallet/sendCalls): send multiple calls
   *
   * @example
   * ```ts
   * import { createClient, http, walletActions } from 'viem'
   * import { tempo } from 'tempo/chains'
   * import * as actions from 'tempo/viem/actions'
   *
   * const client = createClient({
   *   chain: tempo,
   *   transport: http(),
   * }).extend(walletActions)
   *
   * const { result } = await client.sendCalls({
   *   calls: [
   *     actions.token.create.call({
   *       name: 'My Token',
   *       symbol: 'MTK',
   *       currency: 'USD',
   *       admin: '0xfeed...fede',
   *     }),
   *   ]
   * })
   * ```
   *
   * @param args - Arguments.
   * @returns The call.
   */
  export function call(args: Args) {
    const { name, symbol, currency, admin } = args
    return defineCall({
      address: tip20FactoryAddress,
      abi: tip20FactoryAbi,
      args: [name, symbol, currency, admin],
      functionName: 'createToken',
    })
  }
}

/**
 * Gets TIP20 token allowance.
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
 * const allowance = await actions.token.getAllowance(client, {
 *   spender: '0x...',
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The token allowance.
 */
export async function getAllowance<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: getAllowance.Parameters<account>,
): Promise<getAllowance.ReturnType> {
  const { account = client.account, ...rest } = parameters
  const address = account ? parseAccount(account).address : undefined
  if (!address) throw new Error('account is required.')
  return readContract(client, {
    ...rest,
    ...getAllowance.call({ account: address, ...rest }),
  })
}

export namespace getAllowance {
  export type Parameters<
    account extends Account | undefined = Account | undefined,
  > = UnionOmit<
    ReadContractParameters<never, never, never>,
    'abi' | 'address' | 'functionName' | 'args'
  > &
    GetAccountParameter<account> &
    Omit<Args, 'account'> & {}

  export type Args = {
    /** Account address. */
    account: Address
    /** Address of the spender. */
    spender: Address
    /** Address or ID of the TIP20 token. @default `usdAddress` */
    token?: TokenId.TokenIdOrAddress | undefined
  }

  export type ReturnType = ReadContractReturnType<
    typeof tip20Abi,
    'allowance',
    never
  >

  /**
   * Defines a call to the `allowance` function.
   *
   * @param args - Arguments.
   * @returns The call.
   */
  export function call(args: Args) {
    const { account, spender, token = usdAddress } = args
    return defineCall({
      address: TokenId.toAddress(token),
      abi: tip20Abi,
      functionName: 'allowance',
      args: [account, spender],
    })
  }
}

/**
 * Gets TIP20 token balance for an address.
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
 * const balance = await actions.token.getBalance(client, {
 *   token: '0x...',
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The token balance.
 */
export async function getBalance<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  ...parameters: account extends Account
    ? [getBalance.Parameters<account>] | []
    : [getBalance.Parameters<account>]
): Promise<getBalance.ReturnType> {
  const { account = client.account, ...rest } = parameters[0] ?? {}
  const address = account ? parseAccount(account).address : undefined
  if (!address) throw new Error('account is required.')
  return readContract(client, {
    ...rest,
    ...getBalance.call({ account: address, ...rest }),
  })
}

export namespace getBalance {
  export type Parameters<
    account extends Account | undefined = Account | undefined,
  > = UnionOmit<
    ReadContractParameters<never, never, never>,
    'abi' | 'address' | 'functionName' | 'args'
  > &
    GetAccountParameter<account> &
    Omit<Args, 'account'>

  export type Args = {
    /** Account address. */
    account: Address
    /** Address or ID of the TIP20 token. @default `usdAddress` */
    token?: TokenId.TokenIdOrAddress | undefined
  }

  export type ReturnType = ReadContractReturnType<
    typeof tip20Abi,
    'balanceOf',
    never
  >

  /**
   * Defines a call to the `balanceOf` function.
   *
   * @param args - Arguments.
   * @returns The call.
   */
  export function call(args: Args) {
    const { account, token = usdAddress } = args
    return defineCall({
      address: TokenId.toAddress(token),
      abi: tip20Abi,
      functionName: 'balanceOf',
      args: [account],
    })
  }
}

/**
 * Gets TIP20 token metadata including name, symbol, currency, decimals, and total supply.
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
 * const metadata = await actions.token.getMetadata(client, {
 *   token: '0x...',
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The token metadata.
 */
export async function getMetadata<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  parameters: getMetadata.Parameters = {},
): Promise<getMetadata.ReturnType> {
  const { token = usdAddress, ...rest } = parameters
  const address = TokenId.toAddress(token)
  const abi = tip20Abi
  return multicall(client, {
    ...rest,
    contracts: [
      {
        address,
        abi,
        functionName: 'currency',
      },
      {
        address,
        abi,
        functionName: 'decimals',
      },
      {
        address,
        abi,
        functionName: 'name',
      },
      {
        address,
        abi,
        functionName: 'paused',
      },
      {
        address,
        abi,
        functionName: 'supplyCap',
      },
      {
        address,
        abi,
        functionName: 'symbol',
      },
      {
        address,
        abi,
        functionName: 'totalSupply',
      },
      {
        address,
        abi,
        functionName: 'transferPolicyId',
      },
    ] as const,
    allowFailure: false,
    deployless: true,
  }).then(
    ([
      currency,
      decimals,
      name,
      paused,
      supplyCap,
      symbol,
      totalSupply,
      transferPolicyId,
    ]) => ({
      name,
      symbol,
      currency,
      decimals,
      totalSupply,
      paused,
      supplyCap,
      transferPolicy:
        transferPolicy[Number(transferPolicyId) as keyof typeof transferPolicy],
    }),
  )
}

export declare namespace getMetadata {
  export type Parameters = {
    /** Address or ID of the TIP20 token. @default `usdAddress` */
    token?: TokenId.TokenIdOrAddress | undefined
  }

  export type ReturnType = Compute<{
    /** Currency (e.g. "USD"). */
    currency: string
    /** Decimals. */
    decimals: number
    /** Name. */
    name: string
    /** Whether the token is paused. */
    paused: boolean
    /** Supply cap. */
    supplyCap: bigint
    /** Symbol. */
    symbol: string
    /** Total supply. */
    totalSupply: bigint
    /** Transfer policy. */
    transferPolicy: TransferPolicy
  }>
}

/**
 * Grants a role for a TIP20 token.
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
 * const hash = await actions.token.grantRoles(client, {
 *   token: '0x...',
 *   to: '0x...',
 *   roles: ['minter'],
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The transaction hash.
 */
export async function grantRoles<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: grantRoles.Parameters<chain, account>,
): Promise<grantRoles.ReturnType> {
  return sendTransaction(client, {
    ...parameters,
    calls: parameters.roles.map((role) => {
      const call = grantRoles.call({ ...parameters, role })
      return {
        ...call,
        data: encodeFunctionData(call),
      }
    }),
  } as never)
}

export namespace grantRoles {
  export type Parameters<
    chain extends Chain | undefined = Chain | undefined,
    account extends Account | undefined = Account | undefined,
  > = UnionOmit<
    WriteContractParameters<never, never, never, chain, account>,
    'abi' | 'address' | 'functionName' | 'args'
  > &
    Omit<Args, 'role'> & {
      /** Role to grant. */
      roles: readonly TokenRole.TokenRole[]
    }

  export type Args = {
    /** Role to grant. */
    role: TokenRole.TokenRole
    /** Address or ID of the TIP20 token. */
    token: TokenId.TokenIdOrAddress
    /** Address to grant the role to. */
    to: Address
  }

  export type ReturnType = WriteContractReturnType

  /**
   * Defines a call to the `grantRole` function.
   *
   * Can be passed as a parameter to:
   * - [`estimateContractGas`](https://viem.sh/docs/contract/estimateContractGas): estimate the gas cost of the call
   * - [`simulateContract`](https://viem.sh/docs/contract/simulateContract): simulate the call
   * - [`sendCalls`](https://viem.sh/docs/actions/wallet/sendCalls): send multiple calls
   *
   * @example
   * ```ts
   * import { createClient, http, walletActions } from 'viem'
   * import { tempo } from 'tempo/chains'
   * import * as actions from 'tempo/viem/actions'
   *
   * const client = createClient({
   *   chain: tempo,
   *   transport: http(),
   * }).extend(walletActions)
   *
   * const { result } = await client.sendCalls({
   *   calls: [
   *     actions.token.grantRoles.call({
   *       token: '0x20c0...babe',
   *       to: '0x20c0...beef',
   *       role: 'minter',
   *     }),
   *   ]
   * })
   * ```
   *
   * @param args - Arguments.
   * @returns The call.
   */
  export function call(args: Args) {
    const { token, to, role } = args
    const roleHash = TokenRole.serialize(role)
    return defineCall({
      address: TokenId.toAddress(token),
      abi: tip20Abi,
      functionName: 'grantRole',
      args: [roleHash, to],
    })
  }
}

/**
 * Mints TIP20 tokens to an address.
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
 * const hash = await actions.token.mint(client, {
 *   to: '0x...',
 *   amount: 100n,
 *   token: '0x...',
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The transaction hash.
 */
export async function mint<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: mint.Parameters<chain, account>,
): Promise<mint.ReturnType> {
  const call = mint.call(parameters)
  return writeContract(client, {
    ...parameters,
    // TODO: fix
    gas: 30_000n,
    ...call,
  } as never)
}

export namespace mint {
  export type Parameters<
    chain extends Chain | undefined = Chain | undefined,
    account extends Account | undefined = Account | undefined,
  > = UnionOmit<
    WriteContractParameters<never, never, never, chain, account>,
    'abi' | 'address' | 'functionName' | 'args'
  > &
    Args

  export type Args = {
    /** Amount of tokens to mint. */
    amount: bigint
    /** Memo to include in the mint. */
    memo?: Hex.Hex | undefined
    /** Address to mint tokens to. */
    to: Address
    /** Address or ID of the TIP20 token. */
    token: TokenId.TokenIdOrAddress
  }

  export type ReturnType = WriteContractReturnType

  /**
   * Defines a call to the `mint` or `mintWithMemo` function.
   *
   * Can be passed as a parameter to:
   * - [`estimateContractGas`](https://viem.sh/docs/contract/estimateContractGas): estimate the gas cost of the call
   * - [`simulateContract`](https://viem.sh/docs/contract/simulateContract): simulate the call
   * - [`sendCalls`](https://viem.sh/docs/actions/wallet/sendCalls): send multiple calls
   *
   * @example
   * ```ts
   * import { createClient, http, walletActions } from 'viem'
   * import { tempo } from 'tempo/chains'
   * import * as actions from 'tempo/viem/actions'
   *
   * const client = createClient({
   *   chain: tempo,
   *   transport: http(),
   * }).extend(walletActions)
   *
   * const { result } = await client.sendCalls({
   *   calls: [
   *     actions.token.mint.call({
   *       to: '0x20c0...beef',
   *       amount: 100n,
   *       token: '0x20c0...babe',
   *     }),
   *   ]
   * })
   * ```
   *
   * @param args - Arguments.
   * @returns The call.
   */
  export function call(args: Args) {
    const { to, amount, memo, token } = args
    const callArgs = memo
      ? ({
          functionName: 'mintWithMemo',
          args: [to, amount, Hex.padLeft(memo, 32)],
        } as const)
      : ({
          functionName: 'mint',
          args: [to, amount],
        } as const)
    return defineCall({
      address: TokenId.toAddress(token),
      abi: tip20Abi,
      ...callArgs,
    })
  }
}

/**
 * Pauses a TIP20 token.
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
 * const hash = await actions.token.pause(client, {
 *   token: '0x...',
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The transaction hash.
 */
export async function pause<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: pause.Parameters<chain, account>,
): Promise<pause.ReturnType> {
  const call = pause.call(parameters)
  return writeContract(client, {
    ...parameters,
    ...call,
  } as never)
}

export namespace pause {
  export type Parameters<
    chain extends Chain | undefined = Chain | undefined,
    account extends Account | undefined = Account | undefined,
  > = UnionOmit<
    WriteContractParameters<never, never, never, chain, account>,
    'abi' | 'address' | 'functionName' | 'args'
  > &
    Args

  export type Args = {
    /** Address or ID of the TIP20 token. */
    token: TokenId.TokenIdOrAddress
  }

  export type ReturnType = WriteContractReturnType

  /**
   * Defines a call to the `pause` function.
   *
   * Can be passed as a parameter to:
   * - [`estimateContractGas`](https://viem.sh/docs/contract/estimateContractGas): estimate the gas cost of the call
   * - [`simulateContract`](https://viem.sh/docs/contract/simulateContract): simulate the call
   * - [`sendCalls`](https://viem.sh/docs/actions/wallet/sendCalls): send multiple calls
   *
   * @example
   * ```ts
   * import { createClient, http, walletActions } from 'viem'
   * import { tempo } from 'tempo/chains'
   * import * as actions from 'tempo/viem/actions'
   *
   * const client = createClient({
   *   chain: tempo,
   *   transport: http(),
   * }).extend(walletActions)
   *
   * const { result } = await client.sendCalls({
   *   calls: [
   *     actions.token.pause.call({
   *       token: '0x20c0...babe',
   *     }),
   *   ]
   * })
   * ```
   *
   * @param args - Arguments.
   * @returns The call.
   */
  export function call(args: Args) {
    const { token } = args
    return defineCall({
      address: TokenId.toAddress(token),
      abi: tip20Abi,
      functionName: 'pause',
      args: [],
    })
  }
}

/**
 * Approves a spender using a signed permit.
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
 * const hash = await actions.token.permit(client, {
 *   owner: '0x...',
 *   spender: '0x...',
 *   value: 100n,
 *   deadline: 1234567890n,
 *   signature: { r: 0n, s: 0n, yParity: 0 },
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The transaction hash.
 */
export async function permit<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: permit.Parameters<chain, account>,
): Promise<permit.ReturnType> {
  const call = permit.call(parameters)
  return writeContract(client, {
    ...parameters,
    ...call,
  } as never)
}

export namespace permit {
  export type Parameters<
    chain extends Chain | undefined = Chain | undefined,
    account extends Account | undefined = Account | undefined,
  > = UnionOmit<
    WriteContractParameters<never, never, never, chain, account>,
    'abi' | 'address' | 'functionName' | 'args'
  > &
    Args

  export type Args = {
    /** Deadline for the permit. */
    deadline: bigint
    /** Address of the owner. */
    owner: Address
    /** Signature. */
    signature: Signature.Signature
    /** Address of the spender. */
    spender: Address
    /** Address or ID of the TIP20 token. @default `usdAddress` */
    token?: TokenId.TokenIdOrAddress | undefined
    /** Amount to approve. */
    value: bigint
  }

  export type ReturnType = WriteContractReturnType

  /**
   * Defines a call to the `permit` function.
   *
   * Can be passed as a parameter to:
   * - [`estimateContractGas`](https://viem.sh/docs/contract/estimateContractGas): estimate the gas cost of the call
   * - [`simulateContract`](https://viem.sh/docs/contract/simulateContract): simulate the call
   * - [`sendCalls`](https://viem.sh/docs/actions/wallet/sendCalls): send multiple calls
   *
   * @example
   * ```ts
   * import { createClient, http, walletActions } from 'viem'
   * import { tempo } from 'tempo/chains'
   * import * as actions from 'tempo/viem/actions'
   *
   * const client = createClient({
   *   chain: tempo,
   *   transport: http(),
   * }).extend(walletActions)
   *
   * const { result } = await client.sendCalls({
   *   calls: [
   *     actions.token.permit.call({
   *       owner: '0x20c0...beef',
   *       spender: '0x20c0...babe',
   *       value: 100n,
   *       deadline: 1234567890n,
   *       signature: { r: 0n, s: 0n, yParity: 0 },
   *       token: '0x20c0...cafe',
   *     }),
   *   ]
   * })
   * ```
   *
   * @param args - Arguments.
   * @returns The call.
   */
  export function call(args: Args) {
    const {
      owner,
      spender,
      value,
      deadline,
      signature,
      token = usdAddress,
    } = args
    const { r, s, yParity } = Signature.from(signature)
    const v = Signature.yParityToV(yParity)
    return defineCall({
      address: TokenId.toAddress(token),
      abi: tip20Abi,
      functionName: 'permit',
      args: [
        owner,
        spender,
        value,
        deadline,
        v,
        Hex.trimLeft(Hex.fromNumber(r!)),
        Hex.trimLeft(Hex.fromNumber(s!)),
      ],
    })
  }
}

/**
 * Renounces a role for a TIP20 token.
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
 * const hash = await actions.token.renounceRoles(client, {
 *   token: '0x...',
 *   roles: ['minter'],
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The transaction hash.
 */
export async function renounceRoles<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: renounceRoles.Parameters<chain, account>,
): Promise<renounceRoles.ReturnType> {
  return sendTransaction(client, {
    ...parameters,
    calls: parameters.roles.map((role) => {
      const call = renounceRoles.call({ ...parameters, role })
      return {
        ...call,
        data: encodeFunctionData(call),
      }
    }),
  } as never)
}

export namespace renounceRoles {
  export type Parameters<
    chain extends Chain | undefined = Chain | undefined,
    account extends Account | undefined = Account | undefined,
  > = UnionOmit<
    WriteContractParameters<never, never, never, chain, account>,
    'abi' | 'address' | 'functionName' | 'args'
  > &
    Omit<Args, 'role'> & {
      /** Roles to renounce. */
      roles: readonly TokenRole.TokenRole[]
    }

  export type Args = {
    /** Role to renounce. */
    role: TokenRole.TokenRole
    /** Address or ID of the TIP20 token. */
    token: TokenId.TokenIdOrAddress
  }

  export type ReturnType = WriteContractReturnType

  /**
   * Defines a call to the `renounceRole` function.
   *
   * Can be passed as a parameter to:
   * - [`estimateContractGas`](https://viem.sh/docs/contract/estimateContractGas): estimate the gas cost of the call
   * - [`simulateContract`](https://viem.sh/docs/contract/simulateContract): simulate the call
   * - [`sendCalls`](https://viem.sh/docs/actions/wallet/sendCalls): send multiple calls
   *
   * @example
   * ```ts
   * import { createClient, http, walletActions } from 'viem'
   * import { tempo } from 'tempo/chains'
   * import * as actions from 'tempo/viem/actions'
   *
   * const client = createClient({
   *   chain: tempo,
   *   transport: http(),
   * }).extend(walletActions)
   *
   * const { result } = await client.sendCalls({
   *   calls: [
   *     actions.token.renounceRoles.call({
   *       token: '0x20c0...babe',
   *       role: 'minter',
   *     }),
   *   ]
   * })
   * ```
   *
   * @param args - Arguments.
   * @returns The call.
   */
  export function call(args: Args) {
    const { token, role } = args
    const roleHash = TokenRole.serialize(role)
    return defineCall({
      address: TokenId.toAddress(token),
      abi: tip20Abi,
      functionName: 'renounceRole',
      args: [roleHash],
    })
  }
}

/**
 * Revokes a role for a TIP20 token.
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
 * const hash = await actions.token.revokeRoles(client, {
 *   token: '0x...',
 *   from: '0x...',
 *   roles: ['minter'],
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The transaction hash.
 */
export async function revokeRoles<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: revokeRoles.Parameters<chain, account>,
): Promise<revokeRoles.ReturnType> {
  return sendTransaction(client, {
    ...parameters,
    calls: parameters.roles.map((role) => {
      const call = revokeRoles.call({ ...parameters, role })
      return {
        ...call,
        data: encodeFunctionData(call),
      }
    }),
  } as never)
}

export namespace revokeRoles {
  export type Parameters<
    chain extends Chain | undefined = Chain | undefined,
    account extends Account | undefined = Account | undefined,
  > = SendTransactionParameters<chain, account> &
    Omit<Args, 'role'> & {
      /** Role to revoke. */
      roles: readonly TokenRole.TokenRole[]
    }

  export type Args = {
    /** Address to revoke the role from. */
    from: Address
    /** Role to revoke. */
    role: TokenRole.TokenRole
    /** Address or ID of the TIP20 token. */
    token: TokenId.TokenIdOrAddress
  }

  export type ReturnType = WriteContractReturnType

  /**
   * Defines a call to the `revokeRole` function.
   *
   * Can be passed as a parameter to:
   * - [`estimateContractGas`](https://viem.sh/docs/contract/estimateContractGas): estimate the gas cost of the call
   * - [`simulateContract`](https://viem.sh/docs/contract/simulateContract): simulate the call
   * - [`sendCalls`](https://viem.sh/docs/actions/wallet/sendCalls): send multiple calls
   *
   * @example
   * ```ts
   * import { createClient, http, walletActions } from 'viem'
   * import { tempo } from 'tempo/chains'
   * import * as actions from 'tempo/viem/actions'
   *
   * const client = createClient({
   *   chain: tempo,
   *   transport: http(),
   * }).extend(walletActions)
   *
   * const { result } = await client.sendCalls({
   *   calls: [
   *     actions.token.revokeRoles.call({
   *       token: '0x20c0...babe',
   *       from: '0x20c0...beef',
   *       role: 'minter',
   *     }),
   *   ]
   * })
   * ```
   *
   * @param args - Arguments.
   * @returns The call.
   */
  export function call(args: Args) {
    const { token, from, role } = args
    const roleHash = TokenRole.serialize(role)
    return defineCall({
      address: TokenId.toAddress(token),
      abi: tip20Abi,
      functionName: 'revokeRole',
      args: [roleHash, from],
    })
  }
}

/**
 * Sets the supply cap for a TIP20 token.
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
 * const hash = await actions.token.setSupplyCap(client, {
 *   token: '0x...',
 *   supplyCap: 1000000n,
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The transaction hash.
 */
export async function setSupplyCap<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: setSupplyCap.Parameters<chain, account>,
): Promise<setSupplyCap.ReturnType> {
  const call = setSupplyCap.call(parameters)
  return writeContract(client, {
    ...parameters,
    ...call,
  } as never)
}

export namespace setSupplyCap {
  export type Parameters<
    chain extends Chain | undefined = Chain | undefined,
    account extends Account | undefined = Account | undefined,
  > = UnionOmit<
    WriteContractParameters<never, never, never, chain, account>,
    'abi' | 'address' | 'functionName' | 'args'
  > &
    Args

  export type Args = {
    /** New supply cap. */
    supplyCap: bigint
    /** Address or ID of the TIP20 token. */
    token: TokenId.TokenIdOrAddress
  }

  export type ReturnType = WriteContractReturnType

  /**
   * Defines a call to the `setSupplyCap` function.
   *
   * Can be passed as a parameter to:
   * - [`estimateContractGas`](https://viem.sh/docs/contract/estimateContractGas): estimate the gas cost of the call
   * - [`simulateContract`](https://viem.sh/docs/contract/simulateContract): simulate the call
   * - [`sendCalls`](https://viem.sh/docs/actions/wallet/sendCalls): send multiple calls
   *
   * @example
   * ```ts
   * import { createClient, http, walletActions } from 'viem'
   * import { tempo } from 'tempo/chains'
   * import * as actions from 'tempo/viem/actions'
   *
   * const client = createClient({
   *   chain: tempo,
   *   transport: http(),
   * }).extend(walletActions)
   *
   * const { result } = await client.sendCalls({
   *   calls: [
   *     actions.token.setSupplyCap.call({
   *       token: '0x20c0...babe',
   *       supplyCap: 1000000n,
   *     }),
   *   ]
   * })
   * ```
   *
   * @param args - Arguments.
   * @returns The call.
   */
  export function call(args: Args) {
    const { token, supplyCap } = args
    return defineCall({
      address: TokenId.toAddress(token),
      abi: tip20Abi,
      functionName: 'setSupplyCap',
      args: [supplyCap],
    })
  }
}

/**
 * Sets the admin role for a specific role in a TIP20 token.
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
 * const hash = await actions.token.setRoleAdmin(client, {
 *   token: '0x...',
 *   role: 'minter',
 *   adminRole: 'admin',
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The transaction hash.
 */
export async function setRoleAdmin<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: setRoleAdmin.Parameters<chain, account>,
): Promise<setRoleAdmin.ReturnType> {
  const call = setRoleAdmin.call(parameters)
  return writeContract(client, {
    ...parameters,
    ...call,
  } as never)
}

export namespace setRoleAdmin {
  export type Parameters<
    chain extends Chain | undefined = Chain | undefined,
    account extends Account | undefined = Account | undefined,
  > = UnionOmit<
    WriteContractParameters<never, never, never, chain, account>,
    'abi' | 'address' | 'functionName' | 'args'
  > &
    Args

  export type Args = {
    /** New admin role. */
    adminRole: TokenRole.TokenRole
    /** Role to set admin for. */
    role: TokenRole.TokenRole
    /** Address or ID of the TIP20 token. */
    token: TokenId.TokenIdOrAddress
  }

  export type ReturnType = WriteContractReturnType

  /**
   * Defines a call to the `setRoleAdmin` function.
   *
   * Can be passed as a parameter to:
   * - [`estimateContractGas`](https://viem.sh/docs/contract/estimateContractGas): estimate the gas cost of the call
   * - [`simulateContract`](https://viem.sh/docs/contract/simulateContract): simulate the call
   * - [`sendCalls`](https://viem.sh/docs/actions/wallet/sendCalls): send multiple calls
   *
   * @example
   * ```ts
   * import { createClient, http, walletActions } from 'viem'
   * import { tempo } from 'tempo/chains'
   * import * as actions from 'tempo/viem/actions'
   *
   * const client = createClient({
   *   chain: tempo,
   *   transport: http(),
   * }).extend(walletActions)
   *
   * const { result } = await client.sendCalls({
   *   calls: [
   *     actions.token.setRoleAdmin.call({
   *       token: '0x20c0...babe',
   *       role: 'minter',
   *       adminRole: 'admin',
   *     }),
   *   ]
   * })
   * ```
   *
   * @param args - Arguments.
   * @returns The call.
   */
  export function call(args: Args) {
    const { token, role, adminRole } = args
    const roleHash = TokenRole.serialize(role)
    const adminRoleHash = TokenRole.serialize(adminRole)
    return defineCall({
      address: TokenId.toAddress(token),
      abi: tip20Abi,
      functionName: 'setRoleAdmin',
      args: [roleHash, adminRoleHash],
    })
  }
}

/**
 * Transfers TIP20 tokens to another address.
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
 * const hash = await actions.token.transfer(client, {
 *   to: '0x...',
 *   amount: 100n,
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The transaction hash.
 */
export async function transfer<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: transfer.Parameters<chain, account>,
): Promise<transfer.ReturnType> {
  const call = transfer.call(parameters)
  return writeContract(client, {
    ...parameters,
    ...call,
  } as never)
}

export namespace transfer {
  export type Parameters<
    chain extends Chain | undefined = Chain | undefined,
    account extends Account | undefined = Account | undefined,
  > = UnionOmit<
    WriteContractParameters<never, never, never, chain, account>,
    'abi' | 'address' | 'functionName' | 'args'
  > &
    Args

  export type Args = {
    /** Amount of tokens to transfer. */
    amount: bigint
    /** Address to transfer tokens from. */
    from?: Address | undefined
    /** Memo to include in the transfer. */
    memo?: Hex.Hex | undefined
    /** Address or ID of the TIP20 token. @default `usdAddress` */
    token?: TokenId.TokenIdOrAddress | undefined
    /** Address to transfer tokens to. */
    to: Address
  }

  export type ReturnType = WriteContractReturnType

  /**
   * Defines a call to the `transfer`, `transferFrom`, `transferWithMemo`, or `transferFromWithMemo` function.
   *
   * Can be passed as a parameter to:
   * - [`estimateContractGas`](https://viem.sh/docs/contract/estimateContractGas): estimate the gas cost of the call
   * - [`simulateContract`](https://viem.sh/docs/contract/simulateContract): simulate the call
   * - [`sendCalls`](https://viem.sh/docs/actions/wallet/sendCalls): send multiple calls
   *
   * @example
   * ```ts
   * import { createClient, http, walletActions } from 'viem'
   * import { tempo } from 'tempo/chains'
   * import * as actions from 'tempo/viem/actions'
   *
   * const client = createClient({
   *   chain: tempo,
   *   transport: http(),
   * }).extend(walletActions)
   *
   * const { result } = await client.sendCalls({
   *   calls: [
   *     actions.token.transfer.call({
   *       to: '0x20c0...beef',
   *       amount: 100n,
   *       token: '0x20c0...babe',
   *     }),
   *   ]
   * })
   * ```
   *
   * @param args - Arguments.
   * @returns The call.
   */
  export function call(args: Args) {
    const { amount, from, memo, token = usdAddress, to } = args
    const callArgs = (() => {
      if (memo && from)
        return {
          functionName: 'transferFromWithMemo',
          args: [from, to, amount, Hex.padLeft(memo, 32)],
        } as const
      if (memo)
        return {
          functionName: 'transferWithMemo',
          args: [to, amount, Hex.padLeft(memo, 32)],
        } as const
      if (from)
        return {
          functionName: 'transferFrom',
          args: [from, to, amount],
        } as const
      return {
        functionName: 'transfer',
        args: [to, amount],
      } as const
    })()
    return defineCall({
      address: TokenId.toAddress(token),
      abi: tip20Abi,
      ...callArgs,
    })
  }
}

/**
 * Unpauses a TIP20 token.
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
 * const hash = await actions.token.unpause(client, {
 *   token: '0x...',
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The transaction hash.
 */
export async function unpause<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: unpause.Parameters<chain, account>,
): Promise<unpause.ReturnType> {
  const call = unpause.call(parameters)
  return writeContract(client, {
    ...parameters,
    ...call,
  } as never)
}

export namespace unpause {
  export type Parameters<
    chain extends Chain | undefined = Chain | undefined,
    account extends Account | undefined = Account | undefined,
  > = UnionOmit<
    WriteContractParameters<never, never, never, chain, account>,
    'abi' | 'address' | 'functionName' | 'args'
  > &
    Args

  export type Args = {
    /** Address or ID of the TIP20 token. */
    token: TokenId.TokenIdOrAddress
  }

  export type ReturnType = WriteContractReturnType

  /**
   * Defines a call to the `unpause` function.
   *
   * Can be passed as a parameter to:
   * - [`estimateContractGas`](https://viem.sh/docs/contract/estimateContractGas): estimate the gas cost of the call
   * - [`simulateContract`](https://viem.sh/docs/contract/simulateContract): simulate the call
   * - [`sendCalls`](https://viem.sh/docs/actions/wallet/sendCalls): send multiple calls
   *
   * @example
   * ```ts
   * import { createClient, http, walletActions } from 'viem'
   * import { tempo } from 'tempo/chains'
   * import * as actions from 'tempo/viem/actions'
   *
   * const client = createClient({
   *   chain: tempo,
   *   transport: http(),
   * }).extend(walletActions)
   *
   * const { result } = await client.sendCalls({
   *   calls: [
   *     actions.token.unpause.call({
   *       token: '0x20c0...babe',
   *     }),
   *   ]
   * })
   * ```
   *
   * @param args - Arguments.
   * @returns The call.
   */
  export function call(args: Args) {
    const { token } = args
    return defineCall({
      address: TokenId.toAddress(token),
      abi: tip20Abi,
      functionName: 'unpause',
      args: [],
    })
  }
}

/**
 * Watches for TIP20 token approval events.
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
 * const unwatch = actions.token.watchApprove(client, {
 *   onApproval: (args, log) => {
 *     console.log('Approval:', args)
 *   },
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns A function to unsubscribe from the event.
 */
export function watchApprove<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: watchApprove.Parameters,
) {
  const { onApproval, token = usdAddress, ...rest } = parameters
  return watchContractEvent(client, {
    ...rest,
    address: TokenId.toAddress(token),
    abi: tip20Abi,
    eventName: 'Approval',
    onLogs: (logs) => {
      for (const log of logs) onApproval(log.args, log)
    },
    strict: true,
  })
}

export declare namespace watchApprove {
  export type Args = GetEventArgs<
    typeof tip20Abi,
    'Approval',
    { IndexedOnly: false; Required: true }
  >

  export type Log = viem_Log<
    bigint,
    number,
    false,
    ExtractAbiItem<typeof tip20Abi, 'Approval'>,
    true
  >

  export type Parameters = UnionOmit<
    WatchContractEventParameters<typeof tip20Abi, 'Approval', true>,
    'abi' | 'address' | 'batch' | 'eventName' | 'onLogs' | 'strict'
  > & {
    /** Callback to invoke when tokens are approved. */
    onApproval: (args: Args, log: Log) => void
    /** Address or ID of the TIP20 token. @default `usdAddress` */
    token?: TokenId.TokenIdOrAddress | undefined
  }
}

/**
 * Watches for TIP20 token burn events.
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
 * const unwatch = actions.token.watchBurn(client, {
 *   onBurn: (args, log) => {
 *     console.log('Burn:', args)
 *   },
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns A function to unsubscribe from the event.
 */
export function watchBurn<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(client: Client<Transport, chain, account>, parameters: watchBurn.Parameters) {
  const { onBurn, token = usdAddress, ...rest } = parameters
  return watchContractEvent(client, {
    ...rest,
    address: TokenId.toAddress(token),
    abi: tip20Abi,
    eventName: 'Burn',
    onLogs: (logs) => {
      for (const log of logs) onBurn(log.args, log)
    },
    strict: true,
  })
}

export declare namespace watchBurn {
  export type Args = GetEventArgs<
    typeof tip20Abi,
    'Burn',
    { IndexedOnly: false; Required: true }
  >

  export type Log = viem_Log<
    bigint,
    number,
    false,
    ExtractAbiItem<typeof tip20Abi, 'Burn'>,
    true
  >

  export type Parameters = UnionOmit<
    WatchContractEventParameters<typeof tip20Abi, 'Burn', true>,
    'abi' | 'address' | 'batch' | 'eventName' | 'onLogs' | 'strict'
  > & {
    /** Callback to invoke when tokens are burned. */
    onBurn: (args: Args, log: Log) => void
    /** Address or ID of the TIP20 token. @default `usdAddress` */
    token?: TokenId.TokenIdOrAddress | undefined
  }
}

/**
 * Watches for new TIP20 tokens created.
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
 * const unwatch = actions.token.watchCreate(client, {
 *   onTokenCreated: (args, log) => {
 *     console.log('Token created:', args)
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
  const { onTokenCreated, ...rest } = parameters
  return watchContractEvent(client, {
    ...rest,
    address: tip20FactoryAddress,
    abi: tip20FactoryAbi,
    eventName: 'TokenCreated',
    onLogs: (logs) => {
      for (const log of logs) onTokenCreated(log.args, log)
    },
    strict: true,
  })
}

export declare namespace watchCreate {
  export type Args = GetEventArgs<
    typeof tip20FactoryAbi,
    'TokenCreated',
    { IndexedOnly: false; Required: true }
  >

  export type Log = viem_Log<
    bigint,
    number,
    false,
    ExtractAbiItem<typeof tip20FactoryAbi, 'TokenCreated'>,
    true
  >

  export type Parameters = UnionOmit<
    WatchContractEventParameters<typeof tip20FactoryAbi, 'TokenCreated', true>,
    'abi' | 'address' | 'batch' | 'eventName' | 'onLogs' | 'strict'
  > & {
    /** Callback to invoke when a new TIP20 token is created. */
    onTokenCreated: (args: Args, log: Log) => void
  }
}

/**
 * Watches for TIP20 token mint events.
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
 * const unwatch = actions.token.watchMint(client, {
 *   onMint: (args, log) => {
 *     console.log('Mint:', args)
 *   },
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns A function to unsubscribe from the event.
 */
export function watchMint<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(client: Client<Transport, chain, account>, parameters: watchMint.Parameters) {
  const { onMint, token = usdAddress, ...rest } = parameters
  return watchContractEvent(client, {
    ...rest,
    address: TokenId.toAddress(token),
    abi: tip20Abi,
    eventName: 'Mint',
    onLogs: (logs) => {
      for (const log of logs) onMint(log.args, log)
    },
    strict: true,
  })
}

export declare namespace watchMint {
  export type Args = GetEventArgs<
    typeof tip20Abi,
    'Mint',
    { IndexedOnly: false; Required: true }
  >

  export type Log = viem_Log<
    bigint,
    number,
    false,
    ExtractAbiItem<typeof tip20Abi, 'Mint'>,
    true
  >

  export type Parameters = UnionOmit<
    WatchContractEventParameters<typeof tip20Abi, 'Mint', true>,
    'abi' | 'address' | 'batch' | 'eventName' | 'onLogs' | 'strict'
  > & {
    /** Callback to invoke when tokens are minted. */
    onMint: (args: Args, log: Log) => void
    /** Address or ID of the TIP20 token. @default `usdAddress` */
    token?: TokenId.TokenIdOrAddress | undefined
  }
}

/**
 * Watches for TIP20 token role admin updates.
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
 * const unwatch = actions.token.watchAdminRole(client, {
 *   onRoleAdminUpdated: (args, log) => {
 *     console.log('Role admin updated:', args)
 *   },
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns A function to unsubscribe from the event.
 */
export function watchAdminRole<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: watchAdminRole.Parameters,
) {
  const { onRoleAdminUpdated, token = usdAddress, ...rest } = parameters
  return watchContractEvent(client, {
    ...rest,
    address: TokenId.toAddress(token),
    abi: tip20Abi,
    eventName: 'RoleAdminUpdated',
    onLogs: (logs) => {
      for (const log of logs) onRoleAdminUpdated(log.args, log)
    },
    strict: true,
  })
}

export declare namespace watchAdminRole {
  export type Args = GetEventArgs<
    typeof tip20Abi,
    'RoleAdminUpdated',
    { IndexedOnly: false; Required: true }
  >

  export type Log = viem_Log<
    bigint,
    number,
    false,
    ExtractAbiItem<typeof tip20Abi, 'RoleAdminUpdated'>,
    true
  >

  export type Parameters = UnionOmit<
    WatchContractEventParameters<typeof tip20Abi, 'RoleAdminUpdated', true>,
    'abi' | 'address' | 'batch' | 'eventName' | 'onLogs' | 'strict'
  > & {
    /** Callback to invoke when a role admin is updated. */
    onRoleAdminUpdated: (args: Args, log: Log) => void
    /** Address or ID of the TIP20 token. @default `usdAddress` */
    token?: TokenId.TokenIdOrAddress | undefined
  }
}

/**
 * Watches for TIP20 token role membership updates.
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
 * const unwatch = actions.token.watchRole(client, {
 *   onRoleUpdated: (args, log) => {
 *     console.log('Role updated:', args)
 *   },
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns A function to unsubscribe from the event.
 */
export function watchRole<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(client: Client<Transport, chain, account>, parameters: watchRole.Parameters) {
  const { onRoleUpdated, token = usdAddress, ...rest } = parameters
  return watchContractEvent(client, {
    ...rest,
    address: TokenId.toAddress(token),
    abi: tip20Abi,
    eventName: 'RoleMembershipUpdated',
    onLogs: (logs) => {
      for (const log of logs) {
        const type = log.args.hasRole ? 'granted' : 'revoked'
        onRoleUpdated({ ...log.args, type }, log)
      }
    },
    strict: true,
  })
}

export declare namespace watchRole {
  export type Args = GetEventArgs<
    typeof tip20Abi,
    'RoleMembershipUpdated',
    { IndexedOnly: false; Required: true }
  > & {
    /** Type of role update. */
    type: 'granted' | 'revoked'
  }

  export type Log = viem_Log<
    bigint,
    number,
    false,
    ExtractAbiItem<typeof tip20Abi, 'RoleMembershipUpdated'>,
    true
  >

  export type Parameters = UnionOmit<
    WatchContractEventParameters<
      typeof tip20Abi,
      'RoleMembershipUpdated',
      true
    >,
    'abi' | 'address' | 'batch' | 'eventName' | 'onLogs' | 'strict'
  > & {
    /** Callback to invoke when a role membership is updated. */
    onRoleUpdated: (args: Args, log: Log) => void
    /** Address or ID of the TIP20 token. @default `usdAddress` */
    token?: TokenId.TokenIdOrAddress | undefined
  }
}

/**
 * Watches for TIP20 token transfer events.
 *
 * @example
 * ```ts
 * import { createClient, http } from 'viem'
 * import { tempo } from 'tempo/chains'
 * import * as actions from 'tempo/viem/actions'
 *
 * const client = createClient({
 *   account: privateKeyToAccount('0x...'),
 *   chain: tempo,
 *   transport: http(),
 * })
 *
 * const unwatch = actions.token.watchTransfer(client, {
 *   onTransfer: (args, log) => {
 *     console.log('Transfer:', args)
 *   },
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns A function to unsubscribe from the event.
 */
export function watchTransfer<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: watchTransfer.Parameters,
) {
  const { onTransfer, token = usdAddress, ...rest } = parameters
  return watchContractEvent(client, {
    ...rest,
    address: TokenId.toAddress(token),
    abi: tip20Abi,
    eventName: 'Transfer',
    onLogs: (logs) => {
      for (const log of logs) onTransfer(log.args, log)
    },
    strict: true,
  })
}

export declare namespace watchTransfer {
  export type Args = GetEventArgs<
    typeof tip20Abi,
    'Transfer',
    { IndexedOnly: false; Required: true }
  >

  export type Log = viem_Log<
    bigint,
    number,
    false,
    ExtractAbiItem<typeof tip20Abi, 'Transfer'>,
    true
  >

  export type Parameters = UnionOmit<
    WatchContractEventParameters<typeof tip20Abi, 'Transfer', true>,
    'abi' | 'address' | 'batch' | 'eventName' | 'onLogs' | 'strict'
  > & {
    /** Callback to invoke when tokens are transferred. */
    onTransfer: (args: Args, log: Log) => void
    /** Address or ID of the TIP20 token. @default `usdAddress` */
    token?: TokenId.TokenIdOrAddress | undefined
  }
}
