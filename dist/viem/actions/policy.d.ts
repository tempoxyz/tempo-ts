import type { Account, Address, Chain, Client, ExtractAbiItem, GetEventArgs, ReadContractParameters, ReadContractReturnType, Transport, Log as viem_Log, WatchContractEventParameters, WriteContractParameters, WriteContractReturnType } from 'viem';
import type { Compute } from "../../internal/types.js";
import { tip403RegistryAbi } from "../abis.js";
export type PolicyType = 'whitelist' | 'blacklist';
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
export declare function create<chain extends Chain | undefined, account extends Account | undefined>(client: Client<Transport, chain, account>, parameters: create.Parameters<chain, account>): Promise<create.ReturnType>;
export declare namespace create {
    type Parameters<chain extends Chain | undefined = Chain | undefined, account extends Account | undefined = Account | undefined> = Omit<WriteContractParameters<never, never, never, chain, account>, 'abi' | 'address' | 'functionName' | 'args' | 'type'> & {
        /** Optional array of accounts to initialize the policy with. */
        addresses?: readonly Address[] | undefined;
        /** Address of the policy admin. */
        admin?: Address | undefined;
        /** Type of policy to create. */
        type: PolicyType;
    };
    type ReturnType = {
        hash: WriteContractReturnType;
        policyId: bigint;
    };
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
export declare function setAdmin<chain extends Chain | undefined, account extends Account | undefined>(client: Client<Transport, chain, account>, parameters: setAdmin.Parameters<chain, account>): Promise<setAdmin.ReturnType>;
export declare namespace setAdmin {
    type Parameters<chain extends Chain | undefined = Chain | undefined, account extends Account | undefined = Account | undefined> = Omit<WriteContractParameters<never, never, never, chain, account>, 'abi' | 'address' | 'functionName' | 'args'> & {
        /** New admin address. */
        admin: Address;
        /** Policy ID. */
        policyId: bigint;
    };
    type ReturnType = WriteContractReturnType;
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
export declare function modifyWhitelist<chain extends Chain | undefined, account extends Account | undefined>(client: Client<Transport, chain, account>, parameters: modifyWhitelist.Parameters<chain, account>): Promise<modifyWhitelist.ReturnType>;
export declare namespace modifyWhitelist {
    type Parameters<chain extends Chain | undefined = Chain | undefined, account extends Account | undefined = Account | undefined> = Omit<WriteContractParameters<never, never, never, chain, account>, 'abi' | 'address' | 'functionName' | 'args'> & {
        /** Target account address. */
        address: Address;
        /** Whether the account is allowed. */
        allowed: boolean;
        /** Policy ID. */
        policyId: bigint;
    };
    type ReturnType = WriteContractReturnType;
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
export declare function modifyBlacklist<chain extends Chain | undefined, account extends Account | undefined>(client: Client<Transport, chain, account>, parameters: modifyBlacklist.Parameters<chain, account>): Promise<modifyBlacklist.ReturnType>;
export declare namespace modifyBlacklist {
    type Parameters<chain extends Chain | undefined = Chain | undefined, account extends Account | undefined = Account | undefined> = Omit<WriteContractParameters<never, never, never, chain, account>, 'abi' | 'address' | 'functionName' | 'args'> & {
        /** Target account address. */
        address: Address;
        /** Policy ID. */
        policyId: bigint;
        /** Whether the account is restricted. */
        restricted: boolean;
    };
    type ReturnType = WriteContractReturnType;
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
export declare function getData<chain extends Chain | undefined>(client: Client<Transport, chain>, parameters: getData.Parameters): Promise<getData.ReturnType>;
export declare namespace getData {
    type Parameters = Omit<ReadContractParameters<never, never, never>, 'abi' | 'address' | 'functionName' | 'args'> & {
        /** Policy ID. */
        policyId: bigint;
    };
    type ReturnType = Compute<{
        /** Admin address. */
        admin: Address;
        /** Policy type. */
        type: PolicyType;
    }>;
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
export declare function isAuthorized<chain extends Chain | undefined>(client: Client<Transport, chain>, parameters: isAuthorized.Parameters): Promise<isAuthorized.ReturnType>;
export declare namespace isAuthorized {
    type Parameters = Omit<ReadContractParameters<never, never, never>, 'abi' | 'address' | 'functionName' | 'args'> & {
        /** Policy ID. */
        policyId: bigint;
        /** User address to check. */
        user: Address;
    };
    type ReturnType = ReadContractReturnType<typeof tip403RegistryAbi, 'isAuthorized', never>;
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
export declare function watchCreate<chain extends Chain | undefined, account extends Account | undefined>(client: Client<Transport, chain, account>, parameters: watchCreate.Parameters): import("viem").WatchContractEventReturnType;
export declare namespace watchCreate {
    type Args = {
        policyId: bigint;
        updater: Address;
        type: PolicyType;
    };
    type Log = viem_Log<bigint, number, false, ExtractAbiItem<typeof tip403RegistryAbi, 'PolicyCreated'>, true>;
    type Parameters = Omit<WatchContractEventParameters<typeof tip403RegistryAbi, 'PolicyCreated', true>, 'abi' | 'address' | 'batch' | 'eventName' | 'onLogs' | 'strict'> & {
        /** Callback to invoke when a policy is created. */
        onPolicyCreated: (args: Args, log: Log) => void;
    };
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
export declare function watchAdminUpdated<chain extends Chain | undefined, account extends Account | undefined>(client: Client<Transport, chain, account>, parameters: watchAdminUpdated.Parameters): import("viem").WatchContractEventReturnType;
export declare namespace watchAdminUpdated {
    type Args = GetEventArgs<typeof tip403RegistryAbi, 'PolicyAdminUpdated', {
        IndexedOnly: false;
        Required: true;
    }>;
    type Log = viem_Log<bigint, number, false, ExtractAbiItem<typeof tip403RegistryAbi, 'PolicyAdminUpdated'>, true>;
    type Parameters = Omit<WatchContractEventParameters<typeof tip403RegistryAbi, 'PolicyAdminUpdated', true>, 'abi' | 'address' | 'batch' | 'eventName' | 'onLogs' | 'strict'> & {
        /** Callback to invoke when a policy admin is updated. */
        onAdminUpdated: (args: Args, log: Log) => void;
    };
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
export declare function watchWhitelistUpdated<chain extends Chain | undefined, account extends Account | undefined>(client: Client<Transport, chain, account>, parameters: watchWhitelistUpdated.Parameters): import("viem").WatchContractEventReturnType;
export declare namespace watchWhitelistUpdated {
    type Args = GetEventArgs<typeof tip403RegistryAbi, 'WhitelistUpdated', {
        IndexedOnly: false;
        Required: true;
    }>;
    type Log = viem_Log<bigint, number, false, ExtractAbiItem<typeof tip403RegistryAbi, 'WhitelistUpdated'>, true>;
    type Parameters = Omit<WatchContractEventParameters<typeof tip403RegistryAbi, 'WhitelistUpdated', true>, 'abi' | 'address' | 'batch' | 'eventName' | 'onLogs' | 'strict'> & {
        /** Callback to invoke when a whitelist is updated. */
        onWhitelistUpdated: (args: Args, log: Log) => void;
    };
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
export declare function watchBlacklistUpdated<chain extends Chain | undefined, account extends Account | undefined>(client: Client<Transport, chain, account>, parameters: watchBlacklistUpdated.Parameters): import("viem").WatchContractEventReturnType;
export declare namespace watchBlacklistUpdated {
    type Args = GetEventArgs<typeof tip403RegistryAbi, 'BlacklistUpdated', {
        IndexedOnly: false;
        Required: true;
    }>;
    type Log = viem_Log<bigint, number, false, ExtractAbiItem<typeof tip403RegistryAbi, 'BlacklistUpdated'>, true>;
    type Parameters = Omit<WatchContractEventParameters<typeof tip403RegistryAbi, 'BlacklistUpdated', true>, 'abi' | 'address' | 'batch' | 'eventName' | 'onLogs' | 'strict'> & {
        /** Callback to invoke when a blacklist is updated. */
        onBlacklistUpdated: (args: Args, log: Log) => void;
    };
}
//# sourceMappingURL=policy.d.ts.map