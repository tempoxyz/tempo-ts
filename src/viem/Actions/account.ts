import type * as Address from 'ox/Address'
import {
  type Account,
  type Chain,
  type Client,
  type GetEventArgs,
  type Log,
  parseEventLogs,
  type TransactionReceipt,
  type Transport,
  type WriteContractReturnType,
} from 'viem'
import { parseAccount } from 'viem/accounts'
import { writeContract, writeContractSync } from 'viem/actions'
import type { Compute } from '../../internal/types.js'
import * as Abis from '../Abis.js'
import type { WriteParameters } from '../internal/types.js'
import { defineCall } from '../internal/utils.js'
import * as Key from '../Key.js'

/**
 * Authorizes a key on an account.
 *
 * @example
 * TODO
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The transaction hash.
 */
export async function authorize<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: authorize.Parameters<chain, account>,
): Promise<authorize.ReturnValue> {
  return authorize.inner(writeContract, client, parameters)
}

export namespace authorize {
  export type Parameters<
    chain extends Chain | undefined = Chain | undefined,
    account extends Account | undefined = Account | undefined,
  > = WriteParameters<chain, account> & Args

  export type Args = {
    /** Key to authorize. */
    key: Key.from.Value
  }

  export type ReturnValue = WriteContractReturnType

  /** @internal */
  export async function inner<
    action extends typeof writeContract | typeof writeContractSync,
    chain extends Chain | undefined,
    account extends Account | undefined,
  >(
    action: action,
    client: Client<Transport, chain, account>,
    parameters: authorize.Parameters<chain, account>,
  ): Promise<ReturnType<action>> {
    const { account = client.account, key, ...rest } = parameters
    if (!account) throw new Error('`account` is required')
    const address = parseAccount(account).address!
    const call = authorize.call({ address, key })
    return (await action(client, {
      account,
      ...rest,
      ...call,
    } as never)) as never
  }

  /**
   * Defines a call to the `authorize` function.
   *
   * Can be passed as a parameter to:
   * - [`estimateContractGas`](https://viem.sh/docs/contract/estimateContractGas): estimate the gas cost of the call
   * - [`simulateContract`](https://viem.sh/docs/contract/simulateContract): simulate the call
   * - [`sendCalls`](https://viem.sh/docs/actions/wallet/sendCalls): send multiple calls
   *
   * @example
   * TODO
   *
   * @param args - Arguments.
   * @returns The call.
   */
  export function call(args: Args & { address: Address.Address }) {
    const { address, key } = args
    return defineCall({
      address,
      abi: Abis.ithacaAccount,
      functionName: 'authorize',
      args: [Key.serialize(Key.from(key))],
    })
  }

  /**
   * Extracts the `Authorized` event from logs.
   *
   * @param logs - The logs.
   * @returns The `Authorized` event.
   */
  export function extractEvent(logs: Log[]) {
    const [log] = parseEventLogs({
      abi: Abis.ithacaAccount,
      logs,
      eventName: 'Authorized',
      strict: true,
    })
    if (!log) throw new Error('`Authorized` event not found.')
    return log
  }
}

/**
 * Authorizes a key on an account.
 * Waits for the transaction to be included before returning.
 *
 * @example
 * TODO
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The transaction receipt and event data.
 */
export async function authorizeSync<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: authorizeSync.Parameters<chain, account>,
): Promise<authorizeSync.ReturnValue> {
  const { throwOnReceiptRevert = true, ...rest } = parameters
  const receipt = await authorize.inner(writeContractSync, client, {
    ...rest,
    throwOnReceiptRevert,
  } as never)
  const { args } = authorize.extractEvent(receipt.logs)
  const key = Key.deserialize(args.key)
  return {
    ...args,
    rawKey: args.key,
    key,
    receipt,
  } as never
}

export namespace authorizeSync {
  export type Parameters<
    chain extends Chain | undefined = Chain | undefined,
    account extends Account | undefined = Account | undefined,
  > = authorize.Parameters<chain, account>

  export type Args = authorize.Args

  export type ReturnValue = Compute<{
    /** Key. */
    key: Key.Key
    /** Raw key data. */
    rawKey: GetEventArgs<
      typeof Abis.ithacaAccount,
      'Authorized',
      {
        IndexedOnly: false
        Required: true
      }
    >['key']
    /** Key hash. */
    keyHash: GetEventArgs<
      typeof Abis.ithacaAccount,
      'Authorized',
      {
        IndexedOnly: false
        Required: true
      }
    >['keyHash']
    /** Transaction receipt. */
    receipt: TransactionReceipt
  }>
}
