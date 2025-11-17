import { beforeAll } from 'vitest'
import { Actions } from '../../src/viem/index.js'
import { nodeEnv } from '../config.js'
import { accounts, client } from '../viem/config.js'

beforeAll(async () => {
  if (nodeEnv === 'local') return
  await Actions.faucet.fundSync(client, {
    account: accounts[0].address,
  })
})
