import type * as Address from 'ox/Address'
import type * as Errors from 'ox/Errors'
import * as Hash from 'ox/Hash'
import * as Hex from 'ox/Hex'
import * as Rlp from 'ox/Rlp'
import type { Compute } from '../internal/types.js'
import * as SignatureEnvelope from './SignatureEnvelope.js'

const defaultExpiry = 0xffffffffffff

/**
 * Key authorization for provisioning access keys.
 *
 * Used in TransactionEnvelopeAA to add a new key to the keychain precompile.
 * The transaction must be signed by the root key to authorize adding this access key.
 */
export type KeyAuthorization<
  signed extends boolean = boolean,
  bigintType = bigint,
  numberType = number,
> = {
  /** Address derived from the public key of the key type. */
  address: Address.Address
  /** Chain ID for replay protection (0 = valid on any chain). */
  chainId?: bigintType | undefined
  /** Unix timestamp when key expires (0 = never expires). */
  expiry?: numberType | undefined
  /** TIP20 spending limits for this key. */
  limits?: readonly TokenLimit<bigintType>[] | undefined
  /** Key type. (secp256k1, P256, WebAuthn). */
  type: SignatureEnvelope.Type
} & (signed extends true
  ? { signature: SignatureEnvelope.SignatureEnvelope<bigintType, numberType> }
  : {
      signature?:
        | SignatureEnvelope.SignatureEnvelope<bigintType, numberType>
        | undefined
    })

/** RPC representation of an {@link ox#KeyAuthorization.KeyAuthorization}. */
export type Rpc = Omit<
  KeyAuthorization<false, Hex.Hex, Hex.Hex>,
  'address' | 'signature' | 'type'
> & {
  keyId: Address.Address
  signature: SignatureEnvelope.SignatureEnvelopeRpc
  keyType: SignatureEnvelope.Type
}

/** Signed representation of a Key Authorization. */
export type Signed<bigintType = bigint, numberType = number> = KeyAuthorization<
  true,
  bigintType,
  numberType
>

/** Tuple representation of a Key Authorization. */
export type Tuple<signed extends boolean = boolean> = signed extends true
  ? readonly [
      chainId: Hex.Hex,
      keyType: Hex.Hex,
      expiry: Hex.Hex,
      limits: readonly [token: Address.Address, limit: Hex.Hex][],
      keyId: Address.Address,
      signature: Hex.Hex,
    ]
  : readonly [
      chainId: Hex.Hex,
      keyType: Hex.Hex,
      expiry: Hex.Hex,
      limits: readonly [token: Address.Address, limit: Hex.Hex][],
      keyId: Address.Address,
    ]

/**
 * Token spending limit for access keys.
 *
 * Defines a per-token spending limit for an access key provisioned via a key authorization.
 * This limit is enforced by the keychain precompile when the key is used.
 */
export type TokenLimit<bigintType = bigint> = {
  /** Address of the TIP-20 token. */
  token: Address.Address
  /** Maximum spending amount for this token (enforced over the key's lifetime). */
  limit: bigintType
}

/**
 * Converts a Key Authorization object into a typed {@link ox#KeyAuthorization.KeyAuthorization}.
 *
 * @example
 * A Key Authorization can be instantiated from a Key Authorization tuple in object format.
 *
 * ```ts twoslash
 * import { KeyAuthorization } from 'tempo.ts/ox'
 * import { Value } from 'ox'
 *
 * const authorization = KeyAuthorization.from({
 *   expiry: 1234567890,
 *   keyId: '0xbe95c3f554e9fc85ec51be69a3d807a0d55bcf2c',
 *   keyType: 'secp256k1',
 *   limits: [{
 *     token: '0x20c0000000000000000000000000000000000001',
 *     limit: Value.from('10', 6)
 *   }],
 * })
 * ```
 *
 * @example
 * ### Attaching Signatures
 *
 * A {@link ox#SignatureEnvelope.SignatureEnvelope} can be attached with the `signature` option. The example below demonstrates signing
 * a Key Authorization with {@link ox#Secp256k1.(sign:function)}.
 *
 * ```ts twoslash
 * import { KeyAuthorization } from 'tempo.ts/ox'
 * import { Secp256k1 } from 'ox'
 *
 * const authorization = KeyAuthorization.from({
 *   expiry: 1234567890,
 *   keyId: '0xbe95c3f554e9fc85ec51be69a3d807a0d55bcf2c',
 *   keyType: 'secp256k1',
 *   limits: [{
 *     token: '0x20c0000000000000000000000000000000000001',
 *     limit: Value.from('10', 6)
 *   }],
 * })
 *
 * const signature = Secp256k1.sign({
 *   payload: KeyAuthorization.getSignPayload(authorization),
 *   privateKey: '0x...',
 * })
 *
 * const authorization_signed = KeyAuthorization.from(authorization, { signature }) // [!code focus]
 * ```
 *
 * @param authorization - A Key Authorization tuple in object format.
 * @param options - Key Authorization options.
 * @returns The {@link ox#KeyAuthorization.KeyAuthorization}.
 */
