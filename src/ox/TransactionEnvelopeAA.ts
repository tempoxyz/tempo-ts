import * as AccessList from 'ox/AccessList'
import * as Address from 'ox/Address'
import * as Errors from 'ox/Errors'
import * as Hash from 'ox/Hash'
import * as Hex from 'ox/Hex'
import * as Rlp from 'ox/Rlp'
import * as Signature from 'ox/Signature'
import * as TransactionEnvelope from 'ox/TransactionEnvelope'
import type { OneOf } from 'viem'
import type {
  Assign,
  Compute,
  PartialBy,
  UnionPartialBy,
} from '../internal/types.js'
import * as SignatureEnvelope from './SignatureEnvelope.js'
import * as TokenId from './TokenId.js'

/**
 * Represents a single call within an AA transaction.
 */
export type Call<bigintType = bigint> = {
  /** The target address or contract creation. */
  to?: Address.Address | undefined
  /** Value to send (in wei). */
  value?: bigintType | undefined
  /** Call data. */
  data?: Hex.Hex | undefined
}

export type TransactionEnvelopeAA<
  signed extends boolean = boolean,
  bigintType = bigint,
  numberType = number,
  type extends string = Type,
> = Compute<
  {
    /** EIP-155 Chain ID. */
    chainId: numberType
    /** Sender of the transaction. */
    from?: Address.Address | undefined
    /** Gas provided for transaction execution */
    gas?: bigintType | undefined
    /** Unique number identifying this transaction */
    nonce?: bigintType | undefined
    /** Transaction type */
    type: type
    /** EIP-2930 Access List. */
    accessList?: AccessList.AccessList | undefined
    /** Array of calls to execute. */
    calls: Call<bigintType>[]
    /** Fee payer signature. */
    feePayerSignature?:
      | Signature.Signature<true, bigintType, numberType>
      | null
      | undefined
    /** Fee token preference. Address or ID of the TIP-20 token. */
    feeToken?: TokenId.TokenIdOrAddress | undefined
    /** Total fee per gas in wei (gasPrice/baseFeePerGas + maxPriorityFeePerGas). */
    maxFeePerGas?: bigintType | undefined
    /** Max priority fee per gas (in wei). */
    maxPriorityFeePerGas?: bigintType | undefined
    /** Nonce key for 2D nonce system (192 bits). */
    nonceKey?: bigintType | undefined
    /** Transaction can only be included in a block before this timestamp. */
    validBefore?: bigintType | undefined
    /** Transaction can only be included in a block after this timestamp. */
    validAfter?: bigintType | undefined
  } & (signed extends true
    ? {
        signature: SignatureEnvelope.SignatureEnvelope<bigintType, numberType>
      }
    : {
        signature?:
          | SignatureEnvelope.SignatureEnvelope<bigintType, numberType>
          | undefined
      })
>

export type Rpc<signed extends boolean = boolean> = TransactionEnvelopeAA<
  signed,
  Hex.Hex,
  Hex.Hex,
  '0x76'
>

export const feePayerMagic = '0x78' as const
export type FeePayerMagic = typeof feePayerMagic

export type Serialized = `${SerializedType}${string}`

export type Signed = TransactionEnvelopeAA<true>

export const serializedType = '0x76' as const
export type SerializedType = typeof serializedType

export const type = 'aa' as const
export type Type = typeof type

/**
 * Asserts a {@link ox#TransactionEnvelopeAA.TransactionEnvelopeAA} is valid.
 *
 * @example
 * ```ts twoslash
 * import { TransactionEnvelopeAA } from 'ox/tempo'
 *
 * TransactionEnvelopeAA.assert({
 *   calls: [{ to: '0x0000000000000000000000000000000000000000', value: 0n }],
 *   chainId: 1,
 *   maxFeePerGas: 1000000000n,
 * })
 * ```
 *
 * @param envelope - The transaction envelope to assert.
 */
