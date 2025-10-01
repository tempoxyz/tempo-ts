// TODO:
// - add `.call` to namespaces
// - add `.simulate` to namespaces
// - add `.estimateGas` to namespaces
// - add "watch" actions for events

import * as Hex from 'ox/Hex'
import * as Signature from 'ox/Signature'
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
  ValueOf,
  Log as viem_Log,
  WatchContractEventParameters,
  WriteContractParameters,
  WriteContractReturnType,
} from 'viem'
import { parseAccount } from 'viem/accounts'
import {
  multicall,
  readContract,
  simulateContract,
  watchContractEvent,
  writeContract,
} from 'viem/actions'
import type { Compute, UnionOmit } from '../../internal/types.js'
import * as TokenId from '../../ox/TokenId.js'
import * as TokenRole from '../../ox/TokenRole.js'
import { feeManagerAbi, tip20Abi, tip20FactoryAbi } from '../abis.js'
import {
  feeManagerAddress,
  tip20FactoryAddress,
  usdAddress,
} from '../addresses.js'
import type { GetAccountParameter } from '../types.js'

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
 * import { tokenActions } from 'tempo/viem'
 * import { privateKeyToAccount } from 'viem/accounts'
 *
 * const client = createClient({
 *   account: privateKeyToAccount('0x...'),
 *   chain: tempo,
 *   transport: http(),
 * })
 *
 * const hash = await tokenActions.approve(client, {
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
  const {
    account = client.account,
    amount,
    chain = client.chain,
    spender,
    token = usdAddress,
    ...rest
  } = parameters
  return writeContract(client, {
    ...rest,
    account,
    address: TokenId.toAddress(token),
    abi: tip20Abi,
    chain,
    functionName: 'approve',
    args: [spender, amount],
  } as never)
}

export namespace approve {
  export type Parameters<
    chain extends Chain | undefined = Chain | undefined,
    account extends Account | undefined = Account | undefined,
  > = UnionOmit<
    WriteContractParameters<never, never, never, chain, account>,
    'abi' | 'address' | 'functionName' | 'args'
  > & {
    /** Amount of tokens to approve. */
    amount: bigint
    /** Address of the spender. */
    spender: Address
    /** Address or ID of the TIP20 token. @default `usdAddress` */
    token?: TokenId.TokenIdOrAddress | undefined
  }

  export type ReturnType = WriteContractReturnType
}

/**
 * Burns TIP20 tokens from a blocked address.
 *
 * @example
 * ```ts
 * import { createClient, http } from 'viem'
 * import { tempo } from 'tempo/chains'
 * import { tokenActions } from 'tempo/viem'
 * import { privateKeyToAccount } from 'viem/accounts'
 *
 * const client = createClient({
 *   account: privateKeyToAccount('0x...'),
 *   chain: tempo,
 *   transport: http(),
 * })
 *
 * const hash = await tokenActions.burnBlocked(client, {
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
  const {
    account = client.account,
    amount,
    chain = client.chain,
    from,
    token,
    ...rest
  } = parameters
  return writeContract(client, {
    ...rest,
    account,
    address: TokenId.toAddress(token),
    abi: tip20Abi,
    chain,
    functionName: 'burnBlocked',
    args: [from, amount],
  } as never)
}

export namespace burnBlocked {
  export type Parameters<
    chain extends Chain | undefined = Chain | undefined,
    account extends Account | undefined = Account | undefined,
  > = UnionOmit<
    WriteContractParameters<never, never, never, chain, account>,
    'abi' | 'address' | 'functionName' | 'args'
  > & {
    /** Amount of tokens to burn. */
    amount: bigint
    /** Address to burn tokens from. */
    from: Address
    /** Address or ID of the TIP20 token. */
    token: TokenId.TokenIdOrAddress
  }

  export type ReturnType = WriteContractReturnType
}

