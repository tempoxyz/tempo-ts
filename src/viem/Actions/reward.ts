import {
  type Account,
  type Address,
  type BaseErrorType,
  type Chain,
  type Client,
  type Log,
  parseEventLogs,
  type ReadContractReturnType,
  type Transport,
  type WriteContractReturnType,
} from 'viem'
import { readContract, writeContract, writeContractSync } from 'viem/actions'
import * as Abis from '../Abis.js'
import type { ReadParameters, WriteParameters } from '../internal/types.js'
import { defineCall } from '../internal/utils.js'

/**
 * Cancels an active reward stream and refunds remaining tokens.
 *
 * - Callable only by the stream's funder.
 * - Stops future emission for the stream at the current block timestamp.
 * - Computes the refund as `amountTotal - distributedSoFar` and attempts to transfer it back to the funder.
 * - If the refund transfer is forbidden by TIP-403, the stream is still canceled but `refund` will be 0 in the event.
 * - Reverts with `StreamInactive` if the stream doesn't exist, is already canceled, or has already ended.
 * - Reverts with `NotStreamFunder` if the caller is not the stream's funder.
 *
 * @example
 * ```ts
 * import { createClient, http } from 'viem'
 * import { tempo } from 'tempo.ts/chains'
 * import * as actions from 'tempo.ts/viem/actions'
 * import { privateKeyToAccount } from 'viem/accounts'
 *
 * const client = createClient({
 *   account: privateKeyToAccount('0x...'),
 *   chain: tempo,
 *   transport: http(),
 * })
 *
 * const hash = await actions.rewards.cancel(client, {
 *   id: 1n,
 *   token: '0x20c0000000000000000000000000000000000001',
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The transaction hash.
 */
export async function cancel<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: cancel.Parameters<chain, account>,
): Promise<cancel.ReturnValue> {
  return cancel.inner(writeContract, client, parameters)
}

/**
 * Cancels an active reward stream and waits for confirmation.
 *
 * - Callable only by the stream's funder.
 * - Stops future emission for the stream at the current block timestamp.
 * - Computes the refund as `amountTotal - distributedSoFar` and attempts to transfer it back to the funder.
 * - If the refund transfer is forbidden by TIP-403, the stream is still canceled but `refund` will be 0.
 * - Reverts with `StreamInactive` if the stream doesn't exist, is already canceled, or has already ended.
 * - Reverts with `NotStreamFunder` if the caller is not the stream's funder.
 *
 * @example
 * ```ts
 * import { createClient, http } from 'viem'
 * import { tempo } from 'tempo.ts/chains'
 * import * as actions from 'tempo.ts/viem/actions'
 * import { privateKeyToAccount } from 'viem/accounts'
 *
 * const client = createClient({
 *   account: privateKeyToAccount('0x...'),
 *   chain: tempo,
 *   transport: http(),
 * })
 *
 * const { funder, id, refund, receipt } = await actions.rewards.cancelSync(client, {
 *   id: 1n,
 *   token: '0x20c0000000000000000000000000000000000001',
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The funder, stream ID, refund amount, and transaction receipt.
 */
export async function cancelSync<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: cancelSync.Parameters<chain, account>,
): Promise<cancelSync.ReturnValue> {
  const { throwOnReceiptRevert = true, ...rest } = parameters
  const receipt = await cancel.inner(writeContractSync, client, {
    ...rest,
    throwOnReceiptRevert,
  } as never)
  const { args } = cancel.extractEvent(receipt.logs)
  return {
    ...args,
    receipt,
  } as never
}

export namespace cancel {
  export type Args = {
    /** The unique stream ID to cancel (must be owned by the caller) */
    id: bigint
    /** The TIP20 token address containing the reward stream */
    token: Address
  }

  export type Parameters<
    chain extends Chain | undefined = Chain | undefined,
    account extends Account | undefined = Account | undefined,
  > = WriteParameters<chain, account> & Args

  export type ReturnValue = WriteContractReturnType

  // TODO: exhaustive error type
  export type ErrorType = BaseErrorType

