import { setTimeout } from 'node:timers/promises'
import * as actions from 'tempo/viem/actions'
import { parseEther, publicActions } from 'viem'
import { mnemonicToAccount } from 'viem/accounts'
import { writeContractSync } from 'viem/actions'
import { describe, expect, test } from 'vitest'
import { tempoTest } from '../../../test/viem/config.js'
import { tip20Abi } from '../abis.js'
import { usdAddress } from '../addresses.js'
import { createTempoClient } from '../client.js'

const account = mnemonicToAccount(
  'test test test test test test test test test test test junk',
)
const account2 = mnemonicToAccount(
  'test test test test test test test test test test test junk',
  { accountIndex: 1 },
)

const client = createTempoClient({
  account,
  chain: tempoTest,
  pollingInterval: 100,
}).extend(publicActions)

async function setupPoolWithLiquidity() {
  // Create a new token for testing
  const { token } = await actions.token.createSync(client, {
    name: 'Test Token',
    symbol: 'TEST',
    currency: 'USD',
  })

  // Grant issuer role to mint tokens
  await actions.token.grantRolesSync(client, {
    token,
    roles: ['issuer'],
    to: client.account.address,
  })

  // Mint some tokens to account
  await actions.token.mintSync(client, {
    to: account.address,
    amount: parseEther('1000'),
    token,
  })

  // Add liquidity to pool
  await actions.amm.mintSync(client, {
    userToken: {
      address: token,
      amount: parseEther('100'),
    },
    validatorToken: {
      address: usdAddress,
      amount: parseEther('100'),
    },
    to: account.address,
  })

  return { tokenAddress: token }
}

describe('getPoolId', () => {
  test('default', async () => {
    const poolId = await actions.amm.getPoolId(client, {
      userToken: usdAddress,
      validatorToken: '0x20c0000000000000000000000000000000000001',
    })
    expect(poolId).toBeDefined()
    expect(typeof poolId).toBe('string')
  })

  test('behavior: token id', async () => {
    const poolId = await actions.amm.getPoolId(client, {
      userToken: 0n,
      validatorToken: 1n,
    })
    expect(poolId).toBeDefined()
    expect(typeof poolId).toBe('string')
  })
})

describe('getPool', () => {
  test('default', async () => {
    const pool = await actions.amm.getPool(client, {
      userToken: usdAddress,
      validatorToken: '0x20c0000000000000000000000000000000000001',
    })
    expect(pool).toMatchObject({
      reserveUserToken: expect.any(BigInt),
      reserveValidatorToken: expect.any(BigInt),
    })
  })
})

describe('getTotalSupply', () => {
  test('default', async () => {
    const poolId = await actions.amm.getPoolId(client, {
      userToken: usdAddress,
      validatorToken: '0x20c0000000000000000000000000000000000001',
    })
    const totalSupply = await actions.amm.getTotalSupply(client, { poolId })
    expect(typeof totalSupply).toBe('bigint')
  })
})

describe('getLiquidityBalance', () => {
  test('default', async () => {
    const poolId = await actions.amm.getPoolId(client, {
      userToken: usdAddress,
      validatorToken: '0x20c0000000000000000000000000000000000001',
    })
    const balance = await actions.amm.getLiquidityBalance(client, {
      poolId,
      address: account.address,
    })
    expect(typeof balance).toBe('bigint')
  })
})

