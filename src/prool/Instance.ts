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
    consensusConfig = path.resolve(
      import.meta.dirname,
      './internal/consensus.toml',
    ),
    dev,
    faucet,
    ...args
  } = parameters
  const { deadline = 3, gaslimit = 3000000000, maxTasks = 8 } = builder ?? {}
  const { blockTime = '2ms' } = dev ?? {}
  const {
    address = '0x20c0000000000000000000000000000000000001',
    amount = 1000000000000000,
    privateKey = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
  } = faucet ?? {}

  const name = 'tempo'
  const process = execa({ name })

  const tmp = `./tmp/${crypto.randomUUID()}`

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
      try {
        fs.rmSync(tmp, { recursive: true })
      } catch {}
      fs.mkdirSync(tmp, { recursive: true })
      return await process.start(
        ($) =>
          $`${binary} node --http --dev --engine.disable-precompile-cache --faucet.enabled ${toArgs(
            {
              ...args,
              builder: {
                deadline,
                gaslimit,
                maxTasks,
              },
              chain,
              consensusConfig,
              datadir: `${tmp}/data`,
              dev: {
                blockTime,
              },
              faucet: {
                address,
                amount,
                privateKey,
              },
              port: port! + 1,
              http: {
                api: 'all',
                addr: '0.0.0.0',
                port: port!,
              },
              ws: {
                port: port! + 2,
              },
              authrpc: {
                port: port! + 3,
              },
            },
          )}`,
        {
          ...options,
          resolver({ process, reject, resolve }) {
            process.stdout.on('data', (data) => {
              const message = data.toString()
              if (message.includes('shutting down')) reject(message)
              if (message.includes('RPC HTTP server started'))
                setTimeout(() => resolve(), 500)
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
      try {
        fs.rmSync(tmp, { recursive: true })
      } catch {}
      await process.stop()
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
     * Consensus configuration for this node.
     */
    consensusConfig?: string | undefined
    /**
     * Development options.
     */
    dev?:
      | {
          /**
           * Interval between blocks.
           */
          blockTime?: number | undefined
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
     * Host the server will listen on.
     */
    host?: string | undefined
    /**
     * Port the server will listen on.
     */
    port?: number | undefined
  }
}
