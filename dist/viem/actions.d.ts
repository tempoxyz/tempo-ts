import type { Account, Address, Chain, Client, ReadContractParameters, ReadContractReturnType, Transport, WriteContractParameters, WriteContractReturnType } from 'viem';
import type { UnionOmit } from "../internal/types.js";
import { feeManagerAbi } from "./abis.js";
import type { GetAccountParameter } from "./types.js";
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
export declare function createTip20Token<chain extends Chain | undefined, account extends Account | undefined>(client: Client<Transport, chain, account>, parameters: createTip20Token.Parameters<chain, account>): Promise<createTip20Token.ReturnType>;
export declare namespace createTip20Token {
    type Parameters<chain extends Chain | undefined = Chain | undefined, account extends Account | undefined = Account | undefined> = UnionOmit<WriteContractParameters<never, never, never, chain, account>, 'abi' | 'address' | 'functionName' | 'args'> & {
        admin: Address;
        currency: string;
        name: string;
        symbol: string;
    };
    type ReturnType = WriteContractReturnType;
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
export declare function getUserToken<chain extends Chain | undefined, account extends Account | undefined>(client: Client<Transport, chain, account>, parameters: getUserToken.Parameters<account>): Promise<getUserToken.ReturnType>;
export declare namespace getUserToken {
    type Parameters<account extends Account | undefined = Account | undefined> = UnionOmit<ReadContractParameters<never, never, never>, 'abi' | 'address' | 'functionName' | 'args'> & GetAccountParameter<account>;
    type ReturnType = ReadContractReturnType<typeof feeManagerAbi, 'userTokens', never>;
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
//# sourceMappingURL=actions.d.ts.map