  /** @internal */
  export async function inner<
    action extends typeof writeContract | typeof writeContractSync,
    chain extends Chain | undefined,
    account extends Account | undefined,
  >(
    action: action,
    client: Client<Transport, chain, account>,
    parameters: Parameters<chain, account>,
  ): Promise<ReturnType<action>> {
    const { id, token, ...rest } = parameters
    const call = cancel.call({ id, token })
    return (await action(client, {
      ...rest,
      ...call,
    } as never)) as never
  }

  /**
   * Defines a call to the `cancel` function.
   *
   * Can be passed as a parameter to:
   * - [`estimateContractGas`](https://viem.sh/docs/contract/estimateContractGas): estimate the gas cost of the call
   * - [`simulateContract`](https://viem.sh/docs/contract/simulateContract): simulate the call
   * - [`sendCalls`](https://viem.sh/docs/actions/wallet/sendCalls): send multiple calls
   *
   * @example
   * ```ts
   * import { createClient, http, walletActions } from 'viem'
   * import { tempo } from 'tempo.ts/chains'
   * import * as actions from 'tempo.ts/viem/actions'
   *
   * const client = createClient({
   *   chain: tempo,
   *   transport: http(),
   * }).extend(walletActions)
   *
   * const hash = await client.sendTransaction({
   *   calls: [actions.rewards.cancel.call({
   *     id: 1n,
   *     token: '0x20c0000000000000000000000000000000000001',
   *   })],
   * })
   * ```
   *
   * @param args - Arguments.
   * @returns The call.
   */
  export function call(args: Args) {
    const { id, token } = args
    return defineCall({
      address: token,
      abi: Abis.tip20,
      args: [id],
      functionName: 'cancelReward',
    })
  }

  /**
   * Extracts the `RewardCanceled` event from logs.
   *
   * @param logs - The logs.
   * @returns The `RewardCanceled` event.
   */
  export function extractEvent(logs: Log[]) {
    const [log] = parseEventLogs({
      abi: Abis.tip20,
      logs,
      eventName: 'RewardCanceled',
      strict: true,
    })
    if (!log) throw new Error('`RewardCanceled` event not found.')
    return log
  }
}

export declare namespace cancelSync {
  export type Parameters<
    chain extends Chain | undefined = Chain | undefined,
    account extends Account | undefined = Account | undefined,
  > = WriteParameters<chain, account> & cancel.Args

  export type ReturnValue = {
    /** The address that funded the stream */
    funder: Address
    /** The stream ID that was canceled */
    id: bigint
    /** The transaction receipt */
    receipt: Awaited<ReturnType<typeof writeContractSync>>
    /** The amount refunded to the funder (0 if TIP-403 policy forbids the refund transfer) */
    refund: bigint
  }

  export type ErrorType = cancel.ErrorType
}

/**
 * Claims accumulated rewards for a recipient.
 *
 * This function allows a reward recipient to claim their accumulated rewards
 * and receive them as token transfers to their own balance.
 *
 * - Accrues all pending rewards up to the current block timestamp.
 * - Updates the caller's reward accounting.
 * - Transfers the caller's accumulated `rewardBalance` from the token contract to the caller.
 * - If the contract's balance is insufficient, claims up to the available amount.
 * - Returns the actual amount claimed.
 *
 * Notes:
 * - Reverts with `Paused` if the token is paused.
 * - Reverts with `PolicyForbids` if the caller is not authorized to receive tokens under TIP-403.
 * - If opted in, the claimed amount is added back to `optedInSupply` since it goes to the recipient's balance.
 *
 * @example
 * ```ts
 * import { createClient, http } from 'viem'
 * import { tempo } from 'tempo.ts/chains'
 * import * as actions from 'tempo.ts/viem/actions'
 * import { privateKeyToAccount } from 'viem/accounts'
 *
 * const client = createClient({
 *   account: privateKeyToAccount('0x...'),
 *   chain: tempo,
 *   transport: http(),
 * })
 *
 * const hash = await actions.reward.claim(client, {
 *   token: '0x20c0000000000000000000000000000000000001',
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The transaction hash.
 */
export async function claim<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: claim.Parameters<chain, account>,
): Promise<claim.ReturnValue> {
  return claim.inner(writeContract, client, parameters)
}

export namespace claim {
  export type Args = {
    /** The TIP20 token address */
    token: Address
  }

