import * as Chain from './viem/Chain.js'

export const tempoDevnet = /*#__PURE__*/ Chain.define({
  id: 1337,
  name: 'Tempo Devnet',
  nativeCurrency: {
    name: 'USD',
    symbol: 'USD',
    decimals: 6,
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.devnet.tempo.xyz'],
      webSocket: ['wss://rpc.devnet.tempo.xyz'],
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

export const tempoTestnet = /*#__PURE__*/ Chain.define({
  id: 42429,
  blockExplorers: {
    default: {
      name: 'Tempo Explorer',
      url: 'https://explore.tempo.xyz',
    },
  },
  name: 'Tempo Testnet',
  nativeCurrency: {
    name: 'USD',
    symbol: 'USD',
    decimals: 6,
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.testnet.tempo.xyz'],
      webSocket: ['wss://rpc.testnet.tempo.xyz'],
    },
  },
})

export const tempo = /*#__PURE__*/ tempoTestnet
