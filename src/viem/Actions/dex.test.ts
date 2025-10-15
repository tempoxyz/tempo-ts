import { Actions, Addresses, createTempoClient } from 'tempo.ts/viem'
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

/**
 * Creates a token pair ready for DEX trading
 * - Base token links to USD (default fee token)
 * - Mints tokens to specified account
 * - Approves DEX to spend tokens
 */
async function setupTokenPair(
  options: { baseAmount?: bigint; quoteAmount?: bigint; mintTo?: Address } = {},
) {
  const {
    baseAmount = parseEther('10000'),
    quoteAmount = parseEther('10000'),
    mintTo = account.address,
  } = options

  // Create base token that links to USD (which will be the quote token)
  const { token: baseToken } = await Actions.token.createSync(client, {
    name: 'Test Base Token',
    symbol: 'BASE',
    currency: 'USD',
    linkingToken: Addresses.defaultLinkingToken,
  })

  // Grant issuer role to mint base tokens
  await Actions.token.grantRolesSync(client, {
    token: baseToken,
    roles: ['issuer'],
    to: client.account.address,
  })

  // Mint base tokens
  await Actions.token.mintSync(client, {
    token: baseToken,
    to: mintTo,
    amount: baseAmount,
  })

  // Approve DEX to spend base tokens
  await Actions.token.approveSync(client, {
    token: baseToken,
    spender: Addresses.stablecoinExchange,
    amount: baseAmount * 2n, // Approve extra for flexibility
  })

  // Mint quote tokens (USD) to the account
  await Actions.token.mintSync(client, {
    token: Addresses.defaultLinkingToken,
    to: mintTo,
    amount: quoteAmount,
  })

  // Approve DEX to spend quote tokens
  await Actions.token.approveSync(client, {
    token: Addresses.defaultLinkingToken,
    spender: Addresses.stablecoinExchange,
    amount: quoteAmount * 2n,
  })

  // Create the pair on the DEX
  // Note: In the Rust implementation, pairs are created implicitly on first order
  // but we may need to call a createPair function if it exists

  return {
    baseToken,
    quoteToken: Addresses.defaultLinkingToken,
  }
}

describe.todo('buy')

describe.todo('buySync')

describe.todo('cancel')

describe.todo('cancelSync')

describe.todo('getBalance')

describe.todo('getBuyQuote')

describe.todo('getSellQuote')

