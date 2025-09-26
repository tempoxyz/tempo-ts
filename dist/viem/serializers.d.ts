import { type Signature, type TransactionSerializable } from 'viem';
import type { OneOf } from "../internal/types.js";
import * as TxFeeToken from "../ox/TransactionEnvelopeFeeToken.js";
export declare function serializeTransaction(transaction: OneOf<TxFeeToken.TransactionEnvelopeFeeToken | TransactionSerializable>, signature?: Signature | undefined): `0x77${string}` | `0x02${string}` | `0x01${string}` | `0x03${string}` | `0x04${string}` | import("viem").TransactionSerializedLegacy;
//# sourceMappingURL=serializers.d.ts.map