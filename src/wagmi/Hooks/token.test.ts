import { type Address, parseEther } from 'viem'
import { describe, expect, test, vi } from 'vitest'
import { useConnect } from 'wagmi'
import { accounts } from '../../../test/viem/config.js'
import { config, renderHook } from '../../../test/wagmi/config.js'
import * as hooks from './token.js'

const account = accounts[0]
const account2 = accounts[1]

describe('useGetAllowance', () => {
  test('default', async () => {
    const { result } = await renderHook(() =>
      hooks.useGetAllowance({
        account: account.address,
        spender: account2.address,
      }),
    )

    await vi.waitFor(() => expect(result.current.isSuccess).toBeTruthy())

    expect(result.current.data).toBeDefined()
    expect(typeof result.current.data).toBe('bigint')
  })

  test('reactivity: account parameter', async () => {
    let accountAddress: Address | undefined
    let spenderAddress: Address | undefined

    const { result, rerender } = await renderHook(() =>
      hooks.useGetAllowance({
        account: accountAddress,
        spender: spenderAddress,
      }),
    )

    await vi.waitFor(() => result.current.fetchStatus === 'fetching')

    // Should be disabled when account or spender is undefined
    expect(result.current.data).toBeUndefined()
    expect(result.current.isPending).toBe(true)
    expect(result.current.isEnabled).toBe(false)

    // Set account but not spender
    accountAddress = account.address
    rerender()

    await vi.waitFor(() => result.current.fetchStatus === 'fetching')

    // Still disabled when spender is undefined
    expect(result.current.isEnabled).toBe(false)

    // Set spender
    spenderAddress = account2.address
    rerender()

    await vi.waitFor(() => expect(result.current.isSuccess).toBeTruthy())

    // Should now be enabled and have data
    expect(result.current.isEnabled).toBe(true)
    expect(result.current.data).toBeDefined()
    expect(typeof result.current.data).toBe('bigint')
  })
})

describe('useGetBalance', () => {
  test('default', async () => {
    const { result } = await renderHook(() =>
      hooks.useGetBalance({ account: account.address }),
    )

    await vi.waitFor(() => expect(result.current.isSuccess).toBeTruthy())

    expect(result.current.data).toBeDefined()
    expect(typeof result.current.data).toBe('bigint')
    expect(result.current.data).toBeGreaterThan(0n)
  })

  test('reactivity: account parameter', async () => {
    let accountAddress: Address | undefined

    const { result, rerender } = await renderHook(() =>
      hooks.useGetBalance({ account: accountAddress }),
    )

    await vi.waitFor(() => result.current.fetchStatus === 'fetching')

    // Should be disabled when account is undefined
    expect(result.current.data).toBeUndefined()
    expect(result.current.isPending).toBe(true)
    expect(result.current.isEnabled).toBe(false)

    // Set account
    accountAddress = account.address
    rerender()

    await vi.waitFor(() => expect(result.current.isSuccess).toBeTruthy())

    // Should now be enabled and have data
    expect(result.current.isEnabled).toBe(true)
    expect(result.current.data).toBeDefined()
    expect(typeof result.current.data).toBe('bigint')
    expect(result.current.data).toBeGreaterThan(0n)
  })
})

describe('useGetMetadata', () => {
  test('default', async () => {
    const { result } = await renderHook(() => hooks.useGetMetadata({}))

    await vi.waitFor(() => expect(result.current.isSuccess).toBeTruthy())

    expect(result.current.data).toBeDefined()
    expect(result.current.data?.name).toBeDefined()
    expect(result.current.data?.symbol).toBeDefined()
    expect(result.current.data?.decimals).toBeDefined()
  })
})

describe('useGetRoleAdmin', () => {
  test('default', async () => {
    const { result: connectResult } = await renderHook(() => ({
      connect: useConnect(),
      createSync: hooks.useCreateSync(),
    }))

    await connectResult.current.connect.connectAsync({
      connector: config.connectors[0]!,
    })

    // Create a token where we're the admin
    const createData = await connectResult.current.createSync.mutateAsync({
      currency: 'USD',
      name: 'GetRoleAdmin Hook Test',
      symbol: 'GRAHTEST',
    })

    const { result } = await renderHook(() =>
      hooks.useGetRoleAdmin({
        token: createData.token,
        role: 'issuer',
      }),
    )

    await vi.waitFor(() => expect(result.current.isSuccess).toBeTruthy())

    expect(result.current.data).toBeDefined()
    expect(typeof result.current.data).toBe('string')
  })
})

describe('useHasRole', () => {
  test('default', async () => {
    const { result: connectResult } = await renderHook(() => ({
      connect: useConnect(),
      createSync: hooks.useCreateSync(),
    }))

    await connectResult.current.connect.connectAsync({
      connector: config.connectors[0]!,
    })

    // Create a token where we're the admin
    const createData = await connectResult.current.createSync.mutateAsync({
      currency: 'USD',
      name: 'HasRole Hook Test',
      symbol: 'HRHTEST',
    })

    const { result } = await renderHook(() =>
      hooks.useHasRole({
        account: account.address,
        token: createData.token,
        role: 'defaultAdmin',
      }),
    )

    await vi.waitFor(() => expect(result.current.isSuccess).toBeTruthy())

    expect(result.current.data).toBe(true)
  })

  test('reactivity: account parameter', async () => {
    const { result: connectResult } = await renderHook(() => ({
      connect: useConnect(),
      createSync: hooks.useCreateSync(),
    }))

    await connectResult.current.connect.connectAsync({
      connector: config.connectors[0]!,
    })

    // Create a token where we're the admin
    const createData = await connectResult.current.createSync.mutateAsync({
      currency: 'USD',
      name: 'HasRole Hook Reactivity Test',
      symbol: 'HRHRTEST',
    })

    let accountAddress: Address | undefined

    const { result, rerender } = await renderHook(() =>
      hooks.useHasRole({
        account: accountAddress,
        token: createData.token,
        role: 'defaultAdmin',
      }),
    )

    await vi.waitFor(() => result.current.fetchStatus === 'fetching')

    // Should be disabled when account is undefined
    expect(result.current.data).toBeUndefined()
    expect(result.current.isPending).toBe(true)
    expect(result.current.isEnabled).toBe(false)

    // Set account
    accountAddress = account.address
    rerender()

    await vi.waitFor(() => expect(result.current.isSuccess).toBeTruthy())

    // Should now be enabled and have data
    expect(result.current.isEnabled).toBe(true)
    expect(result.current.data).toBe(true)
  })
})

