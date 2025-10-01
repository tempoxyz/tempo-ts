// TODO:
// - add `.call` to namespaces
// - add `.simulate` to namespaces
// - add `.estimateGas` to namespaces
import { parseAccount } from 'viem/accounts';
import { readContract, simulateContract, watchContractEvent, writeContract, } from 'viem/actions';
import { tip403RegistryAbi } from "../abis.js";
import { tip403RegistryAddress } from "../addresses.js";
const policyTypeMap = {
    whitelist: 0,
    blacklist: 1,
};
/**
 * Creates a new policy.
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
 * const { hash, policyId } = await actions.policy.create(client, {
 *   admin: '0x...',
 *   type: 'whitelist',
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The transaction hash and policy ID.
 */
export async function create(client, parameters) {
    const { account = client.account, addresses, chain = client.chain, type, ...rest } = parameters;
    if (!account)
        throw new Error('`account` is required');
    const admin = parseAccount(account).address;
    const args = addresses
        ? [admin, policyTypeMap[type], addresses]
        : [admin, policyTypeMap[type]];
    const { request, result } = await simulateContract(client, {
        ...rest,
        account,
        address: tip403RegistryAddress,
        abi: tip403RegistryAbi,
        chain,
        functionName: 'createPolicy',
        args,
    });
    const hash = await writeContract(client, request);
    return { hash, policyId: result };
}
/**
 * Sets the admin for a policy.
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
 * const hash = await actions.policy.setAdmin(client, {
 *   policyId: 2n,
 *   admin: '0x...',
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The transaction hash.
 */
export async function setAdmin(client, parameters) {
    const { account = client.account, admin, chain = client.chain, policyId, ...rest } = parameters;
    return writeContract(client, {
        ...rest,
        account,
        address: tip403RegistryAddress,
        abi: tip403RegistryAbi,
        chain,
        functionName: 'setPolicyAdmin',
        args: [policyId, admin],
    });
}
/**
 * Modifies a policy whitelist.
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
 * const hash = await actions.policy.modifyWhitelist(client, {
 *   policyId: 2n,
 *   account: '0x...',
 *   allowed: true,
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The transaction hash.
 */
export async function modifyWhitelist(client, parameters) {
    const { account = client.account, address: targetAccount, allowed, chain = client.chain, policyId, ...rest } = parameters;
    return writeContract(client, {
        ...rest,
        account,
        address: tip403RegistryAddress,
        abi: tip403RegistryAbi,
        chain,
        functionName: 'modifyPolicyWhitelist',
        args: [policyId, targetAccount, allowed],
    });
}
/**
 * Modifies a policy blacklist.
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
 * const hash = await actions.policy.modifyBlacklist(client, {
 *   policyId: 2n,
 *   account: '0x...',
 *   restricted: true,
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The transaction hash.
 */
export async function modifyBlacklist(client, parameters) {
    const { account = client.account, address: targetAccount, chain = client.chain, policyId, restricted, ...rest } = parameters;
    return writeContract(client, {
        ...rest,
        account,
        address: tip403RegistryAddress,
        abi: tip403RegistryAbi,
        chain,
        functionName: 'modifyPolicyBlacklist',
        args: [policyId, targetAccount, restricted],
    });
}
/**
 * Gets policy data.
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
 * const data = await actions.policy.getData(client, {
 *   policyId: 2n,
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The policy data.
 */
export async function getData(client, parameters) {
    const { policyId, ...rest } = parameters;
    const result = await readContract(client, {
        ...rest,
        address: tip403RegistryAddress,
        abi: tip403RegistryAbi,
        functionName: 'policyData',
        args: [policyId],
    });
    return {
        admin: result[1],
        type: result[0] === 0 ? 'whitelist' : 'blacklist',
    };
}
/**
 * Checks if a user is authorized by a policy.
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
 * const authorized = await actions.policy.isAuthorized(client, {
 *   policyId: 2n,
 *   user: '0x...',
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns Whether the user is authorized.
 */
export async function isAuthorized(client, parameters) {
    const { policyId, user, ...rest } = parameters;
    return readContract(client, {
        ...rest,
        address: tip403RegistryAddress,
        abi: tip403RegistryAbi,
        functionName: 'isAuthorized',
        args: [policyId, user],
    });
}
/**
 * Watches for policy creation events.
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
 * const unwatch = actions.policy.watchCreate(client, {
 *   onPolicyCreated: (args, log) => {
 *     console.log('Policy created:', args)
 *   },
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns A function to unsubscribe from the event.
 */
export function watchCreate(client, parameters) {
    const { onPolicyCreated, ...rest } = parameters;
    return watchContractEvent(client, {
        ...rest,
        address: tip403RegistryAddress,
        abi: tip403RegistryAbi,
        eventName: 'PolicyCreated',
        onLogs: (logs) => {
            for (const log of logs)
                onPolicyCreated({
                    ...log.args,
                    type: log.args.policyType === 0 ? 'whitelist' : 'blacklist',
                }, log);
        },
        strict: true,
    });
}
/**
 * Watches for policy admin update events.
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
 * const unwatch = actions.policy.watchAdminUpdated(client, {
 *   onAdminUpdated: (args, log) => {
 *     console.log('Policy admin updated:', args)
 *   },
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns A function to unsubscribe from the event.
 */
export function watchAdminUpdated(client, parameters) {
    const { onAdminUpdated, ...rest } = parameters;
    return watchContractEvent(client, {
        ...rest,
        address: tip403RegistryAddress,
        abi: tip403RegistryAbi,
        eventName: 'PolicyAdminUpdated',
        onLogs: (logs) => {
            for (const log of logs)
                onAdminUpdated(log.args, log);
        },
        strict: true,
    });
}
/**
 * Watches for whitelist update events.
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
 * const unwatch = actions.policy.watchWhitelistUpdated(client, {
 *   onWhitelistUpdated: (args, log) => {
 *     console.log('Whitelist updated:', args)
 *   },
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns A function to unsubscribe from the event.
 */
export function watchWhitelistUpdated(client, parameters) {
    const { onWhitelistUpdated, ...rest } = parameters;
    return watchContractEvent(client, {
        ...rest,
        address: tip403RegistryAddress,
        abi: tip403RegistryAbi,
        eventName: 'WhitelistUpdated',
        onLogs: (logs) => {
            for (const log of logs)
                onWhitelistUpdated(log.args, log);
        },
        strict: true,
    });
}
/**
 * Watches for blacklist update events.
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
 * const unwatch = actions.policy.watchBlacklistUpdated(client, {
 *   onBlacklistUpdated: (args, log) => {
 *     console.log('Blacklist updated:', args)
 *   },
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns A function to unsubscribe from the event.
 */
export function watchBlacklistUpdated(client, parameters) {
    const { onBlacklistUpdated, ...rest } = parameters;
    return watchContractEvent(client, {
        ...rest,
        address: tip403RegistryAddress,
        abi: tip403RegistryAbi,
        eventName: 'BlacklistUpdated',
        onLogs: (logs) => {
            for (const log of logs)
                onBlacklistUpdated(log.args, log);
        },
        strict: true,
    });
}
//# sourceMappingURL=policy.js.map