/**
 * Burns TIP20 tokens from the caller's balance.
 *
 * @example
 * ```ts
 * import { createClient, http } from 'viem'
 * import { tempo } from 'tempo/chains'
 * import { tokenActions } from 'tempo/viem'
 * import { privateKeyToAccount } from 'viem/accounts'
 *
 * const client = createClient({
 *   account: privateKeyToAccount('0x...'),
 *   chain: tempo,
 *   transport: http(),
 * })
 *
 * const hash = await tokenActions.burn(client, {
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
  const {
    account = client.account,
    amount,
    chain = client.chain,
    memo,
    token,
    ...rest
  } = parameters

  const args = memo
    ? ({
        functionName: 'burnWithMemo',
        args: [amount, Hex.padLeft(memo, 32)],
      } as const)
    : ({
        functionName: 'burn',
        args: [amount],
      } as const)

  return writeContract(client, {
    ...rest,
    account,
    address: TokenId.toAddress(token),
    abi: tip20Abi,
    chain,
    ...args,
  } as never)
}

export namespace burn {
  export type Parameters<
    chain extends Chain | undefined = Chain | undefined,
    account extends Account | undefined = Account | undefined,
  > = UnionOmit<
    WriteContractParameters<never, never, never, chain, account>,
    'abi' | 'address' | 'functionName' | 'args'
  > & {
    /** Amount of tokens to burn. */
    amount: bigint
    /** Memo to include in the transfer. */
    memo?: Hex.Hex | undefined
    /** Address or ID of the TIP20 token. */
    token: TokenId.TokenIdOrAddress
  }

  export type ReturnType = WriteContractReturnType
}

/**
 * Changes the transfer policy ID for a TIP20 token.
 *
 * @example
 * ```ts
 * import { createClient, http } from 'viem'
 * import { tempo } from 'tempo/chains'
 * import { tokenActions } from 'tempo/viem'
 * import { privateKeyToAccount } from 'viem/accounts'
 *
 * const client = createClient({
 *   account: privateKeyToAccount('0x...'),
 *   chain: tempo,
 *   transport: http(),
 * })
 *
 * const hash = await tokenActions.changeTransferPolicy(client, {
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
  const {
    account = client.account,
    chain = client.chain,
    token,
    policyId,
    ...rest
  } = parameters
  return writeContract(client, {
    ...rest,
    account,
    address: TokenId.toAddress(token),
    abi: tip20Abi,
    chain,
    functionName: 'changeTransferPolicyId',
    args: [policyId],
  } as never)
}

export namespace changeTransferPolicy {
  export type Parameters<
    chain extends Chain | undefined = Chain | undefined,
    account extends Account | undefined = Account | undefined,
  > = UnionOmit<
    WriteContractParameters<never, never, never, chain, account>,
    'abi' | 'address' | 'functionName' | 'args'
  > & {
    /** New transfer policy ID. */
    policyId: bigint
    /** Address or ID of the TIP20 token. */
    token: TokenId.TokenIdOrAddress
  }

  export type ReturnType = WriteContractReturnType
}

/**
 * Creates a new TIP20 token.
 *
 * @example
 * ```ts
 * import { createClient, http } from 'viem'
 * import { tempo } from 'tempo/chains'
 * import { tokenActions } from 'tempo/viem'
 * import { privateKeyToAccount } from 'viem/accounts'
 *
 * const client = createClient({
 *   account: privateKeyToAccount('0x...'),
 *   chain: tempo,
 *   transport: http(),
 * })
 *
 * const { hash, id, address } = await tokenActions.create(client, {
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
    name,
    symbol,
    currency,
    ...rest
  } = parameters
  const admin = admin_ ? parseAccount(admin_) : undefined
  if (!admin) throw new Error('admin is required.')
  const { request, result } = await simulateContract(client, {
    ...rest,
    account,
    address: tip20FactoryAddress,
    abi: tip20FactoryAbi,
    chain,
    functionName: 'createToken',
    args: [name, symbol, currency, admin.address],
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
  > & {
    currency: string
    name: string
    symbol: string
  } & (account extends Account
      ? { admin?: Account | Address | undefined }
      : { admin: Account | Address })

  export type ReturnType = {
    /** Address of the created TIP20 token. */
    address: Address
    /** Admin of the token. */
    admin: Address
    /** Transaction hash. */
    hash: Hex.Hex
    /** ID of the TIP20 token. */
    id: bigint
  }
}

