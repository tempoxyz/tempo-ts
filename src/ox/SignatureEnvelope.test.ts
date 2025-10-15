import { Secp256k1, Signature } from 'ox'
import { describe, expect, test } from 'vitest'
import * as SignatureEnvelope from './SignatureEnvelope.js'

describe('assert', () => {
  describe('secp256k1', () => {
    test('behavior: validates valid signature', () => {
      const privateKey = Secp256k1.randomPrivateKey()
      const signature = Secp256k1.sign({
        payload: '0xdeadbeef',
        privateKey,
      })

      expect(() =>
        SignatureEnvelope.assert({ ...signature, type: 'secp256k1' }),
      ).not.toThrow()
    })

    test('behavior: validates signature without explicit type', () => {
      const privateKey = Secp256k1.randomPrivateKey()
      const signature = Secp256k1.sign({
        payload: '0xdeadbeef',
        privateKey,
      })

      expect(() => SignatureEnvelope.assert(signature)).not.toThrow()
    })
  })

  test('error: throws on invalid envelope', () => {
    expect(() =>
      SignatureEnvelope.assert({} as any),
    ).toThrowErrorMatchingInlineSnapshot(
      `[SignatureEnvelope.CoercionError: Unable to coerce value (\`{}\`) to a valid signature envelope.]`,
    )
  })

  test('error: throws on incomplete signature', () => {
    expect(() =>
      SignatureEnvelope.assert({
        r: 0n,
        s: 0n,
      } as any),
    ).toThrowErrorMatchingInlineSnapshot(
      `[SignatureEnvelope.CoercionError: Unable to coerce value (\`{"r":"0#__bigint","s":"0#__bigint"}\`) to a valid signature envelope.]`,
    )
  })

  test('error: throws on invalid signature values', () => {
    expect(() =>
      SignatureEnvelope.assert({
        r: 0n,
        s: 0n,
        yParity: 2,
        type: 'secp256k1',
      }),
    ).toThrowErrorMatchingInlineSnapshot(
      `[Signature.InvalidYParityError: Value \`2\` is an invalid y-parity value. Y-parity must be 0 or 1.]`,
    )
  })
})

describe('deserialize', () => {
  describe('secp256k1', () => {
    test('behavior: deserializes valid signature', () => {
      const privateKey = Secp256k1.randomPrivateKey()
      const signature = Secp256k1.sign({
        payload: '0xdeadbeef',
        privateKey,
      })
      const serialized = Signature.toHex(signature)

      const envelope = SignatureEnvelope.deserialize(serialized)

      expect(envelope).toMatchObject({
        r: signature.r,
        s: signature.s,
        yParity: signature.yParity,
        type: 'secp256k1',
      })
    })

    test('error: throws on invalid size', () => {
      expect(() =>
        SignatureEnvelope.deserialize('0xdeadbeef'),
      ).toThrowErrorMatchingInlineSnapshot(
        `[SignatureEnvelope.CoercionError: Unable to coerce value (\`"0xdeadbeef"\`) to a valid signature envelope.]`,
      )
    })

    test('error: throws on invalid yParity', () => {
      // Signature with invalid yParity (must be 0 or 1)
      const invalidSig =
        '0x0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000102'
      expect(() =>
        SignatureEnvelope.deserialize(invalidSig),
      ).toThrowErrorMatchingInlineSnapshot(
        `[Signature.InvalidYParityError: Value \`2\` is an invalid y-parity value. Y-parity must be 0 or 1.]`,
      )
    })
  })
})

describe('from', () => {
  describe('secp256k1', () => {
    test('behavior: coerces from hex string', () => {
      const privateKey = Secp256k1.randomPrivateKey()
      const signature = Secp256k1.sign({
        payload: '0xdeadbeef',
        privateKey,
      })
      const serialized = Signature.toHex(signature)

      const envelope = SignatureEnvelope.from(serialized)

      expect(envelope).toMatchObject({
        r: signature.r,
        s: signature.s,
        yParity: signature.yParity,
        type: 'secp256k1',
      })
    })

    test('behavior: returns object as-is', () => {
      const privateKey = Secp256k1.randomPrivateKey()
      const signature = Secp256k1.sign({
        payload: '0xdeadbeef',
        privateKey,
      })
      const envelope: SignatureEnvelope.SignatureEnvelope = {
        ...signature,
        type: 'secp256k1',
      }

      const result = SignatureEnvelope.from(envelope)

      expect(result).toEqual(envelope)
    })
  })
})

