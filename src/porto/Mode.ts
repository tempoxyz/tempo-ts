import type * as ox_WebAuthnP256 from 'ox/WebAuthnP256'
import * as Mode from 'porto/core/Mode'
import * as Storage from 'porto/core/Storage'
import * as porto_Account from 'porto/viem/Account'
import { Account, WebAuthnP256 } from 'tempo.ts/viem'

export function tempo(parameters: tempo.Parameters = {}): Mode.Mode {
  const { remoteStorage = Storage.memory(), rpId, webAuthn } = parameters

  return Mode.from({
    name: 'tempo',
    actions: {
      addFunds() {
        throw new Error('Not implemented')
      },

      async createAccount(parameters) {
        const {
          admins: _TODO,
          internal,
          permissions: __TODO,
          signInWithEthereum: ___TODO,
        } = parameters
        const {
          config: { storage },
        } = internal

        const label =
          parameters.label ??
          `Account ${new Date().toISOString().split('T')[0]}`

        const credential = await WebAuthnP256.createCredential({
          createFn: webAuthn?.createFn,
          label,
          rpId,
        })

        remoteStorage.setItem(
          `${credential.id}.publicKey`,
          credential.publicKey,
        )
        storage.setItem('currentCredential', credential)

        const account = Account.fromWebAuthnP256(credential)

        return {
          account: porto_Account.from(account),
        }
      },

      disconnect() {
        throw new Error('Not implemented')
      },

      getAccountVersion() {
        throw new Error('Not implemented')
      },

      getAssets() {
        throw new Error('Not implemented')
      },

      getCallsStatus() {
        throw new Error('Not implemented')
      },

      getCapabilities() {
        throw new Error('Not implemented')
      },

      getKeys() {
        throw new Error('Not implemented')
      },

      grantAdmin() {
        throw new Error('Not implemented')
      },

      grantPermissions() {
        throw new Error('Not implemented')
      },

      loadAccounts() {
        throw new Error('Not implemented')
      },

      prepareCalls() {
        throw new Error('Not implemented')
      },

      prepareUpgradeAccount() {
        throw new Error('Not implemented')
      },

      revokeAdmin() {
        throw new Error('Not implemented')
      },

      revokePermissions() {
        throw new Error('Not implemented')
      },

      sendCalls() {
        throw new Error('Not implemented')
      },

      sendPreparedCalls() {
        throw new Error('Not implemented')
      },

      signPersonalMessage() {
        throw new Error('Not implemented')
      },

      signTypedData() {
        throw new Error('Not implemented')
      },

      switchChain() {
        throw new Error('Not implemented')
      },

      upgradeAccount() {
        throw new Error('Not implemented')
      },

      verifyEmail() {
        throw new Error('Not implemented')
      },
    },
  })
}

export declare namespace tempo {
  export type Parameters = {
    /**
     * Remote storage for credential metadata.
     */
    remoteStorage?: Storage.Storage | undefined
    /**
     * Relying party ID.
     * @default 'self'
     */
    rpId?: 'self' | (string & {}) | undefined
    /**
     * WebAuthn configuration.
     */
    webAuthn?:
      | {
          createFn?:
            | ox_WebAuthnP256.createCredential.Options['createFn']
            | undefined
          getFn?: ox_WebAuthnP256.sign.Options['getFn'] | undefined
        }
      | undefined
  }
}
