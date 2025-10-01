import { afterEach, beforeEach, describe, expect, test } from 'bun:test'
import { setTimeout } from 'node:timers/promises'
import { tempoLocal } from 'tempo/chains'
import { Instance } from 'tempo/prool'
import * as actions from 'tempo/viem/actions'
import { parseEther, publicActions } from 'viem'
import { mnemonicToAccount } from 'viem/accounts'
import { waitForTransactionReceipt, writeContract } from 'viem/actions'
import { tip20Abi } from '../abis.js'
import { usdAddress } from '../addresses.js'
import { createTempoClient } from '../client.js'

const instance = Instance.tempo({ port: 8545 })

beforeEach(() => instance.start())
afterEach(() => instance.stop())

const account = mnemonicToAccount(
  'test test test test test test test test test test test junk',
)
const account2 = mnemonicToAccount(
  'test test test test test test test test test test test junk',
  { accountIndex: 1 },
)

const client = createTempoClient({
  account,
  chain: tempoLocal,
  pollingInterval: 100,
}).extend(publicActions)

async function setupPoolWithLiquidity() {
  // Create a new token for testing
  const { hash: createHash, address: tokenAddress } =
    await actions.token.create(client, {
      name: 'Test Token',
      symbol: 'TEST',
      currency: 'USD',
    })
  await waitForTransactionReceipt(client, { hash: createHash })

  {
    // Grant issuer role to mint tokens
    const hash = await actions.token.grantRoles(client, {
      token: tokenAddress,
      roles: ['issuer'],
      to: client.account.address,
    })
    await waitForTransactionReceipt(client, { hash })
  }

  // Mint some tokens to account
  {
    const hash = await actions.token.mint(client, {
      to: account.address,
      amount: parseEther('1000'),
      token: tokenAddress,
    })
    await waitForTransactionReceipt(client, { hash })
  }

  // Add liquidity to pool
  {
    const hash = await actions.amm.mint(client, {
      userToken: {
        address: tokenAddress,
        amount: parseEther('100'),
      },
      validatorToken: {
        address: usdAddress,
        amount: parseEther('100'),
      },
      to: account.address,
    })
    await waitForTransactionReceipt(client, { hash })
  }

  return { tokenAddress }
}

