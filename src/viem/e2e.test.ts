import { afterEach, beforeEach, describe, expect, test } from 'bun:test'
import { RpcRequest, RpcResponse } from 'ox'
import { tempoLocal } from 'tempo/chains'
import { Instance } from 'tempo/prool'
import * as actions from 'tempo/viem/actions'
import { createClient, http, publicActions, walletActions } from 'viem'
import { mnemonicToAccount, privateKeyToAccount } from 'viem/accounts'
import { tempoActions } from './index.js'
import { parseTransaction } from './transaction.js'
import { withFeePayer } from './transport.js'

const instance = Instance.tempo({ port: 8545 })

beforeEach(() => instance.start())
afterEach(() => instance.stop())

describe.skipIf(!!process.env.CI)('sendTransaction', () => {
  test('default', async () => {
    const client = createClient({
      account: mnemonicToAccount(
        'test test test test test test test test test test test junk',
      ),
      chain: tempoLocal,
      transport: http(),
    })
      .extend(publicActions)
      .extend(walletActions)

    const hash = await client.sendTransaction({
      feeToken: '0x20c0000000000000000000000000000000000000',
      to: '0x0000000000000000000000000000000000000000',
    })
    await client.waitForTransactionReceipt({ hash })

    const {
      blockHash: _,
      blockNumber: __,
      ...transaction
    } = await client.getTransaction({ hash })

    expect(transaction).toMatchInlineSnapshot(`
      {
        "accessList": [],
        "authorizationList": [],
        "chainId": 1337,
        "data": "0x",
        "feePayerSignature": undefined,
        "feeToken": "0x20c0000000000000000000000000000000000000",
        "from": "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
        "gas": 21000n,
        "gasPrice": 44n,
        "hash": "0x2dc7455a259871cc354fe83a904a1a003555d5d365a81dd4dc7b1ca42e63f2dc",
        "input": "0x",
        "maxFeePerBlobGas": undefined,
        "maxFeePerGas": 52n,
        "maxPriorityFeePerGas": 0n,
        "nonce": 0,
        "r": "0x17d8f3e7638105d316e004faa8e6b680d6f55e0326bf2f0534a0d83b46b6d3fb",
        "s": "0x4a83f0e41f1f13bbbe0b53e4b57d2fb2d2542927e2331016c55265eb0bf5e80a",
        "to": "0x0000000000000000000000000000000000000000",
        "transactionIndex": 0,
        "type": "feeToken",
        "typeHex": "0x77",
        "v": 28n,
        "value": 0n,
        "yParity": 1,
      }
    `)
  })

  test('with calls', async () => {
    const client = createClient({
      account: mnemonicToAccount(
        'test test test test test test test test test test test junk',
      ),
      chain: tempoLocal,
      transport: http(),
    })
      .extend(publicActions)
      .extend(walletActions)

    const hash = await client.sendTransaction({
      calls: [
        actions.token.create.call({
          admin: client.account.address,
          currency: 'USD',
          name: 'Test Token 3',
          symbol: 'TEST3',
        }),
      ],
    })
    await client.waitForTransactionReceipt({ hash })

    const transaction = await client.getTransaction({ hash })
    expect({
      ...transaction,
      blockHash: undefined,
      blockNumber: undefined,
    }).toMatchInlineSnapshot(`
      {
        "accessList": [],
        "authorizationList": [],
        "blockHash": undefined,
        "blockNumber": undefined,
        "chainId": 1337,
        "data": "0xe9ae5c5301000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000024000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002000000000000000000000000020fc0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000001447b155afa000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000100000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb92266000000000000000000000000000000000000000000000000000000000000000c5465737420546f6b656e20330000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000554455354330000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003555344000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
        "feePayerSignature": undefined,
        "feeToken": null,
        "from": "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
        "gas": 30090n,
        "gasPrice": 44n,
        "hash": "0xdac9fd849170da469ed362cbe83e65b28ec04206e4be12a87ca719f2727a9f0e",
        "input": "0xe9ae5c5301000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000024000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002000000000000000000000000020fc0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000001447b155afa000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000c00000000000000000000000000000000000000000000000000000000000000100000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb92266000000000000000000000000000000000000000000000000000000000000000c5465737420546f6b656e20330000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000554455354330000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003555344000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
        "maxFeePerBlobGas": undefined,
        "maxFeePerGas": 52n,
        "maxPriorityFeePerGas": 0n,
        "nonce": 0,
        "r": "0x3c55f0844854fcabd0fb085202a78de58e92b0389b5d0d5b623b4eaafe2c1c7d",
        "s": "0x5d9019302d458f76b424f242b1212ffb2fc3301f4cd23b4b6d2493cb38d5361b",
        "to": "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
        "transactionIndex": 0,
        "type": "feeToken",
        "typeHex": "0x77",
        "v": 27n,
        "value": 0n,
        "yParity": 0,
      }
    `)
  })

  test('with feePayer', async () => {
    const account = privateKeyToAccount(
      // unfunded PK
      '0xecc3fe55647412647e5c6b657c496803b08ef956f927b7a821da298cfbdd9666',
    )
    const feePayer = mnemonicToAccount(
      'test test test test test test test test test test test junk',
    )

    const client = createClient({
      account,
      chain: tempoLocal,
      transport: http(),
    })
      .extend(publicActions)
      .extend(walletActions)

    const hash = await client.sendTransaction({
      feePayer,
      to: '0x0000000000000000000000000000000000000000',
    })
    await client.waitForTransactionReceipt({ hash })

    const {
      blockHash: _,
      blockNumber: __,
      ...transaction
    } = await client.getTransaction({ hash })

    expect(transaction).toMatchInlineSnapshot(`
      {
        "accessList": [],
        "authorizationList": [],
        "chainId": 1337,
        "data": "0x",
        "feePayer": "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
        "feePayerSignature": {
          "r": "0x5d32035dfaa049e95bf9baa487f817a824ef154e7252587a88f0e1d46077790b",
          "s": "0x3583f71d8df11e2e7976336ae0ee960521e80af5719e6387d7dc832f5bace402",
          "v": 28n,
          "yParity": 1,
        },
        "feeToken": null,
        "from": "0x740474977e01d056f04a314b5537e4dd88f35952",
        "gas": 21000n,
        "gasPrice": 44n,
        "hash": "0xc4a600da90b6267bec6f414b378819dc95c597820df324b0df4e16b63cee430b",
        "input": "0x",
        "maxFeePerBlobGas": undefined,
        "maxFeePerGas": 52n,
        "maxPriorityFeePerGas": 0n,
        "nonce": 0,
        "r": "0x1f1297f1407dd0676e1c832c62838051927c0cdabdd5ff8e30a6946cd57adb79",
        "s": "0x779c8374b9a22585f05d4484f1c4b2b022cc114cb7002b525f66873dd43e1fa9",
        "to": "0x0000000000000000000000000000000000000000",
        "transactionIndex": 0,
        "type": "feeToken",
        "typeHex": "0x77",
        "v": 28n,
        "value": 0n,
        "yParity": 1,
      }
    `)
  })
})

