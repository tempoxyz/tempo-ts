import * as Http from 'node:http'
import { createRequestListener } from '@remix-run/node-fetch-server'
import { RpcRequest, RpcResponse, WebCryptoP256 } from 'ox'
import { Account, Transaction } from 'tempo.ts/viem'
import {
  createClient,
  http,
  parseUnits,
  publicActions,
  walletActions,
} from 'viem'
import { mnemonicToAccount, privateKeyToAccount } from 'viem/accounts'
import { afterAll, beforeAll, describe, expect, test } from 'vitest'
import { tempoTest } from '../../test/viem/config.js'
import * as actions from './Actions/index.js'
import { tempoActions } from './index.js'
import { withFeePayer } from './Transport.js'

const client = createClient({
  chain: tempoTest,
  transport: http(),
})
  .extend(publicActions)
  .extend(walletActions)
  .extend(tempoActions())

describe('sendTransaction', () => {
  describe('secp256k1', () => {
    test('default', async () => {
      const account = mnemonicToAccount(
        'test test test test test test test test test test test junk',
      )

      const hash = await client.sendTransaction({
        account,
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
      const account = mnemonicToAccount(
        'test test test test test test test test test test test junk',
      )

      const hash = await client.sendTransaction({
        account,
        calls: [
          actions.token.create.call({
            admin: account.address,
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

      const hash = await client.sendTransaction({
        account,
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

  describe('p256', () => {
    test('default', async () => {
      const account = Account.fromP256(
        '0x6a3086fb3f2f95a3f36ef5387d18151ff51dc98a1e0eb987b159ba196beb0c99',
      )

      // fund account
      await client.token.transferSync({
        account: mnemonicToAccount(
          'test test test test test test test test test test test junk',
        ),
        to: account.address,
        amount: parseUnits('10000', 6),
      })

      const receipt = await client.sendTransactionSync({
        account,
        data: '0xdeadbeef',
        to: '0x0000000000000000000000000000000000000000',
      })

      const transaction = await client.getTransaction({
        hash: receipt.transactionHash,
      })
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
              "data": "0xdeadbeef",
              "to": "0x0000000000000000000000000000000000000000",
              "value": 0n,
            },
          ],
          "chainId": 1337,
          "data": undefined,
          "feePayerSignature": undefined,
          "feeToken": null,
          "from": "0xfc39755d501fa7b79164f74efb906e87ecde342c",
          "gas": 53793n,
          "gasPrice": 44n,
          "hash": "0xe22a98a2ae71ff530f5fbe48585b0a7ae6b19f51f6a2c71bb6f57c167daa8bfc",
          "maxFeePerBlobGas": undefined,
          "maxFeePerGas": 52n,
          "maxPriorityFeePerGas": 0n,
          "nonce": 0,
          "nonceKey": 0n,
          "signature": {
            "prehash": undefined,
            "publicKey": {
              "prefix": 4,
              "x": 76851314197341596384765982852901663495246887984601955818013524729577854391357n,
              "y": 28479403900638612718017087999484027026245572142646745985103165612268853186552n,
            },
            "signature": {
              "r": 14714372917327591601598276491733410897569953702684357477348033198155338666573n,
              "s": 13521259127679164703525587687616848774407032862684583519534505776264200996150n,
            },
            "type": "p256",
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
      const account = Account.fromP256(
        '0x6a3086fb3f2f95a3f36ef5387d18151ff51dc98a1e0eb987b159ba196beb0c99',
      )

      // fund account
      await client.token.transferSync({
        account: mnemonicToAccount(
          'test test test test test test test test test test test junk',
        ),
        to: account.address,
        amount: parseUnits('10000', 6),
      })

      const receipt = await client.sendTransactionSync({
        account,
        calls: [
          actions.token.create.call({
            admin: account.address,
            currency: 'USD',
            name: 'Test Token 4',
            symbol: 'TEST4',
          }),
        ],
        // TODO: remove once `eth_estimateGas` supports passing key type.
        gas: 100_000n,
      })

      const transaction = await client.getTransaction({
        hash: receipt.transactionHash,
      })
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
              "data": "0xb395b9ac00000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000000000000000000000000000000000000000012000000000000000000000000020c0000000000000000000000000000000000000000000000000000000000000fc39755d501fa7b79164f74efb906e87ecde342c000000000000000000000000000000000000000000000000000000000000000c5465737420546f6b656e203400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005544553543400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000035553440000000000000000000000000000000000000000000000000000000000",
              "to": "0x20fc000000000000000000000000000000000000",
              "value": 0n,
            },
          ],
          "chainId": 1337,
          "data": undefined,
          "feePayerSignature": undefined,
          "feeToken": null,
          "from": "0xfc39755d501fa7b79164f74efb906e87ecde342c",
          "gas": 100000n,
          "gasPrice": 44n,
          "hash": "0xf8768e41b2e3903331418a04a4a58410bb10429cccfbbb86f2e452d4efe6d589",
          "maxFeePerBlobGas": undefined,
          "maxFeePerGas": 52n,
          "maxPriorityFeePerGas": 0n,
          "nonce": 0,
          "nonceKey": 0n,
          "signature": {
            "prehash": undefined,
            "publicKey": {
              "prefix": 4,
              "x": 76851314197341596384765982852901663495246887984601955818013524729577854391357n,
              "y": 28479403900638612718017087999484027026245572142646745985103165612268853186552n,
            },
            "signature": {
              "r": 53364731098527989419763475605678399046105074479285149812357112337157332187844n,
              "s": 23306806104333151947228256480130451238991667625205445525437176255625071832987n,
            },
            "type": "p256",
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
      const account = Account.fromP256(
        // unfunded account with different key
        '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
      )
      const feePayer = mnemonicToAccount(
        'test test test test test test test test test test test junk',
      )

      const hash = await client.sendTransaction({
        account,
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
            "r": "0x1279890619994a0c93703cad7c18e70e7199f6dda02958f635b7b1590e3e6325",
            "s": "0x753bff56de181623d57eacf0b5a4d60018e29248fea5da39d7b0f05fd2a09366",
            "v": 27n,
            "yParity": 0,
          },
          "feeToken": null,
          "from": "0x5f704c6c7075acd14ee36527f03b5b5dcb4a966f",
          "gas": 53793n,
          "gasPrice": 44n,
          "hash": "0x3688033ba367517bfbc226e054abf55e9a6b7b962c25e6ddf2533a3bda724c76",
          "maxFeePerBlobGas": undefined,
          "maxFeePerGas": 52n,
          "maxPriorityFeePerGas": 0n,
          "nonce": 0,
          "nonceKey": 0n,
          "signature": {
            "prehash": undefined,
            "publicKey": {
              "prefix": 4,
              "x": 89768657165983002447270155621964907577955735922001002175265262336201091268103n,
              "y": 21692506528696391747937034302216251793515398807520467579078748804389014172835n,
            },
            "signature": {
              "r": 83318915916397998968987807464371332636949511189809180146183828809443362362772n,
              "s": 38400869444169992117243907578385773931018169962836793687278216723567446306822n,
            },
            "type": "p256",
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

  describe('webcrypto', () => {
    test('default', async () => {
      const keyPair = await WebCryptoP256.createKeyPair()
      const account = Account.fromWebCryptoP256(keyPair)

      // fund account
      await client.token.transferSync({
        account: mnemonicToAccount(
          'test test test test test test test test test test test junk',
        ),
        to: account.address,
        amount: parseUnits('10000', 6),
      })

      const receipt = await client.sendTransactionSync({
        account,
        data: '0xdeadbeef',
        to: '0x0000000000000000000000000000000000000000',
      })

      const transaction = await client.getTransaction({
        hash: receipt.transactionHash,
      })
      expect({
        ...transaction,
        blockHash: undefined,
        blockNumber: undefined,
        from: undefined,
        hash: undefined,
        signature: undefined,
      }).toMatchInlineSnapshot(`
        {
          "accessList": [],
          "authorizationList": undefined,
          "blockHash": undefined,
          "blockNumber": undefined,
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
          "feeToken": null,
          "from": undefined,
          "gas": 53793n,
          "gasPrice": 44n,
          "hash": undefined,
          "maxFeePerBlobGas": undefined,
          "maxFeePerGas": 52n,
          "maxPriorityFeePerGas": 0n,
          "nonce": 0,
          "nonceKey": 0n,
          "signature": undefined,
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
      const keyPair = await WebCryptoP256.createKeyPair()
      const account = Account.fromWebCryptoP256(keyPair)

      // fund account
      await client.token.transferSync({
        account: mnemonicToAccount(
          'test test test test test test test test test test test junk',
        ),
        to: account.address,
        amount: parseUnits('10000', 6),
      })

      const receipt = await client.sendTransactionSync({
        account,
        calls: [
          actions.token.create.call({
            admin: account.address,
            currency: 'USD',
            name: 'Test Token 5',
            symbol: 'TEST5',
          }),
        ],
        // TODO: remove once `eth_estimateGas` supports passing key type.
        gas: 100_000n,
      })

      const transaction = await client.getTransaction({
        hash: receipt.transactionHash,
      })
      expect(transaction).toBeDefined()
    })

    test('with feePayer', async () => {
      const keyPair = await WebCryptoP256.createKeyPair()
      const account = Account.fromWebCryptoP256(keyPair)
      const feePayer = mnemonicToAccount(
        'test test test test test test test test test test test junk',
      )

      const hash = await client.sendTransaction({
        account,
        feePayer,
        to: '0x0000000000000000000000000000000000000000',
      })
      await client.waitForTransactionReceipt({ hash })

      const transaction = await client.getTransaction({ hash })
      expect(transaction).toBeDefined()
    })
  })

  describe('webAuthn', () => {
    test('default', async () => {
      const account = Account.fromHeadlessWebAuthn(
        '0x6a3086fb3f2f95a3f36ef5387d18151ff51dc98a1e0eb987b159ba196beb0c99',
        {
          rpId: 'localhost',
          origin: 'http://localhost',
        },
      )

      // fund account
      await client.token.transferSync({
        account: mnemonicToAccount(
          'test test test test test test test test test test test junk',
        ),
        to: account.address,
        amount: parseUnits('10000', 6),
      })

      const receipt = await client.sendTransactionSync({
        account,
        data: '0xdeadbeef',
        to: '0x0000000000000000000000000000000000000000',
      })

      const transaction = await client.getTransaction({
        hash: receipt.transactionHash,
      })
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
              "data": "0xdeadbeef",
              "to": "0x0000000000000000000000000000000000000000",
              "value": 0n,
            },
          ],
          "chainId": 1337,
          "data": undefined,
          "feePayerSignature": undefined,
          "feeToken": null,
          "from": "0xfc39755d501fa7b79164f74efb906e87ecde342c",
          "gas": 53793n,
          "gasPrice": 44n,
          "hash": "0xdd9bb15b91ba6c901b2a4ca59de68d9c39d1e3522f480eea8ae98c9605f6f9dd",
          "maxFeePerBlobGas": undefined,
          "maxFeePerGas": 52n,
          "maxPriorityFeePerGas": 0n,
          "nonce": 0,
          "nonceKey": 0n,
          "signature": {
            "metadata": {
              "authenticatorData": "0x49960de5880e8c687434170f6476605b8fe4aeb9a28632c7995cf3ba831d97630500000000",
              "clientDataJSON": "{"type":"webauthn.get","challenge":"WBFsbhrj1GRdJRgQkiLdhh7n_mqdMqJoDcgupus1Mio","origin":"http://localhost","crossOrigin":false}",
            },
            "publicKey": {
              "prefix": 4,
              "x": 76851314197341596384765982852901663495246887984601955818013524729577854391357n,
              "y": 28479403900638612718017087999484027026245572142646745985103165612268853186552n,
            },
            "signature": {
              "r": 98535042472070793768049222297947035935276546275344013371154450586238335838829n,
              "s": 28482674305877057061149707111013827206638493339040718315532425015302586627433n,
            },
            "type": "webAuthn",
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
      const account = Account.fromHeadlessWebAuthn(
        '0x6a3086fb3f2f95a3f36ef5387d18151ff51dc98a1e0eb987b159ba196beb0c99',
        {
          rpId: 'localhost',
          origin: 'http://localhost',
        },
      )

      // fund account
      await client.token.transferSync({
        account: mnemonicToAccount(
          'test test test test test test test test test test test junk',
        ),
        to: account.address,
        amount: parseUnits('10000', 6),
      })

      const receipt = await client.sendTransactionSync({
        account,
        calls: [
          actions.token.create.call({
            admin: account.address,
            currency: 'USD',
            name: 'Test Token 6',
            symbol: 'TEST6',
          }),
        ],
        // TODO: remove once `eth_estimateGas` supports passing key type.
        gas: 100_000n,
      })

      const transaction = await client.getTransaction({
        hash: receipt.transactionHash,
      })
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
              "data": "0xb395b9ac00000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000000000000000000000000000000000000000012000000000000000000000000020c0000000000000000000000000000000000000000000000000000000000000fc39755d501fa7b79164f74efb906e87ecde342c000000000000000000000000000000000000000000000000000000000000000c5465737420546f6b656e203600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000005544553543600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000035553440000000000000000000000000000000000000000000000000000000000",
              "to": "0x20fc000000000000000000000000000000000000",
              "value": 0n,
            },
          ],
          "chainId": 1337,
          "data": undefined,
          "feePayerSignature": undefined,
          "feeToken": null,
          "from": "0xfc39755d501fa7b79164f74efb906e87ecde342c",
          "gas": 100000n,
          "gasPrice": 44n,
          "hash": "0x0d68050c61235575c43a3d657a8c6c1c56d105ca87c541253c93cfb6c1c1d589",
          "maxFeePerBlobGas": undefined,
          "maxFeePerGas": 52n,
          "maxPriorityFeePerGas": 0n,
          "nonce": 0,
          "nonceKey": 0n,
          "signature": {
            "metadata": {
              "authenticatorData": "0x49960de5880e8c687434170f6476605b8fe4aeb9a28632c7995cf3ba831d97630500000000",
              "clientDataJSON": "{"type":"webauthn.get","challenge":"07x0vq46tGplGdYH8rUwINX5KWcuU_aqQz-1cF2J19Y","origin":"http://localhost","crossOrigin":false}",
            },
            "publicKey": {
              "prefix": 4,
              "x": 76851314197341596384765982852901663495246887984601955818013524729577854391357n,
              "y": 28479403900638612718017087999484027026245572142646745985103165612268853186552n,
            },
            "signature": {
              "r": 31228843392936335544011408079891615142686428856465291514375818928902320362664n,
              "s": 57137826111625983281874127696881563517469508120559969108804187061015071862149n,
            },
            "type": "webAuthn",
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
      const account = Account.fromHeadlessWebAuthn(
        // unfunded account with different key
        '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
        {
          rpId: 'localhost',
          origin: 'http://localhost',
        },
      )
      const feePayer = mnemonicToAccount(
        'test test test test test test test test test test test junk',
      )

      const hash = await client.sendTransaction({
        account,
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
            "r": "0x1279890619994a0c93703cad7c18e70e7199f6dda02958f635b7b1590e3e6325",
            "s": "0x753bff56de181623d57eacf0b5a4d60018e29248fea5da39d7b0f05fd2a09366",
            "v": 27n,
            "yParity": 0,
          },
          "feeToken": null,
          "from": "0x5f704c6c7075acd14ee36527f03b5b5dcb4a966f",
          "gas": 53793n,
          "gasPrice": 44n,
          "hash": "0x78f2eb29b6df5939fb08bce72ce095e2f9d8e434b0de31e0e326a86c95ea37f1",
          "maxFeePerBlobGas": undefined,
          "maxFeePerGas": 52n,
          "maxPriorityFeePerGas": 0n,
          "nonce": 0,
          "nonceKey": 0n,
          "signature": {
            "metadata": {
              "authenticatorData": "0x49960de5880e8c687434170f6476605b8fe4aeb9a28632c7995cf3ba831d97630500000000",
              "clientDataJSON": "{"type":"webauthn.get","challenge":"3mnO65VGGgeG0h2uvebHmie8_fUKWLmDc1JuyZznWsI","origin":"http://localhost","crossOrigin":false}",
            },
            "publicKey": {
              "prefix": 4,
              "x": 89768657165983002447270155621964907577955735922001002175265262336201091268103n,
              "y": 21692506528696391747937034302216251793515398807520467579078748804389014172835n,
            },
            "signature": {
              "r": 112846566782393017271258954645729766620068616844283717313979753041566961815590n,
              "s": 21725699038061031426570358193350884649666476984308806139363974368785563712748n,
            },
            "type": "webAuthn",
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

    const request = await client.prepareTransactionRequest({
      account,
      data: '0xdeadbeef',
      feePayer: true,
      to: '0xcafebabecafebabecafebabecafebabecafebabe',
    })
    let transaction = await client.signTransaction(request)

    transaction = await client.signTransaction({
      ...Transaction.deserialize(transaction),
      account,
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
  const client = createClient({
    chain: tempoTest,
    transport: withFeePayer(http(), http('http://localhost:3000')),
  })
    .extend(tempoActions())
    .extend(walletActions)
    .extend(publicActions)
  let server: Http.Server

  beforeAll(async () => {
    server = Http.createServer(
      createRequestListener(async (r) => {
        const client = createClient({
          account: mnemonicToAccount(
            'test test test test test test test test test test test junk',
          ),
          chain: tempoTest,
          transport: http(),
        }).extend(walletActions)

        const request = RpcRequest.from(await r.json())

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
      }),
    ).listen(3000)
  })

  afterAll(() => {
    server.close()
    process.on('SIGINT', () => {
      server.close()
      process.exit(0)
    })
    process.on('SIGTERM', () => {
      server.close()
      process.exit(0)
    })
  })

  describe('secp256k1', () => {
    test('default', async () => {
      const account = privateKeyToAccount(
        // unfunded PK
        '0xecc3fe55647412647e5c6b657c496803b08ef956f927b7a821da298cfbdd9666',
      )

      const { receipt } = await client.fee.setUserTokenSync({
        account,
        feePayer: true,
        token: 1n,
      })

      const userToken = await client.fee.getUserToken({ account })
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

  describe('p256', () => {
    test('default', async () => {
      const account = Account.fromP256(
        '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
      )

      const { receipt } = await client.fee.setUserTokenSync({
        account,
        feePayer: true,
        token: 1n,
      })

      const userToken = await client.fee.getUserToken({ account })
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
            "r": "0x21c4263210be939068d5446e79064bfd9fe717793ae7e501bc254027b877878a",
            "s": "0x5da24437ca4372e85924a5304d9dceba1dddd5cf6bee4390d2e09799953ac26e",
            "v": 28n,
            "yParity": 1,
          },
          "feeToken": null,
          "from": "0x5f704c6c7075acd14ee36527f03b5b5dcb4a966f",
          "gas": 53793n,
          "gasPrice": 44n,
          "hash": "0xd8cc6653eda0120105b334fccfa10b1de8ee60c4bdcfaf1d29daf01abe3701eb",
          "maxFeePerBlobGas": undefined,
          "maxFeePerGas": 52n,
          "maxPriorityFeePerGas": 0n,
          "nonce": 0,
          "nonceKey": 0n,
          "signature": {
            "prehash": undefined,
            "publicKey": {
              "prefix": 4,
              "x": 89768657165983002447270155621964907577955735922001002175265262336201091268103n,
              "y": 21692506528696391747937034302216251793515398807520467579078748804389014172835n,
            },
            "signature": {
              "r": 109674469268188655053146536218220524765679810125391266430868133374005418528889n,
              "s": 5961642168345840557413483153920328666835638846175307738041601366193093375230n,
            },
            "type": "p256",
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

  describe('webcrypto', () => {
    test('default', async () => {
      const keyPair = await WebCryptoP256.createKeyPair()
      const account = Account.fromWebCryptoP256(keyPair)

      const { receipt } = await client.fee.setUserTokenSync({
        account,
        feePayer: true,
        token: 1n,
      })

      const userToken = await client.fee.getUserToken({ account })
      expect(userToken).toMatchInlineSnapshot(`
        {
          "address": "0x20C0000000000000000000000000000000000001",
          "id": 1n,
        }
      `)

      const transaction = await client.getTransaction({
        hash: receipt.transactionHash,
      })
      expect(transaction).toBeDefined()
    })
  })

  describe('webAuthn', () => {
    test('default', async () => {
      const account = Account.fromHeadlessWebAuthn(
        '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
        {
          rpId: 'localhost',
          origin: 'http://localhost',
        },
      )

      const { receipt } = await client.fee.setUserTokenSync({
        account,
        feePayer: true,
        token: 1n,
      })

      const userToken = await client.fee.getUserToken({ account })
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
            "r": "0x21c4263210be939068d5446e79064bfd9fe717793ae7e501bc254027b877878a",
            "s": "0x5da24437ca4372e85924a5304d9dceba1dddd5cf6bee4390d2e09799953ac26e",
            "v": 28n,
            "yParity": 1,
          },
          "feeToken": null,
          "from": "0x5f704c6c7075acd14ee36527f03b5b5dcb4a966f",
          "gas": 53793n,
          "gasPrice": 44n,
          "hash": "0xba07d40df5068358666a8099506f91034269055c9e248640f30e7858815d6bb0",
          "maxFeePerBlobGas": undefined,
          "maxFeePerGas": 52n,
          "maxPriorityFeePerGas": 0n,
          "nonce": 0,
          "nonceKey": 0n,
          "signature": {
            "metadata": {
              "authenticatorData": "0x49960de5880e8c687434170f6476605b8fe4aeb9a28632c7995cf3ba831d97630500000000",
              "clientDataJSON": "{"type":"webauthn.get","challenge":"_Nbq0IIMoN0HISwCzONA42lXGYvDG6VeT8uDrWnnDGw","origin":"http://localhost","crossOrigin":false}",
            },
            "publicKey": {
              "prefix": 4,
              "x": 89768657165983002447270155621964907577955735922001002175265262336201091268103n,
              "y": 21692506528696391747937034302216251793515398807520467579078748804389014172835n,
            },
            "signature": {
              "r": 21624530656473870029861123238649412100098336966699296895648863319462736859931n,
              "s": 38377773266106269201210479411426340227020753319094799435193981761129966251423n,
            },
            "type": "webAuthn",
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
})
