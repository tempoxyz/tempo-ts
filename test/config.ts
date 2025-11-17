import { tempoAndantino, tempoDev, tempoLocal } from '../src/chains.js'

export const addresses = {
  alphaUsd: '0x20c0000000000000000000000000000000000001',
} as const

export const id =
  (typeof process !== 'undefined' &&
    Number(process.env.VITEST_POOL_ID ?? 1) +
      Math.floor(Math.random() * 10_000)) ||
  1 + Math.floor(Math.random() * 10_000)

export const rpcEnv = import.meta.env.VITE_RPC_ENV || 'local'
export const chainId = (() => {
  if (rpcEnv === 'testnet') return tempoAndantino.id
  if (rpcEnv === 'devnet') return tempoDev.id
  return tempoLocal.id
})()

export const fetchOptions = {
  headers: {
    Authorization: `Basic ${btoa('eng:zealous-mayer')}`,
  },
} as const

export const rpcUrl = (() => {
  const env = import.meta.env.VITE_RPC_ENV
  if (env === 'testnet') return tempoAndantino({}).rpcUrls.default.http[0]
  if (env === 'devnet') return tempoDev({}).rpcUrls.default.http[0]
  return `http://localhost:${import.meta.env.RPC_PORT ?? '8545'}/${id}`
})()
