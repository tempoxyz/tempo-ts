import { setTimeout } from 'node:timers/promises'
import { Abis, Actions, Addresses } from 'tempo.ts/viem'
import { parseUnits } from 'viem'
import { writeContractSync } from 'viem/actions'
import { describe, expect, test } from 'vitest'
import {
  accounts,
  client,
  setupPoolWithLiquidity,
} from '../../../test/viem/config.js'

const account = accounts[0]
const account2 = accounts[1]

describe('getPool', () => {
  test('default', async () => {
    const pool = await Actions.amm.getPool(client, {
      userToken: Addresses.defaultFeeToken,
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
    const balance = await Actions.amm.getLiquidityBalance(client, {
      address: account.address,
      userToken: Addresses.defaultFeeToken,
      validatorToken: '0x20c0000000000000000000000000000000000001',
    })
    expect(typeof balance).toBe('bigint')
  })
})

describe('mint', () => {
  test('default', async () => {
    // Create a new token for testing
    const { token } = await Actions.token.createSync(client, {
      name: 'Test Token',
      symbol: 'TEST',
      currency: 'USD',
    })

    // Grant issuer role to mint tokens
    await Actions.token.grantRolesSync(client, {
      token,
      roles: ['issuer'],
      to: client.account.address,
    })

    // Mint some tokens to account
    await Actions.token.mintSync(client, {
      to: account.address,
      amount: parseUnits('1000', 6),
      token,
    })

    // Add liquidity to pool
    const { receipt: mintReceipt, ...mintResult } = await Actions.amm.mintSync(
      client,
      {
        userToken: {
          address: token,
          amount: parseUnits('100', 6),
        },
        validatorToken: {
          address: Addresses.defaultFeeToken,
          amount: parseUnits('100', 6),
        },
        to: account.address,
      },
    )
    expect(mintReceipt).toBeDefined()
    expect(mintResult).toMatchInlineSnapshot(`
      {
        "amountUserToken": 100000000n,
        "amountValidatorToken": 100000000n,
        "liquidity": 4999999999999000n,
        "sender": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        "userToken": "0x20C0000000000000000000000000000000000004",
        "validatorToken": "0x20C0000000000000000000000000000000000001",
      }
    `)

    // Verify pool reserves
    const pool = await Actions.amm.getPool(client, {
      userToken: token,
      validatorToken: Addresses.defaultFeeToken,
    })
    expect(pool).toMatchInlineSnapshot(`
      {
        "reserveUserToken": 100000000n,
        "reserveValidatorToken": 100000000n,
        "totalSupply": 5000000000000000n,
      }
    `)

    // Verify LP token balance
    const lpBalance = await Actions.amm.getLiquidityBalance(client, {
      address: account.address,
      userToken: token,
      validatorToken: Addresses.defaultFeeToken,
    })
    expect(lpBalance).toBeGreaterThan(0n)
  })
})

describe('burn', () => {
  test('default', async () => {
    const { tokenAddress } = await setupPoolWithLiquidity(client)

    // Get LP balance before burn
    const lpBalanceBefore = await Actions.amm.getLiquidityBalance(client, {
      address: account.address,
      userToken: tokenAddress,
      validatorToken: Addresses.defaultFeeToken,
    })

    // Burn half of LP tokens
    const {
      receipt: burnReceipt,
      userToken,
      ...burnResult
    } = await Actions.amm.burnSync(client, {
      userToken: tokenAddress,
      validatorToken: Addresses.defaultFeeToken,
      liquidity: lpBalanceBefore / 2n,
      to: account.address,
    })
    expect(burnReceipt).toBeDefined()
    expect(userToken).toBe(tokenAddress)
    expect(burnResult).toMatchInlineSnapshot(`
      {
        "amountUserToken": 49999999n,
        "amountValidatorToken": 49999999n,
        "liquidity": 2499999999999500n,
        "sender": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        "to": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        "validatorToken": "0x20C0000000000000000000000000000000000001",
      }
    `)

    // Verify LP balance decreased
    const lpBalanceAfter = await Actions.amm.getLiquidityBalance(client, {
      address: account.address,
      userToken: tokenAddress,
      validatorToken: Addresses.defaultFeeToken,
    })
    expect(lpBalanceAfter).toBeLessThan(lpBalanceBefore)
    expect(lpBalanceAfter).toBe(lpBalanceBefore / 2n)

    // Verify pool reserves decreased
    const pool = await Actions.amm.getPool(client, {
      userToken: tokenAddress,
      validatorToken: Addresses.defaultFeeToken,
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
    const { tokenAddress } = await setupPoolWithLiquidity(client)

    // Get balance before swap
    const balanceBefore = await Actions.token.getBalance(client, {
      token: tokenAddress,
      account: account2.address,
    })

    // Perform rebalance swap
    const {
      receipt: swapReceipt,
      userToken,
      ...swapResult
    } = await Actions.amm.rebalanceSwapSync(client, {
      userToken: tokenAddress,
      validatorToken: Addresses.defaultFeeToken,
      amountOut: parseUnits('10', 6),
      to: account2.address,
      account: account,
    })
    expect(swapReceipt).toBeDefined()
    expect(userToken).toBe(tokenAddress)
    expect(swapResult).toMatchInlineSnapshot(`
      {
        "amountIn": 9985001n,
        "amountOut": 10000000n,
        "swapper": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        "validatorToken": "0x20C0000000000000000000000000000000000001",
      }
    `)

    // Verify balance increased
    const balanceAfter = await Actions.token.getBalance(client, {
      token: tokenAddress,
      account: account2.address,
    })
    expect(balanceAfter).toBe(balanceBefore + parseUnits('10', 6))
  })
})

describe('watchRebalanceSwap', () => {
  test('default', async () => {
    const { tokenAddress } = await setupPoolWithLiquidity(client)

    let eventArgs: any = null
    const unwatch = Actions.amm.watchRebalanceSwap(client, {
      onRebalanceSwap: (args) => {
        eventArgs = args
      },
    })

    // Perform rebalance swap
    await Actions.amm.rebalanceSwapSync(client, {
      userToken: tokenAddress,
      validatorToken: Addresses.defaultFeeToken,
      amountOut: parseUnits('10', 6),
      to: account2.address,
      account: account,
    })

    await setTimeout(1000)

    expect(eventArgs).toBeDefined()
    expect(eventArgs.userToken.toLowerCase()).toBe(tokenAddress.toLowerCase())
    expect(eventArgs.validatorToken.toLowerCase()).toBe(
      Addresses.defaultFeeToken.toLowerCase(),
    )
    expect(eventArgs.amountOut).toBe(parseUnits('10', 6))

    unwatch()
  })
})

describe('watchMint', () => {
  test('default', async () => {
    // Create a new token for testing
    const { token } = await Actions.token.createSync(client, {
      name: 'Test Token 2',
      symbol: 'TEST2',
      currency: 'USD',
    })

    // Grant issuer role to mint tokens
    await Actions.token.grantRolesSync(client, {
      token,
      roles: ['issuer'],
      to: client.account.address,
    })

    // Mint some tokens to account
    await Actions.token.mintSync(client, {
      to: account.address,
      amount: parseUnits('1000', 6),
      token,
    })

    // Mint USD to account
    await writeContractSync(client, {
      abi: Abis.tip20,
      address: Addresses.defaultFeeToken,
      functionName: 'transfer',
      args: [account.address, parseUnits('1000', 6)],
    })

    let eventArgs: any = null
    const unwatch = Actions.amm.watchMint(client, {
      onMint: (args) => {
        eventArgs = args
      },
    })

    // Add liquidity to pool
    await Actions.amm.mintSync(client, {
      userToken: {
        address: token,
        amount: parseUnits('100', 6),
      },
      validatorToken: {
        address: Addresses.defaultFeeToken,
        amount: parseUnits('100', 6),
      },
      to: account.address,
    })

    await setTimeout(1000)

    expect(eventArgs).toBeDefined()
    expect(eventArgs.userToken.address.toLowerCase()).toBe(token.toLowerCase())
    expect(eventArgs.validatorToken.address.toLowerCase()).toBe(
      Addresses.defaultFeeToken.toLowerCase(),
    )
    expect(eventArgs.userToken.amount).toBe(parseUnits('100', 6))
    expect(eventArgs.validatorToken.amount).toBe(parseUnits('100', 6))

    unwatch()
  })
})

describe('watchBurn', () => {
  test('default', async () => {
    const { tokenAddress } = await setupPoolWithLiquidity(client)

    // Get LP balance
    const lpBalance = await Actions.amm.getLiquidityBalance(client, {
      userToken: tokenAddress,
      validatorToken: Addresses.defaultFeeToken,
      address: account.address,
    })

    let eventArgs: any = null
    const unwatch = Actions.amm.watchBurn(client, {
      onBurn: (args) => {
        eventArgs = args
      },
    })

    // Burn LP tokens
    await Actions.amm.burnSync(client, {
      userToken: tokenAddress,
      validatorToken: Addresses.defaultFeeToken,
      liquidity: lpBalance / 2n,
      to: account.address,
    })

    await setTimeout(1000)

    expect(eventArgs).toBeDefined()
    expect(eventArgs.userToken.toLowerCase()).toBe(tokenAddress.toLowerCase())
    expect(eventArgs.validatorToken.toLowerCase()).toBe(
      Addresses.defaultFeeToken.toLowerCase(),
    )
    expect(eventArgs.liquidity).toBe(lpBalance / 2n)

    unwatch()
  })
})
