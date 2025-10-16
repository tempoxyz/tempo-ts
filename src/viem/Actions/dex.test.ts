import { Actions, Addresses, createTempoClient, Tick } from 'tempo.ts/viem'
import { parseEther, publicActions } from 'viem'
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

async function setupTokenPair() {
  const baseAmount = parseEther('10000')
  const quoteAmount = parseEther('10000')
  const mintTo = account.address

  // Create quote token
  const { token: quoteToken } = await Actions.token.createSync(client, {
    name: 'Test Quote Token',
    symbol: 'QUOTE',
    currency: 'USD',
  })

  // Create base token
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

describe('place', () => {
  test('default', async () => {
    // Setup token pair
    const { base } = await setupTokenPair()

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
    ).rejects.toThrowErrorMatchingInlineSnapshot(`
      [ContractFunctionExecutionError: The contract function "place" reverted.

      Error: TickOutOfBounds(int16 tick)
                            (2001)
       
      Contract Call:
        address:   0xdec0000000000000000000000000000000000000
        function:  place(address token, uint128 amount, bool isBid, int16 tick)
        args:           (0x20c0000000000000000000000000000000000005, 10000000000000000000, true, 2001)
        sender:    0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

      Docs: https://viem.sh/docs/contract/writeContract
      Version: viem@2.38.2]
    `)

    // Test tick below min tick should fail
    await expect(
      Actions.dex.placeSync(client, {
        token: base,
        amount: parseEther('10'),
        type: 'sell',
        tick: Tick.minTick - 1,
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`
      [ContractFunctionExecutionError: The contract function "place" reverted.

      Error: TickOutOfBounds(int16 tick)
                            (-2001)
       
      Contract Call:
        address:   0xdec0000000000000000000000000000000000000
        function:  place(address token, uint128 amount, bool isBid, int16 tick)
        args:           (0x20c0000000000000000000000000000000000005, 10000000000000000000, false, -2001)
        sender:    0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

      Docs: https://viem.sh/docs/contract/writeContract
      Version: viem@2.38.2]
    `)
  })

  test('behavior: transfers from wallet', async () => {
    const { base, quote } = await setupTokenPair()

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
    const { base } = await setupTokenPair()

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

describe('placeFlip', () => {
  test('default', async () => {
    const { base } = await setupTokenPair()

    // Place a flip bid order
    const { receipt, ...result } = await Actions.dex.placeFlipSync(client, {
      token: base,
      amount: parseEther('100'),
      type: 'buy',
      tick: Tick.fromPrice('1.001'),
      flipTick: Tick.fromPrice('1.002'),
    })

    expect(receipt).toBeDefined()
    expect(receipt.status).toBe('success')
    expect(result.orderId).toBeGreaterThan(0n)
    expect(result.flipTick).toBe(Tick.fromPrice('1.002'))
    expect(result).toMatchInlineSnapshot(`
      {
        "amount": 100000000000000000000n,
        "flipTick": 200,
        "isBid": true,
        "maker": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        "orderId": 1n,
        "tick": 100,
        "token": "0x20c0000000000000000000000000000000000005",
      }
    `)
  })

  test('behavior: flip bid requires flipTick > tick', async () => {
    const { base } = await setupTokenPair()

    // Valid: flipTick > tick for bid
    const { receipt: receipt1 } = await Actions.dex.placeFlipSync(client, {
      token: base,
      amount: parseEther('10'),
      type: 'buy',
      tick: Tick.fromPrice('1.0005'),
      flipTick: Tick.fromPrice('1.001'),
    })
    expect(receipt1.status).toBe('success')

    // Invalid: flipTick <= tick for bid should fail
    await expect(
      Actions.dex.placeFlipSync(client, {
        token: base,
        amount: parseEther('10'),
        type: 'buy',
        tick: Tick.fromPrice('1.001'),
        flipTick: Tick.fromPrice('1.001'), // Equal
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`
      [ContractFunctionExecutionError: The contract function "placeFlip" reverted.

      Error: InvalidFlipTick()
       
      Contract Call:
        address:   0xdec0000000000000000000000000000000000000
        function:  placeFlip(address token, uint128 amount, bool isBid, int16 tick, int16 flipTick)
        args:               (0x20c0000000000000000000000000000000000005, 10000000000000000000, true, 100, 100)
        sender:    0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

      Docs: https://viem.sh/docs/contract/writeContract
      Version: viem@2.38.2]
    `)

    await expect(
      Actions.dex.placeFlipSync(client, {
        token: base,
        amount: parseEther('10'),
        type: 'buy',
        tick: Tick.fromPrice('1.001'),
        flipTick: Tick.fromPrice('1.0005'), // Less than
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`
      [ContractFunctionExecutionError: The contract function "placeFlip" reverted.

      Error: InvalidFlipTick()
       
      Contract Call:
        address:   0xdec0000000000000000000000000000000000000
        function:  placeFlip(address token, uint128 amount, bool isBid, int16 tick, int16 flipTick)
        args:               (0x20c0000000000000000000000000000000000005, 10000000000000000000, true, 100, 50)
        sender:    0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

      Docs: https://viem.sh/docs/contract/writeContract
      Version: viem@2.38.2]
    `)
  })

  test('behavior: flip ask requires flipTick < tick', async () => {
    const { base } = await setupTokenPair()

    // Valid: flipTick < tick for ask
    const { receipt: receipt1 } = await Actions.dex.placeFlipSync(client, {
      token: base,
      amount: parseEther('10'),
      type: 'sell',
      tick: Tick.fromPrice('1.001'),
      flipTick: Tick.fromPrice('1.0005'),
    })
    expect(receipt1.status).toBe('success')

    // Invalid: flipTick >= tick for ask should fail
    await expect(
      Actions.dex.placeFlipSync(client, {
        token: base,
        amount: parseEther('10'),
        type: 'sell',
        tick: Tick.fromPrice('1.0005'),
        flipTick: Tick.fromPrice('1.0005'), // Equal
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`
      [ContractFunctionExecutionError: The contract function "placeFlip" reverted.

      Error: InvalidFlipTick()
       
      Contract Call:
        address:   0xdec0000000000000000000000000000000000000
        function:  placeFlip(address token, uint128 amount, bool isBid, int16 tick, int16 flipTick)
        args:               (0x20c0000000000000000000000000000000000005, 10000000000000000000, false, 50, 50)
        sender:    0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

      Docs: https://viem.sh/docs/contract/writeContract
      Version: viem@2.38.2]
    `)

    await expect(
      Actions.dex.placeFlipSync(client, {
        token: base,
        amount: parseEther('10'),
        type: 'sell',
        tick: Tick.fromPrice('1.0005'),
        flipTick: Tick.fromPrice('1.001'), // Greater than
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`
      [ContractFunctionExecutionError: The contract function "placeFlip" reverted.

      Error: InvalidFlipTick()
       
      Contract Call:
        address:   0xdec0000000000000000000000000000000000000
        function:  placeFlip(address token, uint128 amount, bool isBid, int16 tick, int16 flipTick)
        args:               (0x20c0000000000000000000000000000000000005, 10000000000000000000, false, 50, 100)
        sender:    0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

      Docs: https://viem.sh/docs/contract/writeContract
      Version: viem@2.38.2]
    `)
  })

  test('behavior: flip ticks at boundaries', async () => {
    const { base } = await setupTokenPair()

    // Flip order with ticks at extreme boundaries
    const { receipt } = await Actions.dex.placeFlipSync(client, {
      token: base,
      amount: parseEther('10'),
      type: 'buy',
      tick: Tick.minTick,
      flipTick: Tick.maxTick,
    })
    expect(receipt.status).toBe('success')
  })
})

describe('buy', () => {
  test('default', async () => {
    const { base, quote } = await setupTokenPair()

    // Place ask order to create liquidity
    await Actions.dex.placeSync(client, {
      token: base,
      amount: parseEther('500'),
      type: 'sell',
      tick: Tick.fromPrice('1.001'),
    })

    // Get initial balances
    const baseBalanceBefore = await Actions.token.getBalance(client, {
      token: base,
    })

    // Buy base tokens with quote tokens
    const { receipt } = await Actions.dex.buySync(client, {
      tokenIn: quote,
      tokenOut: base,
      amountOut: parseEther('100'),
      maxAmountIn: parseEther('150'),
    })

    expect(receipt).toBeDefined()
    expect(receipt.status).toBe('success')

    // Verify balances changed
    const baseBalanceAfter = await Actions.token.getBalance(client, {
      token: base,
    })

    // Should have received base tokens
    expect(baseBalanceAfter).toBeGreaterThan(baseBalanceBefore)
  })

  test('behavior: respects maxAmountIn', async () => {
    const { base, quote } = await setupTokenPair()

    // Place ask order at high price
    await Actions.dex.placeSync(client, {
      token: base,
      amount: parseEther('500'),
      type: 'sell',
      tick: Tick.fromPrice('1.01'), // 1% above peg
    })

    // Try to buy with insufficient maxAmountIn - should fail
    await expect(
      Actions.dex.buySync(client, {
        tokenIn: quote,
        tokenOut: base,
        amountOut: parseEther('100'),
        maxAmountIn: parseEther('50'), // Way too low for 1% premium
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`
      [ContractFunctionExecutionError: The contract function "buy" reverted.

      Error: MaxInputExceeded()
       
      Contract Call:
        address:   0xdec0000000000000000000000000000000000000
        function:  buy(address tokenIn, address tokenOut, uint128 amountOut, uint128 maxAmountIn)
        args:         (0x20C0000000000000000000000000000000000004, 0x20c0000000000000000000000000000000000005, 100000000000000000000, 50000000000000000000)
        sender:    0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

      Docs: https://viem.sh/docs/contract/writeContract
      Version: viem@2.38.2]
    `)
  })

  test('behavior: fails with insufficient liquidity', async () => {
    const { base, quote } = await setupTokenPair()

    // Don't place any orders - no liquidity

    // Try to buy - should fail due to no liquidity
    await expect(
      Actions.dex.buySync(client, {
        tokenIn: quote,
        tokenOut: base,
        amountOut: parseEther('100'),
        maxAmountIn: parseEther('150'),
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`
      [ContractFunctionExecutionError: The contract function "buy" reverted.

      Error: InsufficientLiquidity()
       
      Contract Call:
        address:   0xdec0000000000000000000000000000000000000
        function:  buy(address tokenIn, address tokenOut, uint128 amountOut, uint128 maxAmountIn)
        args:         (0x20C0000000000000000000000000000000000004, 0x20c0000000000000000000000000000000000005, 100000000000000000000, 150000000000000000000)
        sender:    0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

      Docs: https://viem.sh/docs/contract/writeContract
      Version: viem@2.38.2]
    `)
  })
})

describe('cancel', () => {
  test('default', async () => {
    const { base, quote } = await setupTokenPair()

    // Place a bid order
    const { orderId } = await Actions.dex.placeSync(client, {
      token: base,
      amount: parseEther('100'),
      type: 'buy',
      tick: Tick.fromPrice('1.001'),
    })

    // Check initial DEX balance (should be 0)
    const dexBalanceBefore = await Actions.dex.getBalance(client, {
      account: account.address,
      token: quote,
    })
    expect(dexBalanceBefore).toBe(0n)

    // Cancel the order
    const { receipt, ...result } = await Actions.dex.cancelSync(client, {
      orderId,
    })

    expect(receipt).toBeDefined()
    expect(receipt.status).toBe('success')
    expect(result.orderId).toBe(orderId)
    expect(result).toMatchInlineSnapshot(`
      {
        "orderId": 1n,
      }
    `)

    // Check DEX balance after cancel - tokens should be refunded to internal balance
    const dexBalanceAfter = await Actions.dex.getBalance(client, {
      account: account.address,
      token: quote,
    })
    expect(dexBalanceAfter).toBeGreaterThan(0n)
  })

  test('behavior: only maker can cancel', async () => {
    const { base } = await setupTokenPair()

    // Account places order
    const { orderId } = await Actions.dex.placeSync(client, {
      token: base,
      amount: parseEther('100'),
      type: 'buy',
      tick: Tick.fromPrice('1.001'),
    })

    // Create another account
    const account2 = mnemonicToAccount(
      'test test test test test test test test test test test junk',
      { accountIndex: 1 },
    )

    // Transfer gas to account2
    await Actions.token.transferSync(client, {
      to: account2.address,
      amount: parseEther('1'),
      token: Addresses.defaultFeeToken,
    })

    // Account2 tries to cancel - should fail
    await expect(
      Actions.dex.cancelSync(client, {
        account: account2,
        orderId,
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`
      [ContractFunctionExecutionError: The contract function "cancel" reverted.

      Error: Unauthorized()
       
      Contract Call:
        address:   0xdec0000000000000000000000000000000000000
        function:  cancel(uint128 orderId)
        args:            (1)
        sender:    0x8C8d35429F74ec245F8Ef2f4Fd1e551cFF97d650

      Docs: https://viem.sh/docs/contract/writeContract
      Version: viem@2.38.2]
    `)
  })

  test('behavior: cannot cancel non-existent order', async () => {
    await setupTokenPair()

    // Try to cancel an order that doesn't exist
    await expect(
      Actions.dex.cancelSync(client, {
        orderId: 999n,
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`
      [ContractFunctionExecutionError: The contract function "cancel" reverted.

      Error: OrderDoesNotExist()
       
      Contract Call:
        address:   0xdec0000000000000000000000000000000000000
        function:  cancel(uint128 orderId)
        args:            (999)
        sender:    0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

      Docs: https://viem.sh/docs/contract/writeContract
      Version: viem@2.38.2]
    `)
  })
})

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

describe('getBalance', () => {
  test('default', async () => {
    const { base, quote } = await setupTokenPair()

    // Initial balance should be 0
    const initialBalance = await Actions.dex.getBalance(client, {
      account: account.address,
      token: quote,
    })
    expect(initialBalance).toBe(0n)

    // Place and cancel order to create internal balance
    const { orderId } = await Actions.dex.placeSync(client, {
      token: base,
      amount: parseEther('50'),
      type: 'buy',
      tick: Tick.fromPrice('1.0005'),
    })

    await Actions.dex.cancelSync(client, {
      orderId,
    })

    // Now balance should be > 0 (refunded quote tokens)
    const balance = await Actions.dex.getBalance(client, {
      account: account.address,
      token: quote,
    })
    expect(balance).toBeGreaterThan(0n)
  })

  test('behavior: check different account', async () => {
    const { quote } = await setupTokenPair()

    const account2 = mnemonicToAccount(
      'test test test test test test test test test test test junk',
      { accountIndex: 1 },
    )

    // Check account2's balance (should be 0)
    const balance = await Actions.dex.getBalance(client, {
      account: account2.address,
      token: quote,
    })
    expect(balance).toBe(0n)
  })

  test('behavior: balances are per-token', async () => {
    const { base, quote } = await setupTokenPair()

    // Create balance in quote token
    const { orderId } = await Actions.dex.placeSync(client, {
      token: base,
      amount: parseEther('100'),
      type: 'buy',
      tick: Tick.fromPrice('1.001'),
    })
    await Actions.dex.cancelSync(client, { orderId })

    // Check quote balance (should have refunded tokens)
    const quoteBalance = await Actions.dex.getBalance(client, {
      account: account.address,
      token: quote,
    })
    expect(quoteBalance).toBeGreaterThan(0n)

    // Check base balance (should still be 0)
    const baseBalance = await Actions.dex.getBalance(client, {
      account: account.address,
      token: base,
    })
    expect(baseBalance).toBe(0n)
  })
})

describe('getBuyQuote', () => {
  test('default', async () => {
    const { base, quote } = await setupTokenPair()

    // Place ask orders to create liquidity
    await Actions.dex.placeSync(client, {
      token: base,
      amount: parseEther('500'),
      type: 'sell',
      tick: Tick.fromPrice('1.001'),
    })

    // Get quote for buying base tokens
    const amountIn = await Actions.dex.getBuyQuote(client, {
      tokenIn: quote,
      tokenOut: base,
      amountOut: parseEther('100'),
    })

    expect(amountIn).toBeGreaterThan(0n)
    // Should be approximately 100 * 1.001 = 100.1
    expect(amountIn).toBeGreaterThan(parseEther('100'))
  })

  test('behavior: fails with no liquidity', async () => {
    const { base, quote } = await setupTokenPair()

    // No orders placed - no liquidity

    // Quote should fail
    await expect(
      Actions.dex.getBuyQuote(client, {
        tokenIn: quote,
        tokenOut: base,
        amountOut: parseEther('100'),
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`
      [ContractFunctionExecutionError: The contract function "quoteBuy" reverted.

      Error: InsufficientLiquidity()
       
      Contract Call:
        address:   0xdec0000000000000000000000000000000000000
        function:  quoteBuy(address tokenIn, address tokenOut, uint128 amountOut)
        args:              (0x20C0000000000000000000000000000000000004, 0x20c0000000000000000000000000000000000005, 100000000000000000000)

      Docs: https://viem.sh/docs/contract/readContract
      Version: viem@2.38.2]
    `)
  })
})

describe('getSellQuote', () => {
  test('default', async () => {
    const { base, quote } = await setupTokenPair()

    // Place bid orders to create liquidity
    await Actions.dex.placeSync(client, {
      token: base,
      amount: parseEther('500'),
      type: 'buy',
      tick: Tick.fromPrice('0.999'),
    })

    // Get quote for selling base tokens
    const amountOut = await Actions.dex.getSellQuote(client, {
      tokenIn: base,
      tokenOut: quote,
      amountIn: parseEther('100'),
    })

    expect(amountOut).toBeGreaterThan(0n)
    // Should be approximately 100 * 0.999 = 99.9
    expect(amountOut).toBeLessThan(parseEther('100'))
  })

  test('behavior: fails with no liquidity', async () => {
    const { base, quote } = await setupTokenPair()

    // Quote should fail with no liquidity
    await expect(
      Actions.dex.getSellQuote(client, {
        tokenIn: base,
        tokenOut: quote,
        amountIn: parseEther('100'),
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`
      [ContractFunctionExecutionError: The contract function "quoteSell" reverted.

      Error: InsufficientLiquidity()
       
      Contract Call:
        address:   0xdec0000000000000000000000000000000000000
        function:  quoteSell(address tokenIn, address tokenOut, uint128 amountIn)
        args:               (0x20c0000000000000000000000000000000000005, 0x20C0000000000000000000000000000000000004, 100000000000000000000)

      Docs: https://viem.sh/docs/contract/readContract
      Version: viem@2.38.2]
    `)
  })
})

describe('sell', () => {
  test('default', async () => {
    const { base, quote } = await setupTokenPair()

    // Place bid order to create liquidity
    await Actions.dex.placeSync(client, {
      token: base,
      amount: parseEther('500'),
      type: 'buy',
      tick: Tick.fromPrice('0.999'),
    })

    // Sell base tokens
    const { receipt } = await Actions.dex.sellSync(client, {
      tokenIn: base,
      tokenOut: quote,
      amountIn: parseEther('100'),
      minAmountOut: parseEther('50'),
    })

    expect(receipt).toBeDefined()
    expect(receipt.status).toBe('success')
  })

  test('behavior: respects minAmountOut', async () => {
    const { base, quote } = await setupTokenPair()

    // Place bid order at low price
    await Actions.dex.placeSync(client, {
      token: base,
      amount: parseEther('500'),
      type: 'buy',
      tick: Tick.fromPrice('0.99'), // 1% below peg
    })

    // Try to sell with too high minAmountOut - should fail
    await expect(
      Actions.dex.sellSync(client, {
        tokenIn: base,
        tokenOut: quote,
        amountIn: parseEther('100'),
        minAmountOut: parseEther('150'), // Way too high
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`
      [ContractFunctionExecutionError: The contract function "sell" reverted.

      Error: InsufficientOutput()
       
      Contract Call:
        address:   0xdec0000000000000000000000000000000000000
        function:  sell(address tokenIn, address tokenOut, uint128 amountIn, uint128 minAmountOut)
        args:          (0x20c0000000000000000000000000000000000005, 0x20C0000000000000000000000000000000000004, 100000000000000000000, 150000000000000000000)
        sender:    0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

      Docs: https://viem.sh/docs/contract/writeContract
      Version: viem@2.38.2]
    `)
  })

  test('behavior: fails with insufficient liquidity', async () => {
    const { base, quote } = await setupTokenPair()

    // No orders - no liquidity

    // Try to sell - should fail
    await expect(
      Actions.dex.sellSync(client, {
        tokenIn: base,
        tokenOut: quote,
        amountIn: parseEther('100'),
        minAmountOut: parseEther('50'),
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`
      [ContractFunctionExecutionError: The contract function "sell" reverted.

      Error: InsufficientLiquidity()
       
      Contract Call:
        address:   0xdec0000000000000000000000000000000000000
        function:  sell(address tokenIn, address tokenOut, uint128 amountIn, uint128 minAmountOut)
        args:          (0x20c0000000000000000000000000000000000005, 0x20C0000000000000000000000000000000000004, 100000000000000000000, 50000000000000000000)
        sender:    0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

      Docs: https://viem.sh/docs/contract/writeContract
      Version: viem@2.38.2]
    `)
  })
})

describe('withdraw', () => {
  test('default', async () => {
    const { base, quote } = await setupTokenPair()

    // Create internal balance
    const { orderId } = await Actions.dex.placeSync(client, {
      token: base,
      amount: parseEther('100'),
      type: 'buy',
      tick: Tick.fromPrice('1.001'),
    })

    await Actions.dex.cancelSync(client, { orderId })

    // Get DEX balance
    const dexBalance = await Actions.dex.getBalance(client, {
      account: account.address,
      token: quote,
    })
    expect(dexBalance).toBeGreaterThan(0n)

    // Get wallet balance before withdraw
    const walletBalanceBefore = await Actions.token.getBalance(client, {
      token: quote,
    })

    // Withdraw from DEX
    const { receipt } = await Actions.dex.withdrawSync(client, {
      token: quote,
      amount: dexBalance,
    })

    expect(receipt).toBeDefined()
    expect(receipt.status).toBe('success')

    // Check DEX balance is now 0
    const dexBalanceAfter = await Actions.dex.getBalance(client, {
      account: account.address,
      token: quote,
    })
    expect(dexBalanceAfter).toBe(0n)

    // Check wallet balance increased
    const walletBalanceAfter = await Actions.token.getBalance(client, {
      token: quote,
    })
    expect(walletBalanceAfter).toBeGreaterThan(walletBalanceBefore)
  })
})

describe('watchOrderPlaced', () => {
  test('default', async () => {
    const { base } = await setupTokenPair()

    const receivedOrders: Array<{
      args: Actions.dex.watchOrderPlaced.Args
      log: Actions.dex.watchOrderPlaced.Log
    }> = []

    const unwatch = Actions.dex.watchOrderPlaced(client, {
      onOrderPlaced: (args, log) => {
        receivedOrders.push({ args, log })
      },
    })

    try {
      // Place first order
      await Actions.dex.placeSync(client, {
        token: base,
        amount: parseEther('100'),
        type: 'buy',
        tick: Tick.fromPrice('1.001'),
      })

      // Place second order
      await Actions.dex.placeSync(client, {
        token: base,
        amount: parseEther('50'),
        type: 'sell',
        tick: Tick.fromPrice('0.999'),
      })

      // Wait for events
      await new Promise((resolve) => setTimeout(resolve, 200))

      expect(receivedOrders).toHaveLength(2)
      expect(receivedOrders[0]?.args.isBid).toBe(true)
      expect(receivedOrders[0]?.args.amount).toBe(parseEther('100'))
      expect(receivedOrders[1]?.args.isBid).toBe(false)
      expect(receivedOrders[1]?.args.amount).toBe(parseEther('50'))
    } finally {
      unwatch()
    }
  })

  test('behavior: filter by token', async () => {
    const { base } = await setupTokenPair()
    const { base: base2 } = await setupTokenPair()

    const receivedOrders: Array<{
      args: Actions.dex.watchOrderPlaced.Args
      log: Actions.dex.watchOrderPlaced.Log
    }> = []

    // Watch only for orders on base
    const unwatch = Actions.dex.watchOrderPlaced(client, {
      token: base,
      onOrderPlaced: (args, log) => {
        receivedOrders.push({ args, log })
      },
    })

    try {
      // Place order on base (should be captured)
      await Actions.dex.placeSync(client, {
        token: base,
        amount: parseEther('100'),
        type: 'buy',
        tick: Tick.fromPrice('1.001'),
      })

      // Place order on base2 (should NOT be captured)
      await Actions.dex.placeSync(client, {
        token: base2,
        amount: parseEther('50'),
        type: 'buy',
        tick: Tick.fromPrice('1.001'),
      })

      await new Promise((resolve) => setTimeout(resolve, 200))

      // Should only receive 1 event
      expect(receivedOrders).toHaveLength(1)
      expect(receivedOrders[0]?.args.token.toLowerCase()).toBe(
        base.toLowerCase(),
      )
    } finally {
      unwatch()
    }
  })
})

describe('watchFlipOrderPlaced', () => {
  test('default', async () => {
    const { base } = await setupTokenPair()

    const receivedOrders: Array<{
      args: Actions.dex.watchFlipOrderPlaced.Args
      log: Actions.dex.watchFlipOrderPlaced.Log
    }> = []

    const unwatch = Actions.dex.watchFlipOrderPlaced(client, {
      onFlipOrderPlaced: (args, log) => {
        receivedOrders.push({ args, log })
      },
    })

    try {
      // Place flip order
      await Actions.dex.placeFlipSync(client, {
        token: base,
        amount: parseEther('100'),
        type: 'buy',
        tick: Tick.fromPrice('1.001'),
        flipTick: Tick.fromPrice('1.002'),
      })

      await new Promise((resolve) => setTimeout(resolve, 200))

      expect(receivedOrders).toHaveLength(1)
      expect(receivedOrders[0]?.args.flipTick).toBe(Tick.fromPrice('1.002'))
      expect(receivedOrders[0]?.args.tick).toBe(Tick.fromPrice('1.001'))
    } finally {
      unwatch()
    }
  })
})

describe('watchOrderCancelled', () => {
  test('default', async () => {
    const { base } = await setupTokenPair()

    const receivedCancellations: Array<{
      args: Actions.dex.watchOrderCancelled.Args
      log: Actions.dex.watchOrderCancelled.Log
    }> = []

    const unwatch = Actions.dex.watchOrderCancelled(client, {
      onOrderCancelled: (args, log) => {
        receivedCancellations.push({ args, log })
      },
    })

    try {
      // Place order
      const { orderId } = await Actions.dex.placeSync(client, {
        token: base,
        amount: parseEther('100'),
        type: 'buy',
        tick: Tick.fromPrice('1.001'),
      })

      // Cancel order
      await Actions.dex.cancelSync(client, {
        orderId,
      })

      await new Promise((resolve) => setTimeout(resolve, 200))

      expect(receivedCancellations).toHaveLength(1)
      expect(receivedCancellations[0]?.args.orderId).toBe(orderId)
    } finally {
      unwatch()
    }
  })

  test('behavior: filter by orderId', async () => {
    const { base } = await setupTokenPair()

    // Place two orders
    const { orderId: orderId1 } = await Actions.dex.placeSync(client, {
      token: base,
      amount: parseEther('100'),
      type: 'buy',
      tick: Tick.fromPrice('1.001'),
    })

    const { orderId: orderId2 } = await Actions.dex.placeSync(client, {
      token: base,
      amount: parseEther('50'),
      type: 'buy',
      tick: Tick.fromPrice('1.001'),
    })

    const receivedCancellations: Array<{
      args: Actions.dex.watchOrderCancelled.Args
      log: Actions.dex.watchOrderCancelled.Log
    }> = []

    // Watch only for cancellation of orderId1
    const unwatch = Actions.dex.watchOrderCancelled(client, {
      orderId: orderId1,
      onOrderCancelled: (args, log) => {
        receivedCancellations.push({ args, log })
      },
    })

    try {
      // Cancel orderId1 (should be captured)
      await Actions.dex.cancelSync(client, {
        orderId: orderId1,
      })

      // Cancel orderId2 (should NOT be captured)
      await Actions.dex.cancelSync(client, {
        orderId: orderId2,
      })

      await new Promise((resolve) => setTimeout(resolve, 200))

      // Should only receive 1 event
      expect(receivedCancellations).toHaveLength(1)
      expect(receivedCancellations[0]?.args.orderId).toBe(orderId1)
    } finally {
      unwatch()
    }
  })
})

describe.todo('watchOrderFilled')
