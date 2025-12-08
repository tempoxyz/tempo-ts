import type { Address } from 'viem'
import { describe, expect, test, vi } from 'vitest'
import { accounts } from '../../../test/viem/config.js'
import { renderHook } from '../../../test/wagmi/config.js'
import { useActiveNonceKeyCount, useNonce } from './nonce.js'

const account = accounts[0]

describe('useNonce', () => {
  test('default', async () => {
    const { result, rerender } = await renderHook(
      (props: { account?: Address; nonceKey?: bigint }) =>
        useNonce({ account: props?.account, nonceKey: props?.nonceKey }),
      { initialProps: { account: undefined, nonceKey: undefined } },
    )

    await vi.waitFor(() => result.current.fetchStatus === 'fetching')

    // Should be disabled when account is undefined
    expect(result.current.data).toBeUndefined()
    expect(result.current.isPending).toBe(true)
    expect(result.current.isEnabled).toBe(false)

    // Set account and nonceKey
    rerender({ account: account.address, nonceKey: 1n })

    await vi.waitFor(
      () => expect(result.current.isSuccess).toBeTruthy(),
      { timeout: 5_000 },
    )

    // Should now be enabled and have data
    expect(result.current.isEnabled).toBe(true)
    expect(typeof result.current.data).toBe('bigint')
  })

  test('reactivity: account parameter', async () => {
    const { result, rerender } = await renderHook(
      (props: { account?: Address }) =>
        useNonce({ account: props?.account, nonceKey: 1n }),
      { initialProps: { account: undefined as Address | undefined } },
    )

    await vi.waitFor(() => result.current.fetchStatus === 'fetching')

    // Should be disabled when account is undefined
    expect(result.current.isEnabled).toBe(false)

    // Set account
    rerender({ account: account.address })

    await vi.waitFor(
      () => expect(result.current.isSuccess).toBeTruthy(),
      { timeout: 5_000 },
    )

    expect(result.current.isEnabled).toBe(true)
    expect(typeof result.current.data).toBe('bigint')
  })

  test('reactivity: nonceKey parameter', async () => {
    const { result, rerender } = await renderHook(
      (props: { nonceKey?: bigint }) =>
        useNonce({ account: account.address, nonceKey: props?.nonceKey }),
      { initialProps: { nonceKey: undefined as bigint | undefined } },
    )

    await vi.waitFor(() => result.current.fetchStatus === 'fetching')

    // Should be disabled when nonceKey is undefined
    expect(result.current.isEnabled).toBe(false)

    // Set nonceKey
    rerender({ nonceKey: 1n })

    await vi.waitFor(
      () => expect(result.current.isSuccess).toBeTruthy(),
      { timeout: 5_000 },
    )

    expect(result.current.isEnabled).toBe(true)
    expect(typeof result.current.data).toBe('bigint')
  })
})

describe('useActiveNonceKeyCount', () => {
  test('default', async () => {
    const { result, rerender } = await renderHook(
      (props: { account?: Address }) =>
        useActiveNonceKeyCount({ account: props?.account }),
      { initialProps: { account: undefined as Address | undefined } },
    )

    await vi.waitFor(() => result.current.fetchStatus === 'fetching')

    // Should be disabled when account is undefined
    expect(result.current.data).toBeUndefined()
    expect(result.current.isPending).toBe(true)
    expect(result.current.isEnabled).toBe(false)

    // Set account
    rerender({ account: account.address })

    await vi.waitFor(
      () => expect(result.current.isSuccess).toBeTruthy(),
      { timeout: 5_000 },
    )

    // Should now be enabled and have data
    expect(result.current.isEnabled).toBe(true)
    expect(result.current.data).toBe(0n)
  })
})

// Note: Watch hook tests would require triggering transactions that use specific
// nonce keys, which happens at the protocol level during AA transactions.
describe.todo('useWatchNonceIncremented')
describe.todo('useWatchActiveKeyCountChanged')
