import * as Hex from 'ox/Hex';
import * as Signature from 'ox/Signature';
import type { Account, Address, Chain, Client, ExtractAbiItem, GetEventArgs, ReadContractParameters, ReadContractReturnType, Transport, ValueOf, Log as viem_Log, WatchContractEventParameters, WriteContractParameters, WriteContractReturnType } from 'viem';
import type { Compute, UnionOmit } from "../internal/types.js";
import * as TokenId from "../ox/TokenId.js";
import * as TokenRole from "../ox/TokenRole.js";
import { feeManagerAbi, tip20Abi, tip20FactoryAbi } from "./abis.js";
import type { GetAccountParameter } from "./types.js";
declare const transferPolicy: {
    readonly 0: "always-reject";
    readonly 1: "always-allow";
};
type TransferPolicy = ValueOf<typeof transferPolicy>;
/**
 * Approves a spender to transfer TIP20 tokens on behalf of the caller.
 *
 * @example
 * TODO
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The transaction hash.
 */
export declare function approveToken<chain extends Chain | undefined, account extends Account | undefined>(client: Client<Transport, chain, account>, parameters: approveToken.Parameters<chain, account>): Promise<approveToken.ReturnType>;
export declare namespace approveToken {
    type Parameters<chain extends Chain | undefined = Chain | undefined, account extends Account | undefined = Account | undefined> = UnionOmit<WriteContractParameters<never, never, never, chain, account>, 'abi' | 'address' | 'functionName' | 'args'> & {
        /** Amount of tokens to approve. */
        amount: bigint;
        /** Address of the spender. */
        spender: Address;
        /** Address or ID of the TIP20 token. @default `usdAddress` */
        token?: TokenId.TokenIdOrAddress | undefined;
    };
    type ReturnType = WriteContractReturnType;
}
/**
 * Burns TIP20 tokens from a blocked address.
 *
 * @example
 * TODO
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The transaction hash.
 */
export declare function burnBlockedToken<chain extends Chain | undefined, account extends Account | undefined>(client: Client<Transport, chain, account>, parameters: burnBlockedToken.Parameters<chain, account>): Promise<burnBlockedToken.ReturnType>;
export declare namespace burnBlockedToken {
    type Parameters<chain extends Chain | undefined = Chain | undefined, account extends Account | undefined = Account | undefined> = UnionOmit<WriteContractParameters<never, never, never, chain, account>, 'abi' | 'address' | 'functionName' | 'args'> & {
        /** Amount of tokens to burn. */
        amount: bigint;
        /** Address to burn tokens from. */
        from: Address;
        /** Address or ID of the TIP20 token. */
        token: TokenId.TokenIdOrAddress;
    };
    type ReturnType = WriteContractReturnType;
}
/**
 * Burns TIP20 tokens from the caller's balance.
 *
 * @example
 * TODO
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The transaction hash.
 */
export declare function burnToken<chain extends Chain | undefined, account extends Account | undefined>(client: Client<Transport, chain, account>, parameters: burnToken.Parameters<chain, account>): Promise<burnToken.ReturnType>;
export declare namespace burnToken {
    type Parameters<chain extends Chain | undefined = Chain | undefined, account extends Account | undefined = Account | undefined> = UnionOmit<WriteContractParameters<never, never, never, chain, account>, 'abi' | 'address' | 'functionName' | 'args'> & {
        /** Amount of tokens to burn. */
        amount: bigint;
        /** Memo to include in the transfer. */
        memo?: Hex.Hex | undefined;
        /** Address or ID of the TIP20 token. */
        token: TokenId.TokenIdOrAddress;
    };
    type ReturnType = WriteContractReturnType;
}
/**
 * Changes the transfer policy ID for a TIP20 token.
 *
 * @example
 * TODO
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The transaction hash.
 */
export declare function changeTokenTransferPolicy<chain extends Chain | undefined, account extends Account | undefined>(client: Client<Transport, chain, account>, parameters: changeTokenTransferPolicy.Parameters<chain, account>): Promise<changeTokenTransferPolicy.ReturnType>;
export declare namespace changeTokenTransferPolicy {
    type Parameters<chain extends Chain | undefined = Chain | undefined, account extends Account | undefined = Account | undefined> = UnionOmit<WriteContractParameters<never, never, never, chain, account>, 'abi' | 'address' | 'functionName' | 'args'> & {
        /** New transfer policy ID. */
        policyId: bigint;
        /** Address or ID of the TIP20 token. */
        token: TokenId.TokenIdOrAddress;
    };
    type ReturnType = WriteContractReturnType;
}
/**
 * Creates a new TIP20 token.
 *
 * @example
 * TODO
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The transaction hash.
 */
