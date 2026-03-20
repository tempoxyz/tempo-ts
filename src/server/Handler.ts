import {
  createRouter,
  type Middleware,
  type Router,
  type RouterOptions,
} from '@remix-run/fetch-router'
import { RpcRequest, RpcResponse } from 'ox'
import * as Base64 from 'ox/Base64'
import * as Hex from 'ox/Hex'
import type * as WebAuthnP256 from 'ox/WebAuthnP256'
import { type Chain, type Client, createClient, type Transport } from 'viem'
import type { LocalAccount } from 'viem/accounts'
import { signTransaction } from 'viem/actions'
import { Transaction } from 'viem/tempo'

import type { OneOf } from '../internal/types.js'
import * as RequestListener from './internal/requestListener.js'
import type * as Kv from './Kv.js'

export type Handler = Router & {
  listener: (req: any, res: any) => void
}

export function compose(handlers: Handler[], options: compose.Options = {}): Handler {
  const path = options.path ?? '/'

  return from({
    ...options,
    async defaultHandler(context) {
      const url = new URL(context.request.url)
      if (!url.pathname.startsWith(path)) return new Response('Not Found', { status: 404 })

      url.pathname = url.pathname.replace(path, '')
      for (const handler of handlers) {
        const request = new Request(url, context.request.clone())
        const response = await handler.fetch(request)
        if (response.status !== 404) return response
      }
      return new Response('Not Found', { status: 404 })
    },
  })
}

export declare namespace compose {
  export type Options = from.Options & {
    /** The path to use for the handler. */
    path?: string | undefined
  }
}

/**
 * Instantiates a new request handler.
 *
 * @param options - constructor options
 * @returns Handler instance
 */
export function from(options: from.Options = {}): Handler {
  const corsHeaders = corsToHeaders(options.cors)
  const mergedHeaders = new Headers(corsHeaders)
  for (const [key, value] of normalizeHeaders(options.headers).entries())
    mergedHeaders.set(key, value)

  const router = createRouter({
    ...options,
    middleware: [headers(mergedHeaders), preflight(mergedHeaders)],
  })

  return {
    ...router,
    listener: RequestListener.fromFetchHandler((request) => {
      return router.fetch(request)
    }),
  }
}

export declare namespace from {
  export type Options = RouterOptions & {
    /**
     * CORS configuration.
     * - `true` (default): Allow all origins with default methods/headers
     * - `false`: Disable CORS headers
     * - Object: Custom CORS configuration
     */
    cors?: boolean | Cors | undefined
    /** Headers to add to the response. */
    headers?: Headers | Record<string, string> | undefined
  }

  export type Cors = {
    /** Allowed origins. Defaults to `'*'`. */
    origin?: string | string[] | undefined
    /** Allowed methods. Defaults to `'GET, POST, PUT, DELETE, OPTIONS'`. */
    methods?: string | undefined
    /** Allowed headers. Defaults to `'Content-Type'`. */
    headers?: string | undefined
    /** Whether to allow credentials. */
    credentials?: boolean | undefined
    /** Max age for preflight cache in seconds. */
    maxAge?: number | undefined
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

  const path = options.path ?? ''

  const rp = (() => {
    if (typeof options.rp === 'string') return { id: options.rp, name: options.rp }
    if (options.rp)
      return {
        id: options.rp.id,
        name: options.rp.name ?? options.rp.id,
      }
    return undefined
  })()

  const router = from(options)

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
    const { id } = params as { id: string }

    const publicKey = await kv.get<Hex.Hex>(`credential:${id}`)

    if (!publicKey) return new Response('Credential not found', { status: 404 })

    return Response.json({
      publicKey,
    })
  })

  // Set public key for a credential
  router.post(`${path}/:id`, async ({ params, request }) => {
    const { id } = params as { id: string }
    const { credential, publicKey } = (await request.json()) as any

    if (!credential) return Response.json({ error: 'Missing `credential`' }, { status: 400 })
    if (!publicKey) return Response.json({ error: 'Missing `publicKey`' }, { status: 400 })

    // Decode and verify clientDataJSON
    const clientDataJSON = JSON.parse(
      Base64.toString(credential.response.clientDataJSON as unknown as string),
    )

    // Verify challenge
    const challenge = Base64.toHex(clientDataJSON.challenge)

    if (!(await kv.get<string>(`challenge:${challenge}`)))
      return Response.json({ error: 'Invalid or expired `challenge`' }, { status: 400 })

    // Verify type
    if (clientDataJSON.type !== 'webauthn.create')
      return Response.json({ error: 'Invalid `clientDataJSON.type`' }, { status: 400 })

    // Verify origin
    if (
      rp?.id &&
      !rp.id.includes('localhost') &&
      clientDataJSON.origin !== new URL(`https://${rp.id}`).origin
    )
      return Response.json({ error: 'Invalid `clientDataJSON.origin`' }, { status: 400 })

    // Parse authenticatorData
    const authenticatorData = Base64.toBytes((credential.response as any).authenticatorData)

    // Parse flags (byte 32)
    const flags = authenticatorData[32]
    if (!flags) return Response.json({ error: 'Invalid `authenticatorData`' }, { status: 400 })

    // Check User Present (UP) flag (bit 0)
    const userPresent = (flags & 0x01) !== 0
    if (!userPresent) return Response.json({ error: 'User not present' }, { status: 400 })

    // Consume the challenge (delete it so it can't be reused)
    await kv.delete(`challenge:${challenge}`)

    // Store the public key
    await kv.set(`credential:${id}`, publicKey)

    return new Response(null, { status: 204 })
  })

  return router
}

