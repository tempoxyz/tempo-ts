import { createRouter, type Router } from '@remix-run/fetch-router'
import { RpcRequest, RpcResponse } from 'ox'
import * as Base64 from 'ox/Base64'
import * as Hex from 'ox/Hex'
import type * as WebAuthnP256 from 'ox/WebAuthnP256'
import { type Chain, type Client, createClient, type Transport } from 'viem'
import type { LocalAccount } from 'viem/accounts'
import { signTransaction } from 'viem/actions'
import type { OneOf } from '../internal/types.js'
import { formatTransaction } from '../viem/Formatters.js'
import * as Transaction from '../viem/Transaction.js'
import * as RequestListener from './internal/requestListener.js'
import type * as Kv from './Kv.js'

export type Handler = Router & {
  listener: (req: any, res: any) => void
}

/**
 * Instantiates a new request handler.
 *
 * @param options - constructor options
 * @returns Handler instance
 */
export function from(): Handler {
  const router = createRouter()
  return {
    ...router,
    listener: RequestListener.fromFetchHandler((request) => {
      return router.fetch(request)
    }),
  }
}

/**
 * Defines a Key Manager request handler.
 *
 * @example
 * ### Cloudflare Worker
 *
 * ```ts
 * import { env } from 'cloudflare:workers'
 * import { Handler } from 'tempo.ts/server'
 *
 * export default {
 *   fetch(request) {
 *     return Handler.keyManager({
 *       kv: Kv.cloudflare(env.KEY_STORE),
 *     }).fetch(request)
 *   }
 * }
 * ```
 *
 * @example
 * ### Next.js
 *
 * ```ts
 * import { Handler } from 'tempo.ts/server'
 *
 * const handler = Handler.keyManager({
 *   kv: Kv.memory(),
 * })
 *
 * export GET = handler.fetch
 * export POST = handler.fetch
 * ```
 *
 * @example
 * ### Hono
 *
 * ```ts
 * import { Handler } from 'tempo.ts/server'
 *
 * const handler = Handler.keyManager({
 *   kv: Kv.memory(),
 * })
 *
 * const app = new Hono()
 * app.all('*', handler)
 *
 * export default app
 * ```
 *
 * @example
 * ### Node.js
 *
 * ```ts
 * import { Handler } from 'tempo.ts/server'
 *
 * const handler = Handler.keyManager({
 *   kv: Kv.memory(),
 * })
 *
 * const server = createServer(handler.listener)
 * server.listen(3000)
 * ```
 *
 * @example
 * ### Bun
 *
 * ```ts
 * import { Handler } from 'tempo.ts/server'
 *
 * const handler = Handler.keyManager({
 *   kv: Kv.memory(),
 * })
 *
 * Bun.serve(handler)
 * ```
 *
 * @example
 * ### Deno
 *
 * ```ts
 * import { Handler } from 'tempo.ts/server'
 *
 * const handler = Handler.keyManager({
 *   kv: Kv.memory(),
 * })
 *
 * Deno.serve(handler)
 * ```
 *
 * @example
 * ### Express
 *
 * ```ts
 * import { Handler } from 'tempo.ts/server'
 *
 * const handler = Handler.keyManager({
 *   kv: Kv.memory(),
 * })
 *
 * const app = express()
 * app.use(handler.listener)
 * app.listen(3000)
 * ```
 *
 * @param options - Options.
 * @returns Request handler.
 */