export declare function createToken<chain extends Chain | undefined, account extends Account | undefined>(client: Client<Transport, chain, account>, parameters: createToken.Parameters<chain, account>): Promise<createToken.ReturnType>;
export declare namespace createToken {
    type Parameters<chain extends Chain | undefined = Chain | undefined, account extends Account | undefined = Account | undefined> = UnionOmit<WriteContractParameters<never, never, never, chain, account>, 'abi' | 'address' | 'functionName' | 'args'> & {
        currency: string;
        name: string;
        symbol: string;
    } & (account extends Account ? {
        admin?: Account | Address | undefined;
    } : {
        admin: Account | Address;
    });
    type ReturnType = {
        /** Address of the created TIP20 token. */
        address: Address;
        /** Admin of the token. */
        admin: Address;
        /** Transaction hash. */
        hash: Hex.Hex;
        /** ID of the TIP20 token. */
        id: bigint;
    };
}
/**
 * Gets TIP20 token allowance.
 *
 * @example
 * TODO
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The token allowance.
 */
export declare function getTokenAllowance<chain extends Chain | undefined, account extends Account | undefined>(client: Client<Transport, chain, account>, parameters: getTokenAllowance.Parameters<account>): Promise<getTokenAllowance.ReturnType>;
export declare namespace getTokenAllowance {
    type Parameters<account extends Account | undefined = Account | undefined> = UnionOmit<ReadContractParameters<never, never, never>, 'abi' | 'address' | 'functionName' | 'args'> & GetAccountParameter<account> & {
        /** Address or ID of the TIP20 token. @default `usdAddress` */
        token?: TokenId.TokenIdOrAddress | undefined;
        /** Address of the spender. */
        spender: Address;
    };
    type ReturnType = ReadContractReturnType<typeof tip20Abi, 'allowance', never>;
}
/**
 * Gets TIP20 token balance for an address.
 *
 * @example
 * TODO
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The token balance.
 */
export declare function getTokenBalance<chain extends Chain | undefined, account extends Account | undefined>(client: Client<Transport, chain, account>, ...parameters: account extends Account ? [getTokenBalance.Parameters<account>] | [] : [getTokenBalance.Parameters<account>]): Promise<getTokenBalance.ReturnType>;
export declare namespace getTokenBalance {
    type Parameters<account extends Account | undefined = Account | undefined> = UnionOmit<ReadContractParameters<never, never, never>, 'abi' | 'address' | 'functionName' | 'args'> & GetAccountParameter<account> & {
        /** Address or ID of the TIP20 token. @default `usdAddress` */
        token?: TokenId.TokenIdOrAddress | undefined;
    };
    type ReturnType = ReadContractReturnType<typeof tip20Abi, 'balanceOf', never>;
}
/**
 * Gets TIP20 token metadata including name, symbol, currency, decimals, and total supply.
 *
 * @example
 * TODO
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The token metadata.
 */
export declare function getTokenMetadata<chain extends Chain | undefined>(client: Client<Transport, chain>, parameters?: getTokenMetadata.Parameters): Promise<getTokenMetadata.ReturnType>;
export declare namespace getTokenMetadata {
    type Parameters = {
        /** Address or ID of the TIP20 token. @default `usdAddress` */
        token?: TokenId.TokenIdOrAddress | undefined;
    };
    type ReturnType = Compute<{
        /** Currency (e.g. "USD"). */
        currency: string;
        /** Decimals. */
        decimals: number;
        /** Name. */
        name: string;
        /** Whether the token is paused. */
        paused: boolean;
        /** Supply cap. */
        supplyCap: bigint;
        /** Symbol. */
        symbol: string;
        /** Total supply. */
        totalSupply: bigint;
        /** Transfer policy. */
        transferPolicy: TransferPolicy;
    }>;
}
/**
 * Gets the user's default fee token.
 *
 * @example
 * TODO
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The transaction hash.
 */
export declare function getUserToken<chain extends Chain | undefined, account extends Account | undefined>(client: Client<Transport, chain, account>, ...parameters: account extends Account ? [getUserToken.Parameters<account>] | [] : [getUserToken.Parameters<account>]): Promise<getUserToken.ReturnType>;
export declare namespace getUserToken {
    type Parameters<account extends Account | undefined = Account | undefined> = UnionOmit<ReadContractParameters<never, never, never>, 'abi' | 'address' | 'functionName' | 'args'> & GetAccountParameter<account>;
    type ReturnType = {
        address: Address;
        id: bigint;
    };
}
/**
 * Grants a role for a TIP20 token.
 *
 * @example
 * TODO
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The transaction hash.
 */
