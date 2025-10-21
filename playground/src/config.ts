import { QueryClient } from '@tanstack/react-query'
import { tempoLocal } from 'tempo.ts/chains'
import { createConfig, http } from 'wagmi'

export const config = createConfig({
  batch: {
    multicall: false,
  },
  chains: [tempoLocal],
  transports: {
    [tempoLocal.id]: http(undefined, {
      batch: true,
    }),
  },
})

export const queryClient = new QueryClient()