export function from<
  const authorization extends KeyAuthorization | Rpc,
  const signature extends
    | SignatureEnvelope.SignatureEnvelope
    | undefined = undefined,
>(
  authorization: authorization | KeyAuthorization,
  options: from.Options<signature> = {},
): from.ReturnType<authorization, signature> {
  if (typeof authorization.expiry === 'string')
    return fromRpc(authorization as Rpc) as never
  if (options.signature)
    return { ...authorization, signature: options.signature } as never
  return authorization as never
}

export declare namespace from {
  type Options<
    signature extends SignatureEnvelope.SignatureEnvelope | undefined =
      | SignatureEnvelope.SignatureEnvelope
      | undefined,
  > = {
    /** The {@link ox#SignatureEnvelope.SignatureEnvelope} to attach to the Key Authorization. */
    signature?: signature | SignatureEnvelope.SignatureEnvelope | undefined
  }

  type ReturnType<
    authorization extends KeyAuthorization | Rpc = KeyAuthorization,
    signature extends SignatureEnvelope.SignatureEnvelope | undefined =
      | SignatureEnvelope.SignatureEnvelope
      | undefined,
  > = Compute<
    authorization extends Rpc
      ? Signed
      : authorization &
          (signature extends SignatureEnvelope.SignatureEnvelope
            ? { signature: SignatureEnvelope.from.ReturnValue<signature> }
            : {})
  >

  type ErrorType = Errors.GlobalErrorType
}

/**
 * Converts an {@link ox#AuthorizationAA.Rpc} to an {@link ox#AuthorizationAA.AuthorizationAA}.
 *
 * @example
 * ```ts twoslash
 * import { KeyAuthorization } from 'tempo.ts/ox'
 *
 * const keyAuthorization = KeyAuthorization.fromRpc({
 *   expiry: '0x174876e800',
 *   keyId: '0xbe95c3f554e9fc85ec51be69a3d807a0d55bcf2c',
 *   keyType: 'secp256k1',
 *   limits: [{ token: '0x20c0000000000000000000000000000000000001', limit: '0xf4240' }],
 *   signature: {
 *     type: 'secp256k1',
 *     r: '0x635dc2033e60185bb36709c29c75d64ea51dfbd91c32ef4be198e4ceb169fb4d',
 *     s: '0x50c2667ac4c771072746acfdcf1f1483336dcca8bd2df47cd83175dbe60f0540',
 *     yParity: '0x0'
 *   },
 * })
 * ```
 *
 * @param authorization - The RPC-formatted Key Authorization.
 * @returns A signed {@link ox#AuthorizationAA.AuthorizationAA}.
 */
export function fromRpc(authorization: Rpc): Signed {
  const {
    chainId = '0x0',
    keyId,
    expiry = defaultExpiry,
    limits = [],
    keyType,
  } = authorization
  const signature = SignatureEnvelope.fromRpc(authorization.signature)
  return {
    address: keyId,
    chainId: chainId === '0x' ? 0n : Hex.toBigInt(chainId),
    expiry: Number(expiry),
    limits: limits.map((limit) => ({
      token: limit.token,
      limit: BigInt(limit.limit),
    })),
    signature,
    type: keyType,
  }
}

