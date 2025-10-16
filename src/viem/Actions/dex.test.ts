import { Actions, Addresses, createTempoClient, Tick } from 'tempo.ts/viem'
import { type Address, parseEther, publicActions } from 'viem'
import { mnemonicToAccount } from 'viem/accounts'
import { describe, expect, test } from 'vitest'
import { tempoTest } from '../../../test/viem/config.js'

const account = mnemonicToAccount(
  'test test test test test test test test test test test junk',
)

const client = createTempoClient({
  account,
  chain: tempoTest,
  pollingInterval: 100,
}).extend(publicActions)

async function setupTokenPair(
  options: { baseAmount?: bigint; quoteAmount?: bigint; mintTo?: Address } = {},
) {
  const {
    baseAmount = parseEther('10000'),
    quoteAmount = parseEther('10000'),
    mintTo = account.address,
  } = options

  // Create base token that links to USD (which will be the quote token)
  const { token: quoteToken } = await Actions.token.createSync(client, {
    name: 'Test Quote Token',
    symbol: 'QUOTE',
    currency: 'USD',
  })

  // Create base token that links to USD (which will be the quote token)
  const { token: baseToken } = await Actions.token.createSync(client, {
    name: 'Test Base Token',
    symbol: 'BASE',
    currency: 'USD',
    quoteToken,
  })

  // Grant issuer role to mint base tokens
  await Actions.token.grantRolesSync(client, {
    token: baseToken,
    roles: ['issuer'],
    to: client.account.address,
  })

  // Grant issuer role to mint quote tokens
  await Actions.token.grantRolesSync(client, {
    token: quoteToken,
    roles: ['issuer'],
    to: client.account.address,
  })

  // Mint base tokens
  await Actions.token.mintSync(client, {
    token: baseToken,
    to: mintTo,
    amount: baseAmount,
  })

  // Mint quote tokens
  await Actions.token.mintSync(client, {
    token: quoteToken,
    to: mintTo,
    amount: quoteAmount,
  })

  // Approve DEX to spend base tokens
  await Actions.token.approveSync(client, {
    token: baseToken,
    spender: Addresses.stablecoinExchange,
    amount: baseAmount * 2n, // Approve extra for flexibility
  })

  // Approve DEX to spend quote tokens
  await Actions.token.approveSync(client, {
    token: quoteToken,
    spender: Addresses.stablecoinExchange,
    amount: quoteAmount * 2n,
  })

  // Create the pair on the DEX
  return await Actions.dex.createPairSync(client, {
    base: baseToken,
  })
}

describe.todo('buy')

describe.todo('cancel')

describe.todo('getBalance')

describe.todo('getBuyQuote')

describe.todo('getSellQuote')

