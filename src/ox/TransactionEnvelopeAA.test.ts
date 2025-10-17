import {
  Address,
  Hex,
  P256,
  Rlp,
  RpcTransport,
  Secp256k1,
  Value,
  WebAuthnP256,
} from 'ox'
import { createClient, http, parseEther } from 'viem'
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
        TransactionEnvelopeAA.serialize(transaction, {
          signature: SignatureEnvelope.from(signature),
        }),
      ).toMatchInlineSnapshot(
        `"0x76f86701808080d8d79470997970c51812dc3a010c7d01b50e0d17dc79c88080c0808080808080b841e333995974d0f82e5dfdb201476c03516d849f1fd3b05db4bb1595dba9ad207827aca889a4780887341008f2d3fac949b145304735ea395b5d68498e80e138be1b"`,
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
      const signed = TransactionEnvelopeAA.from(transaction, {
        signature: SignatureEnvelope.from(signature),
      })
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
          value: Value.fromEther('1'),
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
          "gas": "0x186a0",
          "gasPrice": "0x2540be42c",
          "hash": "0x619a731fb6541ad920821eb1cb11fa0bc718dbd894913d7952be322f6245c98e",
          "maxFeePerGas": "0x4a817c800",
          "maxPriorityFeePerGas": "0x2540be400",
          "nonce": "0x0",
          "nonceKey": "0x0",
          "signature": {
            "r": "0xe43858180a3fb0849348c721682a8610ee0583328f20644c5a20aa51acef479c",
            "s": "0x3106b71428823fe3f9199d1476605220af5855f1cb1b0483a48a50d7bc36096b",
            "type": "secp256k1",
            "v": "0x1",
            "yParity": "0x1",
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
        "transactionHash": "0x619a731fb6541ad920821eb1cb11fa0bc718dbd894913d7952be322f6245c98e",
        "transactionIndex": "0x0",
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
      chain: tempoLocal,
      transport: http('http://localhost:3000'),
    })

    await Actions.token.transferSync(client, {
      amount: parseEther('10000'),
      to: address,
    })

    const transaction = TransactionEnvelopeAA.from({
      calls: [
        {
          to: '0x0000000000000000000000000000000000000000',
          value: Value.fromEther('1'),
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
          "feeToken": null,
          "from": "0x6472aeab3269f4165775753156702c06ccc70f8b",
          "gas": "0x186a0",
          "gasPrice": "0x2540be42c",
          "hash": "0x6555ebf80163ff84929f864a281fd475685c15279b516233035d4a243f427bfe",
          "maxFeePerGas": "0x4a817c800",
          "maxPriorityFeePerGas": "0x2540be400",
          "nonce": "0x0",
          "nonceKey": "0x0",
          "signature": {
            "preHash": false,
            "pubKeyX": "0xecbf69146add5d7c649c96d90b64d90702c6faae7115adbad50e5e61b2c5f40d",
            "pubKeyY": "0xeca3a5fc6dc4225b4f3f9720750651d43c6eb45c0492b8e9930394d1524784c6",
            "r": "0x78de783595944c23338512ed47edac09c3908e6fdbcd1283cebd86ddb24f160f",
            "s": "0x442099a953b4db06ae2eaa901c29979cbda1f126169c99e534855c4691c220ca",
            "type": "p256",
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
        "cumulativeGasUsed": "0x6590",
        "effectiveGasPrice": "0x2540be42c",
        "from": "0x6472aeab3269f4165775753156702c06ccc70f8b",
        "gasUsed": "0x6590",
        "logs": [],
        "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
        "status": "0x0",
        "to": "0x0000000000000000000000000000000000000000",
        "transactionHash": "0x6555ebf80163ff84929f864a281fd475685c15279b516233035d4a243f427bfe",
        "transactionIndex": "0x0",
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
      chain: tempoLocal,
      transport: http('http://localhost:3000'),
    })

    await Actions.token.transferSync(client, {
      amount: parseEther('10000'),
      to: address,
    })

    const transaction = TransactionEnvelopeAA.from({
      calls: [
        {
          to: '0x0000000000000000000000000000000000000000',
          value: Value.fromEther('1'),
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
          "feeToken": null,
          "from": "0x6472aeab3269f4165775753156702c06ccc70f8b",
          "gas": "0x186a0",
          "gasPrice": "0x2540be42c",
          "hash": "0x69f56d391d297b45ce3767fa803c93b14ceb1662db67b3822795da9032dab925",
          "maxFeePerGas": "0x4a817c800",
          "maxPriorityFeePerGas": "0x2540be400",
          "nonce": "0x0",
          "nonceKey": "0x0",
          "signature": {
            "pubKeyX": "0xecbf69146add5d7c649c96d90b64d90702c6faae7115adbad50e5e61b2c5f40d",
            "pubKeyY": "0xeca3a5fc6dc4225b4f3f9720750651d43c6eb45c0492b8e9930394d1524784c6",
            "r": "0x85ab9affd4d7f867f4cc7c4a89995ddeab77c803cf201a22d4797a23852bde22",
            "s": "0x451d76d4db09f1ab6a635d46eaece7bd006c0dc67d750830d4154fbee599dcc1",
            "type": "webAuthn",
            "webauthnData": "0x49960de5880e8c687434170f6476605b8fe4aeb9a28632c7995cf3ba831d976305000000007b2274797065223a22776562617574686e2e676574222c226368616c6c656e6765223a225a7275684846506271366434384f646c4f326658574c52697456457739674d5944594f6141704333744538222c226f726967696e223a22687474703a2f2f6c6f63616c686f7374222c2263726f73734f726967696e223a66616c73657d",
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
        "cumulativeGasUsed": "0x6fc0",
        "effectiveGasPrice": "0x2540be42c",
        "from": "0x6472aeab3269f4165775753156702c06ccc70f8b",
        "gasUsed": "0x6fc0",
        "logs": [],
        "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
        "status": "0x0",
        "to": "0x0000000000000000000000000000000000000000",
        "transactionHash": "0x69f56d391d297b45ce3767fa803c93b14ceb1662db67b3822795da9032dab925",
        "transactionIndex": "0x0",
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
      maxFeePerGas: Hex.toBigInt('0x2c'),
      maxPriorityFeePerGas: Hex.toBigInt('0x2c'),
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

    const { blockNumber, blockHash, logs, ...rest } = receipt

    expect(blockNumber).toBeDefined()
    expect(blockHash).toBeDefined()
    expect(logs).toBeDefined()
    expect(rest).toMatchInlineSnapshot(`
      {
        "contractAddress": null,
        "cumulativeGasUsed": "0x5208",
        "effectiveGasPrice": "0x2c",
        "from": "0x0a275bee91b39092dfd57089dee0eb0539020b90",
        "gasUsed": "0x5208",
        "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004000000000000000008000000000008000000000000000000000000000000000000000000000000000100000000000000000000000000000010000000000000000000000000000000000020000000000000100000000040000000000000000020000000000000000000000000000000000000000000000000000000000000000002000000200000000000000000000000002000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
        "status": "0x1",
        "to": "0x0000000000000000000000000000000000000000",
        "transactionHash": "0x4dfc9ff9ca1613f5598aef948a6582f5b1e703cac2a9c42ff6aee17594e8e410",
        "transactionIndex": "0x0",
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
          "r": 43378281592208347441865552210308016112467267198196289074355464650745129225935n,
          "s": 27085416135574431106158684173224223218527774861914424707575629469330173001812n,
          "v": 27,
          "yParity": 0,
        },
        "feeToken": null,
        "from": "0x0a275bee91b39092dfd57089dee0eb0539020b90",
        "gas": 100000n,
        "gasPrice": 44n,
        "hash": "0x4dfc9ff9ca1613f5598aef948a6582f5b1e703cac2a9c42ff6aee17594e8e410",
        "maxFeePerGas": 44n,
        "maxPriorityFeePerGas": 44n,
        "nonce": 0n,
        "nonceKey": 0n,
        "signature": {
          "signature": {
            "r": 58903572187112378577233587639727517391280428405029588654830213610953355580984n,
            "s": 37751027942634060522067136615803679123517065498160046803985825017412584342835n,
            "yParity": 1,
          },
          "type": "secp256k1",
        },
        "transactionIndex": 0,
        "type": "aa",
        "validAfter": null,
        "validBefore": null,
        "value": 0n,
      }
    `)
  })
})
