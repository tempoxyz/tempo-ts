import { node } from '@elysiajs/node'
import { Elysia } from 'elysia'
import { RpcRequest, RpcResponse } from 'ox'
import * as actions from 'tempo.ts/viem/actions'
import { createClient, http, publicActions, walletActions } from 'viem'
import { mnemonicToAccount, privateKeyToAccount } from 'viem/accounts'
import { afterAll, beforeAll, describe, expect, test } from 'vitest'
import { tempoTest } from '../../test/viem/config.js'
import { tempoActions } from './index.js'
import { parseTransaction } from './transaction.js'
import { withFeePayer } from './transport.js'

describe('sendTransaction', () => {
  test('default', async () => {
    const client = createClient({
      account: mnemonicToAccount(
        'test test test test test test test test test test test junk',
      ),
      chain: tempoTest,
      transport: http(),
    })
      .extend(publicActions)
      .extend(walletActions)

    const hash = await client.sendTransaction({
      feeToken: '0x20c0000000000000000000000000000000000001',
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
        "feeToken": "0x20c0000000000000000000000000000000000001",
        "from": "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
        "gas": 21000n,
        "gasPrice": 44n,
        "hash": "0x8ec74666e522dc615181a9c0294885008203c70fe80bf5314170d8285604bc03",
        "input": "0x",
        "maxFeePerBlobGas": undefined,
        "maxFeePerGas": 52n,
        "maxPriorityFeePerGas": 0n,
        "nonce": 0,
        "r": "0xe1e0835591e08f11350c14c2d0afb8227ae9acc5ee1b5aa683428281ce6bd71c",
        "s": "0x646f901ac3ef1cd06bb12205959975c25d07d22b3e790494224f7df51ddbca8c",
        "to": "0x0000000000000000000000000000000000000000",
        "transactionIndex": 0,
        "type": "feeToken",
        "typeHex": "0x77",
        "v": 27n,
        "value": 0n,
        "yParity": 0,
      }
    `)
  })

  test('with calls', async () => {
    const client = createClient({
      account: mnemonicToAccount(
        'test test test test test test test test test test test junk',
      ),
      chain: tempoTest,
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
        "data": "0xe9ae5c5301000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000026000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002000000000000000000000000020fc000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000164b395b9ac00000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000000000000000000000000000000000000000012000000000000000000000000020c0000000000000000000000000000000000000000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb92266000000000000000000000000000000000000000000000000000000000000000c5465737420546f6b656e20330000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000554455354330000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003555344000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
        "feePayerSignature": undefined,
        "feeToken": null,
        "from": "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
        "gas": 30501n,
        "gasPrice": 44n,
        "hash": "0xb034cece2643ba3f07e6cc09ed5a0f3affef931abb6fb08a881442b94fedfcb4",
        "input": "0xe9ae5c5301000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000026000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002000000000000000000000000020fc000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000600000000000000000000000000000000000000000000000000000000000000164b395b9ac00000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000000000000000000000000000000000000000012000000000000000000000000020c0000000000000000000000000000000000000000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb92266000000000000000000000000000000000000000000000000000000000000000c5465737420546f6b656e20330000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000554455354330000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003555344000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
        "maxFeePerBlobGas": undefined,
        "maxFeePerGas": 52n,
        "maxPriorityFeePerGas": 0n,
        "nonce": 0,
        "r": "0x073c694a17fa4ec46bfcbeb3abdc4ebc52d908db6e495a3fbca07bc0e5d64ac0",
        "s": "0x7060a864cb8bd1b4292a7f91ff1703fd5275110a6df96e4f4a8483189a17ce58",
        "to": "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
        "transactionIndex": 0,
        "type": "feeToken",
        "typeHex": "0x77",
        "v": 28n,
        "value": 0n,
        "yParity": 1,
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
      chain: tempoTest,
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

describe('signTransaction', () => {
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
      chain: tempoTest,
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

describe('relay', () => {
  let server: Elysia

  beforeAll(async () => {
    server = new Elysia({ adapter: node() })
      .post('/', async ({ body }) => {
        const client = createClient({
          account: mnemonicToAccount(
            'test test test test test test test test test test test junk',
          ),
          chain: tempoTest,
          transport: http(),
        }).extend(walletActions)

        const request = RpcRequest.from(body as any)

        if (
          request.method !== 'eth_sendRawTransaction' &&
          request.method !== 'eth_sendRawTransactionSync'
        )
          return Response.json(
            RpcResponse.from(
              {
                error: new RpcResponse.InvalidParamsError({
                  message:
                    'service only supports `eth_sendRawTransaction` and `eth_sendRawTransactionSync`',
                }),
              },
              { request },
            ),
          )

        const serialized = request.params?.[0] as `0x77${string}`
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
        const result = await client.request({
          method: request.method,
          params: [serializedTransaction],
        })

        return Response.json(RpcResponse.from({ result }, { request }))
      })
      .listen(3000)
  })

  afterAll(() => {
    process.on('SIGINT', () => {
      server.stop()
      process.exit(0)
    })
    process.on('SIGTERM', () => {
      server.stop()
      process.exit(0)
    })
  })

  test('default', async () => {
    const client = createClient({
      account: privateKeyToAccount(
        // unfunded PK
        '0xecc3fe55647412647e5c6b657c496803b08ef956f927b7a821da298cfbdd9666',
      ),
      chain: tempoTest,
      transport: withFeePayer(http(), http('http://localhost:3000')),
    })
      .extend(tempoActions())
      .extend(walletActions)
      .extend(publicActions)

    const { receipt } = await client.fee.setUserTokenSync({
      feePayer: true,
      token: 1n,
    })

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
    } = await client.getTransaction({ hash: receipt.transactionHash })

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