describe.skipIf(!!process.env.CI)('signTransaction', () => {
  test('default', async () => {
    const account = privateKeyToAccount(
      // unfunded PK
      '0xecc3fe55647412647e5c6b657c496803b08ef956f927b7a821da298cfbdd9666',
    )
    const feePayer = mnemonicToAccount(
      'test test test test test test test test test test test junk',
    )

    const client = createClient({
      account,
      chain: tempoLocal,
      transport: http(),
    })
      .extend(walletActions)
      .extend(publicActions)

    const request = await client.prepareTransactionRequest({
      data: '0xdeadbeef',
      feePayer: true,
      to: '0xcafebabecafebabecafebabecafebabecafebabe',
      type: 'feeToken',
    })
    let transaction = await client.signTransaction(request)

    transaction = await client.signTransaction({
      ...parseTransaction(transaction),
      feePayer,
    })
    const hash = await client.sendRawTransaction({
      serializedTransaction: transaction,
    })

    await client.waitForTransactionReceipt({ hash })

    const {
      blockHash: _,
      blockNumber: __,
      ...transaction2
    } = await client.getTransaction({ hash })

    expect(transaction2).toMatchInlineSnapshot(`
      {
        "accessList": [],
        "authorizationList": [],
        "chainId": 1337,
        "data": "0xdeadbeef",
        "feePayer": "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
        "feePayerSignature": {
          "r": "0xd855471eb74e1225bb0f12b105c8b22849af6bdbdc88e69fc4a22a0760fdb980",
          "s": "0x4bb4c1c891657b24170fb839aaad72b11038a3d01d4f21dd912e3a3052c9c59c",
          "v": 28n,
          "yParity": 1,
        },
        "feeToken": null,
        "from": "0x740474977e01d056f04a314b5537e4dd88f35952",
        "gas": 21326n,
        "gasPrice": 44n,
        "hash": "0x63f48eadae4ab046e9ca41bcfa59a0c6046da2b04f210ba6e49182d8f73e8e63",
        "input": "0xdeadbeef",
        "maxFeePerBlobGas": undefined,
        "maxFeePerGas": 52n,
        "maxPriorityFeePerGas": 0n,
        "nonce": 0,
        "r": "0xbb738db362d493d3d2674a1542ffc188b7ccc3e0cd162d571f382f2baa130180",
        "s": "0x6fe0bbf76e60f89b4f9e3a94124c46d182e194a55caee95bef400ddb27974aea",
        "to": "0xcafebabecafebabecafebabecafebabecafebabe",
        "transactionIndex": 0,
        "type": "feeToken",
        "typeHex": "0x77",
        "v": 28n,
        "value": 0n,
        "yParity": 1,
      }
    `)
  })
})

