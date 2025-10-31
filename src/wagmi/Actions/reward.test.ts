import { getAccount } from '@wagmi/core'
import { parseEther } from 'viem'
import { describe, expect, test } from 'vitest'
import { config, queryClient, setupToken } from '../../../test/wagmi/config.js'
import * as actions from './reward.js'

describe('cancelSync', () => {
  test('default', async () => {
    const { token } = await setupToken()

    // Start a reward stream
    const rewardAmount = parseEther('100')
    const { id: streamId } = await actions.startSync(config, {
      amount: rewardAmount,
      seconds: 3600,
      token,
    })

    // Cancel the reward
    const { receipt, refund, ...result } = await actions.cancelSync(config, {
      id: streamId,
      token,
    })

    expect(refund).toBeGreaterThan(0n)
    expect(receipt).toBeDefined()
    expect(result.funder).toBeDefined()
    expect(result.id).toBe(streamId)
  })
})

describe('getStream', () => {
  test('default', async () => {
    const { token } = await setupToken()

    // Start a reward stream
    const rewardAmount = parseEther('100')
    const { id: streamId } = await actions.startSync(config, {
      amount: rewardAmount,
      seconds: 10,
      token,
    })

    // Get the stream
    const stream = await actions.getStream(config, {
      id: streamId,
      token,
    })

    expect(stream.funder).toBeDefined()
    expect(stream.amountTotal).toBe(rewardAmount)
    expect(stream.endTime).toBeGreaterThan(stream.startTime)
    expect(stream.ratePerSecondScaled).toBeGreaterThan(0n)
  })

  describe('queryOptions', () => {
    test('default', async () => {
      const { token } = await setupToken()

      // Start a reward stream
      const rewardAmount = parseEther('100')
      const { id: streamId } = await actions.startSync(config, {
        amount: rewardAmount,
        seconds: 10,
        token,
      })

      const options = actions.getStream.queryOptions(config, {
        id: streamId,
        token,
      })

      const stream = await queryClient.fetchQuery(options)

      expect(stream.funder).toBeDefined()
      expect(stream.amountTotal).toBe(rewardAmount)
    })
  })
})

describe('getTotalPerSecond', () => {
  test('default', async () => {
    const { token } = await setupToken()

    const rate = await actions.getTotalPerSecond(config, {
      token,
    })

    expect(rate).toBe(0n)
  })

  describe('queryOptions', () => {
    test('default', async () => {
      const { token } = await setupToken()

      const options = actions.getTotalPerSecond.queryOptions(config, {
        token,
      })

      const rate = await queryClient.fetchQuery(options)

      expect(rate).toBe(0n)
    })
  })
})

describe('setRecipientSync', () => {
  test('default', async () => {
    const { token } = await setupToken()

    const account = getAccount(config)

    // Set reward recipient
    const { holder, receipt, recipient } = await actions.setRecipientSync(
      config,
      {
        recipient: account.address!,
        token,
      },
    )

    expect(receipt).toBeDefined()
    expect(holder).toBe(account.address)
    expect(recipient).toBe(account.address)
  })
})

describe('startSync', () => {
  test('default', async () => {
    const { token } = await setupToken()

    const account = getAccount(config)

    // Start a reward stream
    const rewardAmount = parseEther('100')
    const duration = 10
    const { amount, durationSeconds, funder, id, receipt } =
      await actions.startSync(config, {
        amount: rewardAmount,
        seconds: duration,
        token,
      })

    expect(receipt).toBeDefined()
    expect(funder).toBe(account.address)
    expect(id).toBeGreaterThan(0n)
    expect(amount).toBe(rewardAmount)
    expect(durationSeconds).toBe(duration)
  })
})
