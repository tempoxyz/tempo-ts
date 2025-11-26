import { expect, test, vi } from 'vitest'
import { cdp } from 'vitest/browser'
import { useAccount, useConnect } from 'wagmi'
import { renderHook } from '../../test/wagmi/config.js'
import { webAuthn } from './Connector.js'
import * as KeyManager from './KeyManager.js'

async function setupWebAuthn() {
  const client = cdp()
  await client.send('WebAuthn.enable')
  const result = await client.send('WebAuthn.addVirtualAuthenticator', {
    options: {
      protocol: 'ctap2',
      transport: 'internal',
      hasResidentKey: true,
      hasUserVerification: true,
      isUserVerified: true,
      automaticPresenceSimulation: true,
    },
  })
  return async () => {
    const client = cdp()
    await client.send('WebAuthn.removeVirtualAuthenticator', {
      authenticatorId: result.authenticatorId,
    })
    await client.send('WebAuthn.disable')
  }
}

test('connect', async (context) => {
  const cleanup = await setupWebAuthn()
  context.onTestFinished(async () => await cleanup())

  const { result } = await renderHook(() => ({
    useAccount: useAccount(),
    useConnect: useConnect(),
  }))

  expect(result.current.useAccount.address).not.toBeDefined()
  expect(result.current.useAccount.status).toEqual('disconnected')

  result.current.useConnect.connect({
    connector: webAuthn({
      keyManager: KeyManager.localStorage(),
    }),
    capabilities: { createAccount: { label: 'Test Account' } },
  })

  await vi.waitFor(() =>
    expect(result.current.useAccount.isConnected).toBeTruthy(),
  )

  expect(result.current.useAccount.address).toBeDefined()
  expect(result.current.useAccount.address).toMatch(/^0x[a-fA-F0-9]{40}$/)
  expect(result.current.useAccount.status).toEqual('connected')
})
