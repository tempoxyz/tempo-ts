import { env } from 'cloudflare:workers'
import { Handler, Kv } from 'tempo.ts/server'

export default {
  fetch(request) {
    return Handler.keyManager({
      kv: Kv.cloudflare(env.KEY_STORE),
    }).fetch(request)
  },
} satisfies ExportedHandler<Env>
