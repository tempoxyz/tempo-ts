import { Hex, Rlp, RpcTransport, Secp256k1, Value } from 'ox'
import { afterEach, beforeEach, describe, expect, test } from 'vitest'
import { Instance } from '../prool/index.js'
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
        validBefore: 100n,
        validAfter: 200n,
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
        validBefore: 100n,
        validAfter: 100n,
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
        value: Value.fromEther('1'),
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
          value: Value.fromEther('1'),
        },
        {
          to: '0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc',
          value: Value.fromEther('2'),
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
      validBefore: 1000000n,
    })
    const serialized = TransactionEnvelopeAA.serialize(transaction_validBefore)
    expect(TransactionEnvelopeAA.deserialize(serialized)).toEqual(
      transaction_validBefore,
    )
  })

  test('validAfter', () => {
    const transaction_validAfter = TransactionEnvelopeAA.from({
      ...transaction,
      validAfter: 500000n,
    })
    const serialized = TransactionEnvelopeAA.serialize(transaction_validAfter)
    expect(TransactionEnvelopeAA.deserialize(serialized)).toEqual(
      transaction_validAfter,
    )
  })

  test('validBefore and validAfter', () => {
    const transaction_validity = TransactionEnvelopeAA.from({
      ...transaction,
      validBefore: 1000000n,
      validAfter: 500000n,
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

  describe('signature', () => {
    test('secp256k1', () => {
      const signature = Secp256k1.sign({
        payload: TransactionEnvelopeAA.getSignPayload(transaction),
        privateKey,
      })
      const serialized = TransactionEnvelopeAA.serialize(transaction, {
        signature,
      })
      expect(TransactionEnvelopeAA.deserialize(serialized)).toEqual({
        ...transaction,
        signature: { ...signature, type: 'secp256k1' },
      })
    })

    test.todo('p256')

    test.todo('webauthn')
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
        Missing Attributes: chainId, maxPriorityFeePerGas, maxFeePerGas, gas, calls, accessList, nonceKey, nonce, validBefore, validAfter, feeToken, feePayerSignatureOrSender]
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
        Missing Attributes: maxFeePerGas, gas, calls, accessList, nonceKey, nonce, validBefore, validAfter, feeToken, feePayerSignatureOrSender]
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
            '0x1234', // signature
            '0x5678', // extra field
          ]).slice(2)}`,
        ),
      ).toThrowErrorMatchingInlineSnapshot(`
        [TransactionEnvelope.InvalidSerializedError: Invalid serialized transaction of type "aa" was provided.

        Serialized Transaction: "0x76ea01010101d8d7940000000000000000000000000000000000000000008080000080808080821234825678"]
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
        signature: {
          r: 0n,
          s: 1n,
          yParity: 0,
        },
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
            "r": 0n,
            "s": 1n,
            "yParity": 0,
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
        signature: {
          r: 0n,
          s: 1n,
          yParity: 0,
          type: 'secp256k1',
        },
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
          "r": 0n,
          "s": 1n,
          "type": "secp256k1",
          "yParity": 0,
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
          value: Value.fromEther('1'),
        },
      ],
      nonce: 785n,
      maxFeePerGas: Value.fromGwei('2'),
      maxPriorityFeePerGas: Value.fromGwei('2'),
    })
    expect(TransactionEnvelopeAA.serialize(transaction)).toMatchInlineSnapshot(
      `"0x76f6018477359400847735940080e0df9470997970c51812dc3a010c7d01b50e0d17dc79c8880de0b6b3a764000080c08082031180808080"`,
    )
  })

  test('minimal', () => {
    const transaction = TransactionEnvelopeAA.from({
      chainId: 1,
      calls: [{}],
      nonce: 0n,
    })
    expect(TransactionEnvelopeAA.serialize(transaction)).toMatchInlineSnapshot(
      `"0x76d001808080c4c3808080c0808080808080"`,
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
      `"0x76d001808080c4c3808080c0808080808080"`,
    )
  })

  test('multiple calls', () => {
    const transaction = TransactionEnvelopeAA.from({
      chainId: 1,
      calls: [
        {
          to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
          value: Value.fromEther('1'),
        },
        {
          to: '0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc',
          value: Value.fromEther('2'),
          data: '0x1234',
        },
      ],
      nonce: 0n,
    })
    expect(TransactionEnvelopeAA.serialize(transaction)).toMatchInlineSnapshot(
      `"0x76f84f01808080f842df9470997970c51812dc3a010c7d01b50e0d17dc79c8880de0b6b3a764000080e1943c44cdddb6a900fa2b585dd299e03d12fa4293bc881bc16d674ec80000821234c0808080808080"`,
    )
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
        TransactionEnvelopeAA.serialize(transaction, { signature }),
      ).toMatchInlineSnapshot(
        `"0x76f86701808080d8d79470997970c51812dc3a010c7d01b50e0d17dc79c88080c0808080808080b841e333995974d0f82e5dfdb201476c03516d849f1fd3b05db4bb1595dba9ad207827aca889a4780887341008f2d3fac949b145304735ea395b5d68498e80e138be1b"`,
      )
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
      `"0x76e701808080d8d79470997970c51812dc3a010c7d01b50e0d17dc79c88080c08080808080c3800102"`,
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
      `"0x76e401808080d8d79470997970c51812dc3a010c7d01b50e0d17dc79c88080c0808080808000"`,
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
      `"0x78f83801808080d8d79470997970c51812dc3a010c7d01b50e0d17dc79c88080c0808080808094f39fd6e51aad88f6f4ce6ab8827279cfffb92266"`,
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
            value: Value.fromEther('1'),
          },
        ],
        nonce: 0n,
      })
      const signature = Secp256k1.sign({
        payload: TransactionEnvelopeAA.getSignPayload(transaction),
        privateKey,
      })
      const signed = TransactionEnvelopeAA.from(transaction, { signature })
      expect(TransactionEnvelopeAA.hash(signed)).toMatchInlineSnapshot(
        `"0x3f46e9635e9a55ceb7c4efa5a652227446c392becf1853ca024078974451ba36"`,
      )
    })
  })

  test('presign', () => {
    const transaction = TransactionEnvelopeAA.from({
      chainId: 1,
      calls: [
        {
          to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
          value: Value.fromEther('1'),
        },
      ],
      nonce: 0n,
    })
    expect(
      TransactionEnvelopeAA.hash(transaction, { presign: true }),
    ).toMatchInlineSnapshot(
      `"0x10470898907327464194b05c9d6cbc6bc6c4dab48e6287898c0600dd231f111d"`,
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
          value: Value.fromEther('1'),
        },
      ],
      nonce: 0n,
    })
    expect(
      TransactionEnvelopeAA.getSignPayload(transaction),
    ).toMatchInlineSnapshot(
      `"0x10470898907327464194b05c9d6cbc6bc6c4dab48e6287898c0600dd231f111d"`,
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
          value: Value.fromEther('1'),
        },
      ],
      nonce: 0n,
    })
    expect(
      TransactionEnvelopeAA.getFeePayerSignPayload(transaction, {
        sender: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
      }),
    ).toMatchInlineSnapshot(
      `"0xaeee7aa3df5d00d3ca8fe76e524f1bc728741f4dfb3e99cbb908d666926a1cf6"`,
    )
  })

  test('with feeToken', () => {
    const transaction = TransactionEnvelopeAA.from({
      chainId: 1,
      calls: [
        {
          to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
          value: Value.fromEther('1'),
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
        validBefore: 100n,
        validAfter: 200n,
      }),
    ).toBe(false)
  })
})

