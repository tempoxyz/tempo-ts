import { defineChain } from 'viem'
import { tempoLocal } from '../../src/chains.js'

export const id = Number(process.env.VITEST_POOL_ID!)
export const rpcUrl = `http://localhost:8545/${id}`

export const tempoTest = defineChain({
  ...tempoLocal,
  rpcUrls: {
    default: {
      http: [rpcUrl],
    },
  },
})
