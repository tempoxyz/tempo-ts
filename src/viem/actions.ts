import type {
  Account,
  Address,
  Chain,
  Client,
  ReadContractParameters,
  ReadContractReturnType,
  Transport,
  WriteContractParameters,
  WriteContractReturnType,
} from 'viem'
import { parseAccount } from 'viem/accounts'
import { readContract, writeContract } from 'viem/actions'
import type { UnionOmit } from '../internal/types.js'
import { feeManagerAbi, tip20FactoryAbi } from './abis.js'
import { feeManagerAddress, tip20FactoryAddress } from './addresses.js'
import type { GetAccountParameter } from './types.js'

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
export function createTip20Token<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: createTip20Token.Parameters<chain, account>,
): Promise<createTip20Token.ReturnType> {
  const {
    account = client.account,
    chain = client.chain,
    name,
    symbol,
    currency,
    admin,
  } = parameters
  return writeContract(client, {
    ...parameters,
    account,
    address: tip20FactoryAddress,
    abi: tip20FactoryAbi,
    chain,
    functionName: 'createToken',
    args: [name, symbol, currency, admin],
  } as never)
}

export namespace createTip20Token {
  export type Parameters<
    chain extends Chain | undefined = Chain | undefined,
    account extends Account | undefined = Account | undefined,
  > = UnionOmit<
    WriteContractParameters<never, never, never, chain, account>,
    'abi' | 'address' | 'functionName' | 'args'
  > & {
    admin: Address
    currency: string
    name: string
    symbol: string
  }

  export type ReturnType = WriteContractReturnType
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
