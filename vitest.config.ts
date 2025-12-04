import { join } from 'node:path'
import react from '@vitejs/plugin-react'
import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      'tempo.ts': join(import.meta.dirname, './src'),
    },
  },
  test: {
    retry: 3,
    hookTimeout: 30_000,
    testTimeout: 30_000,
    reporters: process.env.CI ? ['tree'] : [],
    projects: [
      {
        extends: true,
        test: {
          env: {
            RPC_PORT: '3000',
          },
          include: ['**/*.{test,spec}.?(c|m)[jt]s?(x)', '**/*.test-d.ts'],
          globalSetup: [join(import.meta.dirname, './test/ox/setup.global.ts')],
          name: 'ox',
          root: './src/ox',
          sequence: { groupOrder: 0 },
          setupFiles: [join(import.meta.dirname, './test/ox/setup.ts')],
          typecheck: {
            enabled: true,
          },
        },
      },
      {
        extends: true,
        test: {
          name: 'prool',
          root: './src/prool',
          sequence: { groupOrder: 1 },
        },
      },
      {
        extends: true,
        test: {
          env: {
            RPC_PORT: '9545',
          },
          name: 'server',
          root: './src/server',
          globalSetup: [
            join(import.meta.dirname, './test/server/setup.global.ts'),
          ],
          sequence: { groupOrder: 2 },
          setupFiles: [join(import.meta.dirname, './test/server/setup.ts')],
        },
      },
      {
        extends: true,
        test: {
          env: {
            RPC_PORT: '8545',
          },
          globalSetup: [
            join(import.meta.dirname, './test/viem/setup.global.ts'),
          ],
          name: 'viem',
          root: './src/viem',
          environment: 'node',
          include: ['**/*.{test,spec}.?(c|m)[jt]s?(x)', '**/*.test-d.ts'],
          typecheck: {
            enabled: true,
          },
          sequence: { groupOrder: 3 },
          setupFiles: [join(import.meta.dirname, './test/viem/setup.ts')],
        },
      },
      // {
      //   extends: true,
      //   test: {
      //     globalSetup: [
      //       join(import.meta.dirname, './test/viem-attest/setup.global.ts'),
      //     ],
      //     name: 'attest/viem',
      //     root: './src/viem',
      //     environment: 'node',
      //     include: ['**/*.bench-d.ts'],
      //   },
      // },
      {
        extends: true,
        plugins: [react()],
        test: {
          browser: {
            provider: playwright(),
            instances: [{ browser: 'chromium' }],
            enabled: true,
            headless: true,
            screenshotFailures: false,
          },
          env: {
            RPC_PORT: '4000',
          },
          globalSetup: [
            join(import.meta.dirname, './test/wagmi/setup.global.ts'),
          ],
          name: 'wagmi',
          setupFiles: [join(import.meta.dirname, './test/wagmi/setup.ts')],
          root: './src/wagmi',
          sequence: { groupOrder: 4 },
        },
      },
    ],
  },
})