export function keyManager(options: keyManager.Options) {
  const { kv, path = '/key' } = options

  const rp = (() => {
    if (typeof options.rp === 'string')
      return { id: options.rp, name: options.rp }
    if (options.rp)
      return {
        id: options.rp.id,
        name: options.rp.name ?? options.rp.id,
      }
    return undefined
  })()

  const router = from()

  // Get challenge for WebAuthn credential creation
  router.get(`${path}/challenge`, async () => {
    // Generate a random challenge
    const challenge = Hex.random(32)

    // Store challenge in KV with 5 minute expiration
    await kv.set(`challenge:${challenge}`, '1')

    return Response.json({
      challenge,
      ...(rp ? { rp } : {}),
    } satisfies keyManager.ChallengeResponse)
  })

  // Get public key for a credential
  router.get(`${path}/:id`, async ({ params }) => {
    const { id } = params

    const publicKey = await kv.get<Hex.Hex>(`credential:${id}`)

    if (!publicKey) return new Response('Credential not found', { status: 404 })

    return Response.json({
      publicKey,
    })
  })

  // Set public key for a credential
  router.post(`${path}/:id`, async ({ params, request }) => {
    const { id } = params
    const { credential, publicKey } = (await request.json()) as any

    if (!credential)
      return Response.json({ error: 'Missing `credential`' }, { status: 400 })
    if (!publicKey)
      return Response.json({ error: 'Missing `publicKey`' }, { status: 400 })

    // Decode and verify clientDataJSON
    const clientDataJSON = JSON.parse(
      Base64.toString(credential.response.clientDataJSON as unknown as string),
    )

    // Verify challenge
    const challenge = Base64.toHex(clientDataJSON.challenge)

    if (!(await kv.get<string>(`challenge:${challenge}`)))
      return Response.json(
        { error: 'Invalid or expired `challenge`' },
        { status: 400 },
      )

    // Verify type
    if (clientDataJSON.type !== 'webauthn.create')
      return Response.json(
        { error: 'Invalid `clientDataJSON.type`' },
        { status: 400 },
      )

    // Verify origin
    if (
      rp?.id &&
      !rp.id.includes('localhost') &&
      clientDataJSON.origin !== new URL(`https://${rp.id}`).origin
    )
      return Response.json(
        { error: 'Invalid `clientDataJSON.origin`' },
        { status: 400 },
      )

    // Parse authenticatorData
    const authenticatorData = Base64.toBytes(
      (credential.response as any).authenticatorData,
    )

    // Parse flags (byte 32)
    const flags = authenticatorData[32]
    if (!flags)
      return Response.json(
        { error: 'Invalid `authenticatorData`' },
        { status: 400 },
      )

    // Check User Present (UP) flag (bit 0)
    const userPresent = (flags & 0x01) !== 0
    if (!userPresent)
      return Response.json({ error: 'User not present' }, { status: 400 })

    // Consume the challenge (delete it so it can't be reused)
    await kv.delete(`challenge:${challenge}`)

    // Store the public key
    await kv.set(`credential:${id}`, publicKey)

    return new Response(null, { status: 204 })
  })

  return router
}

export declare namespace keyManager {
  export type Options = {
    /** The KV store to use for key management. */
    kv: Kv.Kv
    /** The path to use for the handler. */
    path?: string | undefined
    /** The RP to use for WebAuthn. */
    rp?:
      | string
      | {
          id: string
          name?: string | undefined
        }
      | undefined
  }

  export type ChallengeResponse = {
    challenge: Hex.Hex
    rp?:
      | {
          id: string
          name: string
        }
      | undefined
  }

  export type GetPublicKeyParameters = {
    credential: WebAuthnP256.P256Credential['raw']
  }

  export type SetPublicKeyParameters = {
    credential: WebAuthnP256.P256Credential['raw']
    publicKey: Hex.Hex
  }
}

/**
 * Instantiates a fee payer service request handler that can be used to
 * sponsor the fee for user transactions.
 *
 * @example
 * ### Cloudflare Worker
 *
 * ```ts
 * import { createClient, http } from 'viem'
 * import { privateKeyToAccount } from 'viem/accounts'
 * import { tempo } from 'tempo.ts/chains'
 * import { Handler } from 'tempo.ts/server'
 *
 * const client = createClient({
 *   chain: tempo({ feeToken: '0x20c0000000000000000000000000000000000001' }),
 *   transport: http(),
 * })
 *
 * export default {
 *   fetch(request) {
 *     return Handler.feePayer({
 *       account: privateKeyToAccount('0x...'),
 *       client,
 *     }).fetch(request)
 *   }
 * }
 * ```
 *
 * @example
 * ### Next.js
 *
 * ```ts
 * import { createClient, http } from 'viem'
 * import { privateKeyToAccount } from 'viem/accounts'
 * import { tempo } from 'tempo.ts/chains'
 * import { Handler } from 'tempo.ts/server'
 *
 * const client = createClient({
 *   chain: tempo({ feeToken: '0x20c0000000000000000000000000000000000001' }),
 *   transport: http(),
 * })
 *
 * const handler = Handler.feePayer({
 *   account: privateKeyToAccount('0x...'),
 *   client,
 * })
 *
 * export GET = handler.fetch
 * export POST = handler.fetch
 * ```
 *
 * @example
 * ### Hono
 *
 * ```ts
 * import { createClient, http } from 'viem'
 * import { privateKeyToAccount } from 'viem/accounts'
 * import { tempo } from 'tempo.ts/chains'
 * import { Handler } from 'tempo.ts/server'
 *
 * const client = createClient({
 *   chain: tempo({ feeToken: '0x20c0000000000000000000000000000000000001' }),
 *   transport: http(),
 * })
 *
 * const handler = Handler.feePayer({
 *   account: privateKeyToAccount('0x...'),
 *   client,
 * })
 *
 * const app = new Hono()
 * app.all('*', handler)
 *
 * export default app
 * ```
 *
 * @example
 * ### Node.js
 *
 * ```ts
 * import { createClient, http } from 'viem'
 * import { privateKeyToAccount } from 'viem/accounts'
 * import { tempo } from 'tempo.ts/chains'
 * import { Handler } from 'tempo.ts/server'
 *
 * const client = createClient({
 *   chain: tempo({ feeToken: '0x20c0000000000000000000000000000000000001' }),
 *   transport: http(),
 * })
 *
 * const handler = Handler.feePayer({
 *   account: privateKeyToAccount('0x...'),
 *   client,
 * })
 *
 * const server = createServer(handler.listener)
 * server.listen(3000)
 * ```
 *
 * @example
 * ### Bun
 *
 * ```ts
 * import { createClient, http } from 'viem'
 * import { privateKeyToAccount } from 'viem/accounts'
 * import { tempo } from 'tempo.ts/chains'
 * import { Handler } from 'tempo.ts/server'
 *
 * const client = createClient({
 *   account: privateKeyToAccount('0x...'),
 *   chain: tempo({
 *     feeToken: '0x20c0000000000000000000000000000000000001',
 *   }),
 *   transport: http(),
 * })
 *
 * const handler = Handler.feePayer({
 *   account: privateKeyToAccount('0x...'),
 *   client,
 * })
 *
 * Bun.serve(handler)
 * ```
 *
 * @example
 * ### Deno
 *
 * ```ts
 * import { createClient, http } from 'viem'
 * import { privateKeyToAccount } from 'viem/accounts'
 * import { tempo } from 'tempo.ts/chains'
 * import { Handler } from 'tempo.ts/server'
 *
 * const client = createClient({
 *   chain: tempo({ feeToken: '0x20c0000000000000000000000000000000000001' }),
 *   transport: http(),
 * })
 *
 * const handler = Handler.feePayer({
 *   account: privateKeyToAccount('0x...'),
 *   client,
 * })
 *
 * Deno.serve(handler)
 * ```
 *
 * @example
 * ### Express
 *
 * ```ts
 * import { createClient, http } from 'viem'
 * import { privateKeyToAccount } from 'viem/accounts'
 * import { tempo } from 'tempo.ts/chains'
 * import { Handler } from 'tempo.ts/server'
 *
 * const client = createClient({
 *   chain: tempo({ feeToken: '0x20c0000000000000000000000000000000000001' }),
 *   transport: http(),
 * })
 *
 * const handler = Handler.feePayer({
 *   account: privateKeyToAccount('0x...'),
 *   client,
 * })
 *
 * const app = express()
 * app.use(handler.listener)
 * app.listen(3000)
 * ```
 *
 * @param options - Options.
 * @returns Request handler.
 */
