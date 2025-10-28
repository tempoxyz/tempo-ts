import type * as Hex from 'ox/Hex'
import * as P256 from 'ox/P256'
import * as PublicKey from 'ox/PublicKey'
import * as Secp256k1 from 'ox/Secp256k1'
import * as WebAuthnP256 from 'ox/WebAuthnP256'
import * as WebCryptoP256 from 'ox/WebCryptoP256'
import type { Assign, PartialBy } from '../internal/types.js'
import * as SignatureEnvelope from '../ox/SignatureEnvelope.js'

export type Type = 'secp256k1' | 'p256' | 'webAuthn'

export type Key = {
  /** Expiry (in seconds) of the key. 0 = never. */
  expiry: number
  /** Public key. */
  publicKey: PublicKey.PublicKey
  /** Key role. */
  role: 'admin' | 'session'
  /** Sign function. */
  sign: (parameters: { hash: Hex.Hex }) => Promise<Hex.Hex>
  /** Type of the key. */
  type: Type
}

/**
 * Instantiates a Key.
 *
 * @param value - The value to instantiate the key from.
 * @returns The instantiated key.
 */
export function from<const key extends from.Value>(
  value: key,
): from.ReturnValue<key> {
  return {
    ...value,
    expiry: value.expiry ?? 0,
    role: value.role ?? 'admin',
  } as never
}

export namespace from {
  export type Value = PartialBy<Key, 'expiry' | 'role'>

  export type ReturnValue<key extends Value> = Assign<
    key,
    {
      expiry: key['expiry'] extends Key['expiry'] ? key['expiry'] : 0
      role: key['role'] extends Key['role'] ? key['role'] : 'admin'
    }
  >
}

/**
 * Instantiates a Key from a Secp256k1 private key.
 *
 * @param privateKey - The private key to instantiate the key from.
 * @param options - The options to instantiate the key with.
 * @returns The instantiated key.
 */
export function fromSecp256k1(
  privateKey: Hex.Hex,
  options: fromSecp256k1.Options = {},
) {
  const publicKey = Secp256k1.getPublicKey({ privateKey })
  return from({
    ...options,
    publicKey,
    sign: async ({ hash }) => {
      const signature = Secp256k1.sign({ payload: hash, privateKey })
      return SignatureEnvelope.serialize({ signature, type: 'secp256k1' })
    },
    type: 'secp256k1',
  })
}

export namespace fromSecp256k1 {
  export type Options = Pick<from.Value, 'expiry' | 'role'>
}

/**
 * Instantiates a Key from a P256 private key.
 *
 * @param privateKey - The private key to instantiate the key from.
 * @param options - The options to instantiate the key with.
 * @returns The instantiated key.
 */
export function fromP256(privateKey: Hex.Hex, options: fromP256.Options = {}) {
  const publicKey = P256.getPublicKey({ privateKey })
  return from({
    ...options,
    publicKey,
    sign: async ({ hash }) => {
      const signature = P256.sign({ payload: hash, privateKey })
      return SignatureEnvelope.serialize({ publicKey, signature, type: 'p256' })
    },
    type: 'p256',
  })
}

export namespace fromP256 {
  export type Options = Pick<from.Value, 'expiry' | 'role'>
}

/**
 * Instantiates a Key from a headless WebAuthn credential (P256 private key).
 *
 * @param privateKey - P256 private key.
 * @param options - The options to instantiate the key with.
 * @returns The instantiated key.
 */
export function fromHeadlessWebAuthn(
  privateKey: Hex.Hex,
  options: fromHeadlessWebAuthn.Options,
) {
  const { rpId, origin, ...rest } = options

  const publicKey = P256.getPublicKey({ privateKey })

  return from({
    ...rest,
    publicKey,
    sign: async ({ hash }) => {
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
        signature,
        publicKey,
        metadata,
        type: 'webAuthn',
      })
    },
    type: 'webAuthn',
  })
}

export declare namespace fromHeadlessWebAuthn {
  export type Options = Omit<
    WebAuthnP256.getSignPayload.Options,
    'challenge' | 'rpId' | 'origin'
  > & {
    rpId: string
    origin: string
  } & Pick<from.Value, 'expiry' | 'role'>
}

/**
 * Instantiates a Key from a WebAuthn credential.
 *
 * @param credential - WebAuthnP256 credential.
 * @param options - The options to instantiate the key with.
 * @returns The instantiated key.
 */
export function fromWebAuthnP256(
  credential: fromWebAuthnP256.Credential,
  options: fromWebAuthnP256.Options = {},
): fromWebAuthnP256.ReturnValue {
  const { id } = credential
  const { rpId, getFn, ...rest } = options
  const publicKey = PublicKey.fromHex(credential.publicKey)

  return from({
    ...rest,
    publicKey,
    sign: async ({ hash }) => {
      const { metadata, signature } = await WebAuthnP256.sign({
        challenge: hash,
        credentialId: id,
        rpId,
        getFn,
      })
      return SignatureEnvelope.serialize({
        publicKey,
        metadata,
        signature,
        type: 'webAuthn',
      })
    },
    type: 'webAuthn',
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
  } & Pick<from.Value, 'expiry' | 'role'>

  export type ReturnValue = from.ReturnValue<
    from.Value & {
      type: 'webAuthn'
    }
  >
}

/**
 * Instantiates a Key from a P256 private key (using WebCrypto).
 *
 * @param keyPair - WebCryptoP256 key pair.
 * @param options - The options to instantiate the key with.
 * @returns The instantiated key.
 */
export function fromWebCryptoP256(
  keyPair: Awaited<ReturnType<typeof WebCryptoP256.createKeyPair>>,
  options: fromWebCryptoP256.Options = {},
): fromWebCryptoP256.ReturnValue {
  const { publicKey, privateKey } = keyPair

  return from({
    ...options,
    publicKey,
    sign: async ({ hash }) => {
      const signature = await WebCryptoP256.sign({ payload: hash, privateKey })
      return SignatureEnvelope.serialize({
        signature,
        prehash: true,
        publicKey,
        type: 'p256',
      })
    },
    type: 'p256',
  })
}

export declare namespace fromWebCryptoP256 {
  export type Options = Pick<from.Value, 'expiry' | 'role'>

  export type ReturnValue = from.ReturnValue<
    from.Value & {
      type: 'p256'
    }
  >
}
