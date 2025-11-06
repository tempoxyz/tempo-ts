import { Order, OrdersFilters, Pagination } from 'tempo.ts/ox'
import { describe, expect, test } from 'vitest'

describe('toRpcParameters', () => {
  test('default', () => {
    const params = Pagination.toRpcParameters(
      {
        cursor: '0x123',
        limit: 50,
        sort: {
          on: 'orderId',
          order: 'asc',
        },
        filters: {
          baseToken: '0x20c0000000000000000000000000000000000001',
          remaining: {
            max: 1000n,
          },
        },
      },
      {
        toRpcFilters: OrdersFilters.toRpc,
      },
    )

    expect(params).toMatchInlineSnapshot(`
      {
        "cursor": "0x123",
        "filters": {
          "baseToken": "0x20c0000000000000000000000000000000000001",
          "remaining": {
            "max": "0x3e8",
            "min": null,
          },
        },
        "limit": 50,
        "sort": {
          "on": "orderId",
          "order": "asc",
        },
      }
    `)
  })
})

describe('fromRpcResponse', () => {
  test('default', () => {
    const response = Pagination.fromRpcResponse(
      {
        nextCursor: '0x123',
        orders: [
          {
            amount: '0x64',
            baseToken: '0x20c0000000000000000000000000000000000001',
            flipTick: 0,
            isBid: true,
            isFlip: false,
            maker: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
            next: '0x0',
            orderId: '0x1',
            quoteToken: '0x20c0000000000000000000000000000000000002',
            prev: '0x0',
            remaining: '0x64',
            tick: 100,
          },
        ],
      },
      {
        key: 'orders',
        fromRpc: Order.fromRpc,
      },
    )

    expect(response).toMatchInlineSnapshot(`
      {
        "nextCursor": "0x123",
        "orders": [
          {
            "amount": 100n,
            "baseToken": "0x20c0000000000000000000000000000000000001",
            "flipTick": 0,
            "isBid": true,
            "isFlip": false,
            "maker": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
            "next": 0n,
            "orderId": 1n,
            "prev": 0n,
            "quoteToken": "0x20c0000000000000000000000000000000000002",
            "remaining": 100n,
            "tick": 100,
          },
        ],
      }
    `)
  })

  test('with multiple items', () => {
    const response = Pagination.fromRpcResponse(
      {
        nextCursor: '0xabc',
        orders: [
          {
            amount: '0x64',
            baseToken: '0x20c0000000000000000000000000000000000001',
            flipTick: 0,
            isBid: true,
            isFlip: false,
            maker: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
            next: '0x2',
            orderId: '0x1',
            quoteToken: '0x20c0000000000000000000000000000000000002',
            prev: '0x0',
            remaining: '0x64',
            tick: 100,
          },
          {
            amount: '0xc8',
            baseToken: '0x20c0000000000000000000000000000000000001',
            flipTick: 0,
            isBid: false,
            isFlip: false,
            maker: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
            next: '0x0',
            orderId: '0x2',
            quoteToken: '0x20c0000000000000000000000000000000000002',
            prev: '0x1',
            remaining: '0xc8',
            tick: -100,
          },
        ],
      },
      {
        key: 'orders',
        fromRpc: Order.fromRpc,
      },
    )

    expect(response.orders).toHaveLength(2)
    expect(response.orders[0]?.orderId).toBe(1n)
    expect(response.orders[1]?.orderId).toBe(2n)
  })

  test('with null nextCursor', () => {
    const response = Pagination.fromRpcResponse(
      {
        nextCursor: null,
        orders: [],
      },
      {
        key: 'orders',
        fromRpc: Order.fromRpc,
      },
    )

    expect(response).toMatchInlineSnapshot(`
      {
        "nextCursor": null,
        "orders": [],
      }
    `)
  })
})
