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

test.skipIf(!!process.env.CI)('createTip20Token', async () => {
  const hash = await actions.createTip20Token(client, {
    admin: client.account.address,
    currency: 'USD',
    name: 'Test USD',
    symbol: 'TUSD',
  })

  expect(hash).toBeDefined()
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
