import { keccak256, stringToHex, } from 'viem';
import { parseAccount } from 'viem/accounts';
import { multicall, readContract, simulateContract, writeContract, } from 'viem/actions';
import { feeManagerAbi, tip20Abi, tip20FactoryAbi } from "./abis.js";
import { feeManagerAddress, tip20FactoryAddress, usdAddress, } from "./addresses.js";
const tokenRole = {
    defaultAdmin: '0x0000000000000000000000000000000000000000000000000000000000000000',
    pause: keccak256(stringToHex('PAUSE_ROLE')),
    unpause: keccak256(stringToHex('UNPAUSE_ROLE')),
    issuer: keccak256(stringToHex('ISSUER_ROLE')),
    burnBlocked: keccak256(stringToHex('BURN_BLOCKED_ROLE')),
};
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
export async function createToken(client, parameters) {
    const { account = client.account, chain = client.chain, name, symbol, currency, } = parameters;
    const admin = parseAccount(parameters.admin);
    const { request, result } = await simulateContract(client, {
        ...parameters,
        account,
        address: tip20FactoryAddress,
        abi: tip20FactoryAbi,
        chain,
        functionName: 'createToken',
        args: [name, symbol, currency, admin.address],
    });
    const hash = await writeContract(client, request);
    return {
        address: result,
        hash,
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
export function getTokenAllowance(client, parameters) {
    const { account = client.account, token = usdAddress, spender } = parameters;
    const address = account ? parseAccount(account).address : undefined;
    if (!address)
        throw new Error('account is required.');
    return readContract(client, {
        ...parameters,
        address: token,
        abi: tip20Abi,
        functionName: 'allowance',
        args: [address, spender],
    });
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
export function getTokenBalance(client, ...parameters) {
    const { account = client.account, token = usdAddress } = parameters[0] ?? {};
    const address = account ? parseAccount(account).address : undefined;
    if (!address)
        throw new Error('account is required.');
    return readContract(client, {
        ...parameters,
        address: token,
        abi: tip20Abi,
        functionName: 'balanceOf',
        args: [address],
    });
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
export function getTokenMetadata(client, parameters = {}) {
    const { token = usdAddress, ...rest } = parameters;
    return multicall(client, {
        ...rest,
        contracts: [
            {
                address: token,
                abi: tip20Abi,
                functionName: 'name',
            },
            {
                address: token,
                abi: tip20Abi,
                functionName: 'symbol',
            },
            {
                address: token,
                abi: tip20Abi,
                functionName: 'currency',
            },
            {
                address: token,
                abi: tip20Abi,
                functionName: 'decimals',
            },
            {
                address: token,
                abi: tip20Abi,
                functionName: 'totalSupply',
            },
        ],
        allowFailure: false,
        deployless: true,
    }).then(([name, symbol, currency, decimals, totalSupply]) => ({
        name,
        symbol,
        currency,
        decimals,
        totalSupply,
    }));
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
export function getUserToken(client, ...parameters) {
    const { account: account_ = client.account } = parameters[0] ?? {};
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
 * Grants a role for a TIP20 token.
 *
 * @example
 * TODO
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The transaction hash.
 */
export function grantTokenRole(client, parameters) {
    const { account = client.account, chain = client.chain, token, to, } = parameters;
    const role = tokenRole[parameters.role];
    return writeContract(client, {
        ...parameters,
        account,
        address: token,
        abi: tip20Abi,
        chain,
        functionName: 'grantRole',
        args: [role, to],
    });
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
export function renounceTokenRole(client, parameters) {
    const { account = client.account, chain = client.chain, token } = parameters;
    const role = tokenRole[parameters.role];
    return writeContract(client, {
        ...parameters,
        account,
        address: token,
        abi: tip20Abi,
        chain,
        functionName: 'renounceRole',
        args: [role],
    });
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
export function revokeTokenRole(client, parameters) {
    const { account = client.account, chain = client.chain, token, from, } = parameters;
    const role = tokenRole[parameters.role];
    return writeContract(client, {
        ...parameters,
        account,
        address: token,
        abi: tip20Abi,
        chain,
        functionName: 'revokeRole',
        args: [role, from],
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
export function decorator(client) {
    return {
        createToken: (parameters) => createToken(client, parameters),
        getTokenAllowance: (parameters) => getTokenAllowance(client, parameters),
        // @ts-expect-error
        getTokenBalance: (parameters) => getTokenBalance(client, parameters),
        getTokenMetadata: (parameters) => getTokenMetadata(client, parameters),
        // @ts-expect-error
        getUserToken: (parameters) => getUserToken(client, parameters),
        grantTokenRole: (parameters) => grantTokenRole(client, parameters),
        renounceTokenRole: (parameters) => renounceTokenRole(client, parameters),
        revokeTokenRole: (parameters) => revokeTokenRole(client, parameters),
        setUserToken: (parameters) => setUserToken(client, parameters),
    };
}
//# sourceMappingURL=actions.js.map