import { Hex, P256, Rlp, Secp256k1, Value, WebAuthnP256 } from 'ox'
import { describe, expect, test } from 'vitest'
import { SignatureEnvelope } from './index.js'
import * as KeyAuthorization from './KeyAuthorization.js'
import * as TransactionEnvelopeAA from './TransactionEnvelopeAA.js'

const privateKey =
  '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'

describe('assert', () => {
  test('empty calls list', () => {
    expect(() =>
      TransactionEnvelopeAA.assert({
        calls: [],
        chainId: 1,
      }),
    ).toThrowErrorMatchingInlineSnapshot(
      `[TransactionEnvelopeAA.CallsEmptyError: Calls list cannot be empty.]`,
    )
  })

  test('missing calls', () => {
    expect(() =>
      TransactionEnvelopeAA.assert({
        chainId: 1,
      } as any),
    ).toThrowErrorMatchingInlineSnapshot(
      `[TransactionEnvelopeAA.CallsEmptyError: Calls list cannot be empty.]`,
    )
  })

  test('invalid validity window', () => {
    expect(() =>
      TransactionEnvelopeAA.assert({
        calls: [{ to: '0x0000000000000000000000000000000000000000' }],
        chainId: 1,
        validBefore: 100,
        validAfter: 200,
      }),
    ).toThrowErrorMatchingInlineSnapshot(
      `[TransactionEnvelopeAA.InvalidValidityWindowError: validBefore (100) must be greater than validAfter (200).]`,
    )
  })

  test('invalid validity window (equal)', () => {
    expect(() =>
      TransactionEnvelopeAA.assert({
        calls: [{ to: '0x0000000000000000000000000000000000000000' }],
        chainId: 1,
        validBefore: 100,
        validAfter: 100,
      }),
    ).toThrowErrorMatchingInlineSnapshot(
      `[TransactionEnvelopeAA.InvalidValidityWindowError: validBefore (100) must be greater than validAfter (100).]`,
    )
  })

  test('invalid call address', () => {
    expect(() =>
      TransactionEnvelopeAA.assert({
        calls: [{ to: '0x000000000000000000000000000000000000000z' }],
        chainId: 1,
      }),
    ).toThrowErrorMatchingInlineSnapshot(
      `
      [Address.InvalidAddressError: Address "0x000000000000000000000000000000000000000z" is invalid.

      Details: Address is not a 20 byte (40 hexadecimal character) value.]
    `,
    )
  })

  test('fee cap too high', () => {
    expect(() =>
      TransactionEnvelopeAA.assert({
        calls: [{ to: '0x0000000000000000000000000000000000000000' }],
        maxFeePerGas: 2n ** 256n - 1n + 1n,
        chainId: 1,
      }),
    ).toThrowErrorMatchingInlineSnapshot(
      `[TransactionEnvelope.FeeCapTooHighError: The fee cap (\`maxFeePerGas\`/\`maxPriorityFeePerGas\` = 115792089237316195423570985008687907853269984665640564039457584007913.129639936 gwei) cannot be higher than the maximum allowed value (2^256-1).]`,
    )
  })

  test('tip above fee cap', () => {
    expect(() =>
      TransactionEnvelopeAA.assert({
        calls: [{ to: '0x0000000000000000000000000000000000000000' }],
        chainId: 1,
        maxFeePerGas: 10n,
        maxPriorityFeePerGas: 20n,
      }),
    ).toThrowErrorMatchingInlineSnapshot(
      `[TransactionEnvelope.TipAboveFeeCapError: The provided tip (\`maxPriorityFeePerGas\` = 0.00000002 gwei) cannot be higher than the fee cap (\`maxFeePerGas\` = 0.00000001 gwei).]`,
    )
  })

  test('invalid chain id', () => {
    expect(() =>
      TransactionEnvelopeAA.assert({
        calls: [{ to: '0x0000000000000000000000000000000000000000' }],
        chainId: 0,
      }),
    ).toThrowErrorMatchingInlineSnapshot(
      `[TransactionEnvelope.InvalidChainIdError: Chain ID "0" is invalid.]`,
    )
  })
})