describe('mint', () => {
  test('default', async () => {
    // Create a new token for testing
    const { token } = await actions.token.createSync(client, {
      name: 'Test Token',
      symbol: 'TEST',
      currency: 'USD',
    })

    // Grant issuer role to mint tokens
    await actions.token.grantRolesSync(client, {
      token,
      roles: ['issuer'],
      to: client.account.address,
    })

    // Mint some tokens to account
    await actions.token.mintSync(client, {
      to: account.address,
      amount: parseEther('1000'),
      token,
    })

    // Add liquidity to pool
    const { receipt: mintReceipt, ...mintResult } = await actions.amm.mintSync(
      client,
      {
        userToken: {
          address: token,
          amount: parseEther('100'),
        },
        validatorToken: {
          address: usdAddress,
          amount: parseEther('100'),
        },
        to: account.address,
      },
    )
    expect(mintReceipt).toBeDefined()
    expect(mintResult).toMatchInlineSnapshot(`
      {
        "amountUserToken": 100000000000000000000n,
        "amountValidatorToken": 100000000000000000000n,
        "liquidity": 4999999999999999999999999999999999999000n,
        "sender": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        "userToken": "0x20C0000000000000000000000000000000000001",
        "validatorToken": "0x20C0000000000000000000000000000000000000",
      }
    `)

    // Verify pool reserves
    const pool = await actions.amm.getPool(client, {
      userToken: token,
      validatorToken: usdAddress,
    })
    expect(pool.reserveUserToken).toBe(parseEther('100'))
    expect(pool.reserveValidatorToken).toBe(parseEther('100'))

    // Verify LP token balance
    const poolId = await actions.amm.getPoolId(client, {
      userToken: token,
      validatorToken: usdAddress,
    })
    const lpBalance = await actions.amm.getLiquidityBalance(client, {
      poolId,
      address: account.address,
    })
    expect(lpBalance).toBeGreaterThan(0n)
  })
})

describe('burn', () => {
  test('default', async () => {
    const { tokenAddress } = await setupPoolWithLiquidity()

    // Get LP balance before burn
    const poolId = await actions.amm.getPoolId(client, {
      userToken: tokenAddress,
      validatorToken: usdAddress,
    })
    const lpBalanceBefore = await actions.amm.getLiquidityBalance(client, {
      poolId,
      address: account.address,
    })

    // Burn half of LP tokens
    const { receipt: burnReceipt, ...burnResult } = await actions.amm.burnSync(
      client,
      {
        userToken: tokenAddress,
        validatorToken: usdAddress,
        liquidity: lpBalanceBefore / 2n,
        to: account.address,
      },
    )
    expect(burnReceipt).toBeDefined()
    expect(burnResult).toMatchInlineSnapshot(`
      {
        "amountUserToken": 49999999999999999999n,
        "amountValidatorToken": 49999999999999999999n,
        "liquidity": 2499999999999999999999999999999999999500n,
        "sender": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        "to": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        "userToken": "0x20C0000000000000000000000000000000000001",
        "validatorToken": "0x20C0000000000000000000000000000000000000",
      }
    `)

    // Verify LP balance decreased
    const lpBalanceAfter = await actions.amm.getLiquidityBalance(client, {
      poolId,
      address: account.address,
    })
    expect(lpBalanceAfter).toBeLessThan(lpBalanceBefore)
    expect(lpBalanceAfter).toBe(lpBalanceBefore / 2n)

    // Verify pool reserves decreased
    const pool = await actions.amm.getPool(client, {
      userToken: tokenAddress,
      validatorToken: usdAddress,
    })
    expect(pool.reserveUserToken).toBeLessThan(parseEther('100'))
    expect(pool.reserveValidatorToken).toBeLessThan(parseEther('100'))
  })
})

describe('rebalanceSwap', () => {
  test('default', async () => {
    const { tokenAddress } = await setupPoolWithLiquidity()

    // Get balance before swap
    const balanceBefore = await actions.token.getBalance(client, {
      token: tokenAddress,
      account: account2.address,
    })

    // Perform rebalance swap
    const { receipt: swapReceipt, ...swapResult } =
      await actions.amm.rebalanceSwapSync(client, {
        userToken: tokenAddress,
        validatorToken: usdAddress,
        amountOut: parseEther('10'),
        to: account2.address,
        account: account,
      })
    expect(swapReceipt).toBeDefined()
    expect(swapResult).toMatchInlineSnapshot(`
      {
        "amountIn": 9985000000000000001n,
        "amountOut": 10000000000000000000n,
        "swapper": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        "userToken": "0x20C0000000000000000000000000000000000001",
        "validatorToken": "0x20C0000000000000000000000000000000000000",
      }
    `)

    // Verify balance increased
    const balanceAfter = await actions.token.getBalance(client, {
      token: tokenAddress,
      account: account2.address,
    })
    expect(balanceAfter).toBe(balanceBefore + parseEther('10'))
  })
})

