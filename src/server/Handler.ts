import { createRouter, type Router } from '@remix-run/fetch-router'
import * as Base64 from 'ox/Base64'
import * as Hex from 'ox/Hex'
import type * as WebAuthnP256 from 'ox/WebAuthnP256'
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
  const { kv } = options

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
  router.get('/key/challenge', async () => {
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
  router.get('/key/:id', async ({ params }) => {
    const { id } = params

    const publicKey = await kv.get<Hex.Hex>(`credential:${id}`)

    if (!publicKey) return new Response('Credential not found', { status: 404 })

    return Response.json({
      publicKey,
    })
  })

  // Set public key for a credential
  router.post('/key/:id', async ({ params, request }) => {
    const { id } = params
    const { credential, publicKey } = await request.json()

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
