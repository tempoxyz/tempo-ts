import { afterEach, beforeEach, describe, expect, test } from 'bun:test'
import { setTimeout } from 'node:timers/promises'
import { Authorization, Hex, Rlp, RpcTransport, Secp256k1, Value } from 'ox'
import { TransactionEnvelopeFeeToken } from 'tempo/ox'
import { Instance } from 'tempo/prool'

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
        "Invalid serialized transaction of type "feeToken" was provided.

        Serialized Transaction: "0x77f84201000101019400000000000000000000000000000000000000000080e4e380e1a0000000000000000000000000000000000000000000000000000000000000000180"
        Missing Attributes: feeToken, feePayerSignature, yParity, r, s"
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
        Missing Attributes: feeToken, feePayerSignature, yParity, r, s"
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
        Missing Attributes: chainId, nonce, feeToken, maxPriorityFeePerGas, maxFeePerGas, gas, to, value, data, accessList, authorizationList, feePayerSignature"
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
        Missing Attributes: feeToken, maxPriorityFeePerGas, maxFeePerGas, gas, to, value, data, accessList, authorizationList, feePayerSignature"
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
        "Invalid serialized transaction of type "feeToken" was provided.

        Serialized Transaction: "0x77cd80808080808080808080808080"
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

    const feePayerSignature = Secp256k1.sign({
      payload: TransactionEnvelopeFeeToken.getSignPayload(envelope_signed, {
        feePayer: true,
      }),
      privateKey: privateKey2,
    })

    const feePayerEnvelope_signed = TransactionEnvelopeFeeToken.from(
      envelope_signed,
      {
        feePayerSignature,
      },
    )

    expect(feePayerEnvelope_signed).toMatchInlineSnapshot(`
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
        "feePayerSignature": {
          "r": 79872537479360966270801552215489412667631145113719719852837413345745252996375n,
          "s": 23932659457782832782050863098328782740190494129293437648706242640018950772385n,
          "yParity": 0,
        },
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

  test('behavior: presign: feePayer', () => {
    const envelope = TransactionEnvelopeFeeToken.from({
      authorizationList: [],
      chainId: 1,
      gas: 21000n,
      maxFeePerGas: 13000000000n,
      maxPriorityFeePerGas: 1000000000n,
      nonce: 665n,
      value: 1000000000000000000n,
      to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
      feePayerSignature: {
        r: BigInt(
          '0xacf664dcd984d082b68c434feb66ac684711babdeefe6f101bf8df88fc367a37',
        ),
        s: BigInt(
          '0x5e0800058a9b5c2250bed60ee969a45b7445e562a8298c2d222d114e6dfbfcb9',
        ),
        yParity: 0,
      },
      r: BigInt(
        '0xacf664dcd984d082b68c434feb66ac684711babdeefe6f101bf8df88fc367a37',
      ),
      s: BigInt(
        '0x5e0800058a9b5c2250bed60ee969a45b7445e562a8298c2d222d114e6dfbfcb9',
      ),
      yParity: 0,
    })

    const hash = TransactionEnvelopeFeeToken.hash(envelope, {
      presign: 'feePayer',
    })
    expect(hash).toMatchInlineSnapshot(
      `"0x8666eefb41cc8c6b2e79254236ff6fdc8e7fb6eed47f49aab5fe285e60909811"`,
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

    const feePayerSignature = Secp256k1.sign({
      payload: TransactionEnvelopeFeeToken.getSignPayload(transaction_signed, {
        feePayer: true,
      }),
      privateKey: privateKey2,
    })
    const serialized_feePayer = TransactionEnvelopeFeeToken.serialize(
      transaction_signed,
      {
        feePayerSignature,
      },
    )

    expect(serialized_feePayer).toMatchInlineSnapshot(
      `"0x77f8b90182031184773594008477359400809470997970c51812dc3a010c7d01b50e0d17dc79c8880de0b6b3a764000080c0c080f84380a0a2eb32fff67197ce69e9aff5b327784e531af545a1668c6195440779796163ffa04f8157665e4faabeb82661034038c3843cc18d71edd3d566e73fb193bc5b516701a069cf330f0a61a4d7712f2cbbb933eafc1ed6be732cf49b7269c782bb301c727ea0474916716fd0000d30e69a7b629697f04b542cc6abcb3c4e61dfdf3e9541dcc7"`,
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

  test('behavior: default', async () => {
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
        "feePayerSignature": null,
        "feeToken": "0x20c0000000000000000000000000000000000000",
        "from": "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
        "gas": "0x5208",
        "gasPrice": "0x4a817c800",
        "hash": "0xffec2c3aee1b7ce955120c950286eb3d4f758685e440855a220ff341d6d665d7",
        "input": "0x",
        "maxFeePerGas": "0x4a817c800",
        "maxPriorityFeePerGas": "0x2540be400",
        "nonce": "0x0",
        "r": "0xa95419f113415ccb9d7f0041e6989d09e031dc21a1605849edaddd72cff286ea",
        "s": "0x56b4faf46d2b07c294c4efa2db09e669a50b018d51b94529987d53ff011e09ee",
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
          "feePayerSignature": null,
          "feeToken": "0x20c0000000000000000000000000000000000000",
          "from": "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
          "gas": "0x5208",
          "gasPrice": "0x2540be42c",
          "hash": "0xffec2c3aee1b7ce955120c950286eb3d4f758685e440855a220ff341d6d665d7",
          "input": "0x",
          "maxFeePerGas": "0x4a817c800",
          "maxPriorityFeePerGas": "0x2540be400",
          "nonce": "0x0",
          "r": "0xa95419f113415ccb9d7f0041e6989d09e031dc21a1605849edaddd72cff286ea",
          "s": "0x56b4faf46d2b07c294c4efa2db09e669a50b018d51b94529987d53ff011e09ee",
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
        "transactionHash": "0xffec2c3aee1b7ce955120c950286eb3d4f758685e440855a220ff341d6d665d7",
        "transactionIndex": "0x0",
        "type": "0x77",
      }
    `)
    }
  })

  test('behavior: feePayerSignature', async () => {
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
      nonce: BigInt(nonce),
      gas: 21000n,
      to: '0x0000000000000000000000000000000000000000',
      value: 0n,
      maxFeePerGas: Hex.toBigInt('0x59'),
      maxPriorityFeePerGas: Hex.toBigInt('0x59'),
    })

    const signature = Secp256k1.sign({
      payload: TransactionEnvelopeFeeToken.getSignPayload(transaction),
      privateKey:
        // unfunded PK
        '0xfe24691eff5297c76e847dc78a8966b96cf65a44140b9a0d3f5100ce71d74a59',
    })

    const transaction_signed = TransactionEnvelopeFeeToken.from(transaction, {
      signature,
    })

    const feePayerSignature = Secp256k1.sign({
      payload: TransactionEnvelopeFeeToken.getSignPayload(transaction_signed, {
        feePayer: true,
      }),
      privateKey,
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
          "r": "0x12f4d9e9924f62b19de816252efc125006298f43e62d394151e62600e2c2f91e",
          "s": "0x31daa78bb3e95dd22f6370e59617c60d109bf28e55c92b25994ddbed420e2a80",
          "v": "0x0",
          "yParity": "0x0",
        },
        "feeToken": null,
        "from": "0xe53b6938b1801bc7a2322958e634267595421105",
        "gas": "0x5208",
        "gasPrice": "0x59",
        "hash": "0x979340fc0ff5abf5405908d5c89bbcddeebf5d52cdf22d3066fb94183741b2cc",
        "input": "0x",
        "maxFeePerGas": "0x59",
        "maxPriorityFeePerGas": "0x59",
        "nonce": "0x0",
        "r": "0x62eb5020795faaf44ccc405873bd5cf9ef33aac40c9adcbed277872617abf96c",
        "s": "0x737f9669ce3980942a7f9fd9a5aeaf571ed7f8f2fd923f3822efe703be4381e1",
        "to": "0x0000000000000000000000000000000000000000",
        "transactionIndex": null,
        "type": "0x77",
        "v": "0x0",
        "value": "0x0",
        "yParity": "0x0",
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
            "r": "0x12f4d9e9924f62b19de816252efc125006298f43e62d394151e62600e2c2f91e",
            "s": "0x31daa78bb3e95dd22f6370e59617c60d109bf28e55c92b25994ddbed420e2a80",
            "v": "0x0",
            "yParity": "0x0",
          },
          "feeToken": null,
          "from": "0xe53b6938b1801bc7a2322958e634267595421105",
          "gas": "0x5208",
          "gasPrice": "0x59",
          "hash": "0x979340fc0ff5abf5405908d5c89bbcddeebf5d52cdf22d3066fb94183741b2cc",
          "input": "0x",
          "maxFeePerGas": "0x59",
          "maxPriorityFeePerGas": "0x59",
          "nonce": "0x0",
          "r": "0x62eb5020795faaf44ccc405873bd5cf9ef33aac40c9adcbed277872617abf96c",
          "s": "0x737f9669ce3980942a7f9fd9a5aeaf571ed7f8f2fd923f3822efe703be4381e1",
          "to": "0x0000000000000000000000000000000000000000",
          "transactionIndex": "0x0",
          "type": "0x77",
          "v": "0x0",
          "value": "0x0",
          "yParity": "0x0",
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
        "from": "0xe53b6938b1801bc7a2322958e634267595421105",
        "gasUsed": "0x5208",
        "logs": [],
        "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
        "status": "0x1",
        "to": "0x0000000000000000000000000000000000000000",
        "transactionHash": "0x979340fc0ff5abf5405908d5c89bbcddeebf5d52cdf22d3066fb94183741b2cc",
        "transactionIndex": "0x0",
        "type": "0x77",
      }
    `)
    }
  })
})
