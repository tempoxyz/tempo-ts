import { describe, expect, test, vi } from 'vitest'
import { useConnect } from 'wagmi'
import { accounts } from '../../../test/viem/config.js'
import { config, renderHook } from '../../../test/wagmi/config.js'
import { useSetUserToken, useSetUserTokenSync, useUserToken } from './fee.js'

const account = accounts[0]

describe('useUserToken', () => {
  test('default', async () => {
    const { result } = await renderHook(() => useUserToken({ account }))
    await vi.waitFor(() => expect(result.current.isSuccess).toBeTruthy())
    expect(result.current.data).toMatchInlineSnapshot(`
      {
        "address": "0x20C0000000000000000000000000000000000001",
        "id": 1n,
      }
    `)
  })
})

describe('useSetUserToken', () => {
  test('default', async () => {
    const { result } = await renderHook(() => ({
      connect: useConnect(),
      setUserToken: useSetUserToken(),
    }))

    await result.current.connect.connectAsync({
      connector: config.connectors[0]!,
    })

    const hash = await result.current.setUserToken.mutateAsync({
      token: '0x20C0000000000000000000000000000000000001',
    })
    expect(hash).toBeDefined()

    await vi.waitFor(() =>
      expect(result.current.setUserToken.isSuccess).toBeTruthy(),
    )
  })
})

describe('useSetUserTokenSync', () => {
  test('default', async () => {
    const { result } = await renderHook(() => ({
      connect: useConnect(),
      setUserToken: useSetUserTokenSync(),
    }))

    await result.current.connect.connectAsync({
      connector: config.connectors[0]!,
    })

    const data = await result.current.setUserToken.mutateAsync({
      token: '0x20C0000000000000000000000000000000000001',
    })
    expect(data).toBeDefined()

    await vi.waitFor(() =>
      expect(result.current.setUserToken.isSuccess).toBeTruthy(),
    )
  })
})
