import { getAccount } from '@wagmi/core'
import { parseUnits } from 'viem'
import { describe, expect, test } from 'vitest'
import { config, queryClient, setupToken } from '../../../test/wagmi/config.js'
import * as actions from './reward.js'
import * as tokenActions from './token.js'

// TODO: unskip
describe.skip('claimSync', () => {
  test('default', async () => {
    const { token } = await setupToken()

    const account = getAccount(config)

    const balanceBefore = await tokenActions.getBalance(config, {
      account: account.address!,
      token,
    })

    // Opt in to rewards
    await actions.setRecipientSync(config, {
      recipient: account.address!,
      token,
    })

    // Mint reward tokens
    const rewardAmount = parseUnits('100', 6)
    await tokenActions.mintSync(config, {
      amount: rewardAmount,
      to: account.address!,
      token,
    })

    // Start immediate reward
    await actions.startSync(config, {
      amount: rewardAmount,
      token,
    })

    // Trigger reward accrual by transferring
    await tokenActions.transferSync(config, {
      amount: 1n,
      to: '0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC',
      token,
    })

    // Claim rewards
    const { receipt } = await actions.claimSync(config, {
      token,
    })

    expect(receipt).toBeDefined()

    const balanceAfter = await tokenActions.getBalance(config, {
      account: account.address!,
      token,
    })

    // Balance should have increased due to claimed rewards
    expect(balanceAfter).toBeGreaterThan(
      balanceBefore + rewardAmount - parseUnits('1', 6),
    )
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
