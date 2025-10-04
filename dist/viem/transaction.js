import * as Hex from 'ox/Hex';
import * as Secp256k1 from 'ox/Secp256k1';
import * as Signature from 'ox/Signature';
import { parseTransaction as viem_parseTransaction, serializeTransaction as viem_serializeTransaction, } from 'viem';
import * as TxFeeToken from "../ox/TransactionEnvelopeFeeToken.js";
export function isTempoTransaction(transaction) {
    if (transaction.type === 'feeToken')
        return true;
    if (typeof transaction.calls !== 'undefined')
        return true;
    if (typeof transaction.feePayer !== 'undefined')
        return true;
    if (typeof transaction.feeToken !== 'undefined')
        return true;
    return false;
}
export function parseTransaction(serializedTransaction) {
    const type = Hex.slice(serializedTransaction, 0, 1);
    if (type === '0x77') {
        const { authorizationList, nonce, r, s, v, ...tx } = TxFeeToken.deserialize(serializedTransaction);
        return {
            ...tx,
            authorizationList: authorizationList?.map((auth) => ({
                ...auth,
                nonce: Number(auth.nonce ?? 0n),
                r: Hex.fromNumber(auth.r, { size: 32 }),
                s: Hex.fromNumber(auth.s, { size: 32 }),
            })),
            nonce: Number(nonce ?? 0n),
            ...(r ? { r: Hex.fromNumber(r, { size: 32 }) } : {}),
            ...(s ? { s: Hex.fromNumber(s, { size: 32 }) } : {}),
            ...(v ? { v: BigInt(v) } : {}),
        };
    }
    return viem_parseTransaction(serializedTransaction);
}
export async function serializeTransaction(transaction, signature) {
    if (!isTempoTransaction(transaction))
        return viem_serializeTransaction(transaction, signature);
    const signature_ = transaction.r && transaction.s ? transaction : signature;
    const { authorizationList, chainId, feePayer, feePayerSignature, nonce, r, s, v, ...rest } = transaction;
    const transaction_ox = {
        ...rest,
        authorizationList: authorizationList?.map((auth) => ({
            ...auth,
            nonce: BigInt(auth.nonce),
            r: BigInt(auth.r),
            s: BigInt(auth.s),
            yParity: Number(auth.yParity),
        })),
        chainId: Number(chainId),
        feePayerSignature: feePayerSignature
            ? {
                r: BigInt(feePayerSignature.r),
                s: BigInt(feePayerSignature.s),
                yParity: Number(feePayerSignature.yParity),
            }
            : feePayer
                ? null
                : undefined,
        ...(nonce ? { nonce: BigInt(nonce) } : {}),
        ...(r ? { r: BigInt(r) } : {}),
        ...(s ? { s: BigInt(s) } : {}),
        ...(v ? { v: Number(v) } : {}),
        type: 'feeToken',
    };
    if (signature_ && typeof transaction.feePayer === 'object') {
        const tx = TxFeeToken.from(transaction_ox, {
            signature: signature_,
        });
        const sender = Secp256k1.recoverAddress({
            payload: TxFeeToken.getSignPayload(tx),
            signature: signature_,
        });
        const hash = TxFeeToken.getFeePayerSignPayload(tx, {
            sender,
        });
        const feePayerSignature = await transaction.feePayer.sign({
            hash,
        });
        return TxFeeToken.serialize(tx, {
            feePayerSignature: Signature.from(feePayerSignature),
        });
    }
    return TxFeeToken.serialize(transaction_ox, {
        feePayerSignature: feePayer === true ? null : undefined,
        signature: signature,
    });
}
//# sourceMappingURL=transaction.js.map