export declare namespace keyManager {
  export type Options = from.Options & {
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
 * import { tempo } from 'viem/chains'
 * import { Handler } from 'tempo.ts/server'
 *
 * const client = createClient({
 *   chain: tempoModerato.extend({ feeToken: '0x20c0000000000000000000000000000000000001' }),
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
 * import { tempo } from 'viem/chains'
 * import { Handler } from 'tempo.ts/server'
 *
 * const client = createClient({
 *   chain: tempoModerato.extend({ feeToken: '0x20c0000000000000000000000000000000000001' }),
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
 * import { tempo } from 'viem/chains'
 * import { Handler } from 'tempo.ts/server'
 *
 * const client = createClient({
 *   chain: tempoModerato.extend({ feeToken: '0x20c0000000000000000000000000000000000001' }),
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
 * import { tempo } from 'viem/chains'
 * import { Handler } from 'tempo.ts/server'
 *
 * const client = createClient({
 *   chain: tempoModerato.extend({ feeToken: '0x20c0000000000000000000000000000000000001' }),
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
 * import { tempo } from 'viem/chains'
 * import { Handler } from 'tempo.ts/server'
 *
 * const client = createClient({
 *   account: privateKeyToAccount('0x...'),
 *   chain: tempoModerato.extend({
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
 * import { tempo } from 'viem/chains'
 * import { Handler } from 'tempo.ts/server'
 *
 * const client = createClient({
 *   chain: tempoModerato.extend({ feeToken: '0x20c0000000000000000000000000000000000001' }),
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
 * import { tempo } from 'viem/chains'
 * import { Handler } from 'tempo.ts/server'
 *
 * const client = createClient({
 *   chain: tempoModerato.extend({ feeToken: '0x20c0000000000000000000000000000000000001' }),
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
  const { account, onRequest, path = '/' } = options

  const client = (() => {
    if ('client' in options) return options.client!
    if ('chain' in options && 'transport' in options)
      return createClient({
        chain: options.chain,
        transport: options.transport,
      })
    throw new Error('No client or chain provided')
  })()

  const router = from(options)

  router.post(path, async ({ request: req }) => {
    const request = RpcRequest.from((await req.json()) as any)

    try {
      await onRequest?.(request)

      const method = request.method as string
      if (
        method !== 'eth_signRawTransaction' &&
        method !== 'eth_sendRawTransaction' &&
        method !== 'eth_sendRawTransactionSync'
      )
        return Response.json(
          RpcResponse.from(
            {
              error: new RpcResponse.MethodNotSupportedError({
                message: `Method not supported: ${request.method}`,
              }),
            },
            { request },
          ),
        )

      const serialized = request.params?.[0] as `0x76${string}`

      if (!serialized?.startsWith('0x76') && !serialized?.startsWith('0x78'))
        throw new RpcResponse.InvalidParamsError({
          message: 'Only Tempo (0x76/0x78) transactions are supported.',
        })

      const transaction = Transaction.deserialize(serialized) as any

      if (!transaction.signature || !transaction.from)
        throw new RpcResponse.InvalidParamsError({
          message: 'Transaction must be signed by the sender before fee payer signing.',
        })

      const serializedTransaction = await signTransaction(client, {
        ...transaction,
        account,
        feePayer: account,
      })

      if (method === 'eth_signRawTransaction')
        return Response.json(RpcResponse.from({ result: serializedTransaction }, { request }))

      const result = await (client as any).request({
        method,
        params: [serializedTransaction],
      })

      return Response.json(RpcResponse.from({ result }, { request }))
    } catch (error) {
      return Response.json(
        RpcResponse.from(
          {
            error: new RpcResponse.InternalError({
              message: (error as Error).message,
            }),
          },
          { request },
        ),
      )
    }
  })

  return router
}

export declare namespace feePayer {
  export type Options = from.Options & {
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

/**
 * Defines an Authorization Relay request handler that serves an HTML page
 * for authorizing cross-domain access keys using an existing passkey.
 *
 * @param options - Options.
 * @returns Request handler.
 */
export function authorizationRelay(options: authorizationRelay.Options) {
  const { kv } = options

  const rp = (() => {
    if (!options.rp) return undefined
    return {
      id: options.rp.id,
      name: options.rp.name ?? options.rp.id,
    }
  })()

  const router = from(options)

  // Challenge endpoint for WebAuthn signing
  router.get('/authorize/challenge', async () => {
    const challenge = Hex.random(32)
    await kv.set(`challenge:${challenge}`, '1')

    return Response.json({
      challenge,
      ...(rp ? { rp } : {}),
    })
  })

  // Serve the authorization HTML page
  router.get('/authorize', async ({ request }) => {
    const url = new URL(request.url)
    const keyAddress = url.searchParams.get('keyAddress') ?? ''
    const hash = url.searchParams.get('hash') ?? ''
    const chainId = url.searchParams.get('chainId') ?? ''
    const expiry = url.searchParams.get('expiry') ?? ''
    const origin = url.searchParams.get('origin') ?? ''
    const rpId = rp?.id ?? url.hostname

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Authorize Access Key</title>
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: #0a0a0a;
    color: #e0e0e0;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 1rem;
  }
  .card {
    background: #1a1a1a;
    border: 1px solid #2a2a2a;
    border-radius: 12px;
    padding: 2rem;
    max-width: 420px;
    width: 100%;
  }
  h1 { font-size: 1.25rem; margin-bottom: 1.5rem; color: #fff; }
  .field { margin-bottom: 1rem; }
  .label { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: #888; margin-bottom: 0.25rem; }
  .value { font-size: 0.95rem; font-family: monospace; word-break: break-all; color: #ccc; }
  .origin-value { color: #6ea8fe; }
  .actions { display: flex; gap: 0.75rem; margin-top: 1.5rem; }
  button {
    flex: 1; padding: 0.75rem 1rem; border: none; border-radius: 8px;
    font-size: 0.95rem; font-weight: 600; cursor: pointer; transition: opacity 0.15s;
  }
  button:hover { opacity: 0.85; }
  button:disabled { opacity: 0.4; cursor: not-allowed; }
  .btn-approve { background: #22c55e; color: #000; }
  .btn-deny { background: #333; color: #e0e0e0; }
  .status { margin-top: 1rem; font-size: 0.85rem; color: #888; min-height: 1.2em; }
  .status.error { color: #f87171; }
</style>
</head>
<body>
<div class="card">
  <h1>Authorize Access Key</h1>
  <div class="field">
    <div class="label">Access Key</div>
    <div class="value" id="keyAddress"></div>
  </div>
  <div class="field">
    <div class="label">Expires</div>
    <div class="value" id="expiry"></div>
  </div>
  <div class="field">
    <div class="label">Requesting Origin</div>
    <div class="value origin-value" id="origin"></div>
  </div>
  <div class="field">
    <div class="label">Chain ID</div>
    <div class="value" id="chainId"></div>
  </div>
  <div class="actions">
    <button class="btn-deny" id="denyBtn">Deny</button>
    <button class="btn-approve" id="approveBtn">Approve</button>
  </div>
  <div class="status" id="status"></div>
</div>
<script>
(function() {
  var params = {
    keyAddress: ${JSON.stringify(keyAddress)},
    hash: ${JSON.stringify(hash)},
    chainId: ${JSON.stringify(chainId)},
    expiry: ${JSON.stringify(expiry)},
    origin: ${JSON.stringify(origin)},
  };
  var rpId = ${JSON.stringify(rpId)};

  var truncated = params.keyAddress.length > 12
    ? params.keyAddress.slice(0, 6) + '...' + params.keyAddress.slice(-4)
    : params.keyAddress;
  document.getElementById('keyAddress').textContent = truncated;

  var expiryNum = parseInt(params.expiry, 10);
  document.getElementById('expiry').textContent = expiryNum
    ? new Date(expiryNum * 1000).toLocaleString()
    : 'Unknown';

  document.getElementById('origin').textContent = params.origin || 'Unknown';
  document.getElementById('chainId').textContent = params.chainId || 'Unknown';

  var statusEl = document.getElementById('status');

  function hexToBytes(hex) {
    var h = hex.startsWith('0x') ? hex.slice(2) : hex;
    var bytes = new Uint8Array(h.length / 2);
    for (var i = 0; i < h.length; i += 2)
      bytes[i / 2] = parseInt(h.substring(i, i + 2), 16);
    return bytes;
  }

  function bufferToBase64url(buf) {
    var bytes = new Uint8Array(buf);
    var str = '';
    for (var i = 0; i < bytes.length; i++) str += String.fromCharCode(bytes[i]);
    return btoa(str).replace(/\\+/g, '-').replace(/\\//g, '_').replace(/=+$/, '');
  }

  function bytesToHex(bytes) {
    var hex = '0x';
    for (var i = 0; i < bytes.length; i++) hex += bytes[i].toString(16).padStart(2, '0');
    return hex;
  }

  function sendResult(msg) {
    if (window.opener) {
      window.opener.postMessage(msg, params.origin || '*');
    }
    setTimeout(function() { window.close(); }, 200);
  }

  document.getElementById('denyBtn').addEventListener('click', function() {
    sendResult({ type: 'keyAuthorization', error: 'denied' });
  });

  document.getElementById('approveBtn').addEventListener('click', async function() {
    var approveBtn = document.getElementById('approveBtn');
    var denyBtn = document.getElementById('denyBtn');
    approveBtn.disabled = true;
    denyBtn.disabled = true;
    statusEl.textContent = 'Waiting for passkey...';
    statusEl.className = 'status';

    try {
      var challenge = hexToBytes(params.hash);

      var assertion = await navigator.credentials.get({
        publicKey: {
          challenge: challenge,
          rpId: rpId,
          userVerification: 'required',
        },
      });

      var response = assertion.response;

      var result = {
        type: 'keyAuthorization',
        credential: {
          id: assertion.id,
          rawId: bufferToBase64url(assertion.rawId),
          response: {
            authenticatorData: bufferToBase64url(response.authenticatorData),
            clientDataJSON: bufferToBase64url(response.clientDataJSON),
            signature: bufferToBase64url(response.signature),
          },
          type: assertion.type,
        },
      };

      sendResult(result);
    } catch (err) {
      statusEl.textContent = 'Error: ' + (err.message || 'Passkey signing failed');
      statusEl.className = 'status error';
      approveBtn.disabled = false;
      denyBtn.disabled = false;
    }
  });
})();
</script>
</body>
</html>`

    return new Response(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    })
  })

  return router
}

export declare namespace authorizationRelay {
  export type Options = from.Options & {
    /** The KV store to use for challenge management. */
    kv: Kv.Kv
    /** The RP to use for WebAuthn. */
    rp?: { id: string; name?: string } | undefined
    /** CORS configuration. */
    cors?: from.Options['cors'] | undefined
  }
}

/** @internal */
function normalizeHeaders(headers?: Headers | Record<string, string>): Headers {
  if (!headers) return new Headers()
  if (headers instanceof Headers) return headers
  return new Headers(headers)
}

/** @internal */
function corsToHeaders(cors?: boolean | from.Cors): Headers {
  if (cors === false) return new Headers()

  const config = cors === true || cors === undefined ? {} : cors

  const headers = new Headers()
  const origin = Array.isArray(config.origin) ? config.origin.join(', ') : (config.origin ?? '*')
  headers.set('Access-Control-Allow-Origin', origin)
  headers.set('Access-Control-Allow-Methods', config.methods ?? 'GET, POST, PUT, DELETE, OPTIONS')
  headers.set('Access-Control-Allow-Headers', config.headers ?? 'Content-Type')
  if (config.credentials) headers.set('Access-Control-Allow-Credentials', 'true')
  if (config.maxAge !== undefined) headers.set('Access-Control-Max-Age', String(config.maxAge))

  return headers
}

/** @internal */
function headers(headers: Headers): Middleware {
  return async (_, next) => {
    const response = await next()
    const responseHeaders = new Headers(response.headers)
    for (const [key, value] of headers.entries()) responseHeaders.set(key, value)
    return new Response(response.body, {
      headers: responseHeaders,
      status: response.status,
      statusText: response.statusText,
    })
  }
}

/** @internal */
function preflight(headers: Headers): Middleware {
  return async (context) => {
    if (context.request.method === 'OPTIONS') return new Response(null, { headers })
  }
}
