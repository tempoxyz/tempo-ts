import * as Chain from './viem/Chain.js'

export const tempoAndantino = /*#__PURE__*/ Chain.define({
  id: 42429,
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

export const tempoDev = /*#__PURE__*/ Chain.define({
  id: 42429,
  name: 'Tempo Devnet',
  nativeCurrency: {
    name: 'USD',
    symbol: 'USD',
    decimals: 6,
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.devnet.tempo.xyz'],
    },
  },
})

export const tempoLocal = /*#__PURE__*/ Chain.define({
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

export const tempo = /*#__PURE__*/ tempoAndantino
export const tempoTestnet = /*#__PURE__*/ tempoAndantino