/**
 * Gets TIP20 token allowance.
 *
 * @example
 * ```ts
 * import { createClient, http } from 'viem'
 * import { tempo } from 'tempo/chains'
 * import { tokenActions } from 'tempo/viem'
 * import { privateKeyToAccount } from 'viem/accounts'
 *
 * const client = createClient({
 *   account: privateKeyToAccount('0x...'),
 *   chain: tempo,
 *   transport: http(),
 * })
 *
 * const allowance = await tokenActions.getAllowance(client, {
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
  const {
    account = client.account,
    token = usdAddress,
    spender,
    ...rest
  } = parameters
  const address = account ? parseAccount(account).address : undefined
  if (!address) throw new Error('account is required.')
  return readContract(client, {
    ...rest,
    address: TokenId.toAddress(token),
    abi: tip20Abi,
    functionName: 'allowance',
    args: [address, spender],
  })
}

export namespace getAllowance {
  export type Parameters<
    account extends Account | undefined = Account | undefined,
  > = UnionOmit<
    ReadContractParameters<never, never, never>,
    'abi' | 'address' | 'functionName' | 'args'
  > &
    GetAccountParameter<account> & {
      /** Address or ID of the TIP20 token. @default `usdAddress` */
      token?: TokenId.TokenIdOrAddress | undefined
      /** Address of the spender. */
      spender: Address
    }

  export type ReturnType = ReadContractReturnType<
    typeof tip20Abi,
    'allowance',
    never
  >
}

/**
 * Gets TIP20 token balance for an address.
 *
 * @example
 * ```ts
 * import { createClient, http } from 'viem'
 * import { tempo } from 'tempo/chains'
 * import { tokenActions } from 'tempo/viem'
 * import { privateKeyToAccount } from 'viem/accounts'
 *
 * const client = createClient({
 *   account: privateKeyToAccount('0x...'),
 *   chain: tempo,
 *   transport: http(),
 * })
 *
 * const balance = await tokenActions.getBalance(client, {
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
  const {
    account = client.account,
    token = usdAddress,
    ...rest
  } = parameters[0] ?? {}
  const address = account ? parseAccount(account).address : undefined
  if (!address) throw new Error('account is required.')
  return readContract(client, {
    ...rest,
    address: TokenId.toAddress(token),
    abi: tip20Abi,
    functionName: 'balanceOf',
    args: [address],
  })
}

export namespace getBalance {
  export type Parameters<
    account extends Account | undefined = Account | undefined,
  > = UnionOmit<
    ReadContractParameters<never, never, never>,
    'abi' | 'address' | 'functionName' | 'args'
  > &
    GetAccountParameter<account> & {
      /** Address or ID of the TIP20 token. @default `usdAddress` */
      token?: TokenId.TokenIdOrAddress | undefined
    }

  export type ReturnType = ReadContractReturnType<
    typeof tip20Abi,
    'balanceOf',
    never
  >
}

/**
 * Gets TIP20 token metadata including name, symbol, currency, decimals, and total supply.
 *
 * @example
 * ```ts
 * import { createClient, http } from 'viem'
 * import { tempo } from 'tempo/chains'
 * import { tokenActions } from 'tempo/viem'
 * import { privateKeyToAccount } from 'viem/accounts'
 *
 * const client = createClient({
 *   account: privateKeyToAccount('0x...'),
 *   chain: tempo,
 *   transport: http(),
 * })
 *
 * const metadata = await tokenActions.getMetadata(client, {
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

export namespace getMetadata {
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
 * Gets the user's default fee token.
 *
 * @example
 * ```ts
 * import { createClient, http } from 'viem'
 * import { tempo } from 'tempo/chains'
 * import { tokenActions } from 'tempo/viem'
 * import { privateKeyToAccount } from 'viem/accounts'
 *
 * const client = createClient({
 *   account: privateKeyToAccount('0x...'),
 *   chain: tempo,
 *   transport: http(),
 * })
 *
 * const { address, id } = await tokenActions.getUserToken(client)
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The transaction hash.
 */
