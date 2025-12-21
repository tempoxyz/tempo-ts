import { Actions } from 'viem/tempo'
import { afterAll, beforeAll } from 'vitest'
import { rpcUrl } from '../config.js'
import { accounts, getClient, nodeEnv } from './config.js'

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
