import * as AccessList from 'ox/AccessList';
import * as Address from 'ox/Address';
import * as Authorization from 'ox/Authorization';
import * as Hash from 'ox/Hash';
import * as Hex from 'ox/Hex';
import * as Rlp from 'ox/Rlp';
import * as Signature from 'ox/Signature';
import * as TransactionEnvelope from 'ox/TransactionEnvelope';
import * as TransactionEnvelopeEip1559 from 'ox/TransactionEnvelopeEip1559';
import * as TokenId from "./TokenId.js";
export const serializedType = '0x77';
export const type = 'feeToken';
/**
 * Asserts a {@link ox#TransactionEnvelopeFeeToken.TransactionEnvelopeFeeToken} is valid.
 *
 * @example
 * ```ts twoslash
 * import { Value } from 'ox'
 * import { TransactionEnvelopeFeeToken } from 'ox/tempo'
 *
 * TransactionEnvelopeFeeToken.assert({
 *   feeToken: '0x20c0000000000000000000000000000000000000',
 *   maxFeePerGas: 2n ** 256n - 1n + 1n,
 *   chainId: 1,
 *   to: '0x0000000000000000000000000000000000000000',
 *   value: Value.fromEther('1'),
 * })
 * // @error: FeeCapTooHighError:
 * // @error: The fee cap (`masFeePerGas` = 115792089237316195423570985008687907853269984665640564039457584007913 gwei) cannot be
 * // @error: higher than the maximum allowed value (2^256-1).
 * ```
 *
 * @param envelope - The transaction envelope to assert.
 */
export function assert(envelope) {
    const { authorizationList } = envelope;
    if (authorizationList) {
        for (const authorization of authorizationList) {
            const { address, chainId } = authorization;
            if (address)
                Address.assert(address, { strict: false });
            if (Number(chainId) < 0)
                throw new TransactionEnvelope.InvalidChainIdError({ chainId });
        }
    }
    TransactionEnvelopeEip1559.assert(envelope);
}
/**
 * Deserializes a {@link ox#TransactionEnvelopeFeeToken.TransactionEnvelopeFeeToken} from its serialized form.
 *
 * @example
 * ```ts twoslash
 * import { TransactionEnvelopeFeeToken } from 'ox/tempo'
 *
 * const envelope = TransactionEnvelopeFeeToken.deserialize('0x77ef0182031184773594008477359400809470997970c51812dc3a010c7d01b50e0d17dc79c8880de0b6b3a764000080c0')
 * // @log: {
 * // @log:   type: 'feeToken',
 * // @log:   nonce: 785n,
 * // @log:   maxFeePerGas: 2000000000n,
 * // @log:   gas: 1000000n,
 * // @log:   to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
 * // @log:   value: 1000000000000000000n,
 * // @log: }
 * ```
 *
 * @param serialized - The serialized transaction.
 * @returns Deserialized Transaction Envelope.
 */
