import { afterEach, beforeEach, expect, test } from 'bun:test'
import { setTimeout } from 'node:timers/promises'
import { tempoLocal } from 'tempo/chains'
import { Instance } from 'tempo/prool'
import * as actions from 'tempo/viem/actions'
import { createClient, http, parseEther, publicActions } from 'viem'
import { mnemonicToAccount } from 'viem/accounts'
import { writeContract } from 'viem/actions'
import { tip20Abi } from './abis.js'
import { usdAddress } from './addresses.js'

const instance = Instance.tempo({ port: 8545 })

beforeEach(() => instance.start())
afterEach(() => instance.stop())

const account = mnemonicToAccount(
  'test test test test test test test test test test test junk',
)
const account2 = mnemonicToAccount(
  'test test test test test test test test test test test junk',
  { accountIndex: 1 },
)

const client = createClient({
  account,
  chain: tempoLocal,
  transport: http(),
}).extend(publicActions)

test('createToken', async () => {
  const { address, hash } = await actions.createToken(client, {
    admin: client.account,
    currency: 'USD',
    name: 'Test USD',
    symbol: 'TUSD',
  })

  expect(address).toBeDefined()
  expect(hash).toBeDefined()
})

test.skipIf(!!process.env.CI)('getTokenAllowance', async () => {
  // First, approve some allowance
  await writeContract(client, {
    abi: tip20Abi,
    address: usdAddress,
    functionName: 'approve',
    args: [account2.address, parseEther('50')],
  })
  await setTimeout(100)

  const allowance = await actions.getTokenAllowance(client, {
    spender: account2.address,
  })

  expect(allowance).toBe(parseEther('50'))

  // Test with explicit token
  const allowanceExplicit = await actions.getTokenAllowance(client, {
    token: usdAddress,
    spender: account2.address,
  })

  expect(allowanceExplicit).toBe(parseEther('50'))
})

test.skipIf(!!process.env.CI)('getTokenBalance', async () => {
  const balance = await actions.getTokenBalance(client)

  expect(balance).toBeGreaterThan(0n)

  // Test with explicit token
  const balanceExplicit = await actions.getTokenBalance(client, {
    token: usdAddress,
  })

  expect(balanceExplicit).toBe(balance)

  // Test with different account
  const balance2 = await actions.getTokenBalance(client, {
    account: account2,
  })

  expect(balance2).toBe(0n)
})

test.skipIf(!!process.env.CI)('getTokenMetadata', async () => {
  const metadata = await actions.getTokenMetadata(client)

  expect(metadata).toMatchObject({
    name: 'TestUSD',
    symbol: 'TestUSD',
    currency: 'USD',
    decimals: 6,
    totalSupply: 340282366920938463647842048168863727605n,
  })

  // Test with explicit token
  const metadataExplicit = await actions.getTokenMetadata(client, {
    token: usdAddress,
  })

  expect(metadataExplicit).toMatchObject(metadata)
})

// TODO: fix
test.skip('getTokenMetadata (custom token)', async () => {
  const { address } = await actions.createToken(client, {
    admin: client.account,
    currency: 'USD',
    name: 'Test USD',
    symbol: 'TUSD',
  })

  await setTimeout(100)

  const metadata = await actions.getTokenMetadata(client, {
    token: address,
  })

  expect(metadata).toMatchObject({
    name: 'TestUSD',
    symbol: 'TestUSD',
    currency: 'USD',
    decimals: 6,
    totalSupply: 340282366920938463647842048168863727605n,
  })

  // Test with explicit token
  const metadataExplicit = await actions.getTokenMetadata(client, {
    token: usdAddress,
  })

  expect(metadataExplicit).toMatchObject(metadata)
})

test.skipIf(!!process.env.CI)('getUserToken', async () => {
  // Fund account2
  await writeContract(client, {
    abi: tip20Abi,
    address: usdAddress,
    functionName: 'transfer',
    args: [account2.address, parseEther('100')],
  })
  await setTimeout(100)

  // Set account2 token
  await actions.setUserToken(client, {
    account: account2,
    token: '0x20c0000000000000000000000000000000000001',
  })
  await setTimeout(100)

  // Assert that account (with default) & account2 (with custom) tokens are set correctly.
  expect(await actions.getUserToken(client, { account })).toMatchInlineSnapshot(
    `"0x20C0000000000000000000000000000000000000"`,
  )
  expect(
    await actions.getUserToken(client, { account: account2 }),
  ).toMatchInlineSnapshot(`"0x20C0000000000000000000000000000000000001"`)
})

test.skipIf(!!process.env.CI)('setUserToken', async () => {
  expect(await actions.getUserToken(client)).toMatchInlineSnapshot(
    `"0x20C0000000000000000000000000000000000000"`,
  )

  const hash = await actions.setUserToken(client, {
    token: '0x20c0000000000000000000000000000000000001',
  })

  expect(hash).toBeDefined()

  await setTimeout(10)

  expect(await actions.getUserToken(client, {})).toMatchInlineSnapshot(
    `"0x20C0000000000000000000000000000000000001"`,
  )
})

test.skipIf(!!process.env.CI)('grantTokenRole', async () => {
  // Create a new token where we're the admin
  const { address } = await actions.createToken(client, {
    admin: client.account,
    currency: 'USD',
    name: 'Test Token',
    symbol: 'TEST',
  })

  await setTimeout(100)

  // Grant issuer role to account2
  const grantHash = await actions.grantTokenRole(client, {
    token: address,
    role: 'issuer',
    to: account2.address,
  })

  await setTimeout(100)

  const grantReceipt = await client.getTransactionReceipt({ hash: grantHash })

  expect(grantReceipt.status).toBe('success')
})

test.skipIf(!!process.env.CI)('revokeTokenRole', async () => {
  const { address } = await actions.createToken(client, {
    admin: client.account,
    currency: 'USD',
    name: 'Test Token 2',
    symbol: 'TEST2',
  })

  await setTimeout(100)

  await actions.grantTokenRole(client, {
    token: address,
    role: 'issuer',
    to: account2.address,
  })

  await setTimeout(100)

  const revokeHash = await actions.revokeTokenRole(client, {
    token: address,
    role: 'issuer',
    from: account2.address,
  })

  expect(revokeHash).toBeDefined()

  await setTimeout(100)

  const revokeReceipt = await client.getTransactionReceipt({ hash: revokeHash })
  expect(revokeReceipt.status).toBe('success')
})

// TODO: fix
test.skip('renounceTokenRole', async () => {
  const { address } = await actions.createToken(client, {
    admin: client.account,
    currency: 'USD',
    name: 'Test Token 3',
    symbol: 'TEST3',
  })

  await setTimeout(100)

  await actions.grantTokenRole(client, {
    token: address,
    role: 'issuer',
    to: client.account.address,
  })

  await setTimeout(100)

  const renounceHash = await actions.renounceTokenRole(client, {
    token: address,
    role: 'issuer',
  })

  expect(renounceHash).toBeDefined()

  await setTimeout(100)

  const renounceReceipt = await client.getTransactionReceipt({
    hash: renounceHash,
  })
  expect(renounceReceipt.status).toBe('success')
})
