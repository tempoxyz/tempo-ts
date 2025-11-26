import { Handler } from 'tempo.ts/server'
import { sponsorAccount } from '../src/wagmi.config'

export default {
  fetch(request) {
    return Handler.feePayer({
      account: sponsorAccount,
    }).fetch(request)
  },
} satisfies ExportedHandler<Env>