describe('e2e', () => {
  const node = Instance.tempo({ port: 3000 })
  beforeEach(() => node.start())
  afterEach(() => node.stop())

  test('behavior: default (secp256k1)', async () => {
    const address = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266'
    const privateKey =
      '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'

    const transport = RpcTransport.fromHttp('http://localhost:3000')

    const nonce = await transport.request({
      method: 'eth_getTransactionCount',
      params: [address, 'pending'],
    })

    const transaction = TransactionEnvelopeAA.from({
      calls: [
        {
          to: '0x0000000000000000000000000000000000000000',
          value: Value.fromEther('1'),
        },
      ],
      chainId: 1337,
      feeToken: '0x20c0000000000000000000000000000000000001',
      nonce: BigInt(nonce),
      gas: 21000n,
      maxFeePerGas: Value.fromGwei('20'),
      maxPriorityFeePerGas: Value.fromGwei('10'),
    })

    const signature = Secp256k1.sign({
      payload: TransactionEnvelopeAA.getSignPayload(transaction),
      privateKey,
    })

    const serialized_signed = TransactionEnvelopeAA.serialize(transaction, {
      signature,
    })

    const receipt = await transport.request({
      method: 'eth_sendRawTransactionSync',
      params: [serialized_signed],
    })

    expect(receipt).toBeDefined()

    {
      const response = await transport.request({
        method: 'eth_getTransactionByHash',
        params: [receipt.transactionHash],
      })
      if (!response) throw new Error()

      const { blockNumber, blockHash, ...rest } = response

      expect(blockNumber).toBeDefined()
      expect(blockHash).toBeDefined()
      expect(rest).toMatchInlineSnapshot(`
        {
          "accessList": [],
          "calls": [
            {
              "input": "0x",
              "to": "0x0000000000000000000000000000000000000000",
              "value": "0xde0b6b3a7640000",
            },
          ],
          "chainId": "0x539",
          "feePayerSignature": null,
          "feeToken": "0x20c0000000000000000000000000000000000001",
          "from": "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
          "gas": "0x5208",
          "gasPrice": "0x2540be42c",
          "hash": "0x8f0b342940fd26937ac79a5a34a005bbbc7cf9a4a9b2d5b3fbba4981d8c6a432",
          "maxFeePerGas": "0x4a817c800",
          "maxPriorityFeePerGas": "0x2540be400",
          "nonce": "0x0",
          "nonceKey": "0x0",
          "signature": {
            "r": "0xb3d0f6d3f45b8aca67546f1011d510a6e28a5ecb5f79f476d0739d5a111d6391",
            "s": "0xc6db913886e16b41a254bde53f3c7980fe27d8b2802d9516f1d7e2aa78ff261",
            "type": "secp256k1",
            "v": "0x0",
            "yParity": "0x0",
          },
          "transactionIndex": "0x0",
          "type": "0x76",
          "validAfter": null,
          "validBefore": null,
        }
      `)
    }

    const { blockNumber, blockHash, ...rest } = receipt

    expect(blockNumber).toBeDefined()
    expect(blockHash).toBeDefined()
    expect(rest).toMatchInlineSnapshot(`
      {
        "contractAddress": null,
        "cumulativeGasUsed": "0x5208",
        "effectiveGasPrice": "0x2540be42c",
        "from": "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
        "gasUsed": "0x5208",
        "logs": [],
        "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
        "status": "0x0",
        "to": "0x0000000000000000000000000000000000000000",
        "transactionHash": "0x8f0b342940fd26937ac79a5a34a005bbbc7cf9a4a9b2d5b3fbba4981d8c6a432",
        "transactionIndex": "0x0",
        "type": "0x76",
      }
    `)
  })

  test.todo('behavior: default (p256)')

  test.todo('behavior: default (webauthn)')

  // TODO: more e2e
})