  export type Parameters<
    chain extends Chain | undefined = Chain | undefined,
    account extends Account | undefined = Account | undefined,
  > = WriteParameters<chain, account> & Args

  export type ReturnValue = WriteContractReturnType

  // TODO: exhaustive error type
  export type ErrorType = BaseErrorType

  /** @internal */
  export async function inner<
    action extends typeof writeContract | typeof writeContractSync,
    chain extends Chain | undefined,
    account extends Account | undefined,
  >(
    action: action,
    client: Client<Transport, chain, account>,
    parameters: Parameters<chain, account>,
  ): Promise<ReturnType<action>> {
    const { token, ...rest } = parameters
    const call = claim.call({ token })
    return (await action(client, {
      ...rest,
      ...call,
    } as never)) as never
  }

  /**
   * Defines a call to the `claimRewards` function.
   *
   * Can be passed as a parameter to:
   * - [`estimateContractGas`](https://viem.sh/docs/contract/estimateContractGas): estimate the gas cost of the call
   * - [`simulateContract`](https://viem.sh/docs/contract/simulateContract): simulate the call
   * - [`sendCalls`](https://viem.sh/docs/actions/wallet/sendCalls): send multiple calls
   *
   * @example
   * ```ts
   * import { createClient, http, walletActions } from 'viem'
   * import { tempo } from 'tempo.ts/chains'
   * import * as actions from 'tempo.ts/viem/actions'
   *
   * const client = createClient({
   *   chain: tempo,
   *   transport: http(),
   * }).extend(walletActions)
   *
   * const hash = await client.sendTransaction({
   *   calls: [actions.reward.claim.call({
   *     token: '0x20c0000000000000000000000000000000000001',
   *   })],
   * })
   * ```
   *
   * @param args - Arguments.
   * @returns The call.
   */
  export function call(args: Args) {
    const { token } = args
    return defineCall({
      address: token,
      abi: Abis.tip20,
      args: [],
      functionName: 'claimRewards',
    })
  }
}

/**
 * Claims accumulated rewards for a recipient and waits for confirmation.
 *
 * This function allows a reward recipient to claim their accumulated rewards
 * and receive them as token transfers to their own balance.
 *
 * Behavior:
 * - Accrues all pending rewards up to the current block timestamp.
 * - Updates the caller's reward accounting.
 * - Transfers the caller's accumulated `rewardBalance` from the token contract to the caller.
 * - If the contract's balance is insufficient, claims up to the available amount.
 *
 * Notes:
 * - Reverts with `Paused` if the token is paused.
 * - Reverts with `PolicyForbids` if the caller is not authorized to receive tokens under TIP-403.
 * - If opted in, the claimed amount is added back to `optedInSupply` since it goes to the recipient's balance.
 *
 * @example
 * ```ts
 * import { createClient, http } from 'viem'
 * import { tempo } from 'tempo.ts/chains'
 * import * as actions from 'tempo.ts/viem/actions'
 * import { privateKeyToAccount } from 'viem/accounts'
 *
 * const client = createClient({
 *   account: privateKeyToAccount('0x...'),
 *   chain: tempo,
 *   transport: http(),
 * })
 *
 * const { receipt } = await actions.reward.claimSync(client, {
 *   token: '0x20c0000000000000000000000000000000000001',
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The amount claimed and transaction receipt.
 */
export async function claimSync<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: claimSync.Parameters<chain, account>,
): Promise<claimSync.ReturnValue> {
  const { throwOnReceiptRevert = true, ...rest } = parameters
  const receipt = await claim.inner(writeContractSync, client, {
    ...rest,
    throwOnReceiptRevert,
  } as never)
  return {
    receipt,
  } as never
}

export namespace claimSync {
  export type Parameters<
    chain extends Chain | undefined = Chain | undefined,
    account extends Account | undefined = Account | undefined,
  > = WriteParameters<chain, account> & claim.Args

  export type ReturnValue = {
    /** The transaction receipt */
    receipt: Awaited<ReturnType<typeof writeContractSync>>
  }

  export type ErrorType = claim.ErrorType
}