describe('useApprove', () => {
  test('default', async () => {
    const { result } = await renderHook(() => ({
      connect: useConnect(),
      approve: hooks.useApprove(),
    }))

    await result.current.connect.connectAsync({
      connector: config.connectors[0]!,
    })

    const hash = await result.current.approve.mutateAsync({
      spender: account2.address,
      amount: parseEther('100'),
    })
    expect(hash).toBeDefined()

    await vi.waitFor(() =>
      expect(result.current.approve.isSuccess).toBeTruthy(),
    )
  })
})

describe('useApproveSync', () => {
  test('default', async () => {
    const { result } = await renderHook(() => ({
      connect: useConnect(),
      approve: hooks.useApproveSync(),
    }))

    await result.current.connect.connectAsync({
      connector: config.connectors[0]!,
    })

    const data = await result.current.approve.mutateAsync({
      spender: account2.address,
      amount: parseEther('100'),
    })
    expect(data).toBeDefined()
    expect(data.receipt).toBeDefined()

    await vi.waitFor(() =>
      expect(result.current.approve.isSuccess).toBeTruthy(),
    )
  })
})

describe('useBurn', () => {
  test('default', async () => {
    const { result } = await renderHook(() => ({
      connect: useConnect(),
      createSync: hooks.useCreateSync(),
      grantRolesSync: hooks.useGrantRolesSync(),
      mintSync: hooks.useMintSync(),
      burn: hooks.useBurn(),
    }))

    await result.current.connect.connectAsync({
      connector: config.connectors[0]!,
    })

    // Create a new token
    const { token: tokenAddr } = await result.current.createSync.mutateAsync({
      currency: 'USD',
      name: 'Burnable Hook Token',
      symbol: 'BURNHOOK',
    })

    // Grant issuer role
    await result.current.grantRolesSync.mutateAsync({
      token: tokenAddr,
      roles: ['issuer'],
      to: account.address,
    })

    // Mint some tokens
    await result.current.mintSync.mutateAsync({
      token: tokenAddr,
      to: account.address,
      amount: parseEther('1000'),
    })

    const hash = await result.current.burn.mutateAsync({
      token: tokenAddr,
      amount: parseEther('1'),
    })
    expect(hash).toBeDefined()

    await vi.waitFor(() => expect(result.current.burn.isSuccess).toBeTruthy())
  })
})

describe('useBurnSync', () => {
  test('default', async () => {
    const { result } = await renderHook(() => ({
      connect: useConnect(),
      createSync: hooks.useCreateSync(),
      grantRolesSync: hooks.useGrantRolesSync(),
      mintSync: hooks.useMintSync(),
      burn: hooks.useBurnSync(),
    }))

    await result.current.connect.connectAsync({
      connector: config.connectors[0]!,
    })

    // Create a new token
    const { token: tokenAddr } = await result.current.createSync.mutateAsync({
      currency: 'USD',
      name: 'Burnable Hook Token Sync',
      symbol: 'BURNHOOKSYNC',
    })

    // Grant issuer role
    await result.current.grantRolesSync.mutateAsync({
      token: tokenAddr,
      roles: ['issuer'],
      to: account.address,
    })

    // Mint some tokens
    await result.current.mintSync.mutateAsync({
      token: tokenAddr,
      to: account.address,
      amount: parseEther('1000'),
    })

    const data = await result.current.burn.mutateAsync({
      token: tokenAddr,
      amount: parseEther('1'),
    })
    expect(data).toBeDefined()
    expect(data.receipt).toBeDefined()

    await vi.waitFor(() => expect(result.current.burn.isSuccess).toBeTruthy())
  })
})

describe('useChangeTransferPolicy', () => {
  test('default', async () => {
    const { result } = await renderHook(() => ({
      connect: useConnect(),
      createSync: hooks.useCreateSync(),
      changeTransferPolicy: hooks.useChangeTransferPolicy(),
    }))

    await result.current.connect.connectAsync({
      connector: config.connectors[0]!,
    })

    // Create a new token
    const { token: tokenAddr } = await result.current.createSync.mutateAsync({
      currency: 'USD',
      name: 'Policy Hook Token',
      symbol: 'POLICYHOOK',
    })

    const hash = await result.current.changeTransferPolicy.mutateAsync({
      token: tokenAddr,
      policyId: 0n,
    })
    expect(hash).toBeDefined()

    await vi.waitFor(() =>
      expect(result.current.changeTransferPolicy.isSuccess).toBeTruthy(),
    )
  })
})

describe('useChangeTransferPolicySync', () => {
  test('default', async () => {
    const { result } = await renderHook(() => ({
      connect: useConnect(),
      createSync: hooks.useCreateSync(),
      changeTransferPolicy: hooks.useChangeTransferPolicySync(),
    }))

    await result.current.connect.connectAsync({
      connector: config.connectors[0]!,
    })

    // Create a new token
    const { token: tokenAddr } = await result.current.createSync.mutateAsync({
      currency: 'USD',
      name: 'Policy Hook Token Sync',
      symbol: 'POLICYHOOKSYNC',
    })

    const data = await result.current.changeTransferPolicy.mutateAsync({
      token: tokenAddr,
      policyId: 0n,
    })
    expect(data).toBeDefined()
    expect(data.receipt).toBeDefined()

    await vi.waitFor(() =>
      expect(result.current.changeTransferPolicy.isSuccess).toBeTruthy(),
    )
  })
})