export function deserialize(serialized) {
    const transactionArray = Rlp.toHex(Hex.slice(serialized, 1));
    const [chainId, nonce, maxPriorityFeePerGas, maxFeePerGas, gas, to, value, data, accessList, authorizationList, feeToken, feePayerSignatureOrSender, yParity, r, s,] = transactionArray;
    if (!(transactionArray.length === 12 || transactionArray.length === 15))
        throw new TransactionEnvelope.InvalidSerializedError({
            attributes: {
                chainId,
                nonce,
                feeToken,
                maxPriorityFeePerGas,
                maxFeePerGas,
                gas,
                to,
                value,
                data,
                accessList,
                authorizationList,
                feePayerSignatureOrSender,
                ...(transactionArray.length > 9
                    ? {
                        yParity,
                        r,
                        s,
                    }
                    : {}),
            },
            serialized,
            type,
        });
    let transaction = {
        chainId: Number(chainId),
        type,
    };
    if (Hex.validate(to) && to !== '0x')
        transaction.to = to;
    if (Hex.validate(feeToken) && feeToken !== '0x')
        transaction.feeToken = feeToken;
    if (Hex.validate(gas) && gas !== '0x')
        transaction.gas = BigInt(gas);
    if (Hex.validate(data) && data !== '0x')
        transaction.data = data;
    if (Hex.validate(nonce))
        transaction.nonce = nonce === '0x' ? 0n : BigInt(nonce);
    if (Hex.validate(value) && value !== '0x')
        transaction.value = BigInt(value);
    if (Hex.validate(maxFeePerGas) && maxFeePerGas !== '0x')
        transaction.maxFeePerGas = BigInt(maxFeePerGas);
    if (Hex.validate(maxPriorityFeePerGas) && maxPriorityFeePerGas !== '0x')
        transaction.maxPriorityFeePerGas = BigInt(maxPriorityFeePerGas);
    if (accessList?.length !== 0 && accessList !== '0x')
        transaction.accessList = AccessList.fromTupleList(accessList);
    if (authorizationList !== '0x' && (authorizationList?.length ?? 0) > 0)
        transaction.authorizationList = Authorization.fromTupleList(authorizationList);
    if (feePayerSignatureOrSender !== '0x' &&
        feePayerSignatureOrSender !== undefined) {
        if (feePayerSignatureOrSender === '0x00' ||
            Address.validate(feePayerSignatureOrSender))
            transaction.feePayerSignature = null;
        else
            transaction.feePayerSignature = Signature.fromTuple(feePayerSignatureOrSender);
    }
    const signature = r && s && yParity ? Signature.fromTuple([yParity, r, s]) : undefined;
    if (signature)
        transaction = {
            ...transaction,
            ...signature,
        };
    assert(transaction);
    return transaction;
}
/**
 * Converts an arbitrary transaction object into an Fee Token Transaction Envelope.
 *
 * @example
 * ```ts twoslash
 * import { Value } from 'ox'
 * import { TransactionEnvelopeFeeToken } from 'ox/tempo'
 *
 * const envelope = TransactionEnvelopeFeeToken.from({ // [!code focus]
 *   chainId: 1, // [!code focus]
 *   feeToken: '0x20c0000000000000000000000000000000000000', // [!code focus]
 *   maxFeePerGas: Value.fromGwei('10'), // [!code focus]
 *   maxPriorityFeePerGas: Value.fromGwei('1'), // [!code focus]
 *   to: '0x0000000000000000000000000000000000000000', // [!code focus]
 *   value: Value.fromEther('1'), // [!code focus]
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
 * import { TransactionEnvelopeFeeToken } from 'ox/tempo'
 *
 * const envelope = TransactionEnvelopeFeeToken.from({
 *   chainId: 1,
 *   feeToken: '0x20c0000000000000000000000000000000000000',
 *   maxFeePerGas: Value.fromGwei('10'),
 *   maxPriorityFeePerGas: Value.fromGwei('1'),
 *   to: '0x0000000000000000000000000000000000000000',
 *   value: Value.fromEther('1'),
 * })
 *
 * const signature = Secp256k1.sign({
 *   payload: TransactionEnvelopeFeeToken.getSignPayload(envelope),
 *   privateKey: '0x...',
 * })
 *
 * const envelope_signed = TransactionEnvelopeFeeToken.from(envelope, { // [!code focus]
 *   signature, // [!code focus]
 * }) // [!code focus]
 * // @log: {
 * // @log:   chainId: 1,
 * // @log:   feeToken: '0x20c0000000000000000000000000000000000000',
 * // @log:   maxFeePerGas: 10000000000n,
 * // @log:   maxPriorityFeePerGas: 1000000000n,
 * // @log:   to: '0x0000000000000000000000000000000000000000',
 * // @log:   type: 'feeToken',
 * // @log:   value: 1000000000000000000n,
 * // @log:   r: 125...n,
 * // @log:   s: 642...n,
 * // @log:   yParity: 0,
 * // @log: }
 * ```
 *
 * @example
 * ### From Serialized
 *
 * It is possible to instantiate an Fee Token Transaction Envelope from a {@link ox#TransactionEnvelopeFeeToken.Serialized} value.
 *
 * ```ts twoslash
 * import { TransactionEnvelopeFeeToken } from 'ox/tempo'
 *
 * const envelope = TransactionEnvelopeFeeToken.from('0x77f858018203118502540be4008504a817c800809470997970c51812dc3a010c7d01b50e0d17dc79c8880de0b6b3a764000080c08477359400e1a001627c687261b0e7f8638af1112efa8a77e23656f6e7945275b19e9deed80261')
 * // @log: {
 * // @log:   chainId: 1,
 * // @log:   feeToken: '0x20c0000000000000000000000000000000000000',
 * // @log:   maxFeePerGas: 10000000000n,
 * // @log:   to: '0x0000000000000000000000000000000000000000',
 * // @log:   type: 'feeToken',
 * // @log:   value: 1000000000000000000n,
 * // @log: }
 * ```
 *
 * @param envelope - The transaction object to convert.
 * @param options - Options.
 * @returns An Fee Token Transaction Envelope.
 */