export declare namespace fromRpc {
  type ErrorType = Errors.GlobalErrorType
}

/**
 * Converts an {@link ox#KeyAuthorization.Tuple} to an {@link ox#KeyAuthorization.KeyAuthorization}.
 *
 * @example
 * ```ts twoslash
 * import { KeyAuthorization } from 'tempo.ts/ox'
 *
 * const authorization = KeyAuthorization.fromTuple([
 *   '0x174876e800',
 *   [['0x20c0000000000000000000000000000000000001', '0xf4240']],
 *   'secp256k1',
 *   '0xbe95c3f554e9fc85ec51be69a3d807a0d55bcf2c',
 *   '0x01a068a020a209d3d56c46f38cc50a33f704f4a9a10a59377f8dd762ac66910e9b907e865ad05c4035ab5792787d4a0297a43617ae897930a6fe4d822b8faea52064'
 * ])
 * // @log: {
 * // @log:   expiry: 1234567890,
 * // @log:   keyId: '0xbe95c3f554e9fc85ec51be69a3d807a0d55bcf2c',
 * // @log:   keyType: 'secp256k1',
 * // @log:   limits: [{ token: '0x20c0000000000000000000000000000000000001', limit: '0xf4240' }],
 * // @log:   signature: {
 * // @log:     type: 'secp256k1',
 * // @log:     r: '0x68a020a209d3d56c46f38cc50a33f704f4a9a10a59377f8dd762ac66910e9b90',
 * // @log:     s: '0x7e865ad05c4035ab5792787d4a0297a43617ae897930a6fe4d822b8faea52064',
 * // @log:     yParity: 0,
 * // @log:   },
 * // @log: }
 * ```
 *
 * @example
 * It is also possible to append a serialized SignatureEnvelope to the end of a Key Authorization tuple.
 *
 * ```ts twoslash
 * import { KeyAuthorization } from 'tempo.ts/ox'
 *
 * const authorization = KeyAuthorization.fromTuple([
 *   '0x174876e800',
 *   [['0x20c0000000000000000000000000000000000001', '0xf4240']],
 *   'secp256k1',
 *   '0xbe95c3f554e9fc85ec51be69a3d807a0d55bcf2c',
 *   '0x01a068a020a209d3d56c46f38cc50a33f704f4a9a10a59377f8dd762ac66910e9b907e865ad05c4035ab5792787d4a0297a43617ae897930a6fe4d822b8faea52064',
 * ])
 * // @log: {
 * // @log:   expiry: 1234567890,
 * // @log:   keyId: '0xbe95c3f554e9fc85ec51be69a3d807a0d55bcf2c',
 * // @log:   keyType: 'secp256k1',
 * // @log:   limits: [{ token: '0x20c0000000000000000000000000000000000001', limit: '0xf4240' }],
 * // @log:   signature: {
 * // @log:     type: 'secp256k1',
 * // @log:     r: '0x68a020a209d3d56c46f38cc50a33f704f4a9a10a59377f8dd762ac66910e9b90',
 * // @log:     s: '0x7e865ad05c4035ab5792787d4a0297a43617ae897930a6fe4d822b8faea52064',
 * // @log:     yParity: 0,
 * // @log:   },
 * // @log: }
 * ```
 *
 * @param tuple - The Key Authorization tuple.
 * @returns The {@link ox#KeyAuthorization.KeyAuthorization}.
 */
export function fromTuple<const tuple extends Tuple>(
  tuple: tuple,
): fromTuple.ReturnType<tuple> {
  const [chainId, keyType_hex, expiry, limits, keyId, signatureSerialized] =
    tuple
  const keyType = (() => {
    switch (keyType_hex) {
      case '0x':
      case '0x00':
        return 'secp256k1'
      case '0x01':
        return 'p256'
      case '0x02':
        return 'webAuthn'
      default:
        throw new Error(`Invalid key type: ${keyType_hex}`)
    }
  })()
  const args: KeyAuthorization = {
    address: keyId,
    chainId: chainId === '0x' ? 0n : Hex.toBigInt(chainId),
    expiry: Hex.toNumber(expiry),
    limits: limits.map(([token, limit]) => ({
      token,
      limit: BigInt(limit),
    })),
    type: keyType,
  }
  if (signatureSerialized)
    args.signature = SignatureEnvelope.deserialize(signatureSerialized)
  return from(args) as never
}

