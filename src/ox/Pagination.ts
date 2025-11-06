import type * as Hex from 'ox/Hex'

/**
 * Filter range for numeric values.
 */
export type FilterRange<type> = {
  /** Maximum value (inclusive). */
  max?: type | null | undefined
  /** Minimum value (inclusive). */
  min?: type | null | undefined
}

/**
 * Sort order direction.
 */
export type SortOrder = 'asc' | 'desc'

/**
 * Sort configuration.
 */
export type Sort<on extends string = string> = {
  /** A field the items are compared with. */
  on: on
  /** An ordering direction. */
  order: SortOrder
}

/**
 * Pagination parameters.
 */
export type Params<
  filters extends Record<string, unknown> = Record<string, unknown>,
  cursor = Hex.Hex,
  sortOn extends string = string,
> = {
  /**
   * Cursor for pagination.
   *
   * Defaults to first entry based on the sort and filter configuration.
   * Use the `nextCursor` in response to get the next set of results.
   */
  cursor?: cursor | undefined
  /** Determines which items should be yielded in the response. */
  filters?: filters | undefined
  /**
   * Maximum number of items to return.
   *
   * Defaults to 10.
   * Maximum is 100.
   */
  limit?: number | undefined
  /** Determines the order of the items yielded in the response. */
  sort?: Sort<sortOn> | undefined
}

/**
 * Pagination response.
 */
export type Response<key extends string, type, cursor = Hex.Hex> = {
  /** Cursor for next page, null if no more results. */
  nextCursor: cursor | null
} & {
  [K in key]: readonly type[]
}

/**
 * Converts internal pagination parameters to RPC format.
 *
 * @example
 * ```ts twoslash
 * import { OrdersFilters, Pagination } from 'tempo.ts/ox'
 *
 * const rpcParameters = Pagination.toRpcParameters({
 *   cursor: '0x123',
 *   limit: 50,
 *   filters: {
 *     baseToken: '0x20c0000000000000000000000000000000000001',
 *     remaining: {
 *       min: 100n,
 *       max: 1000n,
 *     },
 *   },
 * }, {
 *   toRpcFilters: OrdersFilters.toRpc,
 * })
 * // @log: { cursor: '0x123', limit: 50, filters: { baseToken: '0x20c0...', remaining: { min: '0x64', max: '0x3e8' } } }
 * ```
 *
 * @param request - Internal request representation.
 * @returns RPC-formatted request.
 */
export function toRpcParameters<toRpcFilters extends (args: any) => any>(
  request: Params<Parameters<toRpcFilters>[0]>,
  options: toRpcParameters.Options<toRpcFilters>,
): Params<ReturnType<toRpcFilters>> {
  const result: Params<ReturnType<toRpcFilters>> = {}

  if (request.cursor !== undefined) result.cursor = request.cursor
  if (request.limit !== undefined) result.limit = request.limit
  if (request.sort !== undefined) result.sort = request.sort
  if (request.filters !== undefined)
    result.filters = options.toRpcFilters(request.filters)

  return result
}

export declare namespace toRpcParameters {
  type Options<toRpcFilters extends (args: any) => any> = {
    toRpcFilters: toRpcFilters
  }
}

/**
 * Converts RPC-formatted pagination response to internal representation.
 *
 * @example
 * ```ts twoslash
 * import { Order, Pagination } from 'tempo.ts/ox'
 *
 * const response = Pagination.fromRpcResponse({
 *   nextCursor: '0x123',
 *   items: [{
 *     amount: '0x64',
 *     baseToken: '0x20c0000000000000000000000000000000000001',
 *     flipTick: 0,
 *     isBid: true,
 *     isFlip: false,
 *     maker: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
 *     next: '0x0',
 *     orderId: '0x1',
 *     quoteToken: '0x20c0000000000000000000000000000000000002',
 *     prev: '0x0',
 *     remaining: '0x64',
 *     tick: 100,
 *   }],
 * }, {
 *   fromRpc: Order.fromRpc,
 * })
 * // @log: { nextCursor: '0x123', items: [{ amount: 100n, orderId: 1n, ... }] }
 * ```
 *
 * @param response - RPC-formatted response.
 * @param options - Conversion options.
 * @returns Internal response representation.
 */
export function fromRpcResponse<
  key extends string,
  fromRpc extends (args: any) => any,
>(
  response: Response<key, Parameters<fromRpc>[0]>,
  options: fromRpcResponse.Options<key, fromRpc>,
): Response<key, ReturnType<fromRpc>> {
  return {
    nextCursor: response.nextCursor,
    [options.key]: response[options.key].map(options.fromRpc),
  } as never
}

export declare namespace fromRpcResponse {
  type Options<key extends string, fromRpc extends (args: any) => any> = {
    key: key
    fromRpc: fromRpc
  }
}
