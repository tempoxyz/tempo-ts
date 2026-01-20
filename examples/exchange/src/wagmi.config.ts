import { QueryClient } from '@tanstack/react-query'
import { tempoModerato } from 'viem/chains'
import { createConfig, webSocket } from 'wagmi'
import { KeyManager, webAuthn } from 'wagmi/tempo'

export const pathUsd = '0x20c0000000000000000000000000000000000000'
export const alphaUsd = '0x20c0000000000000000000000000000000000001'
export const betaUsd = '0x20c0000000000000000000000000000000000002'

export const queryClient = new QueryClient()

export const config = createConfig({
  connectors: [
    webAuthn({
      grantAccessKey: true,
      keyManager: KeyManager.localStorage(),
    }),
  ],
  chains: [tempoModerato.extend({ feeToken: alphaUsd })],
  multiInjectedProviderDiscovery: false,
  transports: {
    [tempoModerato.id]: webSocket(),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
