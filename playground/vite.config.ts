import react from '@vitejs/plugin-react'
import { Instance } from 'prool'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'tempo-node',
      async configureServer(_server) {
        if (process.env.VITE_NODE_ENV !== 'localnet') return

        const instance = Instance.tempo({
          blockTime: '500ms',
          port: 8545,
        })
        console.log('→ starting tempo node...')
        await instance.start()
        console.log('✔︎ tempo node started on port 8545')
      },
    },
  ],
})