describe('place', () => {
  test('default', async () => {
    // Setup token pair
    const { base } = await setupTokenPair({
      baseAmount: parseEther('1000'),
      quoteAmount: parseEther('1000'),
    })

    // Place a sell order
    const { receipt, ...result } = await Actions.dex.placeSync(client, {
      token: base,
      amount: parseEther('100'),
      type: 'sell',
      tick: Tick.fromPrice('1.001'),
    })

    expect(receipt).toBeDefined()
    expect(receipt.status).toBe('success')
    expect(result.orderId).toBeGreaterThan(0n)
    expect(result).toMatchInlineSnapshot(`
      {
        "amount": 100000000000000000000n,
        "isBid": false,
        "maker": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        "orderId": 1n,
        "tick": 100,
        "token": "0x20c0000000000000000000000000000000000005",
      }
    `)

    // Place a buy order
    const { receipt: receipt2, ...result2 } = await Actions.dex.placeSync(
      client,
      {
        token: base,
        amount: parseEther('100'),
        type: 'buy',
        tick: Tick.fromPrice('1.001'),
      },
    )
    expect(receipt2.status).toBe('success')
    expect(result2.orderId).toBeGreaterThan(0n)
    expect(result2).toMatchInlineSnapshot(`
      {
        "amount": 100000000000000000000n,
        "isBid": true,
        "maker": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        "orderId": 2n,
        "tick": 100,
        "token": "0x20c0000000000000000000000000000000000005",
      }
    `)
  })

  test('behavior: tick at boundaries', async () => {
    const { base } = await setupTokenPair()

    // Test at min tick (-2000)
    const { receipt: receipt1, ...result1 } = await Actions.dex.placeSync(
      client,
      {
        token: base,
        amount: parseEther('10'),
        type: 'sell',
        tick: Tick.minTick,
      },
    )
    expect(receipt1.status).toBe('success')
    expect(result1.tick).toBe(-2000)

    // Test at max tick (2000)
    const { receipt: receipt2, ...result2 } = await Actions.dex.placeSync(
      client,
      {
        token: base,
        amount: parseEther('10'),
        type: 'buy',
        tick: Tick.maxTick,
      },
    )
    expect(receipt2.status).toBe('success')
    expect(result2.tick).toBe(2000)
  })

  test('behavior: tick validation fails outside bounds', async () => {
    const { base } = await setupTokenPair()

    // Test tick above max tix should fail
    await expect(
      Actions.dex.placeSync(client, {
        token: base,
        amount: parseEther('10'),
        type: 'buy',
        tick: Tick.maxTick + 1,
      }),
    ).rejects.toThrow()

    // Test tick below min tick should fail
    await expect(
      Actions.dex.placeSync(client, {
        token: base,
        amount: parseEther('10'),
        type: 'sell',
        tick: Tick.minTick - 1,
      }),
    ).rejects.toThrow()
  })

  test('behavior: transfers from wallet', async () => {
    const { base, quote } = await setupTokenPair({
      baseAmount: parseEther('1000'),
      quoteAmount: parseEther('1000'),
    })

    // Get balances before placing order
    const baseBalanceBefore = await Actions.token.getBalance(client, {
      token: base,
    })
    const quoteBalanceBefore = await Actions.token.getBalance(client, {
      token: quote,
    })

    // Place a buy order - should transfer quote tokens to escrow
    const orderAmount = parseEther('100')
    const tick = Tick.fromPrice('1.001')
    await Actions.dex.placeSync(client, {
      token: base,
      amount: orderAmount,
      type: 'buy',
      tick,
    })

    // Get balances after placing order
    const baseBalanceAfter = await Actions.token.getBalance(client, {
      token: base,
    })
    const quoteBalanceAfter = await Actions.token.getBalance(client, {
      token: quote,
    })

    // Base token balance should be unchanged (we're buying base, not selling)
    expect(baseBalanceAfter).toBe(baseBalanceBefore)

    // Quote token balance should decrease (escrowed for the bid)
    // Amount = orderAmount * (1 + tick/1000) for bids
    const expectedQuoteEscrowed =
      (orderAmount * BigInt(100000 + tick)) / BigInt(100000)
    expect(quoteBalanceBefore - quoteBalanceAfter).toBeGreaterThanOrEqual(
      expectedQuoteEscrowed,
    )
  })

  test('behavior: multiple orders at same tick', async () => {
    const { base } = await setupTokenPair({
      baseAmount: parseEther('1000'),
      quoteAmount: parseEther('1000'),
    })

    const tick = Tick.fromPrice('1.0005')

    // Place first order
    const { orderId: orderId1 } = await Actions.dex.placeSync(client, {
      token: base,
      amount: parseEther('100'),
      type: 'buy',
      tick,
    })

    // Place second order at same tick
    const { orderId: orderId2 } = await Actions.dex.placeSync(client, {
      token: base,
      amount: parseEther('50'),
      type: 'buy',
      tick,
    })

    // Order IDs should be different and sequential
    expect(orderId2).toBeGreaterThan(orderId1)
  })
})

describe.todo('placeFlip')

describe.todo('buy')

describe.todo('cancel')

describe('createPair', () => {
  test('default', async () => {
    const { token: baseToken } = await Actions.token.createSync(client, {
      name: 'Test Base Token',
      symbol: 'BASE',
      currency: 'USD',
    })

    const { receipt, ...result } = await Actions.dex.createPairSync(client, {
      base: baseToken,
    })

    expect(receipt).toBeDefined()
    expect(receipt.status).toBe('success')

    const { key, ...rest } = result
    expect(key).toBeDefined()
    expect(rest).toMatchInlineSnapshot(`
      {
        "base": "0x20C0000000000000000000000000000000000004",
        "quote": "0x20C0000000000000000000000000000000000000",
      }
    `)
  })
})

describe.todo('getBalance')

describe.todo('getBuyQuote')

describe.todo('getSellQuote')

describe.todo('sell')

describe.todo('watchFlipOrderPlaced')

describe.todo('watchOrderCancelled')

describe.todo('watchOrderFilled')

describe.todo('watchOrderPlaced')

describe.todo('withdraw')
