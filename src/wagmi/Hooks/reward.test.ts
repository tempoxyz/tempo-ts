import { type Address, parseUnits } from 'viem'
import { describe, expect, test, vi } from 'vitest'
import { useConnect } from 'wagmi'
import { config, renderHook, setupToken } from '../../../test/wagmi/config.js'
import * as hooks from './reward.js'

describe('useCancelSync', () => {
  test('default', async () => {
    const { result } = await renderHook(() => ({
      cancel: hooks.useCancelSync(),
      connect: useConnect(),
      start: hooks.useStartSync(),
    }))

    await result.current.connect.connectAsync({
      connector: config.connectors[0]!,
    })

    const { token } = await setupToken()

    // Start a reward stream
    const { id: streamId } = await result.current.start.mutateAsync({
      amount: parseUnits('100', 6),
      seconds: 3600,
      token,
    })

    // Cancel the stream
    await result.current.cancel.mutateAsync({
      id: streamId,
      token,
    })

    await vi.waitFor(() => expect(result.current.cancel.isSuccess).toBeTruthy())
  })
})

describe('useGetStream', () => {
  test('default', async () => {
    const { result } = await renderHook(() => ({
      connect: useConnect(),
      getStream: hooks.useGetStream(),
      startSync: hooks.useStartSync(),
    }))

    await result.current.connect.connectAsync({
      connector: config.connectors[0]!,
    })

    const { token } = await setupToken()

    const { id: streamId } = await result.current.startSync.mutateAsync({
      amount: parseUnits('100', 6),
      seconds: 10,
      token,
    })

    // Update the hook to query the stream
    const { result: streamResult } = await renderHook(() =>
      hooks.useGetStream({
        id: streamId,
        token,
      }),
    )

    await vi.waitFor(() => expect(streamResult.current.isSuccess).toBeTruthy())

    expect(streamResult.current.data?.funder).toBeDefined()
    expect(streamResult.current.data?.amountTotal).toBe(parseUnits('100', 6))
  })

  test('reactivity: id and token parameters', async () => {
    const { result: setupResult } = await renderHook(() => ({
      connect: useConnect(),
      startSync: hooks.useStartSync(),
    }))

    await setupResult.current.connect.connectAsync({
      connector: config.connectors[0]!,
    })

    const { token } = await setupToken()

    const { id } = await setupResult.current.startSync.mutateAsync({
      amount: parseUnits('100', 6),
      seconds: 10,
      token,
    })

    const { result, rerender } = await renderHook(
      (props) =>
        hooks.useGetStream({
          id: props?.id,
          token: props?.token,
        }),
      {
        initialProps: {
          id: undefined as bigint | undefined,
          token: undefined as Address | undefined,
        },
      },
    )

    await vi.waitFor(() => result.current.fetchStatus === 'idle')

    // Should be disabled when parameters are undefined
    expect(result.current.data).toBeUndefined()
    expect(result.current.isPending).toBe(true)
    expect(result.current.isEnabled).toBe(false)

    // Set parameters
    rerender({ id, token })

    await vi.waitFor(() => expect(result.current.isSuccess).toBeTruthy())

    // Should now be enabled and have data
    expect(result.current.isEnabled).toBe(true)
    expect(result.current.data).toBeDefined()
    expect(result.current.data?.amountTotal).toBe(parseUnits('100', 6))
  })
})

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

describe('useStartSync', () => {
  test('default', async () => {
    const { result } = await renderHook(() => ({
      connect: useConnect(),
      start: hooks.useStartSync(),
    }))

    await result.current.connect.connectAsync({
      connector: config.connectors[0]!,
    })

    const { token } = await setupToken()

    const { id } = await result.current.start.mutateAsync({
      amount: parseUnits('100', 6),
      seconds: 10,
      token,
    })

    expect(id).toBeGreaterThan(0n)

    await vi.waitFor(() => expect(result.current.start.isSuccess).toBeTruthy())
  })
})
