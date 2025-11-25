import type * as Hex from 'ox/Hex'
import * as Json from 'ox/Json'
import type * as WebAuthnP256 from 'ox/WebAuthnP256'
import type { ExactPartial, UnionOmit } from '../internal/types.js'
import * as Storage from '../viem/Storage.js'

export type Challenge = ExactPartial<
  UnionOmit<WebAuthnP256.createCredential.Options, 'createFn'>
>

export type KeyManager = {
  /** Function to fetch create options for WebAuthn. */
  getChallenge?: (() => Promise<Challenge>) | undefined
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
 * Instead, we recommend to set up a remote store such as [`KeyManager.http`](#http) to register
 * public keys against their WebAuthn credential.
 *
 * @see {@link http}
 *
 * @deprecated
 */
export function localStorage(options: Storage.localStorage.Options = {}) {
  return fromStorage(Storage.localStorage(options))
}

/**
 * Instantiates a key manager that uses HTTP endpoints for credential management.
 *
 * @example
 * ```tsx
 * import { KeyManager } from 'tempo.ts/wagmi'
 *
 * const keyManager = KeyManager.http('https://api.example.com')
 * ```
 *
 * @param options - Configuration options for HTTP endpoints.
 * @returns A KeyManager instance that uses HTTP for credential operations.
 */
export function http(options: http.Options = {}): KeyManager {
  const {
    baseUrl = '',
    endpoints = {},
    fetch: fetchFn = globalThis.fetch,
  } = options
  const {
    getChallenge = `${baseUrl}/webauthn/challenge`,
    getPublicKey = `${baseUrl}/webauthn/:credentialId`,
    setPublicKey = `${baseUrl}/webauthn/:credentialId`,
  } = endpoints

  return from({
    async getChallenge() {
      const request =
        getChallenge instanceof Request
          ? getChallenge
          : new Request(getChallenge)

      const response = await fetchFn(request)

      if (!response.ok)
        throw new Error(`Failed to get create options: ${response.statusText}`)
      return await response.json()
    },

    async getPublicKey(parameters) {
      const request =
        getPublicKey instanceof Request
          ? getPublicKey
          : new Request(getPublicKey)

      const response = await fetchFn(
        new Request(
          request.url.replace(':credentialId', parameters.credential.id),
          request,
        ),
      )

      if (!response.ok)
        throw new Error(`Failed to get public key: ${response.statusText}`)
      const data = await response.json()
      return data.publicKey as Hex.Hex
    },

    async setPublicKey(parameters) {
      const request =
        setPublicKey instanceof Request
          ? setPublicKey
          : new Request(setPublicKey)

      const response = await fetchFn(
        new Request(
          request.url.replace(':credentialId', parameters.credential.id),
          request,
        ),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: Json.stringify(parameters),
        },
      )

      if (!response.ok)
        throw new Error(`Failed to set public key: ${response.statusText}`)
    },
  })
}

export namespace http {
  export type Options = {
    /** Base URL for the HTTP endpoints. */
    baseUrl?: string | undefined
    /** Endpoints for the HTTP endpoints. */
    endpoints?:
      | {
          getChallenge?: string | Request | undefined
          getPublicKey?: string | Request | undefined
          setPublicKey?: string | Request | undefined
        }
      | undefined
    /** Custom fetch function. @default `globalThis.fetch`. */
    fetch?: typeof fetch | undefined
  }
}
