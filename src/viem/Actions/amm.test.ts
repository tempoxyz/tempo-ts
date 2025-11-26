import { setTimeout } from 'node:timers/promises'
import { Abis, Actions } from 'tempo.ts/viem'
import { parseUnits } from 'viem'
import { writeContractSync } from 'viem/actions'
import { describe, expect, test } from 'vitest'
import { accounts, clientWithAccount } from '../../../test/viem/config.js'

const account = accounts[0]

describe('getPool', () => {
  test('default', async () => {
    const pool = await Actions.amm.getPool(clientWithAccount, {
      userToken: 1n,
      validatorToken: '0x20c0000000000000000000000000000000000001',
    })
    expect(pool).toMatchInlineSnapshot(`
      {
        "reserveUserToken": 0n,
        "reserveValidatorToken": 0n,
        "totalSupply": 0n,
      }
    `)
  })
})

describe('getLiquidityBalance', () => {
  test('default', async () => {
    const balance = await Actions.amm.getLiquidityBalance(clientWithAccount, {
      address: account.address,
      userToken: 1n,
      validatorToken: '0x20c0000000000000000000000000000000000001',
    })
    expect(typeof balance).toBe('bigint')
  })
})

describe('mint', () => {
  test('default', async () => {
    // Create a new token for testing
    const { token } = await Actions.token.createSync(clientWithAccount, {
      name: 'Test Token 2',
      symbol: 'TEST2',
      currency: 'USD',
    })

    // Grant issuer role to mint tokens
    await Actions.token.grantRolesSync(clientWithAccount, {
      token,
      roles: ['issuer'],
      to: clientWithAccount.account.address,
    })

    // Mint some tokens to account
    await Actions.token.mintSync(clientWithAccount, {
      to: account.address,
      amount: parseUnits('1000', 6),
      token,
    })

    // First, establish initial liquidity with two-sided mint
    await Actions.amm.mintSync(clientWithAccount, {
      to: account.address,
      userTokenAddress: token,
      validatorTokenAddress: 1n,
      validatorTokenAmount: parseUnits('100', 6),
    })

    // Get initial pool state
    const poolBefore = await Actions.amm.getPool(clientWithAccount, {
      userToken: token,
      validatorToken: 1n,
    })

    // Add single-sided liquidity (only validatorToken)
    const { receipt: mintReceipt, ...mintResult } = await Actions.amm.mintSync(
      clientWithAccount,
      {
        userTokenAddress: token,
        validatorTokenAddress: 1n,
        validatorTokenAmount: parseUnits('50', 6),
        to: account.address,
      },
    )

    expect(mintReceipt).toBeDefined()
    // amountUserToken should be 0 for single-sided mint
    expect(mintResult.amountUserToken).toBe(0n)
    expect(mintResult.amountValidatorToken).toBe(parseUnits('50', 6))
    expect(mintResult.liquidity).toBeGreaterThan(0n)

    // Verify pool reserves - only validatorToken should increase
    const poolAfter = await Actions.amm.getPool(clientWithAccount, {
      userToken: token,
      validatorToken: 1n,
    })

    expect(poolAfter.reserveUserToken).toBe(poolBefore.reserveUserToken)
    expect(poolAfter.reserveValidatorToken).toBe(
      poolBefore.reserveValidatorToken + parseUnits('50', 6),
    )
    expect(poolAfter.totalSupply).toBeGreaterThan(poolBefore.totalSupply)
  })
})

describe('watchMint', () => {
  test('default', async () => {
    // Create a new token for testing
    const { token } = await Actions.token.createSync(clientWithAccount, {
      name: 'Test Token 2',
      symbol: 'TEST2',
      currency: 'USD',
    })

    // Grant issuer role to mint tokens
    await Actions.token.grantRolesSync(clientWithAccount, {
      token,
      roles: ['issuer'],
      to: clientWithAccount.account.address,
    })

    // Mint some tokens to account
    await Actions.token.mintSync(clientWithAccount, {
      to: account.address,
      amount: parseUnits('1000', 6),
      token,
    })

    // Mint USD to account
    await writeContractSync(clientWithAccount, {
      abi: Abis.tip20,
      address: '0x20c0000000000000000000000000000000000001',
      functionName: 'transfer',
      args: [account.address, parseUnits('1000', 6)],
    })

    let eventArgs: any = null
    const unwatch = Actions.amm.watchMint(clientWithAccount, {
      onMint: (args) => {
        eventArgs = args
      },
    })

    // Add liquidity to pool
    await Actions.amm.mintSync(clientWithAccount, {
      userTokenAddress: token,
      validatorTokenAddress: 1n,
      validatorTokenAmount: parseUnits('100', 6),
      to: account.address,
    })

    await setTimeout(1000)

    expect(eventArgs).toBeDefined()
    expect(eventArgs.userToken.address.toLowerCase()).toBe(token.toLowerCase())
    expect(eventArgs.validatorToken.address.toLowerCase()).toBe(
      '0x20c0000000000000000000000000000000000001',
    )
    expect(eventArgs.validatorToken.amount).toBe(parseUnits('100', 6))

    unwatch()
  })
})
