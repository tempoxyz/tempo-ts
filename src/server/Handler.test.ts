import { Elysia } from 'elysia'
import express from 'express'
import { Hono } from 'hono'
import type { RpcRequest } from 'ox'
import * as Base64 from 'ox/Base64'
import * as Hex from 'ox/Hex'
import { sendTransactionSync } from 'viem/actions'
import { withFeePayer } from 'viem/tempo'
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
} from 'vitest'
import { accounts, getClient, http } from '../../test/server/config.js'
import { createServer, type Server } from '../../test/server/utils.js'
import * as Handler from './Handler.js'
import * as Kv from './Kv.js'

describe('compose', () => {
  test('default', async () => {
    const handler1 = Handler.from()
    handler1.get('/test', () => new Response('test'))
    const handler2 = Handler.from()
    handler2.get('/test2', () => new Response('test2'))

    const handler = Handler.compose([handler1, handler2])
    expect(handler).toBeDefined()

    {
      const response = await handler.fetch(new Request('http://localhost/test'))
      expect(response.status).toBe(200)
      expect(await response.text()).toBe('test')
    }

    {
      const response = await handler.fetch(
        new Request('http://localhost/test2'),
      )
      expect(response.status).toBe(200)
      expect(await response.text()).toBe('test2')
    }
  })

  test('behavior: path', async () => {
    const handler1 = Handler.from()
    handler1.get('/test', () => new Response('test'))
    const handler2 = Handler.from()
    handler2.get('/test2', () => new Response('test2'))

    const handler = Handler.compose([handler1, handler2], {
      path: '/api',
    })
    expect(handler).toBeDefined()

    {
      const response = await handler.fetch(
        new Request('http://localhost/api/test'),
      )
      expect(response.status).toBe(200)
      expect(await response.text()).toBe('test')
    }

    {
      const response = await handler.fetch(
        new Request('http://localhost/api/test2'),
      )
      expect(response.status).toBe(200)
      expect(await response.text()).toBe('test2')
    }
  })

  test('behavior: headers', async () => {
    const handler1 = Handler.from()
    handler1.get('/test', () => new Response('test'))
    const handler2 = Handler.from()
    handler2.get('/test2', () => new Response('test2'))

    const headers = new Headers({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    })

    const handler = Handler.compose([handler1, handler2], {
      headers,
    })

    {
      const response = await handler.fetch(new Request('http://localhost/test'))
      expect(response.status).toBe(200)
      expect(await response.text()).toBe('test')
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*')
      expect(response.headers.get('Access-Control-Allow-Methods')).toBe(
        'POST, OPTIONS',
      )
      expect(response.headers.get('Access-Control-Allow-Headers')).toBe(
        'Content-Type, Authorization',
      )
    }

    {
      const response = await handler.fetch(
        new Request('http://localhost/test2'),
      )
      expect(response.status).toBe(200)
      expect(await response.text()).toBe('test2')
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*')
    }
  })

  test('behavior: headers + path', async () => {
    const handler1 = Handler.from()
    handler1.get('/test', () => new Response('test'))
    const handler2 = Handler.from()
    handler2.get('/test2', () => new Response('test2'))

    const headers = new Headers({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
    })

    const handler = Handler.compose([handler1, handler2], {
      headers,
      path: '/api',
    })

    {
      const response = await handler.fetch(
        new Request('http://localhost/api/test'),
      )
      expect(response.status).toBe(200)
      expect(await response.text()).toBe('test')
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*')
      expect(response.headers.get('Access-Control-Allow-Methods')).toBe(
        'POST, OPTIONS',
      )
    }

    {
      const response = await handler.fetch(
        new Request('http://localhost/api/test2'),
      )
      expect(response.status).toBe(200)
      expect(await response.text()).toBe('test2')
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*')
    }
  })

  test('behavior: headers + OPTIONS', async () => {
    const handler1 = Handler.from()
    handler1.get('/test', () => new Response('test'))

    const headers = new Headers({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    })

    const handler = Handler.compose([handler1], {
      headers,
    })

    const response = await handler.fetch(
      new Request('http://localhost/test', {
        method: 'OPTIONS',
      }),
    )

    expect(response.status).toBe(200)
    expect(await response.text()).toBe('')
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*')
    expect(response.headers.get('Access-Control-Allow-Methods')).toBe(
      'POST, OPTIONS',
    )
    expect(response.headers.get('Access-Control-Allow-Headers')).toBe(
      'Content-Type, Authorization',
    )
    expect(response.headers.get('Access-Control-Max-Age')).toBe('86400')
  })

  test('behavior: headers + 404', async () => {
    const handler1 = Handler.from()
    handler1.get('/test', () => new Response('test'))

    const headers = new Headers({
      'Access-Control-Allow-Origin': '*',
    })

    const handler = Handler.compose([handler1], {
      headers,
    })

    const response = await handler.fetch(
      new Request('http://localhost/nonexistent'),
    )

    expect(response.status).toBe(404)
    expect(await response.text()).toBe('Not Found')
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*')
  })

  test('behavior: headers propagation from child handlers', async () => {
    const handler1 = Handler.from()
    handler1.get('/test', () => {
      const response = new Response('test')
      response.headers.set('X-Custom-Header', 'custom-value')
      return response
    })

    const headers = new Headers({
      'Access-Control-Allow-Origin': '*',
    })

    const handler = Handler.compose([handler1], {
      headers,
    })

    const response = await handler.fetch(new Request('http://localhost/test'))

    expect(response.status).toBe(200)
    expect(await response.text()).toBe('test')
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*')
    expect(response.headers.get('X-Custom-Header')).toBe('custom-value')
  })

  test('behavior: headers with child handler headers', async () => {
    const childHeaders = new Headers({
      'X-Child-Header': 'child-value',
    })
    const handler1 = Handler.from({ headers: childHeaders })
    handler1.get('/test', () => new Response('test'))

    const parentHeaders = new Headers({
      'Access-Control-Allow-Origin': '*',
      'X-Parent-Header': 'parent-value',
    })

    const handler = Handler.compose([handler1], {
      headers: parentHeaders,
    })

    const response = await handler.fetch(new Request('http://localhost/test'))

    expect(response.status).toBe(200)
    expect(await response.text()).toBe('test')
    // Both parent and child headers should be present
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*')
    expect(response.headers.get('X-Parent-Header')).toBe('parent-value')
    expect(response.headers.get('X-Child-Header')).toBe('child-value')
  })

  test('behavior: headers as object', async () => {
    const handler1 = Handler.from()
    handler1.get('/test', () => new Response('test'))

    const handler = Handler.compose([handler1], {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })

    const response = await handler.fetch(new Request('http://localhost/test'))
    expect(response.status).toBe(200)
    expect(await response.text()).toBe('test')
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*')
    expect(response.headers.get('Access-Control-Allow-Methods')).toBe(
      'POST, OPTIONS',
    )
    expect(response.headers.get('Access-Control-Allow-Headers')).toBe(
      'Content-Type, Authorization',
    )
  })

  describe('integration', () => {
    const handler1 = Handler.from()
    handler1.get('/foo', () => new Response('foo'))
    handler1.post('/bar', () => new Response('bar'))

    const handler2 = Handler.from()
    handler2.get('/baz', () => new Response('baz'))
    handler2.post('/qux', () => new Response('qux'))

    const handler = Handler.compose([handler1, handler2], {
      path: '/api',
    })

    test('hono', async () => {
      const app = new Hono()
      app.use((c) => handler.fetch(c.req.raw))

      {
        const response = await app.request('/api/foo')
        expect(await response.text()).toBe('foo')
      }

      {
        const response = await app.request('/api/bar', {
          method: 'POST',
        })
        expect(await response.text()).toBe('bar')
      }

      {
        const response = await app.request('/api/baz', {
          method: 'GET',
        })
        expect(await response.text()).toBe('baz')
      }

      {
        const response = await app.request('/api/qux', {
          method: 'POST',
        })
        expect(await response.text()).toBe('qux')
      }
    })

    test('elysia', async () => {
      const app = new Elysia().all('*', ({ request }) => handler.fetch(request))

      {
        const response = await app.handle(
          new Request('http://localhost/api/foo'),
        )
        expect(await response.text()).toBe('foo')
      }

      {
        const response = await app.handle(
          new Request('http://localhost/api/bar', {
            method: 'POST',
          }),
        )
        expect(await response.text()).toBe('bar')
      }

      {
        const response = await app.handle(
          new Request('http://localhost/api/baz', {
            method: 'GET',
          }),
        )
        expect(await response.text()).toBe('baz')
      }

      {
        const response = await app.handle(
          new Request('http://localhost/api/qux', {
            method: 'POST',
          }),
        )
        expect(await response.text()).toBe('qux')
      }
    })

    test('node.js', async () => {
      const server = await createServer(handler.listener)

      {
        const response = await fetch(`${server.url}/api/foo`)
        expect(await response.text()).toBe('foo')
      }

      {
        const response = await fetch(`${server.url}/api/bar`, {
          method: 'POST',
        })
        expect(await response.text()).toBe('bar')
      }

      {
        const response = await fetch(`${server.url}/api/baz`, {
          method: 'GET',
        })
        expect(await response.text()).toBe('baz')
      }

      {
        const response = await fetch(`${server.url}/api/qux`, {
          method: 'POST',
        })
        expect(await response.text()).toBe('qux')
      }

      await server.closeAsync()
    })

    test('express', async () => {
      const app = express()
      app.use(handler.listener)

      const server = await createServer(app)

      {
        const response = await fetch(`${server.url}/api/foo`)
        expect(await response.text()).toBe('foo')
      }

      {
        const response = await fetch(`${server.url}/api/bar`, {
          method: 'POST',
        })
        expect(await response.text()).toBe('bar')
      }

      {
        const response = await fetch(`${server.url}/api/baz`, {
          method: 'GET',
        })
        expect(await response.text()).toBe('baz')
      }

      {
        const response = await fetch(`${server.url}/api/qux`, {
          method: 'POST',
        })
        expect(await response.text()).toBe('qux')
      }

      await server.closeAsync()
    })
  })
})

