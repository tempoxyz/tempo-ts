import type { FixedArray } from '@wagmi/core/internal'
import { defineChain, type LocalAccount } from 'viem'
import { mnemonicToAccount } from 'viem/accounts'
import { tempoLocal } from '../../src/chains.js'
import { createTempoClient } from '../../src/viem/Client.js'

export const accounts = Array.from({ length: 20 }, (_, i) =>
  mnemonicToAccount(
    'test test test test test test test test test test test junk',
    {
      accountIndex: i,
    },
  ),
) as unknown as FixedArray<LocalAccount, 20>

export const id =
  (typeof process !== 'undefined' &&
    Number(process.env.VITEST_POOL_ID ?? 1) +
      Math.floor(Math.random() * 10_000)) ||
  1 + Math.floor(Math.random() * 10_000)

export const rpcUrl = `http://localhost:8545/${id}`

export const tempoTest = defineChain({
  ...tempoLocal,
  rpcUrls: {
    default: {
      http: [rpcUrl],
    },
  },
})

export const client = createTempoClient({
  account: accounts[0],
  chain: tempoTest,
  pollingInterval: 100,
})