/**
 * Gets a reward stream by its ID.
 *
 * Returns the stream details including:
 * - `funder`: The address that funded the stream
 * - `startTime`: When the stream started (block timestamp)
 * - `endTime`: When the stream is scheduled to end
 * - `ratePerSecondScaled`: The per-second emission rate (scaled by ACC_PRECISION = 1e18)
 * - `amountTotal`: The total amount allocated to the stream
 *
 * Note: If the stream has been canceled or doesn't exist, `funder` will be the zero address.
 *
 * @example
 * ```ts
 * import { createClient, http } from 'viem'
 * import { tempo } from 'tempo.ts/chains'
 * import * as actions from 'tempo.ts/viem/actions'
 *
 * const client = createClient({
 *   chain: tempo,
 *   transport: http(),
 * })
 *
 * const stream = await actions.rewards.getStream(client, {
 *   id: 1n,
 *   token: '0x20c0000000000000000000000000000000000001',
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The reward stream details.
 */
export async function getStream<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  parameters: getStream.Parameters,
): Promise<getStream.ReturnValue> {
  return readContract(client, {
    ...parameters,
    ...getStream.call(parameters),
  })
}

export namespace getStream {
  export type Parameters = ReadParameters & Args

  export type Args = {
    /** The stream ID to query (0 is never used for streams, only for immediate distributions) */
    id: bigint
    /** The TIP20 token address */
    token: Address
  }

  export type ReturnValue = ReadContractReturnType<
    typeof Abis.tip20,
    'getStream',
    never
  >

  /**
   * Defines a call to the `getStream` function.
   *
   * @param args - Arguments.
   * @returns The call.
   */
  export function call(args: Args) {
    const { id, token } = args
    return defineCall({
      address: token,
      abi: Abis.tip20,
      args: [id],
      functionName: 'getStream',
    })
  }
}

/**
 * Gets the total reward per second rate for all active streams.
 *
 * Returns the current aggregate per-second emission rate scaled by `ACC_PRECISION` (1e18).
 * This value represents the sum of all active reward streams' emission rates.
 * The rate decreases when streams end (via `finalizeStreams`) or are canceled.
 *
 * @example
 * ```ts
 * import { createClient, http } from 'viem'
 * import { tempo } from 'tempo.ts/chains'
 * import * as actions from 'tempo.ts/viem/actions'
 *
 * const client = createClient({
 *   chain: tempo,
 *   transport: http(),
 * })
 *
 * const rate = await actions.rewards.getTotalPerSecond(client, {
 *   token: '0x20c0000000000000000000000000000000000001',
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The total reward per second (scaled by 1e18).
 */
export async function getTotalPerSecond<chain extends Chain | undefined>(
  client: Client<Transport, chain>,
  parameters: getTotalPerSecond.Parameters,
): Promise<getTotalPerSecond.ReturnValue> {
  return readContract(client, {
    ...parameters,
    ...getTotalPerSecond.call(parameters),
  })
}

export namespace getTotalPerSecond {
  export type Parameters = ReadParameters & Args

  export type Args = {
    /** The TIP20 token address */
    token: Address
  }

  export type ReturnValue = ReadContractReturnType<
    typeof Abis.tip20,
    'totalRewardPerSecond',
    never
  >

  /**
   * Defines a call to the `totalRewardPerSecond` function.
   *
   * @param args - Arguments.
   * @returns The call.
   */
  export function call(args: Args) {
    const { token } = args
    return defineCall({
      address: token,
      abi: Abis.tip20,
      args: [],
      functionName: 'totalRewardPerSecond',
    })
  }
}

/**
 * Sets or changes the reward recipient for a token holder.
 *
 * This function allows a token holder to designate who should receive their share of rewards:
 * - If `recipient` is the zero address, opts out from rewards distribution.
 * - Otherwise, opts in and sets `recipient` as the address that will receive accrued rewards.
 * - Can be called with `recipient == msg.sender` to receive rewards directly.
 * - Automatically distributes any accrued rewards to the current recipient before changing.
 *
 * TIP-403 Policy:
 * - Reverts with `PolicyForbids` if `recipient` is not the zero address and either the holder or recipient is not authorized to receive tokens under the token's transfer policy.
 *
 * @example
 * ```ts
 * import { createClient, http } from 'viem'
 * import { tempo } from 'tempo.ts/chains'
 * import * as actions from 'tempo.ts/viem/actions'
 * import { privateKeyToAccount } from 'viem/accounts'
 *
 * const client = createClient({
 *   account: privateKeyToAccount('0x...'),
 *   chain: tempo,
 *   transport: http(),
 * })
 *
 * const hash = await actions.rewards.setRecipient(client, {
 *   recipient: '0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC',
 *   token: '0x20c0000000000000000000000000000000000001',
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The transaction hash.
 */
