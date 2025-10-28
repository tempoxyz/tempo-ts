import { describe, expect, test } from 'vitest'
import * as Key from './Key.js'

describe('from', () => {
  test('default', () => {
    const mockSign = async ({ hash }: { hash: string }) => hash as `0x${string}`
    const publicKey = {
      prefix: 4,
      x: 123n,
      y: 456n,
    } as const

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
        "publicKey": {
          "prefix": 4,
          "x": 123n,
          "y": 456n,
        },
        "role": "session",
        "sign": [Function],
        "type": "secp256k1",
      }
    `)
  })

  test('behavior: defaults expiry to 0', () => {
    const mockSign = async ({ hash }: { hash: string }) => hash as `0x${string}`
    const publicKey = {
      prefix: 4,
      x: 123n,
      y: 456n,
    } as const

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
    const publicKey = {
      prefix: 4,
      x: 123n,
      y: 456n,
    } as const

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
    const publicKey = {
      prefix: 4,
      x: 123n,
      y: 456n,
    } as const

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
    const publicKey = {
      prefix: 4,
      x: 123n,
      y: 456n,
    } as const

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
    const publicKey = {
      prefix: 4,
      x: 123n,
      y: 456n,
    } as const

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
