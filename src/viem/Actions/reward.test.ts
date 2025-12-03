import { parseUnits } from 'viem'
import { describe, expect, test } from 'vitest'
import { clientWithAccount, setupToken } from '../../../test/viem/config.js'
import * as actions from './index.js'

const account = clientWithAccount.account

describe('claimSync', () => {
  test('default', async () => {
    const { token } = await setupToken(clientWithAccount)

    const balanceBefore = await actions.token.getBalance(clientWithAccount, {
      token,
    })

    // Opt in to rewards
    await actions.reward.setRecipientSync(clientWithAccount, {
      recipient: account.address,
      token,
    })

    // Mint reward tokens
    const rewardAmount = parseUnits('100', 6)
    await actions.token.mintSync(clientWithAccount, {
      amount: rewardAmount,
      to: account.address,
      token,
    })

    // Start immediate reward to distribute rewards
    await actions.reward.startSync(clientWithAccount, {
      amount: rewardAmount,
      token,
    })

    // Trigger reward accrual by transferring
    await actions.token.transferSync(clientWithAccount, {
      amount: 1n,
      to: '0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC',
      token,
    })

    // Claim rewards
    await actions.reward.claimSync(clientWithAccount, {
      token,
    })

    const balanceAfter = await actions.token.getBalance(clientWithAccount, {
      token,
    })

    expect(balanceAfter).toBeGreaterThan(
      balanceBefore + rewardAmount - parseUnits('1', 6),
    )
  })

  test('behavior: claiming from streaming reward', async () => {
    const { token } = await setupToken(clientWithAccount)

    const balanceBefore = await actions.token.getBalance(clientWithAccount, {
      token,
    })

    // Mint tokens to have balance
    const mintAmount = parseUnits('1000', 6)
    await actions.token.mintSync(clientWithAccount, {
      amount: mintAmount,
      to: account.address,
      token,
    })

    // Opt in to rewards
    await actions.reward.setRecipientSync(clientWithAccount, {
      recipient: account.address,
      token,
    })

    // Mint reward tokens
    const rewardAmount = parseUnits('100', 6)
    await actions.token.mintSync(clientWithAccount, {
      amount: rewardAmount,
      to: account.address,
      token,
    })

    // Start a streaming reward (not immediate)
    await actions.reward.startSync(clientWithAccount, {
      amount: rewardAmount,
      token,
    })

    // Wait a bit and trigger accrual by transferring
    await new Promise((resolve) => setTimeout(resolve, 2000))
    await actions.token.transferSync(clientWithAccount, {
      amount: 1n,
      to: '0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC',
      token,
    })

    // Claim accumulated rewards from the stream
    await actions.reward.claimSync(clientWithAccount, {
      token,
    })

    const balanceAfter = await actions.token.getBalance(clientWithAccount, {
      token,
    })

    // Should have accumulated some rewards (at least 10% of total after 2 seconds)
    expect(balanceAfter).toBeGreaterThan(balanceBefore + rewardAmount / 10n)
  })
})

describe('getTotalPerSecond', () => {
  test('default', async () => {
    const { token } = await setupToken(clientWithAccount)

    const rate = await actions.reward.getTotalPerSecond(clientWithAccount, {
      token,
    })

    expect(rate).toBe(0n)
  })
})

describe('getUserRewardInfo', () => {
  test('default', async () => {
    const { token } = await setupToken(clientWithAccount)

    const info = await actions.reward.getUserRewardInfo(clientWithAccount, {
      token,
      account: account.address,
    })

    expect(info.rewardRecipient).toBeDefined()
    expect(info.rewardPerToken).toBeDefined()
    expect(info.rewardBalance).toBeDefined()
    expect(info.rewardRecipient).toBe(
      '0x0000000000000000000000000000000000000000',
    )
    expect(info.rewardPerToken).toBe(0n)
    expect(info.rewardBalance).toBe(0n)
  })

  test('behavior: after opting in', async () => {
    const { token } = await setupToken(clientWithAccount)

    // Opt in to rewards
    await actions.reward.setRecipientSync(clientWithAccount, {
      recipient: account.address,
      token,
    })

    const info = await actions.reward.getUserRewardInfo(clientWithAccount, {
      token,
      account: account.address,
    })

    expect(info.rewardRecipient).toBe(account.address)
    expect(info.rewardPerToken).toBe(0n)
    expect(info.rewardBalance).toBe(0n)
  })
})

