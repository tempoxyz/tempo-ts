import * as Address from 'ox/Address'
import * as Hex from 'ox/Hex'
import * as PublicKey from 'ox/PublicKey'
import type * as WebAuthnP256 from 'ox/WebAuthnP256'
import type * as WebCryptoP256 from 'ox/WebCryptoP256'
import * as internal from './internal/account.js'
import * as Key from './Key.js'

export type { Account } from './internal/account.js'

/**
 * Instantiates an Account from a headless WebAuthn credential (P256 private key).
 *
 * @example
 * ```ts
 * import { Account } from 'tempo.ts/viem'
 *
 * const account = Account.fromHeadlessWebAuthn('0x...')
 * ```
 *
 * @param privateKey P256 private key.
 * @returns Account.
 */
export function fromHeadlessWebAuthn(
  privateKey: Hex.Hex,
  options: fromHeadlessWebAuthn.Options,
) {
  const key = Key.fromHeadlessWebAuthn(privateKey, options)
  return fromKey(key)
}

export declare namespace fromHeadlessWebAuthn {
  export type Options = Omit<
    WebAuthnP256.getSignPayload.Options,
    'challenge' | 'rpId' | 'origin'
  > & {
    rpId: string
    origin: string
  }
}

/**
 * Instantiates an Account from a root signing Key.
 *
 * @example
 * ```ts
 * import { Account, Key } from 'tempo.ts/viem'
 *
 * const key = Key.fromSecp256k1('0x...')
 * const account = Account.fromKey(key)
 * ```
 *
 * @param key Key.
 * @returns Account.
 */
export function fromKey(key: Key.Key) {
  const address = (() => {
    if (key.type === 'secp256k1') {
      const publicKey = key.publicKey
      const isAddress =
        Hex.size(publicKey) === 20 ||
        Hex.toBigInt(Hex.slice(publicKey, 0, 12)) === 0n
      if (isAddress) return Hex.slice(publicKey, -20)
    }
    return Address.fromPublicKey(PublicKey.fromHex(key.publicKey))
  })()
  return internal.toPrivateKeyAccount({
    address,
    key,
  })
}

/**
 * Instantiates an Account from a P256 private key.
 *
 * @example
 * ```ts
 * import { Account } from 'tempo.ts/viem'
 *
 * const account = Account.fromP256('0x...')
 * ```
 *
 * @param privateKey P256 private key.
 * @returns Account.
 */
export function fromP256(privateKey: Hex.Hex) {
  const key = Key.fromP256(privateKey)
  return fromKey(key)
}

/**
 * Instantiates an Account from a Secp256k1 private key.
 *
 * @example
 * ```ts
 * import { Account } from 'tempo.ts/viem'
 *
 * const account = Account.fromSecp256k1('0x...')
 * ```
 *
 * @param privateKey Secp256k1 private key.
 * @returns Account.
 */
// TODO: this function will be redundant when Viem migrates to Ox.
export function fromSecp256k1(privateKey: Hex.Hex) {
  const key = Key.fromSecp256k1(privateKey)
  return fromKey(key)
}

/**
 * Instantiates an Account from a WebAuthn credential.
 *
 * @example
 *
 * ### Create Passkey + Instantiate Account
 *
 * Create a credential with `WebAuthnP256.createCredential` and then instantiate
 * a Viem Account with `Account.fromWebAuthnP256`.
 *
 * It is highly recommended to store the credential's public key in an external store
 * for future use (ie. for future calls to `WebAuthnP256.getCredential`).
 *
 * ```ts
 * import { Account, WebAuthnP256 } from 'tempo.ts/viem'
 * import { publicKeyStore } from './store'
 *
 * // 1. Create credential
 * const credential = await WebAuthnP256.createCredential({ name: 'Example' })
 *
 * // 2. Instantiate account
 * const account = Account.fromWebAuthnP256(credential)
 *
 * // 3. Store public key
 * await publicKeyStore.set(credential.id, credential.publicKey)
 *
 * ```
 *
 * @example
 *
 * ### Get Credential + Instantiate Account
 *
 * Gets a credential from `WebAuthnP256.getCredential` and then instantiates
 * an account with `Account.fromWebAuthnP256`.
 *
 * The `getPublicKey` function is required to fetch the public key paired with the credential
 * from an external store. The public key is required to derive the account's address.
 *
 * ```ts
 * import { Account, WebAuthnP256 } from 'tempo.ts/viem'
 * import { publicKeyStore } from './store'
 *
 * // 1. Get credential
 * const credential = await WebAuthnP256.getCredential({
 *   async getPublicKey(credential) {
 *     // 2. Get public key from external store.
 *     return await publicKeyStore.get(credential.id)
 *   }
 * })
 *
 * // 3. Instantiate account
 * const account = Account.fromWebAuthnP256(credential)
 * ```
 *
 * @param credential WebAuthnP256 credential.
 * @returns Account.
 */
export function fromWebAuthnP256(
  credential: fromWebAuthnP256.Credential,
  options: fromWebAuthnP256.Options = {},
) {
  const key = Key.fromWebAuthnP256(credential, options)
  return fromKey(key)
}

export declare namespace fromWebAuthnP256 {
  export type Credential = Key.fromWebAuthnP256.Credential

  export type Options = Key.fromWebAuthnP256.Options
}

/**
 * Instantiates an Account from a P256 private key.
 *
 * @example
 * ```ts
 * import { Account } from 'tempo.ts/viem'
 * import { WebCryptoP256 } from 'ox'
 *
 * const keyPair = await WebCryptoP256.createKeyPair()
 *
 * const account = Account.fromWebCryptoP256(keyPair)
 * ```
 *
 * @param keyPair WebCryptoP256 key pair.
 * @returns Account.
 */
export function fromWebCryptoP256(
  keyPair: Awaited<ReturnType<typeof WebCryptoP256.createKeyPair>>,
) {
  const key = Key.fromWebCryptoP256(keyPair)
  return fromKey(key)
}
