import { defineTransaction, defineTransactionRequest, } from 'viem';
import { formatTransaction, formatTransactionRequest } from "./formatters.js";
import { serializeTransaction } from "./serializers.js";
export const chainConfig = {
    blockTime: 1_000,
    contracts: {
        multicall3: {
            address: '0xca11bde05977b3631167028862be2a173976ca11',
            blockCreated: 0,
        },
    },
    formatters: {
        transaction: defineTransaction({ format: formatTransaction }),
        transactionRequest: defineTransactionRequest({
            format: formatTransactionRequest,
        }),
    },
    serializers: {
        transaction: serializeTransaction,
    },
};
//# sourceMappingURL=chain.js.map