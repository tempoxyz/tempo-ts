import { setTimeout } from 'node:timers/promises'
import { Authorization, Hex, Rlp, RpcTransport, Secp256k1, Value } from 'ox'
import { TransactionEnvelopeFeeToken } from 'tempo/ox'
import { Instance } from 'tempo/prool'
import { afterEach, beforeEach, describe, expect, test } from 'vitest'

const privateKey =
  '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'
const privateKey2 =
  '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d'

describe('assert', () => {
  test('invalid chainId', () => {
    expect(() =>
      TransactionEnvelopeFeeToken.assert({
        authorizationList: [
          {
            address: '0x0000000000000000000000000000000000000000',
            chainId: -1,
            nonce: 0n,
            r: 0n,
            s: 0n,
            yParity: 0,
          },
        ],
        chainId: 1,
      }),
    ).toThrowErrorMatchingInlineSnapshot(
      `[TransactionEnvelope.InvalidChainIdError: Chain ID "-1" is invalid.]`,
    )
  })

  test('invalid address', () => {
    expect(() =>
      TransactionEnvelopeFeeToken.assert({
        authorizationList: [
          {
            address: '0x000000000000000000000000000000000000000z',
            chainId: 0,
            nonce: 0n,
            r: 0n,
            s: 0n,
            yParity: 0,
          },
        ],
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
      TransactionEnvelopeFeeToken.assert({
        authorizationList: [
          {
            address: '0x0000000000000000000000000000000000000000',
            chainId: 1,
            nonce: 0n,
            r: 0n,
            s: 0n,
            yParity: 0,
          },
        ],
        maxFeePerGas: 2n ** 256n - 1n + 1n,
        chainId: 1,
      }),
    ).toThrowErrorMatchingInlineSnapshot(
      `[TransactionEnvelope.FeeCapTooHighError: The fee cap (\`maxFeePerGas\`/\`maxPriorityFeePerGas\` = 115792089237316195423570985008687907853269984665640564039457584007913.129639936 gwei) cannot be higher than the maximum allowed value (2^256-1).]`,
    )
  })
})

describe('deserialize', () => {
  const transaction = TransactionEnvelopeFeeToken.from({
    chainId: 1,
    nonce: 785n,
    to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
    value: Value.fromEther('1'),
    maxFeePerGas: Value.fromGwei('2'),
    maxPriorityFeePerGas: Value.fromGwei('2'),
  })

  test('default', () => {
    const serialized = TransactionEnvelopeFeeToken.serialize(transaction)
    const deserialized = TransactionEnvelopeFeeToken.deserialize(serialized)
    expect(deserialized).toEqual(transaction)
  })

  test('minimal', () => {
    const transaction = TransactionEnvelopeFeeToken.from({
      chainId: 1,
      nonce: 0n,
    })
    const serialized = TransactionEnvelopeFeeToken.serialize(transaction)
    expect(TransactionEnvelopeFeeToken.deserialize(serialized)).toEqual(
      transaction,
    )
  })

  test('authorizationList', () => {
    const authorization = Authorization.from({
      address: '0x0000000000000000000000000000000000000000',
      chainId: 0,
      nonce: 0n,
    })

    const signature = Secp256k1.sign({
      payload: Authorization.getSignPayload(authorization),
      privateKey,
    })

    const authorizationList = [Authorization.from(authorization, { signature })]

    const transaction_authorizationList = TransactionEnvelopeFeeToken.from({
      ...transaction,
      authorizationList,
    })
    const serialized = TransactionEnvelopeFeeToken.serialize(
      transaction_authorizationList,
    )
    expect(TransactionEnvelopeFeeToken.deserialize(serialized)).toEqual(
      transaction_authorizationList,
    )
  })

  test('gas', () => {
    const transaction_gas = TransactionEnvelopeFeeToken.from({
      ...transaction,
      gas: 21001n,
    })
    const serialized = TransactionEnvelopeFeeToken.serialize(transaction_gas)
    expect(TransactionEnvelopeFeeToken.deserialize(serialized)).toEqual(
      transaction_gas,
    )
  })

  test('accessList', () => {
    const transaction_accessList = TransactionEnvelopeFeeToken.from({
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
    const serialized = TransactionEnvelopeFeeToken.serialize(
      transaction_accessList,
    )
    expect(TransactionEnvelopeFeeToken.deserialize(serialized)).toEqual(
      transaction_accessList,
    )
  })

  test('data', () => {
    const transaction_data = TransactionEnvelopeFeeToken.from({
      ...transaction,
      data: '0x1234',
    })
    const serialized = TransactionEnvelopeFeeToken.serialize(transaction_data)
    expect(TransactionEnvelopeFeeToken.deserialize(serialized)).toEqual(
      transaction_data,
    )
  })

  test('signature', () => {
    const signature = Secp256k1.sign({
      payload: TransactionEnvelopeFeeToken.getSignPayload(transaction),
      privateKey,
    })
    const serialized = TransactionEnvelopeFeeToken.serialize(transaction, {
      signature,
    })
    expect(TransactionEnvelopeFeeToken.deserialize(serialized)).toEqual({
      ...transaction,
      ...signature,
    })
  })

  describe('raw', () => {
    test('default', () => {
      const serialized = `0x77${Rlp.fromHex([
        Hex.fromNumber(1), // chainId
        Hex.fromNumber(0), // nonce
        Hex.fromNumber(1), // maxPriorityFeePerGas
        Hex.fromNumber(1), // maxFeePerGas
        Hex.fromNumber(1), // gas
        '0x0000000000000000000000000000000000000000', // to
        Hex.fromNumber(0), // value
        '0x', // data
        '0x', // accessList
        '0x', // authorizationList
        '0x', // feeToken
        '0x', // feePayerSignature
      ]).slice(2)}` as const
      expect(
        TransactionEnvelopeFeeToken.deserialize(serialized),
      ).toMatchInlineSnapshot(`
        {
          "chainId": 1,
          "gas": 1n,
          "maxFeePerGas": 1n,
          "maxPriorityFeePerGas": 1n,
          "nonce": 0n,
          "to": "0x0000000000000000000000000000000000000000",
          "type": "feeToken",
          "value": 0n,
        }
      `)
    })

    test('empty sig', () => {
      const serialized = `0x77${Rlp.fromHex([
        Hex.fromNumber(1), // chainId
        Hex.fromNumber(0), // nonce
        Hex.fromNumber(1), // maxPriorityFeePerGas
        Hex.fromNumber(1), // maxFeePerGas
        Hex.fromNumber(1), // gas
        '0x0000000000000000000000000000000000000000', // to
        Hex.fromNumber(0), // value
        '0x', // data
        '0x', // accessList
        '0x', // authorizationList
        '0x', // feeToken
        '0x', // feePayerSignature
        '0x', // r
        '0x', // v
        '0x', // s
      ]).slice(2)}` as const
      expect(
        TransactionEnvelopeFeeToken.deserialize(serialized),
      ).toMatchInlineSnapshot(`
        {
          "chainId": 1,
          "gas": 1n,
          "maxFeePerGas": 1n,
          "maxPriorityFeePerGas": 1n,
          "nonce": 0n,
          "r": 0n,
          "s": 0n,
          "to": "0x0000000000000000000000000000000000000000",
          "type": "feeToken",
          "value": 0n,
          "yParity": 0,
        }
      `)
    })

    test('low sig coords', () => {
      const serialized = `0x77${Rlp.fromHex([
        Hex.fromNumber(1), // chainId
        Hex.fromNumber(0), // nonce
        Hex.fromNumber(1), // maxPriorityFeePerGas
        Hex.fromNumber(1), // maxFeePerGas
        Hex.fromNumber(1), // gas
        '0x0000000000000000000000000000000000000000', // to
        Hex.fromNumber(0), // value
        '0x', // data
        '0x', // accessList
        '0x', // authorizationList
        '0x', // feeToken
        '0x', // feePayerSignature
        '0x', // r
        Hex.fromNumber(69), // v
        Hex.fromNumber(420), // s
      ]).slice(2)}` as const
      expect(
        TransactionEnvelopeFeeToken.deserialize(serialized),
      ).toMatchInlineSnapshot(`
        {
          "chainId": 1,
          "gas": 1n,
          "maxFeePerGas": 1n,
          "maxPriorityFeePerGas": 1n,
          "nonce": 0n,
          "r": 69n,
          "s": 420n,
          "to": "0x0000000000000000000000000000000000000000",
          "type": "feeToken",
          "value": 0n,
          "yParity": 0,
        }
      `)
    })
  })

  describe('errors', () => {
    test('invalid access list (invalid address)', () => {
      expect(() =>
        TransactionEnvelopeFeeToken.deserialize(
          `0x77${Rlp.fromHex([
            Hex.fromNumber(1), // chainId
            Hex.fromNumber(0), // nonce
            Hex.fromNumber(1), // maxPriorityFeePerGas
            Hex.fromNumber(1), // maxFeePerGas
            Hex.fromNumber(1), // gas
            '0x0000000000000000000000000000000000000000', // to
            Hex.fromNumber(0), // value
            '0x', // data
            [
              [
                '0x',
                [
                  '0x0000000000000000000000000000000000000000000000000000000000000001',
                ],
              ],
            ], // accessList
            '0x', // authorizationList
          ]).slice(2)}`,
        ),
      ).toThrowErrorMatchingInlineSnapshot(`
        [TransactionEnvelope.InvalidSerializedError: Invalid serialized transaction of type "feeToken" was provided.

        Serialized Transaction: "0x77f84201000101019400000000000000000000000000000000000000000080e4e380e1a0000000000000000000000000000000000000000000000000000000000000000180"
        Missing Attributes: feeToken, feePayerSignatureOrSender, yParity, r, s]
      `)

      expect(() =>
        TransactionEnvelopeFeeToken.deserialize(
          `0x77${Rlp.fromHex([
            Hex.fromNumber(1), // chainId
            Hex.fromNumber(0), // nonce
            Hex.fromNumber(1), // maxPriorityFeePerGas
            Hex.fromNumber(1), // maxFeePerGas
            Hex.fromNumber(1), // gas
            '0x0000000000000000000000000000000000000000', // to
            Hex.fromNumber(0), // value
            '0x', // data
            [['0x123456', ['0x0']]], // accessList
            '0x', // authorizationList
          ]).slice(2)}`,
        ),
      ).toThrowErrorMatchingInlineSnapshot(`
        [TransactionEnvelope.InvalidSerializedError: Invalid serialized transaction of type "feeToken" was provided.

        Serialized Transaction: "0x77e501000101019400000000000000000000000000000000000000000080c7c683123456c10080"
        Missing Attributes: feeToken, feePayerSignatureOrSender, yParity, r, s]
      `)
    })

    test('invalid transaction (all missing)', () => {
      expect(() =>
        TransactionEnvelopeFeeToken.deserialize(
          `0x77${Rlp.fromHex([]).slice(2)}`,
        ),
      ).toThrowErrorMatchingInlineSnapshot(`
        [TransactionEnvelope.InvalidSerializedError: Invalid serialized transaction of type "feeToken" was provided.

        Serialized Transaction: "0x77c0"
        Missing Attributes: chainId, nonce, feeToken, maxPriorityFeePerGas, maxFeePerGas, gas, to, value, data, accessList, authorizationList, feePayerSignatureOrSender]
      `)
    })

    test('invalid transaction (some missing)', () => {
      expect(() =>
        TransactionEnvelopeFeeToken.deserialize(
          `0x77${Rlp.fromHex(['0x00', '0x01']).slice(2)}`,
        ),
      ).toThrowErrorMatchingInlineSnapshot(`
        [TransactionEnvelope.InvalidSerializedError: Invalid serialized transaction of type "feeToken" was provided.

        Serialized Transaction: "0x77c20001"
        Missing Attributes: feeToken, maxPriorityFeePerGas, maxFeePerGas, gas, to, value, data, accessList, authorizationList, feePayerSignatureOrSender]
      `)
    })

    test('invalid transaction (missing signature)', () => {
      expect(() =>
        TransactionEnvelopeFeeToken.deserialize(
          `0x77${Rlp.fromHex([
            '0x',
            '0x',
            '0x',
            '0x',
            '0x',
            '0x',
            '0x',
            '0x',
            '0x',
            '0x',
            '0x',
            '0x',
            '0x',
          ]).slice(2)}`,
        ),
      ).toThrowErrorMatchingInlineSnapshot(`
        [TransactionEnvelope.InvalidSerializedError: Invalid serialized transaction of type "feeToken" was provided.

        Serialized Transaction: "0x77cd80808080808080808080808080"
        Missing Attributes: r, s]
      `)
    })
  })
})

describe('from', () => {
  test('default', () => {
    {
      const envelope = TransactionEnvelopeFeeToken.from({
        chainId: 1,
        nonce: 0n,
      })
      expect(envelope).toMatchInlineSnapshot(`
        {
          "chainId": 1,
          "nonce": 0n,
          "type": "feeToken",
        }
      `)
      const serialized = TransactionEnvelopeFeeToken.serialize(envelope)
      const envelope2 = TransactionEnvelopeFeeToken.from(serialized)
      expect(envelope2).toEqual(envelope)
    }

    {
      const envelope = TransactionEnvelopeFeeToken.from({
        chainId: 1,
        nonce: 0n,
        r: 0n,
        s: 1n,
        yParity: 0,
      })
      expect(envelope).toMatchInlineSnapshot(`
        {
          "chainId": 1,
          "nonce": 0n,
          "r": 0n,
          "s": 1n,
          "type": "feeToken",
          "yParity": 0,
        }
      `)
      const serialized = TransactionEnvelopeFeeToken.serialize(envelope)
      const envelope2 = TransactionEnvelopeFeeToken.from(serialized)
      expect(envelope2).toEqual(envelope)
    }
  })

  test('options: signature', () => {
    const envelope = TransactionEnvelopeFeeToken.from(
      {
        chainId: 1,
        nonce: 0n,
      },
      {
        signature: {
          r: 0n,
          s: 1n,
          yParity: 0,
        },
      },
    )
    expect(envelope).toMatchInlineSnapshot(`
      {
        "chainId": 1,
        "nonce": 0n,
        "r": 0n,
        "s": 1n,
        "type": "feeToken",
        "yParity": 0,
      }
    `)
    const serialized = TransactionEnvelopeFeeToken.serialize(envelope)
    const envelope2 = TransactionEnvelopeFeeToken.from(serialized)
    expect(envelope2).toEqual(envelope)
  })

  test('options: feePayerSignature', () => {
    const envelope = TransactionEnvelopeFeeToken.from(
      {
        chainId: 1,
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
        "chainId": 1,
        "feePayerSignature": {
          "r": 0n,
          "s": 1n,
          "yParity": 0,
        },
        "nonce": 0n,
        "r": 1n,
        "s": 2n,
        "type": "feeToken",
        "yParity": 0,
      }
    `)
    const serialized = TransactionEnvelopeFeeToken.serialize(envelope)
    const envelope2 = TransactionEnvelopeFeeToken.from(serialized)
    expect(envelope2).toEqual(envelope)
  })
})

describe('getSignPayload', () => {
  test('default', () => {
    const authorization = Authorization.from({
      address: '0x0000000000000000000000000000000000000000',
      chainId: 1,
      nonce: 785n,
    })
    const signature_auth = Secp256k1.sign({
      payload: Authorization.getSignPayload(authorization),
      privateKey,
    })

    const envelope = TransactionEnvelopeFeeToken.from({
      authorizationList: [
        Authorization.from(authorization, { signature: signature_auth }),
      ],
      chainId: 1,
      gas: 21000n,
      maxFeePerGas: 13000000000n,
      maxPriorityFeePerGas: 1000000000n,
      nonce: 665n,
      value: 1000000000000000000n,
      to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
    })

    const signature = Secp256k1.sign({
      payload: TransactionEnvelopeFeeToken.getSignPayload(envelope),
      privateKey,
    })

    const envelope_signed = TransactionEnvelopeFeeToken.from(envelope, {
      signature,
    })

    expect(envelope_signed).toMatchInlineSnapshot(`
      {
        "authorizationList": [
          {
            "address": "0x0000000000000000000000000000000000000000",
            "chainId": 1,
            "nonce": 785n,
            "r": 45905576947909600150892513825393874260108741328435165924126757974077129494832n,
            "s": 48243644890612770021063037464756173394424732895207796335842780877380370396087n,
            "yParity": 0,
          },
        ],
        "chainId": 1,
        "gas": 21000n,
        "maxFeePerGas": 13000000000n,
        "maxPriorityFeePerGas": 1000000000n,
        "nonce": 665n,
        "r": 2197655434111937974218303607195887458649942608682485837450202937256281617344n,
        "s": 45514547126785856401831290616133478750134795595263686266026091483746271601472n,
        "to": "0x70997970c51812dc3a010c7d01b50e0d17dc79c8",
        "type": "feeToken",
        "value": 1000000000000000000n,
        "yParity": 0,
      }
    `)
  })
})

describe('hash', () => {
  test('default', () => {
    const envelope = TransactionEnvelopeFeeToken.from({
      authorizationList: [],
      chainId: 1,
      gas: 21000n,
      maxFeePerGas: 13000000000n,
      maxPriorityFeePerGas: 1000000000n,
      nonce: 665n,
      value: 1000000000000000000n,
      to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
      r: BigInt(
        '0xacf664dcd984d082b68c434feb66ac684711babdeefe6f101bf8df88fc367a37',
      ),
      s: BigInt(
        '0x5e0800058a9b5c2250bed60ee969a45b7445e562a8298c2d222d114e6dfbfcb9',
      ),
      yParity: 0,
    })

    const hash = TransactionEnvelopeFeeToken.hash(envelope)
    expect(hash).toMatchInlineSnapshot(
      `"0x28ff6c475c6bc8e5ac460a9fa89ef29c3de20e35f128e5c2b36946a67df572c9"`,
    )
  })

  test('behavior: presign', () => {
    const envelope = TransactionEnvelopeFeeToken.from({
      authorizationList: [],
      chainId: 1,
      gas: 21000n,
      maxFeePerGas: 13000000000n,
      maxPriorityFeePerGas: 1000000000n,
      nonce: 665n,
      value: 1000000000000000000n,
      to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
      r: BigInt(
        '0xacf664dcd984d082b68c434feb66ac684711babdeefe6f101bf8df88fc367a37',
      ),
      s: BigInt(
        '0x5e0800058a9b5c2250bed60ee969a45b7445e562a8298c2d222d114e6dfbfcb9',
      ),
      yParity: 0,
    })

    const hash = TransactionEnvelopeFeeToken.hash(envelope, { presign: true })
    expect(hash).toMatchInlineSnapshot(
      `"0x19c3cd0e89bbd10237160f3d6b28c5bc41494ea31dc54ceb7d6cad9a48fae7b4"`,
    )
  })
})

describe('serialize', () => {
  const transaction = TransactionEnvelopeFeeToken.from({
    chainId: 1,
    nonce: 785n,
    to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
    value: Value.fromEther('1'),
    maxFeePerGas: Value.fromGwei('2'),
    maxPriorityFeePerGas: Value.fromGwei('2'),
  })

  test('default', () => {
    const serialized = TransactionEnvelopeFeeToken.serialize(transaction)
    expect(serialized).toMatchInlineSnapshot(
      `"0x77f20182031184773594008477359400809470997970c51812dc3a010c7d01b50e0d17dc79c8880de0b6b3a764000080c0c08080"`,
    )
    expect(TransactionEnvelopeFeeToken.deserialize(serialized)).toEqual(
      transaction,
    )
  })

  test('default (all zeros)', () => {
    const transaction = TransactionEnvelopeFeeToken.from({
      to: undefined,
      nonce: 0n,
      chainId: 1,
      maxFeePerGas: 0n,
      maxPriorityFeePerGas: 0n,
      value: 0n,
    })

    const serialized = TransactionEnvelopeFeeToken.serialize(transaction)

    expect(serialized).toMatchInlineSnapshot(`"0x77cc0180808080808080c0c08080"`)
    expect(TransactionEnvelopeFeeToken.deserialize(serialized)).toEqual({
      chainId: 1,
      nonce: 0n,
      type: 'feeToken',
    })
  })

  test('minimal (w/ type)', () => {
    const transaction = TransactionEnvelopeFeeToken.from({
      chainId: 1,
      nonce: 0n,
    })
    const serialized = TransactionEnvelopeFeeToken.serialize(transaction)
    expect(serialized).toMatchInlineSnapshot(`"0x77cc0180808080808080c0c08080"`)
    expect(TransactionEnvelopeFeeToken.deserialize(serialized)).toEqual(
      transaction,
    )
  })

  test('minimal (w/ maxFeePerGas)', () => {
    const transaction = TransactionEnvelopeFeeToken.from({
      chainId: 1,
      maxFeePerGas: 1n,
      nonce: 0n,
    })
    const serialized = TransactionEnvelopeFeeToken.serialize(transaction)
    expect(serialized).toMatchInlineSnapshot(`"0x77cc0180800180808080c0c08080"`)
    expect(TransactionEnvelopeFeeToken.deserialize(serialized)).toEqual(
      transaction,
    )
  })

  test('authorizationList', () => {
    const authorization = Authorization.from({
      address: '0x0000000000000000000000000000000000000000',
      chainId: 0,
      nonce: 0n,
    })

    const signature = Secp256k1.sign({
      payload: Authorization.getSignPayload(authorization),
      privateKey,
    })

    const authorizationList = [Authorization.from(authorization, { signature })]

    const transaction_authorizationList = TransactionEnvelopeFeeToken.from({
      ...transaction,
      authorizationList,
    })
    const serialized = TransactionEnvelopeFeeToken.serialize(
      transaction_authorizationList,
    )
    expect(serialized).toMatchInlineSnapshot(
      `"0x77f88f0182031184773594008477359400809470997970c51812dc3a010c7d01b50e0d17dc79c8880de0b6b3a764000080c0f85cf85a809400000000000000000000000000000000000000008001a0aa64791de483fa82224c2beeba9ee4c89323db0d1a39c24bcfa555b8d3c31aa9a03cdeba27b1c512236967597d1352b6d71239bebde01237ca72b26d6fd218cb978080"`,
    )
    expect(TransactionEnvelopeFeeToken.deserialize(serialized)).toEqual(
      transaction_authorizationList,
    )
  })

  test('gas', () => {
    const transaction_gas = TransactionEnvelopeFeeToken.from({
      ...transaction,
      gas: 21001n,
    })
    const serialized = TransactionEnvelopeFeeToken.serialize(transaction_gas)
    expect(serialized).toMatchInlineSnapshot(
      `"0x77f401820311847735940084773594008252099470997970c51812dc3a010c7d01b50e0d17dc79c8880de0b6b3a764000080c0c08080"`,
    )
    expect(TransactionEnvelopeFeeToken.deserialize(serialized)).toEqual(
      transaction_gas,
    )
  })

  test('feeToken', () => {
    const transaction_feeToken = TransactionEnvelopeFeeToken.from({
      ...transaction,
      feeToken: '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef',
    })
    const serialized =
      TransactionEnvelopeFeeToken.serialize(transaction_feeToken)
    expect(serialized).toMatchInlineSnapshot(
      `"0x77f8460182031184773594008477359400809470997970c51812dc3a010c7d01b50e0d17dc79c8880de0b6b3a764000080c0c094deadbeefdeadbeefdeadbeefdeadbeefdeadbeef80"`,
    )
    expect(TransactionEnvelopeFeeToken.deserialize(serialized)).toEqual(
      transaction_feeToken,
    )
  })

  test('accessList', () => {
    const transaction_accessList = TransactionEnvelopeFeeToken.from({
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
    const serialized = TransactionEnvelopeFeeToken.serialize(
      transaction_accessList,
    )
    expect(serialized).toMatchInlineSnapshot(
      `"0x77f88e0182031184773594008477359400809470997970c51812dc3a010c7d01b50e0d17dc79c8880de0b6b3a764000080f85bf859940000000000000000000000000000000000000000f842a00000000000000000000000000000000000000000000000000000000000000001a060fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fec08080"`,
    )
    expect(TransactionEnvelopeFeeToken.deserialize(serialized)).toEqual(
      transaction_accessList,
    )
  })

  test('data', () => {
    const transaction_data = TransactionEnvelopeFeeToken.from({
      ...transaction,
      data: '0x1234',
    })
    const serialized = TransactionEnvelopeFeeToken.serialize(transaction_data)
    expect(serialized).toMatchInlineSnapshot(
      `"0x77f40182031184773594008477359400809470997970c51812dc3a010c7d01b50e0d17dc79c8880de0b6b3a7640000821234c0c08080"`,
    )
    expect(TransactionEnvelopeFeeToken.deserialize(serialized)).toEqual(
      transaction_data,
    )
  })

  test('options: signature', async () => {
    const signature = Secp256k1.sign({
      payload: TransactionEnvelopeFeeToken.getSignPayload(transaction),
      privateKey,
    })
    const serialized = TransactionEnvelopeFeeToken.serialize(transaction, {
      signature,
    })
    expect(serialized).toMatchInlineSnapshot(
      `"0x77f8750182031184773594008477359400809470997970c51812dc3a010c7d01b50e0d17dc79c8880de0b6b3a764000080c0c0808001a069cf330f0a61a4d7712f2cbbb933eafc1ed6be732cf49b7269c782bb301c727ea0474916716fd0000d30e69a7b629697f04b542cc6abcb3c4e61dfdf3e9541dcc7"`,
    )
    expect(TransactionEnvelopeFeeToken.deserialize(serialized)).toEqual({
      ...transaction,
      ...signature,
    })
  })

  test('options: signature', () => {
    expect(
      TransactionEnvelopeFeeToken.serialize(transaction, {
        signature: {
          r: BigInt(
            '0x60fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fe',
          ),
          s: BigInt(
            '0x60fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fe',
          ),
          yParity: 1,
        },
      }),
    ).toMatchInlineSnapshot(
      `"0x77f8750182031184773594008477359400809470997970c51812dc3a010c7d01b50e0d17dc79c8880de0b6b3a764000080c0c0808001a060fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fea060fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fe"`,
    )

    expect(
      TransactionEnvelopeFeeToken.serialize(transaction, {
        signature: {
          r: BigInt(
            '0x60fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fe',
          ),
          s: BigInt(
            '0x60fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fe',
          ),
          yParity: 0,
        },
      }),
    ).toMatchInlineSnapshot(
      `"0x77f8750182031184773594008477359400809470997970c51812dc3a010c7d01b50e0d17dc79c8880de0b6b3a764000080c0c0808080a060fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fea060fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fe"`,
    )

    expect(
      TransactionEnvelopeFeeToken.serialize(transaction, {
        signature: {
          r: 0n,
          s: 0n,
          yParity: 0,
        },
      }),
    ).toMatchInlineSnapshot(
      `"0x77f50182031184773594008477359400809470997970c51812dc3a010c7d01b50e0d17dc79c8880de0b6b3a764000080c0c08080808080"`,
    )
  })

  test('options: feePayerSignature', async () => {
    const signature = Secp256k1.sign({
      payload: TransactionEnvelopeFeeToken.getSignPayload(transaction),
      privateKey,
    })
    const transaction_signed = TransactionEnvelopeFeeToken.from(transaction, {
      signature,
    })

    const sender = Secp256k1.recoverAddress({
      payload: TransactionEnvelopeFeeToken.getSignPayload(transaction),
      signature,
    })

    const feePayerSignature = Secp256k1.sign({
      payload: TransactionEnvelopeFeeToken.getFeePayerSignPayload(
        transaction_signed,
        {
          sender,
        },
      ),
      privateKey: privateKey2,
    })
    const serialized_feePayer = TransactionEnvelopeFeeToken.serialize(
      transaction_signed,
      {
        feePayerSignature,
      },
    )

    expect(serialized_feePayer).toMatchInlineSnapshot(
      `"0x77f8b90182031184773594008477359400809470997970c51812dc3a010c7d01b50e0d17dc79c8880de0b6b3a764000080c0c080f84380a0e64a93976c4cfd0ab07d40d58ef3f80f8c9dcc71c78c78b063654c7cab16326ba0090430ef7278d4d0ca33832eab5f92161cbf05e0b8b4db309ef9b5fe0b2a31ef01a069cf330f0a61a4d7712f2cbbb933eafc1ed6be732cf49b7269c782bb301c727ea0474916716fd0000d30e69a7b629697f04b542cc6abcb3c4e61dfdf3e9541dcc7"`,
    )
    expect(
      TransactionEnvelopeFeeToken.deserialize(serialized_feePayer),
    ).toEqual({
      ...transaction,
      ...signature,
      feePayerSignature,
    })
  })
})

describe('validate', () => {
  test('default', () => {
    expect(
      TransactionEnvelopeFeeToken.validate({
        authorizationList: [],
        chainId: 1,
      }),
    ).toBe(true)
    expect(
      TransactionEnvelopeFeeToken.validate({
        authorizationList: [],
        maxFeePerGas: 2n ** 257n,
        chainId: 1,
      }),
    ).toBe(false)
  })
})

test('exports', () => {
  expect(Object.keys(TransactionEnvelopeFeeToken)).toMatchInlineSnapshot(`
    [
      "feePayerMagic",
      "serializedType",
      "type",
      "assert",
      "deserialize",
      "from",
      "getFeePayerSignPayload",
      "getSignPayload",
      "hash",
      "serialize",
      "validate",
    ]
  `)
})

describe('e2e', () => {
  const node = Instance.tempo({ port: 3000 })
  beforeEach(() => node.start())
  afterEach(() => node.stop())

  test('behavior: default', async () => {
    const address = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266'
    const privateKey =
      '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'

    const transport = RpcTransport.fromHttp('http://localhost:3000')

    const nonce = await transport.request({
      method: 'eth_getTransactionCount',
      params: [address, 'pending'],
    })

    const transaction = TransactionEnvelopeFeeToken.from({
      chainId: 1337,
      feeToken: '0x20c0000000000000000000000000000000000001',
      nonce: BigInt(nonce),
      gas: 21000n,
      to: '0x0000000000000000000000000000000000000000',
      value: Value.fromEther('1'),
      maxFeePerGas: Value.fromGwei('20'),
      maxPriorityFeePerGas: Value.fromGwei('10'),
    })

    const signature = Secp256k1.sign({
      payload: TransactionEnvelopeFeeToken.getSignPayload(transaction),
      privateKey,
    })

    const serialized_signed = TransactionEnvelopeFeeToken.serialize(
      transaction,
      {
        signature,
      },
    )

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
          "authorizationList": [],
          "chainId": "0x539",
          "feePayerSignature": null,
          "feeToken": "0x20c0000000000000000000000000000000000001",
          "from": "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
          "gas": "0x5208",
          "gasPrice": "0x2540be42c",
          "hash": "0xcf4c4bd0ece664c243f3922a01d40f4bf158f1327ebc2f5aa1ee3d3d2fff8bb4",
          "input": "0x",
          "maxFeePerGas": "0x4a817c800",
          "maxPriorityFeePerGas": "0x2540be400",
          "nonce": "0x0",
          "r": "0xb3511e21a65f2f321fba5a2fd33d17094f97a923cc34c63f7115716b3e776c7d",
          "s": "0x87683c9e57a97b5be0b02162558d814c0f7a4a13351a664d144151ee1bac158",
          "to": "0x0000000000000000000000000000000000000000",
          "transactionIndex": "0x0",
          "type": "0x77",
          "v": "0x0",
          "value": "0xde0b6b3a7640000",
          "yParity": "0x0",
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
        "transactionHash": "0xcf4c4bd0ece664c243f3922a01d40f4bf158f1327ebc2f5aa1ee3d3d2fff8bb4",
        "transactionIndex": "0x0",
        "type": "0x77",
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

    const transaction = TransactionEnvelopeFeeToken.from({
      chainId: 1337,
      feePayerSignature: null,
      nonce: BigInt(nonce),
      gas: 21000n,
      to: '0x0000000000000000000000000000000000000000',
      value: 0n,
      maxFeePerGas: Hex.toBigInt('0x59'),
      maxPriorityFeePerGas: Hex.toBigInt('0x59'),
    })

    const signature = Secp256k1.sign({
      payload: TransactionEnvelopeFeeToken.getSignPayload(transaction),
      // unfunded PK
      privateKey: sender.privateKey,
    })

    const transaction_signed = TransactionEnvelopeFeeToken.from(transaction, {
      signature,
    })

    const feePayerSignature = Secp256k1.sign({
      payload: TransactionEnvelopeFeeToken.getFeePayerSignPayload(
        transaction_signed,
        { sender: sender.address },
      ),
      privateKey: feePayer.privateKey,
    })

    const serialized_signed = TransactionEnvelopeFeeToken.serialize(
      transaction_signed,
      {
        feePayerSignature,
      },
    )

    const hash = await transport.request({
      method: 'eth_sendRawTransaction',
      params: [serialized_signed],
    })

    expect(hash).toBeDefined()
    {
      const response = await transport.request({
        method: 'eth_getTransactionByHash',
        params: [hash],
      })

      expect(response).toMatchInlineSnapshot(`
      {
        "accessList": [],
        "authorizationList": [],
        "blockHash": null,
        "blockNumber": null,
        "chainId": "0x539",
        "feePayerSignature": {
          "r": "0xffc8a1a6c9e4f8cb7e796ff0521d9172d29c87664365f25bb3fb599aee562040",
          "s": "0x47f505ea8cf3ad98dc20864119c160bf3c5f706c13e0f13283d9dec869b3cb8e",
          "v": "0x1",
          "yParity": "0x1",
        },
        "feeToken": null,
        "from": "0x0a275bee91b39092dfd57089dee0eb0539020b90",
        "gas": "0x5208",
        "gasPrice": "0x59",
        "hash": "0x872e61efb1d53706b955f7a0dfc14de5a060bffb1237b32ca7ace529329d3ffd",
        "input": "0x",
        "maxFeePerGas": "0x59",
        "maxPriorityFeePerGas": "0x59",
        "nonce": "0x0",
        "r": "0xefe01851e57c9cb6401daced9013773302816a3c9280153c3ec1839650ac24d8",
        "s": "0xa06f8aa8dce5f90da82f528c9c9e7f427ee40896427509f9f734b6b63fb59bc",
        "to": "0x0000000000000000000000000000000000000000",
        "transactionIndex": null,
        "type": "0x77",
        "v": "0x1",
        "value": "0x0",
        "yParity": "0x1",
      }
    `)
    }

    // Wait for inclusion.
    await setTimeout(4)

    {
      const response = await transport.request({
        method: 'eth_getTransactionByHash',
        params: [hash],
      })
      if (!response) throw new Error()

      const { blockNumber, blockHash, ...rest } = response

      expect(blockNumber).toBeDefined()
      expect(blockHash).toBeDefined()
      expect(rest).toMatchInlineSnapshot(`
        {
          "accessList": [],
          "authorizationList": [],
          "chainId": "0x539",
          "feePayerSignature": {
            "r": "0xffc8a1a6c9e4f8cb7e796ff0521d9172d29c87664365f25bb3fb599aee562040",
            "s": "0x47f505ea8cf3ad98dc20864119c160bf3c5f706c13e0f13283d9dec869b3cb8e",
            "v": "0x1",
            "yParity": "0x1",
          },
          "feeToken": null,
          "from": "0x0a275bee91b39092dfd57089dee0eb0539020b90",
          "gas": "0x5208",
          "gasPrice": "0x59",
          "hash": "0x872e61efb1d53706b955f7a0dfc14de5a060bffb1237b32ca7ace529329d3ffd",
          "input": "0x",
          "maxFeePerGas": "0x59",
          "maxPriorityFeePerGas": "0x59",
          "nonce": "0x0",
          "r": "0xefe01851e57c9cb6401daced9013773302816a3c9280153c3ec1839650ac24d8",
          "s": "0xa06f8aa8dce5f90da82f528c9c9e7f427ee40896427509f9f734b6b63fb59bc",
          "to": "0x0000000000000000000000000000000000000000",
          "transactionIndex": "0x0",
          "type": "0x77",
          "v": "0x1",
          "value": "0x0",
          "yParity": "0x1",
        }
      `)
    }

    {
      const receipt = await transport.request({
        method: 'eth_getTransactionReceipt',
        params: [hash],
      })
      if (!receipt) throw new Error()

      const { blockNumber, blockHash, ...rest } = receipt

      expect(blockNumber).toBeDefined()
      expect(blockHash).toBeDefined()
      expect(rest).toMatchInlineSnapshot(`
      {
        "contractAddress": null,
        "cumulativeGasUsed": "0x5208",
        "effectiveGasPrice": "0x59",
        "from": "0x0a275bee91b39092dfd57089dee0eb0539020b90",
        "gasUsed": "0x5208",
        "logs": [],
        "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
        "status": "0x1",
        "to": "0x0000000000000000000000000000000000000000",
        "transactionHash": "0x872e61efb1d53706b955f7a0dfc14de5a060bffb1237b32ca7ace529329d3ffd",
        "transactionIndex": "0x0",
        "type": "0x77",
      }
    `)
    }
  })
})