export function assert(envelope: PartialBy<TransactionEnvelopeAA, 'type'>) {
  const {
    calls,
    chainId,
    maxFeePerGas,
    maxPriorityFeePerGas,
    validBefore,
    validAfter,
  } = envelope

  // Calls must not be empty
  if (!calls || calls.length === 0) throw new CallsEmptyError()

  // validBefore must be greater than validAfter if both are set
  if (
    validBefore !== undefined &&
    validAfter !== undefined &&
    validBefore <= validAfter
  ) {
    throw new InvalidValidityWindowError({
      validBefore: validBefore,
      validAfter: validAfter,
    })
  }

  // Validate each call
  if (calls)
    for (const call of calls)
      if (call.to) Address.assert(call.to, { strict: false })

  // Validate chain ID
  if (chainId <= 0)
    throw new TransactionEnvelope.InvalidChainIdError({ chainId })

  // Validate max fee per gas
  if (maxFeePerGas && BigInt(maxFeePerGas) > 2n ** 256n - 1n)
    throw new TransactionEnvelope.FeeCapTooHighError({
      feeCap: maxFeePerGas,
    })

  if (
    maxPriorityFeePerGas &&
    maxFeePerGas &&
    maxPriorityFeePerGas > maxFeePerGas
  )
    throw new TransactionEnvelope.TipAboveFeeCapError({
      maxFeePerGas,
      maxPriorityFeePerGas,
    })
}

export declare namespace assert {
  type ErrorType =
    | Address.assert.ErrorType
    | CallsEmptyError
    | InvalidValidityWindowError
    | Errors.GlobalErrorType
}

/**
 * Deserializes a {@link ox#TransactionEnvelopeAA.TransactionEnvelopeAA} from its serialized form.
 *
 * @example
 * ```ts twoslash
 * import { TransactionEnvelopeAA } from 'ox/tempo'
 *
 * const envelope = TransactionEnvelopeAA.deserialize('0x76f84a0182031184773594008477359400809470997970c51812dc3a010c7d01b50e0d17dc79c8880de0b6b3a764000080c0808080')
 * // @log: {
 * // @log:   type: 'aa',
 * // @log:   nonce: 785n,
 * // @log:   maxFeePerGas: 2000000000n,
 * // @log:   gas: 1000000n,
 * // @log:   calls: [{ to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8', value: 1000000000000000000n }],
 * // @log: }
 * ```
 *
 * @param serialized - The serialized transaction.
 * @returns Deserialized Transaction Envelope.
 */
