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
import { afterAll, beforeAll, describe, expect, test } from 'vitest'
import { accounts, tempoTest } from '../../test/viem/config.js'
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
          "hash": "0xc13fb04a76de10922f4f25ca13dfe39d86bc476adf4aee55e7e39397eb8bd85e",
          "maxFeePerBlobGas": undefined,
          "maxFeePerGas": 52n,
          "maxPriorityFeePerGas": 0n,
          "nonce": 0,
          "nonceKey": 0n,
          "signature": {
            "signature": {
              "r": 31815582443541521272783297971589616696210133160704101890736710249069613818007n,
              "s": 42889064821323118918916337932499463472889432737698909385691881416313919667760n,
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
          "hash": "0x8c6481afd7534594e5f0f2f1cfd44044704377c9a0043e09dffd472c7e525ed2",
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
              "r": 99082336687458947816222089346176911086084347199257100867216035225739664722266n,
              "s": 56481476046517336162149243158491184153176430212286822526492956792269355616999n,
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
          "hash": "0x98851d89ad3233eb1b2670a29b4d4c4ff4b41cb81ea27a9a5939028b3b92e842",
          "maxFeePerBlobGas": undefined,
          "maxFeePerGas": 52n,
          "maxPriorityFeePerGas": 0n,
          "nonce": 0,
          "nonceKey": 0n,
          "signature": {
            "metadata": {
              "authenticatorData": "0x49960de5880e8c687434170f6476605b8fe4aeb9a28632c7995cf3ba831d97630500000000",
              "clientDataJSON": "{"type":"webauthn.get","challenge":"kV4eFkbidnUXXsKSK8XGIC8h6cPlBTpxvWqqC42T3-U","origin":"http://localhost","crossOrigin":false}",
            },
            "publicKey": {
              "prefix": 4,
              "x": 76851314197341596384765982852901663495246887984601955818013524729577854391357n,
              "y": 28479403900638612718017087999484027026245572142646745985103165612268853186552n,
            },
            "signature": {
              "r": 20416766519544121444203655252487360580185467844303323055232736364207624936747n,
              "s": 44899519836733448546611022891056204778818616781544240383432909031376945448890n,
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
          "hash": "0x5660ae5c08e959f8a7cfbb9fb3ea270c07f515900f046ebec20c184d9038ba3c",
          "maxFeePerBlobGas": undefined,
          "maxFeePerGas": 52n,
          "maxPriorityFeePerGas": 0n,
          "nonce": 0,
          "nonceKey": 0n,
          "signature": {
            "metadata": {
              "authenticatorData": "0x49960de5880e8c687434170f6476605b8fe4aeb9a28632c7995cf3ba831d97630500000000",
              "clientDataJSON": "{"type":"webauthn.get","challenge":"7l8Ijtx-29-cS5NUMoWrQT6IFmZGlNVlLn6UD5XX7Mw","origin":"http://localhost","crossOrigin":false}",
            },
            "publicKey": {
              "prefix": 4,
              "x": 76851314197341596384765982852901663495246887984601955818013524729577854391357n,
              "y": 28479403900638612718017087999484027026245572142646745985103165612268853186552n,
            },
            "signature": {
              "r": 111799608486239759292228800452847694183356321561277343867539739610355859024935n,
              "s": 35662503658353014113603717294445040317137089372625500990159024456444576296737n,
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
            "r": "0x7c41f44f256cc44bd746fbf9c53824c8f9ff9d912147d6497447761d3e8b4c56",
            "s": "0x4b54a1077f2c84e422f241bfba1c60ceaed953120ac95d4300c96c4b75a84e76",
            "v": 27n,
            "yParity": 0,
          },
          "feeToken": null,
          "from": "0x5f704c6c7075acd14ee36527f03b5b5dcb4a966f",
          "gas": 41340n,
          "gasPrice": 44n,
          "hash": "0x91fb3020327feb91ef19f1381cf39436b02e4826dcd744a8e9ba7e310301c772",
          "maxFeePerBlobGas": undefined,
          "maxFeePerGas": 52n,
          "maxPriorityFeePerGas": 0n,
          "nonce": 0,
          "nonceKey": 0n,
          "signature": {
            "metadata": {
              "authenticatorData": "0x49960de5880e8c687434170f6476605b8fe4aeb9a28632c7995cf3ba831d97630500000000",
              "clientDataJSON": "{"type":"webauthn.get","challenge":"oEtHb75yMUE0S2qcagGQxHnQVQIHk3Rgx7uUD81ODqM","origin":"http://localhost","crossOrigin":false}",
            },
            "publicKey": {
              "prefix": 4,
              "x": 89768657165983002447270155621964907577955735922001002175265262336201091268103n,
              "y": 21692506528696391747937034302216251793515398807520467579078748804389014172835n,
            },
            "signature": {
              "r": 53407118628889131677806537019325476211322829943729808104946468897412766841970n,
              "s": 4172224459986075332977905274980480550000842088057258805632903338751023967141n,
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
          "r": "0x3f2f275a94fceb60ac0aa083876a77b9f03dee6612ae04fbf76abb93f47d30f3",
          "s": "0x6ec65c307435b19de9d70587e39549475137acfdb4b1d7dda907ba22278c4135",
          "v": 28n,
          "yParity": 1,
        },
        "feeToken": null,
        "from": "0x740474977e01d056f04a314b5537e4dd88f35952",
        "gas": 24002n,
        "gasPrice": 44n,
        "hash": "0x6c01a1fb11574776ec6961cfef3f570d3b3f25d23a0d5322d4bfdc20b581a39c",
        "maxFeePerBlobGas": undefined,
        "maxFeePerGas": 52n,
        "maxPriorityFeePerGas": 0n,
        "nonce": 0,
        "nonceKey": 0n,
        "signature": {
          "signature": {
            "r": 79147419201519776258473563628213298170594129332036588382566801047897037627799n,
            "s": 42700589096929199071120567069366538664482064520851690695431801717488361123919n,
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
            "r": "0xccd668561b6f45581163de9fcaaefabca9d0a07067a882b822aa79ebb4ab75b9",
            "s": "0x3a9d24d3b8bd88c66f3775bdc95343ff867b0b678c8346a1f2623b8e90213814",
            "v": 27n,
            "yParity": 0,
          },
          "feeToken": null,
          "from": "0x740474977e01d056f04a314b5537e4dd88f35952",
          "gas": 25168n,
          "gasPrice": 44n,
          "hash": "0x68396bcb0a57a8c28f6020204248c8cd71b1c8e7c741f7fe50eda98be4a8f16b",
          "maxFeePerBlobGas": undefined,
          "maxFeePerGas": 52n,
          "maxPriorityFeePerGas": 0n,
          "nonce": 0,
          "nonceKey": 0n,
          "signature": {
            "signature": {
              "r": 40480015442793840529090368381917074368441780536175825308130578789249307476215n,
              "s": 23720921895520735542076395689541764286120681162528906124639416417043593032400n,
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
