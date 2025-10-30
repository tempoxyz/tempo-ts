import type * as Address from 'ox/Address'
import * as Hex from 'ox/Hex'

/**
 * Represents an order from the DEX orderbook.
 */
export type Order<bigintType = bigint> = {
  /** Original order amount. */
  amount: bigintType
  /** Address of the base token. */
  baseToken: Address.Address
  /** Target tick to flip to when order is filled. */
  flipTick: number
  /** Order side: true for buy (bid), false for sell (ask). */
  isBid: boolean
  /** Whether this is a flip order that auto-flips when filled. */
  isFlip: boolean
  /** Address of order maker. */
  maker: Address.Address
  /** Next order ID in FIFO queue. */
  next: bigintType
  /** Unique order ID. */
  orderId: bigintType
  /** Address of the quote token. */
  quoteToken: Address.Address
  /** Previous order ID in FIFO queue. */
  prev: bigintType
  /** Remaining amount to fill. */
  remaining: bigintType
  /** Price tick. */
  tick: number
}

/**
 * RPC-formatted order from the DEX orderbook.
 */
export type Rpc = Order<Hex.Hex>

/**
 * Converts an RPC-formatted order to an internal order representation.
 *
 * @example
 * ```ts twoslash
 * import { Order } from 'tempo.ts/ox'
 *
 * const order = Order.fromRpc({
 *   amount: '0x64',
 *   baseToken: '0x20c0000000000000000000000000000000000001',
 *   flipTick: 0,
 *   isBid: true,
 *   isFlip: false,
 *   maker: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
 *   next: '0x0',
 *   orderId: '0x1',
 *   quoteToken: '0x20c0000000000000000000000000000000000002',
 *   prev: '0x0',
 *   remaining: '0x64',
 *   tick: 100,
 * })
 * // @log: { amount: 100n, orderId: 1n, ... }
 * ```
 *
 * @param order - RPC-formatted order.
 * @returns Internal order representation.
 */
export function fromRpc(order: Rpc): Order {
  return {
    amount: Hex.toBigInt(order.amount),
    baseToken: order.baseToken,
    flipTick: order.flipTick,
    isBid: order.isBid,
    isFlip: order.isFlip,
    maker: order.maker,
    next: Hex.toBigInt(order.next),
    orderId: Hex.toBigInt(order.orderId),
    quoteToken: order.quoteToken,
    prev: Hex.toBigInt(order.prev),
    remaining: Hex.toBigInt(order.remaining),
    tick: order.tick,
  }
}

/**
 * Converts an internal order representation to RPC format.
 *
 * @example
 * ```ts twoslash
 * import { Order } from 'tempo.ts/ox'
 *
 * const rpcOrder = Order.toRpc({
 *   amount: 100n,
 *   baseToken: '0x20c0000000000000000000000000000000000001',
 *   flipTick: 0,
 *   isBid: true,
 *   isFlip: false,
 *   maker: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
 *   next: 0n,
 *   orderId: 1n,
 *   quoteToken: '0x20c0000000000000000000000000000000000002',
 *   prev: 0n,
 *   remaining: 100n,
 *   tick: 100,
 * })
 * // @log: { amount: '0x64', orderId: '0x1', ... }
 * ```
 *
 * @param order - Internal order representation.
 * @returns RPC-formatted order.
 */
export function toRpc(order: Order): Rpc {
  return {
    amount: Hex.fromNumber(order.amount),
    baseToken: order.baseToken,
    flipTick: order.flipTick,
    isBid: order.isBid,
    isFlip: order.isFlip,
    maker: order.maker,
    next: Hex.fromNumber(order.next),
    orderId: Hex.fromNumber(order.orderId),
    quoteToken: order.quoteToken,
    prev: Hex.fromNumber(order.prev),
    remaining: Hex.fromNumber(order.remaining),
    tick: order.tick,
  }
}
