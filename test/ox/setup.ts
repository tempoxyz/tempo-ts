import { afterAll, beforeAll } from 'vitest'
import { Actions } from '../../src/viem/index.js'
import { nodeEnv, rpcUrl } from '../config.js'
import { accounts, client } from '../viem/config.js'

beforeAll(async () => {
  if (nodeEnv === 'local') return
  await Actions.faucet.fundSync(client, {
    account: accounts[0].address,
  })
})

afterAll(async () => {
  if (nodeEnv !== 'local') return
  await fetch(`${rpcUrl}/stop`)
})