export declare function grantTokenRoles<chain extends Chain | undefined, account extends Account | undefined>(client: Client<Transport, chain, account>, parameters: grantTokenRoles.Parameters<chain, account>): Promise<grantTokenRoles.ReturnType>;
export declare namespace grantTokenRoles {
    type Parameters<chain extends Chain | undefined = Chain | undefined, account extends Account | undefined = Account | undefined> = UnionOmit<WriteContractParameters<never, never, never, chain, account>, 'abi' | 'address' | 'functionName' | 'args'> & {
        /** Address or ID of the TIP20 token. */
        token: TokenId.TokenIdOrAddress;
        /** Role to grant. */
        roles: readonly TokenRole.TokenRole[];
        /** Address to grant the role to. */
        to: Address;
    };
    type ReturnType = WriteContractReturnType;
}
/**
 * Mints TIP20 tokens to an address.
 *
 * @example
 * TODO
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The transaction hash.
 */
export declare function mintToken<chain extends Chain | undefined, account extends Account | undefined>(client: Client<Transport, chain, account>, parameters: mintToken.Parameters<chain, account>): Promise<mintToken.ReturnType>;
export declare namespace mintToken {
    type Parameters<chain extends Chain | undefined = Chain | undefined, account extends Account | undefined = Account | undefined> = UnionOmit<WriteContractParameters<never, never, never, chain, account>, 'abi' | 'address' | 'functionName' | 'args'> & {
        /** Amount of tokens to mint. */
        amount: bigint;
        /** Memo to include in the mint. */
        memo?: Hex.Hex | undefined;
        /** Address to mint tokens to. */
        to: Address;
        /** Address or ID of the TIP20 token. */
        token: TokenId.TokenIdOrAddress;
    };
    type ReturnType = WriteContractReturnType;
}
/**
 * Pauses a TIP20 token.
 *
 * @example
 * TODO
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The transaction hash.
 */
export declare function pauseToken<chain extends Chain | undefined, account extends Account | undefined>(client: Client<Transport, chain, account>, parameters: pauseToken.Parameters<chain, account>): Promise<pauseToken.ReturnType>;
export declare namespace pauseToken {
    type Parameters<chain extends Chain | undefined = Chain | undefined, account extends Account | undefined = Account | undefined> = UnionOmit<WriteContractParameters<never, never, never, chain, account>, 'abi' | 'address' | 'functionName' | 'args'> & {
        /** Address or ID of the TIP20 token. */
        token: TokenId.TokenIdOrAddress;
    };
    type ReturnType = WriteContractReturnType;
}
/**
 * Approves a spender using a signed permit.
 *
 * @example
 * TODO
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The transaction hash.
 */
export declare function permitToken<chain extends Chain | undefined, account extends Account | undefined>(client: Client<Transport, chain, account>, parameters: permitToken.Parameters<chain, account>): Promise<permitToken.ReturnType>;
export declare namespace permitToken {
    type Parameters<chain extends Chain | undefined = Chain | undefined, account extends Account | undefined = Account | undefined> = UnionOmit<WriteContractParameters<never, never, never, chain, account>, 'abi' | 'address' | 'functionName' | 'args'> & {
        /** Deadline for the permit. */
        deadline: bigint;
        /** Address of the owner. */
        owner: Address;
        /** Signature. */
        signature: Signature.Signature;
        /** Address of the spender. */
        spender: Address;
        /** Address or ID of the TIP20 token. @default `usdAddress` */
        token?: TokenId.TokenIdOrAddress | undefined;
        /** Amount to approve. */
        value: bigint;
    };
    type ReturnType = WriteContractReturnType;
}
/**
 * Renounces a role for a TIP20 token.
 *
 * @example
 * TODO
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The transaction hash.
 */
export declare function renounceTokenRoles<chain extends Chain | undefined, account extends Account | undefined>(client: Client<Transport, chain, account>, parameters: renounceTokenRoles.Parameters<chain, account>): Promise<renounceTokenRoles.ReturnType>;
export declare namespace renounceTokenRoles {
    type Parameters<chain extends Chain | undefined = Chain | undefined, account extends Account | undefined = Account | undefined> = UnionOmit<WriteContractParameters<never, never, never, chain, account>, 'abi' | 'address' | 'functionName' | 'args'> & {
        /** Address or ID of the TIP20 token. */
        token: TokenId.TokenIdOrAddress;
        /** Roles to renounce. */
        roles: readonly TokenRole.TokenRole[];
    };
    type ReturnType = WriteContractReturnType;
}
/**
 * Revokes a role for a TIP20 token.
 *
 * @example
 * TODO
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The transaction hash.
 */
