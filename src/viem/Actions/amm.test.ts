import { setTimeout } from 'node:timers/promises'
import { Abis, Actions } from 'tempo.ts/viem'
import { parseUnits } from 'viem'
import { writeContractSync } from 'viem/actions'
import { describe, expect, test } from 'vitest'
import {
  accounts,
  clientWithAccount,
  setupPoolWithLiquidity,
} from '../../../test/viem/config.js'

const account = accounts[0]
const account2 = accounts[1]

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
      name: 'Test Token',
      symbol: 'TEST',
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
      to: clientWithAccount.account.address,
      amount: parseUnits('1000', 6),
      token,
    })

    // Add liquidity to pool
    const { receipt: mintReceipt, ...mintResult } = await Actions.amm.mintSync(
      clientWithAccount,
      {
        userToken: {
          address: token,
          amount: parseUnits('100', 6),
        },
        validatorToken: {
          address: 1n,
          amount: parseUnits('100', 6),
        },
        to: account.address,
      },
    )
    const { sender, userToken, ...rest } = mintResult
    expect(mintReceipt).toBeDefined()
    expect(sender).toBe(clientWithAccount.account.address)
    expect(userToken).toBe(token)
    expect(rest).toMatchInlineSnapshot(`
      {
        "amountUserToken": 100000000n,
        "amountValidatorToken": 100000000n,
        "liquidity": 4999999999999000n,
        "validatorToken": "0x20C0000000000000000000000000000000000001",
      }
    `)

    // Verify pool reserves
    const pool = await Actions.amm.getPool(clientWithAccount, {
      userToken: token,
      validatorToken: 1n,
    })
    expect(pool).toMatchInlineSnapshot(`
      {
        "reserveUserToken": 100000000n,
        "reserveValidatorToken": 100000000n,
        "totalSupply": 5000000000000000n,
      }
    `)

    // Verify LP token balance
    const lpBalance = await Actions.amm.getLiquidityBalance(clientWithAccount, {
      address: account.address,
      userToken: token,
      validatorToken: 1n,
    })
    expect(lpBalance).toBeGreaterThan(0n)
  })

  test('behavior: single-sided mint (mintWithValidatorToken)', async () => {
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
      userToken: {
        address: token,
        amount: parseUnits('100', 6),
      },
      validatorToken: {
        address: 1n,
        amount: parseUnits('100', 6),
      },
      to: account.address,
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
        userToken: {
          address: token,
        },
        validatorToken: {
          address: 1n,
          amount: parseUnits('50', 6),
        },
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

describe('burn', () => {
  test('default', async () => {
    const { tokenAddress } = await setupPoolWithLiquidity(clientWithAccount)

    // Get LP balance before burn
    const lpBalanceBefore = await Actions.amm.getLiquidityBalance(
      clientWithAccount,
      {
        address: account.address,
        userToken: tokenAddress,
        validatorToken: 1n,
      },
    )

    // Burn half of LP tokens
    const {
      receipt: burnReceipt,
      userToken,
      ...burnResult
    } = await Actions.amm.burnSync(clientWithAccount, {
      userToken: tokenAddress,
      validatorToken: 1n,
      liquidity: lpBalanceBefore / 2n,
      to: account2.address,
    })
    const { sender, to, ...rest } = burnResult

    expect(burnReceipt).toBeDefined()
    expect(userToken).toBe(tokenAddress)
    expect(sender).toBe(account.address)
    expect(to).toBe(account2.address)
    expect(rest).toMatchInlineSnapshot(`
      {
        "amountUserToken": 49999999n,
        "amountValidatorToken": 49999999n,
        "liquidity": 2499999999999500n,
        "validatorToken": "0x20C0000000000000000000000000000000000001",
      }
    `)

    // Verify LP balance decreased
    const lpBalanceAfter = await Actions.amm.getLiquidityBalance(
      clientWithAccount,
      {
        address: account.address,
        userToken: tokenAddress,
        validatorToken: 1n,
      },
    )
    expect(lpBalanceAfter).toBeLessThan(lpBalanceBefore)
    expect(lpBalanceAfter).toBe(lpBalanceBefore / 2n)

    // Verify pool reserves decreased
    const pool = await Actions.amm.getPool(clientWithAccount, {
      userToken: tokenAddress,
      validatorToken: 1n,
    })
    expect(pool).toMatchInlineSnapshot(`
      {
        "reserveUserToken": 50000001n,
        "reserveValidatorToken": 50000001n,
        "totalSupply": 2500000000000500n,
      }
    `)
  })
})

describe('rebalanceSwap', () => {
  test('default', async () => {
    const { tokenAddress } = await setupPoolWithLiquidity(clientWithAccount)

    // Get balance before swap
    const balanceBefore = await Actions.token.getBalance(clientWithAccount, {
      token: tokenAddress,
      account: account2.address,
    })

    // Perform rebalance swap
    const {
      receipt: swapReceipt,
      swapper,
      userToken,
      ...swapResult
    } = await Actions.amm.rebalanceSwapSync(clientWithAccount, {
      userToken: tokenAddress,
      validatorToken: 1n,
      amountOut: parseUnits('10', 6),
      to: account2.address,
      account: account,
    })
    expect(swapReceipt).toBeDefined()
    expect(userToken).toBe(tokenAddress)
    expect(swapper).toBe(account.address)
    expect(swapResult).toMatchInlineSnapshot(`
      {
        "amountIn": 9985001n,
        "amountOut": 10000000n,
        "validatorToken": "0x20C0000000000000000000000000000000000001",
      }
    `)

    // Verify balance increased
    const balanceAfter = await Actions.token.getBalance(clientWithAccount, {
      token: tokenAddress,
      account: account2.address,
    })
    expect(balanceAfter).toBe(balanceBefore + parseUnits('10', 6))
  })
})

describe('watchRebalanceSwap', () => {
  test('default', async () => {
    const { tokenAddress } = await setupPoolWithLiquidity(clientWithAccount)

    let eventArgs: any = null
    const unwatch = Actions.amm.watchRebalanceSwap(clientWithAccount, {
      onRebalanceSwap: (args) => {
        eventArgs = args
      },
    })

    // Perform rebalance swap
    await Actions.amm.rebalanceSwapSync(clientWithAccount, {
      userToken: tokenAddress,
      validatorToken: 1n,
      amountOut: parseUnits('10', 6),
      to: account2.address,
      account: account,
    })

    await setTimeout(1000)

    expect(eventArgs).toBeDefined()
    expect(eventArgs.userToken.toLowerCase()).toBe(tokenAddress.toLowerCase())
    expect(eventArgs.validatorToken.toLowerCase()).toBe(
      '0x20c0000000000000000000000000000000000001',
    )
    expect(eventArgs.amountOut).toBe(parseUnits('10', 6))

    unwatch()
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
      userToken: {
        address: token,
        amount: parseUnits('100', 6),
      },
      validatorToken: {
        address: 1n,
        amount: parseUnits('100', 6),
      },
      to: account.address,
    })

    await setTimeout(1000)

    expect(eventArgs).toBeDefined()
    expect(eventArgs.userToken.address.toLowerCase()).toBe(token.toLowerCase())
    expect(eventArgs.validatorToken.address.toLowerCase()).toBe(
      '0x20c0000000000000000000000000000000000001',
    )
    expect(eventArgs.userToken.amount).toBe(parseUnits('100', 6))
    expect(eventArgs.validatorToken.amount).toBe(parseUnits('100', 6))

    unwatch()
  })
})

describe('watchBurn', () => {
  test('default', async () => {
    const { tokenAddress } = await setupPoolWithLiquidity(clientWithAccount)

    // Get LP balance
    const lpBalance = await Actions.amm.getLiquidityBalance(clientWithAccount, {
      userToken: tokenAddress,
      validatorToken: 1n,
      address: account.address,
    })

    let eventArgs: any = null
    const unwatch = Actions.amm.watchBurn(clientWithAccount, {
      onBurn: (args) => {
        eventArgs = args
      },
    })

    // Burn LP tokens
    await Actions.amm.burnSync(clientWithAccount, {
      userToken: tokenAddress,
      validatorToken: 1n,
      liquidity: lpBalance / 2n,
      to: account.address,
    })

    await setTimeout(1000)

    expect(eventArgs).toBeDefined()
    expect(eventArgs.userToken.toLowerCase()).toBe(tokenAddress.toLowerCase())
    expect(eventArgs.validatorToken.toLowerCase()).toBe(
      '0x20c0000000000000000000000000000000000001',
    )
    expect(eventArgs.liquidity).toBe(lpBalance / 2n)

    unwatch()
  })
})
