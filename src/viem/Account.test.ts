import * as Address from 'ox/Address'
import * as Hex from 'ox/Hex'
import * as P256 from 'ox/P256'
import * as PublicKey from 'ox/PublicKey'
import * as WebCryptoP256 from 'ox/WebCryptoP256'
import { describe, expect, test } from 'vitest'
import * as Account from './Account.js'
import * as Key from './Key.js'

describe('fromSecp256k1', () => {
  const privateKey =
    '0xdd44057ea3a129f0f0fefd54e3f720873073c5e2586f4d9a50c403c4edd8bee5'

  test('default', () => {
    const account = Account.fromSecp256k1(privateKey)

    expect(account).toMatchInlineSnapshot(`
      {
        "address": "0x786dbfb68908538c7c78c208d0889d5fe4b4c65f",
        "publicKey": "0xf7e567d502cc75d59a41bfb38efaad67087aa9cd9949bb08401e34b415b187fff4878ad226d02edee38bd06ed5eaa9bcc41ce347b9ece9282bcf16a343ba83dd",
        "sign": [Function],
        "signAuthorization": [Function],
        "signMessage": [Function],
        "signTransaction": [Function],
        "signTypedData": [Function],
        "source": "secp256k1",
        "type": "local",
      }
    `)
  })

  test('behavior: address derived from public key', () => {
    const account = Account.fromSecp256k1(privateKey)

    // Address should be the last 20 bytes of the public key
    expect(account.address).toBe('0x786dbfb68908538c7c78c208d0889d5fe4b4c65f')
  })

  test('behavior: generates consistent account', () => {
    const account1 = Account.fromSecp256k1(privateKey)
    const account2 = Account.fromSecp256k1(privateKey)

    expect(account1.address).toBe(account2.address)
    expect(account1.publicKey).toBe(account2.publicKey)
  })

  test('behavior: can sign messages', async () => {
    const account = Account.fromSecp256k1(privateKey)
    const message = 'Hello, World!'

    const signature = await account.signMessage({ message })
    expect(Hex.validate(signature)).toBe(true)
  })
})

