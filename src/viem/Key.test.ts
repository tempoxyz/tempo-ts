import * as Hex from 'ox/Hex'
import * as P256 from 'ox/P256'
import * as PublicKey from 'ox/PublicKey'
import * as WebCryptoP256 from 'ox/WebCryptoP256'
import { describe, expect, test } from 'vitest'
import * as Key from './Key.js'

describe('from', () => {
  test('default', () => {
    const mockSign = async ({ hash }: { hash: string }) => hash as `0x${string}`
    const publicKey = PublicKey.toHex({
      prefix: 4,
      x: 123n,
      y: 456n,
    })

    const key = Key.from({
      publicKey,
      sign: mockSign,
      type: 'secp256k1',
      expiry: 1234567890,
      role: 'session',
    })

    expect(key).toMatchInlineSnapshot(`
      {
        "expiry": 1234567890,
        "publicKey": "0x04000000000000000000000000000000000000000000000000000000000000007b00000000000000000000000000000000000000000000000000000000000001c8",
        "role": "session",
        "sign": [Function],
        "type": "secp256k1",
      }
    `)
  })

  test('behavior: defaults expiry to 0', () => {
    const mockSign = async ({ hash }: { hash: string }) => hash as `0x${string}`
    const publicKey = PublicKey.toHex({
      prefix: 4,
      x: 123n,
      y: 456n,
    })

    const key = Key.from({
      publicKey,
      sign: mockSign,
      type: 'secp256k1',
      role: 'admin',
    })

    expect(key.expiry).toBe(0)
    expect(key.role).toBe('admin')
  })

  test('behavior: defaults role to admin', () => {
    const mockSign = async ({ hash }: { hash: string }) => hash as `0x${string}`
    const publicKey = PublicKey.toHex({
      prefix: 4,
      x: 123n,
      y: 456n,
    })

    const key = Key.from({
      publicKey,
      sign: mockSign,
      type: 'p256',
      expiry: 1000,
    })

    expect(key.expiry).toBe(1000)
    expect(key.role).toBe('admin')
  })

  test('behavior: defaults both expiry and role', () => {
    const mockSign = async ({ hash }: { hash: string }) => hash as `0x${string}`
    const publicKey = PublicKey.toHex({
      prefix: 4,
      x: 123n,
      y: 456n,
    })

    const key = Key.from({
      publicKey,
      sign: mockSign,
      type: 'webAuthn',
    })

    expect(key.expiry).toBe(0)
    expect(key.role).toBe('admin')
  })

  test('behavior: expiry 0 means never expires', () => {
    const mockSign = async ({ hash }: { hash: string }) => hash as `0x${string}`
    const publicKey = PublicKey.toHex({
      prefix: 4,
      x: 123n,
      y: 456n,
    })

    const key = Key.from({
      publicKey,
      sign: mockSign,
      type: 'secp256k1',
      expiry: 0,
      role: 'session',
    })

    expect(key.expiry).toBe(0)
  })

  test('behavior: different key types', () => {
    const mockSign = async ({ hash }: { hash: string }) => hash as `0x${string}`
    const publicKey = PublicKey.toHex({
      prefix: 4,
      x: 123n,
      y: 456n,
    })

    const secp256k1Key = Key.from({
      publicKey,
      sign: mockSign,
      type: 'secp256k1',
    })
    expect(secp256k1Key.type).toBe('secp256k1')

    const p256Key = Key.from({
      publicKey,
      sign: mockSign,
      type: 'p256',
    })
    expect(p256Key.type).toBe('p256')

    const webAuthnKey = Key.from({
      publicKey,
      sign: mockSign,
      type: 'webAuthn',
    })
    expect(webAuthnKey.type).toBe('webAuthn')
  })
})

