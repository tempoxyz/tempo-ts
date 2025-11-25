import { createRouter } from '@remix-run/fetch-router'
import { Base64, Bytes, Hex } from 'ox'
import type { KeyManager } from 'tempo.ts/wagmi'

const rpId = 'localhost'

const router = createRouter()

export default {
  fetch(request, env) {
    // Get challenge for WebAuthn credential creation
    router.get('/webauthn/challenge', async () => {
      // Generate a random challenge
      const challenge = Hex.random(32)

      // Store challenge in KV with 5 minute expiration
      await env.KEY_STORE.put(
        `challenge:${challenge}`,
        '1', // Just mark it as valid
        { expirationTtl: 300 }, // 5 minutes
      )

      return Response.json({
        challenge,
        rp: {
          id: rpId,
          name: rpId,
        },
      } satisfies KeyManager.Challenge)
    })

    // Get public key for a credential
    router.get('/webauthn/:credentialId', async ({ params }) => {
      const { credentialId } = params

      const publicKey = await env.KEY_STORE.get<Hex.Hex>(
        `credential:${credentialId}`,
      )

      if (!publicKey)
        return new Response('Credential not found', { status: 404 })

      return Response.json({
        publicKey,
      })
    })

    // Set public key for a credential
    router.post('/webauthn/:credentialId', async ({ params, request }) => {
      const { credentialId } = params

      const body = (await request.json()) as Parameters<
        KeyManager.KeyManager['setPublicKey']
      >[0]
      const { credential, publicKey } = body

      if (!publicKey)
        return new Response('Missing publicKey in request body', {
          status: 400,
        })

      if (!credential)
        return new Response('Missing credential in request body', {
          status: 400,
        })

      // Decode and verify clientDataJSON
      const clientDataJSON = JSON.parse(
        new TextDecoder().decode(
          Bytes.fromHex(credential.response.clientDataJSON),
        ),
      )

      // Verify challenge
      const challenge = Base64.toHex(Base64.fromBytes(clientDataJSON.challenge))

      if (!(await env.KEY_STORE.get(`challenge:${challenge}`)))
        return new Response('Invalid or expired challenge', {
          status: 400,
        })

      // Verify type
      if (clientDataJSON.type !== 'webauthn.create')
        return new Response('Invalid client data type', {
          status: 400,
        })

      // Verify origin
      if (clientDataJSON.origin !== new URL(`https://${rpId}`).origin)
        return new Response('Invalid origin', { status: 400 })

      // Parse authenticatorData
      const authenticatorData = Bytes.fromHex(
        credential.response.authenticatorData,
      )

      // Parse flags (byte 32)
      const flags = authenticatorData[32]
      if (!flags)
        return new Response('Invalid authenticator data', {
          status: 400,
        })

      // Check User Present (UP) flag (bit 0)
      const userPresent = (flags & 0x01) !== 0
      if (!userPresent)
        return new Response('User not present', {
          status: 400,
        })

      // Consume the challenge (delete it so it can't be reused)
      await env.KEY_STORE.delete(`challenge:${challenge}`)

      // Store the public key
      await env.KEY_STORE.put(`credential:${credentialId}`, publicKey)

      return new Response(null, { status: 204 })
    })

    return router.fetch(request)
  },
} satisfies ExportedHandler<Env>