describe('setRecipientSync', () => {
  test('default', async () => {
    const { token } = await setupToken(clientWithAccount)

    // Set reward recipient to self
    const { holder, receipt, recipient } =
      await actions.reward.setRecipientSync(clientWithAccount, {
        recipient: account.address,
        token,
      })

    expect(receipt).toBeDefined()
    expect(holder).toBe(account.address)
    expect(recipient).toBe(account.address)
  })

  test('behavior: opt out with zero address', async () => {
    const { token } = await setupToken(clientWithAccount)

    // First opt in
    await actions.reward.setRecipientSync(clientWithAccount, {
      recipient: account.address,
      token,
    })

    // Then opt out
    const { holder, recipient } = await actions.reward.setRecipientSync(
      clientWithAccount,
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
  test('behavior: immediate distribution (seconds = 0)', async () => {
    const { token } = await setupToken(clientWithAccount)

    // Opt in to rewards
    await actions.reward.setRecipientSync(clientWithAccount, {
      recipient: account.address,
      token,
    })

    const balanceBeforeReward = await actions.token.getBalance(
      clientWithAccount,
      {
        token,
      },
    )

    // Mint reward tokens
    const rewardAmount = parseUnits('100', 6)
    await actions.token.mintSync(clientWithAccount, {
      amount: rewardAmount,
      to: account.address,
      token,
    })

    // Start immediate reward
    const { id } = await actions.reward.startSync(clientWithAccount, {
      amount: rewardAmount,
      token,
    })

    expect(id).toBe(0n) // Immediate distributions return ID 0

    // Trigger reward distribution by transferring
    await actions.token.transferSync(clientWithAccount, {
      amount: 1n,
      to: '0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC',
      token,
    })

    // Claim the accumulated rewards
    await actions.reward.claimSync(clientWithAccount, {
      token,
    })

    const balanceAfter = await actions.token.getBalance(clientWithAccount, {
      token,
    })

    // Account should have received rewards
    expect(balanceAfter).toBeGreaterThanOrEqual(
      balanceBeforeReward + rewardAmount - 1n,
    )

    // Total reward per second should be zero for immediate distributions
    const totalRate = await actions.reward.getTotalPerSecond(
      clientWithAccount,
      {
        token,
      },
    )
    expect(totalRate).toBe(0n)
  })

  test('behavior: immediate distribution with opted-in holders', async () => {
    const { token } = await setupToken(clientWithAccount)

    // Opt in to rewards
    await actions.reward.setRecipientSync(clientWithAccount, {
      recipient: account.address,
      token,
    })

    // Mint reward tokens
    const rewardAmount = parseUnits('100', 6)
    await actions.token.mintSync(clientWithAccount, {
      amount: rewardAmount,
      to: account.address,
      token,
    })

    // Start immediate reward
    const { amount, durationSeconds, funder, id } =
      await actions.reward.startSync(clientWithAccount, {
        amount: rewardAmount,
        token,
      })

    expect(id).toBe(0n) // Immediate distributions return ID 0
    expect(funder).toBe(account.address)
    expect(amount).toBe(rewardAmount)
    expect(durationSeconds).toBe(0)

    // Total reward per second should be zero for immediate distributions
    const totalRate = await actions.reward.getTotalPerSecond(
      clientWithAccount,
      {
        token,
      },
    )
    expect(totalRate).toBe(0n)
  })
})
