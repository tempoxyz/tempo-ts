import { tempoLocal } from 'tempo.ts/chains'
import { tempoActions } from 'tempo.ts/viem'
import { createClient, http } from 'viem'
import { describe, expect, test } from 'vitest'

describe('decorator', () => {
  const client2 = createClient({
    chain: tempoLocal({ feeToken: 1n }),
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
        "dex",
        "fee",
        "policy",
        "reward",
        "token",
      ]
    `)
  })
})