export async function getUserToken<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  ...parameters: account extends Account
    ? [getUserToken.Parameters<account>] | []
    : [getUserToken.Parameters<account>]
): Promise<getUserToken.ReturnType> {
  const { account: account_ = client.account, ...rest } = parameters[0] ?? {}
  if (!account_) throw new Error('account is required.')
  const account = parseAccount(account_)
  const address = await readContract(client, {
    ...rest,
    address: feeManagerAddress,
    abi: feeManagerAbi,
    functionName: 'userTokens',
    args: [account.address],
  })
  return {
    address,
    id: TokenId.fromAddress(address),
  }
}

export namespace getUserToken {
  export type Parameters<
    account extends Account | undefined = Account | undefined,
  > = UnionOmit<
    ReadContractParameters<never, never, never>,
    'abi' | 'address' | 'functionName' | 'args'
  > &
    GetAccountParameter<account>

  export type ReturnType = {
    address: Address
    id: bigint
  }
}

/**
 * Grants a role for a TIP20 token.
 *
 * @example
 * ```ts
 * import { createClient, http } from 'viem'
 * import { tempo } from 'tempo/chains'
 * import { tokenActions } from 'tempo/viem'
 * import { privateKeyToAccount } from 'viem/accounts'
 *
 * const client = createClient({
 *   account: privateKeyToAccount('0x...'),
 *   chain: tempo,
 *   transport: http(),
 * })
 *
 * const hash = await tokenActions.grantRoles(client, {
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
  const {
    account = client.account,
    chain = client.chain,
    token,
    to,
    ...rest
  } = parameters
  if (parameters.roles.length > 1)
    throw new Error('granting multiple roles is not supported yet.')
  const [role] = parameters.roles.map((role) => TokenRole.serialize(role))
  return writeContract(client, {
    ...rest,
    account,
    address: TokenId.toAddress(token),
    abi: tip20Abi,
    chain,
    functionName: 'grantRole',
    args: [role, to],
  } as never)
}

export namespace grantRoles {
  export type Parameters<
    chain extends Chain | undefined = Chain | undefined,
    account extends Account | undefined = Account | undefined,
  > = UnionOmit<
    WriteContractParameters<never, never, never, chain, account>,
    'abi' | 'address' | 'functionName' | 'args'
  > & {
    /** Address or ID of the TIP20 token. */
    token: TokenId.TokenIdOrAddress
    /** Role to grant. */
    roles: readonly TokenRole.TokenRole[]
    /** Address to grant the role to. */
    to: Address
  }

  export type ReturnType = WriteContractReturnType
}

/**
 * Mints TIP20 tokens to an address.
 *
 * @example
 * ```ts
 * import { createClient, http } from 'viem'
 * import { tempo } from 'tempo/chains'
 * import { tokenActions } from 'tempo/viem'
 * import { privateKeyToAccount } from 'viem/accounts'
 *
 * const client = createClient({
 *   account: privateKeyToAccount('0x...'),
 *   chain: tempo,
 *   transport: http(),
 * })
 *
 * const hash = await tokenActions.mint(client, {
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
  const {
    account = client.account,
    amount,
    chain = client.chain,
    memo,
    token,
    to,
    ...rest
  } = parameters

  const args = memo
    ? ({
        functionName: 'mintWithMemo',
        args: [to, amount, Hex.padLeft(memo, 32)],
      } as const)
    : ({
        functionName: 'mint',
        args: [to, amount],
      } as const)

  return writeContract(client, {
    ...rest,
    account,
    address: TokenId.toAddress(token),
    abi: tip20Abi,
    chain,
    // TODO: fix
    gas: 30_000n,
    ...args,
  } as never)
}

export namespace mint {
  export type Parameters<
    chain extends Chain | undefined = Chain | undefined,
    account extends Account | undefined = Account | undefined,
  > = UnionOmit<
    WriteContractParameters<never, never, never, chain, account>,
    'abi' | 'address' | 'functionName' | 'args'
  > & {
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
}

/**
 * Pauses a TIP20 token.
 *
 * @example
 * ```ts
 * import { createClient, http } from 'viem'
 * import { tempo } from 'tempo/chains'
 * import { tokenActions } from 'tempo/viem'
 * import { privateKeyToAccount } from 'viem/accounts'
 *
 * const client = createClient({
 *   account: privateKeyToAccount('0x...'),
 *   chain: tempo,
 *   transport: http(),
 * })
 *
 * const hash = await tokenActions.pause(client, {
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
  const {
    account = client.account,
    chain = client.chain,
    token,
    ...rest
  } = parameters
  return writeContract(client, {
    ...rest,
    account,
    address: TokenId.toAddress(token),
    abi: tip20Abi,
    chain,
    functionName: 'pause',
    args: [],
  } as never)
}

export namespace pause {
  export type Parameters<
    chain extends Chain | undefined = Chain | undefined,
    account extends Account | undefined = Account | undefined,
  > = UnionOmit<
    WriteContractParameters<never, never, never, chain, account>,
    'abi' | 'address' | 'functionName' | 'args'
  > & {
    /** Address or ID of the TIP20 token. */
    token: TokenId.TokenIdOrAddress
  }

  export type ReturnType = WriteContractReturnType
}

