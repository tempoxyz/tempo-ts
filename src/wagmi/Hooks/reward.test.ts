import { getAccount } from '@wagmi/core'
import type { Address } from 'viem'
import { describe, expect, test, vi } from 'vitest'
import { useConnect } from 'wagmi'
import { config, renderHook, setupToken } from '../../../test/wagmi/config.js'
import * as hooks from './reward.js'

describe('useGetTotalPerSecond', () => {
  test('default', async () => {
    const { token } = await setupToken()

    const { result } = await renderHook(() =>
      hooks.useGetTotalPerSecond({
        token,
      }),
    )

    await vi.waitFor(() => expect(result.current.isSuccess).toBeTruthy())

    expect(result.current.data).toBe(0n)
  })

  test('reactivity: token parameter', async () => {
    const { result, rerender } = await renderHook(
      (props) =>
        hooks.useGetTotalPerSecond({
          token: props?.token,
        }),
      {
        initialProps: {
          token: undefined as Address | undefined,
        },
      },
    )

    await vi.waitFor(() => result.current.fetchStatus === 'idle')

    // Should be disabled when token is undefined
    expect(result.current.data).toBeUndefined()
    expect(result.current.isPending).toBe(true)
    expect(result.current.isEnabled).toBe(false)

    // Setup token
    const { token } = await setupToken()

    // Set token
    rerender({ token })

    await vi.waitFor(() => expect(result.current.isSuccess).toBeTruthy())

    // Should now be enabled and have data
    expect(result.current.isEnabled).toBe(true)
    expect(result.current.data).toBe(0n)
  })
})

describe('useUserRewardInfo', () => {
  test('default', async () => {
    const { token } = await setupToken()

    const account = getAccount(config).address

    const { result } = await renderHook(() =>
      hooks.useUserRewardInfo({
        token,
        account,
      }),
    )

    await vi.waitFor(() => expect(result.current.isSuccess).toBeTruthy())

    expect(result.current.data?.rewardRecipient).toBeDefined()
    expect(result.current.data?.rewardPerToken).toBeDefined()
    expect(result.current.data?.rewardBalance).toBeDefined()
  })

  test('reactivity: account and token parameters', async () => {
    const { result, rerender } = await renderHook(
      (props) =>
        hooks.useUserRewardInfo({
          token: props?.token,
          account: props?.account,
        }),
      {
        initialProps: {
          token: undefined as Address | undefined,
          account: undefined as Address | undefined,
        },
      },
    )

    await vi.waitFor(() => result.current.fetchStatus === 'idle')

    // Should be disabled when both token and account are undefined
    expect(result.current.data).toBeUndefined()
    expect(result.current.isPending).toBe(true)
    expect(result.current.isEnabled).toBe(false)

    // Setup token (this also connects the account)
    const { token } = await setupToken()

    // Set token only (account still undefined)
    rerender({ token, account: undefined })

    await vi.waitFor(() => result.current.fetchStatus === 'idle')

    // Should still be disabled when account is undefined
    expect(result.current.data).toBeUndefined()
    expect(result.current.isPending).toBe(true)
    expect(result.current.isEnabled).toBe(false)

    // Get account from config (already connected by setupToken)
    const account = getAccount(config).address

    // Set both token and account
    rerender({ token, account })

    await vi.waitFor(() => expect(result.current.isSuccess).toBeTruthy())

    // Should now be enabled and have data
    expect(result.current.isEnabled).toBe(true)
    expect(result.current.data?.rewardRecipient).toBeDefined()
    expect(result.current.data?.rewardPerToken).toBeDefined()
    expect(result.current.data?.rewardBalance).toBeDefined()
  })
})

describe('useSetRecipientSync', () => {
  test('default', async () => {
    const { result } = await renderHook(() => ({
      connect: useConnect(),
      setRecipient: hooks.useSetRecipientSync(),
    }))

    await result.current.connect.connectAsync({
      connector: config.connectors[0]!,
    })

    const { token } = await setupToken()

    await result.current.setRecipient.mutateAsync({
      recipient: '0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC',
      token,
    })

    await vi.waitFor(() =>
      expect(result.current.setRecipient.isSuccess).toBeTruthy(),
    )
  })
})
