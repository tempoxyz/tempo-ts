import { tempoTestnet } from 'tempo.ts/chains'
import { Handler } from 'tempo.ts/server'
import { http } from 'viem'
import { alphaUsd, sponsorAccount } from '../src/wagmi.config'

export default {
  fetch(request) {
    return Handler.feePayer({
      account: sponsorAccount,
      chain: tempoTestnet({ feeToken: alphaUsd }),
      transport: http(
        'https://rpc.testnet.tempo.xyz?supersecretargument=pleasedonotusemeinprod',
      ),
    }).fetch(request)
  },
} satisfies ExportedHandler<Env>
