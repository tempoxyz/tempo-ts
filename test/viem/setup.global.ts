import { createServer } from 'prool'
import { Instance } from 'tempo.ts/prool'

export default async function () {
  const server = createServer({
    instance: Instance.tempo({ dev: { blockTime: '2ms' }, port: 8545 }),
    port: 8545,
  })
  await server.start()
  return async () => await server.stop()
}