describe('useCreate', () => {
  test('default', async () => {
    const { result } = await renderHook(() => ({
      connect: useConnect(),
      create: hooks.useCreate(),
    }))

    await result.current.connect.connectAsync({
      connector: config.connectors[0]!,
    })

    const hash = await result.current.create.mutateAsync({
      name: 'Hook Test Token',
      symbol: 'HOOKTEST',
      currency: 'USD',
    })
    expect(hash).toBeDefined()

    await vi.waitFor(() => expect(result.current.create.isSuccess).toBeTruthy())
  })
})

describe('useCreateSync', () => {
  test('default', async () => {
    const { result } = await renderHook(() => ({
      connect: useConnect(),
      create: hooks.useCreateSync(),
    }))

    await result.current.connect.connectAsync({
      connector: config.connectors[0]!,
    })

    const data = await result.current.create.mutateAsync({
      name: 'Hook Test Token Sync',
      symbol: 'HOOKTESTSYNC',
      currency: 'USD',
    })
    expect(data).toBeDefined()
    expect(data.receipt).toBeDefined()
    expect(data.token).toBeDefined()
    expect(data.name).toBe('Hook Test Token Sync')

    await vi.waitFor(() => expect(result.current.create.isSuccess).toBeTruthy())
  })
})

describe('useFinalizeUpdateQuoteToken', () => {
  test('default', async () => {
    const { result } = await renderHook(() => ({
      connect: useConnect(),
      createSync: hooks.useCreateSync(),
      updateQuoteTokenSync: hooks.useUpdateQuoteTokenSync(),
      finalizeUpdateQuoteToken: hooks.useFinalizeUpdateQuoteToken(),
    }))

    await result.current.connect.connectAsync({
      connector: config.connectors[0]!,
    })

    // Create quote token
    const { token: quoteToken } = await result.current.createSync.mutateAsync({
      currency: 'USD',
      name: 'Finalize Quote Hook',
      symbol: 'FQHOOK',
    })

    // Create main token
    const { token: tokenAddr } = await result.current.createSync.mutateAsync({
      currency: 'USD',
      name: 'Finalize Main Hook',
      symbol: 'FMHOOK',
    })

    // Update quote token first
    await result.current.updateQuoteTokenSync.mutateAsync({
      token: tokenAddr,
      quoteToken,
    })

    const hash = await result.current.finalizeUpdateQuoteToken.mutateAsync({
      token: tokenAddr,
    })
    expect(hash).toBeDefined()

    await vi.waitFor(() =>
      expect(result.current.finalizeUpdateQuoteToken.isSuccess).toBeTruthy(),
    )
  })
})

describe('useFinalizeUpdateQuoteTokenSync', () => {
  test('default', async () => {
    const { result } = await renderHook(() => ({
      connect: useConnect(),
      createSync: hooks.useCreateSync(),
      updateQuoteTokenSync: hooks.useUpdateQuoteTokenSync(),
      finalizeUpdateQuoteToken: hooks.useFinalizeUpdateQuoteTokenSync(),
    }))

    await result.current.connect.connectAsync({
      connector: config.connectors[0]!,
    })

    // Create quote token
    const { token: quoteToken } = await result.current.createSync.mutateAsync({
      currency: 'USD',
      name: 'Finalize Quote Hook Sync',
      symbol: 'FQHOOKSYNC',
    })

    // Create main token
    const { token: tokenAddr } = await result.current.createSync.mutateAsync({
      currency: 'USD',
      name: 'Finalize Main Hook Sync',
      symbol: 'FMHOOKSYNC',
    })

    // Update quote token first
    await result.current.updateQuoteTokenSync.mutateAsync({
      token: tokenAddr,
      quoteToken,
    })

    const data = await result.current.finalizeUpdateQuoteToken.mutateAsync({
      token: tokenAddr,
    })
    expect(data).toBeDefined()
    expect(data.receipt).toBeDefined()

    await vi.waitFor(() =>
      expect(result.current.finalizeUpdateQuoteToken.isSuccess).toBeTruthy(),
    )
  })
})

describe('useGrantRoles', () => {
  test('default', async () => {
    const { result } = await renderHook(() => ({
      connect: useConnect(),
      createSync: hooks.useCreateSync(),
      grantRoles: hooks.useGrantRoles(),
    }))

    await result.current.connect.connectAsync({
      connector: config.connectors[0]!,
    })

    // Create a new token
    const { token: tokenAddr } = await result.current.createSync.mutateAsync({
      currency: 'USD',
      name: 'Grant Hook Token',
      symbol: 'GRANTHOOK',
    })

    const hash = await result.current.grantRoles.mutateAsync({
      token: tokenAddr,
      roles: ['issuer'],
      to: account2.address,
    })
    expect(hash).toBeDefined()

    await vi.waitFor(() =>
      expect(result.current.grantRoles.isSuccess).toBeTruthy(),
    )
  })
})