describe('fromKey', () => {
  const privateKey =
    '0xdd44057ea3a129f0f0fefd54e3f720873073c5e2586f4d9a50c403c4edd8bee5'

  test('with secp256k1 key', () => {
    const key = Key.fromSecp256k1(privateKey)
    const account = Account.fromKey(key)

    expect(account).toMatchInlineSnapshot(`
      {
        "address": "0x786dbfb68908538c7c78c208d0889d5fe4b4c65f",
        "publicKey": "0xf7e567d502cc75d59a41bfb38efaad67087aa9cd9949bb08401e34b415b187fff4878ad226d02edee38bd06ed5eaa9bcc41ce347b9ece9282bcf16a343ba83dd",
        "sign": [Function],
        "signAuthorization": [Function],
        "signMessage": [Function],
        "signTransaction": [Function],
        "signTypedData": [Function],
        "source": "secp256k1",
        "type": "local",
      }
    `)
  })

  test('with p256 key', () => {
    const key = Key.fromP256(privateKey)
    const account = Account.fromKey(key)

    expect(account).toMatchInlineSnapshot(`
      {
        "address": "0x0e82f971b53d9d06c40736497ae666463acca13d",
        "publicKey": "0x26d149da5a7ec12bcc03030b651af5759cf4af76eea3a63b449e6456248c6e3b6ef62ab877f948d324072dcb709a3aca0133cef93ca2e12112c7e87a0d10bdcb",
        "sign": [Function],
        "signAuthorization": [Function],
        "signMessage": [Function],
        "signTransaction": [Function],
        "signTypedData": [Function],
        "source": "p256",
        "type": "local",
      }
    `)
  })

  test('with webAuthn key', () => {
    const key = Key.fromHeadlessWebAuthn(privateKey, {
      rpId: 'example.com',
      origin: 'https://example.com',
    })
    const account = Account.fromKey(key)

    expect(account).toMatchInlineSnapshot(`
      {
        "address": "0x0e82f971b53d9d06c40736497ae666463acca13d",
        "publicKey": "0x26d149da5a7ec12bcc03030b651af5759cf4af76eea3a63b449e6456248c6e3b6ef62ab877f948d324072dcb709a3aca0133cef93ca2e12112c7e87a0d10bdcb",
        "sign": [Function],
        "signAuthorization": [Function],
        "signMessage": [Function],
        "signTransaction": [Function],
        "signTypedData": [Function],
        "source": "webAuthn",
        "type": "local",
      }
    `)
  })

  test('with session key (expiry and role)', () => {
    const key = Key.fromSecp256k1(privateKey, {
      expiry: 1234567890,
      role: 'session',
    })
    const account = Account.fromKey(key)

    expect(account.address).toBe('0x786dbfb68908538c7c78c208d0889d5fe4b4c65f')
    expect(account.source).toBe('secp256k1')
  })

  test('behavior: secp256k1 with padded address as public key', () => {
    // Create a key where the public key is a padded address (32 bytes with leading zeros)
    const mockSign = async ({ hash }: { hash: Hex.Hex }) => hash
    const paddedAddress =
      '0x000000000000000000000000786dbfb68908538c7c78c208d0889d5fe4b4c65f'
    const key = Key.from({
      publicKey: paddedAddress,
      sign: mockSign,
      type: 'secp256k1',
    })

    const account = Account.fromKey(key)

    // Should extract the last 20 bytes as the address
    expect(account.address).toBe('0x786dbfb68908538c7c78c208d0889d5fe4b4c65f')
  })

  test('behavior: secp256k1 with 20-byte public key (already an address)', () => {
    // Create a key where the public key is already an address (20 bytes)
    const mockSign = async ({ hash }: { hash: Hex.Hex }) => hash
    const address = Hex.padLeft(
      '0x786dbfb68908538c7c78c208d0889d5fe4b4c65f',
      32,
    )
    const key = Key.from({
      publicKey: address,
      sign: mockSign,
      type: 'secp256k1',
    })

    const account = Account.fromKey(key)

    // Should use it directly as the address
    expect(account.address).toBe('0x786dbfb68908538c7c78c208d0889d5fe4b4c65f')
  })

  test('behavior: produces same result as specific from* functions', () => {
    // fromKey should produce the same result as the specific functions
    const secp256k1Key = Key.fromSecp256k1(privateKey)
    const accountFromKey = Account.fromKey(secp256k1Key)
    const accountFromSecp256k1 = Account.fromSecp256k1(privateKey)

    expect(accountFromKey.address).toBe(accountFromSecp256k1.address)
    expect(accountFromKey.publicKey).toBe(accountFromSecp256k1.publicKey)
    expect(accountFromKey.source).toBe(accountFromSecp256k1.source)

    const p256Key = Key.fromP256(privateKey)
    const accountFromKeyP256 = Account.fromKey(p256Key)
    const accountFromP256 = Account.fromP256(privateKey)

    expect(accountFromKeyP256.address).toBe(accountFromP256.address)
    expect(accountFromKeyP256.publicKey).toBe(accountFromP256.publicKey)
    expect(accountFromKeyP256.source).toBe(accountFromP256.source)
  })
})

describe('fromP256', () => {
  const privateKey =
    '0xdd44057ea3a129f0f0fefd54e3f720873073c5e2586f4d9a50c403c4edd8bee5'

  test('default', () => {
    const account = Account.fromP256(privateKey)

    expect(account).toMatchInlineSnapshot(`
      {
        "address": "0x0e82f971b53d9d06c40736497ae666463acca13d",
        "publicKey": "0x26d149da5a7ec12bcc03030b651af5759cf4af76eea3a63b449e6456248c6e3b6ef62ab877f948d324072dcb709a3aca0133cef93ca2e12112c7e87a0d10bdcb",
        "sign": [Function],
        "signAuthorization": [Function],
        "signMessage": [Function],
        "signTransaction": [Function],
        "signTypedData": [Function],
        "source": "p256",
        "type": "local",
      }
    `)
  })

  test('behavior: address derived from public key', () => {
    const account = Account.fromP256(privateKey)
    const publicKey_full = P256.getPublicKey({ privateKey })
    const expectedAddress = Address.fromPublicKey(publicKey_full)

    expect(account.address).toBe(expectedAddress)
  })

  test('behavior: generates consistent account', () => {
    const account1 = Account.fromP256(privateKey)
    const account2 = Account.fromP256(privateKey)

    expect(account1.address).toBe(account2.address)
    expect(account1.publicKey).toBe(account2.publicKey)
  })

  test('behavior: signMessage throws for p256', async () => {
    const account = Account.fromP256(privateKey)
    const message = 'Hello, World!'

    await expect(account.signMessage({ message })).rejects.toThrow(
      'Unsupported signature type. Expected `secp256k1` but got `p256`',
    )
  })
})

