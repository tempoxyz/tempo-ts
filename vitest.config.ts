import { join } from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      tempo: join(import.meta.dirname, './src'),
    },
  },
  test: {
    retry: 3,
    testTimeout: 20_000,
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
          globalSetup: [join(import.meta.dirname, './test/setup.global.ts')],
          setupFiles: [join(import.meta.dirname, './test/setup.ts')],
          name: 'viem',
          root: './src/viem',
          environment: 'node',
        },
      },
    ],
  },
})