/**
 * Approves a spender using a signed permit.
 *
 * @example
 * ```ts
 * import { createClient, http } from 'viem'
 * import { tempo } from 'tempo/chains'
 * import { tokenActions } from 'tempo/viem'
 * import { privateKeyToAccount } from 'viem/accounts'
 *
 * const client = createClient({
 *   account: privateKeyToAccount('0x...'),
 *   chain: tempo,
 *   transport: http(),
 * })
 *
 * const hash = await tokenActions.permit(client, {
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
  const {
    account = client.account,
    chain = client.chain,
    token = usdAddress,
    owner,
    spender,
    value,
    deadline,
    signature,
    ...rest
  } = parameters
  const { r, s, yParity } = Signature.from(signature)
  const v = Signature.yParityToV(yParity)
  return writeContract(client, {
    ...rest,
    account,
    address: TokenId.toAddress(token),
    abi: tip20Abi,
    chain,
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
  } as never)
}

export namespace permit {
  export type Parameters<
    chain extends Chain | undefined = Chain | undefined,
    account extends Account | undefined = Account | undefined,
  > = UnionOmit<
    WriteContractParameters<never, never, never, chain, account>,
    'abi' | 'address' | 'functionName' | 'args'
  > & {
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
}

/**
 * Renounces a role for a TIP20 token.
 *
 * @example
 * ```ts
 * import { createClient, http } from 'viem'
 * import { tempo } from 'tempo/chains'
 * import { tokenActions } from 'tempo/viem'
 * import { privateKeyToAccount } from 'viem/accounts'
 *
 * const client = createClient({
 *   account: privateKeyToAccount('0x...'),
 *   chain: tempo,
 *   transport: http(),
 * })
 *
 * const hash = await tokenActions.renounceRoles(client, {
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
  const {
    account = client.account,
    chain = client.chain,
    token,
    ...rest
  } = parameters
  if (parameters.roles.length > 1)
    throw new Error('renouncing multiple roles is not supported yet.')
  const [role] = parameters.roles.map(TokenRole.serialize)
  return writeContract(client, {
    ...rest,
    account,
    address: TokenId.toAddress(token),
    abi: tip20Abi,
    chain,
    functionName: 'renounceRole',
    args: [role],
  } as never)
}

export namespace renounceRoles {
  export type Parameters<
    chain extends Chain | undefined = Chain | undefined,
    account extends Account | undefined = Account | undefined,
  > = UnionOmit<
    WriteContractParameters<never, never, never, chain, account>,
    'abi' | 'address' | 'functionName' | 'args'
  > & {
    /** Address or ID of the TIP20 token. */
    token: TokenId.TokenIdOrAddress
    /** Roles to renounce. */
    roles: readonly TokenRole.TokenRole[]
  }

  export type ReturnType = WriteContractReturnType
}