export async function setRecipient<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: setRecipient.Parameters<chain, account>,
): Promise<setRecipient.ReturnValue> {
  return setRecipient.inner(writeContract, client, parameters)
}

/**
 * Sets or changes the reward recipient for a token holder and waits for confirmation.
 *
 * This function allows a token holder to designate who should receive their share of rewards:
 * - If `recipient` is the zero address, opts out from rewards distribution.
 * - Otherwise, opts in and sets `recipient` as the address that will receive accrued rewards.
 * - Can be called with `recipient == msg.sender` to receive rewards directly.
 * - Automatically distributes any accrued rewards to the current recipient before changing.
 *
 * TIP-403 Policy:
 * - Reverts with `PolicyForbids` if `recipient` is not the zero address and either the holder or recipient is not authorized to receive tokens under the token's transfer policy.
 *
 * @example
 * ```ts
 * import { createClient, http } from 'viem'
 * import { tempo } from 'tempo.ts/chains'
 * import * as actions from 'tempo.ts/viem/actions'
 * import { privateKeyToAccount } from 'viem/accounts'
 *
 * const client = createClient({
 *   account: privateKeyToAccount('0x...'),
 *   chain: tempo,
 *   transport: http(),
 * })
 *
 * const { holder, recipient, receipt } = await actions.rewards.setRecipientSync(client, {
 *   recipient: '0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC',
 *   token: '0x20c0000000000000000000000000000000000001',
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The holder, recipient, and transaction receipt.
 */
export async function setRecipientSync<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: setRecipientSync.Parameters<chain, account>,
): Promise<setRecipientSync.ReturnValue> {
  const { throwOnReceiptRevert = true, ...rest } = parameters
  const receipt = await setRecipient.inner(writeContractSync, client, {
    ...rest,
    throwOnReceiptRevert,
  } as never)
  const { args } = setRecipient.extractEvent(receipt.logs)
  return {
    ...args,
    receipt,
  } as never
}

export namespace setRecipient {
  export type Args = {
    /** The reward recipient address (use zero address to opt out of rewards) */
    recipient: Address
    /** The TIP20 token address */
    token: Address
  }

  export type Parameters<
    chain extends Chain | undefined = Chain | undefined,
    account extends Account | undefined = Account | undefined,
  > = WriteParameters<chain, account> & Args

  export type ReturnValue = WriteContractReturnType

  // TODO: exhaustive error type
  export type ErrorType = BaseErrorType

  /** @internal */
  export async function inner<
    action extends typeof writeContract | typeof writeContractSync,
    chain extends Chain | undefined,
    account extends Account | undefined,
  >(
    action: action,
    client: Client<Transport, chain, account>,
    parameters: Parameters<chain, account>,
  ): Promise<ReturnType<action>> {
    const { recipient, token, ...rest } = parameters
    const call = setRecipient.call({ recipient, token })
    return (await action(client, {
      ...rest,
      ...call,
    } as never)) as never
  }

  /**
   * Defines a call to the `setRecipient` function.
   *
   * Can be passed as a parameter to:
   * - [`estimateContractGas`](https://viem.sh/docs/contract/estimateContractGas): estimate the gas cost of the call
   * - [`simulateContract`](https://viem.sh/docs/contract/simulateContract): simulate the call
   * - [`sendCalls`](https://viem.sh/docs/actions/wallet/sendCalls): send multiple calls
   *
   * @example
   * ```ts
   * import { createClient, http, walletActions } from 'viem'
   * import { tempo } from 'tempo.ts/chains'
   * import * as actions from 'tempo.ts/viem/actions'
   *
   * const client = createClient({
   *   chain: tempo,
   *   transport: http(),
   * }).extend(walletActions)
   *
   * const hash = await client.sendTransaction({
   *   calls: [actions.rewards.setRecipient.call({
   *     recipient: '0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC',
   *     token: '0x20c0000000000000000000000000000000000001',
   *   })],
   * })
   * ```
   *
   * @param args - Arguments.
   * @returns The call.
   */
  export function call(args: Args) {
    const { recipient, token } = args
    return defineCall({
      address: token,
      abi: Abis.tip20,
      args: [recipient],
      functionName: 'setRewardRecipient',
    })
  }

