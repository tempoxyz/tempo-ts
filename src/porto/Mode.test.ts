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

describe.todo('eth_requestAccounts')

describe.todo('eth_sendTransaction')

describe.todo('eth_signTypedData_v4')

describe.todo('personal_sign')

describe('wallet_connect', () => {
  test('default', async () => {
    const { accounts, chainIds } = await porto.provider.request({
      method: 'wallet_connect',
      params: [
        {
          capabilities: {
            createAccount: true,
          },
        },
      ],
    })

    expect(accounts.at(0)?.address.length).toBeGreaterThan(0)
    expect(chainIds.length).toBeGreaterThan(0)
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