/**
 * Revokes a role for a TIP20 token.
 *
 * @example
 * ```ts
 * import { createClient, http } from 'viem'
 * import { tempo } from 'tempo/chains'
 * import { tokenActions } from 'tempo/viem'
 * import { privateKeyToAccount } from 'viem/accounts'
 *
 * const client = createClient({
 *   account: privateKeyToAccount('0x...'),
 *   chain: tempo,
 *   transport: http(),
 * })
 *
 * const hash = await tokenActions.revokeRoles(client, {
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
  const {
    account = client.account,
    chain = client.chain,
    token,
    from,
    ...rest
  } = parameters
  if (parameters.roles.length > 1)
    throw new Error('revoking multiple roles is not supported yet.')
  const [role] = parameters.roles.map(TokenRole.serialize)
  return writeContract(client, {
    ...rest,
    account,
    address: TokenId.toAddress(token),
    abi: tip20Abi,
    chain,
    functionName: 'revokeRole',
    args: [role, from],
  } as never)
}

export namespace revokeRoles {
  export type Parameters<
    chain extends Chain | undefined = Chain | undefined,
    account extends Account | undefined = Account | undefined,
  > = UnionOmit<
    WriteContractParameters<never, never, never, chain, account>,
    'abi' | 'address' | 'functionName' | 'args'
  > & {
    /** Address to revoke the role from. */
    from: Address
    /** Role to revoke. */
    roles: readonly TokenRole.TokenRole[]
    /** Address or ID of the TIP20 token. */
    token: TokenId.TokenIdOrAddress
  }

  export type ReturnType = WriteContractReturnType
}

/**
 * Sets the supply cap for a TIP20 token.
 *
 * @example
 * ```ts
 * import { createClient, http } from 'viem'
 * import { tempo } from 'tempo/chains'
 * import { tokenActions } from 'tempo/viem'
 * import { privateKeyToAccount } from 'viem/accounts'
 *
 * const client = createClient({
 *   account: privateKeyToAccount('0x...'),
 *   chain: tempo,
 *   transport: http(),
 * })
 *
 * const hash = await tokenActions.setSupplyCap(client, {
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
  const {
    account = client.account,
    chain = client.chain,
    token,
    supplyCap,
    ...rest
  } = parameters
  return writeContract(client, {
    ...rest,
    account,
    address: TokenId.toAddress(token),
    abi: tip20Abi,
    chain,
    functionName: 'setSupplyCap',
    args: [supplyCap],
  } as never)
}

export namespace setSupplyCap {
  export type Parameters<
    chain extends Chain | undefined = Chain | undefined,
    account extends Account | undefined = Account | undefined,
  > = UnionOmit<
    WriteContractParameters<never, never, never, chain, account>,
    'abi' | 'address' | 'functionName' | 'args'
  > & {
    /** New supply cap. */
    supplyCap: bigint
    /** Address or ID of the TIP20 token. */
    token: TokenId.TokenIdOrAddress
  }

  export type ReturnType = WriteContractReturnType
}

/**
 * Sets the admin role for a specific role in a TIP20 token.
 *
 * @example
 * ```ts
 * import { createClient, http } from 'viem'
 * import { tempo } from 'tempo/chains'
 * import { tokenActions } from 'tempo/viem'
 * import { privateKeyToAccount } from 'viem/accounts'
 *
 * const client = createClient({
 *   account: privateKeyToAccount('0x...'),
 *   chain: tempo,
 *   transport: http(),
 * })
 *
 * const hash = await tokenActions.setRoleAdmin(client, {
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
  const {
    account = client.account,
    adminRole,
    chain = client.chain,
    token,
    role,
    ...rest
  } = parameters
  const roleHash = TokenRole.serialize(role)
  const adminRoleHash = TokenRole.serialize(adminRole)
  return writeContract(client, {
    ...rest,
    account,
    address: TokenId.toAddress(token),
    abi: tip20Abi,
    chain,
    functionName: 'setRoleAdmin',
    args: [roleHash, adminRoleHash],
  } as never)
}

export namespace setRoleAdmin {
  export type Parameters<
    chain extends Chain | undefined = Chain | undefined,
    account extends Account | undefined = Account | undefined,
  > = UnionOmit<
    WriteContractParameters<never, never, never, chain, account>,
    'abi' | 'address' | 'functionName' | 'args'
  > & {
    /** New admin role. */
    adminRole: TokenRole.TokenRole
    /** Role to set admin for. */
    role: TokenRole.TokenRole
    /** Address or ID of the TIP20 token. */
    token: TokenId.TokenIdOrAddress
  }

  export type ReturnType = WriteContractReturnType
}

