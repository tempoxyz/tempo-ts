import {
  type Account,
  type Address,
  type Chain,
  type Client,
  type Hex,
  keccak256,
  type ReadContractParameters,
  type ReadContractReturnType,
  stringToHex,
  type Transport,
  type WriteContractParameters,
  type WriteContractReturnType,
} from 'viem'
import { parseAccount } from 'viem/accounts'
import {
  multicall,
  readContract,
  simulateContract,
  writeContract,
} from 'viem/actions'
import type { UnionOmit } from '../internal/types.js'
import { feeManagerAbi, tip20Abi, tip20FactoryAbi } from './abis.js'
import {
  feeManagerAddress,
  tip20FactoryAddress,
  usdAddress,
} from './addresses.js'
import type { GetAccountParameter } from './types.js'

const tokenRole = {
  defaultAdmin:
    '0x0000000000000000000000000000000000000000000000000000000000000000',
  pause: keccak256(stringToHex('PAUSE_ROLE')),
  unpause: keccak256(stringToHex('UNPAUSE_ROLE')),
  issuer: keccak256(stringToHex('ISSUER_ROLE')),
  burnBlocked: keccak256(stringToHex('BURN_BLOCKED_ROLE')),
}
type TokenRole = keyof typeof tokenRole

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
    chain = client.chain,
    name,
    symbol,
    currency,
  } = parameters
  const admin = parseAccount(parameters.admin)
  const { request, result } = await simulateContract(client, {
    ...parameters,
    account,
    address: tip20FactoryAddress,
    abi: tip20FactoryAbi,
    chain,
    functionName: 'createToken',
    args: [name, symbol, currency, admin.address],
  } as never)
  const hash = await writeContract(client as never, request as never)
  return {
    address: result as Address,
    hash,
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
    admin: Account | Address
    currency: string
    name: string
    symbol: string
  }

  export type ReturnType = {
    address: Address
    hash: Hex
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
export function getTokenAllowance<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: getTokenAllowance.Parameters<account>,
): Promise<getTokenAllowance.ReturnType> {
  const { account = client.account, token = usdAddress, spender } = parameters
  const address = account ? parseAccount(account).address : undefined
  if (!address) throw new Error('account is required.')
  return readContract(client, {
    ...parameters,
    address: token,
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
      token?: Address | undefined
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
export function getTokenBalance<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  ...parameters: account extends Account
    ? [getTokenBalance.Parameters<account>] | []
    : [getTokenBalance.Parameters<account>]
): Promise<getTokenBalance.ReturnType> {
  const { account = client.account, token = usdAddress } = parameters[0] ?? {}
  const address = account ? parseAccount(account).address : undefined
  if (!address) throw new Error('account is required.')
  return readContract(client, {
    ...parameters,
    address: token,
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
      token?: Address | undefined
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
export function getTokenMetadata<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  parameters: getTokenMetadata.Parameters = {},
): Promise<getTokenMetadata.ReturnType> {
  const { token = usdAddress, ...rest } = parameters
  return multicall(client, {
    ...rest,
    contracts: [
      {
        address: token,
        abi: tip20Abi,
        functionName: 'name',
      },
      {
        address: token,
        abi: tip20Abi,
        functionName: 'symbol',
      },
      {
        address: token,
        abi: tip20Abi,
        functionName: 'currency',
      },
      {
        address: token,
        abi: tip20Abi,
        functionName: 'decimals',
      },
      {
        address: token,
        abi: tip20Abi,
        functionName: 'totalSupply',
      },
    ] as const,
    allowFailure: false,
    deployless: true,
  }).then(([name, symbol, currency, decimals, totalSupply]) => ({
    name,
    symbol,
    currency,
    decimals,
    totalSupply,
  }))
}

export namespace getTokenMetadata {
  export type Parameters = {
    token?: Address | undefined
  }

  export type ReturnType = {
    name: string
    symbol: string
    currency: string
    decimals: number
    totalSupply: bigint
  }
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
export function getUserToken<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  ...parameters: account extends Account
    ? [getUserToken.Parameters<account>] | []
    : [getUserToken.Parameters<account>]
): Promise<getUserToken.ReturnType> {
  const { account: account_ = client.account } = parameters[0] ?? {}
  if (!account_) throw new Error('account is required.')
  const account = parseAccount(account_)
  return readContract(client, {
    ...parameters,
    address: feeManagerAddress,
    abi: feeManagerAbi,
    functionName: 'userTokens',
    args: [account.address],
  })
}

export namespace getUserToken {
  export type Parameters<
    account extends Account | undefined = Account | undefined,
  > = UnionOmit<
    ReadContractParameters<never, never, never>,
    'abi' | 'address' | 'functionName' | 'args'
  > &
    GetAccountParameter<account>

  export type ReturnType = ReadContractReturnType<
    typeof feeManagerAbi,
    'userTokens',
    never
  >
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
export function grantTokenRole<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: grantTokenRole.Parameters<chain, account>,
): Promise<grantTokenRole.ReturnType> {
  const {
    account = client.account,
    chain = client.chain,
    token,
    to,
  } = parameters
  const role = tokenRole[parameters.role]
  return writeContract(client, {
    ...parameters,
    account,
    address: token,
    abi: tip20Abi,
    chain,
    functionName: 'grantRole',
    args: [role, to],
  } as never)
}

export namespace grantTokenRole {
  export type Parameters<
    chain extends Chain | undefined = Chain | undefined,
    account extends Account | undefined = Account | undefined,
  > = UnionOmit<
    WriteContractParameters<never, never, never, chain, account>,
    'abi' | 'address' | 'functionName' | 'args'
  > & {
    token: Address
    role: TokenRole
    to: Address
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
export function renounceTokenRole<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: renounceTokenRole.Parameters<chain, account>,
): Promise<renounceTokenRole.ReturnType> {
  const { account = client.account, chain = client.chain, token } = parameters
  const role = tokenRole[parameters.role]
  return writeContract(client, {
    ...parameters,
    account,
    address: token,
    abi: tip20Abi,
    chain,
    functionName: 'renounceRole',
    args: [role],
  } as never)
}

export namespace renounceTokenRole {
  export type Parameters<
    chain extends Chain | undefined = Chain | undefined,
    account extends Account | undefined = Account | undefined,
  > = UnionOmit<
    WriteContractParameters<never, never, never, chain, account>,
    'abi' | 'address' | 'functionName' | 'args'
  > & {
    token: Address
    role: TokenRole
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
export function revokeTokenRole<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: revokeTokenRole.Parameters<chain, account>,
): Promise<revokeTokenRole.ReturnType> {
  const {
    account = client.account,
    chain = client.chain,
    token,
    from,
  } = parameters
  const role = tokenRole[parameters.role]
  return writeContract(client, {
    ...parameters,
    account,
    address: token,
    abi: tip20Abi,
    chain,
    functionName: 'revokeRole',
    args: [role, from],
  } as never)
}

export namespace revokeTokenRole {
  export type Parameters<
    chain extends Chain | undefined = Chain | undefined,
    account extends Account | undefined = Account | undefined,
  > = UnionOmit<
    WriteContractParameters<never, never, never, chain, account>,
    'abi' | 'address' | 'functionName' | 'args'
  > & {
    from: Address
    role: TokenRole
    token: Address
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
export function setUserToken<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: setUserToken.Parameters<chain, account>,
): Promise<setUserToken.ReturnType> {
  const { account = client.account, chain = client.chain, token } = parameters
  return writeContract(client, {
    ...parameters,
    account,
    address: feeManagerAddress,
    abi: feeManagerAbi,
    chain,
    functionName: 'setUserToken',
    args: [token],
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
    token: Address
  }

  export type ReturnType = WriteContractReturnType
}

export type Decorator<
  chain extends Chain | undefined = Chain | undefined,
  account extends Account | undefined = Account | undefined,
> = {
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
  grantTokenRole: (
    parameters: grantTokenRole.Parameters<chain, account>,
  ) => Promise<grantTokenRole.ReturnType>
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
  renounceTokenRole: (
    parameters: renounceTokenRole.Parameters<chain, account>,
  ) => Promise<renounceTokenRole.ReturnType>
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
  revokeTokenRole: (
    parameters: revokeTokenRole.Parameters<chain, account>,
  ) => Promise<revokeTokenRole.ReturnType>
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
}

export function decorator<
  transport extends Transport,
  chain extends Chain | undefined,
  account extends Account | undefined,
>(client: Client<transport, chain, account>): Decorator<chain, account> {
  return {
    createToken: (parameters) => createToken(client, parameters),
    getTokenAllowance: (parameters) => getTokenAllowance(client, parameters),
    // @ts-expect-error
    getTokenBalance: (parameters) => getTokenBalance(client, parameters),
    getTokenMetadata: (parameters) => getTokenMetadata(client, parameters),
    // @ts-expect-error
    getUserToken: (parameters) => getUserToken(client, parameters),
    grantTokenRole: (parameters) => grantTokenRole(client, parameters),
    renounceTokenRole: (parameters) => renounceTokenRole(client, parameters),
    revokeTokenRole: (parameters) => revokeTokenRole(client, parameters),
    setUserToken: (parameters) => setUserToken(client, parameters),
  }
}
