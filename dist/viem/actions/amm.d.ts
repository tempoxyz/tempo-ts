import type { Account, Address, Chain, Client, ExtractAbiItem, GetEventArgs, Hex, ReadContractParameters, ReadContractReturnType, Transport, Log as viem_Log, WatchContractEventParameters, WriteContractParameters, WriteContractReturnType } from 'viem';
import type { Compute, UnionOmit } from "../../internal/types.js";
import { TokenId } from "../../ox/index.js";
import { feeAmmAbi } from "../abis.js";
/**
 * Gets the pool ID for a token pair.
 *
 * @example
 * ```ts
 * import { createClient, http } from 'viem'
 * import { tempo } from 'tempo/chains'
 * import * as actions from 'tempo/viem/actions'
 *
 * const client = createClient({
 *   chain: tempo,
 *   transport: http(),
 * })
 *
 * const poolId = await actions.amm.getPoolId(client, {
 *   userToken: '0x...',
 *   validatorToken: '0x...',
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The pool ID.
 */
export declare function getPoolId<chain extends Chain | undefined>(client: Client<Transport, chain>, parameters: getPoolId.Parameters): Promise<getPoolId.ReturnType>;
export declare namespace getPoolId {
    type Parameters = UnionOmit<ReadContractParameters<never, never, never>, 'abi' | 'address' | 'functionName' | 'args'> & {
        /** Address or ID of the user token. */
        userToken: TokenId.TokenIdOrAddress;
        /** Address or ID of the validator token. */
        validatorToken: TokenId.TokenIdOrAddress;
    };
    type ReturnType = ReadContractReturnType<typeof feeAmmAbi, 'getPoolId', never>;
}
/**
 * Gets the reserves for a liquidity pool.
 *
 * @example
 * ```ts
 * import { createClient, http } from 'viem'
 * import { tempo } from 'tempo/chains'
 * import * as actions from 'tempo/viem/actions'
 *
 * const client = createClient({
 *   chain: tempo,
 *   transport: http(),
 * })
 *
 * const pool = await actions.amm.getPool(client, {
 *   userToken: '0x...',
 *   validatorToken: '0x...',
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The pool reserves.
 */
export declare function getPool<chain extends Chain | undefined>(client: Client<Transport, chain>, parameters: getPool.Parameters): Promise<getPool.ReturnType>;
export declare namespace getPool {
    type Parameters = UnionOmit<ReadContractParameters<never, never, never>, 'abi' | 'address' | 'functionName' | 'args'> & {
        /** Address or ID of the user token. */
        userToken: TokenId.TokenIdOrAddress;
        /** Address or ID of the validator token. */
        validatorToken: TokenId.TokenIdOrAddress;
    };
    type ReturnType = Compute<{
        /** Reserve of user token. */
        reserveUserToken: bigint;
        /** Reserve of validator token. */
        reserveValidatorToken: bigint;
    }>;
}
/**
 * Gets the total supply of LP tokens for a pool.
 *
 * @example
 * ```ts
 * import { createClient, http } from 'viem'
 * import { tempo } from 'tempo/chains'
 * import * as actions from 'tempo/viem/actions'
 *
 * const client = createClient({
 *   chain: tempo,
 *   transport: http(),
 * })
 *
 * const poolId = await actions.amm.getPoolId(client, {
 *   userToken: '0x...',
 *   validatorToken: '0x...',
 * })
 *
 * const totalSupply = await actions.amm.getTotalSupply(client, { poolId })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The total supply of LP tokens.
 */
export declare function getTotalSupply<chain extends Chain | undefined>(client: Client<Transport, chain>, parameters: getTotalSupply.Parameters): Promise<getTotalSupply.ReturnType>;
export declare namespace getTotalSupply {
    type Parameters = UnionOmit<ReadContractParameters<never, never, never>, 'abi' | 'address' | 'functionName' | 'args'> & {
        /** Pool ID. */
        poolId: Hex;
    };
    type ReturnType = ReadContractReturnType<typeof feeAmmAbi, 'totalSupply', never>;
}
/**
 * Gets the LP token balance for an account in a specific pool.
 *
 * @example
 * ```ts
 * import { createClient, http } from 'viem'
 * import { tempo } from 'tempo/chains'
 * import * as actions from 'tempo/viem/actions'
 *
 * const client = createClient({
 *   chain: tempo,
 *   transport: http(),
 * })
 *
 * const poolId = await actions.amm.getPoolId(client, {
 *   userToken: '0x...',
 *   validatorToken: '0x...',
 * })
 *
 * const balance = await actions.amm.getLiquidityBalance(client, {
 *   poolId,
 *   address: '0x...',
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The LP token balance.
 */
