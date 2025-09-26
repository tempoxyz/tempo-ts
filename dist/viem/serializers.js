import * as TxFeeToken from "../ox/TransactionEnvelopeFeeToken.js";
export function serializeTransaction(transaction, signature) {
    if (transaction.type === 'feeToken' || transaction.feeToken)
        return TxFeeToken.serialize(transaction, {
            signature: signature,
        });
    return serializeTransaction(transaction, signature);
}
//# sourceMappingURL=serializers.js.map