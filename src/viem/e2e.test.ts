import { node } from '@elysiajs/node'
import { Elysia } from 'elysia'
import { RpcRequest, RpcResponse } from 'ox'
import { Transaction } from 'tempo.ts/viem'
import { createClient, http, publicActions, walletActions } from 'viem'
import { mnemonicToAccount, privateKeyToAccount } from 'viem/accounts'
import { afterAll, beforeAll, describe, expect, test } from 'vitest'
import { tempoTest } from '../../test/viem/config.js'
import * as actions from './Actions/index.js'
import { tempoActions } from './index.js'
import { withFeePayer } from './Transport.js'

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
      data: '0xdeadbeef',
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
        "authorizationList": undefined,
        "calls": [
          {
            "data": "0xdeadbeef",
            "to": "0x0000000000000000000000000000000000000000",
            "value": 0n,
          },
        ],
        "chainId": 1337,
        "data": undefined,
        "feePayerSignature": undefined,
        "feeToken": "0x20c0000000000000000000000000000000000001",
        "from": "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
        "gas": 53793n,
        "gasPrice": 44n,
        "hash": "0xab174e234e36ccb8bfa8c4917541b283c6bb71c0018b22aab44e2ac3d6472487",
        "maxFeePerBlobGas": undefined,
        "maxFeePerGas": 52n,
        "maxPriorityFeePerGas": 0n,
        "nonce": 0,
        "nonceKey": 0n,
        "signature": {
          "signature": {
            "r": 33687256364985057221987783909312106640857703993135866595362338429449340139426n,
            "s": 20898247015832861772943764590866653791079823975780950675135942025860554494301n,
            "yParity": 1,
          },
          "type": "secp256k1",
        },
        "to": null,
        "transactionIndex": 0,
        "type": "aa",
        "typeHex": "0x76",
        "v": undefined,
        "validAfter": null,
        "validBefore": null,
        "value": 0n,
        "yParity": undefined,
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
        "authorizationList": undefined,
        "blockHash": undefined,
        "blockNumber": undefined,
        "calls": [
          {
            "data": "0xb395b9ac00000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000000000000000000000000000000000000000012000000000000000000000000020c0000000000000000000000000000000000000000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb92266000000000000000000000000000000000000000000000000000000000000000c5465737420546f6b656e203300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005544553543300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000035553440000000000000000000000000000000000000000000000000000000000",
            "to": "0x20fc000000000000000000000000000000000000",
            "value": 0n,
          },
        ],
        "chainId": 1337,
        "data": undefined,
        "feePayerSignature": undefined,
        "feeToken": null,
        "from": "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
        "gas": 53793n,
        "gasPrice": 44n,
        "hash": "0xaac409f81cf7a716479d4a1b516a3514edbe9d6def569725de8a36715e30f4c5",
        "maxFeePerBlobGas": undefined,
        "maxFeePerGas": 52n,
        "maxPriorityFeePerGas": 0n,
        "nonce": 0,
        "nonceKey": 0n,
        "signature": {
          "signature": {
            "r": 75472279831718666729809418999288579618977673042864019617021223809045246862945n,
            "s": 33092981795205421900290930709795805463804729368014914886506847441614835773161n,
            "yParity": 0,
          },
          "type": "secp256k1",
        },
        "to": null,
        "transactionIndex": 0,
        "type": "aa",
        "typeHex": "0x76",
        "v": undefined,
        "validAfter": null,
        "validBefore": null,
        "value": 0n,
        "yParity": undefined,
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
        "authorizationList": undefined,
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
          "r": "0xc2406b257f0a6af102739a49ec871137037eb9ce0a26be112cda91b0b55f0866",
          "s": "0x713f4df2408d1e38d8d54447213e41acd68829e19712243e6dfd188e2fe07ca0",
          "v": 28n,
          "yParity": 1,
        },
        "feeToken": null,
        "from": "0x740474977e01d056f04a314b5537e4dd88f35952",
        "gas": 53793n,
        "gasPrice": 44n,
        "hash": "0x5b7ae2e6eb4d460522a62cf031ec37f9ce649f0fa1108071a7ba15c6d20f8f3b",
        "maxFeePerBlobGas": undefined,
        "maxFeePerGas": 52n,
        "maxPriorityFeePerGas": 0n,
        "nonce": 0,
        "nonceKey": 0n,
        "signature": {
          "signature": {
            "r": 78092362620450313170407859447796714674816655259251697170830907867162787398844n,
            "s": 8477378266727504882091645495297339736341469566116127798403581541349939397793n,
            "yParity": 0,
          },
          "type": "secp256k1",
        },
        "to": null,
        "transactionIndex": 0,
        "type": "aa",
        "typeHex": "0x76",
        "v": undefined,
        "validAfter": null,
        "validBefore": null,
        "value": 0n,
        "yParity": undefined,
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
    })
    let transaction = await client.signTransaction(request)

    transaction = await client.signTransaction({
      ...Transaction.deserialize(transaction),
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
        "authorizationList": undefined,
        "calls": [
          {
            "data": "0xdeadbeef",
            "to": "0xcafebabecafebabecafebabecafebabecafebabe",
            "value": 0n,
          },
        ],
        "chainId": 1337,
        "data": undefined,
        "feePayer": "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
        "feePayerSignature": {
          "r": "0xd2174d7e41dec16cea89d13e8411e6e69cc9d7a1711861eba587bd02d1ba49f6",
          "s": "0x30410097984493bdb80c6cb0cbc48055c9f570d161bdb8e9c23b8da71aa4769c",
          "v": 27n,
          "yParity": 0,
        },
        "feeToken": null,
        "from": "0x740474977e01d056f04a314b5537e4dd88f35952",
        "gas": 53793n,
        "gasPrice": 44n,
        "hash": "0xc54c8ffa49ca69692cadbba5ac6e0f888c7fad53b59f6258f3fde027775832c9",
        "maxFeePerBlobGas": undefined,
        "maxFeePerGas": 52n,
        "maxPriorityFeePerGas": 0n,
        "nonce": 0,
        "nonceKey": 0n,
        "signature": {
          "signature": {
            "r": 44677545391995483967867222268488221760813651834887327154544748280403243454311n,
            "s": 26359569188080842387556837532021842726007422277265560117459876153645612552527n,
            "yParity": 1,
          },
          "type": "secp256k1",
        },
        "to": null,
        "transactionIndex": 0,
        "type": "aa",
        "typeHex": "0x76",
        "v": undefined,
        "validAfter": null,
        "validBefore": null,
        "value": 0n,
        "yParity": undefined,
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

        const serialized = request.params?.[0] as `0x76${string}`
        if (!serialized.startsWith('0x76'))
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

        const transaction = Transaction.deserialize(serialized)
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
        "authorizationList": undefined,
        "calls": [
          {
            "data": "0xe789744400000000000000000000000020c0000000000000000000000000000000000001",
            "to": "0xfeec000000000000000000000000000000000000",
            "value": 0n,
          },
        ],
        "chainId": 1337,
        "data": undefined,
        "feePayer": "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
        "feePayerSignature": {
          "r": "0x6485c1333cb3bef00a8742d92fe5e8921f10d68506de7ab6bd54049d8ac9d345",
          "s": "0x552550b209d538830a2863731a2c3382a671bc40cfa69a01d1d616d3df63f43c",
          "v": 28n,
          "yParity": 1,
        },
        "feeToken": null,
        "from": "0x740474977e01d056f04a314b5537e4dd88f35952",
        "gas": 53793n,
        "gasPrice": 44n,
        "hash": "0xcb8f0e58ddb27f9fb3cbf200ec3023dffd43ced39c2e187c7907373082707420",
        "maxFeePerBlobGas": undefined,
        "maxFeePerGas": 52n,
        "maxPriorityFeePerGas": 0n,
        "nonce": 0,
        "nonceKey": 0n,
        "signature": {
          "signature": {
            "r": 58099370446734310330089633205075850139248168609383772256670067872736796317902n,
            "s": 40363612152801210185555264529559625661542041105068748708016255256620242651218n,
            "yParity": 1,
          },
          "type": "secp256k1",
        },
        "to": null,
        "transactionIndex": 0,
        "type": "aa",
        "typeHex": "0x76",
        "v": undefined,
        "validAfter": null,
        "validBefore": null,
        "value": 0n,
        "yParity": undefined,
      }
    `)
  })
})