export declare function getLiquidityBalance<chain extends Chain | undefined>(client: Client<Transport, chain>, parameters: getLiquidityBalance.Parameters): Promise<getLiquidityBalance.ReturnType>;
export declare namespace getLiquidityBalance {
    type Parameters = UnionOmit<ReadContractParameters<never, never, never>, 'abi' | 'address' | 'functionName' | 'args'> & {
        /** Address to check balance for. */
        address: Address;
        /** Pool ID. */
        poolId: Hex;
    };
    type ReturnType = ReadContractReturnType<typeof feeAmmAbi, 'liquidityBalances', never>;
}
/**
 * Performs a rebalance swap from validator token to user token.
 *
 * @example
 * ```ts
 * import { createClient, http } from 'viem'
 * import { tempo } from 'tempo/chains'
 * import * as actions from 'tempo/viem/actions'
 * import { privateKeyToAccount } from 'viem/accounts'
 *
 * const client = createClient({
 *   account: privateKeyToAccount('0x...'),
 *   chain: tempo,
 *   transport: http(),
 * })
 *
 * const hash = await actions.amm.rebalanceSwap(client, {
 *   userToken: '0x...',
 *   validatorToken: '0x...',
 *   amountOut: 100n,
 *   to: '0x...',
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The transaction hash.
 */
export declare function rebalanceSwap<chain extends Chain | undefined, account extends Account | undefined>(client: Client<Transport, chain, account>, parameters: rebalanceSwap.Parameters<chain, account>): Promise<rebalanceSwap.ReturnType>;
export declare namespace rebalanceSwap {
    type Parameters<chain extends Chain | undefined = Chain | undefined, account extends Account | undefined = Account | undefined> = UnionOmit<WriteContractParameters<never, never, never, chain, account>, 'abi' | 'address' | 'functionName' | 'args'> & {
        /** Amount of user token to receive. */
        amountOut: bigint;
        /** Address to send the user token to. */
        to: Address;
        /** Address or ID of the user token. */
        userToken: TokenId.TokenIdOrAddress;
        /** Address or ID of the validator token. */
        validatorToken: TokenId.TokenIdOrAddress;
    };
    type ReturnType = WriteContractReturnType;
}
/**
 * Adds liquidity to a pool.
 *
 * @example
 * ```ts
 * import { createClient, http } from 'viem'
 * import { tempo } from 'tempo/chains'
 * import * as actions from 'tempo/viem/actions'
 * import { privateKeyToAccount } from 'viem/accounts'
 *
 * const client = createClient({
 *   account: privateKeyToAccount('0x...'),
 *   chain: tempo,
 *   transport: http(),
 * })
 *
 * const hash = await actions.amm.mint(client, {
 *   userToken: {
 *     address: '0x...',
 *     amount: 100n,
 *   },
 *   validatorToken: {
 *     address: '0x...',
 *     amount: 100n,
 *   },
 *   to: '0x...',
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The transaction hash.
 */
export declare function mint<chain extends Chain | undefined, account extends Account | undefined>(client: Client<Transport, chain, account>, parameters: mint.Parameters<chain, account>): Promise<mint.ReturnType>;
export declare namespace mint {
    type Parameters<chain extends Chain | undefined = Chain | undefined, account extends Account | undefined = Account | undefined> = UnionOmit<WriteContractParameters<never, never, never, chain, account>, 'abi' | 'address' | 'functionName' | 'args'> & {
        /** Address to mint LP tokens to. */
        to: Address;
        /** User token address and amount. */
        userToken: {
            /** Address or ID of the user token. */
            address: TokenId.TokenIdOrAddress;
            /** Amount of user token to add. */
            amount: bigint;
        };
        /** Validator token address and amount. */
        validatorToken: {
            /** Address or ID of the validator token. */
            address: TokenId.TokenIdOrAddress;
            /** Amount of validator token to add. */
            amount: bigint;
        };
    };
    type ReturnType = WriteContractReturnType;
}
/**
 * Removes liquidity from a pool.
 *
 * @example
 * ```ts
 * import { createClient, http } from 'viem'
 * import { tempo } from 'tempo/chains'
 * import * as actions from 'tempo/viem/actions'
 * import { privateKeyToAccount } from 'viem/accounts'
 *
 * const client = createClient({
 *   account: privateKeyToAccount('0x...'),
 *   chain: tempo,
 *   transport: http(),
 * })
 *
 * const hash = await actions.amm.burn(client, {
 *   userToken: '0x...',
 *   validatorToken: '0x...',
 *   liquidity: 50n,
 *   to: '0x...',
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The transaction hash.
 */
