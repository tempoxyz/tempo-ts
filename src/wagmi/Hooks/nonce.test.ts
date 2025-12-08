import type { Address } from 'viem'
import { describe, expect, test, vi } from 'vitest'
import { accounts } from '../../../test/viem/config.js'
import { renderHook } from '../../../test/wagmi/config.js'
import { useActiveNonceKeyCount, useNonce } from './nonce.js'

const account = accounts[0]

describe('useNonce', () => {
  test('default', async () => {
    let testAccount: Address | undefined
    let testNonceKey: bigint | undefined

    const { result, rerender } = await renderHook(() =>
      useNonce({ account: testAccount, nonceKey: testNonceKey }),
    )

    await vi.waitFor(() => result.current.fetchStatus === 'fetching')

    // Should be disabled when account is undefined
    expect(result.current.data).toBeUndefined()
    expect(result.current.isPending).toBe(true)
    expect(result.current.isEnabled).toBe(false)

    // Set account and nonceKey
    testAccount = account.address
    testNonceKey = 1n
    rerender()

    await vi.waitFor(
      () => expect(result.current.isSuccess).toBeTruthy(),
      { timeout: 5_000 },
    )

    // Should now be enabled and have data
    expect(result.current.isEnabled).toBe(true)
    expect(typeof result.current.data).toBe('bigint')
  })

  test('reactivity: account parameter', async () => {
    let testAccount: Address | undefined

    const { result, rerender } = await renderHook(() =>
      useNonce({ account: testAccount, nonceKey: 1n }),
    )

    await vi.waitFor(() => result.current.fetchStatus === 'fetching')

    // Should be disabled when account is undefined
    expect(result.current.isEnabled).toBe(false)

    // Set account
    testAccount = account.address
    rerender()

    await vi.waitFor(
      () => expect(result.current.isSuccess).toBeTruthy(),
      { timeout: 5_000 },
    )

    expect(result.current.isEnabled).toBe(true)
    expect(typeof result.current.data).toBe('bigint')
  })

  test('reactivity: nonceKey parameter', async () => {
    let testNonceKey: bigint | undefined

    const { result, rerender } = await renderHook(() =>
      useNonce({ account: account.address, nonceKey: testNonceKey }),
    )

    await vi.waitFor(() => result.current.fetchStatus === 'fetching')

    // Should be disabled when nonceKey is undefined
    expect(result.current.isEnabled).toBe(false)

    // Set nonceKey
    testNonceKey = 1n
    rerender()

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
    let testAccount: Address | undefined

    const { result, rerender } = await renderHook(() =>
      useActiveNonceKeyCount({ account: testAccount }),
    )

    await vi.waitFor(() => result.current.fetchStatus === 'fetching')

    // Should be disabled when account is undefined
    expect(result.current.data).toBeUndefined()
    expect(result.current.isPending).toBe(true)
    expect(result.current.isEnabled).toBe(false)

    // Set account
    testAccount = account.address
    rerender()

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