  /**
   * Extracts the `RewardRecipientSet` event from logs.
   *
   * @param logs - The logs.
   * @returns The `RewardRecipientSet` event.
   */
  export function extractEvent(logs: Log[]) {
    const [log] = parseEventLogs({
      abi: Abis.tip20,
      logs,
      eventName: 'RewardRecipientSet',
      strict: true,
    })
    if (!log) throw new Error('`RewardRecipientSet` event not found.')
    return log
  }
}

export declare namespace setRecipientSync {
  export type Parameters<
    chain extends Chain | undefined = Chain | undefined,
    account extends Account | undefined = Account | undefined,
  > = WriteParameters<chain, account> & setRecipient.Args

  export type ReturnValue = {
    /** The token holder address who set their reward recipient */
    holder: Address
    /** The transaction receipt */
    receipt: Awaited<ReturnType<typeof writeContractSync>>
    /** The reward recipient address (zero address indicates opt-out) */
    recipient: Address
  }

  export type ErrorType = setRecipient.ErrorType
}

/**
 * Starts a new reward stream that distributes tokens to opted-in holders.
 *
 * Behavior:
 * - Transfers `amount` of tokens from the caller into the token contract's reward pool.
 * - If `seconds == 0`: Immediately distributes `amount` to current opted-in holders by increasing `rewardPerTokenStored`.
 *   Returns stream ID `0`. Distribution occurs when holders interact with the token (transfers, etc.).
 * - If `seconds > 0`: Starts a linear stream that emits evenly from `block.timestamp` to `block.timestamp + seconds`.
 *   Returns a unique stream ID for later cancellation.
 *
 * Notes:
 * - Reverts with `InvalidAmount` if `amount == 0`.
 * - Allowed even when `optedInSupply == 0` (tokens distributed while no one is opted in are locked permanently).
 * - The transfer from caller to pool is subject to TIP-403 policy checks.
 *
 * @example
 * ```ts
 * import { createClient, http } from 'viem'
 * import { tempo } from 'tempo.ts/chains'
 * import * as actions from 'tempo.ts/viem/actions'
 * import { privateKeyToAccount } from 'viem/accounts'
 *
 * const client = createClient({
 *   account: privateKeyToAccount('0x...'),
 *   chain: tempo,
 *   transport: http(),
 * })
 *
 * const hash = await actions.rewards.start(client, {
 *   amount: 100000000000000000000n,
 *   seconds: 86400,
 *   token: '0x20c0000000000000000000000000000000000001',
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The transaction hash.
 */
export async function start<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: start.Parameters<chain, account>,
): Promise<start.ReturnValue> {
  return start.inner(writeContract, client, parameters)
}

/**
 * Starts a new reward stream that distributes tokens to opted-in holders and waits for confirmation.
 *
 * Behavior:
 * - Transfers `amount` of tokens from the caller into the token contract's reward pool.
 * - If `seconds == 0`: Immediately distributes `amount` to current opted-in holders by increasing `rewardPerTokenStored`.
 *   Returns stream ID `0`. Distribution occurs when holders interact with the token (transfers, etc.).
 * - If `seconds > 0`: Starts a linear stream that emits evenly from `block.timestamp` to `block.timestamp + seconds`.
 *   Returns a unique stream ID for later cancellation.
 *
 * Notes:
 * - Reverts with `InvalidAmount` if `amount == 0`.
 * - Allowed even when `optedInSupply == 0` (tokens distributed while no one is opted in are locked permanently).
 * - The transfer from caller to pool is subject to TIP-403 policy checks.
 *
 * @example
 * ```ts
 * import { createClient, http } from 'viem'
 * import { tempo } from 'tempo.ts/chains'
 * import * as actions from 'tempo.ts/viem/actions'
 * import { privateKeyToAccount } from 'viem/accounts'
 *
 * const client = createClient({
 *   account: privateKeyToAccount('0x...'),
 *   chain: tempo,
 *   transport: http(),
 * })
 *
 * const { id, receipt } = await actions.rewards.startSync(client, {
 *   amount: 100000000000000000000n,
 *   seconds: 86400,
 *   token: '0x20c0000000000000000000000000000000000001',
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The stream ID, funder, amount, duration, and transaction receipt.
 */
