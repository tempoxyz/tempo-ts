import type * as Address from 'ox/Address'
import * as Hex from 'ox/Hex'
import type * as Pagination from './Pagination.js'
import type * as Tick from './Tick.js'

/**
 * Filter configuration for orders query.
 */
export type OrdersFilters<bigintType = bigint> = {
  /** Filter by specific base token. */
  baseToken?: Address.Address | undefined
  /** Filter by order side (true=buy, false=sell). */
  isBid?: boolean | undefined
  /** Filter flip orders. */
  isFlip?: boolean | undefined
  /** Filter by maker address. */
  maker?: Address.Address | undefined
  /** Filter by quote token. */
  quoteToken?: Address.Address | undefined
  /** Remaining amount in range. */
  remaining?: Pagination.FilterRange<bigintType> | undefined
  /** Tick in range (from -2000 to 2000). */
  tick?: Pagination.FilterRange<Tick.Tick> | undefined
}

/**
 * RPC-formatted orders filters.
 */
export type Rpc = OrdersFilters<Hex.Hex>

/**
 * Converts RPC-formatted orders filters to internal representation.
 *
 * @example
 * ```ts twoslash
 * import { OrdersRequest } from 'tempo.ts/ox'
 *
 * const filters = OrdersRequest.fromRpc({
 *   baseToken: '0x20c0000000000000000000000000000000000001',
 *   isBid: true,
 *   remaining: {
 *     min: '0x64',
 *     max: '0x3e8',
 *   },
 * })
 * // @log: { baseToken: '0x20c0...', isBid: true, remaining: { min: 100n, max: 1000n } }
 * ```
 *
 * @param filters - RPC-formatted filters.
 * @returns Internal filters representation.
 */
export function fromRpc(filters: Rpc): OrdersFilters {
  const result: OrdersFilters = {}

  if (filters.baseToken !== undefined) result.baseToken = filters.baseToken
  if (filters.isBid !== undefined) result.isBid = filters.isBid
  if (filters.isFlip !== undefined) result.isFlip = filters.isFlip
  if (filters.maker !== undefined) result.maker = filters.maker
  if (filters.quoteToken !== undefined) result.quoteToken = filters.quoteToken

  if (filters.remaining !== undefined) {
    const remaining: Pagination.FilterRange<bigint> = {}
    remaining.min =
      typeof filters.remaining.min === 'string'
        ? Hex.toBigInt(filters.remaining.min)
        : null
    remaining.max =
      typeof filters.remaining.max === 'string'
        ? Hex.toBigInt(filters.remaining.max)
        : null
    result.remaining = remaining
  }

  if (filters.tick !== undefined) result.tick = filters.tick

  return result
}

/**
 * Converts internal orders filters to RPC format.
 *
 * @example
 * ```ts twoslash
 * import { OrdersRequest } from 'tempo.ts/ox'
 *
 * const rpcFilters = OrdersRequest.toRpc({
 *   baseToken: '0x20c0000000000000000000000000000000000001',
 *   isBid: true,
 *   remaining: {
 *     min: 100n,
 *     max: 1000n,
 *   },
 * })
 * // @log: { baseToken: '0x20c0...', isBid: true, remaining: { min: '0x64', max: '0x3e8' } }
 * ```
 *
 * @param filters - Internal filters representation.
 * @returns RPC-formatted filters.
 */
export function toRpc(filters: OrdersFilters): Rpc {
  const result: Rpc = {}

  if (filters.baseToken !== undefined) result.baseToken = filters.baseToken
  if (filters.isBid !== undefined) result.isBid = filters.isBid
  if (filters.isFlip !== undefined) result.isFlip = filters.isFlip
  if (filters.maker !== undefined) result.maker = filters.maker
  if (filters.quoteToken !== undefined) result.quoteToken = filters.quoteToken

  if (filters.remaining !== undefined) {
    const remaining: Pagination.FilterRange<Hex.Hex> = {}
    remaining.min =
      typeof filters.remaining.min === 'bigint'
        ? Hex.fromNumber(filters.remaining.min)
        : null
    remaining.max =
      typeof filters.remaining.max === 'bigint'
        ? Hex.fromNumber(filters.remaining.max)
        : null
    result.remaining = remaining
  }

  if (filters.tick !== undefined) result.tick = filters.tick

  return result
}
