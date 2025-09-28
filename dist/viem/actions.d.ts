import { type Account, type Address, type Chain, type Client, type Hex, type ReadContractParameters, type ReadContractReturnType, type Transport, type WriteContractParameters, type WriteContractReturnType } from 'viem';
import type { UnionOmit } from "../internal/types.js";
import { feeManagerAbi, tip20Abi } from "./abis.js";
import type { GetAccountParameter } from "./types.js";
declare const tokenRole: {
    defaultAdmin: string;
    pause: `0x${string}`;
    unpause: `0x${string}`;
    issuer: `0x${string}`;
    burnBlocked: `0x${string}`;
};
type TokenRole = keyof typeof tokenRole;
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
        admin: Account | Address;
        currency: string;
        name: string;
        symbol: string;
    };
    type ReturnType = {
        address: Address;
        hash: Hex;
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
        token?: Address | undefined;
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
        token?: Address | undefined;
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
        token?: Address | undefined;
    };
    type ReturnType = {
        name: string;
        symbol: string;
        currency: string;
        decimals: number;
        totalSupply: bigint;
    };
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
    type ReturnType = ReadContractReturnType<typeof feeManagerAbi, 'userTokens', never>;
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
export declare function grantTokenRole<chain extends Chain | undefined, account extends Account | undefined>(client: Client<Transport, chain, account>, parameters: grantTokenRole.Parameters<chain, account>): Promise<grantTokenRole.ReturnType>;
export declare namespace grantTokenRole {
    type Parameters<chain extends Chain | undefined = Chain | undefined, account extends Account | undefined = Account | undefined> = UnionOmit<WriteContractParameters<never, never, never, chain, account>, 'abi' | 'address' | 'functionName' | 'args'> & {
        token: Address;
        role: TokenRole;
        to: Address;
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
export declare function renounceTokenRole<chain extends Chain | undefined, account extends Account | undefined>(client: Client<Transport, chain, account>, parameters: renounceTokenRole.Parameters<chain, account>): Promise<renounceTokenRole.ReturnType>;
export declare namespace renounceTokenRole {
    type Parameters<chain extends Chain | undefined = Chain | undefined, account extends Account | undefined = Account | undefined> = UnionOmit<WriteContractParameters<never, never, never, chain, account>, 'abi' | 'address' | 'functionName' | 'args'> & {
        token: Address;
        role: TokenRole;
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
export declare function revokeTokenRole<chain extends Chain | undefined, account extends Account | undefined>(client: Client<Transport, chain, account>, parameters: revokeTokenRole.Parameters<chain, account>): Promise<revokeTokenRole.ReturnType>;
export declare namespace revokeTokenRole {
    type Parameters<chain extends Chain | undefined = Chain | undefined, account extends Account | undefined = Account | undefined> = UnionOmit<WriteContractParameters<never, never, never, chain, account>, 'abi' | 'address' | 'functionName' | 'args'> & {
        from: Address;
        role: TokenRole;
        token: Address;
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
        token: Address;
    };
    type ReturnType = WriteContractReturnType;
}
export type Decorator<chain extends Chain | undefined = Chain | undefined, account extends Account | undefined = Account | undefined> = {
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
    grantTokenRole: (parameters: grantTokenRole.Parameters<chain, account>) => Promise<grantTokenRole.ReturnType>;
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
    renounceTokenRole: (parameters: renounceTokenRole.Parameters<chain, account>) => Promise<renounceTokenRole.ReturnType>;
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
    revokeTokenRole: (parameters: revokeTokenRole.Parameters<chain, account>) => Promise<revokeTokenRole.ReturnType>;
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
};
export declare function decorator<transport extends Transport, chain extends Chain | undefined, account extends Account | undefined>(client: Client<transport, chain, account>): Decorator<chain, account>;
export {};
//# sourceMappingURL=actions.d.ts.map