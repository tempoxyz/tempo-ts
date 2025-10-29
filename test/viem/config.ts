import type { FixedArray } from '@wagmi/core/internal'
import { Actions, Addresses } from 'tempo.ts/viem'
import {
  type Account,
  type Chain,
  type Client,
  defineChain,
  type LocalAccount,
  parseEther,
  type Transport,
} from 'viem'
import { mnemonicToAccount } from 'viem/accounts'
import { tempoLocal } from '../../src/chains.js'
import { createTempoClient } from '../../src/viem/Client.js'

export const accounts = Array.from({ length: 20 }, (_, i) =>
  mnemonicToAccount(
    'test test test test test test test test test test test junk',
    {
      accountIndex: i,
    },
  ),
) as unknown as FixedArray<LocalAccount, 20>

export const id =
  (typeof process !== 'undefined' &&
    Number(process.env.VITEST_POOL_ID ?? 1) +
      Math.floor(Math.random() * 10_000)) ||
  1 + Math.floor(Math.random() * 10_000)

export const rpcUrl = `http://localhost:8545/${id}`

export const tempoTest = defineChain({
  ...tempoLocal,
  rpcUrls: {
    default: {
      http: [rpcUrl],
    },
  },
})

export const client = createTempoClient({
  account: accounts[0],
  chain: tempoTest,
  pollingInterval: 100,
})

export async function setupPoolWithLiquidity(
  client: Client<Transport, Chain, Account>,
) {
  // Create a new token for testing
  const { token } = await Actions.token.createSync(client, {
    name: 'Test Token',
    symbol: 'TEST',
    currency: 'USD',
  })

  // Grant issuer role to mint tokens
  await Actions.token.grantRolesSync(client, {
    token,
    roles: ['issuer'],
    to: client.account.address,
  })

  // Mint some tokens to account
  await Actions.token.mintSync(client, {
    to: client.account.address,
    amount: parseEther('1000'),
    token,
  })

  // Add liquidity to pool
  await Actions.amm.mintSync(client, {
    userToken: {
      address: token,
      amount: parseEther('100'),
    },
    validatorToken: {
      address: Addresses.defaultFeeToken,
      amount: parseEther('100'),
    },
    to: client.account.address,
  })

  return { tokenAddress: token }
}

export async function setupTokenPair(
  client: Client<Transport, Chain, Account>,
) {
  // Create quote token
  const { token: quoteToken } = await Actions.token.createSync(client, {
    name: 'Test Quote Token',
    symbol: 'QUOTE',
    currency: 'USD',
  })

  // Create base token
  const { token: baseToken } = await Actions.token.createSync(client, {
    name: 'Test Base Token',
    symbol: 'BASE',
    currency: 'USD',
    quoteToken,
  })

  // Grant issuer role to mint base tokens
  await Actions.token.grantRolesSync(client, {
    token: baseToken,
    roles: ['issuer'],
    to: client.account.address,
  })

  // Grant issuer role to mint quote tokens
  await Actions.token.grantRolesSync(client, {
    token: quoteToken,
    roles: ['issuer'],
    to: client.account.address,
  })

  // Mint base tokens
  await Actions.token.mintSync(client, {
    token: baseToken,
    to: client.account.address,
    amount: parseEther('10000'),
  })

  // Mint quote tokens
  await Actions.token.mintSync(client, {
    token: quoteToken,
    to: client.account.address,
    amount: parseEther('10000'),
  })

  // Approve DEX to spend base tokens
  await Actions.token.approveSync(client, {
    token: baseToken,
    spender: Addresses.stablecoinExchange,
    amount: parseEther('10000'),
  })

  // Approve DEX to spend quote tokens
  await Actions.token.approveSync(client, {
    token: quoteToken,
    spender: Addresses.stablecoinExchange,
    amount: parseEther('10000'),
  })

  // Create the pair on the DEX
  return await Actions.dex.createPairSync(client, {
    base: baseToken,
  })
}
