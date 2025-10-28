import type * as Hex from 'ox/Hex'
import type * as PublicKey from 'ox/PublicKey'
import { describe, expectTypeOf, test } from 'vitest'
import * as Key from './Key.js'

describe('from', () => {
  test('accepts all required properties', () => {
    const mockSign = async ({ hash }: { hash: Hex.Hex }) => hash as Hex.Hex
    const publicKey: PublicKey.PublicKey = {
      prefix: 4,
      x: 123n,
      y: 456n,
    }

    const key = Key.from({
      publicKey,
      sign: mockSign,
      type: 'secp256k1',
      expiry: 1234567890,
      role: 'session',
    })

    expectTypeOf(key).toExtend<Key.Key>()
    expectTypeOf(key.publicKey).toEqualTypeOf(publicKey)
    expectTypeOf(key.expiry).toEqualTypeOf<1234567890>()
    expectTypeOf(key.type).toEqualTypeOf<'secp256k1'>()
    expectTypeOf(key.role).toEqualTypeOf<'session'>()
  })

  test('expiry is optional', () => {
    const mockSign = async ({ hash }: { hash: Hex.Hex }) => hash as Hex.Hex
    const publicKey: PublicKey.PublicKey = {
      prefix: 4,
      x: 123n,
      y: 456n,
    }

    const key = Key.from({
      publicKey,
      sign: mockSign,
      type: 'p256',
      role: 'admin',
    })

    expectTypeOf(key).toExtend<Key.Key>()
  })

  test('role is optional', () => {
    const mockSign = async ({ hash }: { hash: Hex.Hex }) => hash as Hex.Hex
    const publicKey: PublicKey.PublicKey = {
      prefix: 4,
      x: 123n,
      y: 456n,
    }

    const key = Key.from({
      publicKey,
      sign: mockSign,
      type: 'webAuthn',
      expiry: 999,
    })

    expectTypeOf(key).toExtend<Key.Key>()
  })

  test('both expiry and role are optional', () => {
    const mockSign = async ({ hash }: { hash: Hex.Hex }) => hash as Hex.Hex
    const publicKey: PublicKey.PublicKey = {
      prefix: 4,
      x: 123n,
      y: 456n,
    }

    const key = Key.from({
      publicKey,
      sign: mockSign,
      type: 'secp256k1',
    })

    expectTypeOf(key).toExtend<Key.Key>()
  })

  test('behavior: narrowed type - secp256k1', () => {
    const mockSign = async ({ hash }: { hash: Hex.Hex }) => hash as Hex.Hex
    const publicKey: PublicKey.PublicKey = {
      prefix: 4,
      x: 123n,
      y: 456n,
    }

    const key = Key.from({
      publicKey,
      sign: mockSign,
      type: 'secp256k1',
    })

    expectTypeOf(key.type).toEqualTypeOf<'secp256k1'>()
  })

  test('behavior: narrowed type - p256', () => {
    const mockSign = async ({ hash }: { hash: Hex.Hex }) => hash as Hex.Hex
    const publicKey: PublicKey.PublicKey = {
      prefix: 4,
      x: 123n,
      y: 456n,
    }

    const key = Key.from({
      publicKey,
      sign: mockSign,
      type: 'p256',
    })

    expectTypeOf(key.type).toEqualTypeOf<'p256'>()
  })

  test('behavior: narrowed type - webAuthn', () => {
    const mockSign = async ({ hash }: { hash: Hex.Hex }) => hash as Hex.Hex
    const publicKey: PublicKey.PublicKey = {
      prefix: 4,
      x: 123n,
      y: 456n,
    }

    const key = Key.from({
      publicKey,
      sign: mockSign,
      type: 'webAuthn',
    })

    expectTypeOf(key.type).toEqualTypeOf<'webAuthn'>()
  })

  test('behavior: broadened type - Key.Type union', () => {
    const mockSign = async ({ hash }: { hash: Hex.Hex }) => hash as Hex.Hex
    const publicKey: PublicKey.PublicKey = {
      prefix: 4,
      x: 123n,
      y: 456n,
    }

    const keyType: Key.Type = 'secp256k1'
    const key = Key.from({
      publicKey,
      sign: mockSign,
      type: keyType,
    })

    expectTypeOf(key.type).toExtend<Key.Type>()
  })

  test('behavior: narrowed role - admin', () => {
    const mockSign = async ({ hash }: { hash: Hex.Hex }) => hash as Hex.Hex
    const publicKey: PublicKey.PublicKey = {
      prefix: 4,
      x: 123n,
      y: 456n,
    }

    const key = Key.from({
      publicKey,
      sign: mockSign,
      type: 'secp256k1',
      role: 'admin',
    })

    expectTypeOf(key.role).toEqualTypeOf<'admin'>()
  })

  test('behavior: narrowed role - session', () => {
    const mockSign = async ({ hash }: { hash: Hex.Hex }) => hash as Hex.Hex
    const publicKey: PublicKey.PublicKey = {
      prefix: 4,
      x: 123n,
      y: 456n,
    }

    const key = Key.from({
      publicKey,
      sign: mockSign,
      type: 'p256',
      role: 'session',
    })

    expectTypeOf(key.role).toEqualTypeOf<'session'>()
  })

  test('behavior: broadened role - union type', () => {
    const mockSign = async ({ hash }: { hash: Hex.Hex }) => hash as Hex.Hex
    const publicKey: PublicKey.PublicKey = {
      prefix: 4,
      x: 123n,
      y: 456n,
    }

    const role: 'admin' | 'session' = 'admin'
    const key = Key.from({
      publicKey,
      sign: mockSign,
      type: 'secp256k1',
      role,
    })

    expectTypeOf(key.role).toExtend<'admin' | 'session'>()
  })

  test('behavior: narrowed expiry - literal', () => {
    const mockSign = async ({ hash }: { hash: Hex.Hex }) => hash as Hex.Hex
    const publicKey: PublicKey.PublicKey = {
      prefix: 4,
      x: 123n,
      y: 456n,
    }

    const key = Key.from({
      publicKey,
      sign: mockSign,
      type: 'secp256k1',
      expiry: 1234567890,
    })

    expectTypeOf(key.expiry).toEqualTypeOf<1234567890>()
  })

  test('behavior: broadened expiry - number', () => {
    const mockSign = async ({ hash }: { hash: Hex.Hex }) => hash as Hex.Hex
    const publicKey: PublicKey.PublicKey = {
      prefix: 4,
      x: 123n,
      y: 456n,
    }

    const expiry: number = 1234567890
    const key = Key.from({
      publicKey,
      sign: mockSign,
      type: 'secp256k1',
      expiry,
    })

    expectTypeOf(key.expiry).toEqualTypeOf<number>()
  })

  test('behavior: combined narrowed types', () => {
    const mockSign = async ({ hash }: { hash: Hex.Hex }) => hash as Hex.Hex
    const publicKey: PublicKey.PublicKey = {
      prefix: 4,
      x: 123n,
      y: 456n,
    }

    const key = Key.from({
      publicKey,
      sign: mockSign,
      type: 'p256',
      role: 'session',
      expiry: 999,
    })

    expectTypeOf(key.type).toEqualTypeOf<'p256'>()
    expectTypeOf(key.role).toEqualTypeOf<'session'>()
    expectTypeOf(key.expiry).toEqualTypeOf<999>()
  })

  test('behavior: combined broadened types', () => {
    const mockSign = async ({ hash }: { hash: Hex.Hex }) => hash as Hex.Hex
    const publicKey: PublicKey.PublicKey = {
      prefix: 4,
      x: 123n,
      y: 456n,
    }

    const keyType: Key.Type = 'webAuthn'
    const role: 'admin' | 'session' = 'admin'
    const expiry: number = 500

    const key = Key.from({
      publicKey,
      sign: mockSign,
      type: keyType,
      role,
      expiry,
    })

    expectTypeOf(key.type).toExtend<Key.Type>()
    expectTypeOf(key.role).toExtend<'admin' | 'session'>()
    expectTypeOf(key.expiry).toExtend<number>()
  })

  test('sign function signature', () => {
    const mockSign = async ({ hash }: { hash: Hex.Hex }) => hash as Hex.Hex
    const publicKey: PublicKey.PublicKey = {
      prefix: 4,
      x: 123n,
      y: 456n,
    }

    const key = Key.from({
      publicKey,
      sign: mockSign,
      type: 'secp256k1',
    })

    expectTypeOf(key.sign).toBeFunction()
    expectTypeOf(key.sign).parameter(0).toExtend<{ hash: Hex.Hex }>()
    expectTypeOf(key.sign).returns.toExtend<Promise<Hex.Hex>>()
  })

  test('value parameter type', () => {
    // Should accept Key.from.Value type
    expectTypeOf<typeof Key.from<Key.from.Value>>()
      .parameter(0)
      .toExtend<Key.from.Value>()

    // Should accept full key
    expectTypeOf<typeof Key.from<Key.Key>>().parameter(0).toExtend<Key.Key>()

    // Should accept key without expiry
    expectTypeOf<typeof Key.from<Omit<Key.Key, 'expiry'>>>()
      .parameter(0)
      .toExtend<Omit<Key.Key, 'expiry'>>()

    // Should accept key without role
    expectTypeOf<typeof Key.from<Omit<Key.Key, 'role'>>>()
      .parameter(0)
      .toExtend<Omit<Key.Key, 'role'>>()

    // Should accept key without expiry and role
    expectTypeOf<typeof Key.from<Omit<Key.Key, 'expiry' | 'role'>>>()
      .parameter(0)
      .toExtend<Omit<Key.Key, 'expiry' | 'role'>>()
  })
})
