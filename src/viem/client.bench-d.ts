import { attest } from '@ark/attest'
import { test } from 'vitest'
import { createTempoClient } from './client.js'

test('createTempoClient', () => {
  createTempoClient()
  attest.instantiations([45889, 'instantiations'])
})
