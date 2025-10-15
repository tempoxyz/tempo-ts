import * as Errors from 'ox/Errors'
import * as Hex from 'ox/Hex'
import * as Json from 'ox/Json'
import * as Signature from 'ox/Signature'
import type { Assign, Compute, OneOf, PartialBy } from '../internal/types.js'

/**
 * Statically determines the signature type of an envelope at compile time.
 *
 * @example
 * ```ts twoslash
 * import type { SignatureEnvelope } from 'tempo.ts/ox'
 *
 * type Type = SignatureEnvelope.GetType<{ r: bigint; s: bigint; yParity: number }>
 * // @log: 'secp256k1'
 * ```
 */
export type GetType<
  envelope extends PartialBy<SignatureEnvelope, 'type'> | unknown,
> = unknown extends envelope
  ? envelope extends unknown
    ? Type
    : never
  : envelope extends { type: infer T extends Type }
    ? T
    : envelope extends { r: bigint; s: bigint; yParity: number }
      ? 'secp256k1'
      : never

/**
 * Represents a signature envelope that can contain different signature types.
 *
 * Currently supports secp256k1 signatures with plans for p256 and webauthn.
 */
export type SignatureEnvelope<bigintType = bigint, numberType = number> = OneOf<
  Signature.Signature<true, bigintType, numberType> & {
    type?: 'secp256k1' | undefined
  }
  // TODO: p256
  // TODO: webauthn
>

/** Hex-encoded serialized signature envelope. */
export type Serialized = Hex.Hex

/** List of supported signature types. */
export const types = ['secp256k1'] as const

/** Union type of supported signature types. */
export type Type = (typeof types)[number]

/**
 * Asserts that a {@link SignatureEnvelope} is valid.
 *
 * @example
 * ```ts twoslash
 * import { SignatureEnvelope } from 'tempo.ts/ox'
 *
 * SignatureEnvelope.assert({
 *   r: 0n,
 *   s: 0n,
 *   yParity: 0,
 *   type: 'secp256k1',
 * })
 * ```
 *
 * @param envelope - The signature envelope to assert.
 * @throws {CoercionError} If the envelope type cannot be determined.
 */
export function assert(envelope: PartialBy<SignatureEnvelope, 'type'>): void {
  const type = getType(envelope)
  if (type === 'secp256k1') Signature.assert(envelope)
}

export declare namespace assert {
  type ErrorType =
    | CoercionError
    | Signature.assert.ErrorType
    | Errors.GlobalErrorType
}

/**
 * Deserializes a hex-encoded signature envelope into a typed signature object.
 *
 * @param serialized - The hex-encoded signature envelope to deserialize.
 * @returns The deserialized signature envelope.
 * @throws {CoercionError} If the serialized value cannot be coerced to a valid signature envelope.
 */
export function deserialize(serialized: Serialized): SignatureEnvelope {
  if (Hex.size(serialized) === 65) {
    const signature = Signature.fromHex(serialized)
    Signature.assert(signature)
    return { ...signature, type: 'secp256k1' }
  }

  throw new CoercionError({ envelope: serialized })
}

/**
 * Coerces a value to a signature envelope.
 *
 * Accepts either a serialized hex string or an existing signature envelope object.
 *
 * @param value - The value to coerce (either a hex string or signature envelope).
 * @returns The signature envelope.
 */
export function from<const value extends from.Value>(
  value: value | from.Value,
): from.ReturnValue<value> {
  if (typeof value === 'string') return deserialize(value) as never

  const type = getType(value)
  return { ...value, type } as never
}

export declare namespace from {
  type Value = SignatureEnvelope | Serialized

  type ReturnValue<
    value extends SignatureEnvelope | Serialized =
      | SignatureEnvelope
      | Serialized,
  > = Compute<
    value extends Serialized
      ? SignatureEnvelope
      : Assign<value, { type: GetType<value> }>
  >
}

/**
 * Determines the signature type of an envelope.
 *
 * @param envelope - The signature envelope to inspect.
 * @returns The signature type ('secp256k1').
 * @throws {CoercionError} If the envelope type cannot be determined.
 */
export function getType<
  envelope extends PartialBy<SignatureEnvelope, 'type'> | unknown,
>(envelope: envelope): GetType<envelope> {
  if (typeof envelope !== 'object' || envelope === null)
    throw new CoercionError({ envelope })

  if ('type' in envelope && envelope.type) return envelope.type as never
  if (
    'r' in envelope &&
    's' in envelope &&
    'yParity' in envelope &&
    typeof envelope.r === 'bigint' &&
    typeof envelope.s === 'bigint' &&
    typeof envelope.yParity === 'number'
  )
    return 'secp256k1' as never
  throw new CoercionError({
    envelope,
  })
}

/**
 * Serializes a signature envelope to a hex-encoded string.
 *
 * @param envelope - The signature envelope to serialize.
 * @returns The hex-encoded serialized signature.
 * @throws {CoercionError} If the envelope cannot be serialized.
 */
export function serialize(envelope: SignatureEnvelope): Serialized {
  const type = getType(envelope)
  if (type === 'secp256k1') return Signature.toHex(envelope)
  throw new CoercionError({ envelope })
}

/**
 * Validates a {@link SignatureEnvelope}. Returns `true` if the envelope is valid, `false` otherwise.
 *
 * @example
 * ```ts twoslash
 * import { SignatureEnvelope } from 'tempo.ts/ox'
 *
 * const valid = SignatureEnvelope.validate({
 *   r: 0n,
 *   s: 0n,
 *   yParity: 0,
 *   type: 'secp256k1',
 * })
 * // @log: true
 * ```
 *
 * @param envelope - The signature envelope to validate.
 * @returns `true` if valid, `false` otherwise.
 */
export function validate(
  envelope: PartialBy<SignatureEnvelope, 'type'>,
): boolean {
  try {
    assert(envelope)
    return true
  } catch {
    return false
  }
}

export declare namespace validate {
  type ErrorType = Errors.GlobalErrorType
}

/**
 * Error thrown when a signature envelope cannot be coerced to a valid type.
 */
export class CoercionError extends Errors.BaseError {
  override readonly name = 'SignatureEnvelope.CoercionError'
  constructor({ envelope }: { envelope: unknown }) {
    super(
      `Unable to coerce value (\`${Json.stringify(envelope)}\`) to a valid signature envelope.`,
    )
  }
}
