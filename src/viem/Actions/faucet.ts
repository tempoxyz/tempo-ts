import type { Account, Address, Chain, Client, Hash, Transport } from 'viem'
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