export function from(envelope, options = {}) {
    const { feePayerSignature, signature } = options;
    const envelope_ = (typeof envelope === 'string' ? deserialize(envelope) : envelope);
    assert(envelope_);
    return {
        ...envelope_,
        ...(signature ? Signature.from(signature) : {}),
        ...(feePayerSignature
            ? { feePayerSignature: Signature.from(feePayerSignature) }
            : {}),
        type: 'feeToken',
    };
}
/**
 * Returns the fee payer payload to sign for a {@link ox#TransactionEnvelopeFeeToken.TransactionEnvelopeFeeToken}.
 *
 * @example
 * TODO
 *
 * @param envelope - The transaction envelope to get the fee payer sign payload for.
 * @returns The fee payer sign payload.
 */
export function getFeePayerSignPayload(envelope, options) {
    const { sender } = options;
    const serialized = serialize({ ...envelope, r: undefined, s: undefined, yParity: undefined }, {
        sender,
        format: 'feePayer',
    });
    return Hash.keccak256(serialized);
}
/**
 * Returns the payload to sign for a {@link ox#TransactionEnvelopeFeeToken.TransactionEnvelopeFeeToken}.
 *
 * @example
 * The example below demonstrates how to compute the sign payload which can be used
 * with ECDSA signing utilities like {@link ox#Secp256k1.(sign:function)}.
 *
 * ```ts twoslash
 * // @noErrors
 * import { Secp256k1 } from 'ox'
 * import { TransactionEnvelopeFeeToken } from 'ox/tempo'
 *
 * const envelope = TransactionEnvelopeFeeToken.from({
 *   chainId: 1,
 *   feeToken: '0x20c0000000000000000000000000000000000000',
 *   nonce: 0n,
 *   maxFeePerGas: 1000000000n,
 *   gas: 21000n,
 *   to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
 *   value: 1000000000000000000n,
 * })
 *
 * const payload = TransactionEnvelopeFeeToken.getSignPayload(envelope) // [!code focus]
 * // @log: '0x...'
 *
 * const signature = Secp256k1.sign({ payload, privateKey: '0x...' })
 * ```
 *
 * @param envelope - The transaction envelope to get the sign payload for.
 * @returns The sign payload.
 */
export function getSignPayload(envelope) {
    return hash(envelope, { presign: true });
}
/**
 * Hashes a {@link ox#TransactionEnvelopeFeeToken.TransactionEnvelopeFeeToken}. This is the "transaction hash".
 *
 * @example
 * ```ts twoslash
 * // @noErrors
 * import { Secp256k1 } from 'ox'
 * import { TransactionEnvelopeFeeToken } from 'ox/tempo'
 *
 * const envelope = TransactionEnvelopeFeeToken.from({
 *   chainId: 1,
 *   feeToken: '0x20c0000000000000000000000000000000000000',
 *   nonce: 0n,
 *   maxFeePerGas: 1000000000n,
 *   gas: 21000n,
 *   to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
 *   value: 1000000000000000000n,
 * })
 *
 * const signature = Secp256k1.sign({
 *   payload: TransactionEnvelopeFeeToken.getSignPayload(envelope),
 *   privateKey: '0x...'
 * })
 *
 * const envelope_signed = TransactionEnvelopeFeeToken.from(envelope, { signature })
 *
 * const hash = TransactionEnvelopeFeeToken.hash(envelope_signed) // [!code focus]
 * ```
 *
 * @param envelope - The Fee Token Transaction Envelope to hash.
 * @param options - Options.
 * @returns The hash of the transaction envelope.
 */