export declare namespace fromTuple {
  type ReturnType<authorization extends Tuple = Tuple> = Compute<
    KeyAuthorization<authorization extends Tuple<true> ? true : false>
  >

  type ErrorType = Errors.GlobalErrorType
}

/**
 * Computes the sign payload for an {@link ox#KeyAuthorization.KeyAuthorization}.
 *
 * @example
 * The example below demonstrates computing the sign payload for an {@link ox#KeyAuthorization.KeyAuthorization}. This payload
 * can then be passed to signing functions like {@link ox#Secp256k1.(sign:function)}.
 *
 * ```ts twoslash
 * import { KeyAuthorization } from 'tempo.ts/ox'
 * import { Secp256k1 } from 'ox'
 *
 * const authorization = KeyAuthorization.from({
 *   expiry: 1234567890,
 *   keyId: '0xbe95c3f554e9fc85ec51be69a3d807a0d55bcf2c',
 *   keyType: 'secp256k1',
 *   limits: [{
 *     token: '0x20c0000000000000000000000000000000000001',
 *     limit: Value.from('10', 6)
 *   }],
 * })
 *
 * const payload = KeyAuthorization.getSignPayload(authorization) // [!code focus]
 *
 * const signature = Secp256k1.sign({
 *   payload,
 *   privateKey: '0x...',
 * })
 * ```
 *
 * @param authorization - The {@link ox#KeyAuthorization.KeyAuthorization}.
 * @returns The sign payload.
 */
export function getSignPayload(authorization: KeyAuthorization): Hex.Hex {
  return hash(authorization, { presign: true })
}

export declare namespace getSignPayload {
  type ErrorType = hash.ErrorType | Errors.GlobalErrorType
}

/**
 * Computes the hash for an {@link ox#KeyAuthorization.KeyAuthorization}.
 *
 * @example
 * ```ts twoslash
 * import { KeyAuthorization } from 'tempo.ts/ox'
 * import { Value } from 'ox'
 *
 * const authorization = KeyAuthorization.from({
 *   expiry: 1234567890,
 *   keyId: '0xbe95c3f554e9fc85ec51be69a3d807a0d55bcf2c',
 *   keyType: 'secp256k1',
 *   limits: [{
 *     token: '0x20c0000000000000000000000000000000000001',
 *     limit: Value.from('10', 6)
 *   }],
 * })
 *
 * const hash = KeyAuthorization.hash(authorization) // [!code focus]
 * ```
 *
 * @param authorization - The {@link ox#KeyAuthorization.KeyAuthorization}.
 * @returns The hash.
 */
export function hash(
  authorization: KeyAuthorization,
  options: hash.Options = {},
): Hex.Hex {
  const { presign } = options
  const {
    address,
    chainId = 0n,
    signature: _,
    expiry = defaultExpiry,
    limits = [],
  } = authorization

  if (!presign) throw new Error('unsupported')

  const type = (() => {
    switch (authorization.type) {
      case 'secp256k1':
        return '0x'
      case 'p256':
        return '0x01'
      case 'webAuthn':
        return '0x02'
      default:
        throw new Error(`Invalid key type: ${authorization.type}`)
    }
  })()

  const serialized = Rlp.fromHex([
    chainId === 0n ? '0x' : Hex.fromNumber(chainId),
    type,
    address,
    Hex.fromNumber(expiry),
    limits.map((limit) => [limit.token, Hex.fromNumber(limit.limit)]),
  ])
  return Hash.keccak256(serialized)
}

export declare namespace hash {
  type ErrorType =
    | toTuple.ErrorType
    | Hash.keccak256.ErrorType
    | Hex.concat.ErrorType
    | Rlp.fromHex.ErrorType
    | Errors.GlobalErrorType

  type Options = {
    /** Whether to hash this authorization for signing. @default false */
    presign?: boolean | undefined
  }
}