/**
 * Sets the user's default fee token.
 *
 * @example
 * ```ts
 * import { createClient, http } from 'viem'
 * import { tempo } from 'tempo/chains'
 * import { tokenActions } from 'tempo/viem'
 * import { privateKeyToAccount } from 'viem/accounts'
 *
 * const client = createClient({
 *   account: privateKeyToAccount('0x...'),
 *   chain: tempo,
 *   transport: http(),
 * })
 *
 * const hash = await tokenActions.setUserToken(client, {
 *   token: '0x...',
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The transaction hash.
 */
export async function setUserToken<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: setUserToken.Parameters<chain, account>,
): Promise<setUserToken.ReturnType> {
  const {
    account = client.account,
    chain = client.chain,
    token,
    ...rest
  } = parameters
  return writeContract(client, {
    ...rest,
    account,
    address: feeManagerAddress,
    abi: feeManagerAbi,
    chain,
    functionName: 'setUserToken',
    args: [TokenId.toAddress(token)],
  } as never)
}

export namespace setUserToken {
  export type Parameters<
    chain extends Chain | undefined = Chain | undefined,
    account extends Account | undefined = Account | undefined,
  > = UnionOmit<
    WriteContractParameters<never, never, never, chain, account>,
    'abi' | 'address' | 'functionName' | 'args'
  > & {
    /** Address or ID of the TIP20 token. */
    token: TokenId.TokenIdOrAddress
  }

  export type ReturnType = WriteContractReturnType
}

/**
 * Transfers TIP20 tokens to another address.
 *
 * @example
 * ```ts
 * import { createClient, http } from 'viem'
 * import { tempo } from 'tempo/chains'
 * import { tokenActions } from 'tempo/viem'
 * import { privateKeyToAccount } from 'viem/accounts'
 *
 * const client = createClient({
 *   account: privateKeyToAccount('0x...'),
 *   chain: tempo,
 *   transport: http(),
 * })
 *
 * const hash = await tokenActions.transfer(client, {
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
  const {
    account = client.account,
    amount,
    chain = client.chain,
    from,
    memo,
    token = usdAddress,
    to,
    ...rest
  } = parameters

  const args = (() => {
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

  return writeContract(client, {
    ...rest,
    account,
    address: TokenId.toAddress(token),
    abi: tip20Abi,
    chain,
    ...args,
  } as never)
}

export namespace transfer {
  export type Parameters<
    chain extends Chain | undefined = Chain | undefined,
    account extends Account | undefined = Account | undefined,
  > = UnionOmit<
    WriteContractParameters<never, never, never, chain, account>,
    'abi' | 'address' | 'functionName' | 'args'
  > & {
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
}

/**
 * Unpauses a TIP20 token.
 *
 * @example
 * ```ts
 * import { createClient, http } from 'viem'
 * import { tempo } from 'tempo/chains'
 * import { tokenActions } from 'tempo/viem'
 * import { privateKeyToAccount } from 'viem/accounts'
 *
 * const client = createClient({
 *   account: privateKeyToAccount('0x...'),
 *   chain: tempo,
 *   transport: http(),
 * })
 *
 * const hash = await tokenActions.unpause(client, {
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
  const {
    account = client.account,
    chain = client.chain,
    token,
    ...rest
  } = parameters
  return writeContract(client, {
    ...rest,
    account,
    address: TokenId.toAddress(token),
    abi: tip20Abi,
    chain,
    functionName: 'unpause',
    args: [],
  } as never)
}

export namespace unpause {
  export type Parameters<
    chain extends Chain | undefined = Chain | undefined,
    account extends Account | undefined = Account | undefined,
  > = UnionOmit<
    WriteContractParameters<never, never, never, chain, account>,
    'abi' | 'address' | 'functionName' | 'args'
  > & {
    /** Address or ID of the TIP20 token. */
    token: TokenId.TokenIdOrAddress
  }

  export type ReturnType = WriteContractReturnType
}

