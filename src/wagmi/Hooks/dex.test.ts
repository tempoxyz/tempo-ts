import { Addresses, Tick } from 'tempo.ts/viem'
import { Actions, Hooks } from 'tempo.ts/wagmi'
import { type Address, isAddress, parseEther } from 'viem'
import { describe, expect, test, vi } from 'vitest'
import { useConnect } from 'wagmi'
import { accounts } from '../../../test/viem/config.js'
import {
  config,
  renderHook,
  setupTokenPair,
} from '../../../test/wagmi/config.js'

const account = accounts[0]
const account2 = accounts[1]

describe('useBuy', () => {
  test('default', async () => {
    const { base, quote } = await setupTokenPair()

    const { result } = await renderHook(() => Hooks.dex.useBuySync())

    // Place ask order to create liquidity
    await Actions.dex.placeSync(config, {
      token: base,
      amount: parseEther('500'),
      type: 'sell',
      tick: Tick.fromPrice('1.001'),
    })

    // Buy base tokens with quote tokens
    const { receipt } = await result.current.mutateAsync({
      tokenIn: quote,
      tokenOut: base,
      amountOut: parseEther('100'),
      maxAmountIn: parseEther('150'),
    })

    expect(receipt).toBeDefined()
    expect(receipt.status).toBe('success')

    await vi.waitFor(() => expect(result.current.isSuccess).toBeTruthy())
  })

  test('behavior: respects maxAmountIn', async () => {
    const { base, quote } = await setupTokenPair()

    const { result } = await renderHook(() => Hooks.dex.useBuySync())

    // Place ask order at high price
    await Actions.dex.placeSync(config, {
      token: base,
      amount: parseEther('500'),
      type: 'sell',
      tick: Tick.fromPrice('1.01'), // 1% above peg
    })

    // Try to buy with insufficient maxAmountIn - should fail
    await expect(
      result.current.mutateAsync({
        tokenIn: quote,
        tokenOut: base,
        amountOut: parseEther('100'),
        maxAmountIn: parseEther('50'), // Way too low for 1% premium
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`
      [ContractFunctionExecutionError: The contract function "swapExactAmountOut" reverted.

      Error: MaxInputExceeded()
       
      Contract Call:
        address:   0xdec0000000000000000000000000000000000000
        function:  swapExactAmountOut(address tokenIn, address tokenOut, uint128 amountOut, uint128 maxAmountIn)
        args:                        (0x20C0000000000000000000000000000000000004, 0x20c0000000000000000000000000000000000005, 100000000000000000000, 50000000000000000000)
        sender:    0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

      Docs: https://viem.sh/docs/contract/writeContract
      Version: viem@2.38.4]
    `)
  })

  test('behavior: fails with insufficient liquidity', async () => {
    const { base, quote } = await setupTokenPair()

    const { result } = await renderHook(() => Hooks.dex.useBuySync())

    // Don't place any orders - no liquidity

    // Try to buy - should fail due to no liquidity
    await expect(
      result.current.mutateAsync({
        tokenIn: quote,
        tokenOut: base,
        amountOut: parseEther('100'),
        maxAmountIn: parseEther('150'),
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`
      [ContractFunctionExecutionError: The contract function "swapExactAmountOut" reverted.

      Error: InsufficientLiquidity()
       
      Contract Call:
        address:   0xdec0000000000000000000000000000000000000
        function:  swapExactAmountOut(address tokenIn, address tokenOut, uint128 amountOut, uint128 maxAmountIn)
        args:                        (0x20C0000000000000000000000000000000000004, 0x20c0000000000000000000000000000000000005, 100000000000000000000, 150000000000000000000)
        sender:    0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

      Docs: https://viem.sh/docs/contract/writeContract
      Version: viem@2.38.4]
    `)
  })
})

describe('useCancel', () => {
  test('default', async () => {
    const { base, quote } = await setupTokenPair()

    const { result } = await renderHook(() => ({
      place: Hooks.dex.usePlaceSync(),
      cancel: Hooks.dex.useCancelSync(),
    }))

    // Place a bid order
    const { orderId } = await result.current.place.mutateAsync({
      token: base,
      amount: parseEther('100'),
      type: 'buy',
      tick: Tick.fromPrice('1.001'),
    })

    // Check initial DEX balance (should be 0)
    const dexBalanceBefore = await Actions.dex.getBalance(config, {
      account: account.address,
      token: quote,
    })
    expect(dexBalanceBefore).toBe(0n)

    // Cancel the order
    const { receipt, ...resultData } = await result.current.cancel.mutateAsync({
      orderId,
    })

    expect(receipt).toBeDefined()
    expect(receipt.status).toBe('success')
    expect(resultData.orderId).toBe(orderId)

    await vi.waitFor(() => expect(result.current.cancel.isSuccess).toBeTruthy())

    // Check DEX balance after cancel - tokens should be refunded to internal balance
    const dexBalanceAfter = await Actions.dex.getBalance(config, {
      account: account.address,
      token: quote,
    })
    expect(dexBalanceAfter).toBeGreaterThan(0n)
  })

  test('behavior: only maker can cancel', async () => {
    const { base } = await setupTokenPair()

    const { result } = await renderHook(() => ({
      connect: useConnect(),
      place: Hooks.dex.usePlaceSync(),
      cancel: Hooks.dex.useCancelSync(),
    }))

    // Account places order
    const { orderId } = await result.current.place.mutateAsync({
      token: base,
      amount: parseEther('100'),
      type: 'buy',
      tick: Tick.fromPrice('1.001'),
    })

    // Transfer gas to account2
    await Actions.token.transferSync(config, {
      to: account2.address,
      amount: parseEther('1'),
      token: Addresses.defaultFeeToken,
    })

    // Use a different account via the connector
    await result.current.connect.connectAsync({
      connector: config.connectors[1]!,
    })

    // Account2 tries to cancel - should fail
    await expect(
      result.current.cancel.mutateAsync({
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
      Version: viem@2.38.4]
    `)
  })

  test('behavior: cannot cancel non-existent order', async () => {
    await setupTokenPair()

    const { result } = await renderHook(() => Hooks.dex.useCancelSync())

    // Try to cancel an order that doesn't exist
    await expect(
      result.current.mutateAsync({
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
      Version: viem@2.38.4]
    `)
  })
})

describe('useCreatePair', () => {
  test('default', async () => {
    await setupTokenPair() // This ensures connection

    const { result } = await renderHook(() => Hooks.dex.useCreatePairSync())

    const { token: baseToken } = await Actions.token.createSync(config, {
      name: 'Test Base Token',
      symbol: 'BASE',
      currency: 'USD',
      admin: account,
    })

    const { receipt, ...resultData } = await result.current.mutateAsync({
      base: baseToken,
    })

    expect(receipt).toBeDefined()
    expect(receipt.status).toBe('success')

    const { key, ...rest } = resultData
    expect(key).toBeDefined()
    expect(rest).toEqual(
      expect.objectContaining({
        base: expect.toSatisfy(isAddress),
        quote: expect.toSatisfy(isAddress),
      }),
    )

    await vi.waitFor(() => expect(result.current.isSuccess).toBeTruthy())
  })
})

describe('useBalance', () => {
  test('default', async () => {
    const { base, quote } = await setupTokenPair()

    let account: Address | undefined
    const { result, rerender } = await renderHook(() =>
      Hooks.dex.useBalance({ account, token: quote }),
    )

    await vi.waitFor(() => result.current.fetchStatus === 'fetching')

    // Verify initial state (disabled/pending when account missing)
    expect(result.current).toMatchInlineSnapshot(`
      {
        "data": undefined,
        "dataUpdatedAt": 0,
        "error": null,
        "errorUpdateCount": 0,
        "errorUpdatedAt": 0,
        "failureCount": 0,
        "failureReason": null,
        "fetchStatus": "idle",
        "isError": false,
        "isFetched": false,
        "isFetchedAfterMount": false,
        "isFetching": false,
        "isInitialLoading": false,
        "isLoading": false,
        "isLoadingError": false,
        "isPaused": false,
        "isPending": true,
        "isPlaceholderData": false,
        "isRefetchError": false,
        "isRefetching": false,
        "isStale": true,
        "isSuccess": false,
        "queryKey": [
          "getBalance",
          {
            "account": undefined,
            "chainId": 31337,
            "token": "0x20C0000000000000000000000000000000000004",
          },
        ],
        "refetch": [Function],
        "status": "pending",
      }
    `)

    // Set account and rerender
    account = accounts[0].address
    rerender()

    await vi.waitFor(() => expect(result.current.isSuccess).toBeTruthy())

    // Initial balance should be 0
    expect(result.current.data).toBe(0n)

    // Place and cancel order to create internal balance
    const { orderId } = await Actions.dex.placeSync(config, {
      token: base,
      amount: parseEther('50'),
      type: 'buy',
      tick: Tick.fromPrice('1.0005'),
    })

    await Actions.dex.cancelSync(config, {
      orderId,
    })

    // Trigger refetch and verify updated balance
    await result.current.refetch()
    expect(result.current.data).toBeGreaterThan(0n)
  })

  test('behavior: check different account', async () => {
    const { quote } = await setupTokenPair()

    const { result } = await renderHook(() =>
      Hooks.dex.useBalance({ account: account2.address, token: quote }),
    )

    await vi.waitFor(() => expect(result.current.isSuccess).toBeTruthy())

    // Check account2's balance (should be 0)
    expect(result.current.data).toBe(0n)
  })

  test('behavior: balances are per-token', async () => {
    const { base, quote } = await setupTokenPair()

    // Create balance in quote token
    const { orderId } = await Actions.dex.placeSync(config, {
      token: base,
      amount: parseEther('100'),
      type: 'buy',
      tick: Tick.fromPrice('1.001'),
    })
    await Actions.dex.cancelSync(config, { orderId })

    const { result: quoteResult } = await renderHook(() =>
      Hooks.dex.useBalance({ account: account.address, token: quote }),
    )

    const { result: baseResult } = await renderHook(() =>
      Hooks.dex.useBalance({ account: account.address, token: base }),
    )

    await vi.waitFor(() => expect(quoteResult.current.isSuccess).toBeTruthy())
    await vi.waitFor(() => expect(baseResult.current.isSuccess).toBeTruthy())

    // Check quote balance (should have refunded tokens)
    expect(quoteResult.current.data).toBeGreaterThan(0n)

    // Check base balance (should still be 0)
    expect(baseResult.current.data).toBe(0n)
  })
})

describe('useBuyQuote', () => {
  test('default', async () => {
    const { base, quote } = await setupTokenPair()

    // Place ask orders to create liquidity
    await Actions.dex.placeSync(config, {
      token: base,
      amount: parseEther('500'),
      type: 'sell',
      tick: Tick.fromPrice('1.001'),
    })

    const { result } = await renderHook(() =>
      Hooks.dex.useBuyQuote({
        tokenIn: quote,
        tokenOut: base,
        amountOut: parseEther('100'),
      }),
    )

    await vi.waitFor(() => expect(result.current.isSuccess).toBeTruthy())

    expect(result.current.data).toBeGreaterThan(0n)
    // Should be approximately 100 * 1.001 = 100.1
    expect(result.current.data).toBeGreaterThan(parseEther('100'))
  })

  test('behavior: fails with no liquidity', async () => {
    const { base, quote } = await setupTokenPair()

    // No orders placed - no liquidity

    const { result } = await renderHook(() =>
      Hooks.dex.useBuyQuote({
        tokenIn: quote,
        tokenOut: base,
        amountOut: parseEther('100'),
      }),
    )

    await vi.waitFor(() => expect(result.current.isError).toBeTruthy())

    expect(result.current.error?.message).toContain('InsufficientLiquidity')
  })
})

describe('useOrder', () => {
  test('default', async () => {
    const { base } = await setupTokenPair()

    // Place an order to get an order ID
    const { orderId } = await Actions.dex.placeSync(config, {
      token: base,
      amount: parseEther('100'),
      type: 'buy',
      tick: Tick.fromPrice('1.001'),
    })

    const { result } = await renderHook(() =>
      Hooks.dex.useOrder({
        orderId,
      }),
    )

    await vi.waitFor(() => expect(result.current.isSuccess).toBeTruthy())

    const order = result.current.data!
    expect(order.maker).toBe(account.address)
    expect(order.isBid).toBe(true)
    expect(order.tick).toBe(Tick.fromPrice('1.001'))
    expect(order.amount).toBe(parseEther('100'))
    expect(order.remaining).toBe(parseEther('100'))
    expect(order.isFlip).toBe(false)
  })

  test('behavior: returns flip order details', async () => {
    const { base } = await setupTokenPair()

    // Place a flip order
    const { orderId } = await Actions.dex.placeFlipSync(config, {
      token: base,
      amount: parseEther('50'),
      type: 'buy',
      tick: Tick.fromPrice('1.001'),
      flipTick: Tick.fromPrice('1.002'),
    })

    const { result } = await renderHook(() =>
      Hooks.dex.useOrder({
        orderId,
      }),
    )

    await vi.waitFor(() => expect(result.current.isSuccess).toBeTruthy())

    const order = result.current.data!
    expect(order.maker).toBe(account.address)
    expect(order.isBid).toBe(true)
    expect(order.tick).toBe(Tick.fromPrice('1.001'))
    expect(order.amount).toBe(parseEther('50'))
    expect(order.isFlip).toBe(true)
    expect(order.flipTick).toBe(Tick.fromPrice('1.002'))
  })

  test('behavior: fails for non-existent order', async () => {
    await setupTokenPair()

    const { result } = await renderHook(() =>
      Hooks.dex.useOrder({
        orderId: 999n,
      }),
    )

    await vi.waitFor(() => expect(result.current.isError).toBeTruthy())

    expect(result.current.error?.message).toContain('OrderDoesNotExist')
  })
})

describe('useOrderbook', () => {
  test('default', async () => {
    const { base, quote } = await setupTokenPair()

    const { result } = await renderHook(() =>
      Hooks.dex.useOrderbook({
        base,
        quote,
      }),
    )

    await vi.waitFor(() => expect(result.current.isSuccess).toBeTruthy())

    const book = result.current.data!
    expect(book.base).toBe(base)
    expect(book.quote).toBe(quote)
    expect(book.bestBidTick).toBeDefined()
    expect(book.bestAskTick).toBeDefined()
  })

  test('behavior: shows best bid and ask after orders placed', async () => {
    const { base, quote } = await setupTokenPair()

    const bidTick = Tick.fromPrice('0.999')
    const askTick = Tick.fromPrice('1.001')

    // Place a bid order
    await Actions.dex.placeSync(config, {
      token: base,
      amount: parseEther('100'),
      type: 'buy',
      tick: bidTick,
    })

    // Place an ask order
    await Actions.dex.placeSync(config, {
      token: base,
      amount: parseEther('100'),
      type: 'sell',
      tick: askTick,
    })

    const { result } = await renderHook(() =>
      Hooks.dex.useOrderbook({
        base,
        quote,
      }),
    )

    await vi.waitFor(() => expect(result.current.isSuccess).toBeTruthy())

    const book = result.current.data!
    expect(book.bestBidTick).toBe(bidTick)
    expect(book.bestAskTick).toBe(askTick)
  })
})

describe('usePriceLevel', () => {
  test('default', async () => {
    const { base } = await setupTokenPair()

    const tick = Tick.fromPrice('1.001')

    // Place an order to create liquidity at this tick
    const { orderId } = await Actions.dex.placeSync(config, {
      token: base,
      amount: parseEther('100'),
      type: 'buy',
      tick,
    })

    const { result } = await renderHook(() =>
      Hooks.dex.usePriceLevel({
        base,
        tick,
        isBid: true,
      }),
    )

    await vi.waitFor(() => expect(result.current.isSuccess).toBeTruthy())

    const level = result.current.data!
    expect(level.head).toBe(orderId) // head should be our order
    expect(level.tail).toBe(orderId) // tail should also be our order (only one)
    expect(level.totalLiquidity).toBeGreaterThan(0n)
  })

  test('behavior: empty price level', async () => {
    const { base } = await setupTokenPair()

    const tick = Tick.fromPrice('1.001')

    // Query a tick with no orders
    const { result } = await renderHook(() =>
      Hooks.dex.usePriceLevel({
        base,
        tick,
        isBid: true,
      }),
    )

    await vi.waitFor(() => expect(result.current.isSuccess).toBeTruthy())

    const level = result.current.data!
    expect(level.head).toBe(0n)
    expect(level.tail).toBe(0n)
    expect(level.totalLiquidity).toBe(0n)
  })
})

describe('useSellQuote', () => {
  test('default', async () => {
    const { base, quote } = await setupTokenPair()

    // Place bid orders to create liquidity
    await Actions.dex.placeSync(config, {
      token: base,
      amount: parseEther('500'),
      type: 'buy',
      tick: Tick.fromPrice('0.999'),
    })

    const { result } = await renderHook(() =>
      Hooks.dex.useSellQuote({
        tokenIn: base,
        tokenOut: quote,
        amountIn: parseEther('100'),
      }),
    )

    await vi.waitFor(() => expect(result.current.isSuccess).toBeTruthy())

    expect(result.current.data).toBeGreaterThan(0n)
    // Should be approximately 100 * 0.999 = 99.9
    expect(result.current.data).toBeLessThan(parseEther('100'))
  })

  test('behavior: fails with no liquidity', async () => {
    const { base, quote } = await setupTokenPair()

    // Quote should fail with no liquidity
    const { result } = await renderHook(() =>
      Hooks.dex.useSellQuote({
        tokenIn: base,
        tokenOut: quote,
        amountIn: parseEther('100'),
      }),
    )

    await vi.waitFor(() => expect(result.current.isError).toBeTruthy())

    expect(result.current.error?.message).toContain('InsufficientLiquidity')
  })
})

describe('usePlace', () => {
  test('default', async () => {
    const { base } = await setupTokenPair()

    const { result } = await renderHook(() => Hooks.dex.usePlaceSync())

    // Place a sell order
    const { receipt, ...resultData } = await result.current.mutateAsync({
      token: base,
      amount: parseEther('100'),
      type: 'sell',
      tick: Tick.fromPrice('1.001'),
    })

    expect(receipt).toBeDefined()
    expect(receipt.status).toBe('success')
    expect(resultData.orderId).toBeGreaterThan(0n)
    expect(resultData).toMatchInlineSnapshot(`
      {
        "amount": 100000000000000000000n,
        "isBid": false,
        "maker": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        "orderId": 1n,
        "tick": 100,
        "token": "0x20c0000000000000000000000000000000000005",
      }
    `)

    await vi.waitFor(() => expect(result.current.isSuccess).toBeTruthy())

    // Place a buy order
    const { receipt: receipt2, ...result2 } = await result.current.mutateAsync({
      token: base,
      amount: parseEther('100'),
      type: 'buy',
      tick: Tick.fromPrice('1.001'),
    })
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
})

describe('usePlaceFlip', () => {
  test('default', async () => {
    const { base } = await setupTokenPair()

    const { result } = await renderHook(() => Hooks.dex.usePlaceFlipSync())

    // Place a flip bid order
    const { receipt, ...resultData } = await result.current.mutateAsync({
      token: base,
      amount: parseEther('100'),
      type: 'buy',
      tick: Tick.fromPrice('1.001'),
      flipTick: Tick.fromPrice('1.002'),
    })

    expect(receipt).toBeDefined()
    expect(receipt.status).toBe('success')
    expect(resultData.orderId).toBeGreaterThan(0n)
    expect(resultData.flipTick).toBe(Tick.fromPrice('1.002'))
    expect(resultData).toMatchInlineSnapshot(`
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

    await vi.waitFor(() => expect(result.current.isSuccess).toBeTruthy())
  })
})

describe('useSell', () => {
  test('default', async () => {
    const { base, quote } = await setupTokenPair()

    const { result } = await renderHook(() => Hooks.dex.useSellSync())

    // Place bid order to create liquidity
    await Actions.dex.placeSync(config, {
      token: base,
      amount: parseEther('500'),
      type: 'buy',
      tick: Tick.fromPrice('0.999'),
    })

    // Sell base tokens
    const { receipt } = await result.current.mutateAsync({
      tokenIn: base,
      tokenOut: quote,
      amountIn: parseEther('100'),
      minAmountOut: parseEther('50'),
    })

    expect(receipt).toBeDefined()
    expect(receipt.status).toBe('success')

    await vi.waitFor(() => expect(result.current.isSuccess).toBeTruthy())
  })

  test('behavior: respects minAmountOut', async () => {
    const { base, quote } = await setupTokenPair()

    const { result } = await renderHook(() => Hooks.dex.useSellSync())

    // Place bid order at low price
    await Actions.dex.placeSync(config, {
      token: base,
      amount: parseEther('500'),
      type: 'buy',
      tick: Tick.fromPrice('0.99'), // 1% below peg
    })

    // Try to sell with too high minAmountOut - should fail
    await expect(
      result.current.mutateAsync({
        tokenIn: base,
        tokenOut: quote,
        amountIn: parseEther('100'),
        minAmountOut: parseEther('150'), // Way too high
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`
      [ContractFunctionExecutionError: The contract function "swapExactAmountIn" reverted.

      Error: InsufficientOutput()
       
      Contract Call:
        address:   0xdec0000000000000000000000000000000000000
        function:  swapExactAmountIn(address tokenIn, address tokenOut, uint128 amountIn, uint128 minAmountOut)
        args:                       (0x20c0000000000000000000000000000000000005, 0x20C0000000000000000000000000000000000004, 100000000000000000000, 150000000000000000000)
        sender:    0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

      Docs: https://viem.sh/docs/contract/writeContract
      Version: viem@2.38.4]
    `)
  })

  test('behavior: fails with insufficient liquidity', async () => {
    const { base, quote } = await setupTokenPair()

    const { result } = await renderHook(() => Hooks.dex.useSellSync())

    // No orders - no liquidity

    // Try to sell - should fail
    await expect(
      result.current.mutateAsync({
        tokenIn: base,
        tokenOut: quote,
        amountIn: parseEther('100'),
        minAmountOut: parseEther('50'),
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`
      [ContractFunctionExecutionError: The contract function "swapExactAmountIn" reverted.

      Error: InsufficientLiquidity()
       
      Contract Call:
        address:   0xdec0000000000000000000000000000000000000
        function:  swapExactAmountIn(address tokenIn, address tokenOut, uint128 amountIn, uint128 minAmountOut)
        args:                       (0x20c0000000000000000000000000000000000005, 0x20C0000000000000000000000000000000000004, 100000000000000000000, 50000000000000000000)
        sender:    0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

      Docs: https://viem.sh/docs/contract/writeContract
      Version: viem@2.38.4]
    `)
  })
})

describe('useWithdraw', () => {
  test('default', async () => {
    const { base, quote } = await setupTokenPair()

    const { result } = await renderHook(() => ({
      place: Hooks.dex.usePlaceSync(),
      cancel: Hooks.dex.useCancelSync(),
      withdraw: Hooks.dex.useWithdrawSync(),
    }))

    // Create internal balance
    const { orderId } = await result.current.place.mutateAsync({
      token: base,
      amount: parseEther('100'),
      type: 'buy',
      tick: Tick.fromPrice('1.001'),
    })

    await result.current.cancel.mutateAsync({ orderId })

    // Get DEX balance
    const dexBalance = await Actions.dex.getBalance(config, {
      account: account.address,
      token: quote,
    })
    expect(dexBalance).toBeGreaterThan(0n)

    // Get wallet balance before withdraw
    const walletBalanceBefore = await Actions.token.getBalance(config, {
      token: quote,
      account: account.address,
    })

    // Withdraw from DEX
    const { receipt } = await result.current.withdraw.mutateAsync({
      token: quote,
      amount: dexBalance,
    })

    expect(receipt).toBeDefined()
    expect(receipt.status).toBe('success')

    await vi.waitFor(() =>
      expect(result.current.withdraw.isSuccess).toBeTruthy(),
    )

    // Check DEX balance is now 0
    const dexBalanceAfter = await Actions.dex.getBalance(config, {
      account: account.address,
      token: quote,
    })
    expect(dexBalanceAfter).toBe(0n)

    // Check wallet balance increased
    const walletBalanceAfter = await Actions.token.getBalance(config, {
      token: quote,
      account: account.address,
    })
    expect(walletBalanceAfter).toBeGreaterThan(walletBalanceBefore)
  })
})
