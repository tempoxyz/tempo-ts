import { defineChain } from 'viem'
import { tempoLocal } from '../../src/chains.js'

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