export function deserialize(
  serialized: Serialized,
): Compute<TransactionEnvelopeAA> {
  const transactionArray = Rlp.toHex(Hex.slice(serialized, 1))

  const [
    chainId,
    maxPriorityFeePerGas,
    maxFeePerGas,
    gas,
    calls,
    accessList,
    nonceKey,
    nonce,
    validBefore,
    validAfter,
    feeToken,
    feePayerSignatureOrSender,
    signature,
  ] = transactionArray as readonly Hex.Hex[]

  if (!(transactionArray.length === 12 || transactionArray.length === 13))
    throw new TransactionEnvelope.InvalidSerializedError({
      attributes: {
        chainId,
        maxPriorityFeePerGas,
        maxFeePerGas,
        gas,
        calls,
        accessList,
        nonceKey,
        nonce,
        validBefore,
        validAfter,
        feeToken,
        feePayerSignatureOrSender,
        ...(transactionArray.length > 12
          ? {
              signature,
            }
          : {}),
      },
      serialized,
      type,
    })

  let transaction = {
    chainId: Number(chainId),
    type,
  } as TransactionEnvelopeAA

  if (Hex.validate(gas) && gas !== '0x') transaction.gas = BigInt(gas)
  if (Hex.validate(nonce))
    transaction.nonce = nonce === '0x' ? 0n : BigInt(nonce)
  if (Hex.validate(maxFeePerGas) && maxFeePerGas !== '0x')
    transaction.maxFeePerGas = BigInt(maxFeePerGas)
  if (Hex.validate(maxPriorityFeePerGas) && maxPriorityFeePerGas !== '0x')
    transaction.maxPriorityFeePerGas = BigInt(maxPriorityFeePerGas)
  if (Hex.validate(nonceKey))
    transaction.nonceKey = nonceKey === '0x' ? 0n : BigInt(nonceKey)
  if (Hex.validate(validBefore) && validBefore !== '0x')
    transaction.validBefore = BigInt(validBefore)
  if (Hex.validate(validAfter) && validAfter !== '0x')
    transaction.validAfter = BigInt(validAfter)
  if (Hex.validate(feeToken) && feeToken !== '0x')
    transaction.feeToken = feeToken

  // Parse calls array
  if (calls && calls !== '0x') {
    const callsArray = calls as unknown as readonly Hex.Hex[][]
    transaction.calls = callsArray.map((callTuple) => {
      const [to, value, data] = callTuple
      const call: Call = {}
      if (to && to !== '0x') call.to = to
      if (value && value !== '0x') call.value = BigInt(value)
      if (data && data !== '0x') call.data = data
      return call
    })
  }

  if (accessList?.length !== 0 && accessList !== '0x')
    transaction.accessList = AccessList.fromTupleList(accessList as never)

  if (
    feePayerSignatureOrSender !== '0x' &&
    feePayerSignatureOrSender !== undefined
  ) {
    if (
      feePayerSignatureOrSender === '0x00' ||
      Address.validate(feePayerSignatureOrSender)
    )
      transaction.feePayerSignature = null
    else
      transaction.feePayerSignature = Signature.fromTuple(
        feePayerSignatureOrSender as never,
      )
  }

  // TODO: support more signature types
  const signatureEnvelope = signature
    ? SignatureEnvelope.deserialize(signature)
    : undefined
  if (signatureEnvelope)
    transaction = {
      ...transaction,
      signature: signatureEnvelope,
    }

  assert(transaction)

  return transaction
}

export declare namespace deserialize {
  type ErrorType = Errors.GlobalErrorType
}

/**
 * Converts an arbitrary transaction object into an AA Transaction Envelope.
 *
 * @example
 * ```ts twoslash
 * import { Value } from 'ox'
 * import { TransactionEnvelopeAA } from 'ox/tempo'
 *
 * const envelope = TransactionEnvelopeAA.from({ // [!code focus]
 *   chainId: 1, // [!code focus]
 *   calls: [{ to: '0x0000000000000000000000000000000000000000', value: Value.fromEther('1') }], // [!code focus]
 *   maxFeePerGas: Value.fromGwei('10'), // [!code focus]
 *   maxPriorityFeePerGas: Value.fromGwei('1'), // [!code focus]
 * }) // [!code focus]
 * ```
 *
 * @example
 * ### Attaching Signatures
 *
 * It is possible to attach a `signature` to the transaction envelope.
 *
 * ```ts twoslash
 * // @noErrors
 * import { Secp256k1, Value } from 'ox'
 * import { TransactionEnvelopeAA } from 'ox/tempo'
 *
 * const envelope = TransactionEnvelopeAA.from({
 *   chainId: 1,
 *   calls: [{ to: '0x0000000000000000000000000000000000000000', value: Value.fromEther('1') }],
 *   maxFeePerGas: Value.fromGwei('10'),
 *   maxPriorityFeePerGas: Value.fromGwei('1'),
 * })
 *
 * const signature = Secp256k1.sign({
 *   payload: TransactionEnvelopeAA.getSignPayload(envelope),
 *   privateKey: '0x...',
 * })
 *
 * const envelope_signed = TransactionEnvelopeAA.from(envelope, { // [!code focus]
 *   signature, // [!code focus]
 * }) // [!code focus]
 * // @log: {
 * // @log:   chainId: 1,
 * // @log:   calls: [{ to: '0x0000000000000000000000000000000000000000', value: 1000000000000000000n }],
 * // @log:   maxFeePerGas: 10000000000n,
 * // @log:   maxPriorityFeePerGas: 1000000000n,
 * // @log:   type: 'aa',
 * // @log:   r: 125...n,
 * // @log:   s: 642...n,
 * // @log:   yParity: 0,
 * // @log: }
 * ```
 *
 * @example
 * ### From Serialized
 *
 * It is possible to instantiate an AA Transaction Envelope from a {@link ox#TransactionEnvelopeAA.Serialized} value.
 *
 * ```ts twoslash
 * import { TransactionEnvelopeAA } from 'ox/tempo'
 *
 * const envelope = TransactionEnvelopeAA.from('0x76f84a0182031184773594008477359400809470997970c51812dc3a010c7d01b50e0d17dc79c8880de0b6b3a764000080c0808080')
 * // @log: {
 * // @log:   chainId: 1,
 * // @log:   calls: [{ to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8', value: 1000000000000000000n }],
 * // @log:   maxFeePerGas: 10000000000n,
 * // @log:   type: 'aa',
 * // @log: }
 * ```
 *
 * @param envelope - The transaction object to convert.
 * @param options - Options.
 * @returns An AA Transaction Envelope.
 */
