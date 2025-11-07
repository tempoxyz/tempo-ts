import {
  Address,
  Hex,
  P256,
  Rlp,
  RpcTransport,
  Secp256k1,
  Value,
  WebAuthnP256,
  WebCryptoP256,
} from 'ox'
import { createClient, http, parseUnits } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { afterEach, beforeEach, describe, expect, test } from 'vitest'
import { tempoLocal } from '../chains.js'
import { Instance } from '../prool/index.js'
import { Actions } from '../viem/index.js'
import { SignatureEnvelope } from './index.js'
import * as Transaction from './Transaction.js'
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
        value: Value.from('0.001', 6),
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
          value: Value.from('0.001', 6),
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
            '0x1234', // signature
            '0x5678', // extra field
          ]).slice(2)}`,
        ),
      ).toThrowErrorMatchingInlineSnapshot(`
        [TransactionEnvelope.InvalidSerializedError: Invalid serialized transaction of type "aa" was provided.

        Serialized Transaction: "0x76eb01010101d8d7940000000000000000000000000000000000000000008080000080808080c0821234825678"]
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
          value: Value.from('0.001', 6),
        },
      ],
      nonce: 785n,
      maxFeePerGas: Value.fromGwei('2'),
      maxPriorityFeePerGas: Value.fromGwei('2'),
    })
    expect(TransactionEnvelopeAA.serialize(transaction)).toMatchInlineSnapshot(
      `"0x76f1018477359400847735940080dad99470997970c51812dc3a010c7d01b50e0d17dc79c88203e880c08082031180808080c0"`,
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
          value: Value.from('0.001', 6),
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
      `"0x76f84301808080f6d99470997970c51812dc3a010c7d01b50e0d17dc79c88203e880db943c44cdddb6a900fa2b585dd299e03d12fa4293bc8207d0821234c0808080808080c0"`,
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
            value: Value.from('0.001', 6),
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
        `"0x10a0722db9339abf44b48ddfdcffe574003043362d9463794cc32bd7b58cdd30"`,
      )
    })
  })

  test('presign', () => {
    const transaction = TransactionEnvelopeAA.from({
      chainId: 1,
      calls: [
        {
          to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
          value: Value.from('0.001', 6),
        },
      ],
      nonce: 0n,
    })
    expect(
      TransactionEnvelopeAA.hash(transaction, { presign: true }),
    ).toMatchInlineSnapshot(
      `"0xef3eaf3a85df1d843290fb1a11f99b22ef4096625f2a65ffb5380e2e259ea003"`,
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
          value: Value.from('0.001', 6),
        },
      ],
      nonce: 0n,
    })
    expect(
      TransactionEnvelopeAA.getSignPayload(transaction),
    ).toMatchInlineSnapshot(
      `"0xef3eaf3a85df1d843290fb1a11f99b22ef4096625f2a65ffb5380e2e259ea003"`,
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
          value: Value.from('0.001', 6),
        },
      ],
      nonce: 0n,
    })
    expect(
      TransactionEnvelopeAA.getFeePayerSignPayload(transaction, {
        sender: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
      }),
    ).toMatchInlineSnapshot(
      `"0x3aa1c1faedc521436188d1fcaf5715a6d00066c4e33260517f2240ce6b72b5f1"`,
    )
  })

  test('with feeToken', () => {
    const transaction = TransactionEnvelopeAA.from({
      chainId: 1,
      calls: [
        {
          to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
          value: Value.from('0.001', 6),
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
          value: Value.from('0.001', 6),
        },
      ],
      chainId: 1337,
      feeToken: '0x20c0000000000000000000000000000000000001',
      nonce: BigInt(nonce),
      gas: 100_000n,
      maxFeePerGas: Value.fromGwei('20'),
      maxPriorityFeePerGas: Value.fromGwei('10'),
    })

    const signature = Secp256k1.sign({
      payload: TransactionEnvelopeAA.getSignPayload(transaction),
      privateKey,
    })

    const serialized_signed = TransactionEnvelopeAA.serialize(transaction, {
      signature: SignatureEnvelope.from(signature),
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
          "aaAuthorizationList": [],
          "accessList": [],
          "calls": [
            {
              "data": null,
              "input": "0x",
              "to": "0x0000000000000000000000000000000000000000",
              "value": "0x3e8",
            },
          ],
          "chainId": "0x539",
          "feePayerSignature": null,
          "feeToken": "0x20c0000000000000000000000000000000000001",
          "from": "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
          "gas": "0x186a0",
          "gasPrice": "0x4a817c800",
          "hash": "0x3c8ab736a60336ee86fdf3a9f9b30b228c93368d12194848324a89cd3e2cdab5",
          "maxFeePerGas": "0x4a817c800",
          "maxPriorityFeePerGas": "0x2540be400",
          "nonce": "0x0",
          "nonceKey": "0x0",
          "signature": {
            "r": "0xea2d0d027a924e6cef441ab214aa7ff13efe0fd0cddf27a4cc46d49f4c12793",
            "s": "0x830471740f75c3199aa9923e4cd9cdbb03c23a6d819dcb26124514b4fbc5be",
            "type": "secp256k1",
            "v": "0x0",
            "yParity": "0x0",
          },
          "transactionIndex": "0x1",
          "type": "0x76",
          "validAfter": null,
          "validBefore": null,
        }
      `)
    }

    const { blockNumber, blockHash, logs, logsBloom, ...rest } = receipt

    expect(blockNumber).toBeDefined()
    expect(blockHash).toBeDefined()
    expect(logs).toBeDefined()
    expect(logsBloom).toBeDefined()
    expect(rest).toMatchInlineSnapshot(`
      {
        "contractAddress": null,
        "cumulativeGasUsed": "0x7f58",
        "effectiveGasPrice": "0x4a817c800",
        "from": "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
        "gasUsed": "0x7f58",
        "status": "0x0",
        "to": "0x0000000000000000000000000000000000000000",
        "transactionHash": "0x3c8ab736a60336ee86fdf3a9f9b30b228c93368d12194848324a89cd3e2cdab5",
        "transactionIndex": "0x1",
        "type": "0x76",
      }
    `)
  })

  test('behavior: default (p256)', async () => {
    const privateKey =
      '0x062d199fd1d30c4a905ed1164a31e73759a13827687a2f3057a7d19c220bc933'
    const publicKey = P256.getPublicKey({ privateKey })
    const address = Address.fromPublicKey(publicKey)

    const client = createClient({
      account: privateKeyToAccount(
        '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
      ),
      chain: tempoLocal({ feeToken: 1n }),
      transport: http('http://localhost:3000'),
    })

    await Actions.token.transferSync(client, {
      amount: parseUnits('10', 6),
      token: 1n,
      to: address,
    })

    const transaction = TransactionEnvelopeAA.from({
      calls: [
        {
          to: '0x0000000000000000000000000000000000000000',
          value: Value.from('0.001', 6),
        },
      ],
      chainId: 1337,
      gas: 100_000n,
      maxFeePerGas: Value.fromGwei('20'),
      maxPriorityFeePerGas: Value.fromGwei('10'),
    })

    const signature = P256.sign({
      payload: TransactionEnvelopeAA.getSignPayload(transaction),
      privateKey,
      hash: false,
    })

    const serialized_signed = TransactionEnvelopeAA.serialize(transaction, {
      signature: SignatureEnvelope.from({
        signature,
        publicKey,
        prehash: false,
      }),
    })

    const receipt = await client.request({
      method: 'eth_sendRawTransactionSync',
      params: [serialized_signed],
    })

    expect(receipt).toBeDefined()

    {
      const response = await client.request({
        method: 'eth_getTransactionByHash',
        params: [receipt.transactionHash],
      })
      if (!response) throw new Error()

      const { blockNumber, blockHash, ...rest } = response

      expect(blockNumber).toBeDefined()
      expect(blockHash).toBeDefined()
      expect(rest).toMatchInlineSnapshot(`
        {
          "aaAuthorizationList": [],
          "accessList": [],
          "calls": [
            {
              "data": null,
              "input": "0x",
              "to": "0x0000000000000000000000000000000000000000",
              "value": "0x3e8",
            },
          ],
          "chainId": "0x539",
          "feePayerSignature": null,
          "feeToken": null,
          "from": "0x6472aeab3269f4165775753156702c06ccc70f8b",
          "gas": "0x186a0",
          "gasPrice": "0x4a817c800",
          "hash": "0xcb2daeed7600e4d3f5df68782d606aad29495f9211e8befa14dc4b9a3a5f2bd8",
          "maxFeePerGas": "0x4a817c800",
          "maxPriorityFeePerGas": "0x2540be400",
          "nonce": "0x0",
          "nonceKey": "0x0",
          "signature": {
            "preHash": false,
            "pubKeyX": "0xecbf69146add5d7c649c96d90b64d90702c6faae7115adbad50e5e61b2c5f40d",
            "pubKeyY": "0xeca3a5fc6dc4225b4f3f9720750651d43c6eb45c0492b8e9930394d1524784c6",
            "r": "0x91f7311d18be0aea5d7379465e7499400a56a12ca3d3e1e809172f00b3219f2c",
            "s": "0x6445a28a7c12fb2cef4e6e1b2f1cfa7297fa7502bbc7b2612b325607e5928421",
            "type": "p256",
          },
          "transactionIndex": "0x1",
          "type": "0x76",
          "validAfter": null,
          "validBefore": null,
        }
      `)
    }

    const { blockNumber, blockHash, logs, logsBloom, ...rest } = receipt

    expect(blockNumber).toBeDefined()
    expect(blockHash).toBeDefined()
    expect(logs).toBeDefined()
    expect(logsBloom).toBeDefined()
    expect(rest).toMatchInlineSnapshot(`
      {
        "contractAddress": null,
        "cumulativeGasUsed": "0x92e0",
        "effectiveGasPrice": "0x4a817c800",
        "from": "0x6472aeab3269f4165775753156702c06ccc70f8b",
        "gasUsed": "0x92e0",
        "status": "0x0",
        "to": "0x0000000000000000000000000000000000000000",
        "transactionHash": "0xcb2daeed7600e4d3f5df68782d606aad29495f9211e8befa14dc4b9a3a5f2bd8",
        "transactionIndex": "0x1",
        "type": "0x76",
      }
    `)
  })

  test('behavior: default (p256 - webcrypto)', async () => {
    const keyPair = await WebCryptoP256.createKeyPair()
    const address = Address.fromPublicKey(keyPair.publicKey)

    const client = createClient({
      account: privateKeyToAccount(
        '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
      ),
      chain: tempoLocal({ feeToken: 1n }),
      transport: http('http://localhost:3000'),
    })

    await Actions.token.transferSync(client, {
      amount: parseUnits('10', 6),
      token: 1n,
      to: address,
    })

    const transaction = TransactionEnvelopeAA.from({
      calls: [
        {
          to: '0x0000000000000000000000000000000000000000',
          value: Value.from('0.001', 6),
        },
      ],
      chainId: 1337,
      gas: 100_000n,
      maxFeePerGas: Value.fromGwei('20'),
      maxPriorityFeePerGas: Value.fromGwei('10'),
    })

    const signature = await WebCryptoP256.sign({
      payload: TransactionEnvelopeAA.getSignPayload(transaction),
      privateKey: keyPair.privateKey,
    })

    const serialized_signed = TransactionEnvelopeAA.serialize(transaction, {
      signature: SignatureEnvelope.from({
        signature,
        publicKey: keyPair.publicKey,
        prehash: true,
        type: 'p256',
      }),
    })

    const receipt = await client.request({
      method: 'eth_sendRawTransactionSync',
      params: [serialized_signed],
    })

    expect(receipt).toBeDefined()

    {
      const response = await client.request({
        method: 'eth_getTransactionByHash',
        params: [receipt.transactionHash],
      })
      if (!response) throw new Error()

      const { blockNumber, blockHash, from, hash, signature, ...rest } =
        response as any

      expect(blockNumber).toBeDefined()
      expect(blockHash).toBeDefined()
      expect(from).toBeDefined()
      expect(hash).toBe(receipt.transactionHash)
      expect(signature).toBeDefined()
      expect(rest).toMatchInlineSnapshot(`
        {
          "aaAuthorizationList": [],
          "accessList": [],
          "calls": [
            {
              "data": null,
              "input": "0x",
              "to": "0x0000000000000000000000000000000000000000",
              "value": "0x3e8",
            },
          ],
          "chainId": "0x539",
          "feePayerSignature": null,
          "feeToken": null,
          "gas": "0x186a0",
          "gasPrice": "0x4a817c800",
          "maxFeePerGas": "0x4a817c800",
          "maxPriorityFeePerGas": "0x2540be400",
          "nonce": "0x0",
          "nonceKey": "0x0",
          "transactionIndex": "0x1",
          "type": "0x76",
          "validAfter": null,
          "validBefore": null,
        }
      `)
    }

    const {
      blockNumber,
      blockHash,
      from,
      logs,
      logsBloom,
      transactionHash,
      ...rest
    } = receipt

    expect(blockNumber).toBeDefined()
    expect(blockHash).toBeDefined()
    expect(from).toBeDefined()
    expect(logs).toBeDefined()
    expect(logsBloom).toBeDefined()
    expect(transactionHash).toBe(receipt.transactionHash)
    expect(rest).toMatchInlineSnapshot(`
      {
        "contractAddress": null,
        "cumulativeGasUsed": "0x92e0",
        "effectiveGasPrice": "0x4a817c800",
        "gasUsed": "0x92e0",
        "status": "0x0",
        "to": "0x0000000000000000000000000000000000000000",
        "transactionIndex": "0x1",
        "type": "0x76",
      }
    `)
  })

  test('behavior: default (webauthn)', async () => {
    const privateKey =
      '0x062d199fd1d30c4a905ed1164a31e73759a13827687a2f3057a7d19c220bc933'
    const publicKey = P256.getPublicKey({ privateKey })
    const address = Address.fromPublicKey(publicKey)

    const client = createClient({
      account: privateKeyToAccount(
        '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
      ),
      chain: tempoLocal({ feeToken: 1n }),
      transport: http('http://localhost:3000'),
    })

    await Actions.token.transferSync(client, {
      amount: parseUnits('10', 6),
      token: 1n,
      to: address,
    })

    const transaction = TransactionEnvelopeAA.from({
      calls: [
        {
          to: '0x0000000000000000000000000000000000000000',
          value: Value.from('0.001', 6),
        },
      ],
      chainId: 1337,
      gas: 100_000n,
      maxFeePerGas: Value.fromGwei('20'),
      maxPriorityFeePerGas: Value.fromGwei('10'),
    })

    const { metadata, payload } = WebAuthnP256.getSignPayload({
      challenge: TransactionEnvelopeAA.getSignPayload(transaction),
      rpId: 'localhost',
      origin: 'http://localhost',
    })

    const signature = P256.sign({
      payload,
      privateKey,
      hash: true,
    })

    const serialized_signed = TransactionEnvelopeAA.serialize(transaction, {
      signature: SignatureEnvelope.from({
        signature,
        publicKey,
        metadata,
      }),
    })

    const receipt = await client.request({
      method: 'eth_sendRawTransactionSync',
      params: [serialized_signed],
    })

    expect(receipt).toBeDefined()

    {
      const response = await client.request({
        method: 'eth_getTransactionByHash',
        params: [receipt.transactionHash],
      })
      if (!response) throw new Error()

      const { blockNumber, blockHash, ...rest } = response

      expect(blockNumber).toBeDefined()
      expect(blockHash).toBeDefined()
      expect(rest).toMatchInlineSnapshot(`
        {
          "aaAuthorizationList": [],
          "accessList": [],
          "calls": [
            {
              "data": null,
              "input": "0x",
              "to": "0x0000000000000000000000000000000000000000",
              "value": "0x3e8",
            },
          ],
          "chainId": "0x539",
          "feePayerSignature": null,
          "feeToken": null,
          "from": "0x6472aeab3269f4165775753156702c06ccc70f8b",
          "gas": "0x186a0",
          "gasPrice": "0x4a817c800",
          "hash": "0x2a4ed201cef80aa14b342148cae7851cf5ef5494cd009cbff6e5b5a501734a7d",
          "maxFeePerGas": "0x4a817c800",
          "maxPriorityFeePerGas": "0x2540be400",
          "nonce": "0x0",
          "nonceKey": "0x0",
          "signature": {
            "pubKeyX": "0xecbf69146add5d7c649c96d90b64d90702c6faae7115adbad50e5e61b2c5f40d",
            "pubKeyY": "0xeca3a5fc6dc4225b4f3f9720750651d43c6eb45c0492b8e9930394d1524784c6",
            "r": "0x602ae1039dd8f97bfaf44c672484ca80cf789bcf63653340837a41a11d69b8f9",
            "s": "0x737e861d3447ecf99e50ccfca6d6b766409a8d7075beeaebd62c30d4fef05aa1",
            "type": "webAuthn",
            "webauthnData": "0x49960de5880e8c687434170f6476605b8fe4aeb9a28632c7995cf3ba831d976305000000007b2274797065223a22776562617574686e2e676574222c226368616c6c656e6765223a22786c62733832574448435277736f6e6c7030302d792d386634784937782d783146795246334e714b475559222c226f726967696e223a22687474703a2f2f6c6f63616c686f7374222c2263726f73734f726967696e223a66616c73657d",
          },
          "transactionIndex": "0x1",
          "type": "0x76",
          "validAfter": null,
          "validBefore": null,
        }
      `)
    }

    const { blockNumber, blockHash, logs, logsBloom, ...rest } = receipt

    expect(blockNumber).toBeDefined()
    expect(blockHash).toBeDefined()
    expect(logs).toBeDefined()
    expect(logsBloom).toBeDefined()

    expect(rest).toMatchInlineSnapshot(`
      {
        "contractAddress": null,
        "cumulativeGasUsed": "0x9d10",
        "effectiveGasPrice": "0x4a817c800",
        "from": "0x6472aeab3269f4165775753156702c06ccc70f8b",
        "gasUsed": "0x9d10",
        "status": "0x0",
        "to": "0x0000000000000000000000000000000000000000",
        "transactionHash": "0x2a4ed201cef80aa14b342148cae7851cf5ef5494cd009cbff6e5b5a501734a7d",
        "transactionIndex": "0x1",
        "type": "0x76",
      }
    `)
  })

  test('behavior: feePayerSignature (user → feePayer)', async () => {
    const feePayer = {
      address: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
      privateKey:
        '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
    } as const
    const sender = {
      address: '0x0a275bEE91B39092Dfd57089Dee0EB0539020B90',
      privateKey:
        '0xfe24691eff5297c76e847dc78a8966b96cf65a44140b9a0d3f5100ce71d74a59',
    } as const

    const transport = RpcTransport.fromHttp('http://localhost:3000')

    const nonce = await transport.request({
      method: 'eth_getTransactionCount',
      params: [sender.address, 'pending'],
    })

    const transaction = TransactionEnvelopeAA.from({
      calls: [{ to: '0x0000000000000000000000000000000000000000', value: 0n }],
      chainId: 1337,
      feePayerSignature: null,
      nonce: BigInt(nonce),
      gas: 100000n,
      maxFeePerGas: Value.fromGwei('20'),
      maxPriorityFeePerGas: Value.fromGwei('10'),
    })

    const signature = Secp256k1.sign({
      payload: TransactionEnvelopeAA.getSignPayload(transaction),
      // unfunded PK
      privateKey: sender.privateKey,
    })

    const transaction_signed = TransactionEnvelopeAA.from(transaction, {
      signature: SignatureEnvelope.from(signature),
    })

    const feePayerSignature = Secp256k1.sign({
      payload: TransactionEnvelopeAA.getFeePayerSignPayload(
        transaction_signed,
        { sender: sender.address },
      ),
      privateKey: feePayer.privateKey,
    })

    const serialized_signed = TransactionEnvelopeAA.serialize(
      transaction_signed,
      {
        feePayerSignature,
      },
    )

    const receipt = await transport.request({
      method: 'eth_sendRawTransactionSync',
      params: [serialized_signed],
    })

    const { blockNumber, blockHash, logs, logsBloom, ...rest } = receipt

    expect(blockNumber).toBeDefined()
    expect(blockHash).toBeDefined()
    expect(logs).toBeDefined()
    expect(logsBloom).toBeDefined()
    expect(rest).toMatchInlineSnapshot(`
      {
        "contractAddress": null,
        "cumulativeGasUsed": "0x5c30",
        "effectiveGasPrice": "0x4a817c800",
        "from": "0x0a275bee91b39092dfd57089dee0eb0539020b90",
        "gasUsed": "0x5c30",
        "status": "0x1",
        "to": "0x0000000000000000000000000000000000000000",
        "transactionHash": "0xec109f6683ab104359031628e425d08f13b3d7d8cca68672325305eac6b89919",
        "transactionIndex": "0x1",
        "type": "0x76",
      }
    `)

    const tx = await transport
      .request({
        method: 'eth_getTransactionByHash',
        params: [receipt.transactionHash],
      })
      .then(Transaction.fromRpc)

    expect({
      ...tx,
      blockHash: undefined,
      blockNumber: undefined,
    }).toMatchInlineSnapshot(`
      {
        "aaAuthorizationList": [],
        "accessList": [],
        "blockHash": undefined,
        "blockNumber": undefined,
        "calls": [
          {
            "data": "0x",
            "to": "0x0000000000000000000000000000000000000000",
            "value": 0n,
          },
        ],
        "chainId": 1337,
        "data": undefined,
        "feePayer": "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
        "feePayerSignature": {
          "r": 90188278262501455201631375192727818264315724619851296903313643365872014474939n,
          "s": 21522416408659292937651233939002591804919112021519345001364348623262878861140n,
          "v": 27,
          "yParity": 0,
        },
        "feeToken": null,
        "from": "0x0a275bee91b39092dfd57089dee0eb0539020b90",
        "gas": 100000n,
        "gasPrice": 20000000000n,
        "hash": "0xec109f6683ab104359031628e425d08f13b3d7d8cca68672325305eac6b89919",
        "maxFeePerGas": 20000000000n,
        "maxPriorityFeePerGas": 10000000000n,
        "nonce": 0n,
        "nonceKey": 0n,
        "signature": {
          "signature": {
            "r": 10292676348145489655282185382992892512159498737579150910965384786990352734279n,
            "s": 28525945667606979170826991633900153723921049713502164917966936632594819232361n,
            "yParity": 0,
          },
          "type": "secp256k1",
        },
        "transactionIndex": 1,
        "type": "aa",
        "validAfter": null,
        "validBefore": null,
        "value": 0n,
      }
    `)
  })
})
