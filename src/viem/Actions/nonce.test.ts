import { afterEach, describe, expect, test } from 'vitest'
import { rpcUrl } from '../../../test/config.js'
import { accounts, clientWithAccount } from '../../../test/viem/config.js'
import * as actions from './index.js'

const account = accounts[0]
const account2 = accounts[1]

afterEach(async () => {
  await fetch(`${rpcUrl}/restart`)
})

describe('getNonce', () => {
  test('default', async () => {
    // Get nonce for an account with nonceKey 1
    const nonce = await actions.nonce.getNonce(clientWithAccount, {
      account: account.address,
      nonceKey: 1n,
    })

    // Should return current nonce value (bigint)
    expect(typeof nonce).toBe('bigint')
  })

  test('behavior: different nonce keys are independent', async () => {
    // Get nonces for different keys
    const nonce1 = await actions.nonce.getNonce(clientWithAccount, {
      account: account.address,
      nonceKey: 1n,
    })
    const nonce2 = await actions.nonce.getNonce(clientWithAccount, {
      account: account.address,
      nonceKey: 2n,
    })
    const nonce100 = await actions.nonce.getNonce(clientWithAccount, {
      account: account.address,
      nonceKey: 100n,
    })

    // All should return bigint values
    expect(typeof nonce1).toBe('bigint')
    expect(typeof nonce2).toBe('bigint')
    expect(typeof nonce100).toBe('bigint')
  })

  test('behavior: different accounts are independent', async () => {
    const nonce1 = await actions.nonce.getNonce(clientWithAccount, {
      account: account.address,
      nonceKey: 1n,
    })
    const nonce2 = await actions.nonce.getNonce(clientWithAccount, {
      account: account2.address,
      nonceKey: 1n,
    })

    // Both should return bigint values
    expect(typeof nonce1).toBe('bigint')
    expect(typeof nonce2).toBe('bigint')
  })
})

describe('getActiveNonceKeyCount', () => {
  test('default', async () => {
    // Get active nonce key count for a fresh account
    const count = await actions.nonce.getActiveNonceKeyCount(clientWithAccount, {
      account: account.address,
    })

    // Fresh account should have 0 active nonce keys
    expect(count).toBe(0n)
  })

  test('behavior: different accounts are independent', async () => {
    const count1 = await actions.nonce.getActiveNonceKeyCount(
      clientWithAccount,
      {
        account: account.address,
      },
    )
    const count2 = await actions.nonce.getActiveNonceKeyCount(
      clientWithAccount,
      {
        account: account2.address,
      },
    )

    // Both should be 0 for fresh accounts
    expect(count1).toBe(0n)
    expect(count2).toBe(0n)
  })
})

// Note: Watch tests would require triggering transactions that use specific
// nonce keys, which happens at the protocol level during AA transactions.
// These events are emitted when: NonceIncremented is triggered on nonce use,
// and ActiveKeyCountChanged when a new nonce key is first used.
describe.todo('watchNonceIncremented')
describe.todo('watchActiveKeyCountChanged')