export function from<
  const envelope extends
    | UnionPartialBy<TransactionEnvelopeAA, 'type'>
    | Serialized,
  const signature extends
    | SignatureEnvelope.SignatureEnvelope
    | undefined = undefined,
>(
  envelope:
    | envelope
    | UnionPartialBy<TransactionEnvelopeAA, 'type'>
    | Serialized,
  options: from.Options<signature> = {},
): from.ReturnValue<envelope, signature> {
  const { feePayerSignature, signature } = options

  const envelope_ = (
    typeof envelope === 'string' ? deserialize(envelope) : envelope
  ) as TransactionEnvelopeAA

  assert(envelope_)

  return {
    ...envelope_,
    ...(signature ? { signature: SignatureEnvelope.from(signature) } : {}),
    ...(feePayerSignature
      ? { feePayerSignature: Signature.from(feePayerSignature) }
      : {}),
    type: 'aa',
  } as never
}

export declare namespace from {
  type Options<
    signature extends
      | SignatureEnvelope.SignatureEnvelope
      | undefined = undefined,
  > = {
    feePayerSignature?: Signature.Signature | null | undefined
    signature?: signature | SignatureEnvelope.SignatureEnvelope | undefined
  }

  type ReturnValue<
    envelope extends UnionPartialBy<TransactionEnvelopeAA, 'type'> | Hex.Hex =
      | TransactionEnvelopeAA
      | Hex.Hex,
    signature extends
      | SignatureEnvelope.SignatureEnvelope
      | undefined = undefined,
  > = Compute<
    envelope extends Hex.Hex
      ? TransactionEnvelopeAA
      : Assign<
          envelope,
          (signature extends SignatureEnvelope.SignatureEnvelope
            ? { signature: SignatureEnvelope.from.ReturnValue<signature> }
            : {}) & {
            readonly type: 'aa'
          }
        >
  >

  type ErrorType =
    | deserialize.ErrorType
    | assert.ErrorType
    | Errors.GlobalErrorType
}

