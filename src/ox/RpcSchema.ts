import type * as RpcSchema from 'ox/RpcSchema'
import type { UnionToTuple } from '../internal/types.js'
import type * as Order from './Order.js'
import type * as OrdersFilters from './OrdersFilters.js'
import type * as Pagination from './Pagination.js'

/**
 * Union of all JSON-RPC Methods for the `dex_` namespace.
 */
export type Dex = RpcSchema.From<{
  Request: {
    method: 'dex_getOrders'
    params: Pagination.Params<OrdersFilters.Rpc>
  }
  ReturnType: Pagination.Response<'orders', Order.Rpc>
}>

/**
 * Viem-compatible RPC schema for the `dex_` namespace.
 */
export type DexViem = ToViem<Dex>

type ToViem<schema extends RpcSchema.Generic> = UnionToTuple<schema> extends [
  infer head extends RpcSchema.Generic,
  ...infer tail extends RpcSchema.Generic[],
]
  ? [
      {
        Method: head['Request']['method']
        Parameters: head['Request']['params']
        ReturnType: head['ReturnType']
      },
      ...ToViem<tail[number]>,
    ]
  : []
