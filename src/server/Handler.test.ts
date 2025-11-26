import express from 'express'
import { Hono } from 'hono'
import * as Base64 from 'ox/Base64'
import * as Hex from 'ox/Hex'
import { beforeEach, describe, expect, test } from 'vitest'
import { createServer } from '../../test/server/utils.js'
import * as Handler from './Handler.js'
import * as Kv from './Kv.js'

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

  describe('integration', () => {
    const handler = Handler.from()
    handler.get('/foo', () => new Response('foo'))
    handler.post('/bar', () => new Response('bar'))

    test('hono', async () => {
      const app = new Hono()
      app.all('*', (c) => handler.fetch(c.req.raw))

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

  describe('GET /key/challenge', () => {
    test('default', async () => {
      const response = await handler.fetch(
        new Request('http://localhost/key/challenge'),
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
        new Request('http://localhost/key/challenge'),
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

  describe('GET /key/:id', () => {
    test('default', async () => {
      const credentialId = 'test-credential-id'
      const publicKey = '0x1234567890abcdef'

      await kv.set(`credential:${credentialId}`, publicKey)

      const response = await handler.fetch(
        new Request(`http://localhost/key/${credentialId}`),
      )

      expect(response.status).toBe(200)

      const data = await response.json()
      expect(data).toEqual({ publicKey })
    })

    test('behavior: returns 404 for non-existent credential', async () => {
      const response = await handler.fetch(
        new Request('http://localhost/key/non-existent'),
      )

      expect(response.status).toBe(404)
      expect(await response.text()).toBe('Credential not found')
    })
  })

  describe('POST /key/:id', () => {
    test('default', async () => {
      const credentialId = credential.id
      const challenge = Base64.toHex(
        JSON.parse(Base64.toString(credential.response.clientDataJSON))
          .challenge,
      )

      // Store the challenge first
      await kv.set(`challenge:${challenge}`, '1')

      const response = await handler.fetch(
        new Request(`http://localhost/key/${credentialId}`, {
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
        new Request('http://localhost/key/test-id', {
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
        new Request('http://localhost/key/test-id', {
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
        new Request(`http://localhost/key/${credential.id}`, {
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
        new Request(`http://localhost/key/${credential.id}`, {
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
        new Request(`http://localhost/key/${credential.id}`, {
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
        new Request(`http://localhost/key/${credential.id}`, {
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
        new Request(`http://localhost/key/${credential.id}`, {
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
