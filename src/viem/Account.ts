import { WebCryptoP256 } from 'ox'
import * as Address from 'ox/Address'
import type * as Hex from 'ox/Hex'
import * as P256 from 'ox/P256'
import * as PublicKey from 'ox/PublicKey'
import * as Secp256k1 from 'ox/Secp256k1'
import * as Signature from 'ox/Signature'
import * as WebAuthnP256 from 'ox/WebAuthnP256'
import * as SignatureEnvelope from '../ox/SignatureEnvelope.js'
import * as internal from './internal/account.js'

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
): fromP256.ReturnValue {
  const { rpId, origin } = options

  const publicKey = P256.getPublicKey({ privateKey })
  const address = Address.fromPublicKey(publicKey)

  return internal.toPrivateKeyAccount({
    address,
    publicKey,
    async sign({ hash }) {
      const { metadata, payload } = WebAuthnP256.getSignPayload({
        ...options,
        challenge: hash,
        rpId,
        origin,
      })
      const signature = P256.sign({
        payload,
        privateKey,
        hash: true,
      })
      return SignatureEnvelope.serialize({
        metadata,
        signature,
        publicKey,
        type: 'webAuthn',
      })
    },
    source: 'webAuthn',
  })
}

export declare namespace fromHeadlessWebAuthn {
  export type Options = Omit<
    WebAuthnP256.getSignPayload.Options,
    'challenge' | 'rpId' | 'origin'
  > & {
    rpId: string
    origin: string
  }

  export type ReturnValue = internal.toPrivateKeyAccount.ReturnValue
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
export function fromP256(privateKey: Hex.Hex): fromP256.ReturnValue {
  const publicKey = P256.getPublicKey({ privateKey })
  const address = Address.fromPublicKey(publicKey)

  return internal.toPrivateKeyAccount({
    address,
    publicKey,
    async sign({ hash }) {
      const signature = P256.sign({ payload: hash, privateKey })
      return SignatureEnvelope.serialize({
        signature,
        publicKey,
        type: 'p256',
      })
    },
    source: 'p256',
  })
}

export declare namespace fromP256 {
  export type ReturnValue = internal.toPrivateKeyAccount.ReturnValue
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
export function fromSecp256k1(privateKey: Hex.Hex): fromSecp256k1.ReturnValue {
  const publicKey = Secp256k1.getPublicKey({ privateKey })

  return internal.toPrivateKeyAccount({
    address: Address.fromPublicKey(publicKey),
    publicKey,
    async sign(parameters) {
      const { hash } = parameters
      const signature = Secp256k1.sign({ payload: hash, privateKey })
      return Signature.toHex(signature)
    },
  })
}

export declare namespace fromSecp256k1 {
  export type ReturnValue = internal.toPrivateKeyAccount.ReturnValue
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
): fromWebAuthnP256.ReturnValue {
  const { id } = credential
  const publicKey = PublicKey.fromHex(credential.publicKey)
  return internal.toPrivateKeyAccount({
    address: Address.fromPublicKey(publicKey),
    publicKey,
    async sign({ hash }) {
      const { metadata, signature } = await WebAuthnP256.sign({
        ...options,
        challenge: hash,
        credentialId: id,
      })
      return SignatureEnvelope.serialize({
        publicKey,
        metadata,
        signature,
        type: 'webAuthn',
      })
    },
    source: 'webAuthn',
  })
}

export declare namespace fromWebAuthnP256 {
  export type Credential = {
    id: WebAuthnP256.P256Credential['id']
    publicKey: Hex.Hex
  }

  export type Options = {
    getFn?: WebAuthnP256.sign.Options['getFn'] | undefined
    rpId?: WebAuthnP256.sign.Options['rpId'] | undefined
  }

  export type ReturnValue = internal.toPrivateKeyAccount.ReturnValue
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
): fromWebCryptoP256.ReturnValue {
  const { publicKey, privateKey } = keyPair
  const address = Address.fromPublicKey(publicKey)

  return internal.toPrivateKeyAccount({
    address,
    publicKey,
    async sign({ hash }) {
      const signature = await WebCryptoP256.sign({ payload: hash, privateKey })
      return SignatureEnvelope.serialize({
        signature,
        prehash: true,
        publicKey,
        type: 'p256',
      })
    },
    source: 'p256',
  })
}

export declare namespace fromWebCryptoP256 {
  export type ReturnValue = internal.toPrivateKeyAccount.ReturnValue
}
