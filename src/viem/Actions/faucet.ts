import type {
  Account,
  Address,
  Chain,
  Client,
  Hash,
  TransactionReceipt,
  Transport,
} from 'viem'
import { waitForTransactionReceipt } from 'viem/actions'
import { parseAccount } from 'viem/utils'

/**
 * Funds an account with an initial amount of set token(s)
 * on Tempo's testnet.
 *
 * @example
 * ```ts
 * import { createClient, http } from 'viem'
 * import { tempo } from 'tempo.ts/chains'
 * import { Actions } from 'tempo.ts/viem'
 *
 * const client = createClient({
 *   chain: tempo({ feeToken: '0x20c0000000000000000000000000000000000001' }),
 *   transport: http(),
 * })
 *
 * const hashes = await Actions.faucet.fund(client, {
 *   account: '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef',
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The transaction hash.
 */
export async function fund<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  parameters: fund.Parameters,
): Promise<fund.ReturnValue> {
  const account = parseAccount(parameters.account)
  return client.request<{
    Method: 'tempo_fundAddress'
    Parameters: [address: Address]
    ReturnType: readonly Hash[]
  }>({
    method: 'tempo_fundAddress',
    params: [account.address],
  })
}

export declare namespace fund {
  export type Parameters = {
    /** Account to fund. */
    account: Account | Address
  }

  export type ReturnValue = readonly Hash[]
}

/**
 * Funds an account with an initial amount of set token(s)
 * on Tempo's testnet. Waits for the transactions to be included
 * on a block before returning a response.
 *
 * @example
 * ```ts
 * import { createClient, http } from 'viem'
 * import { tempo } from 'tempo.ts/chains'
 * import { Actions } from 'tempo.ts/viem'
 *
 * const client = createClient({
 *   chain: tempo({ feeToken: '0x20c0000000000000000000000000000000000001' }),
 *   transport: http(),
 * })
 *
 * const hashes = await Actions.faucet.fundSync(client, {
 *   account: '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef',
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The transaction hash.
 */
export async function fundSync<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  parameters: fundSync.Parameters,
): Promise<fundSync.ReturnValue> {
  const { timeout = 10_000 } = parameters
  const account = parseAccount(parameters.account)
  const hashes = await client.request<{
    Method: 'tempo_fundAddress'
    Parameters: [address: Address]
    ReturnType: readonly Hash[]
  }>({
    method: 'tempo_fundAddress',
    params: [account.address],
  })
  const receipts = await Promise.all(
    hashes.map((hash) =>
      waitForTransactionReceipt(client, {
        hash,
        checkReplacement: false,
        timeout,
      }),
    ),
  )
  return receipts
}

export declare namespace fundSync {
  export type Parameters = {
    /** Account to fund. */
    account: Account | Address
    /** Timeout. */
    timeout?: number | undefined
  }

  export type ReturnValue = readonly TransactionReceipt[]
}
