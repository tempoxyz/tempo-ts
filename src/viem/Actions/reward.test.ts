import { parseEther, parseUnits } from 'viem'
import { describe, expect, test } from 'vitest'
import { client, setupToken } from '../../../test/viem/config.js'
import * as actions from './index.js'

const account = client.account

describe('cancelSync', () => {
  test('default', async () => {
    const { token } = await setupToken(client)

    // Start a reward stream with longer duration
    const rewardAmount = parseUnits('100', 6)
    const { id: streamId } = await actions.reward.startSync(client, {
      amount: rewardAmount,
      seconds: 3600, // 1 hour to avoid stream ending during test
      token,
    })

    // Cancel the reward
    const { receipt, refund, ...result } = await actions.reward.cancelSync(
      client,
      {
        id: streamId,
        token,
      },
    )

    expect(refund).toBeGreaterThan(0n)
    expect(receipt).toBeDefined()
    expect(result).toMatchInlineSnapshot(`
      {
        "funder": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        "id": 1n,
      }
    `)
  })
})

// TODO: unskip
describe.skip('claimSync', () => {
  test('default', async () => {
    const { token } = await setupToken(client)

    const balanceBefore = await actions.token.getBalance(client, {
      token,
    })

    // Opt in to rewards
    await actions.reward.setRecipientSync(client, {
      recipient: account.address,
      token,
    })

    // Mint reward tokens
    const rewardAmount = parseUnits('100', 6)
    await actions.token.mintSync(client, {
      amount: rewardAmount,
      to: account.address,
      token,
    })

    // Start immediate reward to distribute rewards
    await actions.reward.startSync(client, {
      amount: rewardAmount,
      seconds: 0,
      token,
    })

    // Trigger reward accrual by transferring
    await actions.token.transferSync(client, {
      amount: 1n,
      to: '0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC',
      token,
    })

    // Claim rewards
    await actions.reward.claimSync(client, {
      token,
    })

    const balanceAfter = await actions.token.getBalance(client, {
      token,
    })

    expect(balanceAfter).toBeGreaterThan(
      balanceBefore + rewardAmount - parseUnits('1', 6),
    )
  })

  test('behavior: claiming from streaming reward', async () => {
    const { token } = await setupToken(client)

    const balanceBefore = await actions.token.getBalance(client, {
      token,
    })

    // Mint tokens to have balance
    const mintAmount = parseUnits('1000', 6)
    await actions.token.mintSync(client, {
      amount: mintAmount,
      to: account.address,
      token,
    })

    // Opt in to rewards
    await actions.reward.setRecipientSync(client, {
      recipient: account.address,
      token,
    })

    // Mint reward tokens
    const rewardAmount = parseUnits('100', 6)
    await actions.token.mintSync(client, {
      amount: rewardAmount,
      to: account.address,
      token,
    })

    // Start a streaming reward (not immediate)
    await actions.reward.startSync(client, {
      amount: rewardAmount,
      seconds: 10,
      token,
    })

    // Wait a bit and trigger accrual by transferring
    await new Promise((resolve) => setTimeout(resolve, 2000))
    await actions.token.transferSync(client, {
      amount: 1n,
      to: '0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC',
      token,
    })

    // Claim accumulated rewards from the stream
    await actions.reward.claimSync(client, {
      token,
    })

    const balanceAfter = await actions.token.getBalance(client, {
      token,
    })

    // Should have accumulated some rewards (at least 10% of total after 2 seconds)
    expect(balanceAfter).toBeGreaterThan(balanceBefore + rewardAmount / 10n)
  })
})

describe('getStream', () => {
  test('default', async () => {
    const { token } = await setupToken(client)

    // Start a reward stream
    const rewardAmount = parseUnits('100', 6)
    const duration = 10
    const { id: streamId } = await actions.reward.startSync(client, {
      amount: rewardAmount,
      seconds: duration,
      token,
    })

    // Get the stream
    const { endTime, startTime, ...stream } = await actions.reward.getStream(
      client,
      {
        id: streamId,
        token,
      },
    )

    expect(startTime).toBeGreaterThan(0)
    expect(endTime).toBeGreaterThan(startTime)
    expect(stream).toMatchInlineSnapshot(`
      {
        "amountTotal": 100000000n,
        "funder": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        "ratePerSecondScaled": 10000000000000000000000000n,
      }
    `)
  })

  test('behavior: canceled stream has zero funder', async () => {
    const { token } = await setupToken(client)

    // Start and cancel a reward stream
    const rewardAmount = parseUnits('100', 6)
    const { id: streamId } = await actions.reward.startSync(client, {
      amount: rewardAmount,
      seconds: 3600, // 1 hour to avoid stream ending during test
      token,
    })

    await actions.reward.cancelSync(client, {
      id: streamId,
      token,
    })

    // Get the canceled stream
    const stream = await actions.reward.getStream(client, {
      id: streamId,
      token,
    })

    expect(stream).toMatchInlineSnapshot(`
      {
        "amountTotal": 0n,
        "endTime": 0n,
        "funder": "0x0000000000000000000000000000000000000000",
        "ratePerSecondScaled": 0n,
        "startTime": 0n,
      }
    `)
  })
})

describe('getTotalPerSecond', () => {
  test('default', async () => {
    const { token } = await setupToken(client)

    const rate = await actions.reward.getTotalPerSecond(client, {
      token,
    })

    expect(rate).toBe(0n)
  })

  test('behavior: increases after starting stream', async () => {
    const { token } = await setupToken(client)

    // Start a reward stream
    const rewardAmount = parseUnits('100', 6)
    const duration = 100
    await actions.reward.startSync(client, {
      amount: rewardAmount,
      seconds: duration,
      token,
    })

    // Check total reward per second
    const rate = await actions.reward.getTotalPerSecond(client, {
      token,
    })

    // Expected rate = (amount * ACC_PRECISION) / seconds
    // ACC_PRECISION = 1e18
    const expectedRate = (rewardAmount * parseEther('1')) / BigInt(duration)
    expect(rate).toBe(expectedRate)
  })
})