export async function startSync<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: startSync.Parameters<chain, account>,
): Promise<startSync.ReturnValue> {
  const { throwOnReceiptRevert = true, ...rest } = parameters
  const receipt = await start.inner(writeContractSync, client, {
    ...rest,
    throwOnReceiptRevert,
  } as never)
  const { args } = start.extractEvent(receipt.logs)
  return {
    ...args,
    receipt,
  } as never
}

export namespace start {
  export type Args = {
    /** The amount of tokens to distribute (must be > 0) */
    amount: bigint
    /** The duration in seconds (0 for immediate distribution, >0 for linear streaming) */
    seconds: number
    /** The TIP20 token address */
    token: Address
  }

  export type Parameters<
    chain extends Chain | undefined = Chain | undefined,
    account extends Account | undefined = Account | undefined,
  > = WriteParameters<chain, account> & Args

  export type ReturnValue = WriteContractReturnType

  // TODO: exhaustive error type
  export type ErrorType = BaseErrorType

  /** @internal */
  export async function inner<
    action extends typeof writeContract | typeof writeContractSync,
    chain extends Chain | undefined,
    account extends Account | undefined,
  >(
    action: action,
    client: Client<Transport, chain, account>,
    parameters: Parameters<chain, account>,
  ): Promise<ReturnType<action>> {
    const { amount, seconds, token, ...rest } = parameters
    const call = start.call({ amount, seconds, token })
    return (await action(client, {
      ...rest,
      ...call,
    } as never)) as never
  }

  /**
   * Defines a call to the `start` function.
   *
   * Can be passed as a parameter to:
   * - [`estimateContractGas`](https://viem.sh/docs/contract/estimateContractGas): estimate the gas cost of the call
   * - [`simulateContract`](https://viem.sh/docs/contract/simulateContract): simulate the call
   * - [`sendCalls`](https://viem.sh/docs/actions/wallet/sendCalls): send multiple calls
   *
   * @example
   * ```ts
   * import { createClient, http, walletActions } from 'viem'
   * import { tempo } from 'tempo.ts/chains'
   * import * as actions from 'tempo.ts/viem/actions'
   *
   * const client = createClient({
   *   chain: tempo,
   *   transport: http(),
   * }).extend(walletActions)
   *
   * const hash = await client.sendTransaction({
   *   calls: [actions.rewards.start.call({
   *     amount: 100000000000000000000n,
   *     seconds: 86400,
   *     token: '0x20c0000000000000000000000000000000000001',
   *   })],
   * })
   * ```
   *
   * @param args - Arguments.
   * @returns The call.
   */
  export function call(args: Args) {
    const { amount, seconds, token } = args
    return defineCall({
      address: token,
      abi: Abis.tip20,
      args: [amount, seconds],
      functionName: 'startReward',
    })
  }

  /**
   * Extracts the `RewardScheduled` event from logs.
   *
   * @param logs - The logs.
   * @returns The `RewardScheduled` event.
   */
  export function extractEvent(logs: Log[]) {
    const [log] = parseEventLogs({
      abi: Abis.tip20,
      logs,
      eventName: 'RewardScheduled',
      strict: true,
    })
    if (!log) throw new Error('`RewardScheduled` event not found.')
    return log
  }
}

export declare namespace startSync {
  export type Parameters<
    chain extends Chain | undefined = Chain | undefined,
    account extends Account | undefined = Account | undefined,
  > = WriteParameters<chain, account> & start.Args

  export type ReturnValue = {
    /** The total amount allocated to the stream */
    amount: bigint
    /** The duration of the stream in seconds (0 for immediate distributions) */
    durationSeconds: number
    /** The address that funded the stream */
    funder: Address
    /** The unique stream ID (0 for immediate distributions, >0 for streaming distributions) */
    id: bigint
    /** The transaction receipt */
    receipt: Awaited<ReturnType<typeof writeContractSync>>
  }

  export type ErrorType = start.ErrorType
}