describe('fromHeadlessWebAuthn', () => {
  const privateKey =
    '0xdd44057ea3a129f0f0fefd54e3f720873073c5e2586f4d9a50c403c4edd8bee5'

  test('default', () => {
    const account = Account.fromHeadlessWebAuthn(privateKey, {
      rpId: 'example.com',
      origin: 'https://example.com',
    })

    expect(account).toMatchInlineSnapshot(`
      {
        "address": "0x0e82f971b53d9d06c40736497ae666463acca13d",
        "publicKey": "0x26d149da5a7ec12bcc03030b651af5759cf4af76eea3a63b449e6456248c6e3b6ef62ab877f948d324072dcb709a3aca0133cef93ca2e12112c7e87a0d10bdcb",
        "sign": [Function],
        "signAuthorization": [Function],
        "signMessage": [Function],
        "signTransaction": [Function],
        "signTypedData": [Function],
        "source": "webAuthn",
        "type": "local",
      }
    `)
  })

  test('with different rpId and origin', () => {
    const account = Account.fromHeadlessWebAuthn(privateKey, {
      rpId: 'test.com',
      origin: 'https://test.com',
    })

    // Address should be the same regardless of rpId/origin
    expect(account.address).toBe('0x0e82f971b53d9d06c40736497ae666463acca13d')
    expect(account.publicKey).toBe(
      '0x26d149da5a7ec12bcc03030b651af5759cf4af76eea3a63b449e6456248c6e3b6ef62ab877f948d324072dcb709a3aca0133cef93ca2e12112c7e87a0d10bdcb',
    )
  })

  test('behavior: address derived from public key', () => {
    const account = Account.fromHeadlessWebAuthn(privateKey, {
      rpId: 'example.com',
      origin: 'https://example.com',
    })
    const publicKey_full = P256.getPublicKey({ privateKey })
    const expectedAddress = Address.fromPublicKey(publicKey_full)

    expect(account.address).toBe(expectedAddress)
  })

  test('behavior: generates consistent account', () => {
    const account1 = Account.fromHeadlessWebAuthn(privateKey, {
      rpId: 'example.com',
      origin: 'https://example.com',
    })
    const account2 = Account.fromHeadlessWebAuthn(privateKey, {
      rpId: 'example.com',
      origin: 'https://example.com',
    })

    expect(account1.address).toBe(account2.address)
    expect(account1.publicKey).toBe(account2.publicKey)
  })

  test('behavior: signMessage throws for webAuthn', async () => {
    const account = Account.fromHeadlessWebAuthn(privateKey, {
      rpId: 'example.com',
      origin: 'https://example.com',
    })
    const message = 'Hello, World!'

    await expect(account.signMessage({ message })).rejects.toThrow(
      'Unsupported signature type. Expected `secp256k1` but got `webAuthn`',
    )
  })
})

