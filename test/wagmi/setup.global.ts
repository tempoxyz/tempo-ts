import { nodeEnv } from '../config.js'
import { setupServer } from '../prool.js'

export default async function () {
  if (nodeEnv !== 'local') return
  return await setupServer({ port: 4000 })
}
