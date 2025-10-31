import { connect, getConnectorClient } from '@wagmi/core'
import { Addresses } from 'tempo.ts/viem'
import { parseEther } from 'viem'
import { describe, expect, test } from 'vitest'
import { accounts, setupPoolWithLiquidity } from '../../../test/viem/config.js'
import { config, queryClient } from '../../../test/wagmi/config.js'
import * as ammActions from './amm.js'
import * as tokenActions from './token.js'

const account = accounts[0]

describe('getPool', () => {
  test('default', async () => {
    const pool = await ammActions.getPool(config, {
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

  describe('queryOptions', () => {
    test('default', async () => {
      const options = ammActions.getPool.queryOptions(config, {
        userToken: Addresses.defaultFeeToken,
        validatorToken: '0x20c0000000000000000000000000000000000001',
      })
      const pool = await queryClient.fetchQuery(options)
      expect(pool).toMatchInlineSnapshot(`
        {
          "reserveUserToken": 0n,
          "reserveValidatorToken": 0n,
          "totalSupply": 0n,
        }
      `)
    })
  })
})

describe('getLiquidityBalance', () => {
  test('default', async () => {
    const balance = await ammActions.getLiquidityBalance(config, {
      userToken: Addresses.defaultFeeToken,
      validatorToken: '0x20c0000000000000000000000000000000000001',
      address: account.address,
    })
    expect(balance).toMatchInlineSnapshot(`0n`)
  })

  describe('queryOptions', () => {
    test('default', async () => {
      const options = ammActions.getLiquidityBalance.queryOptions(config, {
        userToken: Addresses.defaultFeeToken,
        validatorToken: '0x20c0000000000000000000000000000000000001',
        address: account.address,
      })
      const balance = await queryClient.fetchQuery(options)
      expect(balance).toMatchInlineSnapshot(`0n`)
    })
  })
})

describe('mintSync', () => {
  test('default', async () => {
    await connect(config, {
      connector: config.connectors[0]!,
    })

    // Create a new token for testing
    const { token } = await tokenActions.createSync(config, {
      name: 'Test Token',
      symbol: 'TEST',
      currency: 'USD',
    })

    // Grant issuer role to mint tokens
    await tokenActions.grantRolesSync(config, {
      token,
      roles: ['issuer'],
      to: account.address,
    })

    // Mint some tokens to account
    await tokenActions.mintSync(config, {
      to: account.address,
      amount: parseEther('1000'),
      token,
    })

    // Add liquidity to pool
    const { receipt: mintReceipt, ...mintResult } = await ammActions.mintSync(
      config,
      {
        userToken: {
          address: token,
          amount: parseEther('100'),
        },
        validatorToken: {
          address: Addresses.defaultFeeToken,
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
        "userToken": "0x20C0000000000000000000000000000000000004",
        "validatorToken": "0x20C0000000000000000000000000000000000001",
      }
    `)
  })
})

describe('burnSync', () => {
  test('default', async () => {
    await connect(config, {
      connector: config.connectors[0]!,
    })

    const client = await getConnectorClient(config)
    const { tokenAddress } = await setupPoolWithLiquidity(client)

    // Get LP balance before burn
    const lpBalanceBefore = await ammActions.getLiquidityBalance(config, {
      userToken: tokenAddress,
      validatorToken: Addresses.defaultFeeToken,
      address: account.address,
    })

    // Burn half of LP tokens
    const { receipt: burnReceipt, ...burnResult } = await ammActions.burnSync(
      config,
      {
        userToken: tokenAddress,
        validatorToken: Addresses.defaultFeeToken,
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
        "userToken": "0x20c0000000000000000000000000000000000005",
        "validatorToken": "0x20C0000000000000000000000000000000000001",
      }
    `)
  })
})

describe('rebalanceSwapSync', () => {
  test('default', async () => {
    await connect(config, {
      connector: config.connectors[0]!,
    })

    const client = await getConnectorClient(config)
    const { tokenAddress } = await setupPoolWithLiquidity(client)

    const account2 = accounts[1]

    // Perform rebalance swap
    const { receipt: swapReceipt, ...swapResult } =
      await ammActions.rebalanceSwapSync(config, {
        userToken: tokenAddress,
        validatorToken: Addresses.defaultFeeToken,
        amountOut: parseEther('10'),
        to: account2.address,
      })
    expect(swapReceipt).toBeDefined()
    expect(swapResult).toMatchInlineSnapshot(`
      {
        "amountIn": 9985000000000000001n,
        "amountOut": 10000000000000000000n,
        "swapper": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        "userToken": "0x20C0000000000000000000000000000000000006",
        "validatorToken": "0x20C0000000000000000000000000000000000001",
      }
    `)
  })
})