/**
 * Serializes a {@link ox#TransactionEnvelopeAA.TransactionEnvelopeAA}.
 *
 * @example
 * ```ts twoslash
 * // @noErrors
 * import { Value } from 'ox'
 * import { TransactionEnvelopeAA } from 'ox/tempo'
 *
 * const envelope = TransactionEnvelopeAA.from({
 *   chainId: 1,
 *   calls: [{ to: '0x0000000000000000000000000000000000000000', value: Value.fromEther('1') }],
 *   maxFeePerGas: Value.fromGwei('10'),
 * })
 *
 * const serialized = TransactionEnvelopeAA.serialize(envelope) // [!code focus]
 * ```
 *
 * @example
 * ### Attaching Signatures
 *
 * It is possible to attach a `signature` to the serialized Transaction Envelope.
 *
 * ```ts twoslash
 * // @noErrors
 * import { Secp256k1, Value } from 'ox'
 * import { TransactionEnvelopeAA } from 'ox/tempo'
 *
 * const envelope = TransactionEnvelopeAA.from({
 *   chainId: 1,
 *   calls: [{ to: '0x0000000000000000000000000000000000000000', value: Value.fromEther('1') }],
 *   maxFeePerGas: Value.fromGwei('10'),
 * })
 *
 * const signature = Secp256k1.sign({
 *   payload: TransactionEnvelopeAA.getSignPayload(envelope),
 *   privateKey: '0x...',
 * })
 *
 * const serialized = TransactionEnvelopeAA.serialize(envelope, { // [!code focus]
 *   signature, // [!code focus]
 * }) // [!code focus]
 *
 * // ... send `serialized` transaction to JSON-RPC `eth_sendRawTransaction`
 * ```
 *
 * @param envelope - The Transaction Envelope to serialize.
 * @param options - Options.
 * @returns The serialized Transaction Envelope.
 */
export function serialize(
  envelope: PartialBy<TransactionEnvelopeAA, 'type'>,
  options: serialize.Options = {},
): Serialized {
  const {
    accessList,
    calls,
    chainId,
    feeToken,
    gas,
    nonce,
    nonceKey,
    maxFeePerGas,
    maxPriorityFeePerGas,
    validBefore,
    validAfter,
  } = envelope

  assert(envelope)

  const accessTupleList = AccessList.toTupleList(accessList)
  const signature = options.signature || envelope.signature

  // Encode calls as RLP list of [to, value, data] tuples
  const callsTupleList = calls.map((call) => [
    call.to ?? '0x',
    call.value ? Hex.fromNumber(call.value) : '0x',
    call.data ?? '0x',
  ])

  const feePayerSignatureOrSender = (() => {
    if (options.sender) return options.sender
    const feePayerSignature =
      typeof options.feePayerSignature !== 'undefined'
        ? options.feePayerSignature
        : envelope.feePayerSignature
    if (feePayerSignature === null) return '0x00'
    if (!feePayerSignature) return '0x'
    return Signature.toTuple(feePayerSignature)
  })()

  const serialized = [
    Hex.fromNumber(chainId),
    maxPriorityFeePerGas ? Hex.fromNumber(maxPriorityFeePerGas) : '0x',
    maxFeePerGas ? Hex.fromNumber(maxFeePerGas) : '0x',
    gas ? Hex.fromNumber(gas) : '0x',
    callsTupleList,
    accessTupleList,
    nonceKey ? Hex.fromNumber(nonceKey) : '0x',
    nonce ? Hex.fromNumber(nonce) : '0x',
    validBefore !== undefined ? Hex.fromNumber(validBefore) : '0x',
    validAfter !== undefined ? Hex.fromNumber(validAfter) : '0x',
    typeof feeToken === 'bigint' || typeof feeToken === 'string'
      ? TokenId.toAddress(feeToken)
      : '0x',
    feePayerSignatureOrSender,
    ...(signature
      ? [SignatureEnvelope.serialize(SignatureEnvelope.from(signature))]
      : []),
  ] as const

  return Hex.concat(
    options.format === 'feePayer' ? feePayerMagic : serializedType,
    Rlp.fromHex(serialized),
  ) as Serialized
}

export declare namespace serialize {
  type Options = {
    /**
     * Sender signature to append to the serialized envelope.
     */
    signature?: SignatureEnvelope.SignatureEnvelope | undefined
  } & OneOf<
    | {
        /**
         * Sender address to cover the fee of.
         */
        sender: Address.Address
        /**
         * Whether to serialize the transaction in the fee payer format.
         *
         * - If `'feePayer'`, then the transaction will be serialized in the fee payer format.
         * - If `undefined` (default), then the transaction will be serialized in the normal format.
         */
        format: 'feePayer'
      }
    | {
        /**
         * Fee payer signature or the sender to cover the fee of.
         *
         * - If `Signature.Signature`, then this is the fee payer signature.
         * - If `null`, then this indicates the envelope is intended to be signed by a fee payer.
         */
        feePayerSignature?: Signature.Signature | null | undefined
        format?: undefined
      }
  >

