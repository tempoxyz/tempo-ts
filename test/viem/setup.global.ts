import { createServer } from 'prool'
import { Instance } from 'tempo/prool'

export default async function () {
  const server = createServer({
    instance: Instance.tempo({ port: 8545 }),
    port: 8545,
  })
  await server.start()
  return async () => await server.stop()
}
