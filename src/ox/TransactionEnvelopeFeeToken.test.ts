import { afterEach, beforeEach, describe, expect, test } from 'bun:test'
import { setTimeout } from 'node:timers/promises'
import { Authorization, Hex, Rlp, RpcTransport, Secp256k1, Value } from 'ox'
import { TransactionEnvelopeFeeToken } from 'tempo/ox'
import { Instance } from 'tempo/prool'

const privateKey =
  '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'

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
    ).toThrowErrorMatchingInlineSnapshot(`"Chain ID "-1" is invalid."`)
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
    "Address "0x000000000000000000000000000000000000000z" is invalid.

    Details: Address is not a 20 byte (40 hexadecimal character) value."
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
      `"The fee cap (\`maxFeePerGas\`/\`maxPriorityFeePerGas\` = 115792089237316195423570985008687907853269984665640564039457584007913.129639936 gwei) cannot be higher than the maximum allowed value (2^256-1)."`,
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
        '0x', // feeToken
        Hex.fromNumber(1), // maxPriorityFeePerGas
        Hex.fromNumber(1), // maxFeePerGas
        Hex.fromNumber(1), // gas
        '0x0000000000000000000000000000000000000000', // to
        Hex.fromNumber(0), // value
        '0x', // accessList
        '0x', // authorizationList
        '0x', // data
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
        '0x', // feeToken
        Hex.fromNumber(1), // maxPriorityFeePerGas
        Hex.fromNumber(1), // maxFeePerGas
        Hex.fromNumber(1), // gas
        '0x0000000000000000000000000000000000000000', // to
        Hex.fromNumber(0), // value
        '0x', // accessList
        '0x', // authorizationList
        '0x', // data
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
        '0x', // feeToken
        Hex.fromNumber(1), // maxPriorityFeePerGas
        Hex.fromNumber(1), // maxFeePerGas
        Hex.fromNumber(1), // gas
        '0x0000000000000000000000000000000000000000', // to
        Hex.fromNumber(0), // value
        '0x', // accessList
        '0x', // authorizationList
        '0x', // data
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
        "Invalid serialized transaction of type "feeToken" was provided.

        Serialized Transaction: "0x77f84201000101019400000000000000000000000000000000000000000080e4e380e1a0000000000000000000000000000000000000000000000000000000000000000180"
        Missing Attributes: data, yParity, r, s"
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
        "Invalid serialized transaction of type "feeToken" was provided.

        Serialized Transaction: "0x77e501000101019400000000000000000000000000000000000000000080c7c683123456c10080"
        Missing Attributes: data, yParity, r, s"
      `)
    })

    test('invalid transaction (all missing)', () => {
      expect(() =>
        TransactionEnvelopeFeeToken.deserialize(
          `0x77${Rlp.fromHex([]).slice(2)}`,
        ),
      ).toThrowErrorMatchingInlineSnapshot(`
        "Invalid serialized transaction of type "feeToken" was provided.

        Serialized Transaction: "0x77c0"
        Missing Attributes: chainId, nonce, feeToken, maxPriorityFeePerGas, maxFeePerGas, gas, to, value, data, accessList, authorizationList"
      `)
    })

    test('invalid transaction (some missing)', () => {
      expect(() =>
        TransactionEnvelopeFeeToken.deserialize(
          `0x77${Rlp.fromHex(['0x00', '0x01']).slice(2)}`,
        ),
      ).toThrowErrorMatchingInlineSnapshot(`
        "Invalid serialized transaction of type "feeToken" was provided.

        Serialized Transaction: "0x77c20001"
        Missing Attributes: feeToken, maxPriorityFeePerGas, maxFeePerGas, gas, to, value, data, accessList, authorizationList"
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
          ]).slice(2)}`,
        ),
      ).toThrowErrorMatchingInlineSnapshot(`
        "Invalid serialized transaction of type "feeToken" was provided.

        Serialized Transaction: "0x77cc808080808080808080808080"
        Missing Attributes: r, s"
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
})

