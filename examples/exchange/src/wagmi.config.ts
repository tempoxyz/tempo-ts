import { QueryClient } from '@tanstack/react-query'
import { tempoAndantino } from 'tempo.ts/chains'
import { KeyManager, webAuthn } from 'tempo.ts/wagmi'
import { createConfig, webSocket } from 'wagmi'

export const pathUsd = '0x20c0000000000000000000000000000000000000'
export const alphaUsd = '0x20c0000000000000000000000000000000000001'
export const betaUsd = '0x20c0000000000000000000000000000000000002'

export const queryClient = new QueryClient()

export const config = createConfig({
  batch: {
    multicall: false,
  },
  connectors: [
    webAuthn({
      keyManager: KeyManager.localStorage(),
    }),
  ],
  chains: [tempoAndantino({ feeToken: alphaUsd })],
  multiInjectedProviderDiscovery: false,
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
