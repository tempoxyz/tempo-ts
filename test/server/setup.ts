import { Actions } from 'viem/tempo'
import { afterAll, beforeAll } from 'vitest'
import { nodeEnv, rpcUrl } from '../config.js'
import { accounts, getClient } from '../viem/config.js'

beforeAll(async () => {
  if (nodeEnv === 'localnet') return
  await Actions.faucet.fundSync(getClient(), {
    account: accounts[0].address,
  })
})

afterAll(async () => {
  if (nodeEnv !== 'localnet') return
  await fetch(`${rpcUrl}/stop`)
})
