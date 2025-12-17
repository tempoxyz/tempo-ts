import { QueryClient } from '@tanstack/react-query'
import { createConfig, webSocket } from 'wagmi'
import { tempoTestnet } from 'wagmi/chains'
import { KeyManager, webAuthn } from 'wagmi/tempo'

export const alphaUsd = '0x20c0000000000000000000000000000000000001'

export const queryClient = new QueryClient()

export const config = createConfig({
  connectors: [
    webAuthn({
      keyManager: KeyManager.localStorage(),
    }),
  ],
  chains: [tempoTestnet.extend({ feeToken: alphaUsd })],
  multiInjectedProviderDiscovery: false,
  transports: {
    [tempoTestnet.id]: webSocket(),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