describe('useGrantRolesSync', () => {
  test('default', async () => {
    const { result } = await renderHook(() => ({
      connect: useConnect(),
      createSync: hooks.useCreateSync(),
      grantRoles: hooks.useGrantRolesSync(),
    }))

    await result.current.connect.connectAsync({
      connector: config.connectors[0]!,
    })

    // Create a new token
    const { token: tokenAddr } = await result.current.createSync.mutateAsync({
      currency: 'USD',
      name: 'Grant Hook Token Sync',
      symbol: 'GRANTHOOKSYNC',
    })

    const data = await result.current.grantRoles.mutateAsync({
      token: tokenAddr,
      roles: ['issuer'],
      to: account2.address,
    })
    expect(data).toBeDefined()
    expect(data.receipt).toBeDefined()
    expect(data.value).toBeDefined()

    await vi.waitFor(() =>
      expect(result.current.grantRoles.isSuccess).toBeTruthy(),
    )
  })
})

describe('useMint', () => {
  test('default', async () => {
    const { result } = await renderHook(() => ({
      connect: useConnect(),
      createSync: hooks.useCreateSync(),
      grantRolesSync: hooks.useGrantRolesSync(),
      mint: hooks.useMint(),
    }))

    await result.current.connect.connectAsync({
      connector: config.connectors[0]!,
    })

    // Create a new token
    const { token: tokenAddr } = await result.current.createSync.mutateAsync({
      currency: 'USD',
      name: 'Mint Hook Token',
      symbol: 'MINTHOOK',
    })

    // Grant issuer role
    await result.current.grantRolesSync.mutateAsync({
      token: tokenAddr,
      roles: ['issuer'],
      to: account.address,
    })

    const hash = await result.current.mint.mutateAsync({
      token: tokenAddr,
      to: account.address,
      amount: parseEther('100'),
    })
    expect(hash).toBeDefined()

    await vi.waitFor(() => expect(result.current.mint.isSuccess).toBeTruthy())
  })
})

describe('useMintSync', () => {
  test('default', async () => {
    const { result } = await renderHook(() => ({
      connect: useConnect(),
      createSync: hooks.useCreateSync(),
      grantRolesSync: hooks.useGrantRolesSync(),
      mint: hooks.useMintSync(),
    }))

    await result.current.connect.connectAsync({
      connector: config.connectors[0]!,
    })

    // Create a new token
    const { token: tokenAddr } = await result.current.createSync.mutateAsync({
      currency: 'USD',
      name: 'Mint Hook Token Sync',
      symbol: 'MINTHOOKSYNC',
    })

    // Grant issuer role
    await result.current.grantRolesSync.mutateAsync({
      token: tokenAddr,
      roles: ['issuer'],
      to: account.address,
    })

    const data = await result.current.mint.mutateAsync({
      token: tokenAddr,
      to: account.address,
      amount: parseEther('100'),
    })
    expect(data).toBeDefined()
    expect(data.receipt).toBeDefined()

    await vi.waitFor(() => expect(result.current.mint.isSuccess).toBeTruthy())
  })
})

describe('usePause', () => {
  test('default', async () => {
    const { result } = await renderHook(() => ({
      connect: useConnect(),
      createSync: hooks.useCreateSync(),
      grantRolesSync: hooks.useGrantRolesSync(),
      pause: hooks.usePause(),
    }))

    await result.current.connect.connectAsync({
      connector: config.connectors[0]!,
    })

    // Create a new token
    const { token: tokenAddr } = await result.current.createSync.mutateAsync({
      currency: 'USD',
      name: 'Pause Hook Token',
      symbol: 'PAUSEHOOK',
    })

    // Grant pause role
    await result.current.grantRolesSync.mutateAsync({
      token: tokenAddr,
      roles: ['pause'],
      to: account.address,
    })

    const hash = await result.current.pause.mutateAsync({
      token: tokenAddr,
    })
    expect(hash).toBeDefined()

    await vi.waitFor(() => expect(result.current.pause.isSuccess).toBeTruthy())
  })
})

describe('usePauseSync', () => {
  test('default', async () => {
    const { result } = await renderHook(() => ({
      connect: useConnect(),
      createSync: hooks.useCreateSync(),
      grantRolesSync: hooks.useGrantRolesSync(),
      pause: hooks.usePauseSync(),
    }))

    await result.current.connect.connectAsync({
      connector: config.connectors[0]!,
    })

    // Create a new token
    const { token: tokenAddr } = await result.current.createSync.mutateAsync({
      currency: 'USD',
      name: 'Pause Hook Token Sync',
      symbol: 'PAUSEHOOKSYNC',
    })

    // Grant pause role
    await result.current.grantRolesSync.mutateAsync({
      token: tokenAddr,
      roles: ['pause'],
      to: account.address,
    })

    const data = await result.current.pause.mutateAsync({
      token: tokenAddr,
    })
    expect(data).toBeDefined()
    expect(data.receipt).toBeDefined()

    await vi.waitFor(() => expect(result.current.pause.isSuccess).toBeTruthy())
  })
})

describe('useRenounceRoles', () => {
  test('default', async () => {
    const { result } = await renderHook(() => ({
      connect: useConnect(),
      createSync: hooks.useCreateSync(),
      grantRolesSync: hooks.useGrantRolesSync(),
      renounceRoles: hooks.useRenounceRoles(),
    }))

    await result.current.connect.connectAsync({
      connector: config.connectors[0]!,
    })

    // Create a new token
    const { token: tokenAddr } = await result.current.createSync.mutateAsync({
      currency: 'USD',
      name: 'Renounce Hook Token',
      symbol: 'RENOUNCEHOOK',
    })

    // Grant issuer role to ourselves
    await result.current.grantRolesSync.mutateAsync({
      token: tokenAddr,
      roles: ['issuer'],
      to: account.address,
    })

    const hash = await result.current.renounceRoles.mutateAsync({
      token: tokenAddr,
      roles: ['issuer'],
    })
    expect(hash).toBeDefined()

    await vi.waitFor(() =>
      expect(result.current.renounceRoles.isSuccess).toBeTruthy(),
    )
  })
})