describe('place', () => {
  test('default', async () => {
    // Setup token pair
    const { baseToken } = await setupTokenPair({
      baseAmount: parseEther('1000'),
      quoteAmount: parseEther('1000'),
    })

    // Place a bid order (buying base token with quote token)
    const { receipt, ...result } = await Actions.dex.placeSync(client, {
      token: baseToken,
      amount: parseEther('100'),
      type: 'buy',
      tick: 100, // 0.1% above peg: price = 1.001
    })

    expect(receipt).toBeDefined()
    expect(receipt.status).toBe('success')
    expect(result.orderId).toBeGreaterThan(0n)
    expect(result).toMatchInlineSnapshot(`
      {
        "amount": 100000000000000000000n,
        "isBid": true,
        "maker": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        "orderId": 1n,
        "tick": 100,
        "token": "0x20C0000000000000000000000000000000000004",
      }
    `)
  })

  test('behavior: place ask order', async () => {
    const { baseToken } = await setupTokenPair({
      baseAmount: parseEther('1000'),
      quoteAmount: parseEther('1000'),
    })

    // Place an ask order (selling base token for quote token)
    const { receipt, ...result } = await Actions.dex.placeSync(client, {
      token: baseToken,
      amount: parseEther('50'),
      type: 'sell',
      tick: -50, // 0.05% below peg: price = 0.9995
    })

    expect(receipt.status).toBe('success')
    expect(result.orderId).toBeGreaterThan(0n)
    expect(result.isBid).toBe(false)
    expect(result.amount).toBe(parseEther('50'))
    expect(result.tick).toBe(-50)
  })

  test('behavior: tick at boundaries', async () => {
    const { baseToken } = await setupTokenPair()

    // Test at MIN_TICK (-2000)
    const { receipt: receipt1, ...result1 } = await Actions.dex.placeSync(
      client,
      {
        token: baseToken,
        amount: parseEther('10'),
        type: 'sell',
        tick: -2000,
      },
    )
    expect(receipt1.status).toBe('success')
    expect(result1.tick).toBe(-2000)

    // Test at MAX_TICK (2000)
    const { receipt: receipt2, ...result2 } = await Actions.dex.placeSync(
      client,
      {
        token: baseToken,
        amount: parseEther('10'),
        type: 'buy',
        tick: 2000,
      },
    )
    expect(receipt2.status).toBe('success')
    expect(result2.tick).toBe(2000)
  })

  test('behavior: tick validation fails outside bounds', async () => {
    const { baseToken } = await setupTokenPair()

    // Test tick above MAX_TICK should fail
    await expect(
      Actions.dex.placeSync(client, {
        token: baseToken,
        amount: parseEther('10'),
        type: 'buy',
        tick: 2001,
      }),
    ).rejects.toThrow()

    // Test tick below MIN_TICK should fail
    await expect(
      Actions.dex.placeSync(client, {
        token: baseToken,
        amount: parseEther('10'),
        type: 'sell',
        tick: -2001,
      }),
    ).rejects.toThrow()
  })

  test('behavior: transfers from wallet', async () => {
    const { baseToken, quoteToken } = await setupTokenPair({
      baseAmount: parseEther('1000'),
      quoteAmount: parseEther('1000'),
    })

    // Get balances before placing order
    const baseBalanceBefore = await Actions.token.getBalance(client, {
      token: baseToken as Address,
    })
    const quoteBalanceBefore = await Actions.token.getBalance(client, {
      token: quoteToken as Address,
    })

    // Place a bid order - should transfer quote tokens to escrow
    const orderAmount = parseEther('100')
    const tick = 100 // price = 1.001
    await Actions.dex.placeSync(client, {
      token: baseToken,
      amount: orderAmount,
      type: 'buy',
      tick,
    })

    // Get balances after placing order
    const baseBalanceAfter = await Actions.token.getBalance(client, {
      token: baseToken as Address,
    })
    const quoteBalanceAfter = await Actions.token.getBalance(client, {
      token: quoteToken as Address,
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
    const { baseToken } = await setupTokenPair({
      baseAmount: parseEther('1000'),
      quoteAmount: parseEther('1000'),
    })

    const tick = 50

    // Place first order
    const { orderId: orderId1 } = await Actions.dex.placeSync(client, {
      token: baseToken,
      amount: parseEther('100'),
      type: 'buy',
      tick,
    })

    // Place second order at same tick
    const { orderId: orderId2 } = await Actions.dex.placeSync(client, {
      token: baseToken,
      amount: parseEther('50'),
      type: 'buy',
      tick,
    })

    // Order IDs should be different and sequential
    expect(orderId2).toBeGreaterThan(orderId1)
  })
})

describe('placeFlip', () => {
  test('default', async () => {
    const { baseToken } = await setupTokenPair({
      baseAmount: parseEther('1000'),
      quoteAmount: parseEther('1000'),
    })

    // Place a flip bid order
    const hash = await Actions.dex.placeFlip(client, {
      token: baseToken,
      amount: parseEther('100'),
      type: 'buy',
      tick: 100,
      flipTick: 200,
    })

    expect(hash).toBeDefined()
    expect(typeof hash).toBe('string')
  })
})

describe('placeFlipSync', () => {
  test('default', async () => {
    const { baseToken } = await setupTokenPair({
      baseAmount: parseEther('1000'),
      quoteAmount: parseEther('1000'),
    })

    // Place a flip bid order
    const { receipt, ...result } = await Actions.dex.placeFlipSync(client, {
      token: baseToken,
      amount: parseEther('100'),
      type: 'buy',
      tick: 100, // Buy at 1.001
      flipTick: 200, // When filled, flip to sell at 1.002
    })

    expect(receipt).toBeDefined()
    expect(receipt.status).toBe('success')
    expect(result.orderId).toBeGreaterThan(0n)
    expect(result.flipTick).toBe(200)
    expect(result).toMatchInlineSnapshot(`
      {
        "amount": 100000000000000000000n,
        "flipTick": 200,
        "isBid": true,
        "maker": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        "orderId": 1n,
        "tick": 100,
        "token": "0x20C0000000000000000000000000000000000004",
      }
    `)
  })

  test('behavior: flip bid requires flipTick > tick', async () => {
    const { baseToken } = await setupTokenPair()

    // Valid: flipTick > tick for bid
    const { receipt: receipt1 } = await Actions.dex.placeFlipSync(client, {
      token: baseToken,
      amount: parseEther('10'),
      type: 'buy',
      tick: 50,
      flipTick: 100,
    })
    expect(receipt1.status).toBe('success')

    // Invalid: flipTick <= tick for bid should fail
    await expect(
      Actions.dex.placeFlipSync(client, {
        token: baseToken,
        amount: parseEther('10'),
        type: 'buy',
        tick: 100,
        flipTick: 100, // Equal
      }),
    ).rejects.toThrow()

    await expect(
      Actions.dex.placeFlipSync(client, {
        token: baseToken,
        amount: parseEther('10'),
        type: 'buy',
        tick: 100,
        flipTick: 50, // Less than
      }),
    ).rejects.toThrow()
  })

  test('behavior: flip ask requires flipTick < tick', async () => {
    const { baseToken } = await setupTokenPair()

    // Valid: flipTick < tick for ask
    const { receipt: receipt1 } = await Actions.dex.placeFlipSync(client, {
      token: baseToken,
      amount: parseEther('10'),
      type: 'sell',
      tick: 100,
      flipTick: 50,
    })
    expect(receipt1.status).toBe('success')

    // Invalid: flipTick >= tick for ask should fail
    await expect(
      Actions.dex.placeFlipSync(client, {
        token: baseToken,
        amount: parseEther('10'),
        type: 'sell',
        tick: 50,
        flipTick: 50, // Equal
      }),
    ).rejects.toThrow()

    await expect(
      Actions.dex.placeFlipSync(client, {
        token: baseToken,
        amount: parseEther('10'),
        type: 'sell',
        tick: 50,
        flipTick: 100, // Greater than
      }),
    ).rejects.toThrow()
  })

  test('behavior: flip ticks at boundaries', async () => {
    const { baseToken } = await setupTokenPair({
      baseAmount: parseEther('10000'),
      quoteAmount: parseEther('10000'),
    })

    // Flip order with ticks at extreme boundaries
    const { receipt } = await Actions.dex.placeFlipSync(client, {
      token: baseToken,
      amount: parseEther('10'),
      type: 'buy',
      tick: -2000, // MIN_TICK
      flipTick: 2000, // MAX_TICK
    })
    expect(receipt.status).toBe('success')
  })
})

describe('placeSync', () => {
  test('default', async () => {
    const { baseToken } = await setupTokenPair({
      baseAmount: parseEther('1000'),
      quoteAmount: parseEther('1000'),
    })

    // Place a bid order (async version already tested, this tests the sync wrapper)
    const hash = await Actions.dex.place(client, {
      token: baseToken,
      amount: parseEther('100'),
      type: 'buy',
      tick: 100,
    })

    expect(hash).toBeDefined()
    expect(typeof hash).toBe('string')
  })
})

describe.todo('buy')

describe.todo('buySync')

describe.todo('cancel')

describe.todo('cancelSync')

describe.todo('getBalance')

describe.todo('getBuyQuote')

describe.todo('getSellQuote')

describe.todo('sell')

describe.todo('sellSync')

describe.todo('watchFlipOrderPlaced')

describe.todo('watchOrderCancelled')

describe.todo('watchOrderFilled')

describe.todo('watchOrderPlaced')

describe.todo('withdraw')

describe.todo('withdrawSync')
