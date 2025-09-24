import * as fs from 'node:fs'
import { toArgs } from 'prool'
import { defineInstance } from 'prool/instances'
import { execa } from 'prool/processes'
import chainJson from './internal/chain.json' with { type: 'json' }

/**
 * Defines a Tempo instance.
 *
 * @example
 * ```ts
 * const instance = tempo()
 * await instance.start()
 * // ...
 * await instance.stop()
 * ```
 */
export const tempo = defineInstance((parameters: tempo.Parameters = {}) => {
  const { binary = 'tempo', ...args } = parameters

  const name = 'tempo'
  const process = execa({ name })

  return {
    _internal: {
      args,
      get process() {
        return process._internal.process
      },
    },
    host: args.host ?? 'localhost',
    name,
    port: args.port ?? 8545,
    async start({ port = args.port }, options) {
      fs.mkdirSync('./tmp', { recursive: true })
      fs.writeFileSync('./tmp/chain.json', JSON.stringify(chainJson, null, 2))
      return await process.start(
        ($) =>
          $`${binary} node --http ${toArgs({
            ...args,
            port,
            datadir: './tmp/data',
          })}`,
        {
          ...options,
          resolver({ process, reject, resolve }) {
            process.stdout.on('data', (data) => {
              const message = data.toString()
              if (message.includes('shutting down')) reject(message)
              if (message.includes('RPC HTTP server started')) resolve()
            })
            process.stderr.on('data', (data) => {
              const message = data.toString()
              reject(message)
            })
          },
        },
      )
    },
    async stop() {
      fs.rmdirSync('./tmp', { recursive: true })
      await process.stop()
    },
  }
})

export namespace tempo {
  export type Parameters = {
    /**
     * Path or alias to the Tempo binary.
     */
    binary?: string | undefined
    /**
     * Host the server will listen on.
     */
    host?: string | undefined
    /**
     * Port the server will listen on.
     */
    port?: number | undefined
  }
}