export declare function revokeTokenRoles<chain extends Chain | undefined, account extends Account | undefined>(client: Client<Transport, chain, account>, parameters: revokeTokenRoles.Parameters<chain, account>): Promise<revokeTokenRoles.ReturnType>;
export declare namespace revokeTokenRoles {
    type Parameters<chain extends Chain | undefined = Chain | undefined, account extends Account | undefined = Account | undefined> = UnionOmit<WriteContractParameters<never, never, never, chain, account>, 'abi' | 'address' | 'functionName' | 'args'> & {
        /** Address to revoke the role from. */
        from: Address;
        /** Role to revoke. */
        roles: readonly TokenRole.TokenRole[];
        /** Address or ID of the TIP20 token. */
        token: TokenId.TokenIdOrAddress;
    };
    type ReturnType = WriteContractReturnType;
}
/**
 * Sets the supply cap for a TIP20 token.
 *
 * @example
 * TODO
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The transaction hash.
 */
export declare function setTokenSupplyCap<chain extends Chain | undefined, account extends Account | undefined>(client: Client<Transport, chain, account>, parameters: setTokenSupplyCap.Parameters<chain, account>): Promise<setTokenSupplyCap.ReturnType>;
export declare namespace setTokenSupplyCap {
    type Parameters<chain extends Chain | undefined = Chain | undefined, account extends Account | undefined = Account | undefined> = UnionOmit<WriteContractParameters<never, never, never, chain, account>, 'abi' | 'address' | 'functionName' | 'args'> & {
        /** New supply cap. */
        supplyCap: bigint;
        /** Address or ID of the TIP20 token. */
        token: TokenId.TokenIdOrAddress;
    };
    type ReturnType = WriteContractReturnType;
}
/**
 * Sets the admin role for a specific role in a TIP20 token.
 *
 * @example
 * TODO
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The transaction hash.
 */
export declare function setTokenRoleAdmin<chain extends Chain | undefined, account extends Account | undefined>(client: Client<Transport, chain, account>, parameters: setTokenRoleAdmin.Parameters<chain, account>): Promise<setTokenRoleAdmin.ReturnType>;
export declare namespace setTokenRoleAdmin {
    type Parameters<chain extends Chain | undefined = Chain | undefined, account extends Account | undefined = Account | undefined> = UnionOmit<WriteContractParameters<never, never, never, chain, account>, 'abi' | 'address' | 'functionName' | 'args'> & {
        /** New admin role. */
        adminRole: TokenRole.TokenRole;
        /** Role to set admin for. */
        role: TokenRole.TokenRole;
        /** Address or ID of the TIP20 token. */
        token: TokenId.TokenIdOrAddress;
    };
    type ReturnType = WriteContractReturnType;
}
/**
 * Sets the user's default fee token.
 *
 * @example
 * TODO
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The transaction hash.
 */
export declare function setUserToken<chain extends Chain | undefined, account extends Account | undefined>(client: Client<Transport, chain, account>, parameters: setUserToken.Parameters<chain, account>): Promise<setUserToken.ReturnType>;
export declare namespace setUserToken {
    type Parameters<chain extends Chain | undefined = Chain | undefined, account extends Account | undefined = Account | undefined> = UnionOmit<WriteContractParameters<never, never, never, chain, account>, 'abi' | 'address' | 'functionName' | 'args'> & {
        /** Address or ID of the TIP20 token. */
        token: TokenId.TokenIdOrAddress;
    };
    type ReturnType = WriteContractReturnType;
}
/**
 * Transfers TIP20 tokens to another address.
 *
 * @example
 * TODO
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The transaction hash.
 */
export declare function transferToken<chain extends Chain | undefined, account extends Account | undefined>(client: Client<Transport, chain, account>, parameters: transferToken.Parameters<chain, account>): Promise<transferToken.ReturnType>;
export declare namespace transferToken {
    type Parameters<chain extends Chain | undefined = Chain | undefined, account extends Account | undefined = Account | undefined> = UnionOmit<WriteContractParameters<never, never, never, chain, account>, 'abi' | 'address' | 'functionName' | 'args'> & {
        /** Amount of tokens to transfer. */
        amount: bigint;
        /** Address to transfer tokens from. */
        from?: Address | undefined;
        /** Memo to include in the transfer. */
        memo?: Hex.Hex | undefined;
        /** Address or ID of the TIP20 token. @default `usdAddress` */
        token?: TokenId.TokenIdOrAddress | undefined;
        /** Address to transfer tokens to. */
        to: Address;
    };
    type ReturnType = WriteContractReturnType;
}
/**
 * Unpauses a TIP20 token.
 *
 * @example
 * TODO
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The transaction hash.
 */