describe('getSignPayload', () => {
  test('default', () => {
    const authorization = Authorization.from({
      address: '0x0000000000000000000000000000000000000000',
      chainId: 1,
      nonce: 785n,
    })
    const signature = Secp256k1.sign({
      payload: Authorization.getSignPayload(authorization),
      privateKey,
    })

    const envelope = TransactionEnvelopeFeeToken.from({
      authorizationList: [Authorization.from(authorization, { signature })],
      chainId: 1,
      gas: 21000n,
      maxFeePerGas: 13000000000n,
      maxPriorityFeePerGas: 1000000000n,
      nonce: 665n,
      value: 1000000000000000000n,
      to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
    })

    const hash = TransactionEnvelopeFeeToken.hash(envelope, { presign: true })
    expect(hash).toMatchInlineSnapshot(
      `"0xd1fcea68c80a5b58ad193193076c5cde0f208e1af04c0f53400660a8de2ed1d2"`,
    )

    const signature_tx = Secp256k1.sign({
      payload: TransactionEnvelopeFeeToken.getSignPayload(envelope),
      privateKey,
    })

    const envelope_signed = TransactionEnvelopeFeeToken.from(envelope, {
      signature: signature_tx,
    })

    {
      const hash = TransactionEnvelopeFeeToken.hash(envelope_signed)
      expect(hash).toMatchInlineSnapshot(
        `"0xe6c50ba6499196c4f2b06a5f8d8140a51bdafa9d31882900bb43afd7e7fb14d5"`,
      )
    }
    {
      const hash_presign =
        TransactionEnvelopeFeeToken.getSignPayload(envelope_signed)
      expect(hash_presign).toEqual(hash)
    }
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
      `"0x54c6142a1be856522d0182b61becbd595ecb2476addd07e9df40afbbad558ca5"`,
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
      `"0x77f1018203118084773594008477359400809470997970c51812dc3a010c7d01b50e0d17dc79c8880de0b6b3a7640000c0c080"`,
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

    expect(serialized).toMatchInlineSnapshot(`"0x77cb0180808080808080c0c080"`)
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
    expect(serialized).toMatchInlineSnapshot(`"0x77cb0180808080808080c0c080"`)
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
    expect(serialized).toMatchInlineSnapshot(`"0x77cb0180808001808080c0c080"`)
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
      `"0x77f88e018203118084773594008477359400809470997970c51812dc3a010c7d01b50e0d17dc79c8880de0b6b3a7640000c0f85cf85a809400000000000000000000000000000000000000008001a0aa64791de483fa82224c2beeba9ee4c89323db0d1a39c24bcfa555b8d3c31aa9a03cdeba27b1c512236967597d1352b6d71239bebde01237ca72b26d6fd218cb9780"`,
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
      `"0x77f30182031180847735940084773594008252099470997970c51812dc3a010c7d01b50e0d17dc79c8880de0b6b3a7640000c0c080"`,
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
      `"0x77f8450182031194deadbeefdeadbeefdeadbeefdeadbeefdeadbeef84773594008477359400809470997970c51812dc3a010c7d01b50e0d17dc79c8880de0b6b3a7640000c0c080"`,
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
      `"0x77f88d018203118084773594008477359400809470997970c51812dc3a010c7d01b50e0d17dc79c8880de0b6b3a7640000f85bf859940000000000000000000000000000000000000000f842a00000000000000000000000000000000000000000000000000000000000000001a060fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fec080"`,
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
      `"0x77f3018203118084773594008477359400809470997970c51812dc3a010c7d01b50e0d17dc79c8880de0b6b3a7640000c0c0821234"`,
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
      `"0x77f874018203118084773594008477359400809470997970c51812dc3a010c7d01b50e0d17dc79c8880de0b6b3a7640000c0c08080a0f6ad66de87ea2e00db89fffc6bf479eab52cc1d28930d1662b26fa7e9228d304a02fe0b1df177f003ef15f64298d0b716c44c5aae028d3ddde4b358872188785e4"`,
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
      `"0x77f874018203118084773594008477359400809470997970c51812dc3a010c7d01b50e0d17dc79c8880de0b6b3a7640000c0c08001a060fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fea060fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fe"`,
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
      `"0x77f874018203118084773594008477359400809470997970c51812dc3a010c7d01b50e0d17dc79c8880de0b6b3a7640000c0c08080a060fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fea060fdd29ff912ce880cd3edaf9f932dc61d3dae823ea77e0323f94adb9f6a72fe"`,
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
      `"0x77f4018203118084773594008477359400809470997970c51812dc3a010c7d01b50e0d17dc79c8880de0b6b3a7640000c0c080808080"`,
    )
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
      "assert",
      "deserialize",
      "from",
      "getSignPayload",
      "hash",
      "serialize",
      "serializedType",
      "type",
      "validate",
    ]
  `)
})

describe.skipIf(!!process.env.CI)('e2e', () => {
  const node = Instance.tempo({ port: 8545 })
  beforeEach(() => node.start())
  afterEach(() => node.stop())

  test('behavior: network', async () => {
    const address = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266'
    const privateKey =
      '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'

    const transport = RpcTransport.fromHttp('http://localhost:8545')

    const nonce = await transport.request({
      method: 'eth_getTransactionCount',
      params: [address, 'pending'],
    })

    const transaction = TransactionEnvelopeFeeToken.from({
      chainId: 1337,
      feeToken: '0x20c0000000000000000000000000000000000000',
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
        "feeToken": "0x20c0000000000000000000000000000000000000",
        "from": "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
        "gas": "0x5208",
        "gasPrice": "0x4a817c800",
        "hash": "0x2ed63d3c3020c91cff79f8d7d18c09d53614a929231f5292c4b6ea278309b587",
        "input": "0x",
        "maxFeePerGas": "0x4a817c800",
        "maxPriorityFeePerGas": "0x2540be400",
        "nonce": "0x0",
        "r": "0xcfd572392075019a98174d4d4b145c8940104f3ebdb9bfd9dc328b9d1980ce97",
        "s": "0xe86b6a7e36acd75b2da6c344d1a6001a5ae49bdfbd6982de250339769137671",
        "to": "0x0000000000000000000000000000000000000000",
        "transactionIndex": null,
        "type": "0x77",
        "v": "0x1",
        "value": "0xde0b6b3a7640000",
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
          "feeToken": "0x20c0000000000000000000000000000000000000",
          "from": "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
          "gas": "0x5208",
          "gasPrice": "0x2540be42c",
          "hash": "0x2ed63d3c3020c91cff79f8d7d18c09d53614a929231f5292c4b6ea278309b587",
          "input": "0x",
          "maxFeePerGas": "0x4a817c800",
          "maxPriorityFeePerGas": "0x2540be400",
          "nonce": "0x0",
          "r": "0xcfd572392075019a98174d4d4b145c8940104f3ebdb9bfd9dc328b9d1980ce97",
          "s": "0xe86b6a7e36acd75b2da6c344d1a6001a5ae49bdfbd6982de250339769137671",
          "to": "0x0000000000000000000000000000000000000000",
          "transactionIndex": "0x0",
          "type": "0x77",
          "v": "0x1",
          "value": "0xde0b6b3a7640000",
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
        "effectiveGasPrice": "0x2540be42c",
        "from": "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
        "gasUsed": "0x5208",
        "logs": [],
        "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
        "status": "0x0",
        "to": "0x0000000000000000000000000000000000000000",
        "transactionHash": "0x2ed63d3c3020c91cff79f8d7d18c09d53614a929231f5292c4b6ea278309b587",
        "transactionIndex": "0x0",
        "type": "0x77",
      }
    `)
    }
  })
})