describe('fromWebAuthnP256', () => {
  const privateKey =
    '0xdd44057ea3a129f0f0fefd54e3f720873073c5e2586f4d9a50c403c4edd8bee5'

  test('default', () => {
    const publicKey_full = P256.getPublicKey({ privateKey })
    const publicKey = PublicKey.toHex(publicKey_full, { includePrefix: false })

    const credential = {
      id: 'test-credential-id',
      publicKey,
    }

    const account = Account.fromWebAuthnP256(credential)

    expect(account).toMatchInlineSnapshot(`
      {
        "address": "0x0e82f971b53d9d06c40736497ae666463acca13d",
        "publicKey": "0x26d149da5a7ec12bcc03030b651af5759cf4af76eea3a63b449e6456248c6e3b6ef62ab877f948d324072dcb709a3aca0133cef93ca2e12112c7e87a0d10bdcb",
        "sign": [Function],
        "signAuthorization": [Function],
        "signMessage": [Function],
        "signTransaction": [Function],
        "signTypedData": [Function],
        "source": "webAuthn",
        "type": "local",
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

    const account = Account.fromWebAuthnP256(credential, {
      rpId: 'example.com',
    })

    expect(account).toMatchInlineSnapshot(`
      {
        "address": "0x0e82f971b53d9d06c40736497ae666463acca13d",
        "publicKey": "0x26d149da5a7ec12bcc03030b651af5759cf4af76eea3a63b449e6456248c6e3b6ef62ab877f948d324072dcb709a3aca0133cef93ca2e12112c7e87a0d10bdcb",
        "sign": [Function],
        "signAuthorization": [Function],
        "signMessage": [Function],
        "signTransaction": [Function],
        "signTypedData": [Function],
        "source": "webAuthn",
        "type": "local",
      }
    `)
  })

  test('behavior: address derived from public key', () => {
    const publicKey_full = P256.getPublicKey({ privateKey })
    const publicKey = PublicKey.toHex(publicKey_full, { includePrefix: false })

    const credential = {
      id: 'test-credential-id',
      publicKey,
    }

    const account = Account.fromWebAuthnP256(credential)
    const expectedAddress = Address.fromPublicKey(publicKey_full)

    expect(account.address).toBe(expectedAddress)
    expect(account.publicKey).toBe(publicKey)
  })

  test('behavior: preserves credential public key', () => {
    const publicKey_full = P256.getPublicKey({ privateKey })
    const publicKey = PublicKey.toHex(publicKey_full, { includePrefix: false })

    const credential = {
      id: 'test-credential-id',
      publicKey,
    }

    const account = Account.fromWebAuthnP256(credential)

    expect(account.publicKey).toBe(credential.publicKey)
  })

  test('behavior: different credential IDs same public key', () => {
    const publicKey_full = P256.getPublicKey({ privateKey })
    const publicKey = PublicKey.toHex(publicKey_full, { includePrefix: false })

    const credential1 = {
      id: 'credential-1',
      publicKey,
    }

    const credential2 = {
      id: 'credential-2',
      publicKey,
    }

    const account1 = Account.fromWebAuthnP256(credential1)
    const account2 = Account.fromWebAuthnP256(credential2)

    expect(account1.address).toBe(account2.address)
    expect(account1.publicKey).toBe(account2.publicKey)
  })
})

describe('fromWebCryptoP256', () => {
  test('default', async () => {
    const keyPair = await WebCryptoP256.createKeyPair()
    const account = Account.fromWebCryptoP256(keyPair)

    expect(account.type).toBe('local')
    expect(account.source).toBe('p256')
    expect(Hex.validate(account.address)).toBe(true)
    expect(Hex.validate(account.publicKey)).toBe(true)
    expect(account.signMessage).toBeDefined()
    expect(account.signTransaction).toBeDefined()
    expect(account.signTypedData).toBeDefined()
  })

  test('behavior: address derived from public key', async () => {
    const keyPair = await WebCryptoP256.createKeyPair()
    const account = Account.fromWebCryptoP256(keyPair)

    const publicKeyHex = PublicKey.toHex(keyPair.publicKey, {
      includePrefix: false,
    })
    const expectedAddress = Address.fromPublicKey(keyPair.publicKey)

    expect(account.address).toBe(expectedAddress)
    expect(account.publicKey).toBe(publicKeyHex)
  })

  test('behavior: generates consistent account from same key pair', async () => {
    const keyPair = await WebCryptoP256.createKeyPair()
    const account1 = Account.fromWebCryptoP256(keyPair)
    const account2 = Account.fromWebCryptoP256(keyPair)

    expect(account1.address).toBe(account2.address)
    expect(account1.publicKey).toBe(account2.publicKey)
  })

  test('behavior: signMessage throws for p256', async () => {
    const keyPair = await WebCryptoP256.createKeyPair()
    const account = Account.fromWebCryptoP256(keyPair)
    const message = 'Hello, World!'

    await expect(account.signMessage({ message })).rejects.toThrow(
      'Unsupported signature type. Expected `secp256k1` but got `p256`',
    )
  })

  test('behavior: different key pairs generate different accounts', async () => {
    const keyPair1 = await WebCryptoP256.createKeyPair()
    const keyPair2 = await WebCryptoP256.createKeyPair()

    const account1 = Account.fromWebCryptoP256(keyPair1)
    const account2 = Account.fromWebCryptoP256(keyPair2)

    expect(account1.address).not.toBe(account2.address)
    expect(account1.publicKey).not.toBe(account2.publicKey)
  })
})