export declare function unpauseToken<chain extends Chain | undefined, account extends Account | undefined>(client: Client<Transport, chain, account>, parameters: unpauseToken.Parameters<chain, account>): Promise<unpauseToken.ReturnType>;
export declare namespace unpauseToken {
    type Parameters<chain extends Chain | undefined = Chain | undefined, account extends Account | undefined = Account | undefined> = UnionOmit<WriteContractParameters<never, never, never, chain, account>, 'abi' | 'address' | 'functionName' | 'args'> & {
        /** Address or ID of the TIP20 token. */
        token: TokenId.TokenIdOrAddress;
    };
    type ReturnType = WriteContractReturnType;
}
/**
 * Watches for TIP20 token approval events.
 *
 * @example
 * TODO
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns A function to unsubscribe from the event.
 */
export declare function watchApproveToken<chain extends Chain | undefined, account extends Account | undefined>(client: Client<Transport, chain, account>, parameters: watchApproveToken.Parameters): import("viem").WatchContractEventReturnType;
export declare namespace watchApproveToken {
    type Args = GetEventArgs<typeof tip20Abi, 'Approval', {
        IndexedOnly: false;
        Required: true;
    }>;
    type Log = viem_Log<bigint, number, false, ExtractAbiItem<typeof tip20Abi, 'Approval'>, true>;
    type Parameters = UnionOmit<WatchContractEventParameters<typeof tip20Abi, 'Approval', true>, 'abi' | 'address' | 'batch' | 'eventName' | 'onLogs' | 'strict'> & {
        /** Callback to invoke when tokens are approved. */
        onApproval: (args: Args, log: Log) => void;
        /** Address or ID of the TIP20 token. @default `usdAddress` */
        token?: TokenId.TokenIdOrAddress | undefined;
    };
}
/**
 * Watches for TIP20 token burn events.
 *
 * @example
 * TODO
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns A function to unsubscribe from the event.
 */
export declare function watchBurnToken<chain extends Chain | undefined, account extends Account | undefined>(client: Client<Transport, chain, account>, parameters: watchBurnToken.Parameters): import("viem").WatchContractEventReturnType;
export declare namespace watchBurnToken {
    type Args = GetEventArgs<typeof tip20Abi, 'Burn', {
        IndexedOnly: false;
        Required: true;
    }>;
    type Log = viem_Log<bigint, number, false, ExtractAbiItem<typeof tip20Abi, 'Burn'>, true>;
    type Parameters = UnionOmit<WatchContractEventParameters<typeof tip20Abi, 'Burn', true>, 'abi' | 'address' | 'batch' | 'eventName' | 'onLogs' | 'strict'> & {
        /** Callback to invoke when tokens are burned. */
        onBurn: (args: Args, log: Log) => void;
        /** Address or ID of the TIP20 token. @default `usdAddress` */
        token?: TokenId.TokenIdOrAddress | undefined;
    };
}
/**
 * Watches for new TIP20 tokens created.
 *
 * @example
 * TODO
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns A function to unsubscribe from the event.
 */
export declare function watchCreateToken<chain extends Chain | undefined, account extends Account | undefined>(client: Client<Transport, chain, account>, parameters: watchCreateToken.Parameters): import("viem").WatchContractEventReturnType;
export declare namespace watchCreateToken {
    type Args = GetEventArgs<typeof tip20FactoryAbi, 'TokenCreated', {
        IndexedOnly: false;
        Required: true;
    }>;
    type Log = viem_Log<bigint, number, false, ExtractAbiItem<typeof tip20FactoryAbi, 'TokenCreated'>, true>;
    type Parameters = UnionOmit<WatchContractEventParameters<typeof tip20FactoryAbi, 'TokenCreated', true>, 'abi' | 'address' | 'batch' | 'eventName' | 'onLogs' | 'strict'> & {
        /** Callback to invoke when a new TIP20 token is created. */
        onTokenCreated: (args: Args, log: Log) => void;
    };
}
/**
 * Watches for TIP20 token mint events.
 *
 * @example
 * TODO
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns A function to unsubscribe from the event.
 */