describe.skipIf(!!process.env.CI)('relay', () => {
  test('default', async () => {
    const { url } = Bun.serve({
      port: 3000,
      async fetch(req) {
        const client = createClient({
          account: mnemonicToAccount(
            'test test test test test test test test test test test junk',
          ),
          chain: tempoLocal,
          transport: http(),
        }).extend(walletActions)

        const request = RpcRequest.from(await req.json())

        if (request.method !== 'eth_sendRawTransaction')
          return Response.json(
            RpcResponse.from(
              {
                error: new RpcResponse.MethodNotSupportedError({
                  message: 'service only supports `eth_sendRawTransaction`',
                }),
              },
              { request },
            ),
          )

        const serialized = request.params[0] as `0x77${string}`
        if (!serialized.startsWith('0x77'))
          return Response.json(
            RpcResponse.from(
              {
                error: new RpcResponse.InvalidParamsError({
                  message: 'service only supports `0x77` transactions',
                }),
              },
              { request },
            ),
          )

        const transaction = parseTransaction(serialized)
        const serializedTransaction = await client.signTransaction({
          ...transaction,
          feePayer: client.account,
        })
        const hash = await client.sendRawTransaction({
          serializedTransaction,
        })

        return Response.json(RpcResponse.from({ result: hash }, { request }))
      },
    })

    const client = createClient({
      account: privateKeyToAccount(
        // unfunded PK
        '0xecc3fe55647412647e5c6b657c496803b08ef956f927b7a821da298cfbdd9666',
      ),
      chain: tempoLocal,
      transport: withFeePayer(http(), http(url.toString())),
    })
      .extend(tempoActions())
      .extend(walletActions)
      .extend(publicActions)

    const hash = await client.fee.setUserToken({
      feePayer: true,
      token: 1n,
    })
    await client.waitForTransactionReceipt({ hash })

    const userToken = await client.fee.getUserToken()
    expect(userToken).toMatchInlineSnapshot(`
      {
        "address": "0x20C0000000000000000000000000000000000001",
        "id": 1n,
      }
    `)

    const {
      blockHash: _,
      blockNumber: __,
      ...transaction
    } = await client.getTransaction({ hash })

    expect(transaction).toMatchInlineSnapshot(`
      {
        "accessList": [],
        "authorizationList": [],
        "chainId": 1337,
        "data": "0xe789744400000000000000000000000020c0000000000000000000000000000000000001",
        "feePayer": "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
        "feePayerSignature": {
          "r": "0xfe9df92927697e996652682213d142b2ffb6fdab9777979c78f62cb3e061674b",
          "s": "0x104fb902e6e4b704792e12ebc6236831a38492d439974a4ee215af191c83ab3a",
          "v": 28n,
          "yParity": 1,
        },
        "feeToken": null,
        "from": "0x740474977e01d056f04a314b5537e4dd88f35952",
        "gas": 22563n,
        "gasPrice": 44n,
        "hash": "0xdf9d902872fbe0a631a66f7a629da6746c0bcc1e11cd3374d4db899ae4af175f",
        "input": "0xe789744400000000000000000000000020c0000000000000000000000000000000000001",
        "maxFeePerBlobGas": undefined,
        "maxFeePerGas": 52n,
        "maxPriorityFeePerGas": 0n,
        "nonce": 0,
        "r": "0x65b6e02e960b2e7dc5c04436d041a6f327180269303c5a897b669be783ddbc8c",
        "s": "0x497a98ff1ca644dd98a25181044112868b46fedbbbc55b278ba4d8139a6b4b54",
        "to": "0xfeec000000000000000000000000000000000000",
        "transactionIndex": 0,
        "type": "feeToken",
        "typeHex": "0x77",
        "v": 28n,
        "value": 0n,
        "yParity": 1,
      }
    `)
  })
})