/**
 * Watches for TIP20 token approval events.
 *
 * @example
 * ```ts
 * import { createClient, http } from 'viem'
 * import { tempo } from 'tempo/chains'
 * import { tokenActions } from 'tempo/viem'
 *
 * const client = createClient({
 *   chain: tempo,
 *   transport: http(),
 * })
 *
 * const unwatch = tokenActions.watchApprove(client, {
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

export namespace watchApprove {
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
 * import { tokenActions } from 'tempo/viem'
 *
 * const client = createClient({
 *   chain: tempo,
 *   transport: http(),
 * })
 *
 * const unwatch = tokenActions.watchBurn(client, {
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

export namespace watchBurn {
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
 * import { tokenActions } from 'tempo/viem'
 *
 * const client = createClient({
 *   chain: tempo,
 *   transport: http(),
 * })
 *
 * const unwatch = tokenActions.watchCreate(client, {
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

export namespace watchCreate {
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
 * import { tokenActions } from 'tempo/viem'
 *
 * const client = createClient({
 *   chain: tempo,
 *   transport: http(),
 * })
 *
 * const unwatch = tokenActions.watchMint(client, {
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

export namespace watchMint {
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
 * Watches for user token set events.
 *
 * @example
 * ```ts
 * import { createClient, http } from 'viem'
 * import { tempo } from 'tempo/chains'
 * import { tokenActions } from 'tempo/viem'
 *
 * const client = createClient({
 *   chain: tempo,
 *   transport: http(),
 * })
 *
 * const unwatch = tokenActions.watchSetUserToken(client, {
 *   onUserTokenSet: (args, log) => {
 *     console.log('User token set:', args)
 *   },
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns A function to unsubscribe from the event.
 */
export function watchSetUserToken<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: watchSetUserToken.Parameters,
) {
  const { onUserTokenSet, ...rest } = parameters
  return watchContractEvent(client, {
    ...rest,
    address: feeManagerAddress,
    abi: feeManagerAbi,
    eventName: 'UserTokenSet',
    onLogs: (logs) => {
      for (const log of logs) onUserTokenSet(log.args, log)
    },
    strict: true,
  })
}

export namespace watchSetUserToken {
  export type Args = GetEventArgs<
    typeof feeManagerAbi,
    'UserTokenSet',
    { IndexedOnly: false; Required: true }
  >

  export type Log = viem_Log<
    bigint,
    number,
    false,
    ExtractAbiItem<typeof feeManagerAbi, 'UserTokenSet'>,
    true
  >

  export type Parameters = UnionOmit<
    WatchContractEventParameters<typeof feeManagerAbi, 'UserTokenSet', true>,
    'abi' | 'address' | 'batch' | 'eventName' | 'onLogs' | 'strict'
  > & {
    /** Callback to invoke when a user token is set. */
    onUserTokenSet: (args: Args, log: Log) => void
  }
}

/**
 * Watches for TIP20 token role admin updates.
 *
 * @example
 * ```ts
 * import { createClient, http } from 'viem'
 * import { tempo } from 'tempo/chains'
 * import { tokenActions } from 'tempo/viem'
 *
 * const client = createClient({
 *   chain: tempo,
 *   transport: http(),
 * })
 *
 * const unwatch = tokenActions.watchAdminRole(client, {
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

export namespace watchAdminRole {
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
 * import { tokenActions } from 'tempo/viem'
 *
 * const client = createClient({
 *   chain: tempo,
 *   transport: http(),
 * })
 *
 * const unwatch = tokenActions.watchRole(client, {
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

export namespace watchRole {
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
 * import { tokenActions } from 'tempo/viem'
 *
 * const client = createClient({
 *   account: privateKeyToAccount('0x...'),
 *   chain: tempo,
 *   transport: http(),
 * })
 *
 * const unwatch = tokenActions.watchTransfer(client, {
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

export namespace watchTransfer {
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