describe('deserialize', () => {
  const transaction = TransactionEnvelopeAA.from({
    chainId: 1,
    calls: [
      {
        to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
      },
    ],
    nonce: 785n,
    nonceKey: 0n,
    maxFeePerGas: Value.fromGwei('2'),
    maxPriorityFeePerGas: Value.fromGwei('2'),
  })

  test('default', () => {
    const serialized = TransactionEnvelopeAA.serialize(transaction)
    const deserialized = TransactionEnvelopeAA.deserialize(serialized)
    expect(deserialized).toEqual(transaction)
  })

  test('minimal', () => {
    const transaction = TransactionEnvelopeAA.from({
      chainId: 1,
      calls: [{}],
      nonce: 0n,
      nonceKey: 0n,
    })
    const serialized = TransactionEnvelopeAA.serialize(transaction)
    expect(TransactionEnvelopeAA.deserialize(serialized)).toEqual(transaction)
  })

  test('multiple calls', () => {
    const transaction_multiCall = TransactionEnvelopeAA.from({
      ...transaction,
      calls: [
        {
          to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
        },
        {
          to: '0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc',
          value: Value.from('0.002', 6),
          data: '0x1234',
        },
      ],
    })
    const serialized = TransactionEnvelopeAA.serialize(transaction_multiCall)
    expect(TransactionEnvelopeAA.deserialize(serialized)).toEqual(
      transaction_multiCall,
    )
  })

  test('gas', () => {
    const transaction_gas = TransactionEnvelopeAA.from({
      ...transaction,
      gas: 21001n,
    })
    const serialized = TransactionEnvelopeAA.serialize(transaction_gas)
    expect(TransactionEnvelopeAA.deserialize(serialized)).toEqual(
      transaction_gas,
    )
  })

  test('accessList', () => {
    const transaction_accessList = TransactionEnvelopeAA.from({
      ...transaction,
      accessList: [
        {
          address: '0x0000000000000000000000000000000000000000',
          storageKeys: [
            '0x0000000000000000000000000000000000000000000000000000000000000001',
            '0x60fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fe',
          ],
        },
      ],
    })
    const serialized = TransactionEnvelopeAA.serialize(transaction_accessList)
    expect(TransactionEnvelopeAA.deserialize(serialized)).toEqual(
      transaction_accessList,
    )
  })

  test('nonce', () => {
    const transaction_nonce = TransactionEnvelopeAA.from({
      ...transaction,
      nonce: 0n,
    })
    const serialized = TransactionEnvelopeAA.serialize(transaction_nonce)
    expect(TransactionEnvelopeAA.deserialize(serialized)).toEqual(
      transaction_nonce,
    )
  })

  test('nonceKey', () => {
    const transaction_nonceKey = TransactionEnvelopeAA.from({
      ...transaction,
      nonceKey: 0n,
    })
    const serialized = TransactionEnvelopeAA.serialize(transaction_nonceKey)
    expect(TransactionEnvelopeAA.deserialize(serialized)).toEqual(
      transaction_nonceKey,
    )
  })

  test('validBefore', () => {
    const transaction_validBefore = TransactionEnvelopeAA.from({
      ...transaction,
      validBefore: 1000000,
    })
    const serialized = TransactionEnvelopeAA.serialize(transaction_validBefore)
    expect(TransactionEnvelopeAA.deserialize(serialized)).toEqual(
      transaction_validBefore,
    )
  })

  test('validAfter', () => {
    const transaction_validAfter = TransactionEnvelopeAA.from({
      ...transaction,
      validAfter: 500000,
    })
    const serialized = TransactionEnvelopeAA.serialize(transaction_validAfter)
    expect(TransactionEnvelopeAA.deserialize(serialized)).toEqual(
      transaction_validAfter,
    )
  })

  test('validBefore and validAfter', () => {
    const transaction_validity = TransactionEnvelopeAA.from({
      ...transaction,
      validBefore: 1000000,
      validAfter: 500000,
    })
    const serialized = TransactionEnvelopeAA.serialize(transaction_validity)
    expect(TransactionEnvelopeAA.deserialize(serialized)).toEqual(
      transaction_validity,
    )
  })

  test('feeToken', () => {
    const transaction_feeToken = TransactionEnvelopeAA.from({
      ...transaction,
      feeToken: '0x20c0000000000000000000000000000000000000',
    })
    const serialized = TransactionEnvelopeAA.serialize(transaction_feeToken)
    expect(TransactionEnvelopeAA.deserialize(serialized)).toEqual(
      transaction_feeToken,
    )
  })

  test('keyAuthorization', () => {
    const keyAuthorization = KeyAuthorization.from({
      expiry: 1234567890,
      address: '0xbe95c3f554e9fc85ec51be69a3d807a0d55bcf2c',
      type: 'secp256k1',
      limits: [
        {
          token: '0x20c0000000000000000000000000000000000001',
          limit: Value.from('10', 6),
        },
      ],
      signature: SignatureEnvelope.from({
        r: 44944627813007772897391531230081695102703289123332187696115181104739239197517n,
        s: 36528503505192438307355164441104001310566505351980369085208178712678799181120n,
        yParity: 0,
      }),
    })

    const transaction_keyAuthorization = TransactionEnvelopeAA.from({
      ...transaction,
      keyAuthorization,
    })

    const serialized = TransactionEnvelopeAA.serialize(
      transaction_keyAuthorization,
    )
    expect(TransactionEnvelopeAA.deserialize(serialized)).toEqual(
      transaction_keyAuthorization,
    )
  })

  describe('signature', () => {
    test('secp256k1', () => {
      const signature = Secp256k1.sign({
        payload: TransactionEnvelopeAA.getSignPayload(transaction),
        privateKey,
      })
      const serialized = TransactionEnvelopeAA.serialize(transaction, {
        signature: SignatureEnvelope.from(signature),
      })
      expect(TransactionEnvelopeAA.deserialize(serialized)).toEqual({
        ...transaction,
        signature: { signature, type: 'secp256k1' },
      })
    })

    test('p256', () => {
      const privateKey = P256.randomPrivateKey()
      const publicKey = P256.getPublicKey({ privateKey })
      const signature = P256.sign({
        payload: TransactionEnvelopeAA.getSignPayload(transaction),
        privateKey,
      })
      const serialized = TransactionEnvelopeAA.serialize(transaction, {
        signature: SignatureEnvelope.from({
          signature,
          publicKey,
          prehash: true,
        }),
      })
      // biome-ignore lint/suspicious/noTsIgnore: _
      // @ts-ignore
      delete signature.yParity
      expect(TransactionEnvelopeAA.deserialize(serialized)).toEqual({
        ...transaction,
        signature: { prehash: true, publicKey, signature, type: 'p256' },
      })
    })
  })

  test('feePayerSignature null', () => {
    const transaction_feePayer = TransactionEnvelopeAA.from({
      ...transaction,
      feePayerSignature: null,
    })
    const serialized = TransactionEnvelopeAA.serialize(transaction_feePayer)
    expect(TransactionEnvelopeAA.deserialize(serialized)).toEqual(
      transaction_feePayer,
    )
  })

  test('feePayerSignature with address', () => {
    const serialized = `0x76${Rlp.fromHex([
      Hex.fromNumber(1), // chainId
      Hex.fromNumber(1), // maxPriorityFeePerGas
      Hex.fromNumber(1), // maxFeePerGas
      Hex.fromNumber(1), // gas
      [
        [
          '0x0000000000000000000000000000000000000000', // to
          Hex.fromNumber(0), // value
          '0x', // data
        ],
      ], // calls
      '0x', // accessList
      Hex.fromNumber(0), // nonceKey
      Hex.fromNumber(0), // nonce
      '0x', // validBefore
      '0x', // validAfter
      '0x', // feeToken
      '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266', // feePayerSignatureOrSender (address)
      [], // authorizationList
    ]).slice(2)}` as const
    const deserialized = TransactionEnvelopeAA.deserialize(serialized)
    expect(deserialized.feePayerSignature).toBe(null)
  })

  test('feePayerSignature with signature tuple', () => {
    const serialized = `0x76${Rlp.fromHex([
      Hex.fromNumber(1), // chainId
      Hex.fromNumber(1), // maxPriorityFeePerGas
      Hex.fromNumber(1), // maxFeePerGas
      Hex.fromNumber(1), // gas
      [
        [
          '0x0000000000000000000000000000000000000000', // to
          Hex.fromNumber(0), // value
          '0x', // data
        ],
      ], // calls
      '0x', // accessList
      Hex.fromNumber(0), // nonceKey
      Hex.fromNumber(0), // nonce
      '0x', // validBefore
      '0x', // validAfter
      '0x', // feeToken
      [Hex.fromNumber(0), Hex.fromNumber(1), Hex.fromNumber(2)], // feePayerSignatureOrSender (signature tuple)
      [], // authorizationList
    ]).slice(2)}` as const
    const deserialized = TransactionEnvelopeAA.deserialize(serialized)
    expect(deserialized.feePayerSignature).toEqual({
      yParity: 0,
      r: 1n,
      s: 2n,
    })
  })

  describe('raw', () => {
    test('default', () => {
      const serialized = `0x76${Rlp.fromHex([
        Hex.fromNumber(1), // chainId
        Hex.fromNumber(1), // maxPriorityFeePerGas
        Hex.fromNumber(1), // maxFeePerGas
        Hex.fromNumber(1), // gas
        [
          [
            '0x0000000000000000000000000000000000000000', // to
            Hex.fromNumber(0), // value
            '0x', // data
          ],
        ], // calls
        '0x', // accessList
        Hex.fromNumber(0), // nonceKey
        Hex.fromNumber(0), // nonce
        '0x', // validBefore
        '0x', // validAfter
        '0x', // feeToken
        '0x', // feePayerSignature
        [], // authorizationList
      ]).slice(2)}` as const
      expect(
        TransactionEnvelopeAA.deserialize(serialized),
      ).toMatchInlineSnapshot(`
        {
          "calls": [
            {
              "to": "0x0000000000000000000000000000000000000000",
              "value": 0n,
            },
          ],
          "chainId": 1,
          "gas": 1n,
          "maxFeePerGas": 1n,
          "maxPriorityFeePerGas": 1n,
          "nonce": 0n,
          "nonceKey": 0n,
          "type": "aa",
        }
      `)
    })

    test('empty sig', () => {
      const serialized = `0x76${Rlp.fromHex([
        Hex.fromNumber(1), // chainId
        Hex.fromNumber(1), // maxPriorityFeePerGas
        Hex.fromNumber(1), // maxFeePerGas
        Hex.fromNumber(1), // gas
        [
          [
            '0x0000000000000000000000000000000000000000', // to
            Hex.fromNumber(0), // value
            '0x', // data
          ],
        ], // calls
        '0x', // accessList
        Hex.fromNumber(0), // nonceKey
        Hex.fromNumber(0), // nonce
        '0x', // validBefore
        '0x', // validAfter
        '0x', // feeToken
        '0x', // feePayerSignature
        [], // authorizationList
      ]).slice(2)}` as const
      expect(
        TransactionEnvelopeAA.deserialize(serialized),
      ).toMatchInlineSnapshot(`
        {
          "calls": [
            {
              "to": "0x0000000000000000000000000000000000000000",
              "value": 0n,
            },
          ],
          "chainId": 1,
          "gas": 1n,
          "maxFeePerGas": 1n,
          "maxPriorityFeePerGas": 1n,
          "nonce": 0n,
          "nonceKey": 0n,
          "type": "aa",
        }
      `)
    })
  })

  describe('errors', () => {
    test('invalid transaction (all missing)', () => {
      expect(() =>
        TransactionEnvelopeAA.deserialize(`0x76${Rlp.fromHex([]).slice(2)}`),
      ).toThrowErrorMatchingInlineSnapshot(`
        [TransactionEnvelope.InvalidSerializedError: Invalid serialized transaction of type "aa" was provided.

        Serialized Transaction: "0x76c0"
        Missing Attributes: chainId, maxPriorityFeePerGas, maxFeePerGas, gas, calls, accessList, keyAuthorization, nonceKey, nonce, validBefore, validAfter, feeToken, feePayerSignatureOrSender]
      `)
    })

    test('invalid transaction (some missing)', () => {
      expect(() =>
        TransactionEnvelopeAA.deserialize(
          `0x76${Rlp.fromHex(['0x00', '0x01']).slice(2)}`,
        ),
      ).toThrowErrorMatchingInlineSnapshot(`
        [TransactionEnvelope.InvalidSerializedError: Invalid serialized transaction of type "aa" was provided.

        Serialized Transaction: "0x76c20001"
        Missing Attributes: maxFeePerGas, gas, calls, accessList, keyAuthorization, nonceKey, nonce, validBefore, validAfter, feeToken, feePayerSignatureOrSender]
      `)
    })

    test('invalid transaction (empty calls)', () => {
      expect(() =>
        TransactionEnvelopeAA.deserialize(
          `0x76${Rlp.fromHex([
            Hex.fromNumber(1), // chainId
            Hex.fromNumber(1), // maxPriorityFeePerGas
            Hex.fromNumber(1), // maxFeePerGas
            Hex.fromNumber(1), // gas
            [], // calls (empty)
            '0x', // accessList
            Hex.fromNumber(0), // nonceKey
            Hex.fromNumber(0), // nonce
            '0x', // validBefore
            '0x', // validAfter
            '0x', // feeToken
            '0x', // feePayerSignature
            [], // authorizationList
          ]).slice(2)}`,
        ),
      ).toThrowErrorMatchingInlineSnapshot(
        `[TransactionEnvelopeAA.CallsEmptyError: Calls list cannot be empty.]`,
      )
    })

    test('invalid transaction (too many fields with signature)', () => {
      expect(() =>
        TransactionEnvelopeAA.deserialize(
          `0x76${Rlp.fromHex([
            Hex.fromNumber(1), // chainId
            Hex.fromNumber(1), // maxPriorityFeePerGas
            Hex.fromNumber(1), // maxFeePerGas
            Hex.fromNumber(1), // gas
            [
              [
                '0x0000000000000000000000000000000000000000',
                Hex.fromNumber(0),
                '0x',
              ],
            ], // calls
            '0x', // accessList
            Hex.fromNumber(0), // nonceKey
            Hex.fromNumber(0), // nonce
            '0x', // validBefore
            '0x', // validAfter
            '0x', // feeToken
            '0x', // feePayerSignature
            [], // authorizationList
            [], // keyAuthorization
            '0x1234', // signature
            '0x5678', // extra field
          ]).slice(2)}`,
        ),
      ).toThrowErrorMatchingInlineSnapshot(`
        [TransactionEnvelope.InvalidSerializedError: Invalid serialized transaction of type "aa" was provided.

        Serialized Transaction: "0x76ec01010101d8d7940000000000000000000000000000000000000000008080000080808080c0c0821234825678"]
      `)
    })
  })
})

