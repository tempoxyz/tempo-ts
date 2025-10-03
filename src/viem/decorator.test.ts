import { describe, expect, test } from 'bun:test'
import { tempoLocal } from 'tempo/chains'
import { tempoActions } from 'tempo/viem'
import { createClient, http } from 'viem'

describe.skipIf(!!process.env.CI)('decorator', () => {
  const client2 = createClient({
    chain: tempoLocal,
    transport: http(),
  }).extend(tempoActions())

  test('default', async () => {
    expect(Object.keys(client2)).toMatchInlineSnapshot(`
      [
        "account",
        "batch",
        "cacheTime",
        "ccipRead",
        "chain",
        "key",
        "name",
        "pollingInterval",
        "request",
        "transport",
        "type",
        "uid",
        "extend",
        "amm",
        "fee",
        "policy",
        "token",
      ]
    `)
  })
})
