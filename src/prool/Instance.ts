import * as cp from 'node:child_process'
import * as path from 'node:path'
import { setTimeout } from 'node:timers/promises'
import { toArgs } from 'prool'
import { defineInstance } from 'prool/instances'
import { execa } from 'prool/processes'

let pulled = false

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
    builder,
    containerName = `tempo.${crypto.randomUUID()}`,
    chain = path.resolve(import.meta.dirname, './internal/chain.json'),
    image = 'ghcr.io/tempoxyz/tempo',
    dev,
    log: log_,
    faucet,
    tag = 'latest',
    ...args
  } = parameters
  const { deadline = 3, gaslimit = 3000000000, maxTasks = 8 } = builder ?? {}
  const { blockTime = '1sec' } = dev ?? {}
  const {
    address = '0x20c0000000000000000000000000000000000001',
    amount = '1000000000000',
    privateKey = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
  } = faucet ?? {}

  const log = (() => {
    try {
      return JSON.parse(log_ as string)
    } catch {
      return log_
    }
  })()

  const name = 'tempo'
  const process_ = execa({ name })

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
      if (!pulled) {
        cp.spawnSync('docker', [
          'pull',
          `${image}:${tag}`,
          '--platform',
          'linux/x86_64',
        ])
        pulled = true
      }

      const rustLog = log && typeof log !== 'boolean' ? log : ''

      return await process_.start(
        ($) =>
          $`docker run \
              --name ${containerName} \
              --network host \
              --platform linux/x86_64 \
              --add-host host.docker.internal:host-gateway \
              --add-host localhost:host-gateway \
              -v ${chain}:/chain.json \
              -p ${port!}:${port!} \
              -e RUST_LOG=${rustLog} \
              ${image}:${tag} \
              node \
              --dev \
              --engine.disable-precompile-cache \
              --engine.legacy-state-root \
              --faucet.enabled \
              --http \
              ${toArgs({
                ...args,
                builder: {
                  deadline,
                  gaslimit,
                  maxTasks,
                },
                chain: '/chain.json',
                datadir: '/data',
                dev: {
                  blockTime,
                },
                faucet: {
                  address,
                  amount,
                  privateKey,
                },
                http: {
                  api: 'all',
                  addr: '0.0.0.0',
                  corsdomain: '*',
                  port: port!,
                },
                port: port! + 10,
                txpool: {
                  pendingMaxCount: '10000000000000',
                  basefeeMaxCount: '10000000000000',
                  queuedMaxCount: '10000000000000',
                  pendingMaxSize: '10000',
                  basefeeMaxSize: '10000',
                  queuedMaxSize: '10000',
                  maxAccountSlots: '500000',
                },
                ws: {
                  port: port! + 20,
                },
                authrpc: {
                  port: port! + 30,
                },
              })}`,
        {
          ...options,
          resolver({ process, reject, resolve }) {
            process.stdout.on('data', (data) => {
              const message = data.toString()
              if (log) console.log(message)
              if (message.includes('shutting down')) reject(message)
              if (message.includes('RPC HTTP server started'))
                setTimeout(2000).then(resolve)
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
      cp.spawnSync('docker', ['rm', '-f', containerName])
    },
  }
})

export declare namespace tempo {
  export type Parameters = {
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
     * Name of the container.
     */
    containerName?: string | undefined
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
     * Docker image to use.
     */
    image?: string | undefined
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
    /**
     * Tag of the image to use.
     */
    tag?: string | undefined
  }
}
