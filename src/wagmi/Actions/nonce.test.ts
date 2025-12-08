import { describe, expect, test } from 'vitest'
import { accounts } from '../../../test/viem/config.js'
import { config, queryClient } from '../../../test/wagmi/config.js'
import { getActiveNonceKeyCount, getNonce } from './nonce.js'

const account = accounts[0]

describe('getNonce', () => {
  test('default', async () => {
    const result = await getNonce(config, {
      account: account.address,
      nonceKey: 1n,
    })
    expect(typeof result).toBe('bigint')
  })

  describe('queryOptions', () => {
    test('default', async () => {
      const options = getNonce.queryOptions(config, {
        account: account.address,
        nonceKey: 1n,
      })
      const result = await queryClient.fetchQuery(options)
      expect(typeof result).toBe('bigint')
    })
  })
})

describe('getActiveNonceKeyCount', () => {
  test('default', async () => {
    const result = await getActiveNonceKeyCount(config, {
      account: account.address,
    })
    expect(result).toBe(0n)
  })

  describe('queryOptions', () => {
    test('default', async () => {
      const options = getActiveNonceKeyCount.queryOptions(config, {
        account: account.address,
      })
      expect(await queryClient.fetchQuery(options)).toBe(0n)
    })
  })
})

// Note: Watch action tests would require triggering transactions that use specific
// nonce keys, which happens at the protocol level during AA transactions.
describe.todo('watchNonceIncremented')
describe.todo('watchActiveKeyCountChanged')