describe('useRenounceRolesSync', () => {
  test('default', async () => {
    const { result } = await renderHook(() => ({
      connect: useConnect(),
      createSync: hooks.useCreateSync(),
      grantRolesSync: hooks.useGrantRolesSync(),
      renounceRoles: hooks.useRenounceRolesSync(),
    }))

    await result.current.connect.connectAsync({
      connector: config.connectors[0]!,
    })

    // Create a new token
    const { token: tokenAddr } = await result.current.createSync.mutateAsync({
      currency: 'USD',
      name: 'Renounce Hook Token Sync',
      symbol: 'RENOUNCEHOOKSYNC',
    })

    // Grant issuer role to ourselves
    await result.current.grantRolesSync.mutateAsync({
      token: tokenAddr,
      roles: ['issuer'],
      to: account.address,
    })

    const data = await result.current.renounceRoles.mutateAsync({
      token: tokenAddr,
      roles: ['issuer'],
    })
    expect(data).toBeDefined()
    expect(data.receipt).toBeDefined()
    expect(data.value).toBeDefined()

    await vi.waitFor(() =>
      expect(result.current.renounceRoles.isSuccess).toBeTruthy(),
    )
  })
})

describe('useRevokeRoles', () => {
  test('default', async () => {
    const { result } = await renderHook(() => ({
      connect: useConnect(),
      createSync: hooks.useCreateSync(),
      grantRolesSync: hooks.useGrantRolesSync(),
      revokeRoles: hooks.useRevokeRoles(),
    }))

    await result.current.connect.connectAsync({
      connector: config.connectors[0]!,
    })

    // Create a new token
    const { token: tokenAddr } = await result.current.createSync.mutateAsync({
      currency: 'USD',
      name: 'Revoke Hook Token',
      symbol: 'REVOKEHOOK',
    })

    // Grant issuer role to account2
    await result.current.grantRolesSync.mutateAsync({
      token: tokenAddr,
      roles: ['issuer'],
      to: account2.address,
    })

    const hash = await result.current.revokeRoles.mutateAsync({
      token: tokenAddr,
      roles: ['issuer'],
      from: account2.address,
    })
    expect(hash).toBeDefined()

    await vi.waitFor(() =>
      expect(result.current.revokeRoles.isSuccess).toBeTruthy(),
    )
  })
})

describe('useRevokeRolesSync', () => {
  test('default', async () => {
    const { result } = await renderHook(() => ({
      connect: useConnect(),
      createSync: hooks.useCreateSync(),
      grantRolesSync: hooks.useGrantRolesSync(),
      revokeRoles: hooks.useRevokeRolesSync(),
    }))

    await result.current.connect.connectAsync({
      connector: config.connectors[0]!,
    })

    // Create a new token
    const { token: tokenAddr } = await result.current.createSync.mutateAsync({
      currency: 'USD',
      name: 'Revoke Hook Token Sync',
      symbol: 'REVOKEHOOKSYNC',
    })

    // Grant issuer role to account2
    await result.current.grantRolesSync.mutateAsync({
      token: tokenAddr,
      roles: ['issuer'],
      to: account2.address,
    })

    const data = await result.current.revokeRoles.mutateAsync({
      token: tokenAddr,
      roles: ['issuer'],
      from: account2.address,
    })
    expect(data).toBeDefined()
    expect(data.receipt).toBeDefined()
    expect(data.value).toBeDefined()

    await vi.waitFor(() =>
      expect(result.current.revokeRoles.isSuccess).toBeTruthy(),
    )
  })
})

describe('useSetRoleAdmin', () => {
  test('default', async () => {
    const { result } = await renderHook(() => ({
      connect: useConnect(),
      createSync: hooks.useCreateSync(),
      setRoleAdmin: hooks.useSetRoleAdmin(),
    }))

    await result.current.connect.connectAsync({
      connector: config.connectors[0]!,
    })

    // Create a new token
    const { token: tokenAddr } = await result.current.createSync.mutateAsync({
      currency: 'USD',
      name: 'Role Admin Hook Token',
      symbol: 'ROLEADMINHOOK',
    })

    const hash = await result.current.setRoleAdmin.mutateAsync({
      token: tokenAddr,
      role: 'issuer',
      adminRole: 'pause',
    })
    expect(hash).toBeDefined()

    await vi.waitFor(() =>
      expect(result.current.setRoleAdmin.isSuccess).toBeTruthy(),
    )
  })
})

describe('useSetRoleAdminSync', () => {
  test('default', async () => {
    const { result } = await renderHook(() => ({
      connect: useConnect(),
      createSync: hooks.useCreateSync(),
      setRoleAdmin: hooks.useSetRoleAdminSync(),
    }))

    await result.current.connect.connectAsync({
      connector: config.connectors[0]!,
    })

    // Create a new token
    const { token: tokenAddr } = await result.current.createSync.mutateAsync({
      currency: 'USD',
      name: 'Role Admin Hook Token Sync',
      symbol: 'ROLEADMINHOOKSYNC',
    })

    const data = await result.current.setRoleAdmin.mutateAsync({
      token: tokenAddr,
      role: 'issuer',
      adminRole: 'pause',
    })
    expect(data).toBeDefined()
    expect(data.receipt).toBeDefined()

    await vi.waitFor(() =>
      expect(result.current.setRoleAdmin.isSuccess).toBeTruthy(),
    )
  })
})

