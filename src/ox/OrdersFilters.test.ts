import { describe, expect, test } from 'vitest'
import { OrdersFilters } from 'tempo.ts/ox'

describe('fromRpc', () => {
  test('default', () => {
    const rpcFilters: OrdersFilters.Rpc = {
      baseToken: '0x20c0000000000000000000000000000000000001',
      isBid: true,
      remaining: {
        min: '0x64',
        max: '0x3e8',
      },
    }

    const filters = OrdersFilters.fromRpc(rpcFilters)

    expect(filters).toMatchInlineSnapshot(`
      {
        "baseToken": "0x20c0000000000000000000000000000000000001",
        "isBid": true,
        "remaining": {
          "max": 1000n,
          "min": 100n,
        },
      }
    `)
  })

  test('with all fields', () => {
    const rpcFilters: OrdersFilters.Rpc = {
      baseToken: '0x20c0000000000000000000000000000000000001',
      quoteToken: '0x20c0000000000000000000000000000000000002',
      maker: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      isBid: true,
      isFlip: false,
      remaining: {
        min: '0x64',
        max: '0x3e8',
      },
      tick: {
        min: -100,
        max: 100,
      },
    }

    const filters = OrdersFilters.fromRpc(rpcFilters)

    expect(filters).toMatchInlineSnapshot(`
      {
        "baseToken": "0x20c0000000000000000000000000000000000001",
        "isBid": true,
        "isFlip": false,
        "maker": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
        "quoteToken": "0x20c0000000000000000000000000000000000002",
        "remaining": {
          "max": 1000n,
          "min": 100n,
        },
        "tick": {
          "max": 100,
          "min": -100,
        },
      }
    `)
  })

  test('with partial remaining range', () => {
    const rpcFilters: OrdersFilters.Rpc = {
      baseToken: '0x20c0000000000000000000000000000000000001',
      remaining: {
        min: '0x64',
      },
    }

    const filters = OrdersFilters.fromRpc(rpcFilters)

    expect(filters.remaining).toMatchInlineSnapshot(`
      {
        "min": 100n,
      }
    `)
  })

  test('with empty filters', () => {
    const rpcFilters: OrdersFilters.Rpc = {}

    const filters = OrdersFilters.fromRpc(rpcFilters)

    expect(filters).toMatchInlineSnapshot(`{}`)
  })
})

describe('toRpc', () => {
  test('default', () => {
    const filters: OrdersFilters.OrdersFilters = {
      baseToken: '0x20c0000000000000000000000000000000000001',
      isBid: true,
      remaining: {
        min: 100n,
        max: 1000n,
      },
    }

    const rpcFilters = OrdersFilters.toRpc(filters)

    expect(rpcFilters).toMatchInlineSnapshot(`
      {
        "baseToken": "0x20c0000000000000000000000000000000000001",
        "isBid": true,
        "remaining": {
          "max": "0x3e8",
          "min": "0x64",
        },
      }
    `)
  })

  test('with all fields', () => {
    const filters: OrdersFilters.OrdersFilters = {
      baseToken: '0x20c0000000000000000000000000000000000001',
      quoteToken: '0x20c0000000000000000000000000000000000002',
      maker: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      isBid: false,
      isFlip: true,
      remaining: {
        min: 100n,
        max: 1000n,
      },
      tick: {
        min: -100,
        max: 100,
      },
    }

    const rpcFilters = OrdersFilters.toRpc(filters)

    expect(rpcFilters).toMatchInlineSnapshot(`
      {
        "baseToken": "0x20c0000000000000000000000000000000000001",
        "isBid": false,
        "isFlip": true,
        "maker": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
        "quoteToken": "0x20c0000000000000000000000000000000000002",
        "remaining": {
          "max": "0x3e8",
          "min": "0x64",
        },
        "tick": {
          "max": 100,
          "min": -100,
        },
      }
    `)
  })

  test('with partial remaining range', () => {
    const filters: OrdersFilters.OrdersFilters = {
      baseToken: '0x20c0000000000000000000000000000000000001',
      remaining: {
        max: 1000n,
      },
    }

    const rpcFilters = OrdersFilters.toRpc(filters)

    expect(rpcFilters.remaining).toMatchInlineSnapshot(`
      {
        "max": "0x3e8",
      }
    `)
  })

  test('with empty filters', () => {
    const filters: OrdersFilters.OrdersFilters = {}

    const rpcFilters = OrdersFilters.toRpc(filters)

    expect(rpcFilters).toMatchInlineSnapshot(`{}`)
  })
})
