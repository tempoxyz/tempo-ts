import { publicActions } from 'viem'
import { mnemonicToAccount } from 'viem/accounts'
import { describe, expect, test } from 'vitest'
import { tempoTest } from '../../../test/viem/config.js'
import { createTempoClient } from '../Client.js'
import * as Key from '../Key.js'
import * as actions from './index.js'

const account = mnemonicToAccount(
  'test test test test test test test test test test test junk',
)

const client = createTempoClient({
  account,
  chain: tempoTest,
  pollingInterval: 100,
}).extend(publicActions)

describe('authorize', () => {
  const secp256k1PrivateKey =
    '0xdd44057ea3a129f0f0fefd54e3f720873073c5e2586f4d9a50c403c4edd8bee5'
  const p256PrivateKey =
    '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'

  test('default', async () => {
    const key = Key.fromSecp256k1(secp256k1PrivateKey)

    const { receipt, ...result } = await actions.account.authorizeSync(client, {
      key,
    })

    expect(receipt).toBeDefined()
    expect(result).toMatchInlineSnapshot(`
      {
        "key": {
          "expiry": 0,
          "publicKey": "0xf7e567d502cc75d59a41bfb38efaad67087aa9cd9949bb08401e34b415b187fff4878ad226d02edee38bd06ed5eaa9bcc41ce347b9ece9282bcf16a343ba83dd",
          "role": "admin",
          "sign": [Function],
          "type": "secp256k1",
        },
        "keyHash": "0xc3b9db43df484c8eb499b58bd8f94cde701f47ffd939ccb813e1d84ae167407b",
        "rawKey": {
          "expiry": 0,
          "isSuperAdmin": true,
          "keyType": 2,
          "publicKey": "0xf7e567d502cc75d59a41bfb38efaad67087aa9cd9949bb08401e34b415b187fff4878ad226d02edee38bd06ed5eaa9bcc41ce347b9ece9282bcf16a343ba83dd",
        },
      }
    `)
  })

  test('behavior: with session key', async () => {
    const key = Key.fromSecp256k1(secp256k1PrivateKey, {
      expiry: 1234567890,
      role: 'session',
    })

    const { receipt, ...result } = await actions.account.authorizeSync(client, {
      key,
    })

    expect(receipt.status).toBe('success')
    expect(result).toMatchInlineSnapshot(`
      {
        "key": {
          "expiry": 1234567890,
          "publicKey": "0xf7e567d502cc75d59a41bfb38efaad67087aa9cd9949bb08401e34b415b187fff4878ad226d02edee38bd06ed5eaa9bcc41ce347b9ece9282bcf16a343ba83dd",
          "role": "session",
          "sign": [Function],
          "type": "secp256k1",
        },
        "keyHash": "0xc3b9db43df484c8eb499b58bd8f94cde701f47ffd939ccb813e1d84ae167407b",
        "rawKey": {
          "expiry": 1234567890,
          "isSuperAdmin": false,
          "keyType": 2,
          "publicKey": "0xf7e567d502cc75d59a41bfb38efaad67087aa9cd9949bb08401e34b415b187fff4878ad226d02edee38bd06ed5eaa9bcc41ce347b9ece9282bcf16a343ba83dd",
        },
      }
    `)
  })

  test('behavior: with p256 session key', async () => {
    const key = Key.fromP256(p256PrivateKey, {
      role: 'session',
    })

    const { receipt, ...result } = await actions.account.authorizeSync(client, {
      key,
    })

    expect(receipt.status).toBe('success')
    expect(result).toMatchInlineSnapshot(`
      {
        "key": {
          "expiry": 0,
          "publicKey": "0xa43b66d1eaee03f07d64920491f8b3487a90f527f2342c8caccd55d5065084496c57d409d6db06faefd8a0aa1106acd69501134e11cf74b2e95c81b451da3433",
          "role": "session",
          "sign": [Function],
          "type": "p256",
        },
        "keyHash": "0x702ecd52688ac640285b539aee53e9238272429216e2fa71f253a1cabb8786d8",
        "rawKey": {
          "expiry": 0,
          "isSuperAdmin": false,
          "keyType": 0,
          "publicKey": "0xa43b66d1eaee03f07d64920491f8b3487a90f527f2342c8caccd55d5065084496c57d409d6db06faefd8a0aa1106acd69501134e11cf74b2e95c81b451da3433",
        },
      }
    `)
  })

  test('behavior: with webAuthn session key', async () => {
    const key = Key.fromHeadlessWebAuthn(p256PrivateKey, {
      rpId: 'example.com',
      origin: 'https://example.com',
      role: 'session',
    })

    const { receipt, ...result } = await actions.account.authorizeSync(client, {
      key,
    })

    expect(receipt.status).toBe('success')
    expect(result).toMatchInlineSnapshot(`
      {
        "key": {
          "expiry": 0,
          "publicKey": "0xa43b66d1eaee03f07d64920491f8b3487a90f527f2342c8caccd55d5065084496c57d409d6db06faefd8a0aa1106acd69501134e11cf74b2e95c81b451da3433",
          "role": "session",
          "sign": [Function],
          "type": "webAuthn",
        },
        "keyHash": "0xc5481e4ae029728eceac6dcf0e214575b89e0644bf68cfb7946a28b22642496d",
        "rawKey": {
          "expiry": 0,
          "isSuperAdmin": false,
          "keyType": 1,
          "publicKey": "0xa43b66d1eaee03f07d64920491f8b3487a90f527f2342c8caccd55d5065084496c57d409d6db06faefd8a0aa1106acd69501134e11cf74b2e95c81b451da3433",
        },
      }
    `)
  })

  test('behavior: with custom expiry', async () => {
    const key = Key.fromSecp256k1(secp256k1PrivateKey, {
      expiry: 9999999999,
    })

    const { receipt, ...result } = await actions.account.authorizeSync(client, {
      key,
    })

    expect(receipt.status).toBe('success')
    expect(result).toMatchInlineSnapshot(`
      {
        "key": {
          "expiry": 9999999999,
          "publicKey": "0xf7e567d502cc75d59a41bfb38efaad67087aa9cd9949bb08401e34b415b187fff4878ad226d02edee38bd06ed5eaa9bcc41ce347b9ece9282bcf16a343ba83dd",
          "role": "admin",
          "sign": [Function],
          "type": "secp256k1",
        },
        "keyHash": "0xc3b9db43df484c8eb499b58bd8f94cde701f47ffd939ccb813e1d84ae167407b",
        "rawKey": {
          "expiry": 9999999999,
          "isSuperAdmin": true,
          "keyType": 2,
          "publicKey": "0xf7e567d502cc75d59a41bfb38efaad67087aa9cd9949bb08401e34b415b187fff4878ad226d02edee38bd06ed5eaa9bcc41ce347b9ece9282bcf16a343ba83dd",
        },
      }
    `)
  })
})
