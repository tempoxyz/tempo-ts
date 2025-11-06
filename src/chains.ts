import { defineChain } from 'viem'
import * as Chain from './viem/Chain.js'

export const tempoAndantino = /*#__PURE__*/ defineChain({
  ...Chain.config,
  id: 42427,
  name: 'Tempo Andantino',
  nativeCurrency: {
    name: 'USD',
    symbol: 'USD',
    decimals: 6,
  },
  rpcUrls: {
    default: { http: ['https://rpc.testnet.tempo.xyz'] },
  },
})

export const tempoDev = /*#__PURE__*/ defineChain({
  ...Chain.config,
  id: 42427,
  name: 'Tempo Devnet',
  nativeCurrency: {
    name: 'USD',
    symbol: 'USD',
    decimals: 6,
  },
  rpcUrls: {
    default: { http: ['https://tempo-devnet.ithaca.xyz'] },
  },
})

export const tempoLocal = /*#__PURE__*/ defineChain({
  ...Chain.config,
  id: 1337,
  name: 'Tempo',
  nativeCurrency: {
    name: 'USD',
    symbol: 'USD',
    decimals: 6,
  },
  rpcUrls: {
    default: { http: ['http://localhost:8545'] },
  },
})

export const tempo = /*#__PURE__*/ defineChain(tempoAndantino)
