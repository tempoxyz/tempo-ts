import { Handler } from 'tempo.ts/server'
import { http } from 'viem'
import { tempoTestnet } from 'viem/chains'
import { alphaUsd, sponsorAccount } from '../src/wagmi.config'

export default {
  fetch(request) {
    return Handler.feePayer({
      account: sponsorAccount,
      chain: tempoTestnet.extend({ feeToken: alphaUsd }),
      path: '/fee-payer',
      transport: http(
        'https://rpc.testnet.tempo.xyz?supersecretargument=pleasedonotusemeinprod',
      ),
    }).fetch(request)
  },
} satisfies ExportedHandler<Env>
