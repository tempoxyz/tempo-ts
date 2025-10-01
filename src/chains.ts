import { defineChain } from 'viem'
import { chainConfig } from './viem/chain.js'

export const tempo = /*#__PURE__*/ defineChain({
  ...chainConfig,
  id: 42424,
  name: 'Tempo',
  nativeCurrency: {
    name: 'USD',
    symbol: 'USD',
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ['https://rpc-adagio.tempoxyz.dev'] },
  },
})

export const tempoLocal = /*#__PURE__*/ defineChain({
  ...chainConfig,
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