describe('fromSecp256k1', () => {
  const privateKey =
    '0xdd44057ea3a129f0f0fefd54e3f720873073c5e2586f4d9a50c403c4edd8bee5'

  test('default', async () => {
    const key = Key.fromSecp256k1(privateKey)

    expect(key).toMatchInlineSnapshot(`
      {
        "expiry": 0,
        "publicKey": "0xf7e567d502cc75d59a41bfb38efaad67087aa9cd9949bb08401e34b415b187fff4878ad226d02edee38bd06ed5eaa9bcc41ce347b9ece9282bcf16a343ba83dd",
        "role": "admin",
        "sign": [Function],
        "type": "secp256k1",
      }
    `)

    // Test signing
    const hash = Hex.random(32)
    const signature = await key.sign({ hash })
    expect(Hex.validate(signature)).toBe(true)
  })

  test('with options', async () => {
    const key = Key.fromSecp256k1(privateKey, {
      expiry: 1234567890,
      role: 'session',
    })

    expect(key).toMatchInlineSnapshot(`
      {
        "expiry": 1234567890,
        "publicKey": "0xf7e567d502cc75d59a41bfb38efaad67087aa9cd9949bb08401e34b415b187fff4878ad226d02edee38bd06ed5eaa9bcc41ce347b9ece9282bcf16a343ba83dd",
        "role": "session",
        "sign": [Function],
        "type": "secp256k1",
      }
    `)
  })

  test('behavior: generates consistent public key', () => {
    const privateKey =
      '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'
    const key1 = Key.fromSecp256k1(privateKey)
    const key2 = Key.fromSecp256k1(privateKey)

    expect(key1.publicKey).toBe(key2.publicKey)
  })
})

describe('fromP256', () => {
  const privateKey =
    '0xdd44057ea3a129f0f0fefd54e3f720873073c5e2586f4d9a50c403c4edd8bee5'

  test('default', async () => {
    const key = Key.fromP256(privateKey)

    expect(key).toMatchInlineSnapshot(`
      {
        "expiry": 0,
        "publicKey": "0x26d149da5a7ec12bcc03030b651af5759cf4af76eea3a63b449e6456248c6e3b6ef62ab877f948d324072dcb709a3aca0133cef93ca2e12112c7e87a0d10bdcb",
        "role": "admin",
        "sign": [Function],
        "type": "p256",
      }
    `)

    // Test signing
    const hash = Hex.random(32)
    const signature = await key.sign({ hash })
    expect(Hex.validate(signature)).toBe(true)
  })

  test('with options', async () => {
    const key = Key.fromP256(privateKey, {
      expiry: 9876543210,
      role: 'session',
    })

    expect(key).toMatchInlineSnapshot(`
      {
        "expiry": 9876543210,
        "publicKey": "0x26d149da5a7ec12bcc03030b651af5759cf4af76eea3a63b449e6456248c6e3b6ef62ab877f948d324072dcb709a3aca0133cef93ca2e12112c7e87a0d10bdcb",
        "role": "session",
        "sign": [Function],
        "type": "p256",
      }
    `)
  })

  test('behavior: generates consistent public key', () => {
    const privateKey =
      '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'
    const key1 = Key.fromP256(privateKey)
    const key2 = Key.fromP256(privateKey)

    expect(key1.publicKey).toBe(key2.publicKey)
  })

  test('behavior: public key excludes prefix', () => {
    const privateKey = P256.randomPrivateKey()
    const key = Key.fromP256(privateKey)

    // Public key should be 64 bytes (128 hex chars + 0x prefix)
    expect(key.publicKey.length).toBe(130)
  })
})

describe('fromHeadlessWebAuthn', () => {
  const privateKey =
    '0xdd44057ea3a129f0f0fefd54e3f720873073c5e2586f4d9a50c403c4edd8bee5'

  test('default', async () => {
    const key = Key.fromHeadlessWebAuthn(privateKey, {
      rpId: 'example.com',
      origin: 'https://example.com',
    })

    expect(key).toMatchInlineSnapshot(`
      {
        "expiry": 0,
        "publicKey": "0x26d149da5a7ec12bcc03030b651af5759cf4af76eea3a63b449e6456248c6e3b6ef62ab877f948d324072dcb709a3aca0133cef93ca2e12112c7e87a0d10bdcb",
        "role": "admin",
        "sign": [Function],
        "type": "webAuthn",
      }
    `)

    // Test signing
    const hash = Hex.random(32)
    const signature = await key.sign({ hash })
    expect(Hex.validate(signature)).toBe(true)
  })

  test('with options', async () => {
    const key = Key.fromHeadlessWebAuthn(privateKey, {
      rpId: 'example.com',
      origin: 'https://example.com',
      expiry: 5555555555,
      role: 'session',
    })

    expect(key).toMatchInlineSnapshot(`
      {
        "expiry": 5555555555,
        "publicKey": "0x26d149da5a7ec12bcc03030b651af5759cf4af76eea3a63b449e6456248c6e3b6ef62ab877f948d324072dcb709a3aca0133cef93ca2e12112c7e87a0d10bdcb",
        "role": "session",
        "sign": [Function],
        "type": "webAuthn",
      }
    `)
  })

  test('behavior: generates consistent public key', () => {
    const key1 = Key.fromHeadlessWebAuthn(privateKey, {
      rpId: 'example.com',
      origin: 'https://example.com',
    })
    const key2 = Key.fromHeadlessWebAuthn(privateKey, {
      rpId: 'example.com',
      origin: 'https://example.com',
    })

    expect(key1.publicKey).toBe(key2.publicKey)
  })
})

