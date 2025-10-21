import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { Instance } from '../src/prool/index.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'tempo-node',
      async configureServer(_server) {
        if (process.env.VITE_LOCAL !== 'true') return

        const instance = Instance.tempo({
          dev: { blockTime: '500ms' },
          port: 8545,
        })
        console.log('→ starting tempo node...')
        await instance.start()
        console.log('✔︎ tempo node started on port 8545')
      },
    },
  ],
})
