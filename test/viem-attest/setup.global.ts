import { join } from 'node:path'
import { setup } from '@ark/attest'

export default () =>
  setup({
    formatCmd: 'pnpm check',
    tsconfig: join(import.meta.dirname, '../../src/tsconfig.json'),
  })