describe('from', () => {
  test('default', () => {
    const handler = Handler.from()
    expect(handler).toBeDefined()
  })

  test('.fetch', async () => {
    const handler = Handler.from()
    handler.get('/test', () => new Response('test'))

    const response = await handler.fetch(new Request('http://localhost/test'))
    expect(response.status).toBe(200)
    expect(await response.text()).toBe('test')
  })

  test('.listener', async () => {
    const handler = Handler.from()
    handler.get('/test', () =>
      Response.json({ message: 'hello from listener' }),
    )

    const server = await createServer(handler.listener)

    // Make a request to the server
    const response = await fetch(`${server.url}/test`)
    expect(response.status).toBe(200)

    const data = await response.json()
    expect(data).toEqual({ message: 'hello from listener' })
  })

  test('behavior: headers', async () => {
    const headers = new Headers({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    })

    const handler = Handler.from({ headers })
    handler.get('/test', () => new Response('test'))

    const response = await handler.fetch(new Request('http://localhost/test'))
    expect(response.status).toBe(200)
    expect(await response.text()).toBe('test')
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*')
    expect(response.headers.get('Access-Control-Allow-Methods')).toBe(
      'POST, OPTIONS',
    )
    expect(response.headers.get('Access-Control-Allow-Headers')).toBe(
      'Content-Type, Authorization',
    )
  })

  test('behavior: headers + OPTIONS', async () => {
    const headers = new Headers({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    })

    const handler = Handler.from({ headers })
    handler.get('/test', () => new Response('test'))

    const response = await handler.fetch(
      new Request('http://localhost/test', {
        method: 'OPTIONS',
      }),
    )

    expect(response.status).toBe(200)
    expect(await response.text()).toBe('')
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*')
    expect(response.headers.get('Access-Control-Allow-Methods')).toBe(
      'POST, OPTIONS',
    )
    expect(response.headers.get('Access-Control-Allow-Headers')).toBe(
      'Content-Type, Authorization',
    )
    expect(response.headers.get('Access-Control-Max-Age')).toBe('86400')
  })

  test('behavior: headers + 404', async () => {
    const headers = new Headers({
      'Access-Control-Allow-Origin': '*',
    })

    const handler = Handler.from({ headers })
    handler.get('/test', () => new Response('test'))

    const response = await handler.fetch(
      new Request('http://localhost/nonexistent'),
    )

    expect(response.status).toBe(404)
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*')
  })

  test('behavior: headers propagation from routes', async () => {
    const headers = new Headers({
      'Access-Control-Allow-Origin': '*',
    })

    const handler = Handler.from({ headers })
    handler.get('/test', () => {
      const response = new Response('test')
      response.headers.set('X-Custom-Header', 'custom-value')
      response.headers.set('Content-Type', 'text/plain')
      return response
    })

    const response = await handler.fetch(new Request('http://localhost/test'))

    expect(response.status).toBe(200)
    expect(await response.text()).toBe('test')
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*')
    expect(response.headers.get('X-Custom-Header')).toBe('custom-value')
    expect(response.headers.get('Content-Type')).toBe('text/plain')
  })

  test('behavior: headers as object', async () => {
    const handler = Handler.from({
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })
    handler.get('/test', () => new Response('test'))

    const response = await handler.fetch(new Request('http://localhost/test'))
    expect(response.status).toBe(200)
    expect(await response.text()).toBe('test')
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*')
    expect(response.headers.get('Access-Control-Allow-Methods')).toBe(
      'POST, OPTIONS',
    )
    expect(response.headers.get('Access-Control-Allow-Headers')).toBe(
      'Content-Type, Authorization',
    )
  })

  describe('integration', () => {
    const handler = Handler.from()
    handler.get('/foo', () => new Response('foo'))
    handler.post('/bar', () => new Response('bar'))

    test('hono', async () => {
      const app = new Hono()
      app.use((c) => handler.fetch(c.req.raw))

      {
        const response = await app.request('/foo')
        expect(await response.text()).toBe('foo')
      }

      {
        const response = await app.request('/bar', {
          method: 'POST',
        })
        expect(await response.text()).toBe('bar')
      }
    })

    test('elysia', async () => {
      const app = new Elysia().all('*', ({ request }) => handler.fetch(request))

      {
        const response = await app.handle(new Request('http://localhost/foo'))
        expect(await response.text()).toBe('foo')
      }

      {
        const response = await app.handle(
          new Request('http://localhost/bar', {
            method: 'POST',
          }),
        )
        expect(await response.text()).toBe('bar')
      }
    })

    test('node.js', async () => {
      const server = await createServer(handler.listener)

      {
        const response = await fetch(`${server.url}/foo`)
        expect(await response.text()).toBe('foo')
      }

      {
        const response = await fetch(`${server.url}/bar`, {
          method: 'POST',
        })
        expect(await response.text()).toBe('bar')
      }

      await server.closeAsync()
    })

    test('express', async () => {
      const app = express()
      app.use(handler.listener)

      const server = await createServer(app)

      {
        const response = await fetch(`${server.url}/foo`)
        expect(await response.text()).toBe('foo')
      }

      {
        const response = await fetch(`${server.url}/bar`, {
          method: 'POST',
        })
        expect(await response.text()).toBe('bar')
      }

      await server.closeAsync()
    })
  })
})

