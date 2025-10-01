export declare const tempo: {
    blockExplorers?: {
        [key: string]: {
            name: string;
            url: string;
            apiUrl?: string | undefined;
        };
        default: {
            name: string;
            url: string;
            apiUrl?: string | undefined;
        };
    } | undefined | undefined;
    blockTime: number;
    contracts: {
        multicall3: {
            address: "0xca11bde05977b3631167028862be2a173976ca11";
            blockCreated: number;
        };
    };
    ensTlds?: readonly string[] | undefined;
    id: 42424;
    name: "Tempo";
    nativeCurrency: {
        readonly name: "USD";
        readonly symbol: "USD";
        readonly decimals: 18;
    };
    experimental_preconfirmationTime?: number | undefined | undefined;
    rpcUrls: {
        readonly default: {
            readonly http: readonly ["https://rpc-adagio.tempoxyz.dev"];
        };
    };
    sourceId?: number | undefined | undefined;
    testnet?: boolean | undefined | undefined;
    custom?: Record<string, unknown> | undefined;
    fees?: import("viem").ChainFees<undefined> | undefined;
    formatters: {
        transaction: {
            exclude: [] | undefined;
            format: (args: any) => ({
                blockHash: `0x${string}`;
                blockNumber: bigint;
                chainId: number;
                data?: `0x${string}` | undefined;
                from: import("ox/Address").Address;
                hash: import("ox/Hex").Hex;
                input: import("ox/Hex").Hex;
                gas: bigint;
                nonce: bigint;
                to: import("ox/Address").Address | null;
                transactionIndex: number;
                type: `0x${string}`;
                value: bigint;
                r: bigint;
                s: bigint;
                yParity: number;
                v?: number | undefined;
                gasPrice?: undefined;
                accessList?: undefined;
                maxFeePerGas?: undefined;
                maxPriorityFeePerGas?: undefined;
                blobVersionedHashes?: undefined;
                maxFeePerBlobGas?: undefined;
                authorizationList?: undefined;
                feeToken?: undefined;
            } | {
                blockHash: `0x${string}`;
                blockNumber: bigint;
                chainId: number;
                data?: `0x${string}` | undefined;
                from: import("ox/Address").Address;
                hash: import("ox/Hex").Hex;
                input: import("ox/Hex").Hex;
                gas: bigint;
                nonce: bigint;
                to: import("ox/Address").Address | null;
                transactionIndex: number;
                type: "feeToken";
                value: bigint;
                r: bigint;
                s: bigint;
                yParity: number;
                v?: number | undefined;
                accessList: readonly {
                    address: import("ox/Address").Address;
                    storageKeys: readonly import("ox/Hex").Hex[];
                }[];
                authorizationList: readonly {
                    address: import("ox/Address").Address;
                    chainId: number;
                    nonce: bigint;
                    r: bigint;
                    s: bigint;
                    yParity: number;
                }[];
                feeToken: import("ox/Address").Address;
                gasPrice?: bigint | undefined;
                maxFeePerGas: bigint;
                maxPriorityFeePerGas: bigint;
                blobVersionedHashes?: undefined;
                maxFeePerBlobGas?: undefined;
            } | {
                blockHash: `0x${string}`;
                blockNumber: bigint;
                data?: `0x${string}` | undefined;
                from: import("ox/Address").Address;
                hash: import("ox/Hex").Hex;
                input: import("ox/Hex").Hex;
                gas: bigint;
                nonce: bigint;
                to: import("ox/Address").Address | null;
                transactionIndex: number;
                type: "legacy";
                value: bigint;
                r: bigint;
                s: bigint;
                chainId?: number | undefined;
                gasPrice: bigint;
                v: number;
                yParity?: number | undefined;
                accessList?: undefined;
                maxFeePerGas?: undefined;
                maxPriorityFeePerGas?: undefined;
                blobVersionedHashes?: undefined;
                maxFeePerBlobGas?: undefined;
                authorizationList?: undefined;
                feeToken?: undefined;
            } | {
                blockHash: `0x${string}`;
                blockNumber: bigint;
                chainId: number;
                data?: `0x${string}` | undefined;
                from: import("ox/Address").Address;
                hash: import("ox/Hex").Hex;
                input: import("ox/Hex").Hex;
                gas: bigint;
                nonce: bigint;
                to: import("ox/Address").Address | null;
                transactionIndex: number;
                type: "eip1559";
                value: bigint;
                r: bigint;
                s: bigint;
                yParity: number;
                v?: number | undefined;
                accessList: readonly {
                    address: import("ox/Address").Address;
                    storageKeys: readonly import("ox/Hex").Hex[];
                }[];
                gasPrice?: bigint | undefined;
                maxFeePerGas: bigint;
                maxPriorityFeePerGas: bigint;
                blobVersionedHashes?: undefined;
                maxFeePerBlobGas?: undefined;
                authorizationList?: undefined;
                feeToken?: undefined;
            } | {
                blockHash: `0x${string}`;
                blockNumber: bigint;
                chainId: number;
                data?: `0x${string}` | undefined;
                from: import("ox/Address").Address;
                hash: import("ox/Hex").Hex;
                input: import("ox/Hex").Hex;
                gas: bigint;
                nonce: bigint;
                to: import("ox/Address").Address | null;
                transactionIndex: number;
                type: "eip2930";
                value: bigint;
                r: bigint;
                s: bigint;
                yParity: number;
                v?: number | undefined;
                accessList: readonly {
                    address: import("ox/Address").Address;
                    storageKeys: readonly import("ox/Hex").Hex[];
                }[];
                gasPrice: bigint;
                maxFeePerGas?: undefined;
                maxPriorityFeePerGas?: undefined;
                blobVersionedHashes?: undefined;
                maxFeePerBlobGas?: undefined;
                authorizationList?: undefined;
                feeToken?: undefined;
            } | {
                blockHash: `0x${string}`;
                blockNumber: bigint;
                chainId: number;
                data?: `0x${string}` | undefined;
                from: import("ox/Address").Address;
                hash: import("ox/Hex").Hex;
                input: import("ox/Hex").Hex;
                gas: bigint;
                nonce: bigint;
                to: import("ox/Address").Address | null;
                transactionIndex: number;
                type: "eip4844";
                value: bigint;
                r: bigint;
                s: bigint;
                yParity: number;
                v?: number | undefined;
                accessList: readonly {
                    address: import("ox/Address").Address;
                    storageKeys: readonly import("ox/Hex").Hex[];
                }[];
                blobVersionedHashes: readonly import("ox/Hex").Hex[];
                maxFeePerBlobGas: bigint;
                maxFeePerGas: bigint;
                maxPriorityFeePerGas: bigint;
                gasPrice?: undefined;
                authorizationList?: undefined;
                feeToken?: undefined;
            } | {
                blockHash: `0x${string}`;
                blockNumber: bigint;
                chainId: number;
                data?: `0x${string}` | undefined;
                from: import("ox/Address").Address;
                hash: import("ox/Hex").Hex;
                input: import("ox/Hex").Hex;
                gas: bigint;
                nonce: bigint;
                to: import("ox/Address").Address | null;
                transactionIndex: number;
                type: "eip7702";
                value: bigint;
                r: bigint;
                s: bigint;
                yParity: number;
                v?: number | undefined;
                accessList: readonly {
                    address: import("ox/Address").Address;
                    storageKeys: readonly import("ox/Hex").Hex[];
                }[];
                authorizationList: readonly {
                    address: import("ox/Address").Address;
                    chainId: number;
                    nonce: bigint;
                    r: bigint;
                    s: bigint;
                    yParity: number;
                }[];
                maxFeePerGas: bigint;
                maxPriorityFeePerGas: bigint;
                gasPrice?: undefined;
                blobVersionedHashes?: undefined;
                maxFeePerBlobGas?: undefined;
                feeToken?: undefined;
            } | null) & {};
            type: "transaction";
        };
        transactionRequest: {
            exclude: [] | undefined;
            format: (args: import("./ox/TransactionRequest.js").TransactionRequest<bigint, number, string>) => ({
                accessList?: readonly {
                    address: import("ox/Address").Address;
                    storageKeys: readonly import("ox/Hex").Hex[];
                }[] | undefined;
                authorizationList?: readonly {
                    address: import("ox/Address").Address;
                    chainId: `0x${string}`;
                    nonce: `0x${string}`;
                    r: `0x${string}`;
                    s: `0x${string}`;
                    yParity: `0x${string}`;
                }[] | undefined;
                blobVersionedHashes?: readonly import("ox/Hex").Hex[];
                blobs?: readonly `0x${string}`[] | undefined;
                chainId?: `0x${string}` | undefined;
                data?: `0x${string}` | undefined;
                input?: `0x${string}` | undefined;
                from?: `0x${string}` | undefined;
                gas?: `0x${string}` | undefined;
                gasPrice?: `0x${string}` | undefined;
                maxFeePerBlobGas?: `0x${string}` | undefined;
                maxFeePerGas?: `0x${string}` | undefined;
                maxPriorityFeePerGas?: `0x${string}` | undefined;
                nonce?: `0x${string}` | undefined;
                to?: `0x${string}` | null | undefined;
                type?: string | undefined;
                value?: `0x${string}` | undefined;
                feeToken?: import("./ox/TokenId.js").TokenIdOrAddress | undefined;
                calls?: undefined;
            } | {
                chainId?: `0x${string}` | undefined;
                from?: `0x${string}` | undefined;
                input?: `0x${string}` | undefined;
                gas?: `0x${string}` | undefined;
                nonce?: `0x${string}` | undefined;
                type?: string | undefined;
                gasPrice?: `0x${string}` | undefined;
                accessList?: readonly {
                    address: import("ox/Address").Address;
                    storageKeys: readonly import("ox/Hex").Hex[];
                }[] | undefined;
                maxFeePerGas?: `0x${string}` | undefined;
                maxPriorityFeePerGas?: `0x${string}` | undefined;
                blobVersionedHashes?: readonly import("ox/Hex").Hex[];
                maxFeePerBlobGas?: `0x${string}` | undefined;
                authorizationList?: readonly {
                    address: import("ox/Address").Address;
                    chainId: `0x${string}`;
                    nonce: `0x${string}`;
                    r: `0x${string}`;
                    s: `0x${string}`;
                    yParity: `0x${string}`;
                }[] | undefined;
                blobs?: readonly `0x${string}`[] | undefined;
                calls?: readonly import("ox/erc7821/Calls").Call[];
                feeToken?: import("./ox/TokenId.js").TokenIdOrAddress | undefined;
                data?: undefined;
                to?: undefined;
                value?: undefined;
            }) & {};
            type: "transactionRequest";
        };
    };
    serializers: {
        transaction: typeof import("./viem/serializers.js").serializeTransaction;
    };
};
export declare const tempoLocal: {
    blockExplorers?: {
        [key: string]: {
            name: string;
            url: string;
            apiUrl?: string | undefined;
        };
        default: {
            name: string;
            url: string;
            apiUrl?: string | undefined;
        };
    } | undefined | undefined;
    blockTime: number;
    contracts: {
        multicall3: {
            address: "0xca11bde05977b3631167028862be2a173976ca11";
            blockCreated: number;
        };
    };
    ensTlds?: readonly string[] | undefined;
    id: 1337;
    name: "Tempo";
    nativeCurrency: {
        readonly name: "USD";
        readonly symbol: "USD";
        readonly decimals: 18;
    };
    experimental_preconfirmationTime?: number | undefined | undefined;
    rpcUrls: {
        readonly default: {
            readonly http: readonly ["http://localhost:8545"];
        };
    };
    sourceId?: number | undefined | undefined;
    testnet?: boolean | undefined | undefined;
    custom?: Record<string, unknown> | undefined;
    fees?: import("viem").ChainFees<undefined> | undefined;
    formatters: {
        transaction: {
            exclude: [] | undefined;
            format: (args: any) => ({
                blockHash: `0x${string}`;
                blockNumber: bigint;
                chainId: number;
                data?: `0x${string}` | undefined;
                from: import("ox/Address").Address;
                hash: import("ox/Hex").Hex;
                input: import("ox/Hex").Hex;
                gas: bigint;
                nonce: bigint;
                to: import("ox/Address").Address | null;
                transactionIndex: number;
                type: `0x${string}`;
                value: bigint;
                r: bigint;
                s: bigint;
                yParity: number;
                v?: number | undefined;
                gasPrice?: undefined;
                accessList?: undefined;
                maxFeePerGas?: undefined;
                maxPriorityFeePerGas?: undefined;
                blobVersionedHashes?: undefined;
                maxFeePerBlobGas?: undefined;
                authorizationList?: undefined;
                feeToken?: undefined;
            } | {
                blockHash: `0x${string}`;
                blockNumber: bigint;
                chainId: number;
                data?: `0x${string}` | undefined;
                from: import("ox/Address").Address;
                hash: import("ox/Hex").Hex;
                input: import("ox/Hex").Hex;
                gas: bigint;
                nonce: bigint;
                to: import("ox/Address").Address | null;
                transactionIndex: number;
                type: "feeToken";
                value: bigint;
                r: bigint;
                s: bigint;
                yParity: number;
                v?: number | undefined;
                accessList: readonly {
                    address: import("ox/Address").Address;
                    storageKeys: readonly import("ox/Hex").Hex[];
                }[];
                authorizationList: readonly {
                    address: import("ox/Address").Address;
                    chainId: number;
                    nonce: bigint;
                    r: bigint;
                    s: bigint;
                    yParity: number;
                }[];
                feeToken: import("ox/Address").Address;
                gasPrice?: bigint | undefined;
                maxFeePerGas: bigint;
                maxPriorityFeePerGas: bigint;
                blobVersionedHashes?: undefined;
                maxFeePerBlobGas?: undefined;
            } | {
                blockHash: `0x${string}`;
                blockNumber: bigint;
                data?: `0x${string}` | undefined;
                from: import("ox/Address").Address;
                hash: import("ox/Hex").Hex;
                input: import("ox/Hex").Hex;
                gas: bigint;
                nonce: bigint;
                to: import("ox/Address").Address | null;
                transactionIndex: number;
                type: "legacy";
                value: bigint;
                r: bigint;
                s: bigint;
                chainId?: number | undefined;
                gasPrice: bigint;
                v: number;
                yParity?: number | undefined;
                accessList?: undefined;
                maxFeePerGas?: undefined;
                maxPriorityFeePerGas?: undefined;
                blobVersionedHashes?: undefined;
                maxFeePerBlobGas?: undefined;
                authorizationList?: undefined;
                feeToken?: undefined;
            } | {
                blockHash: `0x${string}`;
                blockNumber: bigint;
                chainId: number;
                data?: `0x${string}` | undefined;
                from: import("ox/Address").Address;
                hash: import("ox/Hex").Hex;
                input: import("ox/Hex").Hex;
                gas: bigint;
                nonce: bigint;
                to: import("ox/Address").Address | null;
                transactionIndex: number;
                type: "eip1559";
                value: bigint;
                r: bigint;
                s: bigint;
                yParity: number;
                v?: number | undefined;
                accessList: readonly {
                    address: import("ox/Address").Address;
                    storageKeys: readonly import("ox/Hex").Hex[];
                }[];
                gasPrice?: bigint | undefined;
                maxFeePerGas: bigint;
                maxPriorityFeePerGas: bigint;
                blobVersionedHashes?: undefined;
                maxFeePerBlobGas?: undefined;
                authorizationList?: undefined;
                feeToken?: undefined;
            } | {
                blockHash: `0x${string}`;
                blockNumber: bigint;
                chainId: number;
                data?: `0x${string}` | undefined;
                from: import("ox/Address").Address;
                hash: import("ox/Hex").Hex;
                input: import("ox/Hex").Hex;
                gas: bigint;
                nonce: bigint;
                to: import("ox/Address").Address | null;
                transactionIndex: number;
                type: "eip2930";
                value: bigint;
                r: bigint;
                s: bigint;
                yParity: number;
                v?: number | undefined;
                accessList: readonly {
                    address: import("ox/Address").Address;
                    storageKeys: readonly import("ox/Hex").Hex[];
                }[];
                gasPrice: bigint;
                maxFeePerGas?: undefined;
                maxPriorityFeePerGas?: undefined;
                blobVersionedHashes?: undefined;
                maxFeePerBlobGas?: undefined;
                authorizationList?: undefined;
                feeToken?: undefined;
            } | {
                blockHash: `0x${string}`;
                blockNumber: bigint;
                chainId: number;
                data?: `0x${string}` | undefined;
                from: import("ox/Address").Address;
                hash: import("ox/Hex").Hex;
                input: import("ox/Hex").Hex;
                gas: bigint;
                nonce: bigint;
                to: import("ox/Address").Address | null;
                transactionIndex: number;
                type: "eip4844";
                value: bigint;
                r: bigint;
                s: bigint;
                yParity: number;
                v?: number | undefined;
                accessList: readonly {
                    address: import("ox/Address").Address;
                    storageKeys: readonly import("ox/Hex").Hex[];
                }[];
                blobVersionedHashes: readonly import("ox/Hex").Hex[];
                maxFeePerBlobGas: bigint;
                maxFeePerGas: bigint;
                maxPriorityFeePerGas: bigint;
                gasPrice?: undefined;
                authorizationList?: undefined;
                feeToken?: undefined;
            } | {
                blockHash: `0x${string}`;
                blockNumber: bigint;
                chainId: number;
                data?: `0x${string}` | undefined;
                from: import("ox/Address").Address;
                hash: import("ox/Hex").Hex;
                input: import("ox/Hex").Hex;
                gas: bigint;
                nonce: bigint;
                to: import("ox/Address").Address | null;
                transactionIndex: number;
                type: "eip7702";
                value: bigint;
                r: bigint;
                s: bigint;
                yParity: number;
                v?: number | undefined;
                accessList: readonly {
                    address: import("ox/Address").Address;
                    storageKeys: readonly import("ox/Hex").Hex[];
                }[];
                authorizationList: readonly {
                    address: import("ox/Address").Address;
                    chainId: number;
                    nonce: bigint;
                    r: bigint;
                    s: bigint;
                    yParity: number;
                }[];
                maxFeePerGas: bigint;
                maxPriorityFeePerGas: bigint;
                gasPrice?: undefined;
                blobVersionedHashes?: undefined;
                maxFeePerBlobGas?: undefined;
                feeToken?: undefined;
            } | null) & {};
            type: "transaction";
        };
        transactionRequest: {
            exclude: [] | undefined;
            format: (args: import("./ox/TransactionRequest.js").TransactionRequest<bigint, number, string>) => ({
                accessList?: readonly {
                    address: import("ox/Address").Address;
                    storageKeys: readonly import("ox/Hex").Hex[];
                }[] | undefined;
                authorizationList?: readonly {
                    address: import("ox/Address").Address;
                    chainId: `0x${string}`;
                    nonce: `0x${string}`;
                    r: `0x${string}`;
                    s: `0x${string}`;
                    yParity: `0x${string}`;
                }[] | undefined;
                blobVersionedHashes?: readonly import("ox/Hex").Hex[];
                blobs?: readonly `0x${string}`[] | undefined;
                chainId?: `0x${string}` | undefined;
                data?: `0x${string}` | undefined;
                input?: `0x${string}` | undefined;
                from?: `0x${string}` | undefined;
                gas?: `0x${string}` | undefined;
                gasPrice?: `0x${string}` | undefined;
                maxFeePerBlobGas?: `0x${string}` | undefined;
                maxFeePerGas?: `0x${string}` | undefined;
                maxPriorityFeePerGas?: `0x${string}` | undefined;
                nonce?: `0x${string}` | undefined;
                to?: `0x${string}` | null | undefined;
                type?: string | undefined;
                value?: `0x${string}` | undefined;
                feeToken?: import("./ox/TokenId.js").TokenIdOrAddress | undefined;
                calls?: undefined;
            } | {
                chainId?: `0x${string}` | undefined;
                from?: `0x${string}` | undefined;
                input?: `0x${string}` | undefined;
                gas?: `0x${string}` | undefined;
                nonce?: `0x${string}` | undefined;
                type?: string | undefined;
                gasPrice?: `0x${string}` | undefined;
                accessList?: readonly {
                    address: import("ox/Address").Address;
                    storageKeys: readonly import("ox/Hex").Hex[];
                }[] | undefined;
                maxFeePerGas?: `0x${string}` | undefined;
                maxPriorityFeePerGas?: `0x${string}` | undefined;
                blobVersionedHashes?: readonly import("ox/Hex").Hex[];
                maxFeePerBlobGas?: `0x${string}` | undefined;
                authorizationList?: readonly {
                    address: import("ox/Address").Address;
                    chainId: `0x${string}`;
                    nonce: `0x${string}`;
                    r: `0x${string}`;
                    s: `0x${string}`;
                    yParity: `0x${string}`;
                }[] | undefined;
                blobs?: readonly `0x${string}`[] | undefined;
                calls?: readonly import("ox/erc7821/Calls").Call[];
                feeToken?: import("./ox/TokenId.js").TokenIdOrAddress | undefined;
                data?: undefined;
                to?: undefined;
                value?: undefined;
            }) & {};
            type: "transactionRequest";
        };
    };
    serializers: {
        transaction: typeof import("./viem/serializers.js").serializeTransaction;
    };
};
//# sourceMappingURL=chains.d.ts.map