describe('useSetSupplyCap', () => {
  test('default', async () => {
    const { result } = await renderHook(() => ({
      connect: useConnect(),
      createSync: hooks.useCreateSync(),
      setSupplyCap: hooks.useSetSupplyCap(),
    }))

    await result.current.connect.connectAsync({
      connector: config.connectors[0]!,
    })

    // Create a new token
    const { token: tokenAddr } = await result.current.createSync.mutateAsync({
      currency: 'USD',
      name: 'Supply Cap Hook Token',
      symbol: 'SUPPLYCAPHOOK',
    })

    const hash = await result.current.setSupplyCap.mutateAsync({
      token: tokenAddr,
      supplyCap: parseEther('1000000'),
    })
    expect(hash).toBeDefined()

    await vi.waitFor(() =>
      expect(result.current.setSupplyCap.isSuccess).toBeTruthy(),
    )
  })
})

describe('useSetSupplyCapSync', () => {
  test('default', async () => {
    const { result } = await renderHook(() => ({
      connect: useConnect(),
      createSync: hooks.useCreateSync(),
      setSupplyCap: hooks.useSetSupplyCapSync(),
    }))

    await result.current.connect.connectAsync({
      connector: config.connectors[0]!,
    })

    // Create a new token
    const { token: tokenAddr } = await result.current.createSync.mutateAsync({
      currency: 'USD',
      name: 'Supply Cap Hook Token Sync',
      symbol: 'SUPPLYCAPHOOKSYNC',
    })

    const data = await result.current.setSupplyCap.mutateAsync({
      token: tokenAddr,
      supplyCap: parseEther('1000000'),
    })
    expect(data).toBeDefined()
    expect(data.receipt).toBeDefined()

    await vi.waitFor(() =>
      expect(result.current.setSupplyCap.isSuccess).toBeTruthy(),
    )
  })
})

describe('useTransfer', () => {
  test('default', async () => {
    const { result } = await renderHook(() => ({
      connect: useConnect(),
      transfer: hooks.useTransfer(),
    }))

    await result.current.connect.connectAsync({
      connector: config.connectors[0]!,
    })

    const hash = await result.current.transfer.mutateAsync({
      to: account2.address,
      amount: parseEther('1'),
    })
    expect(hash).toBeDefined()

    await vi.waitFor(() =>
      expect(result.current.transfer.isSuccess).toBeTruthy(),
    )
  })
})

describe('useTransferSync', () => {
  test('default', async () => {
    const { result } = await renderHook(() => ({
      connect: useConnect(),
      transfer: hooks.useTransferSync(),
    }))

    await result.current.connect.connectAsync({
      connector: config.connectors[0]!,
    })

    const data = await result.current.transfer.mutateAsync({
      to: account2.address,
      amount: parseEther('1'),
    })
    expect(data).toBeDefined()
    expect(data.receipt).toBeDefined()

    await vi.waitFor(() =>
      expect(result.current.transfer.isSuccess).toBeTruthy(),
    )
  })
})

describe('useUnpause', () => {
  test('default', async () => {
    const { result } = await renderHook(() => ({
      connect: useConnect(),
      createSync: hooks.useCreateSync(),
      grantRolesSync: hooks.useGrantRolesSync(),
      pauseSync: hooks.usePauseSync(),
      unpause: hooks.useUnpause(),
    }))

    await result.current.connect.connectAsync({
      connector: config.connectors[0]!,
    })

    // Create a new token
    const { token: tokenAddr } = await result.current.createSync.mutateAsync({
      currency: 'USD',
      name: 'Unpause Hook Token',
      symbol: 'UNPAUSEHOOK',
    })

    // Grant pause and unpause roles
    await result.current.grantRolesSync.mutateAsync({
      token: tokenAddr,
      roles: ['pause', 'unpause'],
      to: account.address,
    })

    // First pause it
    await result.current.pauseSync.mutateAsync({
      token: tokenAddr,
    })

    const hash = await result.current.unpause.mutateAsync({
      token: tokenAddr,
    })
    expect(hash).toBeDefined()

    await vi.waitFor(() =>
      expect(result.current.unpause.isSuccess).toBeTruthy(),
    )
  })
})

describe('useUnpauseSync', () => {
  test('default', async () => {
    const { result } = await renderHook(() => ({
      connect: useConnect(),
      createSync: hooks.useCreateSync(),
      grantRolesSync: hooks.useGrantRolesSync(),
      pauseSync: hooks.usePauseSync(),
      unpause: hooks.useUnpauseSync(),
    }))

    await result.current.connect.connectAsync({
      connector: config.connectors[0]!,
    })

    // Create a new token
    const { token: tokenAddr } = await result.current.createSync.mutateAsync({
      currency: 'USD',
      name: 'Unpause Hook Token Sync',
      symbol: 'UNPAUSEHOOKSYNC',
    })

    // Grant pause and unpause roles
    await result.current.grantRolesSync.mutateAsync({
      token: tokenAddr,
      roles: ['pause', 'unpause'],
      to: account.address,
    })

    // First pause it
    await result.current.pauseSync.mutateAsync({
      token: tokenAddr,
    })

    const data = await result.current.unpause.mutateAsync({
      token: tokenAddr,
    })
    expect(data).toBeDefined()
    expect(data.receipt).toBeDefined()

    await vi.waitFor(() =>
      expect(result.current.unpause.isSuccess).toBeTruthy(),
    )
  })
})

describe('useUpdateQuoteToken', () => {
  test('default', async () => {
    const { result } = await renderHook(() => ({
      connect: useConnect(),
      createSync: hooks.useCreateSync(),
      updateQuoteToken: hooks.useUpdateQuoteToken(),
    }))

    await result.current.connect.connectAsync({
      connector: config.connectors[0]!,
    })

    // Create quote token
    const { token: quoteToken } = await result.current.createSync.mutateAsync({
      currency: 'USD',
      name: 'Update Quote Hook',
      symbol: 'UQHOOK',
    })

    // Create main token
    const { token: tokenAddr } = await result.current.createSync.mutateAsync({
      currency: 'USD',
      name: 'Update Main Hook',
      symbol: 'UMHOOK',
    })

    const hash = await result.current.updateQuoteToken.mutateAsync({
      token: tokenAddr,
      quoteToken,
    })
    expect(hash).toBeDefined()

    await vi.waitFor(() =>
      expect(result.current.updateQuoteToken.isSuccess).toBeTruthy(),
    )
  })
})

