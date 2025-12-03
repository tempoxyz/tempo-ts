import { tempoDevnet, tempoLocal, tempoTestnet } from '../src/chains.js'

export const addresses = {
  alphaUsd: '0x20c0000000000000000000000000000000000001',
} as const

export const id =
  (typeof process !== 'undefined' &&
    Number(process.env.VITEST_POOL_ID ?? 1) +
      Math.floor(Math.random() * 10_000)) ||
  1 + Math.floor(Math.random() * 10_000)

export const nodeEnv = import.meta.env.VITE_NODE_ENV || 'localnet'
export const chainId = (() => {
  if (nodeEnv === 'testnet') return tempoTestnet.id
  if (nodeEnv === 'devnet') return tempoDevnet.id
  return tempoLocal.id
})()

export const fetchOptions = {
  headers: {
    Authorization: `Basic ${btoa(import.meta.env.VITE_RPC_CREDENTIALS)}`,
  },
} as const

export const rpcUrl = (() => {
  const env = import.meta.env.VITE_NODE_ENV
  if (env === 'testnet') return tempoTestnet({}).rpcUrls.default.http[0]
  if (env === 'devnet') return tempoDevnet({}).rpcUrls.default.http[0]
  return `http://localhost:${import.meta.env.RPC_PORT ?? '8545'}/${id}`
})()
