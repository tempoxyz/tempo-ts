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
    testTimeout: 30_000,
    reporters: process.env.CI ? ['tree'] : [],
    projects: [
      {
        extends: true,
        test: {
          name: 'ox',
          root: './src/ox',
          environment: 'node',
          include: ['**/*.{test,spec}.?(c|m)[jt]s?(x)', '**/*.test-d.ts'],
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
          include: ['**/*.{test,spec}.?(c|m)[jt]s?(x)', '**/*.test-d.ts'],
          typecheck: {
            enabled: true,
          },
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
          globalSetup: [
            join(import.meta.dirname, './test/wagmi/setup.global.ts'),
          ],
          setupFiles: [join(import.meta.dirname, './test/wagmi/setup.ts')],
          name: 'wagmi',
          root: './src/wagmi',
        },
      },
    ],
  },
})