describe('from', () => {
  test('default', () => {
    {
      const envelope = TransactionEnvelopeAA.from({
        chainId: 1,
        calls: [{}],
        nonce: 0n,
        nonceKey: 0n,
      })
      expect(envelope).toMatchInlineSnapshot(`
        {
          "calls": [
            {},
          ],
          "chainId": 1,
          "nonce": 0n,
          "nonceKey": 0n,
          "type": "aa",
        }
      `)
      const serialized = TransactionEnvelopeAA.serialize(envelope)
      const envelope2 = TransactionEnvelopeAA.from(serialized)
      expect(envelope2).toEqual(envelope)
    }

    {
      const envelope = TransactionEnvelopeAA.from({
        chainId: 1,
        calls: [{ to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8' }],
        nonce: 0n,
        nonceKey: 0n,
        signature: SignatureEnvelope.from({
          r: 0n,
          s: 1n,
          yParity: 0,
        }),
      })
      expect(envelope).toMatchInlineSnapshot(`
        {
          "calls": [
            {
              "to": "0x70997970c51812dc3a010c7d01b50e0d17dc79c8",
            },
          ],
          "chainId": 1,
          "nonce": 0n,
          "nonceKey": 0n,
          "signature": {
            "signature": {
              "r": 0n,
              "s": 1n,
              "yParity": 0,
            },
            "type": "secp256k1",
          },
          "type": "aa",
        }
      `)
      const serialized = TransactionEnvelopeAA.serialize(envelope)
      const envelope2 = TransactionEnvelopeAA.from(serialized)
      expect(envelope2).toEqual({
        ...envelope,
        signature: { ...envelope.signature, type: 'secp256k1' },
      })
    }
  })

  test('options: signature', () => {
    const envelope = TransactionEnvelopeAA.from(
      {
        chainId: 1,
        calls: [{}],
        nonce: 0n,
        nonceKey: 0n,
      },
      {
        signature: SignatureEnvelope.from({
          r: 0n,
          s: 1n,
          yParity: 0,
        }),
      },
    )
    expect(envelope).toMatchInlineSnapshot(`
      {
        "calls": [
          {},
        ],
        "chainId": 1,
        "nonce": 0n,
        "nonceKey": 0n,
        "signature": {
          "signature": {
            "r": 0n,
            "s": 1n,
            "yParity": 0,
          },
          "type": "secp256k1",
        },
        "type": "aa",
      }
    `)
    const serialized = TransactionEnvelopeAA.serialize(envelope)
    const envelope2 = TransactionEnvelopeAA.from(serialized)
    expect(envelope2).toEqual(envelope)
  })

  test('options: feePayerSignature', () => {
    const envelope = TransactionEnvelopeAA.from(
      {
        chainId: 1,
        calls: [{}],
        nonce: 0n,
        r: 1n,
        s: 2n,
        yParity: 0,
      },
      {
        feePayerSignature: {
          r: 0n,
          s: 1n,
          yParity: 0,
        },
      },
    )
    expect(envelope).toMatchInlineSnapshot(`
      {
        "calls": [
          {},
        ],
        "chainId": 1,
        "feePayerSignature": {
          "r": 0n,
          "s": 1n,
          "yParity": 0,
        },
        "nonce": 0n,
        "r": 1n,
        "s": 2n,
        "type": "aa",
        "yParity": 0,
      }
    `)
  })

  test('options: feePayerSignature (null)', () => {
    const envelope = TransactionEnvelopeAA.from(
      {
        chainId: 1,
        calls: [{}],
        nonce: 0n,
      },
      {
        feePayerSignature: null,
      },
    )
    expect(envelope).toMatchInlineSnapshot(`
      {
        "calls": [
          {},
        ],
        "chainId": 1,
        "nonce": 0n,
        "type": "aa",
      }
    `)
  })
})

describe('serialize', () => {
  test('default', () => {
    const transaction = TransactionEnvelopeAA.from({
      chainId: 1,
      calls: [
        {
          to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
        },
      ],
      nonce: 785n,
      maxFeePerGas: Value.fromGwei('2'),
      maxPriorityFeePerGas: Value.fromGwei('2'),
    })
    expect(TransactionEnvelopeAA.serialize(transaction)).toMatchInlineSnapshot(
      `"0x76ef018477359400847735940080d8d79470997970c51812dc3a010c7d01b50e0d17dc79c88080c08082031180808080c0"`,
    )
  })

  test('minimal', () => {
    const transaction = TransactionEnvelopeAA.from({
      chainId: 1,
      calls: [{}],
      nonce: 0n,
    })
    expect(TransactionEnvelopeAA.serialize(transaction)).toMatchInlineSnapshot(
      `"0x76d101808080c4c3808080c0808080808080c0"`,
    )
  })

  test('undefined nonceKey', () => {
    const transaction = TransactionEnvelopeAA.from({
      chainId: 1,
      calls: [{}],
      nonce: 0n,
      nonceKey: undefined,
    })
    const serialized = TransactionEnvelopeAA.serialize(transaction)
    expect(serialized).toMatchInlineSnapshot(
      `"0x76d101808080c4c3808080c0808080808080c0"`,
    )
  })

  test('multiple calls', () => {
    const transaction = TransactionEnvelopeAA.from({
      chainId: 1,
      calls: [
        {
          to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
        },
        {
          to: '0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc',
          value: Value.from('0.002', 6),
          data: '0x1234',
        },
      ],
      nonce: 0n,
    })
    expect(TransactionEnvelopeAA.serialize(transaction)).toMatchInlineSnapshot(
      `"0x76f84101808080f4d79470997970c51812dc3a010c7d01b50e0d17dc79c88080db943c44cdddb6a900fa2b585dd299e03d12fa4293bc8207d0821234c0808080808080c0"`,
    )
  })

  test('keyAuthorization (secp256k1)', () => {
    const keyAuthorization = KeyAuthorization.from({
      address: '0xbe95c3f554e9fc85ec51be69a3d807a0d55bcf2c',
      expiry: 1234567890,
      type: 'secp256k1',
      limits: [
        {
          token: '0x20c0000000000000000000000000000000000001',
          limit: Value.from('10', 6),
        },
      ],
      signature: SignatureEnvelope.from({
        r: 44944627813007772897391531230081695102703289123332187696115181104739239197517n,
        s: 36528503505192438307355164441104001310566505351980369085208178712678799181120n,
        yParity: 0,
      }),
    })

    const transaction = TransactionEnvelopeAA.from({
      chainId: 1,
      calls: [{ to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8' }],
      nonce: 0n,
      keyAuthorization,
    })

    const serialized = TransactionEnvelopeAA.serialize(transaction)
    expect(serialized).toMatchInlineSnapshot(
      `"0x76f8a001808080d8d79470997970c51812dc3a010c7d01b50e0d17dc79c88080c0808080808080c0f8798084499602d2dad99420c00000000000000000000000000000000000018398968094be95c3f554e9fc85ec51be69a3d807a0d55bcf2cb841635dc2033e60185bb36709c29c75d64ea51dfbd91c32ef4be198e4ceb169fb4d50c2667ac4c771072746acfdcf1f1483336dcca8bd2df47cd83175dbe60f05401b"`,
    )

    const deserialized = TransactionEnvelopeAA.deserialize(serialized)
    expect(deserialized.keyAuthorization).toEqual(keyAuthorization)
  })

  test('keyAuthorization (p256)', () => {
    const keyAuthorization = KeyAuthorization.from({
      address: '0xbe95c3f554e9fc85ec51be69a3d807a0d55bcf2c',
      expiry: 1234567890,
      type: 'p256',
      limits: [
        {
          token: '0x20c0000000000000000000000000000000000001',
          limit: Value.from('10', 6),
        },
      ],
      signature: SignatureEnvelope.from({
        signature: {
          r: 92602584010956101470289867944347135737570451066466093224269890121909314569518n,
          s: 54171125190222965779385658110416711469231271457324878825831748147306957269813n,
        },
        publicKey: {
          prefix: 4,
          x: 78495282704852028275327922540131762143565388050940484317945369745559774511861n,
          y: 8109764566587999957624872393871720746996669263962991155166704261108473113504n,
        },
        prehash: true,
      }),
    })

    const transaction = TransactionEnvelopeAA.from({
      chainId: 1,
      calls: [{ to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8' }],
      nonce: 0n,
      keyAuthorization,
    })

    const serialized = TransactionEnvelopeAA.serialize(transaction)
    expect(serialized).toMatchInlineSnapshot(
      `"0x76f8e101808080d8d79470997970c51812dc3a010c7d01b50e0d17dc79c88080c0808080808080c0f8ba0184499602d2dad99420c00000000000000000000000000000000000018398968094be95c3f554e9fc85ec51be69a3d807a0d55bcf2cb88201ccbb3485d4726235f13cb15ef394fb7158179fb7b1925eccec0147671090c52e77c3c53373cc1e3b05e7c23f609deb17cea8fe097300c45411237e9fe4166b35ad8ac16e167d6992c3e120d7f17d2376bc1cbcf30c46ba6dd00ce07303e742f511edf6ce1c32de66846f56afa7be1cbd729bc35750b6d0cdcf3ec9d75461aba001"`,
    )

    const deserialized = TransactionEnvelopeAA.deserialize(serialized)
    expect(deserialized.keyAuthorization).toEqual(keyAuthorization)
  })

  test('keyAuthorization (webAuthn)', () => {
    const metadata = {
      authenticatorData: WebAuthnP256.getAuthenticatorData({
        rpId: 'localhost',
      }),
      clientDataJSON: WebAuthnP256.getClientDataJSON({
        challenge: '0xdeadbeef',
        origin: 'http://localhost',
      }),
    }

    const keyAuthorization = KeyAuthorization.from({
      address: '0xbe95c3f554e9fc85ec51be69a3d807a0d55bcf2c',
      expiry: 1234567890,
      type: 'webAuthn',
      limits: [
        {
          token: '0x20c0000000000000000000000000000000000001',
          limit: Value.from('10', 6),
        },
      ],
      signature: SignatureEnvelope.from({
        signature: {
          r: 92602584010956101470289867944347135737570451066466093224269890121909314569518n,
          s: 54171125190222965779385658110416711469231271457324878825831748147306957269813n,
        },
        publicKey: {
          prefix: 4,
          x: 78495282704852028275327922540131762143565388050940484317945369745559774511861n,
          y: 8109764566587999957624872393871720746996669263962991155166704261108473113504n,
        },
        metadata,
      }),
    })

    const transaction = TransactionEnvelopeAA.from({
      chainId: 1,
      calls: [{ to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8' }],
      nonce: 0n,
      keyAuthorization,
    })

    const serialized = TransactionEnvelopeAA.serialize(transaction)
    expect(serialized).toMatchInlineSnapshot(
      `"0x76f9016301808080d8d79470997970c51812dc3a010c7d01b50e0d17dc79c88080c0808080808080c0f9013b0284499602d2dad99420c00000000000000000000000000000000000018398968094be95c3f554e9fc85ec51be69a3d807a0d55bcf2cb901020249960de5880e8c687434170f6476605b8fe4aeb9a28632c7995cf3ba831d976305000000007b2274797065223a22776562617574686e2e676574222c226368616c6c656e6765223a223371322d3777222c226f726967696e223a22687474703a2f2f6c6f63616c686f7374222c2263726f73734f726967696e223a66616c73657dccbb3485d4726235f13cb15ef394fb7158179fb7b1925eccec0147671090c52e77c3c53373cc1e3b05e7c23f609deb17cea8fe097300c45411237e9fe4166b35ad8ac16e167d6992c3e120d7f17d2376bc1cbcf30c46ba6dd00ce07303e742f511edf6ce1c32de66846f56afa7be1cbd729bc35750b6d0cdcf3ec9d75461aba0"`,
    )

    // Verify roundtrip
    const deserialized = TransactionEnvelopeAA.deserialize(serialized)
    expect(deserialized.keyAuthorization).toEqual(keyAuthorization)
  })

  describe('with signature', () => {
    test('secp256k1', () => {
      const transaction = TransactionEnvelopeAA.from({
        chainId: 1,
        calls: [{ to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8' }],
        nonce: 0n,
      })
      const signature = Secp256k1.sign({
        payload: TransactionEnvelopeAA.getSignPayload(transaction),
        privateKey,
      })
      expect(
        TransactionEnvelopeAA.serialize(transaction, {
          signature: SignatureEnvelope.from(signature),
        }),
      ).toMatchInlineSnapshot(
        `"0x76f86801808080d8d79470997970c51812dc3a010c7d01b50e0d17dc79c88080c0808080808080c0b8416b37e17bf41d92dfee5ffdce55431bf01dd7875b2229d6258350c5ee6fe6a54225b867dc1b19c9ec97833ebdccd830d2846c5b724b72dcd754d694d08b5e80ee1c"`,
      )
    })

    test('p256', () => {
      const transaction = TransactionEnvelopeAA.from({
        chainId: 1,
        calls: [{ to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8' }],
        nonce: 0n,
      })
      const privateKey = P256.randomPrivateKey()
      const publicKey = P256.getPublicKey({ privateKey })
      const signature = P256.sign({
        payload: TransactionEnvelopeAA.getSignPayload(transaction),
        privateKey,
      })
      const serialized = TransactionEnvelopeAA.serialize(transaction, {
        signature: SignatureEnvelope.from({
          signature,
          publicKey,
          prehash: true,
        }),
      })
      // biome-ignore lint/suspicious/noTsIgnore: _
      // @ts-ignore
      delete signature.yParity
      expect(TransactionEnvelopeAA.deserialize(serialized)).toEqual({
        ...transaction,
        nonceKey: 0n,
        signature: { prehash: true, publicKey, signature, type: 'p256' },
      })
    })
  })

  test('with feePayerSignature', () => {
    const transaction = TransactionEnvelopeAA.from({
      chainId: 1,
      calls: [{ to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8' }],
      nonce: 0n,
    })
    expect(
      TransactionEnvelopeAA.serialize(transaction, {
        feePayerSignature: {
          r: 1n,
          s: 2n,
          yParity: 0,
        },
      }),
    ).toMatchInlineSnapshot(
      `"0x76e801808080d8d79470997970c51812dc3a010c7d01b50e0d17dc79c88080c08080808080c3800102c0"`,
    )
  })

  test('with feePayerSignature (null)', () => {
    const transaction = TransactionEnvelopeAA.from({
      chainId: 1,
      calls: [{ to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8' }],
      nonce: 0n,
    })
    expect(
      TransactionEnvelopeAA.serialize(transaction, {
        feePayerSignature: null,
      }),
    ).toMatchInlineSnapshot(
      `"0x76e501808080d8d79470997970c51812dc3a010c7d01b50e0d17dc79c88080c0808080808000c0"`,
    )
  })

  test('format: feePayer', () => {
    const transaction = TransactionEnvelopeAA.from({
      chainId: 1,
      calls: [{ to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8' }],
      nonce: 0n,
    })
    expect(
      TransactionEnvelopeAA.serialize(transaction, {
        sender: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
        format: 'feePayer',
      }),
    ).toMatchInlineSnapshot(
      `"0x78f83901808080d8d79470997970c51812dc3a010c7d01b50e0d17dc79c88080c0808080808094f39fd6e51aad88f6f4ce6ab8827279cfffb92266c0"`,
    )
  })
})

describe('hash', () => {
  describe('default', () => {
    test('secp256k1', () => {
      const transaction = TransactionEnvelopeAA.from({
        chainId: 1,
        calls: [
          {
            to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
          },
        ],
        nonce: 0n,
      })
      const signature = Secp256k1.sign({
        payload: TransactionEnvelopeAA.getSignPayload(transaction),
        privateKey,
      })
      const signed = TransactionEnvelopeAA.from(transaction, {
        signature: SignatureEnvelope.from(signature),
      })
      expect(TransactionEnvelopeAA.hash(signed)).toMatchInlineSnapshot(
        `"0x04ad27d1607bc3fc37445724d8864b0843f88008bafd818814474e5ee94647eb"`,
      )
    })
  })

  test('presign', () => {
    const transaction = TransactionEnvelopeAA.from({
      chainId: 1,
      calls: [
        {
          to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
        },
      ],
      nonce: 0n,
    })
    expect(
      TransactionEnvelopeAA.hash(transaction, { presign: true }),
    ).toMatchInlineSnapshot(
      `"0xe1222a45806457acbe3a13940aae4c34f3180659fa16613b5a45dc183adae07c"`,
    )
  })
})

describe('getSignPayload', () => {
  test('default', () => {
    const transaction = TransactionEnvelopeAA.from({
      chainId: 1,
      calls: [
        {
          to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
        },
      ],
      nonce: 0n,
    })
    expect(
      TransactionEnvelopeAA.getSignPayload(transaction),
    ).toMatchInlineSnapshot(
      `"0xe1222a45806457acbe3a13940aae4c34f3180659fa16613b5a45dc183adae07c"`,
    )
  })
})

describe('getFeePayerSignPayload', () => {
  test('default', () => {
    const transaction = TransactionEnvelopeAA.from({
      chainId: 1,
      calls: [
        {
          to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
        },
      ],
      nonce: 0n,
    })
    expect(
      TransactionEnvelopeAA.getFeePayerSignPayload(transaction, {
        sender: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
      }),
    ).toMatchInlineSnapshot(
      `"0xde7a88984d766d0f5aac705487b43e68261516d6e7c524698804d4970d39d77d"`,
    )
  })

  test('with feeToken', () => {
    const transaction = TransactionEnvelopeAA.from({
      chainId: 1,
      calls: [
        {
          to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
        },
      ],
      nonce: 0n,
      feeToken: '0x20c0000000000000000000000000000000000000',
    })
    const hash1 = TransactionEnvelopeAA.getFeePayerSignPayload(transaction, {
      sender: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
    })

    // Change feeToken - hash should be different
    const transaction2 = TransactionEnvelopeAA.from({
      ...transaction,
      feeToken: '0x20c0000000000000000000000000000000000001',
    })
    const hash2 = TransactionEnvelopeAA.getFeePayerSignPayload(transaction2, {
      sender: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
    })

    expect(hash1).not.toBe(hash2)
  })
})

describe('validate', () => {
  test('valid', () => {
    expect(
      TransactionEnvelopeAA.validate({
        calls: [{ to: '0x0000000000000000000000000000000000000000' }],
        chainId: 1,
      }),
    ).toBe(true)
  })

  test('invalid (empty calls)', () => {
    expect(
      TransactionEnvelopeAA.validate({
        calls: [],
        chainId: 1,
      }),
    ).toBe(false)
  })

  test('invalid (validity window)', () => {
    expect(
      TransactionEnvelopeAA.validate({
        calls: [{ to: '0x0000000000000000000000000000000000000000' }],
        chainId: 1,
        validBefore: 100,
        validAfter: 200,
      }),
    ).toBe(false)
  })
})
