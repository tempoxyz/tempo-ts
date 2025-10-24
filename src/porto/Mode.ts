import type * as Hex from 'ox/Hex'
import type * as ox_WebAuthnP256 from 'ox/WebAuthnP256'
import * as Mode from 'porto/core/Mode'
import * as Storage from 'porto/core/Storage'
import * as porto_Account from 'porto/viem/Account'
import { Account, WebAuthnP256 } from 'tempo.ts/viem'

const browser = typeof window !== 'undefined' && typeof document !== 'undefined'

export const defaultOptions = {
  remoteStorage: browser ? Storage.localStorage() : Storage.memory(),
}

/**
 * Defines a Tempo mode for Porto.
 *
 * @param parameters Options.
 * @returns
 */
export function tempo(options: tempo.Options = {}): Mode.Mode {
  const {
    remoteStorage = defaultOptions.remoteStorage,
    rpId,
    webAuthn,
  } = options

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

        // TODO: SIWE
        // TODO: Session Keys

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

      async loadAccounts(parameters) {
        const { internal } = parameters
        const {
          config: { storage },
        } = internal

        // TODO: SIWE
        // TODO: Session Keys

        const credential = await (async () => {
          const stored =
            await storage.getItem<WebAuthnP256.P256Credential>(
              'currentCredential',
            )
          if (stored) return stored
          return await WebAuthnP256.getCredential({
            getFn: webAuthn?.getFn,
            async getPublicKey(credential) {
              const publicKey = (await remoteStorage.getItem(
                `${credential.id}.publicKey`,
              )) as Hex.Hex | undefined
              if (!publicKey) throw new Error('publicKey not found')
              return publicKey
            },
            rpId,
          })
        })()

        storage.setItem('currentCredential', credential)

        const account = Account.fromWebAuthnP256(credential)

        return {
          accounts: [porto_Account.from(account)],
        }
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
  export type Options = {
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
