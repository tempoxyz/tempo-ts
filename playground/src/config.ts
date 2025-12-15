import { QueryClient } from '@tanstack/react-query'
import { dangerous_secp256k1, KeyManager, webAuthn } from 'tempo.ts/wagmi'
import { createConfig, http } from 'wagmi'
import { tempoDevnet, tempoLocalnet, tempoTestnet } from 'wagmi/chains'

const chain = (() => {
  if (import.meta.env.VITE_NODE_ENV === 'localnet') return tempoLocalnet
  if (import.meta.env.VITE_NODE_ENV === 'devnet') return tempoDevnet
  return tempoTestnet
})()

export const config = createConfig({
  batch: {
    multicall: false,
  },
  chains: [chain.extend({ feeToken: 1n })],
  connectors: [
    webAuthn({
      grantAccessKey: true,
      keyManager: KeyManager.localStorage(),
    }),
    dangerous_secp256k1(),
  ],
  transports: {
    [chain.id]: http(undefined, {
      batch: true,
      fetchOptions: {
        headers: {
          Authorization: `Basic ${btoa(import.meta.env.VITE_RPC_CREDENTIALS)}`,
        },
      },
    }),
  } as never,
})

export const queryClient = new QueryClient()

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