describe('useUpdateQuoteTokenSync', () => {
  test('default', async () => {
    const { result } = await renderHook(() => ({
      connect: useConnect(),
      createSync: hooks.useCreateSync(),
      updateQuoteToken: hooks.useUpdateQuoteTokenSync(),
    }))

    await result.current.connect.connectAsync({
      connector: config.connectors[0]!,
    })

    // Create quote token
    const { token: quoteToken } = await result.current.createSync.mutateAsync({
      currency: 'USD',
      name: 'Update Quote Hook Sync',
      symbol: 'UQHOOKSYNC',
    })

    // Create main token
    const { token: tokenAddr } = await result.current.createSync.mutateAsync({
      currency: 'USD',
      name: 'Update Main Hook Sync',
      symbol: 'UMHOOKSYNC',
    })

    const data = await result.current.updateQuoteToken.mutateAsync({
      token: tokenAddr,
      quoteToken,
    })
    expect(data).toBeDefined()
    expect(data.receipt).toBeDefined()

    await vi.waitFor(() =>
      expect(result.current.updateQuoteToken.isSuccess).toBeTruthy(),
    )
  })
})

describe('useWatchAdminRole', () => {
  test('default', async () => {
    const { result: connectResult } = await renderHook(() => ({
      connect: useConnect(),
      createSync: hooks.useCreateSync(),
      setRoleAdminSync: hooks.useSetRoleAdminSync(),
    }))

    await connectResult.current.connect.connectAsync({
      connector: config.connectors[0]!,
    })

    // Create a new token
    const { token: tokenAddr } =
      await connectResult.current.createSync.mutateAsync({
        currency: 'USD',
        name: 'Watch Admin Role Hook Token',
        symbol: 'WATCHADMINHOOK',
      })

    const events: any[] = []
    await renderHook(() =>
      hooks.useWatchAdminRole({
        token: tokenAddr,
        onRoleAdminUpdated(args) {
          events.push(args)
        },
      }),
    )

    // Trigger event by setting a role admin
    await connectResult.current.setRoleAdminSync.mutateAsync({
      token: tokenAddr,
      role: 'issuer',
      adminRole: 'pause',
    })

    await vi.waitUntil(() => events.length >= 1)

    expect(events.length).toBeGreaterThanOrEqual(1)
    expect(events[0]).toBeDefined()
  })
})

describe('useWatchApprove', () => {
  test('default', async () => {
    const { result: connectResult } = await renderHook(() => ({
      connect: useConnect(),
      approveSync: hooks.useApproveSync(),
    }))

    await connectResult.current.connect.connectAsync({
      connector: config.connectors[0]!,
    })

    const events: any[] = []
    await renderHook(() =>
      hooks.useWatchApprove({
        onApproval(args) {
          events.push(args)
        },
      }),
    )

    // Trigger approval event
    await connectResult.current.approveSync.mutateAsync({
      spender: account2.address,
      amount: parseEther('50'),
    })

    await vi.waitUntil(() => events.length >= 1)

    expect(events.length).toBeGreaterThanOrEqual(1)
    expect(events[0]?.owner).toBe(account.address)
    expect(events[0]?.spender).toBe(account2.address)
    expect(events[0]?.amount).toBe(parseEther('50'))
  })
})

describe('useWatchBurn', () => {
  test('default', async () => {
    const { result: connectResult } = await renderHook(() => ({
      connect: useConnect(),
      createSync: hooks.useCreateSync(),
      grantRolesSync: hooks.useGrantRolesSync(),
      mintSync: hooks.useMintSync(),
      burnSync: hooks.useBurnSync(),
    }))

    await connectResult.current.connect.connectAsync({
      connector: config.connectors[0]!,
    })

    // Create a new token
    const { token: tokenAddr } =
      await connectResult.current.createSync.mutateAsync({
        currency: 'USD',
        name: 'Watch Burn Hook Token',
        symbol: 'WATCHBURNHOOK',
      })

    // Grant issuer role and mint tokens
    await connectResult.current.grantRolesSync.mutateAsync({
      token: tokenAddr,
      roles: ['issuer'],
      to: account.address,
    })
    await connectResult.current.mintSync.mutateAsync({
      token: tokenAddr,
      to: account.address,
      amount: parseEther('1000'),
    })

    const events: any[] = []
    await renderHook(() =>
      hooks.useWatchBurn({
        token: tokenAddr,
        onBurn(args) {
          events.push(args)
        },
      }),
    )

    // Trigger burn event
    await connectResult.current.burnSync.mutateAsync({
      token: tokenAddr,
      amount: parseEther('10'),
    })

    await vi.waitUntil(() => events.length >= 1)

    expect(events.length).toBeGreaterThanOrEqual(1)
    expect(events[0]?.from).toBe(account.address)
    expect(events[0]?.amount).toBe(parseEther('10'))
  })
})

describe('useWatchCreate', () => {
  test('default', async () => {
    const { result: connectResult } = await renderHook(() => ({
      connect: useConnect(),
      createSync: hooks.useCreateSync(),
    }))

    await connectResult.current.connect.connectAsync({
      connector: config.connectors[0]!,
    })

    const events: any[] = []
    await renderHook(() =>
      hooks.useWatchCreate({
        onTokenCreated(args) {
          events.push(args)
        },
      }),
    )

    // Trigger token creation event
    await connectResult.current.createSync.mutateAsync({
      name: 'Watch Create Hook Token',
      symbol: 'WATCHCREATEHOOK',
      currency: 'USD',
    })

    await vi.waitUntil(() => events.length >= 1)

    expect(events.length).toBeGreaterThanOrEqual(1)
    expect(events[0]?.name).toBe('Watch Create Hook Token')
    expect(events[0]?.symbol).toBe('WATCHCREATEHOOK')
    expect(events[0]?.currency).toBe('USD')
    expect(events[0]?.admin).toBe(account.address)
  })
})

