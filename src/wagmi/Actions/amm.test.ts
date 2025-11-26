import { connect } from '@wagmi/core'
import { parseUnits } from 'viem'
import { describe, expect, test } from 'vitest'
import { addresses } from '../../../test/config.js'
import { accounts } from '../../../test/viem/config.js'
import { config, queryClient } from '../../../test/wagmi/config.js'
import * as ammActions from './amm.js'
import * as tokenActions from './token.js'

const account = accounts[0]

describe('getPool', () => {
  test('default', async () => {
    const pool = await ammActions.getPool(config, {
      userToken: addresses.alphaUsd,
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
        userToken: addresses.alphaUsd,
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
      userToken: addresses.alphaUsd,
      validatorToken: '0x20c0000000000000000000000000000000000001',
      address: account.address,
    })
    expect(balance).toMatchInlineSnapshot(`0n`)
  })

  describe('queryOptions', () => {
    test('default', async () => {
      const options = ammActions.getLiquidityBalance.queryOptions(config, {
        userToken: addresses.alphaUsd,
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
      amount: parseUnits('1000', 6),
      token,
    })

    // Add liquidity to pool
    const { receipt: mintReceipt, ...mintResult } = await ammActions.mintSync(
      config,
      {
        userTokenAddress: token,
        validatorTokenAddress: addresses.alphaUsd,
        validatorTokenAmount: parseUnits('100', 6),
        to: account.address,
      },
    )
    expect(mintReceipt).toBeDefined()
    expect(mintResult).toMatchInlineSnapshot(`
      {
        "amountUserToken": 0n,
        "amountValidatorToken": 100000000n,
        "liquidity": 49999000n,
        "sender": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        "userToken": "0x20C0000000000000000000000000000000000004",
        "validatorToken": "0x20C0000000000000000000000000000000000001",
      }
    `)
  })
})
