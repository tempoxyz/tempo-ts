import { Porto } from 'porto'
import { Mode } from 'tempo.ts/porto'
import { afterAll, beforeAll, describe, expect, test } from 'vitest'
import { cdp } from 'vitest/browser'

const porto = Porto.create({
  mode: Mode.tempo(),
})

let cleanup: () => Promise<void>
beforeAll(async () => {
  cleanup = await setupWebAuthn()
})

afterAll(async () => {
  await cleanup()
})

describe.todo('eth_accounts')

describe('eth_requestAccounts', () => {
  test('default', async () => {
    await porto.provider.request({
      method: 'wallet_connect',
      params: [{ capabilities: { createAccount: true } }],
    })
    await porto.provider.request({
      method: 'wallet_disconnect',
    })

    const result = await porto.provider.request({
      method: 'eth_requestAccounts',
    })
    expect(result.length).toBe(1)
  })
})

describe.todo('eth_sendTransaction')

describe.todo('eth_signTypedData_v4')

describe.todo('personal_sign')

describe('wallet_connect', () => {
  test('default', async () => {
    const connectMessages: any[] = []
    const disconnectMessages: any[] = []

    porto.provider.on('connect', (message) => connectMessages.push(message))
    porto.provider.on('disconnect', (message) =>
      disconnectMessages.push(message),
    )

    const result = await porto.provider.request({
      method: 'wallet_connect',
      params: [{ capabilities: { createAccount: true } }],
    })

    expect(result.accounts.length).toBe(1)
    expect(result.chainIds.length).toBeGreaterThan(0)
    expect(connectMessages.length).toBe(1)

    await porto.provider.request({
      method: 'wallet_disconnect',
    })
    expect(disconnectMessages.length).toBe(1)

    await porto.provider.request({
      method: 'wallet_connect',
    })
    expect(connectMessages.length).toBe(2)
  })
})

describe.todo('wallet_disconnect')

describe.todo('wallet_getAccountVersion')

describe.todo('wallet_getAdmins')

describe.todo('wallet_getAssets')

describe.todo('wallet_getCallsStatus')

describe.todo('wallet_getCapabilities')

describe.todo('wallet_getPermissions')

describe.todo('wallet_grantAdmin')

describe.todo('wallet_grantPermissions')

describe.todo('wallet_prepareCalls → wallet_sendPreparedCalls')

describe.todo('wallet_revokeAdmin')

describe.todo('wallet_revokePermissions')

describe.todo('wallet_sendCalls')

describe.todo('wallet_switchEthereumChain')

describe.todo('behavior: fall through')

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
