import { describe, expect, test } from 'vitest'
import * as Order from './Order.js'

describe('fromRpc', () => {
  test('default', () => {
    const rpcOrder: Order.Rpc = {
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
    }

    const order = Order.fromRpc(rpcOrder)

    expect(order).toMatchInlineSnapshot(`
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
      }
    `)
  })
})

describe('toRpc', () => {
  test('default', () => {
    const order: Order.Order = {
      amount: 100n,
      baseToken: '0x20c0000000000000000000000000000000000001',
      flipTick: 0,
      isBid: true,
      isFlip: false,
      maker: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      next: 0n,
      orderId: 1n,
      quoteToken: '0x20c0000000000000000000000000000000000002',
      prev: 0n,
      remaining: 100n,
      tick: 100,
    }

    const rpcOrder = Order.toRpc(order)

    expect(rpcOrder).toMatchInlineSnapshot(`
      {
        "amount": "0x64",
        "baseToken": "0x20c0000000000000000000000000000000000001",
        "flipTick": 0,
        "isBid": true,
        "isFlip": false,
        "maker": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
        "next": "0x0",
        "orderId": "0x1",
        "prev": "0x0",
        "quoteToken": "0x20c0000000000000000000000000000000000002",
        "remaining": "0x64",
        "tick": 100,
      }
    `)
  })
})
