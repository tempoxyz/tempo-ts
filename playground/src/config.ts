import { QueryClient } from '@tanstack/react-query'
import { tempoDev, tempoLocal, tempoTestnet } from 'tempo.ts/chains'
import { dangerous_secp256k1, KeyManager, webAuthn } from 'tempo.ts/wagmi'
import { createConfig, http } from 'wagmi'

const chain = (() => {
  if (import.meta.env.VITE_NODE_ENV === 'localnet') return tempoLocal
  if (import.meta.env.VITE_NODE_ENV === 'devnet') return tempoDev
  return tempoTestnet
})()

export const config = createConfig({
  batch: {
    multicall: false,
  },
  chains: [chain({ feeToken: 1n })],
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