export declare function burn<chain extends Chain | undefined, account extends Account | undefined>(client: Client<Transport, chain, account>, parameters: burn.Parameters<chain, account>): Promise<burn.ReturnType>;
export declare namespace burn {
    type Parameters<chain extends Chain | undefined = Chain | undefined, account extends Account | undefined = Account | undefined> = UnionOmit<WriteContractParameters<never, never, never, chain, account>, 'abi' | 'address' | 'functionName' | 'args'> & {
        /** Amount of LP tokens to burn. */
        liquidity: bigint;
        /** Address to send tokens to. */
        to: Address;
        /** Address or ID of the user token. */
        userToken: TokenId.TokenIdOrAddress;
        /** Address or ID of the validator token. */
        validatorToken: TokenId.TokenIdOrAddress;
    };
    type ReturnType = WriteContractReturnType;
}
/**
 * Watches for rebalance swap events.
 *
 * @example
 * ```ts
 * import { createClient, http } from 'viem'
 * import { tempo } from 'tempo/chains'
 * import * as actions from 'tempo/viem/actions'
 *
 * const client = createClient({
 *   chain: tempo,
 *   transport: http(),
 * })
 *
 * const unwatch = actions.amm.watchRebalanceSwap(client, {
 *   onRebalanceSwap: (args, log) => {
 *     console.log('Rebalance swap:', args)
 *   },
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns A function to unsubscribe from the event.
 */
export declare function watchRebalanceSwap<chain extends Chain | undefined, account extends Account | undefined>(client: Client<Transport, chain, account>, parameters: watchRebalanceSwap.Parameters): import("viem").WatchContractEventReturnType;
export declare namespace watchRebalanceSwap {
    type Args = GetEventArgs<typeof feeAmmAbi, 'RebalanceSwap', {
        IndexedOnly: false;
        Required: true;
    }>;
    type Log = viem_Log<bigint, number, false, ExtractAbiItem<typeof feeAmmAbi, 'RebalanceSwap'>, true>;
    type Parameters = UnionOmit<WatchContractEventParameters<typeof feeAmmAbi, 'RebalanceSwap', true>, 'abi' | 'address' | 'batch' | 'eventName' | 'onLogs' | 'strict'> & {
        /** Callback to invoke when a rebalance swap occurs. */
        onRebalanceSwap: (args: Args, log: Log) => void;
        /** Address or ID of the user token to filter events. */
        userToken?: TokenId.TokenIdOrAddress | undefined;
        /** Address or ID of the validator token to filter events. */
        validatorToken?: TokenId.TokenIdOrAddress | undefined;
    };
}
/**
 * Watches for fee swap events.
 *
 * @example
 * ```ts
 * import { createClient, http } from 'viem'
 * import { tempo } from 'tempo/chains'
 * import * as actions from 'tempo/viem/actions'
 *
 * const client = createClient({
 *   chain: tempo,
 *   transport: http(),
 * })
 *
 * const unwatch = actions.amm.watchFeeSwap(client, {
 *   onFeeSwap: (args, log) => {
 *     console.log('Fee swap:', args)
 *   },
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns A function to unsubscribe from the event.
 */