describe('keyManager', () => {
  let kv: Kv.Kv
  let handler: Handler.Handler

  const credential = {
    authenticatorAttachment: 'platform',
    clientExtensionResults: { credProps: { rk: true } },
    id: '8S-IAM1gQ2KsH3KNM517PRMdcFQ',
    rawId: '8S-IAM1gQ2KsH3KNM517PRMdcFQ',
    response: {
      attestationObject:
        'o2NmbXRkbm9uZWdhdHRTdG10oGhhdXRoRGF0YViYSZYN5YgOjGh0NBcPZHZgW4_krrmihjLHmVzzuoMdl2NdAAAAAPv8MAcVTk7MjAtuAgVX170AFPEviADNYENirB9yjTOdez0THXBUpQECAyYgASFYIKjtG4n36vPprMvoOCi1rQC6h5EIBVxHoEW0xq1lQQZuIlgg_V4PIauVB6JcokNxrPCa2ueWylzbd8nqma5nLvg5Gs8',
      authenticatorData:
        'SZYN5YgOjGh0NBcPZHZgW4_krrmihjLHmVzzuoMdl2NdAAAAAPv8MAcVTk7MjAtuAgVX170AFPEviADNYENirB9yjTOdez0THXBUpQECAyYgASFYIKjtG4n36vPprMvoOCi1rQC6h5EIBVxHoEW0xq1lQQZuIlgg_V4PIauVB6JcokNxrPCa2ueWylzbd8nqma5nLvg5Gs8',
      clientDataJSON:
        'eyJ0eXBlIjoid2ViYXV0aG4uY3JlYXRlIiwiY2hhbGxlbmdlIjoiOEhURkFrS1E2U2hTbW5MelRra3ZMYkhrXzByU3FteEtRbG9nTy1KdmtvbyIsIm9yaWdpbiI6Imh0dHA6Ly9sb2NhbGhvc3Q6NTE3MyIsImNyb3NzT3JpZ2luIjpmYWxzZX0',
      publicKey:
        'MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEqO0biffq8-msy-g4KLWtALqHkQgFXEegRbTGrWVBBm79Xg8hq5UHolyiQ3Gs8Jra55bKXNt3yeqZrmcu-Dkazw',
      publicKeyAlgorithm: -7,
      transports: ['hybrid', 'internal'],
    },
    type: 'public-key',
  }
  const publicKey =
    '0xa8ed1b89f7eaf3e9accbe83828b5ad00ba879108055c47a045b4c6ad6541066efd5e0f21ab9507a25ca24371acf09adae796ca5cdb77c9ea99ae672ef8391acf'

  beforeEach(() => {
    kv = Kv.memory()
    handler = Handler.keyManager({ kv })
  })

  describe('GET /challenge', () => {
    test('default', async () => {
      const response = await handler.fetch(
        new Request('http://localhost/challenge'),
      )

      expect(response.status).toBe(200)

      const data =
        (await response.json()) as Handler.keyManager.ChallengeResponse
      expect(Hex.validate(data.challenge)).toBe(true)

      // Verify challenge was stored in KV
      const stored = await kv.get(`challenge:${data.challenge}`)
      expect(stored).toBe('1')
    })

    test('behavior: rpId', async () => {
      const handlerWithRpId = Handler.keyManager({
        kv,
        rp: 'example.com',
      })

      const response = await handlerWithRpId.fetch(
        new Request('http://localhost/challenge'),
      )

      expect(response.status).toBe(200)

      const data =
        (await response.json()) as Handler.keyManager.ChallengeResponse
      expect(data.rp).toEqual({
        id: 'example.com',
        name: 'example.com',
      })
    })
  })

  describe('GET /:id', () => {
    test('default', async () => {
      const credentialId = 'test-credential-id'
      const publicKey = '0x1234567890abcdef'

      await kv.set(`credential:${credentialId}`, publicKey)

      const response = await handler.fetch(
        new Request(`http://localhost/${credentialId}`),
      )

      expect(response.status).toBe(200)

      const data = await response.json()
      expect(data).toEqual({ publicKey })
    })

    test('behavior: returns 404 for non-existent credential', async () => {
      const response = await handler.fetch(
        new Request('http://localhost/non-existent'),
      )

      expect(response.status).toBe(404)
      expect(await response.text()).toBe('Credential not found')
    })
  })

  describe('POST /:id', () => {
    test('default', async () => {
      const credentialId = credential.id
      const challenge = Base64.toHex(
        JSON.parse(Base64.toString(credential.response.clientDataJSON))
          .challenge,
      )

      // Store the challenge first
      await kv.set(`challenge:${challenge}`, '1')

      const response = await handler.fetch(
        new Request(`http://localhost/${credentialId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            credential,
            publicKey,
          }),
        }),
      )

      expect(response.status).toBe(204)

      // Verify public key was stored
      const storedPublicKey = await kv.get(`credential:${credentialId}`)
      expect(storedPublicKey).toBe(publicKey)

      // Verify challenge was consumed
      const storedChallenge = await kv.get(`challenge:${challenge}`)
      expect(storedChallenge).toBeUndefined()
    })

    test('behavior: returns 400 when credential is missing', async () => {
      const response = await handler.fetch(
        new Request('http://localhost/test-id', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            publicKey,
          }),
        }),
      )

      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.error).toBe('Missing `credential`')
    })

    test('behavior: returns 400 when publicKey is missing', async () => {
      const response = await handler.fetch(
        new Request('http://localhost/test-id', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            credential,
          }),
        }),
      )

      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.error).toBe('Missing `publicKey`')
    })

    test('behavior: returns 400 for invalid or expired challenge', async () => {
      const response = await handler.fetch(
        new Request(`http://localhost/${credential.id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            credential,
            publicKey,
          }),
        }),
      )

      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.error).toBe('Invalid or expired `challenge`')
    })

    test('behavior: returns 400 for invalid clientDataJSON type', async () => {
      const invalidCredential = {
        ...credential,
        response: {
          ...credential.response,
          clientDataJSON: Base64.fromString(
            JSON.stringify({
              type: 'webauthn.get', // Invalid type
              challenge: '8HTFAkKQ6ShSmnLzTkkvLbHk_0rSqmxKQlogO-Jvkoo',
              origin: 'http://localhost:5173',
              crossOrigin: false,
            }),
          ),
        },
      }

      const challenge = Base64.toHex(
        JSON.parse(
          Base64.toString(invalidCredential.response.clientDataJSON as string),
        ).challenge,
      )
      await kv.set(`challenge:${challenge}`, '1')

      const response = await handler.fetch(
        new Request(`http://localhost/${credential.id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            credential: invalidCredential,
            publicKey,
          }),
        }),
      )

      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.error).toBe('Invalid `clientDataJSON.type`')
    })

    test('behavior: returns 400 for invalid origin when rpId is set', async () => {
      const handlerWithRpId = Handler.keyManager({
        kv,
        rp: 'example.com',
      })

      const challenge = Base64.toHex(
        JSON.parse(Base64.toString(credential.response.clientDataJSON))
          .challenge,
      )
      await kv.set(`challenge:${challenge}`, '1')

      const response = await handlerWithRpId.fetch(
        new Request(`http://localhost/${credential.id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            credential,
            publicKey,
          }),
        }),
      )

      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.error).toBe('Invalid `clientDataJSON.origin`')
    })

    test('behavior: allows localhost origin when rpId includes localhost', async () => {
      const handlerWithLocalhost = Handler.keyManager({
        kv,
        rp: 'localhost',
      })

      const challenge = Base64.toHex(
        JSON.parse(Base64.toString(credential.response.clientDataJSON))
          .challenge,
      )
      await kv.set(`challenge:${challenge}`, '1')

      const response = await handlerWithLocalhost.fetch(
        new Request(`http://localhost/${credential.id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            credential,
            publicKey,
          }),
        }),
      )

      expect(response.status).toBe(204)
    })

    test('behavior: returns 400 when user not present flag is not set', async () => {
      // Create credential with UP flag not set (bit 0 = 0)
      const authenticatorDataBytes = Base64.toBytes(
        credential.response.authenticatorData,
      )
      // Clear the UP flag (bit 0) in byte 32
      authenticatorDataBytes[32] = authenticatorDataBytes[32]! & ~0x01

      const invalidCredential = {
        ...credential,
        response: {
          ...credential.response,
          authenticatorData: Base64.fromBytes(authenticatorDataBytes),
        },
      }

      const challenge = Base64.toHex(
        JSON.parse(Base64.toString(credential.response.clientDataJSON))
          .challenge,
      )
      await kv.set(`challenge:${challenge}`, '1')

      const response = await handler.fetch(
        new Request(`http://localhost/${credential.id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            credential: invalidCredential,
            publicKey,
          }),
        }),
      )

      expect(response.status).toBe(400)
      const data = await response.json()
      expect(data.error).toBe('User not present')
    })
  })
})