describe.skipIf(!!process.env.CI)('getPoolId', () => {
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

describe.skipIf(!!process.env.CI)('getPool', () => {
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

describe.skipIf(!!process.env.CI)('getTotalSupply', () => {
  test('default', async () => {
    const poolId = await actions.amm.getPoolId(client, {
      userToken: usdAddress,
      validatorToken: '0x20c0000000000000000000000000000000000001',
    })
    const totalSupply = await actions.amm.getTotalSupply(client, { poolId })
    expect(typeof totalSupply).toBe('bigint')
  })
})

describe.skipIf(!!process.env.CI)('getLiquidityBalance', () => {
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

describe.skipIf(!!process.env.CI)('mint', () => {
  test('default', async () => {
    // Create a new token for testing
    const { hash: createHash, address: tokenAddress } =
      await actions.token.create(client, {
        name: 'Test Token',
        symbol: 'TEST',
        currency: 'USD',
      })
    await waitForTransactionReceipt(client, { hash: createHash })

    {
      // Grant issuer role to mint tokens
      const hash = await actions.token.grantRoles(client, {
        token: tokenAddress,
        roles: ['issuer'],
        to: client.account.address,
      })
      await waitForTransactionReceipt(client, { hash })
    }

    // Mint some tokens to account
    {
      const hash = await actions.token.mint(client, {
        to: account.address,
        amount: parseEther('1000'),
        token: tokenAddress,
      })
      await waitForTransactionReceipt(client, { hash })
    }

    // Add liquidity to pool
    {
      const hash = await actions.amm.mint(client, {
        userToken: {
          address: tokenAddress,
          amount: parseEther('100'),
        },
        validatorToken: {
          address: usdAddress,
          amount: parseEther('100'),
        },
        to: account.address,
      })
      await waitForTransactionReceipt(client, { hash })
    }

    // Verify pool reserves
    const pool = await actions.amm.getPool(client, {
      userToken: tokenAddress,
      validatorToken: usdAddress,
    })
    expect(pool.reserveUserToken).toBe(parseEther('100'))
    expect(pool.reserveValidatorToken).toBe(parseEther('100'))

    // Verify LP token balance
    const poolId = await actions.amm.getPoolId(client, {
      userToken: tokenAddress,
      validatorToken: usdAddress,
    })
    const lpBalance = await actions.amm.getLiquidityBalance(client, {
      poolId,
      address: account.address,
    })
    expect(lpBalance).toBeGreaterThan(0n)
  })
})

describe.skipIf(!!process.env.CI)('burn', () => {
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
    {
      const hash = await actions.amm.burn(client, {
        userToken: tokenAddress,
        validatorToken: usdAddress,
        liquidity: lpBalanceBefore / 2n,
        to: account.address,
      })
      await waitForTransactionReceipt(client, { hash })
    }

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

describe.skipIf(!!process.env.CI)('rebalanceSwap', () => {
  test('default', async () => {
    const { tokenAddress } = await setupPoolWithLiquidity()

    // Get balance before swap
    const balanceBefore = await actions.token.getBalance(client, {
      token: tokenAddress,
      account: account2.address,
    })

    // Perform rebalance swap
    {
      const hash = await actions.amm.rebalanceSwap(client, {
        userToken: tokenAddress,
        validatorToken: usdAddress,
        amountOut: parseEther('10'),
        to: account2.address,
        account: account,
      })
      await waitForTransactionReceipt(client, { hash })
    }

    // Verify balance increased
    const balanceAfter = await actions.token.getBalance(client, {
      token: tokenAddress,
      account: account2.address,
    })
    expect(balanceAfter).toBe(balanceBefore + parseEther('10'))
  })
})

describe.skipIf(!!process.env.CI)('watchRebalanceSwap', () => {
  test('default', async () => {
    const { tokenAddress } = await setupPoolWithLiquidity()

    let eventArgs: any = null
    const unwatch = actions.amm.watchRebalanceSwap(client, {
      onRebalanceSwap: (args) => {
        eventArgs = args
      },
    })

    // Perform rebalance swap
    {
      const hash = await actions.amm.rebalanceSwap(client, {
        userToken: tokenAddress,
        validatorToken: usdAddress,
        amountOut: parseEther('10'),
        to: account2.address,
        account: account,
      })
      await waitForTransactionReceipt(client, { hash })
    }

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

describe.skipIf(!!process.env.CI)('watchMint', () => {
  test.only('default', async () => {
    // Create a new token for testing
    const { hash: createHash, address: tokenAddress } =
      await actions.token.create(client, {
        name: 'Test Token 2',
        symbol: 'TEST2',
        currency: 'USD',
      })
    await waitForTransactionReceipt(client, { hash: createHash })

    {
      // Grant issuer role to mint tokens
      const hash = await actions.token.grantRoles(client, {
        token: tokenAddress,
        roles: ['issuer'],
        to: client.account.address,
      })
      await waitForTransactionReceipt(client, { hash })
    }

    // Mint some tokens to account
    {
      const hash = await actions.token.mint(client, {
        to: account.address,
        amount: parseEther('1000'),
        token: tokenAddress,
      })
      await waitForTransactionReceipt(client, { hash })
    }

    // Mint USD to account
    {
      const hash = await writeContract(client, {
        abi: tip20Abi,
        address: usdAddress,
        functionName: 'transfer',
        args: [account.address, parseEther('1000')],
      })
      await waitForTransactionReceipt(client, { hash })
    }

    let eventArgs: any = null
    const unwatch = actions.amm.watchMint(client, {
      onMint: (args) => {
        eventArgs = args
      },
    })

    // Add liquidity to pool
    {
      const hash = await actions.amm.mint(client, {
        userToken: {
          address: tokenAddress,
          amount: parseEther('100'),
        },
        validatorToken: {
          address: usdAddress,
          amount: parseEther('100'),
        },
        to: account.address,
      })
      await waitForTransactionReceipt(client, { hash })
    }

    await setTimeout(1000)

    expect(eventArgs).toBeDefined()
    expect(eventArgs.userToken.address.toLowerCase()).toBe(
      tokenAddress.toLowerCase(),
    )
    expect(eventArgs.validatorToken.address.toLowerCase()).toBe(
      usdAddress.toLowerCase(),
    )
    expect(eventArgs.userToken.amount).toBe(parseEther('100'))
    expect(eventArgs.validatorToken.amount).toBe(parseEther('100'))

    unwatch()
  })
})

describe.skipIf(!!process.env.CI)('watchBurn', () => {
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
    {
      const hash = await actions.amm.burn(client, {
        userToken: tokenAddress,
        validatorToken: usdAddress,
        liquidity: lpBalance / 2n,
        to: account.address,
      })
      await waitForTransactionReceipt(client, { hash })
    }

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
