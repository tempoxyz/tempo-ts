import { QueryClient } from '@tanstack/react-query'
import { tempoAndantino } from 'tempo.ts/chains'
import { webAuthn } from 'tempo.ts/wagmi'
import { mnemonicToAccount } from 'viem/accounts'
import { createConfig, webSocket } from 'wagmi'

export const alphaUsd = '0x20c0000000000000000000000000000000000001'
export const betaUsd = '0x20c0000000000000000000000000000000000002'

// Sponsor account for gasless transactions (test mnemonic)
export const sponsorAccount = mnemonicToAccount(
  'test test test test test test test test test test test junk',
  { accountIndex: 0 },
)

export const queryClient = new QueryClient()

export const config = createConfig({
  batch: {
    multicall: false,
  },
  connectors: [webAuthn()],
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