export function feePayer(options: feePayer.Options) {
  const { account, onRequest, path = '/fee-payer' } = options

  const client = (() => {
    if ('client' in options) return options.client!
    if ('chain' in options && 'transport' in options)
      return createClient({
        chain: options.chain,
        transport: options.transport,
      })
    throw new Error('No client or chain provided')
  })()

  const router = from()

  router.post(path, async ({ request: req }) => {
    const request = RpcRequest.from((await req.json()) as any)

    await onRequest?.(request)

    if (request.method === 'eth_signTransaction') {
      const transactionRequest = formatTransaction(request.params?.[0] as never)

      const serializedTransaction = await signTransaction(client, {
        ...transactionRequest,
        account,
        // @ts-expect-error
        feePayer: account,
      })

      return Response.json(
        RpcResponse.from({ result: serializedTransaction }, { request }),
      )
    }

    if ((request as any).method === 'eth_signRawTransaction') {
      const serialized = request.params?.[0] as `0x76${string}`
      const transaction = Transaction.deserialize(serialized)

      const serializedTransaction = await signTransaction(client, {
        ...transaction,
        account,
        // @ts-expect-error
        feePayer: account,
      })

      return Response.json(
        RpcResponse.from({ result: serializedTransaction }, { request }),
      )
    }

    if (
      request.method === 'eth_sendRawTransaction' ||
      request.method === 'eth_sendRawTransactionSync'
    ) {
      const serialized = request.params?.[0] as `0x76${string}`
      const transaction = Transaction.deserialize(serialized)

      const serializedTransaction = await signTransaction(client, {
        ...transaction,
        account,
        // @ts-expect-error
        feePayer: account,
      })

      const result = await client.request({
        method: request.method,
        params: [serializedTransaction],
      })

      return Response.json(RpcResponse.from({ result }, { request }))
    }

    return Response.json(
      RpcResponse.from(
        {
          error: new RpcResponse.MethodNotSupportedError({
            message: `Method not supported: ${request.method}`,
          }),
        },
        { request },
      ),
      { status: 400 },
    )
  })

  return router
}

export declare namespace feePayer {
  export type Options = {
    /** Account to use as the fee payer. */
    account: LocalAccount
    /** Function to call before handling the request. */
    onRequest?: (request: RpcRequest.RpcRequest) => Promise<void>
    /** Path to use for the handler. */
    path?: string | undefined
  } & OneOf<
    | {
        /** Client to use. */
        client: Client
      }
    | {
        /** Chain to use. */
        chain: Chain
        /** Transport to use. */
        transport: Transport
      }
  >
}