export declare function watchMintToken<chain extends Chain | undefined, account extends Account | undefined>(client: Client<Transport, chain, account>, parameters: watchMintToken.Parameters): import("viem").WatchContractEventReturnType;
export declare namespace watchMintToken {
    type Args = GetEventArgs<typeof tip20Abi, 'Mint', {
        IndexedOnly: false;
        Required: true;
    }>;
    type Log = viem_Log<bigint, number, false, ExtractAbiItem<typeof tip20Abi, 'Mint'>, true>;
    type Parameters = UnionOmit<WatchContractEventParameters<typeof tip20Abi, 'Mint', true>, 'abi' | 'address' | 'batch' | 'eventName' | 'onLogs' | 'strict'> & {
        /** Callback to invoke when tokens are minted. */
        onMint: (args: Args, log: Log) => void;
        /** Address or ID of the TIP20 token. @default `usdAddress` */
        token?: TokenId.TokenIdOrAddress | undefined;
    };
}
/**
 * Watches for user token set events.
 *
 * @example
 * TODO
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns A function to unsubscribe from the event.
 */
export declare function watchSetUserToken<chain extends Chain | undefined, account extends Account | undefined>(client: Client<Transport, chain, account>, parameters: watchSetUserToken.Parameters): import("viem").WatchContractEventReturnType;
export declare namespace watchSetUserToken {
    type Args = GetEventArgs<typeof feeManagerAbi, 'UserTokenSet', {
        IndexedOnly: false;
        Required: true;
    }>;
    type Log = viem_Log<bigint, number, false, ExtractAbiItem<typeof feeManagerAbi, 'UserTokenSet'>, true>;
    type Parameters = UnionOmit<WatchContractEventParameters<typeof feeManagerAbi, 'UserTokenSet', true>, 'abi' | 'address' | 'batch' | 'eventName' | 'onLogs' | 'strict'> & {
        /** Callback to invoke when a user token is set. */
        onUserTokenSet: (args: Args, log: Log) => void;
    };
}
/**
 * Watches for TIP20 token role membership updates.
 *
 * @example
 * TODO
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns A function to unsubscribe from the event.
 */
export declare function watchTokenRole<chain extends Chain | undefined, account extends Account | undefined>(client: Client<Transport, chain, account>, parameters: watchTokenRole.Parameters): import("viem").WatchContractEventReturnType;
export declare namespace watchTokenRole {
    type Args = GetEventArgs<typeof tip20Abi, 'RoleMembershipUpdated', {
        IndexedOnly: false;
        Required: true;
    }> & {
        /** Type of role update. */
        type: 'granted' | 'revoked';
    };
    type Log = viem_Log<bigint, number, false, ExtractAbiItem<typeof tip20Abi, 'RoleMembershipUpdated'>, true>;
    type Parameters = UnionOmit<WatchContractEventParameters<typeof tip20Abi, 'RoleMembershipUpdated', true>, 'abi' | 'address' | 'batch' | 'eventName' | 'onLogs' | 'strict'> & {
        /** Callback to invoke when a role membership is updated. */
        onRoleMembershipUpdated: (args: Args, log: Log) => void;
        /** Address or ID of the TIP20 token. @default `usdAddress` */
        token?: TokenId.TokenIdOrAddress | undefined;
    };
}
/**
 * Watches for TIP20 token transfer events.
 *
 * @example
 * TODO
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns A function to unsubscribe from the event.
 */
