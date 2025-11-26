import { nodeEnv } from '../config.js'
import { setupServer } from '../prool.js'

export default async function () {
  if (nodeEnv !== 'localnet') return undefined
  return await setupServer({ port: 9545 })
}
