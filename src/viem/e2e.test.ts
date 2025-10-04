import { afterEach, beforeEach, describe, expect, test } from 'bun:test'
import { RpcRequest, RpcResponse } from 'ox'
import { tempoLocal } from 'tempo/chains'
import { Instance } from 'tempo/prool'
import { createClient, http, publicActions, walletActions } from 'viem'
import { mnemonicToAccount, privateKeyToAccount } from 'viem/accounts'
import { tempoActions } from './index.js'
import { parseTransaction } from './transaction.js'
import { withRelay } from './transport.js'

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
          "r": "0x9af9c1a3501e45c6081cd34777786e5c5421deb7025a3ded958ed9e0bdd38764",
          "s": "0x6feacd87d7b9a84fdb3acea2daec53ba46b1a426e38f9774a0aea088bfc9b70b",
          "v": 27n,
          "yParity": 0,
        },
        "feeToken": null,
        "from": "0x740474977e01d056f04a314b5537e4dd88f35952",
        "gas": 21000n,
        "gasPrice": 44n,
        "hash": "0xa3bde2c4a6e21a9e3a9522ca4fe3fc54c73e33182778e73fe7faa650dbfe24a9",
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
          "r": "0xd31da7c22cdee08fc8ffb145600ab18a887fdd722c4e21ecc8958ba318b6de77",
          "s": "0x11fb20d393007ab42db33facc627a759ddbd38999cca08b6b26ac39c9947e9ae",
          "v": 27n,
          "yParity": 0,
        },
        "feeToken": null,
        "from": "0x740474977e01d056f04a314b5537e4dd88f35952",
        "gas": 21326n,
        "gasPrice": 44n,
        "hash": "0xc9a7d0cf1f8abfebed688ebffceb838c47c61e9ef91ae073aaaa5e1467c05aae",
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
                  message: 'relay only supports `eth_sendRawTransaction`',
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
                  message: 'relay only supports `0x77` transactions',
                }),
              },
              { request },
            ),
          )

        const transaction = parseTransaction(serialized)

        const serializedTransaction =
          transaction.feePayerSignature === null
            ? await client.signTransaction({
                ...transaction,
                feePayer: client.account,
              })
            : serialized
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
      transport: withRelay(http(), http(url.toString())),
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
          "r": "0x189efff6fd7b2bbda6aa74f29a0de0068b09bf20836d47b1d5d1918e06cdabb4",
          "s": "0x227ef79016c22db8070d62760c907f3f0cd6d5b7dbe40a74c21af0906d4c3605",
          "v": 27n,
          "yParity": 0,
        },
        "feeToken": null,
        "from": "0x740474977e01d056f04a314b5537e4dd88f35952",
        "gas": 22563n,
        "gasPrice": 44n,
        "hash": "0xe20b108a41cccbd03162184ca67a7dbb5d77cc8119a89a7ba589ffbe478e300d",
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
