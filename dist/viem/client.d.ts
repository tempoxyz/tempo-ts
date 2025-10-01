import { type Account, type Address, type Chain, type ClientConfig, type RpcSchema, type Transport } from 'viem';
import { tempo } from "../chains.js";
import type { PartialBy } from "../internal/types.js";
/**
 * Instantiates a default Tempo client.
 *
 * @example
 * ```ts
 * import { createTempoClient } from 'tempo/viem'
 * import { privateKeyToAccount } from 'viem/accounts'
 *
 * const client = createTempoClient({
 *   account: privateKeyToAccount('0x...')
 * })
 * ```
 *
 * @param parameters - The parameters for the client.
 * @returns A Tempo client.
 */
export declare function createTempoClient<transport extends Transport, chain extends Chain | undefined = typeof tempo, accountOrAddress extends Account | Address | undefined = undefined, rpcSchema extends RpcSchema | undefined = undefined>(parameters?: createTempoClient.Parameters<transport, chain, accountOrAddress, rpcSchema>): import("viem").Client<transport | import("viem").HttpTransport<undefined, false>, {
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
            format: (args: import("../ox/TransactionRequest.js").TransactionRequest<bigint, number, string>) => ({
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
                feeToken?: import("../ox/TokenId.js").TokenIdOrAddress | undefined;
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
                feeToken?: import("../ox/TokenId.js").TokenIdOrAddress | undefined;
                data?: undefined;
                to?: undefined;
                value?: undefined;
            }) & {};
            type: "transactionRequest";
        };
    };
    serializers: {
        transaction: typeof import("./serializers.js").serializeTransaction;
    };
}, accountOrAddress extends `0x${string}` ? {
    address: accountOrAddress;
    type: "json-rpc";
} : accountOrAddress, rpcSchema, {
    amm: {
        getPoolId: (parameters: import("./actions/amm.js").getPoolId.Parameters) => Promise<import("./actions/amm.js").getPoolId.ReturnType>;
        getPool: (parameters: import("./actions/amm.js").getPool.Parameters) => Promise<import("./actions/amm.js").getPool.ReturnType>;
        getTotalSupply: (parameters: import("./actions/amm.js").getTotalSupply.Parameters) => Promise<import("./actions/amm.js").getTotalSupply.ReturnType>;
        getLiquidityBalance: (parameters: import("./actions/amm.js").getLiquidityBalance.Parameters) => Promise<import("./actions/amm.js").getLiquidityBalance.ReturnType>;
        rebalanceSwap: (parameters: import("./actions/amm.js").rebalanceSwap.Parameters<{
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
                    format: (args: import("../ox/TransactionRequest.js").TransactionRequest<bigint, number, string>) => ({
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
                        feeToken?: import("../ox/TokenId.js").TokenIdOrAddress | undefined;
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
                        feeToken?: import("../ox/TokenId.js").TokenIdOrAddress | undefined;
                        data?: undefined;
                        to?: undefined;
                        value?: undefined;
                    }) & {};
                    type: "transactionRequest";
                };
            };
            serializers: {
                transaction: typeof import("./serializers.js").serializeTransaction;
            };
        }, accountOrAddress extends `0x${string}` ? {
            address: accountOrAddress;
            type: "json-rpc";
        } : accountOrAddress>) => Promise<import("./actions/amm.js").rebalanceSwap.ReturnType>;
        mint: (parameters: import("./actions/amm.js").mint.Parameters<{
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
                    format: (args: import("../ox/TransactionRequest.js").TransactionRequest<bigint, number, string>) => ({
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
                        feeToken?: import("../ox/TokenId.js").TokenIdOrAddress | undefined;
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
                        feeToken?: import("../ox/TokenId.js").TokenIdOrAddress | undefined;
                        data?: undefined;
                        to?: undefined;
                        value?: undefined;
                    }) & {};
                    type: "transactionRequest";
                };
            };
            serializers: {
                transaction: typeof import("./serializers.js").serializeTransaction;
            };
        }, accountOrAddress extends `0x${string}` ? {
            address: accountOrAddress;
            type: "json-rpc";
        } : accountOrAddress>) => Promise<import("./actions/amm.js").mint.ReturnType>;
        burn: (parameters: import("./actions/amm.js").burn.Parameters<{
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
                    format: (args: import("../ox/TransactionRequest.js").TransactionRequest<bigint, number, string>) => ({
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
                        feeToken?: import("../ox/TokenId.js").TokenIdOrAddress | undefined;
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
                        feeToken?: import("../ox/TokenId.js").TokenIdOrAddress | undefined;
                        data?: undefined;
                        to?: undefined;
                        value?: undefined;
                    }) & {};
                    type: "transactionRequest";
                };
            };
            serializers: {
                transaction: typeof import("./serializers.js").serializeTransaction;
            };
        }, accountOrAddress extends `0x${string}` ? {
            address: accountOrAddress;
            type: "json-rpc";
        } : accountOrAddress>) => Promise<import("./actions/amm.js").burn.ReturnType>;
        watchRebalanceSwap: (parameters: import("./actions/amm.js").watchRebalanceSwap.Parameters) => () => void;
        watchFeeSwap: (parameters: import("./actions/amm.js").watchFeeSwap.Parameters) => () => void;
        watchMint: (parameters: import("./actions/amm.js").watchMint.Parameters) => () => void;
        watchBurn: (parameters: import("./actions/amm.js").watchBurn.Parameters) => () => void;
    };
    fee: {
        getUserToken: (...parameters: (accountOrAddress extends `0x${string}` ? {
            address: accountOrAddress;
            type: "json-rpc";
        } : accountOrAddress) extends infer T ? T extends (accountOrAddress extends `0x${string}` ? {
            address: accountOrAddress;
            type: "json-rpc";
        } : accountOrAddress) ? T extends Account ? [] | [import("./actions/fee.js").getUserToken.Parameters<Account & (accountOrAddress extends `0x${string}` ? {
            address: accountOrAddress;
            type: "json-rpc";
        } : accountOrAddress)>] : [import("./actions/fee.js").getUserToken.Parameters<accountOrAddress extends `0x${string}` ? {
            address: accountOrAddress;
            type: "json-rpc";
        } : accountOrAddress>] : never : never) => Promise<import("./actions/fee.js").getUserToken.ReturnType>;
        setUserToken: (parameters: import("./actions/fee.js").setUserToken.Parameters<{
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
                    format: (args: import("../ox/TransactionRequest.js").TransactionRequest<bigint, number, string>) => ({
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
                        feeToken?: import("../ox/TokenId.js").TokenIdOrAddress | undefined;
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
                        feeToken?: import("../ox/TokenId.js").TokenIdOrAddress | undefined;
                        data?: undefined;
                        to?: undefined;
                        value?: undefined;
                    }) & {};
                    type: "transactionRequest";
                };
            };
            serializers: {
                transaction: typeof import("./serializers.js").serializeTransaction;
            };
        }, accountOrAddress extends `0x${string}` ? {
            address: accountOrAddress;
            type: "json-rpc";
        } : accountOrAddress>) => Promise<import("./actions/fee.js").setUserToken.ReturnType>;
        watchSetUserToken: (parameters: import("./actions/fee.js").watchSetUserToken.Parameters) => () => void;
    };
    policy: {
        create: (parameters: import("./actions/policy.js").create.Parameters<{
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
                    format: (args: import("../ox/TransactionRequest.js").TransactionRequest<bigint, number, string>) => ({
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
                        feeToken?: import("../ox/TokenId.js").TokenIdOrAddress | undefined;
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
                        feeToken?: import("../ox/TokenId.js").TokenIdOrAddress | undefined;
                        data?: undefined;
                        to?: undefined;
                        value?: undefined;
                    }) & {};
                    type: "transactionRequest";
                };
            };
            serializers: {
                transaction: typeof import("./serializers.js").serializeTransaction;
            };
        }, accountOrAddress extends `0x${string}` ? {
            address: accountOrAddress;
            type: "json-rpc";
        } : accountOrAddress>) => Promise<import("./actions/policy.js").create.ReturnType>;
        setAdmin: (parameters: import("./actions/policy.js").setAdmin.Parameters<{
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
                    format: (args: import("../ox/TransactionRequest.js").TransactionRequest<bigint, number, string>) => ({
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
                        feeToken?: import("../ox/TokenId.js").TokenIdOrAddress | undefined;
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
                        feeToken?: import("../ox/TokenId.js").TokenIdOrAddress | undefined;
                        data?: undefined;
                        to?: undefined;
                        value?: undefined;
                    }) & {};
                    type: "transactionRequest";
                };
            };
            serializers: {
                transaction: typeof import("./serializers.js").serializeTransaction;
            };
        }, accountOrAddress extends `0x${string}` ? {
            address: accountOrAddress;
            type: "json-rpc";
        } : accountOrAddress>) => Promise<import("./actions/policy.js").setAdmin.ReturnType>;
        modifyWhitelist: (parameters: import("./actions/policy.js").modifyWhitelist.Parameters<{
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
                    format: (args: import("../ox/TransactionRequest.js").TransactionRequest<bigint, number, string>) => ({
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
                        feeToken?: import("../ox/TokenId.js").TokenIdOrAddress | undefined;
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
                        feeToken?: import("../ox/TokenId.js").TokenIdOrAddress | undefined;
                        data?: undefined;
                        to?: undefined;
                        value?: undefined;
                    }) & {};
                    type: "transactionRequest";
                };
            };
            serializers: {
                transaction: typeof import("./serializers.js").serializeTransaction;
            };
        }, accountOrAddress extends `0x${string}` ? {
            address: accountOrAddress;
            type: "json-rpc";
        } : accountOrAddress>) => Promise<import("./actions/policy.js").modifyWhitelist.ReturnType>;
        modifyBlacklist: (parameters: import("./actions/policy.js").modifyBlacklist.Parameters<{
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
                    format: (args: import("../ox/TransactionRequest.js").TransactionRequest<bigint, number, string>) => ({
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
                        feeToken?: import("../ox/TokenId.js").TokenIdOrAddress | undefined;
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
                        feeToken?: import("../ox/TokenId.js").TokenIdOrAddress | undefined;
                        data?: undefined;
                        to?: undefined;
                        value?: undefined;
                    }) & {};
                    type: "transactionRequest";
                };
            };
            serializers: {
                transaction: typeof import("./serializers.js").serializeTransaction;
            };
        }, accountOrAddress extends `0x${string}` ? {
            address: accountOrAddress;
            type: "json-rpc";
        } : accountOrAddress>) => Promise<import("./actions/policy.js").modifyBlacklist.ReturnType>;
        getData: (parameters: import("./actions/policy.js").getData.Parameters) => Promise<import("./actions/policy.js").getData.ReturnType>;
        isAuthorized: (parameters: import("./actions/policy.js").isAuthorized.Parameters) => Promise<import("./actions/policy.js").isAuthorized.ReturnType>;
        watchCreate: (parameters: import("./actions/policy.js").watchCreate.Parameters) => () => void;
        watchAdminUpdated: (parameters: import("./actions/policy.js").watchAdminUpdated.Parameters) => () => void;
        watchWhitelistUpdated: (parameters: import("./actions/policy.js").watchWhitelistUpdated.Parameters) => () => void;
        watchBlacklistUpdated: (parameters: import("./actions/policy.js").watchBlacklistUpdated.Parameters) => () => void;
    };
    token: {
        approve: (parameters: import("./actions/token.js").approve.Parameters<{
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
                    format: (args: import("../ox/TransactionRequest.js").TransactionRequest<bigint, number, string>) => ({
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
                        feeToken?: import("../ox/TokenId.js").TokenIdOrAddress | undefined;
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
                        feeToken?: import("../ox/TokenId.js").TokenIdOrAddress | undefined;
                        data?: undefined;
                        to?: undefined;
                        value?: undefined;
                    }) & {};
                    type: "transactionRequest";
                };
            };
            serializers: {
                transaction: typeof import("./serializers.js").serializeTransaction;
            };
        }, accountOrAddress extends `0x${string}` ? {
            address: accountOrAddress;
            type: "json-rpc";
        } : accountOrAddress>) => Promise<import("./actions/token.js").approve.ReturnType>;
        burnBlocked: (parameters: import("./actions/token.js").burnBlocked.Parameters<{
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
                    format: (args: import("../ox/TransactionRequest.js").TransactionRequest<bigint, number, string>) => ({
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
                        feeToken?: import("../ox/TokenId.js").TokenIdOrAddress | undefined;
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
                        feeToken?: import("../ox/TokenId.js").TokenIdOrAddress | undefined;
                        data?: undefined;
                        to?: undefined;
                        value?: undefined;
                    }) & {};
                    type: "transactionRequest";
                };
            };
            serializers: {
                transaction: typeof import("./serializers.js").serializeTransaction;
            };
        }, accountOrAddress extends `0x${string}` ? {
            address: accountOrAddress;
            type: "json-rpc";
        } : accountOrAddress>) => Promise<import("./actions/token.js").burnBlocked.ReturnType>;
        burn: (parameters: import("./actions/token.js").burn.Parameters<{
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
                    format: (args: import("../ox/TransactionRequest.js").TransactionRequest<bigint, number, string>) => ({
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
                        feeToken?: import("../ox/TokenId.js").TokenIdOrAddress | undefined;
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
                        feeToken?: import("../ox/TokenId.js").TokenIdOrAddress | undefined;
                        data?: undefined;
                        to?: undefined;
                        value?: undefined;
                    }) & {};
                    type: "transactionRequest";
                };
            };
            serializers: {
                transaction: typeof import("./serializers.js").serializeTransaction;
            };
        }, accountOrAddress extends `0x${string}` ? {
            address: accountOrAddress;
            type: "json-rpc";
        } : accountOrAddress>) => Promise<import("./actions/token.js").burn.ReturnType>;
        changeTransferPolicy: (parameters: import("./actions/token.js").changeTransferPolicy.Parameters<{
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
                    format: (args: import("../ox/TransactionRequest.js").TransactionRequest<bigint, number, string>) => ({
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
                        feeToken?: import("../ox/TokenId.js").TokenIdOrAddress | undefined;
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
                        feeToken?: import("../ox/TokenId.js").TokenIdOrAddress | undefined;
                        data?: undefined;
                        to?: undefined;
                        value?: undefined;
                    }) & {};
                    type: "transactionRequest";
                };
            };
            serializers: {
                transaction: typeof import("./serializers.js").serializeTransaction;
            };
        }, accountOrAddress extends `0x${string}` ? {
            address: accountOrAddress;
            type: "json-rpc";
        } : accountOrAddress>) => Promise<import("./actions/token.js").changeTransferPolicy.ReturnType>;
        create: (parameters: import("./actions/token.js").create.Parameters<{
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
                    format: (args: import("../ox/TransactionRequest.js").TransactionRequest<bigint, number, string>) => ({
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
                        feeToken?: import("../ox/TokenId.js").TokenIdOrAddress | undefined;
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
                        feeToken?: import("../ox/TokenId.js").TokenIdOrAddress | undefined;
                        data?: undefined;
                        to?: undefined;
                        value?: undefined;
                    }) & {};
                    type: "transactionRequest";
                };
            };
            serializers: {
                transaction: typeof import("./serializers.js").serializeTransaction;
            };
        }, accountOrAddress extends `0x${string}` ? {
            address: accountOrAddress;
            type: "json-rpc";
        } : accountOrAddress>) => Promise<import("./actions/token.js").create.ReturnType>;
        getAllowance: (parameters: import("./actions/token.js").getAllowance.Parameters) => Promise<import("./actions/token.js").getAllowance.ReturnType>;
        getBalance: (...parameters: (accountOrAddress extends `0x${string}` ? {
            address: accountOrAddress;
            type: "json-rpc";
        } : accountOrAddress) extends infer T ? T extends (accountOrAddress extends `0x${string}` ? {
            address: accountOrAddress;
            type: "json-rpc";
        } : accountOrAddress) ? T extends Account ? [] | [import("./actions/token.js").getBalance.Parameters<Account & (accountOrAddress extends `0x${string}` ? {
            address: accountOrAddress;
            type: "json-rpc";
        } : accountOrAddress)>] : [import("./actions/token.js").getBalance.Parameters<accountOrAddress extends `0x${string}` ? {
            address: accountOrAddress;
            type: "json-rpc";
        } : accountOrAddress>] : never : never) => Promise<import("./actions/token.js").getBalance.ReturnType>;
        getMetadata: (parameters: import("./actions/token.js").getMetadata.Parameters) => Promise<import("./actions/token.js").getMetadata.ReturnType>;
        grantRoles: (parameters: import("./actions/token.js").grantRoles.Parameters<{
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
                    format: (args: import("../ox/TransactionRequest.js").TransactionRequest<bigint, number, string>) => ({
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
                        feeToken?: import("../ox/TokenId.js").TokenIdOrAddress | undefined;
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
                        feeToken?: import("../ox/TokenId.js").TokenIdOrAddress | undefined;
                        data?: undefined;
                        to?: undefined;
                        value?: undefined;
                    }) & {};
                    type: "transactionRequest";
                };
            };
            serializers: {
                transaction: typeof import("./serializers.js").serializeTransaction;
            };
        }, accountOrAddress extends `0x${string}` ? {
            address: accountOrAddress;
            type: "json-rpc";
        } : accountOrAddress>) => Promise<import("./actions/token.js").grantRoles.ReturnType>;
        mint: (parameters: import("./actions/token.js").mint.Parameters<{
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
                    format: (args: import("../ox/TransactionRequest.js").TransactionRequest<bigint, number, string>) => ({
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
                        feeToken?: import("../ox/TokenId.js").TokenIdOrAddress | undefined;
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
                        feeToken?: import("../ox/TokenId.js").TokenIdOrAddress | undefined;
                        data?: undefined;
                        to?: undefined;
                        value?: undefined;
                    }) & {};
                    type: "transactionRequest";
                };
            };
            serializers: {
                transaction: typeof import("./serializers.js").serializeTransaction;
            };
        }, accountOrAddress extends `0x${string}` ? {
            address: accountOrAddress;
            type: "json-rpc";
        } : accountOrAddress>) => Promise<import("./actions/token.js").mint.ReturnType>;
        pause: (parameters: import("./actions/token.js").pause.Parameters<{
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
                    format: (args: import("../ox/TransactionRequest.js").TransactionRequest<bigint, number, string>) => ({
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
                        feeToken?: import("../ox/TokenId.js").TokenIdOrAddress | undefined;
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
                        feeToken?: import("../ox/TokenId.js").TokenIdOrAddress | undefined;
                        data?: undefined;
                        to?: undefined;
                        value?: undefined;
                    }) & {};
                    type: "transactionRequest";
                };
            };
            serializers: {
                transaction: typeof import("./serializers.js").serializeTransaction;
            };
        }, accountOrAddress extends `0x${string}` ? {
            address: accountOrAddress;
            type: "json-rpc";
        } : accountOrAddress>) => Promise<import("./actions/token.js").pause.ReturnType>;
        permit: (parameters: import("./actions/token.js").permit.Parameters<{
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
                    format: (args: import("../ox/TransactionRequest.js").TransactionRequest<bigint, number, string>) => ({
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
                        feeToken?: import("../ox/TokenId.js").TokenIdOrAddress | undefined;
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
                        feeToken?: import("../ox/TokenId.js").TokenIdOrAddress | undefined;
                        data?: undefined;
                        to?: undefined;
                        value?: undefined;
                    }) & {};
                    type: "transactionRequest";
                };
            };
            serializers: {
                transaction: typeof import("./serializers.js").serializeTransaction;
            };
        }, accountOrAddress extends `0x${string}` ? {
            address: accountOrAddress;
            type: "json-rpc";
        } : accountOrAddress>) => Promise<import("./actions/token.js").permit.ReturnType>;
        renounceRoles: (parameters: import("./actions/token.js").renounceRoles.Parameters<{
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
                    format: (args: import("../ox/TransactionRequest.js").TransactionRequest<bigint, number, string>) => ({
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
                        feeToken?: import("../ox/TokenId.js").TokenIdOrAddress | undefined;
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
                        feeToken?: import("../ox/TokenId.js").TokenIdOrAddress | undefined;
                        data?: undefined;
                        to?: undefined;
                        value?: undefined;
                    }) & {};
                    type: "transactionRequest";
                };
            };
            serializers: {
                transaction: typeof import("./serializers.js").serializeTransaction;
            };
        }, accountOrAddress extends `0x${string}` ? {
            address: accountOrAddress;
            type: "json-rpc";
        } : accountOrAddress>) => Promise<import("./actions/token.js").renounceRoles.ReturnType>;
        revokeRoles: (parameters: import("./actions/token.js").revokeRoles.Parameters<{
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
                    format: (args: import("../ox/TransactionRequest.js").TransactionRequest<bigint, number, string>) => ({
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
                        feeToken?: import("../ox/TokenId.js").TokenIdOrAddress | undefined;
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
                        feeToken?: import("../ox/TokenId.js").TokenIdOrAddress | undefined;
                        data?: undefined;
                        to?: undefined;
                        value?: undefined;
                    }) & {};
                    type: "transactionRequest";
                };
            };
            serializers: {
                transaction: typeof import("./serializers.js").serializeTransaction;
            };
        }, accountOrAddress extends `0x${string}` ? {
            address: accountOrAddress;
            type: "json-rpc";
        } : accountOrAddress>) => Promise<import("./actions/token.js").revokeRoles.ReturnType>;
        setSupplyCap: (parameters: import("./actions/token.js").setSupplyCap.Parameters<{
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
                    format: (args: import("../ox/TransactionRequest.js").TransactionRequest<bigint, number, string>) => ({
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
                        feeToken?: import("../ox/TokenId.js").TokenIdOrAddress | undefined;
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
                        feeToken?: import("../ox/TokenId.js").TokenIdOrAddress | undefined;
                        data?: undefined;
                        to?: undefined;
                        value?: undefined;
                    }) & {};
                    type: "transactionRequest";
                };
            };
            serializers: {
                transaction: typeof import("./serializers.js").serializeTransaction;
            };
        }, accountOrAddress extends `0x${string}` ? {
            address: accountOrAddress;
            type: "json-rpc";
        } : accountOrAddress>) => Promise<import("./actions/token.js").setSupplyCap.ReturnType>;
        setRoleAdmin: (parameters: import("./actions/token.js").setRoleAdmin.Parameters<{
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
                    format: (args: import("../ox/TransactionRequest.js").TransactionRequest<bigint, number, string>) => ({
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
                        feeToken?: import("../ox/TokenId.js").TokenIdOrAddress | undefined;
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
                        feeToken?: import("../ox/TokenId.js").TokenIdOrAddress | undefined;
                        data?: undefined;
                        to?: undefined;
                        value?: undefined;
                    }) & {};
                    type: "transactionRequest";
                };
            };
            serializers: {
                transaction: typeof import("./serializers.js").serializeTransaction;
            };
        }, accountOrAddress extends `0x${string}` ? {
            address: accountOrAddress;
            type: "json-rpc";
        } : accountOrAddress>) => Promise<import("./actions/token.js").setRoleAdmin.ReturnType>;
        transfer: (parameters: import("./actions/token.js").transfer.Parameters<{
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
                    format: (args: import("../ox/TransactionRequest.js").TransactionRequest<bigint, number, string>) => ({
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
                        feeToken?: import("../ox/TokenId.js").TokenIdOrAddress | undefined;
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
                        feeToken?: import("../ox/TokenId.js").TokenIdOrAddress | undefined;
                        data?: undefined;
                        to?: undefined;
                        value?: undefined;
                    }) & {};
                    type: "transactionRequest";
                };
            };
            serializers: {
                transaction: typeof import("./serializers.js").serializeTransaction;
            };
        }, accountOrAddress extends `0x${string}` ? {
            address: accountOrAddress;
            type: "json-rpc";
        } : accountOrAddress>) => Promise<import("./actions/token.js").transfer.ReturnType>;
        unpause: (parameters: import("./actions/token.js").unpause.Parameters<{
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
                    format: (args: import("../ox/TransactionRequest.js").TransactionRequest<bigint, number, string>) => ({
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
                        feeToken?: import("../ox/TokenId.js").TokenIdOrAddress | undefined;
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
                        feeToken?: import("../ox/TokenId.js").TokenIdOrAddress | undefined;
                        data?: undefined;
                        to?: undefined;
                        value?: undefined;
                    }) & {};
                    type: "transactionRequest";
                };
            };
            serializers: {
                transaction: typeof import("./serializers.js").serializeTransaction;
            };
        }, accountOrAddress extends `0x${string}` ? {
            address: accountOrAddress;
            type: "json-rpc";
        } : accountOrAddress>) => Promise<import("./actions/token.js").unpause.ReturnType>;
        watchApprove: (parameters: import("./actions/token.js").watchApprove.Parameters) => () => void;
        watchBurn: (parameters: import("./actions/token.js").watchBurn.Parameters) => () => void;
        watchCreate: (parameters: import("./actions/token.js").watchCreate.Parameters) => () => void;
        watchMint: (parameters: import("./actions/token.js").watchMint.Parameters) => () => void;
        watchAdminRole: (parameters: import("./actions/token.js").watchAdminRole.Parameters) => () => void;
        watchRole: (parameters: import("./actions/token.js").watchRole.Parameters) => () => void;
        watchTransfer: (parameters: import("./actions/token.js").watchTransfer.Parameters) => () => void;
    };
}>;
export declare namespace createTempoClient {
    type Parameters<transport extends Transport = Transport, chain extends Chain | undefined = Chain | undefined, accountOrAddress extends Account | Address | undefined = Account | Address | undefined, rpcSchema extends RpcSchema | undefined = undefined> = PartialBy<ClientConfig<transport, chain, accountOrAddress, rpcSchema>, 'transport'>;
}
//# sourceMappingURL=client.d.ts.map