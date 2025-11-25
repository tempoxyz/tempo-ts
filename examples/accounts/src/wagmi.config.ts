import { QueryClient } from '@tanstack/react-query'
import { tempoAndantino } from 'tempo.ts/chains'
import { KeyManager, webAuthn } from 'tempo.ts/wagmi'
import { createConfig, webSocket } from 'wagmi'

export const alphaUsd = '0x20c0000000000000000000000000000000000001'

export const queryClient = new QueryClient()

export const config = createConfig({
  batch: {
    multicall: false,
  },
  connectors: [
    webAuthn({
      keyManager: KeyManager.http(),
    }),
  ],
  chains: [tempoAndantino({ feeToken: alphaUsd })],
  transports: {
    [tempoAndantino.id]: webSocket(
      'wss://rpc.testnet.tempo.xyz?supersecretargument=pleasedonotusemeinprod',
    ),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