export declare function watchTransferToken<chain extends Chain | undefined, account extends Account | undefined>(client: Client<Transport, chain, account>, parameters: watchTransferToken.Parameters): import("viem").WatchContractEventReturnType;
export declare namespace watchTransferToken {
    type Args = GetEventArgs<typeof tip20Abi, 'Transfer', {
        IndexedOnly: false;
        Required: true;
    }>;
    type Log = viem_Log<bigint, number, false, ExtractAbiItem<typeof tip20Abi, 'Transfer'>, true>;
    type Parameters = UnionOmit<WatchContractEventParameters<typeof tip20Abi, 'Transfer', true>, 'abi' | 'address' | 'batch' | 'eventName' | 'onLogs' | 'strict'> & {
        /** Callback to invoke when tokens are transferred. */
        onTransfer: (args: Args, log: Log) => void;
        /** Address or ID of the TIP20 token. @default `usdAddress` */
        token?: TokenId.TokenIdOrAddress | undefined;
    };
}
export type Decorator<chain extends Chain | undefined = Chain | undefined, account extends Account | undefined = Account | undefined> = {
    /**
     * Approves a spender to transfer TIP20 tokens on behalf of the caller.
     *
     * @example
     * TODO
     *
     * @param client - Client.
     * @param parameters - Parameters.
     * @returns The transaction hash.
     */
    approveToken: (parameters: approveToken.Parameters<chain, account>) => Promise<approveToken.ReturnType>;
    /**
     * Burns TIP20 tokens from a blocked address.
     *
     * @example
     * TODO
     *
     * @param client - Client.
     * @param parameters - Parameters.
     * @returns The transaction hash.
     */
    burnBlockedToken: (parameters: burnBlockedToken.Parameters<chain, account>) => Promise<burnBlockedToken.ReturnType>;
    /**
     * Burns TIP20 tokens from the caller's balance.
     *
     * @example
     * TODO
     *
     * @param client - Client.
     * @param parameters - Parameters.
     * @returns The transaction hash.
     */
    burnToken: (parameters: burnToken.Parameters<chain, account>) => Promise<burnToken.ReturnType>;
    /**
     * Changes the transfer policy ID for a TIP20 token.
     *
     * @example
     * TODO
     *
     * @param client - Client.
     * @param parameters - Parameters.
     * @returns The transaction hash.
     */
    changeTokenTransferPolicy: (parameters: changeTokenTransferPolicy.Parameters<chain, account>) => Promise<changeTokenTransferPolicy.ReturnType>;
    /**
     * Creates a new TIP20 token.
     *
     * @example
     * TODO
     *
     * @param client - Client.
     * @param parameters - Parameters.
     * @returns The transaction hash.
     */
    createToken: (parameters: createToken.Parameters<chain, account>) => Promise<createToken.ReturnType>;
    /**
     * Gets TIP20 token allowance.
     *
     * @example
     * TODO
     *
     * @param client - Client.
     * @param parameters - Parameters.
     * @returns The token allowance.
     */
    getTokenAllowance: (parameters: getTokenAllowance.Parameters) => Promise<getTokenAllowance.ReturnType>;
    /**
     * Gets TIP20 token balance for an address.
     *
     * @example
     * TODO
     *
     * @param client - Client.
     * @param parameters - Parameters.
     * @returns The token balance.
     */
    getTokenBalance: (...parameters: account extends Account ? [getTokenBalance.Parameters<account>] | [] : [getTokenBalance.Parameters<account>]) => Promise<getTokenBalance.ReturnType>;
    /**
     * Gets TIP20 token metadata including name, symbol, currency, decimals, and total supply.
     *
     * @example
     * TODO
     *
     * @param client - Client.
     * @param parameters - Parameters.
     * @returns The token metadata.
     */
    getTokenMetadata: (parameters: getTokenMetadata.Parameters) => Promise<getTokenMetadata.ReturnType>;
    /**
     * Gets the user's default fee token.
     *
     * @example
     * TODO
     *
     * @param client - Client.
     * @param parameters - Parameters.
     * @returns The transaction hash.
     */
    getUserToken: (...parameters: account extends Account ? [getUserToken.Parameters<account>] | [] : [getUserToken.Parameters<account>]) => Promise<getUserToken.ReturnType>;
    /**
     * Grants a role for a TIP20 token.
     *
     * @example
     * TODO
     *
     * @param client - Client.
     * @param parameters - Parameters.
     * @returns The transaction hash.
     */
    grantTokenRoles: (parameters: grantTokenRoles.Parameters<chain, account>) => Promise<grantTokenRoles.ReturnType>;
    /**
     * Mints TIP20 tokens to an address.
     *
     * @example
     * TODO
     *
     * @param client - Client.
     * @param parameters - Parameters.
     * @returns The transaction hash.
     */
    mintToken: (parameters: mintToken.Parameters<chain, account>) => Promise<mintToken.ReturnType>;
    /**
     * Pauses a TIP20 token.
     *
     * @example
     * TODO
     *
     * @param client - Client.
     * @param parameters - Parameters.
     * @returns The transaction hash.
     */
    pauseToken: (parameters: pauseToken.Parameters<chain, account>) => Promise<pauseToken.ReturnType>;
    /**
     * Approves a spender using a signed permit.
     *
     * @example
     * TODO
     *
     * @param client - Client.
     * @param parameters - Parameters.
     * @returns The transaction hash.
     */
    permitToken: (parameters: permitToken.Parameters<chain, account>) => Promise<permitToken.ReturnType>;
    /**
     * Renounces a role for a TIP20 token.
     *
     * @example
     * TODO
     *
     * @param client - Client.
     * @param parameters - Parameters.
     * @returns The transaction hash.
     */
    renounceTokenRoles: (parameters: renounceTokenRoles.Parameters<chain, account>) => Promise<renounceTokenRoles.ReturnType>;
    /**
     * Revokes a role for a TIP20 token.
     *
     * @example
     * TODO
     *
     * @param client - Client.
     * @param parameters - Parameters.
     * @returns The transaction hash.
     */
    revokeTokenRoles: (parameters: revokeTokenRoles.Parameters<chain, account>) => Promise<revokeTokenRoles.ReturnType>;
    /**
     * Sets the supply cap for a TIP20 token.
     *
     * @example
     * TODO
     *
     * @param client - Client.
     * @param parameters - Parameters.
     * @returns The transaction hash.
     */
    setTokenSupplyCap: (parameters: setTokenSupplyCap.Parameters<chain, account>) => Promise<setTokenSupplyCap.ReturnType>;
    /**
     * Sets the admin role for a specific role in a TIP20 token.
     *
     * @example
     * TODO
     *
     * @param client - Client.
     * @param parameters - Parameters.
     * @returns The transaction hash.
     */
    setTokenRoleAdmin: (parameters: setTokenRoleAdmin.Parameters<chain, account>) => Promise<setTokenRoleAdmin.ReturnType>;
    /**
     * Sets the user's default fee token.
     *
     * @example
     * TODO
     *
     * @param client - Client.
     * @param parameters - Parameters.
     * @returns The transaction hash.
     */
    setUserToken: (parameters: setUserToken.Parameters<chain, account>) => Promise<setUserToken.ReturnType>;
    /**
     * Transfers TIP20 tokens to another address.
     *
     * @example
     * TODO
     *
     * @param client - Client.
     * @param parameters - Parameters.
     * @returns The transaction hash.
     */
    transferToken: (parameters: transferToken.Parameters<chain, account>) => Promise<transferToken.ReturnType>;
    /**
     * Unpauses a TIP20 token.
     *
     * @example
     * TODO
     *
     * @param client - Client.
     * @param parameters - Parameters.
     * @returns The transaction hash.
     */
    unpauseToken: (parameters: unpauseToken.Parameters<chain, account>) => Promise<unpauseToken.ReturnType>;
    /**
     * Watches for TIP20 token approval events.
     *
     * @example
     * TODO
     *
     * @param client - Client.
     * @param parameters - Parameters.
     * @returns A function to unsubscribe from the event.
     */
    watchApproveToken: (parameters: watchApproveToken.Parameters) => () => void;
    /**
     * Watches for TIP20 token burn events.
     *
     * @example
     * TODO
     *
     * @param client - Client.
     * @param parameters - Parameters.
     * @returns A function to unsubscribe from the event.
     */
    watchBurnToken: (parameters: watchBurnToken.Parameters) => () => void;
    /**
     * Watches for new TIP20 tokens created.
     *
     * @example
     * TODO
     *
     * @param client - Client.
     * @param parameters - Parameters.
     * @returns A function to unsubscribe from the event.
     */
    watchCreateToken: (parameters: watchCreateToken.Parameters) => () => void;
    /**
     * Watches for TIP20 token mint events.
     *
     * @example
     * TODO
     *
     * @param client - Client.
     * @param parameters - Parameters.
     * @returns A function to unsubscribe from the event.
     */
    watchMintToken: (parameters: watchMintToken.Parameters) => () => void;
    /**
     * Watches for user token set events.
     *
     * @example
     * TODO
     *
     * @param client - Client.
     * @param parameters - Parameters.
     * @returns A function to unsubscribe from the event.
     */
    watchSetUserToken: (parameters: watchSetUserToken.Parameters) => () => void;
    /**
     * Watches for TIP20 token role membership updates.
     *
     * @example
     * TODO
     *
     * @param client - Client.
     * @param parameters - Parameters.
     * @returns A function to unsubscribe from the event.
     */
    watchTokenRole: (parameters: watchTokenRole.Parameters) => () => void;
    /**
     * Watches for TIP20 token transfer events.
     *
     * @example
     * TODO
     *
     * @param client - Client.
     * @param parameters - Parameters.
     * @returns A function to unsubscribe from the event.
     */
    watchTransferToken: (parameters: watchTransferToken.Parameters) => () => void;
};
export declare function decorator(): <transport extends Transport, chain extends Chain | undefined, account extends Account | undefined>(client: Client<transport, chain, account>) => Decorator<chain, account>;
export {};
//# sourceMappingURL=actions.d.ts.map