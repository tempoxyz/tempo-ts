import { Secp256k1 } from 'ox'
import { assertType, describe, expectTypeOf, test } from 'vitest'
import * as SignatureEnvelope from './SignatureEnvelope.js'

describe('GetType', () => {
  test('behavior: infers explicit secp256k1 type', () => {
    type envelope = {
      r: bigint
      s: bigint
      yParity: number
      type: 'secp256k1'
    }
    type result = SignatureEnvelope.GetType<envelope>
    expectTypeOf<result>().toEqualTypeOf<'secp256k1'>()
  })

  test('behavior: infers secp256k1 from signature properties', () => {
    type envelope = { r: bigint; s: bigint; yParity: number }
    type result = SignatureEnvelope.GetType<envelope>
    expectTypeOf<result>().toEqualTypeOf<'secp256k1'>()
  })

  test('behavior: returns Type for unknown envelope', () => {
    type envelope = unknown
    type result = SignatureEnvelope.GetType<envelope>
    expectTypeOf<result>().toEqualTypeOf<SignatureEnvelope.Type>()
  })

  test('behavior: returns never for invalid envelope', () => {
    type envelope = { r: bigint }
    type result = SignatureEnvelope.GetType<envelope>
    expectTypeOf<result>().toEqualTypeOf<never>()
  })

  test('behavior: returns never for empty object', () => {
    type envelope = {}
    type result = SignatureEnvelope.GetType<envelope>
    expectTypeOf<result>().toEqualTypeOf<never>()
  })
})

describe('getType', () => {
  test('behavior: returns literal type for explicit secp256k1', () => {
    const envelope = {
      r: 0n,
      s: 0n,
      yParity: 0,
      type: 'secp256k1' as const,
    }
    const result = SignatureEnvelope.getType(envelope)
    expectTypeOf(result).toEqualTypeOf<'secp256k1'>()
  })

  test('behavior: returns literal type for inferred secp256k1', () => {
    const envelope = {
      r: 0n,
      s: 0n,
      yParity: 0,
    }
    const result = SignatureEnvelope.getType(envelope)
    expectTypeOf(result).toEqualTypeOf<'secp256k1'>()
  })

  test('behavior: returns Type union for unknown parameter', () => {
    const envelope: unknown = {
      r: 0n,
      s: 0n,
      yParity: 0,
    }
    const result = SignatureEnvelope.getType(envelope)
    expectTypeOf(result).toEqualTypeOf<SignatureEnvelope.Type>()
  })

  test('behavior: narrows type from SignatureEnvelope', () => {
    const envelope: SignatureEnvelope.SignatureEnvelope = {
      r: 0n,
      s: 0n,
      yParity: 0,
      type: 'secp256k1',
    }
    const result = SignatureEnvelope.getType(envelope)
    expectTypeOf(result).toEqualTypeOf<SignatureEnvelope.Type>()
  })

  test('behavior: handles Signature.Signature type', () => {
    const privateKey = Secp256k1.randomPrivateKey()
    const signature = Secp256k1.sign({
      payload: '0xdeadbeef',
      privateKey,
    })
    const result = SignatureEnvelope.getType(signature)
    expectTypeOf(result).toEqualTypeOf<'secp256k1'>()
  })
})

describe('from', () => {
  test('behavior: adds explicit type to envelope', () => {
    const envelope = {
      r: 0n,
      s: 0n,
      yParity: 0,
    }
    const result = SignatureEnvelope.from(envelope)
    expectTypeOf(result).toMatchObjectType<{
      r: bigint
      s: bigint
      yParity: number
      type: 'secp256k1'
    }>()
  })

  test('behavior: preserves existing type', () => {
    const envelope = {
      r: 0n,
      s: 0n,
      yParity: 0,
      type: 'secp256k1' as const,
    }
    const result = SignatureEnvelope.from(envelope)
    expectTypeOf(result).toMatchObjectType<{
      r: bigint
      s: bigint
      yParity: number
      type: 'secp256k1'
    }>()
  })

  test('behavior: deserializes hex string to SignatureEnvelope', () => {
    const serialized =
      '0x0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000100'
    const result = SignatureEnvelope.from(serialized)
    expectTypeOf(result).toEqualTypeOf<SignatureEnvelope.SignatureEnvelope>()
  })

  test('behavior: handles Signature.Signature type', () => {
    const privateKey = Secp256k1.randomPrivateKey()
    const signature = Secp256k1.sign({
      payload: '0xdeadbeef',
      privateKey,
    })
    const result = SignatureEnvelope.from(signature)
    expectTypeOf(result).toMatchObjectType<{
      r: bigint
      s: bigint
      yParity: number
      type: 'secp256k1'
    }>()
  })
})

describe('SignatureEnvelope type', () => {
  test('behavior: is assignable to Signature.Signature', () => {
    type signature = SignatureEnvelope.SignatureEnvelope extends {
      r: bigint
      s: bigint
      yParity: number
    }
      ? true
      : false
    expectTypeOf<signature>().toEqualTypeOf<true>()
  })

  test('behavior: includes optional type property', () => {
    type envelope = SignatureEnvelope.SignatureEnvelope
    type hasType = 'type' extends keyof envelope ? true : false
    expectTypeOf<hasType>().toEqualTypeOf<true>()
  })
})

describe('assert', () => {
  test('behavior: accepts SignatureEnvelope', () => {
    const envelope: SignatureEnvelope.SignatureEnvelope = {
      r: 0n,
      s: 0n,
      yParity: 0,
      type: 'secp256k1',
    }
    assertType<void>(SignatureEnvelope.assert(envelope))
  })

  test('behavior: accepts partial envelope', () => {
    const envelope = {
      r: 0n,
      s: 0n,
      yParity: 0,
    }
    assertType<void>(SignatureEnvelope.assert(envelope))
  })
})

describe('validate', () => {
  test('behavior: returns boolean', () => {
    const envelope: SignatureEnvelope.SignatureEnvelope = {
      r: 0n,
      s: 0n,
      yParity: 0,
      type: 'secp256k1',
    }
    const result = SignatureEnvelope.validate(envelope)
    expectTypeOf(result).toEqualTypeOf<boolean>()
  })
})

describe('serialize', () => {
  test('behavior: returns Serialized hex string', () => {
    const envelope: SignatureEnvelope.SignatureEnvelope = {
      r: 0n,
      s: 0n,
      yParity: 0,
      type: 'secp256k1',
    }
    const result = SignatureEnvelope.serialize(envelope)
    expectTypeOf(result).toEqualTypeOf<SignatureEnvelope.Serialized>()
  })
})

describe('deserialize', () => {
  test('behavior: returns SignatureEnvelope', () => {
    const serialized =
      '0x0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000100'
    const result = SignatureEnvelope.deserialize(
      serialized as SignatureEnvelope.Serialized,
    )
    expectTypeOf(result).toEqualTypeOf<SignatureEnvelope.SignatureEnvelope>()
  })
})
