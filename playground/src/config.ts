import { QueryClient } from '@tanstack/react-query'
import { tempo, tempoLocal } from 'tempo.ts/chains'
import { Mode } from 'tempo.ts/porto'
import { webAuthn } from 'tempo.ts/wagmi'
import { createConfig, http } from 'wagmi'
import { porto } from 'wagmi/connectors'

export const config = createConfig({
  batch: {
    multicall: false,
  },
  chains: [import.meta.env.VITE_LOCAL !== 'true' ? tempo : tempoLocal],
  connectors: [
    webAuthn(),
    porto({
      mode: Mode.tempo(),
    }),
  ],
  multiInjectedProviderDiscovery: false,
  transports: {
    [tempo.id]: http(undefined, {
      batch: true,
      fetchOptions: {
        headers: {
          Authorization: `Basic ${btoa(import.meta.env.VITE_RPC_CREDENTIALS)}`,
        },
      },
    }),
    [tempoLocal.id]: http(undefined, {
      batch: true,
    }),
  },
})

export const queryClient = new QueryClient()

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