export declare function watchFeeSwap<chain extends Chain | undefined, account extends Account | undefined>(client: Client<Transport, chain, account>, parameters: watchFeeSwap.Parameters): import("viem").WatchContractEventReturnType;
export declare namespace watchFeeSwap {
    type Args = GetEventArgs<typeof feeAmmAbi, 'FeeSwap', {
        IndexedOnly: false;
        Required: true;
    }>;
    type Log = viem_Log<bigint, number, false, ExtractAbiItem<typeof feeAmmAbi, 'FeeSwap'>, true>;
    type Parameters = UnionOmit<WatchContractEventParameters<typeof feeAmmAbi, 'FeeSwap', true>, 'abi' | 'address' | 'batch' | 'eventName' | 'onLogs' | 'strict'> & {
        /** Callback to invoke when a fee swap occurs. */
        onFeeSwap: (args: Args, log: Log) => void;
        /** Address or ID of the user token to filter events. */
        userToken?: TokenId.TokenIdOrAddress | undefined;
        /** Address or ID of the validator token to filter events. */
        validatorToken?: TokenId.TokenIdOrAddress | undefined;
    };
}
/**
 * Watches for liquidity mint events.
 *
 * @example
 * ```ts
 * import { createClient, http } from 'viem'
 * import { tempo } from 'tempo/chains'
 * import * as actions from 'tempo/viem/actions'
 *
 * const client = createClient({
 *   chain: tempo,
 *   transport: http(),
 * })
 *
 * const unwatch = actions.amm.watchMint(client, {
 *   onMint: (args, log) => {
 *     console.log('Liquidity added:', args)
 *   },
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns A function to unsubscribe from the event.
 */
export declare function watchMint<chain extends Chain | undefined, account extends Account | undefined>(client: Client<Transport, chain, account>, parameters: watchMint.Parameters): import("viem").WatchContractEventReturnType;
export declare namespace watchMint {
    type Args = {
        liquidity: bigint;
        sender: Address;
        userToken: {
            address: Address;
            amount: bigint;
        };
        validatorToken: {
            address: Address;
            amount: bigint;
        };
    };
    type Log = viem_Log<bigint, number, false, ExtractAbiItem<typeof feeAmmAbi, 'Mint'>, true>;
    type Parameters = UnionOmit<WatchContractEventParameters<typeof feeAmmAbi, 'Mint', true>, 'abi' | 'address' | 'batch' | 'eventName' | 'onLogs' | 'strict'> & {
        /** Callback to invoke when liquidity is added. */
        onMint: (args: Args, log: Log) => void;
        /** Address or ID of the sender to filter events. */
        sender?: TokenId.TokenIdOrAddress | undefined;
        /** Address or ID of the user token to filter events. */
        userToken?: TokenId.TokenIdOrAddress | undefined;
        /** Address or ID of the validator token to filter events. */
        validatorToken?: TokenId.TokenIdOrAddress | undefined;
    };
}
/**
 * Watches for liquidity burn events.
 *
 * @example
 * ```ts
 * import { createClient, http } from 'viem'
 * import { tempo } from 'tempo/chains'
 * import * as actions from 'tempo/viem/actions'
 *
 * const client = createClient({
 *   chain: tempo,
 *   transport: http(),
 * })
 *
 * const unwatch = actions.amm.watchBurn(client, {
 *   onBurn: (args, log) => {
 *     console.log('Liquidity removed:', args)
 *   },
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns A function to unsubscribe from the event.
 */
export declare function watchBurn<chain extends Chain | undefined, account extends Account | undefined>(client: Client<Transport, chain, account>, parameters: watchBurn.Parameters): import("viem").WatchContractEventReturnType;
export declare namespace watchBurn {
    type Args = GetEventArgs<typeof feeAmmAbi, 'Burn', {
        IndexedOnly: false;
        Required: true;
    }>;
    type Log = viem_Log<bigint, number, false, ExtractAbiItem<typeof feeAmmAbi, 'Burn'>, true>;
    type Parameters = UnionOmit<WatchContractEventParameters<typeof feeAmmAbi, 'Burn', true>, 'abi' | 'address' | 'batch' | 'eventName' | 'onLogs' | 'strict'> & {
        /** Callback to invoke when liquidity is removed. */
        onBurn: (args: Args, log: Log) => void;
        /** Address or ID of the user token to filter events. */
        userToken?: TokenId.TokenIdOrAddress | undefined;
        /** Address or ID of the validator token to filter events. */
        validatorToken?: TokenId.TokenIdOrAddress | undefined;
    };
}
//# sourceMappingURL=amm.d.ts.map