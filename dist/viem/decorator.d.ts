import type { Account, Chain, Client, Transport } from 'viem';
import * as tokenActions from "./actions/token.js";
export type Decorator<chain extends Chain | undefined = Chain | undefined, account extends Account | undefined = Account | undefined> = {
    token: {
        /**
         * Approves a spender to transfer TIP20 tokens on behalf of the caller.
         *
         * @example
         * ```ts
         * import { createTempoClient } from 'tempo/viem'
         * import { privateKeyToAccount } from 'viem/accounts'
         *
         * const client = createTempoClient({
         *   account: privateKeyToAccount('0x...')
         * })
         *
         * const hash = await client.token.approve({
         *   spender: '0x...',
         *   amount: 100n,
         * })
         * ```
         *
         * @param client - Client.
         * @param parameters - Parameters.
         * @returns The transaction hash.
         */
        approve: (parameters: tokenActions.approve.Parameters<chain, account>) => Promise<tokenActions.approve.ReturnType>;
        /**
         * Burns TIP20 tokens from a blocked address.
         *
         * @example
         * ```ts
         * import { createTempoClient } from 'tempo/viem'
         * import { privateKeyToAccount } from 'viem/accounts'
         *
         * const client = createTempoClient({
         *   account: privateKeyToAccount('0x...')
         * })
         *
         * const hash = await client.token.burnBlocked({
         *   from: '0x...',
         *   amount: 100n,
         *   token: '0x...',
         * })
         * ```
         *
         * @param client - Client.
         * @param parameters - Parameters.
         * @returns The transaction hash.
         */
        burnBlocked: (parameters: tokenActions.burnBlocked.Parameters<chain, account>) => Promise<tokenActions.burnBlocked.ReturnType>;
        /**
         * Burns TIP20 tokens from the caller's balance.
         *
         * @example
         * ```ts
         * import { createTempoClient } from 'tempo/viem'
         * import { privateKeyToAccount } from 'viem/accounts'
         *
         * const client = createTempoClient({
         *   account: privateKeyToAccount('0x...')
         * })
         *
         * const hash = await client.token.burn({
         *   amount: 100n,
         *   token: '0x...',
         * })
         * ```
         *
         * @param client - Client.
         * @param parameters - Parameters.
         * @returns The transaction hash.
         */
        burn: (parameters: tokenActions.burn.Parameters<chain, account>) => Promise<tokenActions.burn.ReturnType>;
        /**
         * Changes the transfer policy ID for a TIP20 token.
         *
         * @example
         * ```ts
         * import { createTempoClient } from 'tempo/viem'
         * import { privateKeyToAccount } from 'viem/accounts'
         *
         * const client = createTempoClient({
         *   account: privateKeyToAccount('0x...')
         * })
         *
         * const hash = await client.token.changeTransferPolicy({
         *   token: '0x...',
         *   policyId: 1n,
         * })
         * ```
         *
         * @param client - Client.
         * @param parameters - Parameters.
         * @returns The transaction hash.
         */
        changeTransferPolicy: (parameters: tokenActions.changeTransferPolicy.Parameters<chain, account>) => Promise<tokenActions.changeTransferPolicy.ReturnType>;
        /**
         * Creates a new TIP20 token.
         *
         * @example
         * ```ts
         * import { createTempoClient } from 'tempo/viem'
         * import { privateKeyToAccount } from 'viem/accounts'
         *
         * const client = createTempoClient({
         *   account: privateKeyToAccount('0x...')
         * })
         *
         * const { hash, id, address } = await client.token.create({
         *   name: 'My Token',
         *   symbol: 'MTK',
         *   currency: 'USD',
         * })
         * ```
         *
         * @param client - Client.
         * @param parameters - Parameters.
         * @returns The transaction hash.
         */
        create: (parameters: tokenActions.create.Parameters<chain, account>) => Promise<tokenActions.create.ReturnType>;
        /**
         * Gets TIP20 token allowance.
         *
         * @example
         * ```ts
         * import { createTempoClient } from 'tempo/viem'
         * import { privateKeyToAccount } from 'viem/accounts'
         *
         * const client = createTempoClient({
         *   account: privateKeyToAccount('0x...')
         * })
         *
         * const allowance = await client.token.getAllowance({
         *   spender: '0x...',
         * })
         * ```
         *
         * @param client - Client.
         * @param parameters - Parameters.
         * @returns The token allowance.
         */
        getAllowance: (parameters: tokenActions.getAllowance.Parameters) => Promise<tokenActions.getAllowance.ReturnType>;
        /**
         * Gets TIP20 token balance for an address.
         *
         * @example
         * ```ts
         * import { createTempoClient } from 'tempo/viem'
         * import { privateKeyToAccount } from 'viem/accounts'
         *
         * const client = createTempoClient({
         *   account: privateKeyToAccount('0x...')
         * })
         *
         * const balance = await client.token.getBalance()
         * ```
         *
         * @param client - Client.
         * @param parameters - Parameters.
         * @returns The token balance.
         */
        getBalance: (...parameters: account extends Account ? [tokenActions.getBalance.Parameters<account>] | [] : [tokenActions.getBalance.Parameters<account>]) => Promise<tokenActions.getBalance.ReturnType>;
        /**
         * Gets TIP20 token metadata including name, symbol, currency, decimals, and total supply.
         *
         * @example
         * ```ts
         * import { createTempoClient } from 'tempo/viem'
         *
         * const client = createTempoClient()
         *
         * const metadata = await client.token.getMetadata({
         *   token: '0x...',
         * })
         * ```
         *
         * @param client - Client.
         * @param parameters - Parameters.
         * @returns The token metadata.
         */
        getMetadata: (parameters: tokenActions.getMetadata.Parameters) => Promise<tokenActions.getMetadata.ReturnType>;
        /**
         * Gets the user's default fee token.
         *
         * @example
         * ```ts
         * import { createTempoClient } from 'tempo/viem'
         * import { privateKeyToAccount } from 'viem/accounts'
         *
         * const client = createTempoClient({
         *   account: privateKeyToAccount('0x...')
         * })
         *
         * const { address, id } = await client.token.getUserToken()
         * ```
         *
         * @param client - Client.
         * @param parameters - Parameters.
         * @returns The transaction hash.
         */
        getUserToken: (...parameters: account extends Account ? [tokenActions.getUserToken.Parameters<account>] | [] : [tokenActions.getUserToken.Parameters<account>]) => Promise<tokenActions.getUserToken.ReturnType>;
        /**
         * Grants a role for a TIP20 token.
         *
         * @example
         * ```ts
         * import { createTempoClient } from 'tempo/viem'
         * import { privateKeyToAccount } from 'viem/accounts'
         *
         * const client = createTempoClient({
         *   account: privateKeyToAccount('0x...')
         * })
         *
         * const hash = await client.token.grantRoles({
         *   token: '0x...',
         *   to: '0x...',
         *   roles: ['minter'],
         * })
         * ```
         *
         * @param client - Client.
         * @param parameters - Parameters.
         * @returns The transaction hash.
         */
        grantRoles: (parameters: tokenActions.grantRoles.Parameters<chain, account>) => Promise<tokenActions.grantRoles.ReturnType>;
        /**
         * Mints TIP20 tokens to an address.
         *
         * @example
         * ```ts
         * import { createTempoClient } from 'tempo/viem'
         * import { privateKeyToAccount } from 'viem/accounts'
         *
         * const client = createTempoClient({
         *   account: privateKeyToAccount('0x...')
         * })
         *
         * const hash = await client.token.mint({
         *   to: '0x...',
         *   amount: 100n,
         *   token: '0x...',
         * })
         * ```
         *
         * @param client - Client.
         * @param parameters - Parameters.
         * @returns The transaction hash.
         */
        mint: (parameters: tokenActions.mint.Parameters<chain, account>) => Promise<tokenActions.mint.ReturnType>;
        /**
         * Pauses a TIP20 token.
         *
         * @example
         * ```ts
         * import { createTempoClient } from 'tempo/viem'
         * import { privateKeyToAccount } from 'viem/accounts'
         *
         * const client = createTempoClient({
         *   account: privateKeyToAccount('0x...')
         * })
         *
         * const hash = await client.token.pause({
         *   token: '0x...',
         * })
         * ```
         *
         * @param client - Client.
         * @param parameters - Parameters.
         * @returns The transaction hash.
         */
        pause: (parameters: tokenActions.pause.Parameters<chain, account>) => Promise<tokenActions.pause.ReturnType>;
        /**
         * Approves a spender using a signed permit.
         *
         * @example
         * ```ts
         * import { createTempoClient } from 'tempo/viem'
         * import { privateKeyToAccount } from 'viem/accounts'
         *
         * const client = createTempoClient({
         *   account: privateKeyToAccount('0x...')
         * })
         *
         * const hash = await client.token.permit({
         *   owner: '0x...',
         *   spender: '0x...',
         *   value: 100n,
         *   deadline: 1234567890n,
         *   signature: { r: 0n, s: 0n, yParity: 0 },
         * })
         * ```
         *
         * @param client - Client.
         * @param parameters - Parameters.
         * @returns The transaction hash.
         */
        permit: (parameters: tokenActions.permit.Parameters<chain, account>) => Promise<tokenActions.permit.ReturnType>;
        /**
         * Renounces a role for a TIP20 token.
         *
         * @example
         * ```ts
         * import { createTempoClient } from 'tempo/viem'
         * import { privateKeyToAccount } from 'viem/accounts'
         *
         * const client = createTempoClient({
         *   account: privateKeyToAccount('0x...')
         * })
         *
         * const hash = await client.token.renounceRoles({
         *   token: '0x...',
         *   roles: ['minter'],
         * })
         * ```
         *
         * @param client - Client.
         * @param parameters - Parameters.
         * @returns The transaction hash.
         */
        renounceRoles: (parameters: tokenActions.renounceRoles.Parameters<chain, account>) => Promise<tokenActions.renounceRoles.ReturnType>;
        /**
         * Revokes a role for a TIP20 token.
         *
         * @example
         * ```ts
         * import { createTempoClient } from 'tempo/viem'
         * import { privateKeyToAccount } from 'viem/accounts'
         *
         * const client = createTempoClient({
         *   account: privateKeyToAccount('0x...')
         * })
         *
         * const hash = await client.token.revokeRoles({
         *   token: '0x...',
         *   from: '0x...',
         *   roles: ['minter'],
         * })
         * ```
         *
         * @param client - Client.
         * @param parameters - Parameters.
         * @returns The transaction hash.
         */
        revokeRoles: (parameters: tokenActions.revokeRoles.Parameters<chain, account>) => Promise<tokenActions.revokeRoles.ReturnType>;
        /**
         * Sets the supply cap for a TIP20 token.
         *
         * @example
         * ```ts
         * import { createTempoClient } from 'tempo/viem'
         * import { privateKeyToAccount } from 'viem/accounts'
         *
         * const client = createTempoClient({
         *   account: privateKeyToAccount('0x...')
         * })
         *
         * const hash = await client.token.setSupplyCap({
         *   token: '0x...',
         *   supplyCap: 1000000n,
         * })
         * ```
         *
         * @param client - Client.
         * @param parameters - Parameters.
         * @returns The transaction hash.
         */
        setSupplyCap: (parameters: tokenActions.setSupplyCap.Parameters<chain, account>) => Promise<tokenActions.setSupplyCap.ReturnType>;
        /**
         * Sets the admin role for a specific role in a TIP20 token.
         *
         * @example
         * ```ts
         * import { createTempoClient } from 'tempo/viem'
         * import { privateKeyToAccount } from 'viem/accounts'
         *
         * const client = createTempoClient({
         *   account: privateKeyToAccount('0x...')
         * })
         *
         * const hash = await client.token.setRoleAdmin({
         *   token: '0x...',
         *   role: 'minter',
         *   adminRole: 'admin',
         * })
         * ```
         *
         * @param client - Client.
         * @param parameters - Parameters.
         * @returns The transaction hash.
         */
        setRoleAdmin: (parameters: tokenActions.setRoleAdmin.Parameters<chain, account>) => Promise<tokenActions.setRoleAdmin.ReturnType>;
        /**
         * Sets the user's default fee token.
         *
         * @example
         * ```ts
         * import { createTempoClient } from 'tempo/viem'
         * import { privateKeyToAccount } from 'viem/accounts'
         *
         * const client = createTempoClient({
         *   account: privateKeyToAccount('0x...')
         * })
         *
         * const hash = await client.token.setUserToken({
         *   token: '0x...',
         * })
         * ```
         *
         * @param client - Client.
         * @param parameters - Parameters.
         * @returns The transaction hash.
         */
        setUserToken: (parameters: tokenActions.setUserToken.Parameters<chain, account>) => Promise<tokenActions.setUserToken.ReturnType>;
        /**
         * Transfers TIP20 tokens to another address.
         *
         * @example
         * ```ts
         * import { createTempoClient } from 'tempo/viem'
         * import { privateKeyToAccount } from 'viem/accounts'
         *
         * const client = createTempoClient({
         *   account: privateKeyToAccount('0x...')
         * })
         *
         * const hash = await client.token.transfer({
         *   to: '0x...',
         *   amount: 100n,
         * })
         * ```
         *
         * @param client - Client.
         * @param parameters - Parameters.
         * @returns The transaction hash.
         */
        transfer: (parameters: tokenActions.transfer.Parameters<chain, account>) => Promise<tokenActions.transfer.ReturnType>;
        /**
         * Unpauses a TIP20 token.
         *
         * @example
         * ```ts
         * import { createTempoClient } from 'tempo/viem'
         * import { privateKeyToAccount } from 'viem/accounts'
         *
         * const client = createTempoClient({
         *   account: privateKeyToAccount('0x...')
         * })
         *
         * const hash = await client.token.unpause({
         *   token: '0x...',
         * })
         * ```
         *
         * @param client - Client.
         * @param parameters - Parameters.
         * @returns The transaction hash.
         */
        unpause: (parameters: tokenActions.unpause.Parameters<chain, account>) => Promise<tokenActions.unpause.ReturnType>;
        /**
         * Watches for TIP20 token approval events.
         *
         * @example
         * ```ts
         * import { createTempoClient } from 'tempo/viem'
         *
         * const client = createTempoClient()
         *
         * const unwatch = client.token.watchApprove({
         *   onApproval: (args, log) => {
         *     console.log('Approval:', args)
         *   },
         * })
         * ```
         *
         * @param client - Client.
         * @param parameters - Parameters.
         * @returns A function to unsubscribe from the event.
         */
        watchApprove: (parameters: tokenActions.watchApprove.Parameters) => () => void;
        /**
         * Watches for TIP20 token burn events.
         *
         * @example
         * ```ts
         * import { createTempoClient } from 'tempo/viem'
         *
         * const client = createTempoClient()
         *
         * const unwatch = client.token.watchBurn({
         *   onBurn: (args, log) => {
         *     console.log('Burn:', args)
         *   },
         * })
         * ```
         *
         * @param client - Client.
         * @param parameters - Parameters.
         * @returns A function to unsubscribe from the event.
         */
        watchBurn: (parameters: tokenActions.watchBurn.Parameters) => () => void;
        /**
         * Watches for new TIP20 tokens created.
         *
         * @example
         * ```ts
         * import { createTempoClient } from 'tempo/viem'
         *
         * const client = createTempoClient()
         *
         * const unwatch = client.token.watchCreate({
         *   onTokenCreated: (args, log) => {
         *     console.log('Token created:', args)
         *   },
         * })
         * ```
         *
         * @param client - Client.
         * @param parameters - Parameters.
         * @returns A function to unsubscribe from the event.
         */
        watchCreate: (parameters: tokenActions.watchCreate.Parameters) => () => void;
        /**
         * Watches for TIP20 token mint events.
         *
         * @example
         * ```ts
         * import { createTempoClient } from 'tempo/viem'
         *
         * const client = createTempoClient()
         *
         * const unwatch = client.token.watchMint({
         *   onMint: (args, log) => {
         *     console.log('Mint:', args)
         *   },
         * })
         * ```
         *
         * @param client - Client.
         * @param parameters - Parameters.
         * @returns A function to unsubscribe from the event.
         */
        watchMint: (parameters: tokenActions.watchMint.Parameters) => () => void;
        /**
         * Watches for user token set events.
         *
         * @example
         * ```ts
         * import { createTempoClient } from 'tempo/viem'
         *
         * const client = createTempoClient()
         *
         * const unwatch = client.token.watchSetUserToken({
         *   onUserTokenSet: (args, log) => {
         *     console.log('User token set:', args)
         *   },
         * })
         * ```
         *
         * @param client - Client.
         * @param parameters - Parameters.
         * @returns A function to unsubscribe from the event.
         */
        watchSetUserToken: (parameters: tokenActions.watchSetUserToken.Parameters) => () => void;
        /**
         * Watches for TIP20 token role admin updates.
         *
         * @example
         * ```ts
         * import { createTempoClient } from 'tempo/viem'
         *
         * const client = createTempoClient()
         *
         * const unwatch = client.token.watchAdminRole({
         *   onRoleAdminUpdated: (args, log) => {
         *     console.log('Role admin updated:', args)
         *   },
         * })
         * ```
         *
         * @param client - Client.
         * @param parameters - Parameters.
         * @returns A function to unsubscribe from the event.
         */
        watchAdminRole: (parameters: tokenActions.watchAdminRole.Parameters) => () => void;
        /**
         * Watches for TIP20 token role membership updates.
         *
         * @example
         * ```ts
         * import { createTempoClient } from 'tempo/viem'
         *
         * const client = createTempoClient()
         *
         * const unwatch = client.token.watchRole({
         *   onRoleUpdated: (args, log) => {
         *     console.log('Role updated:', args)
         *   },
         * })
         * ```
         *
         * @param client - Client.
         * @param parameters - Parameters.
         * @returns A function to unsubscribe from the event.
         */
        watchRole: (parameters: tokenActions.watchRole.Parameters) => () => void;
        /**
         * Watches for TIP20 token transfer events.
         *
         * @example
         * ```ts
         * import { createTempoClient } from 'tempo/viem'
         *
         * const client = createTempoClient()
         *
         * const unwatch = client.token.watchTransfer({
         *   onTransfer: (args, log) => {
         *     console.log('Transfer:', args)
         *   },
         * })
         * ```
         *
         * @param client - Client.
         * @param parameters - Parameters.
         * @returns A function to unsubscribe from the event.
         */
        watchTransfer: (parameters: tokenActions.watchTransfer.Parameters) => () => void;
    };
};
export declare function decorator(): <transport extends Transport, chain extends Chain | undefined, account extends Account | undefined>(client: Client<transport, chain, account>) => Decorator<chain, account>;
//# sourceMappingURL=decorator.d.ts.map