  type ErrorType =
    | assert.ErrorType
    | Hex.fromNumber.ErrorType
    | Signature.toTuple.ErrorType
    | Hex.concat.ErrorType
    | Rlp.fromHex.ErrorType
    | Errors.GlobalErrorType
}

/**
 * Returns the payload to sign for a {@link ox#TransactionEnvelopeAA.TransactionEnvelopeAA}.
 *
 * @example
 * The example below demonstrates how to compute the sign payload which can be used
 * with ECDSA signing utilities like {@link ox#Secp256k1.(sign:function)}.
 *
 * ```ts twoslash
 * // @noErrors
 * import { Secp256k1 } from 'ox'
 * import { TransactionEnvelopeAA } from 'ox/tempo'
 *
 * const envelope = TransactionEnvelopeAA.from({
 *   chainId: 1,
 *   calls: [{ to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8', value: 1000000000000000000n }],
 *   nonce: 0n,
 *   maxFeePerGas: 1000000000n,
 *   gas: 21000n,
 * })
 *
 * const payload = TransactionEnvelopeAA.getSignPayload(envelope) // [!code focus]
 * // @log: '0x...'
 *
 * const signature = Secp256k1.sign({ payload, privateKey: '0x...' })
 * ```
 *
 * @param envelope - The transaction envelope to get the sign payload for.
 * @returns The sign payload.
 */
export function getSignPayload(
  envelope: TransactionEnvelopeAA,
): getSignPayload.ReturnValue {
  return hash(envelope, { presign: true })
}

export declare namespace getSignPayload {
  type ReturnValue = Hex.Hex

  type ErrorType = hash.ErrorType | Errors.GlobalErrorType
}

/**
 * Hashes a {@link ox#TransactionEnvelopeAA.TransactionEnvelopeAA}. This is the "transaction hash".
 *
 * @example
 * ```ts twoslash
 * // @noErrors
 * import { Secp256k1 } from 'ox'
 * import { TransactionEnvelopeAA } from 'ox/tempo'
 *
 * const envelope = TransactionEnvelopeAA.from({
 *   chainId: 1,
 *   calls: [{ to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8', value: 1000000000000000000n }],
 *   nonce: 0n,
 *   maxFeePerGas: 1000000000n,
 *   gas: 21000n,
 * })
 *
 * const signature = Secp256k1.sign({
 *   payload: TransactionEnvelopeAA.getSignPayload(envelope),
 *   privateKey: '0x...'
 * })
 *
 * const envelope_signed = TransactionEnvelopeAA.from(envelope, { signature })
 *
 * const hash = TransactionEnvelopeAA.hash(envelope_signed) // [!code focus]
 * ```
 *
 * @param envelope - The AA Transaction Envelope to hash.
 * @param options - Options.
 * @returns The hash of the transaction envelope.
 */
export function hash<presign extends boolean = false>(
  envelope: TransactionEnvelopeAA<presign extends true ? false : true>,
  options: hash.Options<presign> = {},
): hash.ReturnValue {
  const serialized = serialize({
    ...envelope,
    ...(options.presign
      ? {
          signature: undefined,
        }
      : {}),
  })
  return Hash.keccak256(serialized)
}

export declare namespace hash {
  type Options<presign extends boolean = false> = {
    /**
     * Whether to hash this transaction for signing.
     *
     * @default false
     */
    presign?: presign | boolean | undefined
  }

  type ReturnValue = Hex.Hex

  type ErrorType =
    | Hash.keccak256.ErrorType
    | serialize.ErrorType
    | Errors.GlobalErrorType
}

