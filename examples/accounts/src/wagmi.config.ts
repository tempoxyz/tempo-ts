import { QueryClient } from '@tanstack/react-query'
import { KeyManager, webAuthn } from 'tempo.ts/wagmi'
import { createConfig, webSocket } from 'wagmi'
import { tempoTestnet } from 'wagmi/chains'

export const alphaUsd = '0x20c0000000000000000000000000000000000001'

export const queryClient = new QueryClient()

export const config = createConfig({
  connectors: [
    webAuthn({
      keyManager: KeyManager.http('/key'),
    }),
  ],
  chains: [tempoTestnet.extend({ feeToken: alphaUsd })],
  transports: {
    [tempoTestnet.id]: webSocket(),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
