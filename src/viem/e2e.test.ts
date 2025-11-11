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
import {
  accounts,
  addresses,
  rpcUrl,
  tempoTest,
} from '../../test/viem/config.js'
import * as actions from './Actions/index.js'
import { tempoActions } from './index.js'
import { withFeePayer } from './Transport.js'

const client = createClient({
  chain: tempoTest({ feeToken: 1n }),
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
          "gasPrice": 10000000000n,
          "hash": "0x19ffdd8817d0180edc18be1ab5001445eaf267713e8d5f9e87e9b481413aca46",
          "maxFeePerBlobGas": undefined,
          "maxFeePerGas": 12000000000n,
          "maxPriorityFeePerGas": 0n,
          "nonce": 0,
          "nonceKey": 0n,
          "signature": {
            "signature": {
              "r": 18480044007397695090640579354047056183881606998783899463314972543335313635471n,
              "s": 7944214793912353709460484452936700808754473617494909879093391150696529863949n,
              "yParity": 1,
            },
            "type": "secp256k1",
          },
          "to": null,
          "transactionIndex": 1,
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
          "feeToken": "0x20c0000000000000000000000000000000000001",
          "from": "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
          "gas": 217317n,
          "gasPrice": 10000000000n,
          "hash": "0x5644cb4aca7b42c7f4d28c324b9cbc4d0ba4ff3aeddbe41fa418a5966923ab36",
          "maxFeePerBlobGas": undefined,
          "maxFeePerGas": 12000000000n,
          "maxPriorityFeePerGas": 0n,
          "nonce": 1,
          "nonceKey": 0n,
          "signature": {
            "signature": {
              "r": 1770799250379385769866461071353582741695856909786638355195145760341199788761n,
              "s": 52417275998342468381261131517961079083566057345688940928298921493890348732163n,
              "yParity": 1,
            },
            "type": "secp256k1",
          },
          "to": null,
          "transactionIndex": 1,
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
            "r": "0x8f719d9463938d85897ee74b518c4121995791c59873199e2bbc1d9d69a458b6",
            "s": "0x45c622bec0e381c5a06cfe7c5397cace1f7972137cefd1eba87174d7936a689c",
            "v": 27n,
            "yParity": 0,
          },
          "feeToken": null,
          "from": "0x740474977e01d056f04a314b5537e4dd88f35952",
          "gas": 23938n,
          "gasPrice": 10000000000n,
          "hash": "0x5aae48907ceccf3331f634bf9a76fe51f52576000e4becac929ed04d953fb0bb",
          "maxFeePerBlobGas": undefined,
          "maxFeePerGas": 12000000000n,
          "maxPriorityFeePerGas": 0n,
          "nonce": 0,
          "nonceKey": 0n,
          "signature": {
            "signature": {
              "r": 65079212976636076484448674374308068589367423744201870901549594095730781246312n,
              "s": 36138663572355181246084885182221172668063229180861599797673217267233822764445n,
              "yParity": 1,
            },
            "type": "secp256k1",
          },
          "to": null,
          "transactionIndex": 1,
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
        token: addresses.alphaUsd,
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
          "gasPrice": 10000000000n,
          "hash": "0x13ed96d72f7b21a19f30b734575004fb34cd0694b54d6833cc88e3de37d61d58",
          "maxFeePerBlobGas": undefined,
          "maxFeePerGas": 12000000000n,
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
              "r": 82730263136973498533190232493673429238005086892575761509437404111798066703019n,
              "s": 44946766134305303588824367771503538281500341815262656891619888686974098389980n,
            },
            "type": "p256",
          },
          "to": null,
          "transactionIndex": 1,
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
        token: addresses.alphaUsd,
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
          "gasPrice": 10000000000n,
          "hash": "0x47d30679625b66e09219f73c11e657a8950259e814ec9bef0a8054bc418ce138",
          "maxFeePerBlobGas": undefined,
          "maxFeePerGas": 12000000000n,
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
              "r": 113341784972223677657638155264375724813412569467929323654477865838324981972769n,
              "s": 42271961989228659763384216377289107353157423528268870961696295632380366334643n,
            },
            "type": "p256",
          },
          "to": null,
          "transactionIndex": 1,
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
            "r": "0x9d9e74278c306658fff5cca2a736f07c475d3dbe4b931ba73be8543d522b5430",
            "s": "0x2224242aaf6fa17b8f2266bea1ad501837c2c2ad13e0d96b9ed29ecb60ba1ac4",
            "v": 27n,
            "yParity": 0,
          },
          "feeToken": null,
          "from": "0x5f704c6c7075acd14ee36527f03b5b5dcb4a966f",
          "gas": 28947n,
          "gasPrice": 10000000000n,
          "hash": "0x77ce7f3b60540465d681b360293aaafca496c0a2ff2a4f5f146f144206a487dd",
          "maxFeePerBlobGas": undefined,
          "maxFeePerGas": 12000000000n,
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
              "r": 6861653902973636215987311933940928353425544366774814432483697786223275705586n,
              "s": 7277254520198161524871116736077233939785567558470334763663181456500888822079n,
            },
            "type": "p256",
          },
          "to": null,
          "transactionIndex": 1,
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
        token: addresses.alphaUsd,
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
          "gasPrice": 10000000000n,
          "hash": undefined,
          "maxFeePerBlobGas": undefined,
          "maxFeePerGas": 12000000000n,
          "maxPriorityFeePerGas": 0n,
          "nonce": 0,
          "nonceKey": 0n,
          "signature": undefined,
          "to": null,
          "transactionIndex": 1,
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
        token: addresses.alphaUsd,
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
        token: addresses.alphaUsd,
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
          "gasPrice": 10000000000n,
          "hash": "0x1b56e02e48a5c39478bcc7f912108892a8fa0302747c6928260fc89cd8729499",
          "maxFeePerBlobGas": undefined,
          "maxFeePerGas": 12000000000n,
          "maxPriorityFeePerGas": 0n,
          "nonce": 2,
          "nonceKey": 0n,
          "signature": {
            "metadata": {
              "authenticatorData": "0x49960de5880e8c687434170f6476605b8fe4aeb9a28632c7995cf3ba831d97630500000000",
              "clientDataJSON": "{"type":"webauthn.get","challenge":"YHxXuO3IIuui0Kz1A5bvEMnEwcV1jXHGgH4s_DEFq0Q","origin":"http://localhost","crossOrigin":false}",
            },
            "publicKey": {
              "prefix": 4,
              "x": 76851314197341596384765982852901663495246887984601955818013524729577854391357n,
              "y": 28479403900638612718017087999484027026245572142646745985103165612268853186552n,
            },
            "signature": {
              "r": 20513840452271821919896541370744222233657684228117041709895363014729132314467n,
              "s": 27363596257739130609932989541270702074673583176160656328016769892248487926140n,
            },
            "type": "webAuthn",
          },
          "to": null,
          "transactionIndex": 1,
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
        token: addresses.alphaUsd,
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
          "gasPrice": 10000000000n,
          "hash": "0x6520a97076d29b5e1bc76cb4dcd813e5b2a1bdbf1bba622e542bab3de9ea4a9f",
          "maxFeePerBlobGas": undefined,
          "maxFeePerGas": 12000000000n,
          "maxPriorityFeePerGas": 0n,
          "nonce": 3,
          "nonceKey": 0n,
          "signature": {
            "metadata": {
              "authenticatorData": "0x49960de5880e8c687434170f6476605b8fe4aeb9a28632c7995cf3ba831d97630500000000",
              "clientDataJSON": "{"type":"webauthn.get","challenge":"PqvaeGCzQHEM5f8UU4LbjCY97K8kfxlwFl4VpOfQy9U","origin":"http://localhost","crossOrigin":false}",
            },
            "publicKey": {
              "prefix": 4,
              "x": 76851314197341596384765982852901663495246887984601955818013524729577854391357n,
              "y": 28479403900638612718017087999484027026245572142646745985103165612268853186552n,
            },
            "signature": {
              "r": 90764526189385409482244930589827202930214636605680311984211069314044601874317n,
              "s": 54909273314024796243497246034814125113763800884613983294394271661966971076442n,
            },
            "type": "webAuthn",
          },
          "to": null,
          "transactionIndex": 1,
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
            "r": "0x90b71f46a775d5ca06725fcef4fe4763b4dce34bb72cde30a527ec26407baa84",
            "s": "0x398d0192f02d503b5463b1f886790eee882f2329e7af44b8106f27930735041d",
            "v": 28n,
            "yParity": 1,
          },
          "feeToken": null,
          "from": "0x5f704c6c7075acd14ee36527f03b5b5dcb4a966f",
          "gas": 41340n,
          "gasPrice": 10000000000n,
          "hash": "0x6f6801526c00fba8e107e5064758bd20a978f3952b144f6c52bab1abfc913143",
          "maxFeePerBlobGas": undefined,
          "maxFeePerGas": 12000000000n,
          "maxPriorityFeePerGas": 0n,
          "nonce": 1,
          "nonceKey": 0n,
          "signature": {
            "metadata": {
              "authenticatorData": "0x49960de5880e8c687434170f6476605b8fe4aeb9a28632c7995cf3ba831d97630500000000",
              "clientDataJSON": "{"type":"webauthn.get","challenge":"dVrVJFewcT_ifvpphKoheG6VSAQJ_74h6g3O32Rri2Q","origin":"http://localhost","crossOrigin":false}",
            },
            "publicKey": {
              "prefix": 4,
              "x": 89768657165983002447270155621964907577955735922001002175265262336201091268103n,
              "y": 21692506528696391747937034302216251793515398807520467579078748804389014172835n,
            },
            "signature": {
              "r": 72341690970159629319932745028286754044171557161564831284038819357806396549916n,
              "s": 47900412910547062549030763809045404303050255516583713899170528571925897239021n,
            },
            "type": "webAuthn",
          },
          "to": null,
          "transactionIndex": 1,
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
          "r": "0x669793cc2483931ffe3141aab062c7f69d3d16d15003c1192ca944b019ef445a",
          "s": "0x037cce00c3e94063ef98c4a55e9b11cdfc826ddae125d42cf679a6fcd1c8fef9",
          "v": 28n,
          "yParity": 1,
        },
        "feeToken": null,
        "from": "0x740474977e01d056f04a314b5537e4dd88f35952",
        "gas": 24002n,
        "gasPrice": 10000000000n,
        "hash": "0xb0abd89951c7d053af43c7684859a604b381680dc8521e41e57a2412cef13211",
        "maxFeePerBlobGas": undefined,
        "maxFeePerGas": 12000000000n,
        "maxPriorityFeePerGas": 0n,
        "nonce": 1,
        "nonceKey": 0n,
        "signature": {
          "signature": {
            "r": 67093125285953111322286487053649634901104592648978739500209237696329559594663n,
            "s": 23307791115004510736003345595881666676393686556128238040992902553893261582309n,
            "yParity": 0,
          },
          "type": "secp256k1",
        },
        "to": null,
        "transactionIndex": 1,
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
    chain: tempoTest({ feeToken: 1n }),
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
          chain: tempoTest({ feeToken: 1n }),
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
            "r": "0x57f6f6777f1689f87c333d1fa37207cf668b2c2d7321dcd5c63a2e6a7108077e",
            "s": "0x3c4270f67d8add0b5e7a9de6fee2b915cd754e1c0495ee88a1b78fd7568e6619",
            "v": 28n,
            "yParity": 1,
          },
          "feeToken": null,
          "from": "0x740474977e01d056f04a314b5537e4dd88f35952",
          "gas": 47825n,
          "gasPrice": 10000000000n,
          "hash": "0xd8429515914095d1093e6cd0cace8a06890ed5a2e4e3c775f3196ec78b4fa75d",
          "maxFeePerBlobGas": undefined,
          "maxFeePerGas": 12000000000n,
          "maxPriorityFeePerGas": 0n,
          "nonce": 2,
          "nonceKey": 0n,
          "signature": {
            "signature": {
              "r": 3978685029830144709654747044848526179202245954092725489802520292215589805538n,
              "s": 13481864494883849326291583961518021266257348574613329487348338733748737047938n,
              "yParity": 1,
            },
            "type": "secp256k1",
          },
          "to": null,
          "transactionIndex": 1,
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
            "r": "0x44507c3e9e4df1dff5f54ca012c69b2556e5395d9166b3b4594181e4e656a1cc",
            "s": "0x5ba80c21e194089173ffaed7c12a627f611d5fba846c84e2f6f83d55353f01d2",
            "v": 28n,
            "yParity": 1,
          },
          "feeToken": null,
          "from": "0x5f704c6c7075acd14ee36527f03b5b5dcb4a966f",
          "gas": 53231n,
          "gasPrice": 10000000000n,
          "hash": "0xb6848050598c30b26855673a029127a5532885dd44719894f0ac1c6ce380cffe",
          "maxFeePerBlobGas": undefined,
          "maxFeePerGas": 12000000000n,
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
              "r": 50668837405839025212455471714452555085562104168132337639876146018573466159747n,
              "s": 27497318506208669156329628613746311078142570431871623594260715714766657455474n,
            },
            "type": "p256",
          },
          "to": null,
          "transactionIndex": 1,
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
            "r": "0xc4446d8fe8fa3341d1f004cf5d54fd30ce3079909d26d8a2878ba95b7b9eec2d",
            "s": "0x3dbe6bcd56aafcff58b0faad331ac8339389cad60b42e82cdccd23f67e1f82c8",
            "v": 27n,
            "yParity": 0,
          },
          "feeToken": null,
          "from": "0x5f704c6c7075acd14ee36527f03b5b5dcb4a966f",
          "gas": 65648n,
          "gasPrice": 10000000000n,
          "hash": "0x279ae834209d6df5bded3c96bf5c74671cb34ef7b041b262cab97085d471f6f4",
          "maxFeePerBlobGas": undefined,
          "maxFeePerGas": 12000000000n,
          "maxPriorityFeePerGas": 0n,
          "nonce": 0,
          "nonceKey": 0n,
          "signature": {
            "metadata": {
              "authenticatorData": "0x49960de5880e8c687434170f6476605b8fe4aeb9a28632c7995cf3ba831d97630500000000",
              "clientDataJSON": "{"type":"webauthn.get","challenge":"v8tl8bzz9Csc1GJFeUfNTnjOLM03xPTSseTVmPjPgGU","origin":"http://localhost","crossOrigin":false}",
            },
            "publicKey": {
              "prefix": 4,
              "x": 89768657165983002447270155621964907577955735922001002175265262336201091268103n,
              "y": 21692506528696391747937034302216251793515398807520467579078748804389014172835n,
            },
            "signature": {
              "r": 58941397289082666235265603710597281523077712128054003324346038713355012809744n,
              "s": 40774536608463041714947524596466110685374802167796811824221384869265764799570n,
            },
            "type": "webAuthn",
          },
          "to": null,
          "transactionIndex": 1,
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
