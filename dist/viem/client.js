import { createClient, http, } from 'viem';
import { tempo } from "../chains.js";
import * as actions from "./decorator.js";
/**
 * Instantiates a default Tempo client.
 *
 * @example
 * ```ts
 * import { createTempoClient } from 'tempo/viem'
 * import { privateKeyToAccount } from 'viem/accounts'
 *
 * const client = createTempoClient({
 *   account: privateKeyToAccount('0x...')
 * })
 * ```
 *
 * @param parameters - The parameters for the client.
 * @returns A Tempo client.
 */
export function createTempoClient(parameters = {}) {
    const { chain = tempo, transport = http(), ...rest } = parameters;
    return createClient({
        ...rest,
        chain,
        transport,
    }).extend(actions.decorator());
}
//# sourceMappingURL=client.js.map