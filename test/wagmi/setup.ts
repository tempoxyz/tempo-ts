import { disconnect } from '@wagmi/core'
import { beforeEach, vi } from 'vitest'
import { config } from '../wagmi/config.js'

// @ts-expect-error
BigInt.prototype.toJSON = function () {
  return this.toString()
}

beforeEach(async () => {
  await disconnect(config).catch(() => {})
})

// Make dates stable across runs
Date.now = vi.fn(() => new Date(Date.UTC(2023, 1, 1)).valueOf())
