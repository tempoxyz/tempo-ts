import type * as Hex from 'ox/Hex'
import type * as WebAuthnP256 from 'ox/WebAuthnP256'
import type { ExactPartial, UnionOmit } from '../internal/types.js'
import * as Storage from '../viem/Storage.js'

export type KeyManager = {
  /** Function to fetch create options for WebAuthn. */
  getCreateOptions?:
    | (() => Promise<
        ExactPartial<
          UnionOmit<WebAuthnP256.createCredential.Options, 'createFn'>
        >
      >)
    | undefined
  /** Function to fetch the public key for a credential. */
  getPublicKey: (parameters: {
    credential: WebAuthnP256.P256Credential['raw']
  }) => Promise<Hex.Hex>
  /** Function to set the public key for a credential. */
  setPublicKey: (parameters: {
    credential: WebAuthnP256.P256Credential['raw']
    publicKey: Hex.Hex
  }) => Promise<void>
}

/** Instantiates a key manager. */
export function from<manager extends KeyManager>(manager: manager): manager {
  return manager
}

/** Instantiates a key manager from a Storage instance. */
export function fromStorage(s: Storage.Storage): KeyManager {
  const storage = Storage.from(s, { key: 'webAuthn:publicKey' })
  return from({
    async getPublicKey(parameters) {
      const publicKey = await storage.getItem(parameters.credential.id)
      if (!publicKey) throw new Error('publicKey not found.')
      return publicKey as Hex.Hex
    },
    async setPublicKey(parameters) {
      await storage.setItem(parameters.credential.id, parameters.publicKey)
    },
  })
}

/**
 * Instantiates a key manager from a localStorage instance.
 *
 * WARNING: Do not use this in production.
 * This is because we are unable to extract a user's public key after the registration
 * process. If a user clears their storage, or visits the website on a different device,
 * they will not be able to access their account.
 *
 * Instead, we recommend to set up a remote store such as [`KeyManager.http`](#TODO) to register
 * public keys against their WebAuthn credential.
 *
 * @see TODO
 *
 * @deprecated
 */
export function localStorage(options: Storage.localStorage.Options = {}) {
  return fromStorage(Storage.localStorage(options))
}
