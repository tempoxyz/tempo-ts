import { serializeTransaction as viem_serializeTransaction, } from 'viem';
import * as TxFeeToken from "../ox/TransactionEnvelopeFeeToken.js";
export function serializeTransaction(transaction, signature) {
    if (transaction.type === 'feeToken' || transaction.feeToken)
        return TxFeeToken.serialize(transaction, {
            signature: signature,
        });
    return viem_serializeTransaction(transaction, signature);
}
//# sourceMappingURL=serializers.js.map