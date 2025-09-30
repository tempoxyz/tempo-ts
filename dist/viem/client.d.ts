import { type Account, type Address, type Chain, type ClientConfig, type RpcSchema, type Transport } from 'viem';
import { tempo } from "../chains.js";
import type { PartialBy } from "../internal/types.js";
import * as actions from "./actions.js";
/**
 * Instantiates a default Tempo client.
 *
 * @example
 * TODO
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
            format: (args: {
                accessList?: readonly {
                    address: import("ox/Address").Address;
                    storageKeys: readonly import("ox/Hex").Hex[];
                }[] | undefined;
                authorizationList?: readonly {
                    address: import("ox/Address").Address;
                    chainId: number;
                    nonce: bigint;
                    r: bigint;
                    s: bigint;
                    yParity: number;
                }[] | undefined;
                blobVersionedHashes?: readonly import("ox/Hex").Hex[];
                blobs?: readonly `0x${string}`[] | undefined;
                chainId?: number | undefined;
                data?: `0x${string}` | undefined;
                input?: `0x${string}` | undefined;
                from?: `0x${string}` | undefined;
                gas?: bigint | undefined;
                gasPrice?: bigint | undefined;
                maxFeePerBlobGas?: bigint | undefined;
                maxFeePerGas?: bigint | undefined;
                maxPriorityFeePerGas?: bigint | undefined;
                nonce?: bigint | undefined;
                to?: `0x${string}` | null | undefined;
                type?: string | undefined;
                value?: bigint | undefined;
                feeToken?: import("../ox/TokenId.js").TokenIdOrAddress | undefined;
            }) => {
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
            } & {};
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
    approveToken: (parameters: actions.approveToken.Parameters<{
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
                format: (args: {
                    accessList?: readonly {
                        address: import("ox/Address").Address;
                        storageKeys: readonly import("ox/Hex").Hex[];
                    }[] | undefined;
                    authorizationList?: readonly {
                        address: import("ox/Address").Address;
                        chainId: number;
                        nonce: bigint;
                        r: bigint;
                        s: bigint;
                        yParity: number;
                    }[] | undefined;
                    blobVersionedHashes?: readonly import("ox/Hex").Hex[];
                    blobs?: readonly `0x${string}`[] | undefined;
                    chainId?: number | undefined;
                    data?: `0x${string}` | undefined;
                    input?: `0x${string}` | undefined;
                    from?: `0x${string}` | undefined;
                    gas?: bigint | undefined;
                    gasPrice?: bigint | undefined;
                    maxFeePerBlobGas?: bigint | undefined;
                    maxFeePerGas?: bigint | undefined;
                    maxPriorityFeePerGas?: bigint | undefined;
                    nonce?: bigint | undefined;
                    to?: `0x${string}` | null | undefined;
                    type?: string | undefined;
                    value?: bigint | undefined;
                    feeToken?: import("../ox/TokenId.js").TokenIdOrAddress | undefined;
                }) => {
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
                } & {};
                type: "transactionRequest";
            };
        };
        serializers: {
            transaction: typeof import("./serializers.js").serializeTransaction;
        };
    }, accountOrAddress extends `0x${string}` ? {
        address: accountOrAddress;
        type: "json-rpc";
    } : accountOrAddress>) => Promise<actions.approveToken.ReturnType>;
    burnBlockedToken: (parameters: actions.burnBlockedToken.Parameters<{
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
                format: (args: {
                    accessList?: readonly {
                        address: import("ox/Address").Address;
                        storageKeys: readonly import("ox/Hex").Hex[];
                    }[] | undefined;
                    authorizationList?: readonly {
                        address: import("ox/Address").Address;
                        chainId: number;
                        nonce: bigint;
                        r: bigint;
                        s: bigint;
                        yParity: number;
                    }[] | undefined;
                    blobVersionedHashes?: readonly import("ox/Hex").Hex[];
                    blobs?: readonly `0x${string}`[] | undefined;
                    chainId?: number | undefined;
                    data?: `0x${string}` | undefined;
                    input?: `0x${string}` | undefined;
                    from?: `0x${string}` | undefined;
                    gas?: bigint | undefined;
                    gasPrice?: bigint | undefined;
                    maxFeePerBlobGas?: bigint | undefined;
                    maxFeePerGas?: bigint | undefined;
                    maxPriorityFeePerGas?: bigint | undefined;
                    nonce?: bigint | undefined;
                    to?: `0x${string}` | null | undefined;
                    type?: string | undefined;
                    value?: bigint | undefined;
                    feeToken?: import("../ox/TokenId.js").TokenIdOrAddress | undefined;
                }) => {
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
                } & {};
                type: "transactionRequest";
            };
        };
        serializers: {
            transaction: typeof import("./serializers.js").serializeTransaction;
        };
    }, accountOrAddress extends `0x${string}` ? {
        address: accountOrAddress;
        type: "json-rpc";
    } : accountOrAddress>) => Promise<actions.burnBlockedToken.ReturnType>;
    burnToken: (parameters: actions.burnToken.Parameters<{
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
                format: (args: {
                    accessList?: readonly {
                        address: import("ox/Address").Address;
                        storageKeys: readonly import("ox/Hex").Hex[];
                    }[] | undefined;
                    authorizationList?: readonly {
                        address: import("ox/Address").Address;
                        chainId: number;
                        nonce: bigint;
                        r: bigint;
                        s: bigint;
                        yParity: number;
                    }[] | undefined;
                    blobVersionedHashes?: readonly import("ox/Hex").Hex[];
                    blobs?: readonly `0x${string}`[] | undefined;
                    chainId?: number | undefined;
                    data?: `0x${string}` | undefined;
                    input?: `0x${string}` | undefined;
                    from?: `0x${string}` | undefined;
                    gas?: bigint | undefined;
                    gasPrice?: bigint | undefined;
                    maxFeePerBlobGas?: bigint | undefined;
                    maxFeePerGas?: bigint | undefined;
                    maxPriorityFeePerGas?: bigint | undefined;
                    nonce?: bigint | undefined;
                    to?: `0x${string}` | null | undefined;
                    type?: string | undefined;
                    value?: bigint | undefined;
                    feeToken?: import("../ox/TokenId.js").TokenIdOrAddress | undefined;
                }) => {
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
                } & {};
                type: "transactionRequest";
            };
        };
        serializers: {
            transaction: typeof import("./serializers.js").serializeTransaction;
        };
    }, accountOrAddress extends `0x${string}` ? {
        address: accountOrAddress;
        type: "json-rpc";
    } : accountOrAddress>) => Promise<actions.burnToken.ReturnType>;
    changeTokenTransferPolicy: (parameters: actions.changeTokenTransferPolicy.Parameters<{
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
                format: (args: {
                    accessList?: readonly {
                        address: import("ox/Address").Address;
                        storageKeys: readonly import("ox/Hex").Hex[];
                    }[] | undefined;
                    authorizationList?: readonly {
                        address: import("ox/Address").Address;
                        chainId: number;
                        nonce: bigint;
                        r: bigint;
                        s: bigint;
                        yParity: number;
                    }[] | undefined;
                    blobVersionedHashes?: readonly import("ox/Hex").Hex[];
                    blobs?: readonly `0x${string}`[] | undefined;
                    chainId?: number | undefined;
                    data?: `0x${string}` | undefined;
                    input?: `0x${string}` | undefined;
                    from?: `0x${string}` | undefined;
                    gas?: bigint | undefined;
                    gasPrice?: bigint | undefined;
                    maxFeePerBlobGas?: bigint | undefined;
                    maxFeePerGas?: bigint | undefined;
                    maxPriorityFeePerGas?: bigint | undefined;
                    nonce?: bigint | undefined;
                    to?: `0x${string}` | null | undefined;
                    type?: string | undefined;
                    value?: bigint | undefined;
                    feeToken?: import("../ox/TokenId.js").TokenIdOrAddress | undefined;
                }) => {
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
                } & {};
                type: "transactionRequest";
            };
        };
        serializers: {
            transaction: typeof import("./serializers.js").serializeTransaction;
        };
    }, accountOrAddress extends `0x${string}` ? {
        address: accountOrAddress;
        type: "json-rpc";
    } : accountOrAddress>) => Promise<actions.changeTokenTransferPolicy.ReturnType>;
    createToken: (parameters: actions.createToken.Parameters<{
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
                format: (args: {
                    accessList?: readonly {
                        address: import("ox/Address").Address;
                        storageKeys: readonly import("ox/Hex").Hex[];
                    }[] | undefined;
                    authorizationList?: readonly {
                        address: import("ox/Address").Address;
                        chainId: number;
                        nonce: bigint;
                        r: bigint;
                        s: bigint;
                        yParity: number;
                    }[] | undefined;
                    blobVersionedHashes?: readonly import("ox/Hex").Hex[];
                    blobs?: readonly `0x${string}`[] | undefined;
                    chainId?: number | undefined;
                    data?: `0x${string}` | undefined;
                    input?: `0x${string}` | undefined;
                    from?: `0x${string}` | undefined;
                    gas?: bigint | undefined;
                    gasPrice?: bigint | undefined;
                    maxFeePerBlobGas?: bigint | undefined;
                    maxFeePerGas?: bigint | undefined;
                    maxPriorityFeePerGas?: bigint | undefined;
                    nonce?: bigint | undefined;
                    to?: `0x${string}` | null | undefined;
                    type?: string | undefined;
                    value?: bigint | undefined;
                    feeToken?: import("../ox/TokenId.js").TokenIdOrAddress | undefined;
                }) => {
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
                } & {};
                type: "transactionRequest";
            };
        };
        serializers: {
            transaction: typeof import("./serializers.js").serializeTransaction;
        };
    }, accountOrAddress extends `0x${string}` ? {
        address: accountOrAddress;
        type: "json-rpc";
    } : accountOrAddress>) => Promise<actions.createToken.ReturnType>;
    getTokenAllowance: (parameters: actions.getTokenAllowance.Parameters) => Promise<actions.getTokenAllowance.ReturnType>;
    getTokenBalance: (...parameters: (accountOrAddress extends `0x${string}` ? {
        address: accountOrAddress;
        type: "json-rpc";
    } : accountOrAddress) extends infer T ? T extends (accountOrAddress extends `0x${string}` ? {
        address: accountOrAddress;
        type: "json-rpc";
    } : accountOrAddress) ? T extends Account ? [] | [actions.getTokenBalance.Parameters<Account & (accountOrAddress extends `0x${string}` ? {
        address: accountOrAddress;
        type: "json-rpc";
    } : accountOrAddress)>] : [actions.getTokenBalance.Parameters<accountOrAddress extends `0x${string}` ? {
        address: accountOrAddress;
        type: "json-rpc";
    } : accountOrAddress>] : never : never) => Promise<actions.getTokenBalance.ReturnType>;
    getTokenMetadata: (parameters: actions.getTokenMetadata.Parameters) => Promise<actions.getTokenMetadata.ReturnType>;
    getUserToken: (...parameters: (accountOrAddress extends `0x${string}` ? {
        address: accountOrAddress;
        type: "json-rpc";
    } : accountOrAddress) extends infer T ? T extends (accountOrAddress extends `0x${string}` ? {
        address: accountOrAddress;
        type: "json-rpc";
    } : accountOrAddress) ? T extends Account ? [] | [actions.getUserToken.Parameters<Account & (accountOrAddress extends `0x${string}` ? {
        address: accountOrAddress;
        type: "json-rpc";
    } : accountOrAddress)>] : [actions.getUserToken.Parameters<accountOrAddress extends `0x${string}` ? {
        address: accountOrAddress;
        type: "json-rpc";
    } : accountOrAddress>] : never : never) => Promise<actions.getUserToken.ReturnType>;
    grantTokenRoles: (parameters: actions.grantTokenRoles.Parameters<{
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
                format: (args: {
                    accessList?: readonly {
                        address: import("ox/Address").Address;
                        storageKeys: readonly import("ox/Hex").Hex[];
                    }[] | undefined;
                    authorizationList?: readonly {
                        address: import("ox/Address").Address;
                        chainId: number;
                        nonce: bigint;
                        r: bigint;
                        s: bigint;
                        yParity: number;
                    }[] | undefined;
                    blobVersionedHashes?: readonly import("ox/Hex").Hex[];
                    blobs?: readonly `0x${string}`[] | undefined;
                    chainId?: number | undefined;
                    data?: `0x${string}` | undefined;
                    input?: `0x${string}` | undefined;
                    from?: `0x${string}` | undefined;
                    gas?: bigint | undefined;
                    gasPrice?: bigint | undefined;
                    maxFeePerBlobGas?: bigint | undefined;
                    maxFeePerGas?: bigint | undefined;
                    maxPriorityFeePerGas?: bigint | undefined;
                    nonce?: bigint | undefined;
                    to?: `0x${string}` | null | undefined;
                    type?: string | undefined;
                    value?: bigint | undefined;
                    feeToken?: import("../ox/TokenId.js").TokenIdOrAddress | undefined;
                }) => {
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
                } & {};
                type: "transactionRequest";
            };
        };
        serializers: {
            transaction: typeof import("./serializers.js").serializeTransaction;
        };
    }, accountOrAddress extends `0x${string}` ? {
        address: accountOrAddress;
        type: "json-rpc";
    } : accountOrAddress>) => Promise<actions.grantTokenRoles.ReturnType>;
    mintToken: (parameters: actions.mintToken.Parameters<{
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
                format: (args: {
                    accessList?: readonly {
                        address: import("ox/Address").Address;
                        storageKeys: readonly import("ox/Hex").Hex[];
                    }[] | undefined;
                    authorizationList?: readonly {
                        address: import("ox/Address").Address;
                        chainId: number;
                        nonce: bigint;
                        r: bigint;
                        s: bigint;
                        yParity: number;
                    }[] | undefined;
                    blobVersionedHashes?: readonly import("ox/Hex").Hex[];
                    blobs?: readonly `0x${string}`[] | undefined;
                    chainId?: number | undefined;
                    data?: `0x${string}` | undefined;
                    input?: `0x${string}` | undefined;
                    from?: `0x${string}` | undefined;
                    gas?: bigint | undefined;
                    gasPrice?: bigint | undefined;
                    maxFeePerBlobGas?: bigint | undefined;
                    maxFeePerGas?: bigint | undefined;
                    maxPriorityFeePerGas?: bigint | undefined;
                    nonce?: bigint | undefined;
                    to?: `0x${string}` | null | undefined;
                    type?: string | undefined;
                    value?: bigint | undefined;
                    feeToken?: import("../ox/TokenId.js").TokenIdOrAddress | undefined;
                }) => {
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
                } & {};
                type: "transactionRequest";
            };
        };
        serializers: {
            transaction: typeof import("./serializers.js").serializeTransaction;
        };
    }, accountOrAddress extends `0x${string}` ? {
        address: accountOrAddress;
        type: "json-rpc";
    } : accountOrAddress>) => Promise<actions.mintToken.ReturnType>;
    pauseToken: (parameters: actions.pauseToken.Parameters<{
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
                format: (args: {
                    accessList?: readonly {
                        address: import("ox/Address").Address;
                        storageKeys: readonly import("ox/Hex").Hex[];
                    }[] | undefined;
                    authorizationList?: readonly {
                        address: import("ox/Address").Address;
                        chainId: number;
                        nonce: bigint;
                        r: bigint;
                        s: bigint;
                        yParity: number;
                    }[] | undefined;
                    blobVersionedHashes?: readonly import("ox/Hex").Hex[];
                    blobs?: readonly `0x${string}`[] | undefined;
                    chainId?: number | undefined;
                    data?: `0x${string}` | undefined;
                    input?: `0x${string}` | undefined;
                    from?: `0x${string}` | undefined;
                    gas?: bigint | undefined;
                    gasPrice?: bigint | undefined;
                    maxFeePerBlobGas?: bigint | undefined;
                    maxFeePerGas?: bigint | undefined;
                    maxPriorityFeePerGas?: bigint | undefined;
                    nonce?: bigint | undefined;
                    to?: `0x${string}` | null | undefined;
                    type?: string | undefined;
                    value?: bigint | undefined;
                    feeToken?: import("../ox/TokenId.js").TokenIdOrAddress | undefined;
                }) => {
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
                } & {};
                type: "transactionRequest";
            };
        };
        serializers: {
            transaction: typeof import("./serializers.js").serializeTransaction;
        };
    }, accountOrAddress extends `0x${string}` ? {
        address: accountOrAddress;
        type: "json-rpc";
    } : accountOrAddress>) => Promise<actions.pauseToken.ReturnType>;
    permitToken: (parameters: actions.permitToken.Parameters<{
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
                format: (args: {
                    accessList?: readonly {
                        address: import("ox/Address").Address;
                        storageKeys: readonly import("ox/Hex").Hex[];
                    }[] | undefined;
                    authorizationList?: readonly {
                        address: import("ox/Address").Address;
                        chainId: number;
                        nonce: bigint;
                        r: bigint;
                        s: bigint;
                        yParity: number;
                    }[] | undefined;
                    blobVersionedHashes?: readonly import("ox/Hex").Hex[];
                    blobs?: readonly `0x${string}`[] | undefined;
                    chainId?: number | undefined;
                    data?: `0x${string}` | undefined;
                    input?: `0x${string}` | undefined;
                    from?: `0x${string}` | undefined;
                    gas?: bigint | undefined;
                    gasPrice?: bigint | undefined;
                    maxFeePerBlobGas?: bigint | undefined;
                    maxFeePerGas?: bigint | undefined;
                    maxPriorityFeePerGas?: bigint | undefined;
                    nonce?: bigint | undefined;
                    to?: `0x${string}` | null | undefined;
                    type?: string | undefined;
                    value?: bigint | undefined;
                    feeToken?: import("../ox/TokenId.js").TokenIdOrAddress | undefined;
                }) => {
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
                } & {};
                type: "transactionRequest";
            };
        };
        serializers: {
            transaction: typeof import("./serializers.js").serializeTransaction;
        };
    }, accountOrAddress extends `0x${string}` ? {
        address: accountOrAddress;
        type: "json-rpc";
    } : accountOrAddress>) => Promise<actions.permitToken.ReturnType>;
    renounceTokenRoles: (parameters: actions.renounceTokenRoles.Parameters<{
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
                format: (args: {
                    accessList?: readonly {
                        address: import("ox/Address").Address;
                        storageKeys: readonly import("ox/Hex").Hex[];
                    }[] | undefined;
                    authorizationList?: readonly {
                        address: import("ox/Address").Address;
                        chainId: number;
                        nonce: bigint;
                        r: bigint;
                        s: bigint;
                        yParity: number;
                    }[] | undefined;
                    blobVersionedHashes?: readonly import("ox/Hex").Hex[];
                    blobs?: readonly `0x${string}`[] | undefined;
                    chainId?: number | undefined;
                    data?: `0x${string}` | undefined;
                    input?: `0x${string}` | undefined;
                    from?: `0x${string}` | undefined;
                    gas?: bigint | undefined;
                    gasPrice?: bigint | undefined;
                    maxFeePerBlobGas?: bigint | undefined;
                    maxFeePerGas?: bigint | undefined;
                    maxPriorityFeePerGas?: bigint | undefined;
                    nonce?: bigint | undefined;
                    to?: `0x${string}` | null | undefined;
                    type?: string | undefined;
                    value?: bigint | undefined;
                    feeToken?: import("../ox/TokenId.js").TokenIdOrAddress | undefined;
                }) => {
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
                } & {};
                type: "transactionRequest";
            };
        };
        serializers: {
            transaction: typeof import("./serializers.js").serializeTransaction;
        };
    }, accountOrAddress extends `0x${string}` ? {
        address: accountOrAddress;
        type: "json-rpc";
    } : accountOrAddress>) => Promise<actions.renounceTokenRoles.ReturnType>;
    revokeTokenRoles: (parameters: actions.revokeTokenRoles.Parameters<{
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
                format: (args: {
                    accessList?: readonly {
                        address: import("ox/Address").Address;
                        storageKeys: readonly import("ox/Hex").Hex[];
                    }[] | undefined;
                    authorizationList?: readonly {
                        address: import("ox/Address").Address;
                        chainId: number;
                        nonce: bigint;
                        r: bigint;
                        s: bigint;
                        yParity: number;
                    }[] | undefined;
                    blobVersionedHashes?: readonly import("ox/Hex").Hex[];
                    blobs?: readonly `0x${string}`[] | undefined;
                    chainId?: number | undefined;
                    data?: `0x${string}` | undefined;
                    input?: `0x${string}` | undefined;
                    from?: `0x${string}` | undefined;
                    gas?: bigint | undefined;
                    gasPrice?: bigint | undefined;
                    maxFeePerBlobGas?: bigint | undefined;
                    maxFeePerGas?: bigint | undefined;
                    maxPriorityFeePerGas?: bigint | undefined;
                    nonce?: bigint | undefined;
                    to?: `0x${string}` | null | undefined;
                    type?: string | undefined;
                    value?: bigint | undefined;
                    feeToken?: import("../ox/TokenId.js").TokenIdOrAddress | undefined;
                }) => {
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
                } & {};
                type: "transactionRequest";
            };
        };
        serializers: {
            transaction: typeof import("./serializers.js").serializeTransaction;
        };
    }, accountOrAddress extends `0x${string}` ? {
        address: accountOrAddress;
        type: "json-rpc";
    } : accountOrAddress>) => Promise<actions.revokeTokenRoles.ReturnType>;
    setTokenSupplyCap: (parameters: actions.setTokenSupplyCap.Parameters<{
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
                format: (args: {
                    accessList?: readonly {
                        address: import("ox/Address").Address;
                        storageKeys: readonly import("ox/Hex").Hex[];
                    }[] | undefined;
                    authorizationList?: readonly {
                        address: import("ox/Address").Address;
                        chainId: number;
                        nonce: bigint;
                        r: bigint;
                        s: bigint;
                        yParity: number;
                    }[] | undefined;
                    blobVersionedHashes?: readonly import("ox/Hex").Hex[];
                    blobs?: readonly `0x${string}`[] | undefined;
                    chainId?: number | undefined;
                    data?: `0x${string}` | undefined;
                    input?: `0x${string}` | undefined;
                    from?: `0x${string}` | undefined;
                    gas?: bigint | undefined;
                    gasPrice?: bigint | undefined;
                    maxFeePerBlobGas?: bigint | undefined;
                    maxFeePerGas?: bigint | undefined;
                    maxPriorityFeePerGas?: bigint | undefined;
                    nonce?: bigint | undefined;
                    to?: `0x${string}` | null | undefined;
                    type?: string | undefined;
                    value?: bigint | undefined;
                    feeToken?: import("../ox/TokenId.js").TokenIdOrAddress | undefined;
                }) => {
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
                } & {};
                type: "transactionRequest";
            };
        };
        serializers: {
            transaction: typeof import("./serializers.js").serializeTransaction;
        };
    }, accountOrAddress extends `0x${string}` ? {
        address: accountOrAddress;
        type: "json-rpc";
    } : accountOrAddress>) => Promise<actions.setTokenSupplyCap.ReturnType>;
    setTokenRoleAdmin: (parameters: actions.setTokenRoleAdmin.Parameters<{
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
                format: (args: {
                    accessList?: readonly {
                        address: import("ox/Address").Address;
                        storageKeys: readonly import("ox/Hex").Hex[];
                    }[] | undefined;
                    authorizationList?: readonly {
                        address: import("ox/Address").Address;
                        chainId: number;
                        nonce: bigint;
                        r: bigint;
                        s: bigint;
                        yParity: number;
                    }[] | undefined;
                    blobVersionedHashes?: readonly import("ox/Hex").Hex[];
                    blobs?: readonly `0x${string}`[] | undefined;
                    chainId?: number | undefined;
                    data?: `0x${string}` | undefined;
                    input?: `0x${string}` | undefined;
                    from?: `0x${string}` | undefined;
                    gas?: bigint | undefined;
                    gasPrice?: bigint | undefined;
                    maxFeePerBlobGas?: bigint | undefined;
                    maxFeePerGas?: bigint | undefined;
                    maxPriorityFeePerGas?: bigint | undefined;
                    nonce?: bigint | undefined;
                    to?: `0x${string}` | null | undefined;
                    type?: string | undefined;
                    value?: bigint | undefined;
                    feeToken?: import("../ox/TokenId.js").TokenIdOrAddress | undefined;
                }) => {
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
                } & {};
                type: "transactionRequest";
            };
        };
        serializers: {
            transaction: typeof import("./serializers.js").serializeTransaction;
        };
    }, accountOrAddress extends `0x${string}` ? {
        address: accountOrAddress;
        type: "json-rpc";
    } : accountOrAddress>) => Promise<actions.setTokenRoleAdmin.ReturnType>;
    setUserToken: (parameters: actions.setUserToken.Parameters<{
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
                format: (args: {
                    accessList?: readonly {
                        address: import("ox/Address").Address;
                        storageKeys: readonly import("ox/Hex").Hex[];
                    }[] | undefined;
                    authorizationList?: readonly {
                        address: import("ox/Address").Address;
                        chainId: number;
                        nonce: bigint;
                        r: bigint;
                        s: bigint;
                        yParity: number;
                    }[] | undefined;
                    blobVersionedHashes?: readonly import("ox/Hex").Hex[];
                    blobs?: readonly `0x${string}`[] | undefined;
                    chainId?: number | undefined;
                    data?: `0x${string}` | undefined;
                    input?: `0x${string}` | undefined;
                    from?: `0x${string}` | undefined;
                    gas?: bigint | undefined;
                    gasPrice?: bigint | undefined;
                    maxFeePerBlobGas?: bigint | undefined;
                    maxFeePerGas?: bigint | undefined;
                    maxPriorityFeePerGas?: bigint | undefined;
                    nonce?: bigint | undefined;
                    to?: `0x${string}` | null | undefined;
                    type?: string | undefined;
                    value?: bigint | undefined;
                    feeToken?: import("../ox/TokenId.js").TokenIdOrAddress | undefined;
                }) => {
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
                } & {};
                type: "transactionRequest";
            };
        };
        serializers: {
            transaction: typeof import("./serializers.js").serializeTransaction;
        };
    }, accountOrAddress extends `0x${string}` ? {
        address: accountOrAddress;
        type: "json-rpc";
    } : accountOrAddress>) => Promise<actions.setUserToken.ReturnType>;
    transferToken: (parameters: actions.transferToken.Parameters<{
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
                format: (args: {
                    accessList?: readonly {
                        address: import("ox/Address").Address;
                        storageKeys: readonly import("ox/Hex").Hex[];
                    }[] | undefined;
                    authorizationList?: readonly {
                        address: import("ox/Address").Address;
                        chainId: number;
                        nonce: bigint;
                        r: bigint;
                        s: bigint;
                        yParity: number;
                    }[] | undefined;
                    blobVersionedHashes?: readonly import("ox/Hex").Hex[];
                    blobs?: readonly `0x${string}`[] | undefined;
                    chainId?: number | undefined;
                    data?: `0x${string}` | undefined;
                    input?: `0x${string}` | undefined;
                    from?: `0x${string}` | undefined;
                    gas?: bigint | undefined;
                    gasPrice?: bigint | undefined;
                    maxFeePerBlobGas?: bigint | undefined;
                    maxFeePerGas?: bigint | undefined;
                    maxPriorityFeePerGas?: bigint | undefined;
                    nonce?: bigint | undefined;
                    to?: `0x${string}` | null | undefined;
                    type?: string | undefined;
                    value?: bigint | undefined;
                    feeToken?: import("../ox/TokenId.js").TokenIdOrAddress | undefined;
                }) => {
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
                } & {};
                type: "transactionRequest";
            };
        };
        serializers: {
            transaction: typeof import("./serializers.js").serializeTransaction;
        };
    }, accountOrAddress extends `0x${string}` ? {
        address: accountOrAddress;
        type: "json-rpc";
    } : accountOrAddress>) => Promise<actions.transferToken.ReturnType>;
    unpauseToken: (parameters: actions.unpauseToken.Parameters<{
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
                format: (args: {
                    accessList?: readonly {
                        address: import("ox/Address").Address;
                        storageKeys: readonly import("ox/Hex").Hex[];
                    }[] | undefined;
                    authorizationList?: readonly {
                        address: import("ox/Address").Address;
                        chainId: number;
                        nonce: bigint;
                        r: bigint;
                        s: bigint;
                        yParity: number;
                    }[] | undefined;
                    blobVersionedHashes?: readonly import("ox/Hex").Hex[];
                    blobs?: readonly `0x${string}`[] | undefined;
                    chainId?: number | undefined;
                    data?: `0x${string}` | undefined;
                    input?: `0x${string}` | undefined;
                    from?: `0x${string}` | undefined;
                    gas?: bigint | undefined;
                    gasPrice?: bigint | undefined;
                    maxFeePerBlobGas?: bigint | undefined;
                    maxFeePerGas?: bigint | undefined;
                    maxPriorityFeePerGas?: bigint | undefined;
                    nonce?: bigint | undefined;
                    to?: `0x${string}` | null | undefined;
                    type?: string | undefined;
                    value?: bigint | undefined;
                    feeToken?: import("../ox/TokenId.js").TokenIdOrAddress | undefined;
                }) => {
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
                } & {};
                type: "transactionRequest";
            };
        };
        serializers: {
            transaction: typeof import("./serializers.js").serializeTransaction;
        };
    }, accountOrAddress extends `0x${string}` ? {
        address: accountOrAddress;
        type: "json-rpc";
    } : accountOrAddress>) => Promise<actions.unpauseToken.ReturnType>;
    watchApproveToken: (parameters: actions.watchApproveToken.Parameters) => () => void;
    watchBurnToken: (parameters: actions.watchBurnToken.Parameters) => () => void;
    watchCreateToken: (parameters: actions.watchCreateToken.Parameters) => () => void;
    watchMintToken: (parameters: actions.watchMintToken.Parameters) => () => void;
    watchSetUserToken: (parameters: actions.watchSetUserToken.Parameters) => () => void;
    watchTokenAdminRole: (parameters: actions.watchTokenAdminRole.Parameters) => () => void;
    watchTokenRole: (parameters: actions.watchTokenRole.Parameters) => () => void;
    watchTransferToken: (parameters: actions.watchTransferToken.Parameters) => () => void;
}>;
export declare namespace createTempoClient {
    type Parameters<transport extends Transport = Transport, chain extends Chain | undefined = Chain | undefined, accountOrAddress extends Account | Address | undefined = Account | Address | undefined, rpcSchema extends RpcSchema | undefined = undefined> = PartialBy<ClientConfig<transport, chain, accountOrAddress, rpcSchema>, 'transport'>;
}
//# sourceMappingURL=client.d.ts.map