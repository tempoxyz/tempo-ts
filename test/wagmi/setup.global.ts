import { createServer } from 'prool'
import { Instance } from 'tempo.ts/prool'

export default async function () {
  const server = createServer({
    instance: Instance.tempo({ dev: { blockTime: '2ms' }, port: 4000 }),
    port: 4000,
  })
  await server.start()
  return async () => await server.stop()
}