/**
 * Converts an {@link ox#KeyAuthorization.KeyAuthorization} to an {@link ox#KeyAuthorization.Rpc}.
 *
 * @example
 * ```ts twoslash
 * import { KeyAuthorization } from 'tempo.ts/ox'
 *
 * const authorization = KeyAuthorization.toRpc({
 *   expiry: 1234567890,
 *   keyId: '0xbe95c3f554e9fc85ec51be69a3d807a0d55bcf2c',
 *   keyType: 'secp256k1',
 *   limits: [{
 *     token: '0x20c0000000000000000000000000000000000001',
 *     limit: Value.from('10', 6)
 *   }],
 *   signature: {
 *     type: 'secp256k1',
 *     r: 44944627813007772897391531230081695102703289123332187696115181104739239197517n,
 *     s: 36528503505192438307355164441104001310566505351980369085208178712678799181120n,
 *     yParity: 0,
 *   },
 * })
 * ```
 *
 * @param authorization - A Key Authorization.
 * @returns An RPC-formatted Key Authorization.
 */
export function toRpc(authorization: Signed): Rpc {
  const {
    address,
    chainId = 0n,
    expiry = defaultExpiry,
    limits = [],
    type,
    signature,
  } = authorization

  return {
    chainId: chainId === 0n ? '0x' : Hex.fromNumber(chainId),
    expiry: Hex.fromNumber(expiry),
    limits: limits.map(({ token, limit }) => ({
      token,
      limit: Hex.fromNumber(limit),
    })),
    keyId: address,
    signature: SignatureEnvelope.toRpc(signature),
    keyType: type,
  }
}

export declare namespace toRpc {
  type ErrorType = Errors.GlobalErrorType
}

/**
 * Converts an {@link ox#KeyAuthorization.KeyAuthorization} to an {@link ox#KeyAuthorization.Tuple}.
 *
 * @example
 * ```ts twoslash
 * import { KeyAuthorization } from 'tempo.ts/ox'
 * import { Value } from 'ox'
 *
 * const authorization = KeyAuthorization.from({
 *   expiry: 1234567890,
 *   keyId: '0xbe95c3f554e9fc85ec51be69a3d807a0d55bcf2c',
 *   keyType: 'secp256k1',
 *   limits: [{
 *     token: '0x20c0000000000000000000000000000000000001',
 *     limit: Value.from('10', 6)
 *   }],
 * })
 *
 * const tuple = KeyAuthorization.toTuple(authorization) // [!code focus]
 * // @log: [
 * // @log:   '0x174876e800',
 * // @log:   [['0x20c0000000000000000000000000000000000001', '0xf4240']],
 * // @log:   '0xbe95c3f554e9fc85ec51be69a3d807a0d55bcf2c',
 * // @log:   'secp256k1',
 * // @log: ]
 * ```
 *
 * @param authorization - The {@link ox#AuthorizationAA.AuthorizationAA}.
 * @returns An [EIP-7702](https://eips.ethereum.org/EIPS/eip-7702) AA Authorization tuple.
 */
export function toTuple<const authorization extends KeyAuthorization>(
  authorization: authorization,
): toTuple.ReturnType<authorization> {
  const {
    address,
    chainId = 0n,
    expiry = defaultExpiry,
    limits = [],
  } = authorization
  const signature = authorization.signature
    ? SignatureEnvelope.serialize(authorization.signature)
    : undefined
  const type = (() => {
    switch (authorization.type) {
      case 'secp256k1':
        return '0x'
      case 'p256':
        return '0x01'
      case 'webAuthn':
        return '0x02'
      default:
        throw new Error(`Invalid key type: ${authorization.type}`)
    }
  })()
  return [
    chainId === 0n ? '0x' : Hex.fromNumber(chainId),
    type,
    Hex.fromNumber(expiry),
    limits.map((limit) => [limit.token, Hex.fromNumber(limit.limit)]),
    address,
    ...(signature ? [signature] : []),
  ] as never
}

export declare namespace toTuple {
  type ReturnType<authorization extends KeyAuthorization = KeyAuthorization> =
    Compute<Tuple<authorization extends KeyAuthorization<true> ? true : false>>

  type ErrorType = Errors.GlobalErrorType
}