describe('setRecipientSync', () => {
  test('default', async () => {
    const { token } = await setupToken(client)

    // Set reward recipient to self
    const { holder, receipt, recipient } =
      await actions.reward.setRecipientSync(client, {
        recipient: account.address,
        token,
      })

    expect(receipt).toBeDefined()
    expect(holder).toBe(account.address)
    expect(recipient).toBe(account.address)
  })

  test('behavior: opt out with zero address', async () => {
    const { token } = await setupToken(client)

    // First opt in
    await actions.reward.setRecipientSync(client, {
      recipient: account.address,
      token,
    })

    // Then opt out
    const { holder, recipient } = await actions.reward.setRecipientSync(
      client,
      {
        recipient: '0x0000000000000000000000000000000000000000',
        token,
      },
    )

    expect(holder).toBe(account.address)
    expect(recipient).toBe('0x0000000000000000000000000000000000000000')
  })
})

describe('startSync', () => {
  test('default', async () => {
    const { token } = await setupToken(client)

    // Start a reward stream
    const duration = 10
    const rewardAmount = parseUnits('100', 6)
    const { id, receipt, ...result } = await actions.reward.startSync(client, {
      amount: rewardAmount,
      seconds: duration,
      token,
    })

    expect(receipt).toBeDefined()
    expect(result).toMatchInlineSnapshot(`
      {
        "amount": 100000000n,
        "durationSeconds": 10,
        "funder": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      }
    `)

    // Verify the stream was created
    const { endTime, startTime, ...stream } = await actions.reward.getStream(
      client,
      {
        id,
        token,
      },
    )

    expect(startTime).toBeGreaterThan(0)
    expect(endTime).toBeGreaterThan(startTime)
    expect(stream).toMatchInlineSnapshot(`
      {
        "amountTotal": 100000000n,
        "funder": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        "ratePerSecondScaled": 10000000000000000000000000n,
      }
    `)

    // Verify total reward per second
    const totalRate = await actions.reward.getTotalPerSecond(client, {
      token,
    })
    const expectedRate = (rewardAmount * parseEther('1')) / BigInt(duration)
    expect(totalRate).toBe(expectedRate)
  })

  test('behavior: streaming distribution', async () => {
    const { token } = await setupToken(client)

    // Start a streaming reward
    const duration = 3600
    const rewardAmount = parseUnits('100', 6)
    const { id } = await actions.reward.startSync(client, {
      amount: rewardAmount,
      seconds: duration,
      token,
    })

    expect(id).toBeGreaterThan(0n) // Streaming distributions return ID > 0

    // Verify the stream was created with correct rate
    const totalRate = await actions.reward.getTotalPerSecond(client, {
      token,
    })

    const expectedRate = (rewardAmount * parseEther('1')) / BigInt(duration)
    expect(totalRate).toBe(expectedRate)
  })

  // TODO: unskip
  test.skip('behavior: immediate distribution (seconds = 0)', async () => {
    const { token } = await setupToken(client)

    // Opt in to rewards
    await actions.reward.setRecipientSync(client, {
      recipient: account.address,
      token,
    })

    const balanceBeforeReward = await actions.token.getBalance(client, {
      token,
    })

    // Mint reward tokens
    const rewardAmount = parseUnits('100', 6)
    await actions.token.mintSync(client, {
      amount: rewardAmount,
      to: account.address,
      token,
    })

    // Start immediate reward (seconds = 0)
    const { id } = await actions.reward.startSync(client, {
      amount: rewardAmount,
      seconds: 0,
      token,
    })

    expect(id).toBe(0n) // Immediate distributions return ID 0

    // Trigger reward distribution by transferring
    await actions.token.transferSync(client, {
      amount: 1n,
      to: '0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC',
      token,
    })

    // Claim the accumulated rewards
    await actions.reward.claimSync(client, {
      token,
    })

    const balanceAfter = await actions.token.getBalance(client, {
      token,
    })

    // Account should have received rewards
    expect(balanceAfter).toBeGreaterThanOrEqual(
      balanceBeforeReward + rewardAmount - 1n,
    )

    // Total reward per second should be zero for immediate distributions
    const totalRate = await actions.reward.getTotalPerSecond(client, {
      token,
    })
    expect(totalRate).toBe(0n)
  })

  test('behavior: immediate distribution with opted-in holders', async () => {
    const { token } = await setupToken(client)

    // Opt in to rewards
    await actions.reward.setRecipientSync(client, {
      recipient: account.address,
      token,
    })

    // Mint reward tokens
    const rewardAmount = parseUnits('100', 6)
    await actions.token.mintSync(client, {
      amount: rewardAmount,
      to: account.address,
      token,
    })

    // Start immediate reward
    const { amount, durationSeconds, funder, id } =
      await actions.reward.startSync(client, {
        amount: rewardAmount,
        seconds: 0,
        token,
      })

    expect(id).toBe(0n) // Immediate distributions return ID 0
    expect(funder).toBe(account.address)
    expect(amount).toBe(rewardAmount)
    expect(durationSeconds).toBe(0)

    // Total reward per second should be zero for immediate distributions
    const totalRate = await actions.reward.getTotalPerSecond(client, {
      token,
    })
    expect(totalRate).toBe(0n)
  })
})
