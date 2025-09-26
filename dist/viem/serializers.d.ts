import type { Signature, TransactionSerializable } from 'viem';
import type { OneOf } from "../internal/types.js";
import * as TxFeeToken from "../ox/TransactionEnvelopeFeeToken.js";
export declare function serializeTransaction(transaction: OneOf<TxFeeToken.TransactionEnvelopeFeeToken | TransactionSerializable>, signature?: Signature | undefined): `0x77${string}`;
//# sourceMappingURL=serializers.d.ts.map