describe('feePayer', () => {
  const userAccount = accounts[9]!
  const feePayerAccount = accounts[0]!

  let server: Server
  let requests: RpcRequest.RpcRequest[] = []

  beforeAll(async () => {
    server = await createServer(
      Handler.feePayer({
        account: feePayerAccount,
        client: getClient(),
        onRequest: async (request) => {
          requests.push(request)
        },
      }).listener,
    )
  })

  afterAll(() => {
    server.close()
    process.on('SIGINT', () => {
      server.close()
      process.exit(0)
    })
    process.on('SIGTERM', () => {
      server.close()
      process.exit(0)
    })
  })

  afterEach(() => {
    requests = []
  })

  describe('POST /', () => {
    test('behavior: eth_signRawTransaction', async () => {
      const client = getClient({
        account: userAccount,
        transport: withFeePayer(http(), http(server.url)),
      })

      const receipt = await sendTransactionSync(client, {
        feePayer: true,
        to: '0x0000000000000000000000000000000000000000',
      })

      expect(receipt.feePayer).toBe(feePayerAccount.address.toLowerCase())

      expect(requests.map(({ method }) => method)).toMatchInlineSnapshot(`
        [
          "eth_signRawTransaction",
        ]
      `)
    })

    test('behavior: eth_sendRawTransaction', async () => {
      const client = getClient({
        account: userAccount,
        transport: withFeePayer(http(), http(server.url), {
          policy: 'sign-and-broadcast',
        }),
      })

      const receipt = await sendTransactionSync(client, {
        feePayer: true,
        to: '0x0000000000000000000000000000000000000000',
      })

      expect(receipt.feePayer).toBe(feePayerAccount.address.toLowerCase())

      expect(requests.map(({ method }) => method)).toMatchInlineSnapshot(`
        [
          "eth_sendRawTransactionSync",
        ]
      `)
    })

    test('behavior: eth_sendRawTransactionSync', async () => {
      const client = getClient({
        account: userAccount,
        transport: withFeePayer(http(), http(server.url), {
          policy: 'sign-and-broadcast',
        }),
      })

      const receipt = await sendTransactionSync(client, {
        feePayer: true,
        to: '0x0000000000000000000000000000000000000000',
      })

      expect(receipt.feePayer).toBe(feePayerAccount.address.toLowerCase())

      expect(requests.map(({ method }) => method)).toMatchInlineSnapshot(`
        [
          "eth_sendRawTransactionSync",
        ]
      `)
    })

    test('behavior: unsupported method', async () => {
      await expect(
        fetch(server.url, {
          method: 'POST',
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: 1,
            method: 'eth_chainId',
          }),
        }).then((response) => response.json()),
      ).resolves.toMatchInlineSnapshot(`
        {
          "error": {
            "code": -32004,
            "name": "RpcResponse.MethodNotSupportedError",
            "stack": "",
          },
          "id": 1,
          "jsonrpc": "2.0",
        }
      `)
    })

    test('behavior: internal error', async () => {
      const response = await fetch(server.url, {
        method: 'POST',
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'eth_signRawTransaction',
          params: ['0xinvalid'],
        }),
      })

      const data = await response.json()
      expect(data).toMatchInlineSnapshot(`
        {
          "error": {
            "code": -32603,
            "name": "RpcResponse.InternalError",
            "stack": "",
          },
          "id": 1,
          "jsonrpc": "2.0",
        }
      `)
    })
  })
})