/**
 * Returns the fee payer payload to sign for a {@link ox#TransactionEnvelopeAA.TransactionEnvelopeAA}.
 *
 * @example
 * ```ts twoslash
 * // @noErrors
 * import { Secp256k1 } from 'ox'
 * import { TransactionEnvelopeAA } from 'ox/tempo'
 *
 * const envelope = TransactionEnvelopeAA.from({
 *   chainId: 1,
 *   calls: [{ to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8', value: 1000000000000000000n }],
 *   nonce: 0n,
 *   maxFeePerGas: 1000000000n,
 *   gas: 21000n,
 * })
 *
 * const payload = TransactionEnvelopeAA.getFeePayerSignPayload(envelope, {
 *   sender: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045'
 * }) // [!code focus]
 * // @log: '0x...'
 *
 * const signature = Secp256k1.sign({ payload, privateKey: '0x...' })
 * ```
 *
 * @param envelope - The transaction envelope to get the fee payer sign payload for.
 * @param options - Options.
 * @returns The fee payer sign payload.
 */
export function getFeePayerSignPayload(
  envelope: TransactionEnvelopeAA,
  options: getFeePayerSignPayload.Options,
): getFeePayerSignPayload.ReturnValue {
  const { sender } = options
  const serialized = serialize(
    { ...envelope, signature: undefined },
    {
      sender,
      format: 'feePayer',
    },
  )
  return Hash.keccak256(serialized)
}

export declare namespace getFeePayerSignPayload {
  type Options = {
    /**
     * Sender address to cover the fee of.
     */
    sender: Address.Address
  }

  type ReturnValue = Hex.Hex

  type ErrorType = hash.ErrorType | Errors.GlobalErrorType
}

/**
 * Validates a {@link ox#TransactionEnvelopeAA.TransactionEnvelopeAA}. Returns `true` if the envelope is valid, `false` otherwise.
 *
 * @example
 * ```ts twoslash
 * import { TransactionEnvelopeAA } from 'ox/tempo'
 *
 * const valid = TransactionEnvelopeAA.validate({
 *   calls: [{ to: '0x0000000000000000000000000000000000000000', value: 0n }],
 *   chainId: 1,
 *   maxFeePerGas: 1000000000n,
 * })
 * // @log: true
 * ```
 *
 * @param envelope - The transaction envelope to validate.
 */
export function validate(envelope: PartialBy<TransactionEnvelopeAA, 'type'>) {
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
 * Thrown when a transaction's calls list is empty.
 *
 * @example
 * ```ts twoslash
 * import { TransactionEnvelopeAA } from 'ox/tempo'
 *
 * TransactionEnvelopeAA.assert({
 *   calls: [],
 *   chainId: 1,
 * })
 * // @error: TransactionEnvelopeAA.CallsEmptyError: Calls list cannot be empty.
 * ```
 */
export class CallsEmptyError extends Errors.BaseError {
  override readonly name = 'TransactionEnvelopeAA.CallsEmptyError'
  constructor() {
    super('Calls list cannot be empty.')
  }
}

/**
 * Thrown when validBefore is not greater than validAfter.
 *
 * @example
 * ```ts twoslash
 * import { TransactionEnvelopeAA } from 'ox/tempo'
 *
 * TransactionEnvelopeAA.assert({
 *   calls: [{ to: '0x0000000000000000000000000000000000000000' }],
 *   chainId: 1,
 *   validBefore: 100n,
 *   validAfter: 200n,
 * })
 * // @error: TransactionEnvelopeAA.InvalidValidityWindowError: validBefore (100) must be greater than validAfter (200).
 * ```
 */
export class InvalidValidityWindowError extends Errors.BaseError {
  override readonly name = 'TransactionEnvelopeAA.InvalidValidityWindowError'
  constructor({
    validBefore,
    validAfter,
  }: {
    validBefore: bigint
    validAfter: bigint
  }) {
    super(
      `validBefore (${validBefore}) must be greater than validAfter (${validAfter}).`,
    )
  }
}
