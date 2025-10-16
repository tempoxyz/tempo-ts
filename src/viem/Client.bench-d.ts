import { attest } from '@ark/attest'
import { test } from 'vitest'
import { createTempoClient } from './Client.js'

test('createTempoClient', () => {
  createTempoClient()
  attest.instantiations([46606, 'instantiations'])
})
