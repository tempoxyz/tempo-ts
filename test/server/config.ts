import { Mnemonic } from 'ox'
import {
  type Chain,
  type Client,
  type ClientConfig,
  createClient,
  type HttpTransportConfig,
  type Transport,
  type Account as viem_Account,
  http as viem_http,
} from 'viem'
import {
  type Address,
  english,
  generateMnemonic,
  type JsonRpcAccount,
} from 'viem/accounts'
import { tempoLocalnet, tempoTestnet } from 'viem/chains'
import {
  // biome-ignore lint/correctness/noUnusedImports: This is needed to ensure TypeScript can reference viem/tempo types portably
  type z_TokenId as _,
  Account,
  Actions,
  Addresses,
  Tick,
} from 'viem/tempo'
import { rpcUrl } from '../config.js'

export const nodeEnv = import.meta.env.VITE_NODE_ENV || 'localnet'

const accountsMnemonic = (() => {
  if (nodeEnv === 'localnet')
    return 'test test test test test test test test test test test junk'
  return generateMnemonic(english)
})()

export const accounts = Array.from({ length: 20 }, (_, i) => {
  const privateKey = Mnemonic.toPrivateKey(accountsMnemonic, {
    as: 'Hex',
    path: Mnemonic.path({ account: i }),
  })
  return Account.fromSecp256k1(privateKey)
}) as unknown as FixedArray<Account.RootAccount, 20>

export const addresses = {
  alphaUsd: '0x20c0000000000000000000000000000000000001',
} as const

export const chain = (() => {
  if (nodeEnv === 'testnet') return tempoTestnet
  return tempoLocalnet
})()

export function debugOptions({
  rpcUrl,
}: {
  rpcUrl: string
}): HttpTransportConfig | undefined {
  if (import.meta.env.VITE_HTTP_LOG !== 'true') return undefined
  return {
    async onFetchRequest(_, init) {
      console.log(`curl \\
${rpcUrl} \\
-X POST \\
-H "Content-Type: application/json" \\
-d '${JSON.stringify(JSON.parse(init.body as string))}'`)
    },
    async onFetchResponse(response) {
      console.log(`> ${JSON.stringify(await response.clone().json())}`)
    },
  }
}

export const http = (url = rpcUrl) =>
  viem_http(url, {
    ...debugOptions({
      rpcUrl: url,
    }),
  })

export function getClient<
  chain extends Chain | undefined = typeof tempoLocalnet,
  accountOrAddress extends viem_Account | Address | undefined = undefined,
>(
  parameters: Partial<
    Pick<
      ClientConfig<Transport, chain, accountOrAddress>,
      'account' | 'chain' | 'transport'
    >
  > = {},
): Client<
  Transport,
  chain,
  accountOrAddress extends Address
    ? JsonRpcAccount<accountOrAddress>
    : accountOrAddress
> {
  return createClient({
    pollingInterval: 100,
    chain,
    transport: http(rpcUrl),
    ...parameters,
  }) as never
}

export declare namespace fundAddress {
  export type Parameters = {
    /** Account to fund. */
    address: Address
  }
}

type FixedArray<
  type,
  count extends number,
  result extends readonly type[] = [],
> = result['length'] extends count
  ? result
  : FixedArray<type, count, readonly [...result, type]>
