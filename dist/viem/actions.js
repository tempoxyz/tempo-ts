import { parseAccount } from 'viem/accounts';
import { readContract, writeContract } from 'viem/actions';
import { feeManagerAbi, tip20FactoryAbi } from "./abis.js";
import { feeManagerAddress, tip20FactoryAddress } from "./addresses.js";
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
export function createTip20Token(client, parameters) {
    const { account = client.account, chain = client.chain, name, symbol, currency, admin, } = parameters;
    return writeContract(client, {
        ...parameters,
        account,
        address: tip20FactoryAddress,
        abi: tip20FactoryAbi,
        chain,
        functionName: 'createToken',
        args: [name, symbol, currency, admin],
    });
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
export function getUserToken(client, parameters) {
    const { account: account_ = client.account } = parameters;
    if (!account_)
        throw new Error('account is required.');
    const account = parseAccount(account_);
    return readContract(client, {
        ...parameters,
        address: feeManagerAddress,
        abi: feeManagerAbi,
        functionName: 'userTokens',
        args: [account.address],
    });
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
export function setUserToken(client, parameters) {
    const { account = client.account, chain = client.chain, token } = parameters;
    return writeContract(client, {
        ...parameters,
        account,
        address: feeManagerAddress,
        abi: feeManagerAbi,
        chain,
        functionName: 'setUserToken',
        args: [token],
    });
}
//# sourceMappingURL=actions.js.map