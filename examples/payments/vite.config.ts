import { spawn } from 'node:child_process'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

function relayServer(): Plugin {
  let relayProcess: ReturnType<typeof spawn> | null = null

  return {
    name: 'relay-server',
    configureServer() {
      // Start the relay server when Vite dev server starts
      relayProcess = spawn('bun', ['--watch', 'relay-server.ts'], {
        stdio: 'inherit',
      })
    },
    closeBundle() {
      // Kill the relay server when Vite closes
      if (relayProcess) {
        relayProcess.kill()
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), relayServer()],
})
