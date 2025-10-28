import * as fs from 'node:fs'
import * as path from 'node:path'
import { toArgs } from 'prool'
import { defineInstance } from 'prool/instances'
import { execa } from 'prool/processes'

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
  const {
    binary = 'tempo',
    builder,
    chain = path.resolve(import.meta.dirname, './internal/chain.json'),
    dev,
    faucet,
    log = process.env.RUST_LOG,
    ...args
  } = parameters
  const { deadline = 3, gaslimit = 3000000000, maxTasks = 8 } = builder ?? {}
  const { blockTime = '1sec' } = dev ?? {}
  const {
    address = '0x20c0000000000000000000000000000000000001',
    amount = 1000000000000000,
    privateKey = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
  } = faucet ?? {}

  const name = 'tempo'
  const process_ = execa({ name })

  const tmp = `./tmp/${crypto.randomUUID()}`

  return {
    _internal: {
      args,
      get process() {
        return process_._internal.process
      },
    },
    host: args.host ?? 'localhost',
    name,
    port: args.port ?? 8545,
    async start({ port = args.port }, options) {
      try {
        fs.rmSync(tmp, { recursive: true })
      } catch {}
      fs.mkdirSync(tmp, { recursive: true })

      const env: Record<string, string> = {}
      if (log && typeof log !== 'boolean') env.RUST_LOG = log

      return await process_.start(
        ($) =>
          $(
            Object.keys(env).length > 0 ? { env } : {},
          )`${binary} node --http --dev --no-consensus --engine.disable-precompile-cache --faucet.enabled ${toArgs(
            {
              ...args,
              builder: {
                deadline,
                gaslimit,
                maxTasks,
              },
              chain,
              datadir: `${tmp}/data`,
              dev: {
                blockTime,
              },
              faucet: {
                address,
                amount,
                privateKey,
              },
              port: port! + 10,
              http: {
                api: 'all',
                addr: '0.0.0.0',
                corsdomain: '*',
                port: port!,
              },
              ws: {
                port: port! + 20,
              },
              authrpc: {
                port: port! + 30,
              },
            },
          )}`,
        {
          ...options,
          resolver({ process, reject, resolve }) {
            process.stdout.on('data', (data) => {
              const message = data.toString()
              if (log) console.log(message)
              if (message.includes('shutting down')) reject(message)
              if (message.includes('RPC HTTP server started')) resolve()
            })
            process.stderr.on('data', (data) => {
              const message = data.toString()
              if (log) console.error(message)
              reject(message)
            })
          },
        },
      )
    },
    async stop() {
      try {
        fs.rmSync(tmp, { recursive: true })
      } catch {}
      await process_.stop()
    },
  }
})

export declare namespace tempo {
  export type Parameters = {
    /**
     * Path or alias to the Tempo binary.
     */
    binary?: string | undefined
    /**
     * Builder options.
     */
    builder?:
      | {
          /**
           * The deadline for when the payload builder job should resolve.
           */
          deadline?: number | undefined
          /**
           * Target gas limit for built blocks.
           */
          gaslimit?: bigint | undefined
          /**
           * Maximum number of tasks to spawn for building a payload.
           */
          maxTasks?: number | undefined
        }
      | undefined
    /**
     * Chain this node is running.
     */
    chain?: string | undefined
    /**
     * Development options.
     */
    dev?:
      | {
          /**
           * Interval between blocks.
           */
          blockTime?: string | undefined
        }
      | undefined
    /**
     * Faucet options.
     */
    faucet?:
      | {
          /**
           * Target token address for the faucet to be funding with
           */
          address?: string | undefined
          /**
           * Amount for each faucet funding transaction
           */
          amount?: bigint | undefined
          /**
           * Faucet funding mnemonic
           */
          privateKey?: string | undefined
        }
      | undefined
    /**
     * Rust log level configuration (sets RUST_LOG environment variable).
     * Can be a log level or a custom filter string.
     */
    log?:
      | 'trace'
      | 'debug'
      | 'info'
      | 'warn'
      | 'error'
      | (string & {})
      | boolean
      | undefined
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
