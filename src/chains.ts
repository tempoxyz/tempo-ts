import { defineChain } from 'viem'
import * as chain from './viem/chain.js'

export const tempoDev = /*#__PURE__*/ defineChain({
  ...chain.config,
  id: 1337,
  name: 'Tempo',
  nativeCurrency: {
    name: 'USD',
    symbol: 'USD',
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ['http://localhost:8545'] },
  },
})
