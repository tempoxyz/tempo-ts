import { attest } from '@ark/attest'
import { createClient, http } from 'viem'
import { test } from 'vitest'
import { tempo } from '../chains.js'

test('decorator', () => {
  createClient({
    chain: tempo({ feeToken: '0x20c0000000000000000000000000000000000001' }),
    transport: http('https://cloudflare-eth.com'),
  })
  attest.instantiations([62236, 'instantiations'])
})