describe('useWatchMint', () => {
  test('default', async () => {
    const { result: connectResult } = await renderHook(() => ({
      connect: useConnect(),
      createSync: hooks.useCreateSync(),
      grantRolesSync: hooks.useGrantRolesSync(),
      mintSync: hooks.useMintSync(),
    }))

    await connectResult.current.connect.connectAsync({
      connector: config.connectors[0]!,
    })

    // Create a new token
    const { token: tokenAddr } =
      await connectResult.current.createSync.mutateAsync({
        currency: 'USD',
        name: 'Watch Mint Hook Token',
        symbol: 'WATCHMINTHOOK',
      })

    // Grant issuer role
    await connectResult.current.grantRolesSync.mutateAsync({
      token: tokenAddr,
      roles: ['issuer'],
      to: account.address,
    })

    const events: any[] = []
    await renderHook(() =>
      hooks.useWatchMint({
        token: tokenAddr,
        onMint(args) {
          events.push(args)
        },
      }),
    )

    // Trigger mint event
    await connectResult.current.mintSync.mutateAsync({
      token: tokenAddr,
      to: account.address,
      amount: parseEther('100'),
    })

    await vi.waitUntil(() => events.length >= 1)

    expect(events.length).toBeGreaterThanOrEqual(1)
    expect(events[0]?.to).toBe(account.address)
    expect(events[0]?.amount).toBe(parseEther('100'))
  })
})

describe('useWatchRole', () => {
  test('default', async () => {
    const { result: connectResult } = await renderHook(() => ({
      connect: useConnect(),
      createSync: hooks.useCreateSync(),
      grantRolesSync: hooks.useGrantRolesSync(),
    }))

    await connectResult.current.connect.connectAsync({
      connector: config.connectors[0]!,
    })

    // Create a new token
    const { token: tokenAddr } =
      await connectResult.current.createSync.mutateAsync({
        currency: 'USD',
        name: 'Watch Role Hook Token',
        symbol: 'WATCHROLEHOOK',
      })

    const events: any[] = []
    await renderHook(() =>
      hooks.useWatchRole({
        token: tokenAddr,
        onRoleUpdated(args) {
          events.push(args)
        },
      }),
    )

    // Trigger role update event by granting a role
    await connectResult.current.grantRolesSync.mutateAsync({
      token: tokenAddr,
      roles: ['issuer'],
      to: account2.address,
    })

    await vi.waitUntil(() => events.length >= 1)

    expect(events.length).toBeGreaterThanOrEqual(1)
    expect(events[0]?.account).toBe(account2.address)
    expect(events[0]?.hasRole).toBe(true)
    expect(events[0]?.type).toBe('granted')
  })
})

describe('useWatchTransfer', () => {
  test('default', async () => {
    const { result: connectResult } = await renderHook(() => ({
      connect: useConnect(),
      transferSync: hooks.useTransferSync(),
    }))

    await connectResult.current.connect.connectAsync({
      connector: config.connectors[0]!,
    })

    const events: any[] = []
    await renderHook(() =>
      hooks.useWatchTransfer({
        onTransfer(args) {
          events.push(args)
        },
      }),
    )

    // Trigger transfer event
    await connectResult.current.transferSync.mutateAsync({
      to: account2.address,
      amount: parseEther('5'),
    })

    await vi.waitUntil(() => events.length >= 1)

    expect(events.length).toBeGreaterThanOrEqual(1)
    expect(events[0]?.from).toBe(account.address)
    expect(events[0]?.to).toBe(account2.address)
    expect(events[0]?.amount).toBe(parseEther('5'))
  })
})

describe('useWatchUpdateQuoteToken', () => {
  test('default', async () => {
    const { result: connectResult } = await renderHook(() => ({
      connect: useConnect(),
      createSync: hooks.useCreateSync(),
      updateQuoteTokenSync: hooks.useUpdateQuoteTokenSync(),
    }))

    await connectResult.current.connect.connectAsync({
      connector: config.connectors[0]!,
    })

    // Create quote token
    const { token: quoteToken } =
      await connectResult.current.createSync.mutateAsync({
        currency: 'USD',
        name: 'Watch Quote Hook Token',
        symbol: 'WATCHQUOTEHOOK',
      })

    // Create main token
    const { token: tokenAddr } =
      await connectResult.current.createSync.mutateAsync({
        currency: 'USD',
        name: 'Watch Main Hook Token',
        symbol: 'WATCHMAINHOOK',
      })

    const events: any[] = []
    await renderHook(() =>
      hooks.useWatchUpdateQuoteToken({
        token: tokenAddr,
        onUpdateQuoteToken(args) {
          events.push(args)
        },
      }),
    )

    // Trigger update quote token event
    await connectResult.current.updateQuoteTokenSync.mutateAsync({
      token: tokenAddr,
      quoteToken,
    })

    await vi.waitUntil(() => events.length >= 1)

    expect(events.length).toBeGreaterThanOrEqual(1)
    expect(events[0]?.newQuoteToken).toBe(quoteToken)
    expect(events[0]?.updater).toBe(account.address)
    expect(events[0]?.finalized).toBe(false)
  })
})

describe.todo('useBurnBlocked')

describe.todo('useBurnBlockedSync')

describe.todo('usePermit')

describe.todo('usePermitSync')
