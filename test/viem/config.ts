import type { FixedArray } from '@wagmi/core/internal'
import * as Mnemonic from 'ox/Mnemonic'
// biome-ignore lint/correctness/noUnusedImports: imported for inference
import { TokenId as _ } from 'ox/tempo'
import {
  type Account,
  type Address,
  type Chain,
  type Client,
  type ClientConfig,
  createClient,
  defineChain,
  type HttpTransportConfig,
  parseUnits,
  type Transport,
  http as viem_http,
} from 'viem'
import { english, generateMnemonic } from 'viem/accounts'
import { sendTransactionSync } from 'viem/actions'
import { tempoDevnet, tempoLocalnet, tempoTestnet } from 'viem/chains'
import { Actions, Addresses, Tick, Account as tempo_Account } from 'viem/tempo'
import { addresses, fetchOptions, nodeEnv, rpcUrl } from '../config.js'

const accountsMnemonic = (() => {
  if (nodeEnv === 'localnet')
    return 'test test test test test test test test test test test junk'
  return generateMnemonic(english)
})()

export const accounts = Array.from({ length: 20 }, (_, i) => {
  const privateKey = Mnemonic.toPrivateKey(accountsMnemonic, {
    as: 'Hex',
    path: Mnemonic.path({ account: i }),
  })
  return tempo_Account.fromSecp256k1(privateKey)
}) as unknown as FixedArray<tempo_Account.RootAccount, 20>

export const tempoTest = defineChain({
  ...tempoLocalnet,
  rpcUrls: {
    default: {
      http: [rpcUrl],
    },
  },
})

export const chainFn = (() => {
  const env = import.meta.env.VITE_NODE_ENV
  if (env === 'testnet') return tempoTestnet
  if (env === 'devnet') return tempoDevnet
  return tempoTest
})()
export const chain = chainFn.extend({ feeToken: 1n })

export function debugOptions({
  rpcUrl,
}: {
  rpcUrl: string
}): HttpTransportConfig | undefined {
  if (import.meta.env.VITE_HTTP_LOG !== 'true') return undefined
  return {
    async onFetchRequest(_, init) {
      console.log(`curl \\
${rpcUrl} \\
-X POST \\
-H "Content-Type: application/json" \\
-d '${JSON.stringify(JSON.parse(init.body as string))}'`)
    },
    async onFetchResponse(response) {
      console.log(`> ${JSON.stringify(await response.clone().json())}`)
    },
  }
}

export const http = (url?: string | undefined) =>
  viem_http(url, {
    fetchOptions,
    ...debugOptions({
      rpcUrl,
    }),
  })

export function getClient<
  accountOrAddress extends Account | Address | undefined = undefined,
>(
  parameters: Partial<
    Pick<
      ClientConfig<Transport, typeof chain, accountOrAddress>,
      'account' | 'transport'
    >
  > = {},
) {
  return createClient({
    pollingInterval: 100,
    chain,
    transport: http(),
    ...parameters,
  })
}

export const client = getClient()
export const clientWithAccount = getClient({
  account: accounts.at(0)!,
})

export async function fundAddress(
  client: Client<Transport, Chain>,
  parameters: fundAddress.Parameters,
) {
  const { address } = parameters
  const account = accounts.at(0)!
  if (account.address === address) return
  await Actions.token.transferSync(client, {
    account,
    amount: parseUnits('10000', 6),
    to: address,
    token: 1n,
  })
}

export declare namespace fundAddress {
  export type Parameters = {
    /** Account to fund. */
    address: Address
  }
}

export async function setupToken(
  client: Client<Transport, Chain, Account>,
  parameters: Partial<
    Awaited<ReturnType<typeof Actions.token.createSync>>
  > = {},
) {
  const token = await Actions.token.createSync(client, {
    currency: 'USD',
    name: 'Test Token',
    symbol: 'TST',
    ...parameters,
  })

  await Actions.token.grantRolesSync(client, {
    roles: ['issuer'],
    to: client.account.address,
    token: token.token,
  })

  await Actions.token.mintSync(client, {
    amount: parseUnits('10000', 6),
    to: client.account.address,
    token: token.token,
  })

  return token
}

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
    amount: parseUnits('1000', 6),
    token,
  })

  // Add liquidity to pool
  await Actions.amm.mintSync(client, {
    userTokenAddress: token,
    validatorTokenAddress: addresses.alphaUsd,
    validatorTokenAmount: parseUnits('100', 6),
    to: client.account.address,
  })

  return { tokenAddress: token }
}

export async function setupTokenPair(
  client: Client<Transport, typeof chain, Account>,
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

  await sendTransactionSync(client, {
    calls: [
      Actions.token.grantRoles.call({
        token: baseToken,
        role: 'issuer',
        to: client.account.address,
      }),
      Actions.token.grantRoles.call({
        token: quoteToken,
        role: 'issuer',
        to: client.account.address,
      }),
      Actions.token.mint.call({
        token: baseToken,
        to: client.account.address,
        amount: parseUnits('10000', 6),
      }),
      Actions.token.mint.call({
        token: quoteToken,
        to: client.account.address,
        amount: parseUnits('10000', 6),
      }),
      Actions.token.approve.call({
        token: baseToken,
        spender: Addresses.stablecoinExchange,
        amount: parseUnits('10000', 6),
      }),
      Actions.token.approve.call({
        token: quoteToken,
        spender: Addresses.stablecoinExchange,
        amount: parseUnits('10000', 6),
      }),
    ],
  })

  // Create the pair on the DEX
  return await Actions.dex.createPairSync(client, {
    base: baseToken,
  })
}

export async function setupOrders(
  client: Client<Transport, typeof chain, Account>,
) {
  const { base: base1 } = await setupTokenPair(client)
  const { base: base2 } = await setupTokenPair(client)

  const bases = [base1, base2]

  // Create 50 orders with varying amounts, ticks, and tokens
  const calls = []
  for (let i = 0; i < 50; i++) {
    const token = bases[i % bases.length]!
    const amount = parseUnits(String(50 + i * 10), 6)
    const isBuy = i % 2 === 0
    const tickPrice = 1.0 + ((i % 20) - 10) * 0.001
    const tick = Tick.fromPrice(String(tickPrice))

    calls.push(
      Actions.dex.place.call({
        token,
        amount,
        type: isBuy ? 'buy' : 'sell',
        tick,
      }),
    )
  }

  await sendTransactionSync(client, { calls } as never)

  return { bases }
}