export function hash(envelope, options = {}) {
    const serialized = serialize({
        ...envelope,
        ...(options.presign
            ? {
                r: undefined,
                s: undefined,
                yParity: undefined,
            }
            : {}),
    });
    return Hash.keccak256(serialized);
}
/**
 * Serializes a {@link ox#TransactionEnvelopeFeeToken.TransactionEnvelopeFeeToken}.
 *
 * @example
 * ```ts twoslash
 * // @noErrors
 * import { Value } from 'ox'
 * import { TransactionEnvelopeFeeToken } from 'ox/tempo'
 *
 * const envelope = TransactionEnvelopeFeeToken.from({
 *   chainId: 1,
 *   feeToken: '0x20c0000000000000000000000000000000000000',
 *   maxFeePerGas: Value.fromGwei('10'),
 *   to: '0x0000000000000000000000000000000000000000',
 *   value: Value.fromEther('1'),
 * })
 *
 * const serialized = TransactionEnvelopeFeeToken.serialize(envelope) // [!code focus]
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
 * import { TransactionEnvelopeFeeToken } from 'ox/tempo'
 *
 * const envelope = TransactionEnvelopeFeeToken.from({
 *   chainId: 1,
 *   feeToken: '0x20c0000000000000000000000000000000000000',
 *   maxFeePerGas: Value.fromGwei('10'),
 *   to: '0x0000000000000000000000000000000000000000',
 *   value: Value.fromEther('1'),
 * })
 *
 * const signature = Secp256k1.sign({
 *   payload: TransactionEnvelopeFeeToken.getSignPayload(envelope),
 *   privateKey: '0x...',
 * })
 *
 * const serialized = TransactionEnvelopeFeeToken.serialize(envelope, { // [!code focus]
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
export function serialize(envelope, options = {}) {
    const { authorizationList, chainId, feeToken, gas, nonce, to, value, maxFeePerGas, maxPriorityFeePerGas, accessList, data, input, } = envelope;
    assert(envelope);
    const accessTupleList = AccessList.toTupleList(accessList);
    const authorizationTupleList = Authorization.toTupleList(authorizationList);
    const signature = Signature.extract(options.signature || envelope);
    const feePayerSignatureOrSender = (() => {
        if (options.sender)
            return options.sender;
        const feePayerSignature = typeof options.feePayerSignature !== 'undefined'
            ? options.feePayerSignature
            : envelope.feePayerSignature;
        if (feePayerSignature === null)
            return '0x00';
        if (!feePayerSignature)
            return '0x';
        return Signature.toTuple(feePayerSignature);
    })();
    const serialized = [
        Hex.fromNumber(chainId),
        nonce ? Hex.fromNumber(nonce) : '0x',
        maxPriorityFeePerGas ? Hex.fromNumber(maxPriorityFeePerGas) : '0x',
        maxFeePerGas ? Hex.fromNumber(maxFeePerGas) : '0x',
        gas ? Hex.fromNumber(gas) : '0x',
        to ?? '0x',
        value ? Hex.fromNumber(value) : '0x',
        data ?? input ?? '0x',
        accessTupleList,
        authorizationTupleList,
        typeof feeToken === 'bigint' || typeof feeToken === 'string'
            ? TokenId.toAddress(feeToken)
            : '0x',
        feePayerSignatureOrSender,
        ...(signature ? Signature.toTuple(signature) : []),
    ];
    return Hex.concat(options.format !== 'feePayer' ? serializedType : '0x', Rlp.fromHex(serialized));
}
/**
 * Validates a {@link ox#TransactionEnvelopeFeeToken.TransactionEnvelopeFeeToken}. Returns `true` if the envelope is valid, `false` otherwise.
 *
 * @example
 * ```ts twoslash
 * import { Value } from 'ox'
 * import { TransactionEnvelopeFeeToken } from 'ox/tempo'
 *
 * const valid = TransactionEnvelopeFeeToken.validate({
 *   feeToken: '0x20c0000000000000000000000000000000000000',
 *   maxFeePerGas: 2n ** 256n - 1n + 1n,
 *   chainId: 1,
 *   to: '0x0000000000000000000000000000000000000000',
 *   value: Value.fromEther('1'),
 * })
 * // @log: false
 * ```
 *
 * @param envelope - The transaction envelope to validate.
 */
export function validate(envelope) {
    try {
        assert(envelope);
        return true;
    }
    catch {
        return false;
    }
}
//# sourceMappingURL=TransactionEnvelopeFeeToken.js.map