import { createServer } from 'prool'
import { Instance } from 'tempo.ts/prool'

export default async function () {
  const server = createServer({
    instance: Instance.tempo({ port: 8546 }),
    port: 8546,
  })
  await server.start()
  return async () => await server.stop()
}