describe('getType', () => {
  describe('secp256k1', () => {
    test('behavior: returns explicit type', () => {
      const envelope: SignatureEnvelope.SignatureEnvelope = {
        r: 0n,
        s: 0n,
        yParity: 0,
        type: 'secp256k1',
      }

      expect(SignatureEnvelope.getType(envelope)).toBe('secp256k1')
    })

    test('behavior: infers type from properties', () => {
      const privateKey = Secp256k1.randomPrivateKey()
      const signature = Secp256k1.sign({
        payload: '0xdeadbeef',
        privateKey,
      })

      expect(SignatureEnvelope.getType(signature)).toBe('secp256k1')
    })
  })

  test('error: throws on invalid envelope', () => {
    expect(() =>
      SignatureEnvelope.getType({} as any),
    ).toThrowErrorMatchingInlineSnapshot(
      `[SignatureEnvelope.CoercionError: Unable to coerce value (\`{}\`) to a valid signature envelope.]`,
    )
  })

  test('error: throws on incomplete signature', () => {
    expect(() =>
      SignatureEnvelope.getType({
        r: 0n,
        s: 0n,
      } as any),
    ).toThrowErrorMatchingInlineSnapshot(
      `[SignatureEnvelope.CoercionError: Unable to coerce value (\`{"r":"0#__bigint","s":"0#__bigint"}\`) to a valid signature envelope.]`,
    )
  })
})

describe('serialize', () => {
  describe('secp256k1', () => {
    test('behavior: serializes with explicit type', () => {
      const privateKey = Secp256k1.randomPrivateKey()
      const signature = Secp256k1.sign({
        payload: '0xdeadbeef',
        privateKey,
      })
      const envelope: SignatureEnvelope.SignatureEnvelope = {
        ...signature,
        type: 'secp256k1',
      }

      const serialized = SignatureEnvelope.serialize(envelope)

      expect(serialized).toBe(Signature.toHex(signature))
    })

    test('behavior: serializes without explicit type', () => {
      const privateKey = Secp256k1.randomPrivateKey()
      const signature = Secp256k1.sign({
        payload: '0xdeadbeef',
        privateKey,
      })

      const serialized = SignatureEnvelope.serialize(signature)

      expect(serialized).toBe(Signature.toHex(signature))
    })
  })

  describe('roundtrip', () => {
    describe('secp256k1', () => {
      test('behavior: roundtrips serialize -> deserialize', () => {
        const privateKey = Secp256k1.randomPrivateKey()
        const signature = Secp256k1.sign({
          payload: '0xdeadbeef',
          privateKey,
        })
        const envelope: SignatureEnvelope.SignatureEnvelope = {
          ...signature,
          type: 'secp256k1',
        }

        const serialized = SignatureEnvelope.serialize(envelope)
        const deserialized = SignatureEnvelope.deserialize(serialized)

        expect(deserialized).toMatchObject({
          r: signature.r,
          s: signature.s,
          yParity: signature.yParity,
          type: 'secp256k1',
        })
      })
    })
  })

  test('error: throws on invalid envelope', () => {
    const error = (() => {
      try {
        SignatureEnvelope.serialize({} as any)
      } catch (e) {
        return e
      }
    })() as SignatureEnvelope.CoercionError
    expect(error).toBeInstanceOf(SignatureEnvelope.CoercionError)
    expect(error.message).toMatchInlineSnapshot(
      `"Unable to coerce value (\`{}\`) to a valid signature envelope."`,
    )
  })
})

describe('types', () => {
  test('behavior: contains secp256k1', () => {
    expect(SignatureEnvelope.types).toEqual(['secp256k1'])
  })
})

describe('validate', () => {
  describe('secp256k1', () => {
    test('behavior: returns true for valid signature', () => {
      const privateKey = Secp256k1.randomPrivateKey()
      const signature = Secp256k1.sign({
        payload: '0xdeadbeef',
        privateKey,
      })

      expect(
        SignatureEnvelope.validate({ ...signature, type: 'secp256k1' }),
      ).toBe(true)
    })

    test('behavior: returns true for signature without explicit type', () => {
      const privateKey = Secp256k1.randomPrivateKey()
      const signature = Secp256k1.sign({
        payload: '0xdeadbeef',
        privateKey,
      })

      expect(SignatureEnvelope.validate(signature)).toBe(true)
    })
  })

  test('behavior: returns false for invalid envelope', () => {
    expect(SignatureEnvelope.validate({} as any)).toBe(false)
  })

  test('behavior: returns false for incomplete signature', () => {
    expect(
      SignatureEnvelope.validate({
        r: 0n,
        s: 0n,
      } as any),
    ).toBe(false)
  })

  test('behavior: returns false for invalid signature values', () => {
    expect(
      SignatureEnvelope.validate({
        r: 0n,
        s: 0n,
        yParity: 2,
        type: 'secp256k1',
      }),
    ).toBe(false)
  })
})

describe('CoercionError', () => {
  test('behavior: formats error message with hex string', () => {
    const error = new SignatureEnvelope.CoercionError({
      envelope: '0xdeadbeef',
    })
    expect(error).toMatchInlineSnapshot(
      `[SignatureEnvelope.CoercionError: Unable to coerce value (\`"0xdeadbeef"\`) to a valid signature envelope.]`,
    )
  })

  test('behavior: formats error message with object', () => {
    const error = new SignatureEnvelope.CoercionError({
      envelope: { r: 0n, s: 0n, yParity: 0 },
    })
    expect(error).toMatchInlineSnapshot(
      `[SignatureEnvelope.CoercionError: Unable to coerce value (\`{"r":"0#__bigint","s":"0#__bigint","yParity":0}\`) to a valid signature envelope.]`,
    )
  })
})
