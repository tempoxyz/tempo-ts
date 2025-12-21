import { disconnect } from '@wagmi/core'
import { Actions } from 'viem/tempo'
import { afterAll, beforeAll, beforeEach, vi } from 'vitest'
import { nodeEnv, rpcUrl } from '../config.js'
import { accounts, client } from '../viem/config.js'
import { config } from '../wagmi/config.js'

// @ts-expect-error
BigInt.prototype.toJSON = function () {
  return this.toString()
}

beforeAll(async () => {
  if (nodeEnv === 'localnet') return
  await Actions.faucet.fundSync(client, {
    account: accounts[0].address,
  })
  // TODO: remove once testnet load balancing is fixed.
  await new Promise((resolve) => setTimeout(resolve, 2000))
})

beforeEach(async () => {
  await disconnect(config).catch(() => {})
})

afterAll(async () => {
  if (nodeEnv !== 'localnet') return
  await fetch(`${rpcUrl}/stop`)
})

// Make dates stable across runs
Date.now = vi.fn(() => new Date(Date.UTC(2023, 1, 1)).valueOf())
