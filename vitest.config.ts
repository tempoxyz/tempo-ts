import { join } from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      'tempo.ts': join(import.meta.dirname, './src'),
    },
  },
  test: {
    retry: 3,
    testTimeout: 30_000,
    reporters: process.env.CI ? ['verbose'] : [],
    projects: [
      {
        extends: true,
        test: {
          name: 'ox',
          root: './src/ox',
          environment: 'node',
        },
      },
      {
        extends: true,
        test: {
          name: 'prool',
          root: './src/prool',
          environment: 'node',
        },
      },
      {
        extends: true,
        test: {
          globalSetup: [
            join(import.meta.dirname, './test/viem/setup.global.ts'),
          ],
          setupFiles: [join(import.meta.dirname, './test/viem/setup.ts')],
          name: 'viem',
          root: './src/viem',
          environment: 'node',
        },
      },
      {
        extends: true,
        test: {
          globalSetup: [
            join(import.meta.dirname, './test/viem-attest/setup.global.ts'),
          ],
          name: 'attest/viem',
          root: './src/viem',
          environment: 'node',
          include: ['**/*.bench-d.ts'],
        },
      },
    ],
  },
})
