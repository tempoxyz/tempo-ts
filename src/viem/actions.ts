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
import type { Compute, UnionOmit } from '../internal/types.js'
import * as TokenId from '../ox/TokenId.js'
import * as TokenRole from '../ox/TokenRole.js'
import { feeManagerAbi, tip20Abi, tip20FactoryAbi } from './abis.js'
import {
  feeManagerAddress,
  tip20FactoryAddress,
  usdAddress,
} from './addresses.js'
import type { GetAccountParameter } from './types.js'

const transferPolicy = {
  0: 'always-reject',
  1: 'always-allow',
} as const
type TransferPolicy = ValueOf<typeof transferPolicy>

/**
 * Approves a spender to transfer TIP20 tokens on behalf of the caller.
 *
 * @example
 * TODO
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The transaction hash.
 */
export async function approveTransferToken<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: approveTransferToken.Parameters<chain, account>,
): Promise<approveTransferToken.ReturnType> {
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

export namespace approveTransferToken {
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
 * TODO
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The transaction hash.
 */
export async function burnBlockedToken<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: burnBlockedToken.Parameters<chain, account>,
): Promise<burnBlockedToken.ReturnType> {
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

export namespace burnBlockedToken {
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
 * TODO
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The transaction hash.
 */
export async function burnToken<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: burnToken.Parameters<chain, account>,
): Promise<burnToken.ReturnType> {
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

export namespace burnToken {
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
 * TODO
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The transaction hash.
 */
export async function changeTokenTransferPolicy<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: changeTokenTransferPolicy.Parameters<chain, account>,
): Promise<changeTokenTransferPolicy.ReturnType> {
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

export namespace changeTokenTransferPolicy {
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
 * TODO
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The transaction hash.
 */
export async function createToken<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: createToken.Parameters<chain, account>,
): Promise<createToken.ReturnType> {
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

export namespace createToken {
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
 * TODO
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The token allowance.
 */
export async function getTokenAllowance<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: getTokenAllowance.Parameters<account>,
): Promise<getTokenAllowance.ReturnType> {
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

export namespace getTokenAllowance {
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
 * TODO
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The token balance.
 */
export async function getTokenBalance<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  ...parameters: account extends Account
    ? [getTokenBalance.Parameters<account>] | []
    : [getTokenBalance.Parameters<account>]
): Promise<getTokenBalance.ReturnType> {
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

export namespace getTokenBalance {
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
 * TODO
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The token metadata.
 */
export async function getTokenMetadata<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  parameters: getTokenMetadata.Parameters = {},
): Promise<getTokenMetadata.ReturnType> {
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

export namespace getTokenMetadata {
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
 * TODO
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
 * TODO
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The transaction hash.
 */
export async function grantTokenRoles<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: grantTokenRoles.Parameters<chain, account>,
): Promise<grantTokenRoles.ReturnType> {
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

export namespace grantTokenRoles {
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
 * TODO
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The transaction hash.
 */
export async function mintToken<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: mintToken.Parameters<chain, account>,
): Promise<mintToken.ReturnType> {
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

export namespace mintToken {
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
 * TODO
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The transaction hash.
 */
export async function pauseToken<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: pauseToken.Parameters<chain, account>,
): Promise<pauseToken.ReturnType> {
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

export namespace pauseToken {
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
 * TODO
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The transaction hash.
 */
export async function permitToken<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: permitToken.Parameters<chain, account>,
): Promise<permitToken.ReturnType> {
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

export namespace permitToken {
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
 * TODO
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The transaction hash.
 */
export async function renounceTokenRoles<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: renounceTokenRoles.Parameters<chain, account>,
): Promise<renounceTokenRoles.ReturnType> {
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

export namespace renounceTokenRoles {
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
 * TODO
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The transaction hash.
 */
export async function revokeTokenRoles<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: revokeTokenRoles.Parameters<chain, account>,
): Promise<revokeTokenRoles.ReturnType> {
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

export namespace revokeTokenRoles {
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
 * TODO
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The transaction hash.
 */
export async function setTokenSupplyCap<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: setTokenSupplyCap.Parameters<chain, account>,
): Promise<setTokenSupplyCap.ReturnType> {
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

export namespace setTokenSupplyCap {
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
 * TODO
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The transaction hash.
 */
export async function setTokenRoleAdmin<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: setTokenRoleAdmin.Parameters<chain, account>,
): Promise<setTokenRoleAdmin.ReturnType> {
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

export namespace setTokenRoleAdmin {
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
 * TODO
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
 * TODO
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The transaction hash.
 */
export async function transferToken<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: transferToken.Parameters<chain, account>,
): Promise<transferToken.ReturnType> {
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

export namespace transferToken {
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
 * TODO
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The transaction hash.
 */
export async function unpauseToken<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: unpauseToken.Parameters<chain, account>,
): Promise<unpauseToken.ReturnType> {
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

export namespace unpauseToken {
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
 * Watches for new TIP20 tokens created.
 *
 * @example
 * TODO
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns A function to unsubscribe from the event.
 */
export function watchTokenCreated<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: watchTokenCreated.Parameters,
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

export namespace watchTokenCreated {
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

export type Decorator<
  chain extends Chain | undefined = Chain | undefined,
  account extends Account | undefined = Account | undefined,
> = {
  /**
   * Approves a spender to transfer TIP20 tokens on behalf of the caller.
   *
   * @example
   * TODO
   *
   * @param client - Client.
   * @param parameters - Parameters.
   * @returns The transaction hash.
   */
  approveTransferToken: (
    parameters: approveTransferToken.Parameters<chain, account>,
  ) => Promise<approveTransferToken.ReturnType>
  /**
   * Burns TIP20 tokens from a blocked address.
   *
   * @example
   * TODO
   *
   * @param client - Client.
   * @param parameters - Parameters.
   * @returns The transaction hash.
   */
  burnBlockedToken: (
    parameters: burnBlockedToken.Parameters<chain, account>,
  ) => Promise<burnBlockedToken.ReturnType>
  /**
   * Burns TIP20 tokens from the caller's balance.
   *
   * @example
   * TODO
   *
   * @param client - Client.
   * @param parameters - Parameters.
   * @returns The transaction hash.
   */
  burnToken: (
    parameters: burnToken.Parameters<chain, account>,
  ) => Promise<burnToken.ReturnType>
  /**
   * Changes the transfer policy ID for a TIP20 token.
   *
   * @example
   * TODO
   *
   * @param client - Client.
   * @param parameters - Parameters.
   * @returns The transaction hash.
   */
  changeTokenTransferPolicy: (
    parameters: changeTokenTransferPolicy.Parameters<chain, account>,
  ) => Promise<changeTokenTransferPolicy.ReturnType>
  /**
   * Creates a new TIP20 token.
   *
   * @example
   * TODO
   *
   * @param client - Client.
   * @param parameters - Parameters.
   * @returns The transaction hash.
   */
  createToken: (
    parameters: createToken.Parameters<chain, account>,
  ) => Promise<createToken.ReturnType>
  /**
   * Gets TIP20 token allowance.
   *
   * @example
   * TODO
   *
   * @param client - Client.
   * @param parameters - Parameters.
   * @returns The token allowance.
   */
  getTokenAllowance: (
    parameters: getTokenAllowance.Parameters,
  ) => Promise<getTokenAllowance.ReturnType>
  /**
   * Gets TIP20 token balance for an address.
   *
   * @example
   * TODO
   *
   * @param client - Client.
   * @param parameters - Parameters.
   * @returns The token balance.
   */
  getTokenBalance: (
    ...parameters: account extends Account
      ? [getTokenBalance.Parameters<account>] | []
      : [getTokenBalance.Parameters<account>]
  ) => Promise<getTokenBalance.ReturnType>
  /**
   * Gets TIP20 token metadata including name, symbol, currency, decimals, and total supply.
   *
   * @example
   * TODO
   *
   * @param client - Client.
   * @param parameters - Parameters.
   * @returns The token metadata.
   */
  getTokenMetadata: (
    parameters: getTokenMetadata.Parameters,
  ) => Promise<getTokenMetadata.ReturnType>
  /**
   * Gets the user's default fee token.
   *
   * @example
   * TODO
   *
   * @param client - Client.
   * @param parameters - Parameters.
   * @returns The transaction hash.
   */
  getUserToken: (
    ...parameters: account extends Account
      ? [getUserToken.Parameters<account>] | []
      : [getUserToken.Parameters<account>]
  ) => Promise<getUserToken.ReturnType>
  /**
   * Grants a role for a TIP20 token.
   *
   * @example
   * TODO
   *
   * @param client - Client.
   * @param parameters - Parameters.
   * @returns The transaction hash.
   */
  grantTokenRoles: (
    parameters: grantTokenRoles.Parameters<chain, account>,
  ) => Promise<grantTokenRoles.ReturnType>
  /**
   * Mints TIP20 tokens to an address.
   *
   * @example
   * TODO
   *
   * @param client - Client.
   * @param parameters - Parameters.
   * @returns The transaction hash.
   */
  mintToken: (
    parameters: mintToken.Parameters<chain, account>,
  ) => Promise<mintToken.ReturnType>
  /**
   * Pauses a TIP20 token.
   *
   * @example
   * TODO
   *
   * @param client - Client.
   * @param parameters - Parameters.
   * @returns The transaction hash.
   */
  pauseToken: (
    parameters: pauseToken.Parameters<chain, account>,
  ) => Promise<pauseToken.ReturnType>
  /**
   * Approves a spender using a signed permit.
   *
   * @example
   * TODO
   *
   * @param client - Client.
   * @param parameters - Parameters.
   * @returns The transaction hash.
   */
  permitToken: (
    parameters: permitToken.Parameters<chain, account>,
  ) => Promise<permitToken.ReturnType>
  /**
   * Renounces a role for a TIP20 token.
   *
   * @example
   * TODO
   *
   * @param client - Client.
   * @param parameters - Parameters.
   * @returns The transaction hash.
   */
  renounceTokenRoles: (
    parameters: renounceTokenRoles.Parameters<chain, account>,
  ) => Promise<renounceTokenRoles.ReturnType>
  /**
   * Revokes a role for a TIP20 token.
   *
   * @example
   * TODO
   *
   * @param client - Client.
   * @param parameters - Parameters.
   * @returns The transaction hash.
   */
  revokeTokenRoles: (
    parameters: revokeTokenRoles.Parameters<chain, account>,
  ) => Promise<revokeTokenRoles.ReturnType>
  /**
   * Sets the supply cap for a TIP20 token.
   *
   * @example
   * TODO
   *
   * @param client - Client.
   * @param parameters - Parameters.
   * @returns The transaction hash.
   */
  setTokenSupplyCap: (
    parameters: setTokenSupplyCap.Parameters<chain, account>,
  ) => Promise<setTokenSupplyCap.ReturnType>
  /**
   * Sets the admin role for a specific role in a TIP20 token.
   *
   * @example
   * TODO
   *
   * @param client - Client.
   * @param parameters - Parameters.
   * @returns The transaction hash.
   */
  setTokenRoleAdmin: (
    parameters: setTokenRoleAdmin.Parameters<chain, account>,
  ) => Promise<setTokenRoleAdmin.ReturnType>
  /**
   * Sets the user's default fee token.
   *
   * @example
   * TODO
   *
   * @param client - Client.
   * @param parameters - Parameters.
   * @returns The transaction hash.
   */
  setUserToken: (
    parameters: setUserToken.Parameters<chain, account>,
  ) => Promise<setUserToken.ReturnType>
  /**
   * Transfers TIP20 tokens to another address.
   *
   * @example
   * TODO
   *
   * @param client - Client.
   * @param parameters - Parameters.
   * @returns The transaction hash.
   */
  transferToken: (
    parameters: transferToken.Parameters<chain, account>,
  ) => Promise<transferToken.ReturnType>
  /**
   * Unpauses a TIP20 token.
   *
   * @example
   * TODO
   *
   * @param client - Client.
   * @param parameters - Parameters.
   * @returns The transaction hash.
   */
  unpauseToken: (
    parameters: unpauseToken.Parameters<chain, account>,
  ) => Promise<unpauseToken.ReturnType>
  /**
   * Watches for new TIP20 tokens created.
   *
   * @example
   * TODO
   *
   * @param client - Client.
   * @param parameters - Parameters.
   * @returns A function to unsubscribe from the event.
   */
  watchTokenCreated: (parameters: watchTokenCreated.Parameters) => () => void
}

export function decorator() {
  return <
    transport extends Transport,
    chain extends Chain | undefined,
    account extends Account | undefined,
  >(
    client: Client<transport, chain, account>,
  ): Decorator<chain, account> => {
    return {
      approveTransferToken: (parameters) =>
        approveTransferToken(client, parameters),
      burnBlockedToken: (parameters) => burnBlockedToken(client, parameters),
      burnToken: (parameters) => burnToken(client, parameters),
      changeTokenTransferPolicy: (parameters) =>
        changeTokenTransferPolicy(client, parameters),
      createToken: (parameters) => createToken(client, parameters),
      getTokenAllowance: (parameters) => getTokenAllowance(client, parameters),
      // @ts-expect-error
      getTokenBalance: (parameters) => getTokenBalance(client, parameters),
      getTokenMetadata: (parameters) => getTokenMetadata(client, parameters),
      // @ts-expect-error
      getUserToken: (parameters) => getUserToken(client, parameters),
      grantTokenRoles: (parameters) => grantTokenRoles(client, parameters),
      mintToken: (parameters) => mintToken(client, parameters),
      pauseToken: (parameters) => pauseToken(client, parameters),
      permitToken: (parameters) => permitToken(client, parameters),
      renounceTokenRoles: (parameters) =>
        renounceTokenRoles(client, parameters),
      revokeTokenRoles: (parameters) => revokeTokenRoles(client, parameters),
      setTokenSupplyCap: (parameters) => setTokenSupplyCap(client, parameters),
      setTokenRoleAdmin: (parameters) => setTokenRoleAdmin(client, parameters),
      setUserToken: (parameters) => setUserToken(client, parameters),
      transferToken: (parameters) => transferToken(client, parameters),
      unpauseToken: (parameters) => unpauseToken(client, parameters),
      watchTokenCreated: (parameters) => watchTokenCreated(client, parameters),
    }
  }
}
