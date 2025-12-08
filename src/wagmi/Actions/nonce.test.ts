import { connect } from '@wagmi/core'
import { afterEach, describe, expect, test } from 'vitest'
import { rpcUrl } from '../../../test/config.js'
import { accounts } from '../../../test/viem/config.js'
import { config, queryClient } from '../../../test/wagmi/config.js'
import * as nonce from './nonce.js'
import * as token from './token.js'

const { getNonceKeyCount, getNonce } = nonce

const account = accounts[0]
const account2 = accounts[1]

afterEach(async () => {
  await fetch(`${rpcUrl}/restart`)
})

describe('getNonce', () => {
  test('default', async () => {
    const result = await getNonce(config, {
      account: account.address,
      nonceKey: 1n,
    })
    expect(result).toBe(1n)
  })

  describe('queryOptions', () => {
    test('default', async () => {
      const options = getNonce.queryOptions(config, {
        account: account.address,
        nonceKey: 1n,
      })
      const result = await queryClient.fetchQuery(options)
      expect(result).toBe(1n)
    })
  })
})

describe('getNonceKeyCount', () => {
  test('default', async () => {
    const result = await getNonceKeyCount(config, {
      account: account.address,
    })
    expect(result).toBe(0n)
  })

  describe('queryOptions', () => {
    test('default', async () => {
      const options = getNonceKeyCount.queryOptions(config, {
        account: account.address,
      })
      expect(await queryClient.fetchQuery(options)).toBe(0n)
    })
  })
})

describe('watchNonceIncremented', () => {
  test('default', async () => {
    await connect(config, {
      connector: config.connectors[0]!,
    })

    const events: any[] = []
    const unwatch = nonce.watchNonceIncremented(config, {
      onNonceIncremented: (args) => {
        events.push(args)
      },
      args: {
        account: account.address,
        nonceKey: 5n,
      },
    })

    // Have to manually set nonce because eth_FillTransaction does not support nonce keys
    await token.transferSync(config, {
      to: account2.address,
      amount: 1n,
      token: 1n,
      nonceKey: 5n,
      nonce: 0,
    })

    await token.transferSync(config, {
      to: account2.address,
      amount: 1n,
      token: 1n,
      nonceKey: 5n,
      nonce: 1,
    })

    await new Promise((resolve) => setTimeout(resolve, 1000))

    expect(events).toHaveLength(2)
    expect(events[0]?.account).toBe(account.address)
    expect(events[0]?.nonceKey).toBe(5n)
    expect(events[0]?.newNonce).toBe(1n)
    expect(events[1]?.newNonce).toBe(2n)
    unwatch()
  })
})

describe('watchActiveKeyCountChanged', () => {
  test('default', async () => {
    await connect(config, {
      connector: config.connectors[0]!,
    })

    const events: any[] = []
    const unwatch = nonce.watchActiveKeyCountChanged(config, {
      onActiveKeyCountChanged: (args) => {
        events.push(args)
      },
    })

    // First use of nonceKey 10 should increment active key count
    await token.transferSync(config, {
      to: account2.address,
      amount: 1n,
      token: 1n,
      nonceKey: 10n,
      nonce: 0,
    })

    // First use of nonceKey 11 should increment again
    await token.transferSync(config, {
      to: account2.address,
      amount: 1n,
      token: 1n,
      nonceKey: 11n,
      nonce: 0,
    })

    await new Promise((resolve) => setTimeout(resolve, 1000))

    expect(events).toHaveLength(2)
    expect(events[0]?.account).toBe(account.address)
    expect(events[0]?.newCount).toBe(1n)
    expect(events[1]?.newCount).toBe(2n)
    unwatch()
  })
})
