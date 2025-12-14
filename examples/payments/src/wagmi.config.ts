import { QueryClient } from '@tanstack/react-query'
import { tempoTestnet } from 'tempo.ts/chains'
import { KeyManager, webAuthn } from 'tempo.ts/wagmi'
import { mnemonicToAccount } from 'viem/accounts'
import { withFeePayer } from 'viem/tempo'
import { createConfig, http, webSocket } from 'wagmi'

export const alphaUsd = '0x20c0000000000000000000000000000000000001'
export const betaUsd = '0x20c0000000000000000000000000000000000002'

// Sponsor account for gasless transactions (test mnemonic)
export const sponsorAccount = mnemonicToAccount(
  'test test test test test test test test test test test junk',
)

export const queryClient = new QueryClient()

export const config = createConfig({
  connectors: [
    webAuthn({
      keyManager: KeyManager.localStorage(),
    }),
  ],
  chains: [tempoTestnet({ feeToken: alphaUsd })],
  multiInjectedProviderDiscovery: false,
  transports: {
    [tempoTestnet.id]: withFeePayer(
      // Transport for regular transactions
      webSocket(),
      // Transport for sponsored transactions (feePayer: true)
      http('/fee-payer'),
    ),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