describe('watchRebalanceSwap', () => {
  test('default', async () => {
    const { tokenAddress } = await setupPoolWithLiquidity()

    let eventArgs: any = null
    const unwatch = actions.amm.watchRebalanceSwap(client, {
      onRebalanceSwap: (args) => {
        eventArgs = args
      },
    })

    // Perform rebalance swap
    await actions.amm.rebalanceSwapSync(client, {
      userToken: tokenAddress,
      validatorToken: usdAddress,
      amountOut: parseEther('10'),
      to: account2.address,
      account: account,
    })

    await setTimeout(1000)

    expect(eventArgs).toBeDefined()
    expect(eventArgs.userToken.toLowerCase()).toBe(tokenAddress.toLowerCase())
    expect(eventArgs.validatorToken.toLowerCase()).toBe(
      usdAddress.toLowerCase(),
    )
    expect(eventArgs.amountOut).toBe(parseEther('10'))

    unwatch()
  })
})

describe('watchMint', () => {
  test('default', async () => {
    // Create a new token for testing
    const { token } = await actions.token.createSync(client, {
      name: 'Test Token 2',
      symbol: 'TEST2',
      currency: 'USD',
    })

    // Grant issuer role to mint tokens
    await actions.token.grantRolesSync(client, {
      token,
      roles: ['issuer'],
      to: client.account.address,
    })

    // Mint some tokens to account
    await actions.token.mintSync(client, {
      to: account.address,
      amount: parseEther('1000'),
      token,
    })

    // Mint USD to account
    await writeContractSync(client, {
      abi: tip20Abi,
      address: usdAddress,
      functionName: 'transfer',
      args: [account.address, parseEther('1000')],
    })

    let eventArgs: any = null
    const unwatch = actions.amm.watchMint(client, {
      onMint: (args) => {
        eventArgs = args
      },
    })

    // Add liquidity to pool
    await actions.amm.mintSync(client, {
      userToken: {
        address: token,
        amount: parseEther('100'),
      },
      validatorToken: {
        address: usdAddress,
        amount: parseEther('100'),
      },
      to: account.address,
    })

    await setTimeout(1000)

    expect(eventArgs).toBeDefined()
    expect(eventArgs.userToken.address.toLowerCase()).toBe(token.toLowerCase())
    expect(eventArgs.validatorToken.address.toLowerCase()).toBe(
      usdAddress.toLowerCase(),
    )
    expect(eventArgs.userToken.amount).toBe(parseEther('100'))
    expect(eventArgs.validatorToken.amount).toBe(parseEther('100'))

    unwatch()
  })
})

describe('watchBurn', () => {
  test('default', async () => {
    const { tokenAddress } = await setupPoolWithLiquidity()

    // Get LP balance
    const poolId = await actions.amm.getPoolId(client, {
      userToken: tokenAddress,
      validatorToken: usdAddress,
    })
    const lpBalance = await actions.amm.getLiquidityBalance(client, {
      poolId,
      address: account.address,
    })

    let eventArgs: any = null
    const unwatch = actions.amm.watchBurn(client, {
      onBurn: (args) => {
        eventArgs = args
      },
    })

    // Burn LP tokens
    await actions.amm.burnSync(client, {
      userToken: tokenAddress,
      validatorToken: usdAddress,
      liquidity: lpBalance / 2n,
      to: account.address,
    })

    await setTimeout(1000)

    expect(eventArgs).toBeDefined()
    expect(eventArgs.userToken.toLowerCase()).toBe(tokenAddress.toLowerCase())
    expect(eventArgs.validatorToken.toLowerCase()).toBe(
      usdAddress.toLowerCase(),
    )
    expect(eventArgs.liquidity).toBe(lpBalance / 2n)

    unwatch()
  })
})
