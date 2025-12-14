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
