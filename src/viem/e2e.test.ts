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
import { privateKeyToAccount } from 'viem/accounts'
import { afterAll, afterEach, beforeAll, describe, expect, test } from 'vitest'
import { accounts, rpcUrl, tempoTest } from '../../test/viem/config.js'
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
      const account = accounts[0]

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
          "aaAuthorizationList": [],
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
          "gas": 24002n,
          "gasPrice": 44n,
          "hash": "0x5145ca4e432606042d45011e42c0949257c4744f5a47b26f6c7ab219003f3d0d",
          "maxFeePerBlobGas": undefined,
          "maxFeePerGas": 52n,
          "maxPriorityFeePerGas": 0n,
          "nonce": 0,
          "nonceKey": 0n,
          "signature": {
            "signature": {
              "r": 114569590339485881057157448301976069173827649859546643842953129367655493460390n,
              "s": 10888466066949804519649133591992104541018483794285302956584000392079429879592n,
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
      const hash = await client.sendTransaction({
        account: accounts[0],
        calls: [
          actions.token.create.call({
            admin: accounts[0].address,
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
          "aaAuthorizationList": [],
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
          "gas": 27004n,
          "gasPrice": 44n,
          "hash": "0x440c7ed7586bc5a9a9a8339ae9d174662399c08132cc3e0ea3d490bfa7d67c94",
          "maxFeePerBlobGas": undefined,
          "maxFeePerGas": 52n,
          "maxPriorityFeePerGas": 0n,
          "nonce": 1,
          "nonceKey": 0n,
          "signature": {
            "signature": {
              "r": 34079586225678081993349612991213675540894534383460164725159196016718922586191n,
              "s": 20498822090654151669411489919923303940277044078776117601166179118868759637578n,
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
      const feePayer = accounts[0]

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
          "aaAuthorizationList": [],
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
            "r": "0x4f669d79e4eb109e95c5973ce4a196d81d4f227771da7b828c858e370dc0bd2f",
            "s": "0x4a6c154f4156fece978df96a274d1d984a8a5c77cd9fe9b03e036812c7ef1bb8",
            "v": 28n,
            "yParity": 1,
          },
          "feeToken": null,
          "from": "0x740474977e01d056f04a314b5537e4dd88f35952",
          "gas": 23938n,
          "gasPrice": 44n,
          "hash": "0x5f201fbbc43ae16a17c9fadb1b3d84e1c0fea5070641fd48f9c4657f2a474ad5",
          "maxFeePerBlobGas": undefined,
          "maxFeePerGas": 52n,
          "maxPriorityFeePerGas": 0n,
          "nonce": 0,
          "nonceKey": 0n,
          "signature": {
            "signature": {
              "r": 10738767973229692476563601602923432274623573073704148212963578795929803222593n,
              "s": 6548613692025312121005945201027208864879900350274222348613036224503957926475n,
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
        '0x6a3086fb3f2f95a3f36ef5387d18151ff51dc98a1e0eb987b159ba196beb0c99',
      )

      // fund account
      await client.token.transferSync({
        account: accounts[0],
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
          "aaAuthorizationList": [],
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
          "gas": 29012n,
          "gasPrice": 44n,
          "hash": "0xa236f118f11109448ebb96ab9d28086811a3417c86c80d6c8945bf3825b32ac0",
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
              "r": 31721898826242571050379588898658329605993237367497830661094653918437466649653n,
              "s": 160545329378246647728403806377682526905553367105241477011061544081356868980n,
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
        account: accounts[0],
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
          "aaAuthorizationList": [],
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
          "hash": "0x7f7f5bc29fc4ae82678e427d2b078abd49d1b5c2204541a4d084d38c0d402c4a",
          "maxFeePerBlobGas": undefined,
          "maxFeePerGas": 52n,
          "maxPriorityFeePerGas": 0n,
          "nonce": 1,
          "nonceKey": 0n,
          "signature": {
            "prehash": undefined,
            "publicKey": {
              "prefix": 4,
              "x": 76851314197341596384765982852901663495246887984601955818013524729577854391357n,
              "y": 28479403900638612718017087999484027026245572142646745985103165612268853186552n,
            },
            "signature": {
              "r": 25179063734587962352961198227527205604561212584972854705446453308780961109073n,
              "s": 18430120490437089334861356754585334793932266818585130689224034618819372680474n,
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
      const feePayer = accounts[0]

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
          "aaAuthorizationList": [],
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
            "r": "0x25a65e1d7499f9a7d0a137c645c044ba9795c407eb5b757f979cf0438a22befd",
            "s": "0x0392476d3df548d3be722fa37bbaa513bef356b15624e19bf24aecf2d424eaee",
            "v": 28n,
            "yParity": 1,
          },
          "feeToken": null,
          "from": "0x5f704c6c7075acd14ee36527f03b5b5dcb4a966f",
          "gas": 28947n,
          "gasPrice": 44n,
          "hash": "0x0acb44a81661ae81be37933d0a08fa292357fd4fbf6f20113b4197454199d814",
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
              "r": 77620000170832477745386540847457222302587218994974618310578890521588368308875n,
              "s": 30165372824627663766661712933744575757758638537471093388128596202865329312474n,
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
        account: accounts[0],
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
          "aaAuthorizationList": [],
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
          "gas": 29012n,
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
        account: accounts[0],
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
      const feePayer = accounts[0]

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
        account: accounts[0],
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
          "aaAuthorizationList": [],
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
          "gas": 41404n,
          "gasPrice": 44n,
          "hash": "0x03ae36142ab9499f46460b53001018fefbc5bf491a82a2168baa5e6a4882fc55",
          "maxFeePerBlobGas": undefined,
          "maxFeePerGas": 52n,
          "maxPriorityFeePerGas": 0n,
          "nonce": 2,
          "nonceKey": 0n,
          "signature": {
            "metadata": {
              "authenticatorData": "0x49960de5880e8c687434170f6476605b8fe4aeb9a28632c7995cf3ba831d97630500000000",
              "clientDataJSON": "{"type":"webauthn.get","challenge":"vCdQlEkDox2BZDsRbqTXSyTGYOuXr-n-6AQtYq0jhr8","origin":"http://localhost","crossOrigin":false}",
            },
            "publicKey": {
              "prefix": 4,
              "x": 76851314197341596384765982852901663495246887984601955818013524729577854391357n,
              "y": 28479403900638612718017087999484027026245572142646745985103165612268853186552n,
            },
            "signature": {
              "r": 76644942445998783767357871570076484780308698220926309345859709562487882388352n,
              "s": 14106135538450514858553897700741479086729759745582125828674182288111168793148n,
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
        account: accounts[0],
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
          "aaAuthorizationList": [],
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
          "hash": "0xab734faa1c7b8678ee7d66fbafeca0c435e26d353fdd2040aead9dc271f964a1",
          "maxFeePerBlobGas": undefined,
          "maxFeePerGas": 52n,
          "maxPriorityFeePerGas": 0n,
          "nonce": 3,
          "nonceKey": 0n,
          "signature": {
            "metadata": {
              "authenticatorData": "0x49960de5880e8c687434170f6476605b8fe4aeb9a28632c7995cf3ba831d97630500000000",
              "clientDataJSON": "{"type":"webauthn.get","challenge":"P6aVHHEfuh5HkqHh3eUajPzpvhk0m-zE3ZcJCWGoY70","origin":"http://localhost","crossOrigin":false}",
            },
            "publicKey": {
              "prefix": 4,
              "x": 76851314197341596384765982852901663495246887984601955818013524729577854391357n,
              "y": 28479403900638612718017087999484027026245572142646745985103165612268853186552n,
            },
            "signature": {
              "r": 93988210004850287617311911789579060836104927921164400200191678169894927418324n,
              "s": 15676483694519198373255690954766875203133508742969464397089702475123019111995n,
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
      const feePayer = accounts[0]

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
          "aaAuthorizationList": [],
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
            "r": "0x7f98b968793b34e05dfccb921abd870c922b3ea6179e166329290a6432e38297",
            "s": "0x7f007ccaee13b6af240a79d66fd19619f36c2ebca3913412c6441e1a2c2f4ca0",
            "v": 27n,
            "yParity": 0,
          },
          "feeToken": null,
          "from": "0x5f704c6c7075acd14ee36527f03b5b5dcb4a966f",
          "gas": 41340n,
          "gasPrice": 44n,
          "hash": "0x89b074bf102e74ceec58b5c5d943949a07961ff07095d499f02fa5c8a607903e",
          "maxFeePerBlobGas": undefined,
          "maxFeePerGas": 52n,
          "maxPriorityFeePerGas": 0n,
          "nonce": 1,
          "nonceKey": 0n,
          "signature": {
            "metadata": {
              "authenticatorData": "0x49960de5880e8c687434170f6476605b8fe4aeb9a28632c7995cf3ba831d97630500000000",
              "clientDataJSON": "{"type":"webauthn.get","challenge":"oQy4q7hgD4UIBveoSiFCIx_1N4FEPbk92Wi2L_HkJBg","origin":"http://localhost","crossOrigin":false}",
            },
            "publicKey": {
              "prefix": 4,
              "x": 89768657165983002447270155621964907577955735922001002175265262336201091268103n,
              "y": 21692506528696391747937034302216251793515398807520467579078748804389014172835n,
            },
            "signature": {
              "r": 68713172717031890628040400977875556742363541965191531685237092460705947160119n,
              "s": 53812955254767839416173680495338654503476867128861961948316617157881207106694n,
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
    const feePayer = accounts[0]

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
        "aaAuthorizationList": [],
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
          "r": "0x80beaa5381876ac1507c461b149b9fd043606271880b994903e18d939d90dd93",
          "s": "0x22b31493d0a1e56baa3b8ab2d73683e1b3ef94e3d012e0986ae107d2b612cc2f",
          "v": 27n,
          "yParity": 0,
        },
        "feeToken": null,
        "from": "0x740474977e01d056f04a314b5537e4dd88f35952",
        "gas": 24002n,
        "gasPrice": 44n,
        "hash": "0xc57a1502736db19fb408d1a480ddac2daea531caf0bc38e4489b1237f19b9515",
        "maxFeePerBlobGas": undefined,
        "maxFeePerGas": 52n,
        "maxPriorityFeePerGas": 0n,
        "nonce": 1,
        "nonceKey": 0n,
        "signature": {
          "signature": {
            "r": 52735524792574190840520498982070728093123048440595094256905564344291800687253n,
            "s": 31495087581738078854148080741214063142857215274731560918923441723076153480664n,
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

  afterEach(async () => {
    await fetch(`${rpcUrl}/restart`)
  })

  beforeAll(async () => {
    server = Http.createServer(
      createRequestListener(async (r) => {
        const client = createClient({
          account: accounts[0],
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
          "aaAuthorizationList": [],
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
            "r": "0x1499c63a4a88953b9dad576e80c4bde6aeae27b96ddc9b30a688428b855aca33",
            "s": "0x41a9b02afb869b1bfe57ffe6f39fd5f4acece6665b540821595e46571306f60d",
            "v": 27n,
            "yParity": 0,
          },
          "feeToken": null,
          "from": "0x740474977e01d056f04a314b5537e4dd88f35952",
          "gas": 25168n,
          "gasPrice": 44n,
          "hash": "0x303cd89739021be95b36326c4139f92d92c851918569be2abfdd01f4f0e5269d",
          "maxFeePerBlobGas": undefined,
          "maxFeePerGas": 52n,
          "maxPriorityFeePerGas": 0n,
          "nonce": 2,
          "nonceKey": 0n,
          "signature": {
            "signature": {
              "r": 10482761088727015622330159979044783693664827056034612027872210332822539135903n,
              "s": 69640078814344139394110133611452099326228122043574125436812807797760497486n,
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
          "aaAuthorizationList": [],
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
            "r": "0x70713f51b9dec55a49cfcb0e6a51b0fbc8bcedc5abe401c36735c0582464e62a",
            "s": "0x2b2473cf4ca56bc601ad35842ae9ebb45d872e930951e8cae43005c785545203",
            "v": 28n,
            "yParity": 1,
          },
          "feeToken": null,
          "from": "0x5f704c6c7075acd14ee36527f03b5b5dcb4a966f",
          "gas": 30178n,
          "gasPrice": 44n,
          "hash": "0xb9fb618fd69b713b31df6514d8e122e3e879604167c9f12423f977709f1b724c",
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
              "r": 42422438366310826648416115054353880419900465847663120614767808484122037059186n,
              "s": 45366123578846541143179478198160272142799055255897501554379606601923971192238n,
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
          "aaAuthorizationList": [],
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
            "r": "0xfbd4eade2338bfdf4be2dcf5c98d2312185050f8c125887b3fc03e6550348fe9",
            "s": "0x18c477f9c7a62c82e2035804cbf834cf0f39eddfc22a3b12791663daf21c5854",
            "v": 28n,
            "yParity": 1,
          },
          "feeToken": null,
          "from": "0x5f704c6c7075acd14ee36527f03b5b5dcb4a966f",
          "gas": 42570n,
          "gasPrice": 44n,
          "hash": "0x9d07c841246b44914eae3ee8e28834ee693fd0411b87aaf292add9a00e4f0942",
          "maxFeePerBlobGas": undefined,
          "maxFeePerGas": 52n,
          "maxPriorityFeePerGas": 0n,
          "nonce": 0,
          "nonceKey": 0n,
          "signature": {
            "metadata": {
              "authenticatorData": "0x49960de5880e8c687434170f6476605b8fe4aeb9a28632c7995cf3ba831d97630500000000",
              "clientDataJSON": "{"type":"webauthn.get","challenge":"JgGEqtqpifIH5V4XCxzPrdoE7bOLpD5_B38POAnl5fE","origin":"http://localhost","crossOrigin":false}",
            },
            "publicKey": {
              "prefix": 4,
              "x": 89768657165983002447270155621964907577955735922001002175265262336201091268103n,
              "y": 21692506528696391747937034302216251793515398807520467579078748804389014172835n,
            },
            "signature": {
              "r": 90931755622428131951160032681856655514567348718184671175689783643924861978285n,
              "s": 1286286726996265388331039199746364742656514579781218448789622945516211724279n,
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
