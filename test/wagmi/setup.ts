import { disconnect } from '@wagmi/core'
import { beforeAll, beforeEach, vi } from 'vitest'
import { Actions } from '../../src/viem/index.js'
import { nodeEnv } from '../config.js'
import { accounts, client } from '../viem/config.js'
import { config } from '../wagmi/config.js'

// @ts-expect-error
BigInt.prototype.toJSON = function () {
  return this.toString()
}

beforeAll(async () => {
  if (nodeEnv === 'local') return
  await Actions.faucet.fundSync(client, {
    account: accounts[0].address,
  })
})

beforeEach(async () => {
  await disconnect(config).catch(() => {})
})

// Make dates stable across runs
Date.now = vi.fn(() => new Date(Date.UTC(2023, 1, 1)).valueOf())
