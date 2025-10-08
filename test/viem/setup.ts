import { beforeEach } from 'vitest'
import { rpcUrl } from './config.js'

beforeEach(async () => {
  await fetch(`${rpcUrl}/restart`)
})