describe('fromWebAuthnP256', () => {
  const privateKey =
    '0xdd44057ea3a129f0f0fefd54e3f720873073c5e2586f4d9a50c403c4edd8bee5'

  test('default', async () => {
    const publicKey_full = P256.getPublicKey({ privateKey })
    const publicKey = PublicKey.toHex(publicKey_full, { includePrefix: false })

    const credential = {
      id: 'test-credential-id',
      publicKey,
    }

    const key = Key.fromWebAuthnP256(credential)

    expect(key).toMatchInlineSnapshot(`
      {
        "expiry": 0,
        "publicKey": "0x26d149da5a7ec12bcc03030b651af5759cf4af76eea3a63b449e6456248c6e3b6ef62ab877f948d324072dcb709a3aca0133cef93ca2e12112c7e87a0d10bdcb",
        "role": "admin",
        "sign": [Function],
        "type": "webAuthn",
      }
    `)
  })

  test('with options', () => {
    const publicKey_full = P256.getPublicKey({ privateKey })
    const publicKey = PublicKey.toHex(publicKey_full, { includePrefix: false })

    const credential = {
      id: 'test-credential-id',
      publicKey,
    }

    const key = Key.fromWebAuthnP256(credential, {
      rpId: 'example.com',
      expiry: 7777777777,
      role: 'session',
    })

    expect(key).toMatchInlineSnapshot(`
      {
        "expiry": 7777777777,
        "publicKey": "0x26d149da5a7ec12bcc03030b651af5759cf4af76eea3a63b449e6456248c6e3b6ef62ab877f948d324072dcb709a3aca0133cef93ca2e12112c7e87a0d10bdcb",
        "role": "session",
        "sign": [Function],
        "type": "webAuthn",
      }
    `)
  })

  test('behavior: preserves credential public key', () => {
    const publicKey_full = P256.getPublicKey({ privateKey })
    const publicKey = PublicKey.toHex(publicKey_full, { includePrefix: false })

    const credential = {
      id: 'test-credential-id',
      publicKey,
    }

    const key = Key.fromWebAuthnP256(credential)

    expect(key.publicKey).toBe(credential.publicKey)
  })
})

describe('fromWebCryptoP256', () => {
  test('default', async () => {
    const keyPair = await WebCryptoP256.createKeyPair()
    const key = Key.fromWebCryptoP256(keyPair)

    expect(key.type).toBe('p256')
    expect(key.expiry).toBe(0)
    expect(key.role).toBe('admin')
    expect(Hex.validate(key.publicKey)).toBe(true)
    expect(key.sign).toBeDefined()

    // Test signing
    const hash = Hex.random(32)
    const signature = await key.sign({ hash })
    expect(Hex.validate(signature)).toBe(true)
  })

  test('with options', async () => {
    const keyPair = await WebCryptoP256.createKeyPair()
    const key = Key.fromWebCryptoP256(keyPair, {
      expiry: 3333333333,
      role: 'session',
    })

    expect(key.type).toBe('p256')
    expect(key.expiry).toBe(3333333333)
    expect(key.role).toBe('session')
    expect(Hex.validate(key.publicKey)).toBe(true)
  })

  test('behavior: generates consistent public key from same key pair', async () => {
    const keyPair = await WebCryptoP256.createKeyPair()
    const key1 = Key.fromWebCryptoP256(keyPair)
    const key2 = Key.fromWebCryptoP256(keyPair)

    expect(key1.publicKey).toBe(key2.publicKey)
  })

  test('behavior: public key excludes prefix', async () => {
    const keyPair = await WebCryptoP256.createKeyPair()
    const key = Key.fromWebCryptoP256(keyPair)

    // Public key should be 64 bytes (128 hex chars + 0x prefix)
    expect(key.publicKey.length).toBe(130)
  })
})
