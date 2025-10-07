import { defineChain } from 'viem'
import { chainConfig } from './viem/chain.js'

export const tempoAdagietto = /*#__PURE__*/ defineChain({
  ...chainConfig,
  id: 1337,
  name: 'Tempo',
  nativeCurrency: {
    name: 'USD',
    symbol: 'USD',
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ['https://rpc-adagietto.tempoxyz.dev'] },
  },
})

export const tempoLento = /*#__PURE__*/ defineChain({
  ...chainConfig,
  id: 4246,
  name: 'Tempo',
  nativeCurrency: {
    name: 'USD',
    symbol: 'USD',
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ['https://rpc-lento.tempoxyz.dev'] },
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

export const tempo = /*#__PURE__*/ defineChain(tempoLento)
