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
          "gas": 24002n,
          "gasPrice": 44n,
          "hash": "0x91c1c55e893015734d9173b991ad0dbad176656bcdd122b237ad8e66c8bb8d27",
          "maxFeePerBlobGas": undefined,
          "maxFeePerGas": 52n,
          "maxPriorityFeePerGas": 0n,
          "nonce": 0,
          "nonceKey": 0n,
          "signature": {
            "signature": {
              "r": 109138999611428423935638076183946123521306623193860567277616743266345498830820n,
              "s": 12860439641179187070338651426150505874828490137488252860826886918175099614794n,
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
          "gas": 27004n,
          "gasPrice": 44n,
          "hash": "0x6be8464d6994e21bb3ea51d4f28d4d1df1ea328e7321fdf1cd36525779d6adc3",
          "maxFeePerBlobGas": undefined,
          "maxFeePerGas": 52n,
          "maxPriorityFeePerGas": 0n,
          "nonce": 0,
          "nonceKey": 0n,
          "signature": {
            "signature": {
              "r": 8295033826057523868811611265482308451371017002968908303239068429185347242752n,
              "s": 19209121741142937743792577133918631538119578037081884248753483728952062625515n,
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
            "r": "0xbd4c2efa889264b73ea58da963f689c68ea3e79983e44804b87a42dba4d535e1",
            "s": "0x5f60684acb7ab75a918e27ff7101eefed088d91faaf0bba0e7511a9e4aa0e1fd",
            "v": 28n,
            "yParity": 1,
          },
          "feeToken": null,
          "from": "0x740474977e01d056f04a314b5537e4dd88f35952",
          "gas": 23938n,
          "gasPrice": 44n,
          "hash": "0xab4e8c5d81e6844c0bf4849c2d1110a22830e7f6bf38e08ccf56fe096a2a6a92",
          "maxFeePerBlobGas": undefined,
          "maxFeePerGas": 52n,
          "maxPriorityFeePerGas": 0n,
          "nonce": 0,
          "nonceKey": 0n,
          "signature": {
            "signature": {
              "r": 57529433750104717587188830658740614931036289821226247990356551183525592780540n,
              "s": 10002488104883700305011101877673344375623420672519358767427885699981263116256n,
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

  describe('secp256k1 (with Account.fromSecp256k1)', () => {
    test('default', async () => {
      const account = Account.fromSecp256k1(
        '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
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
          "gas": 24002n,
          "gasPrice": 44n,
          "hash": "0x91c1c55e893015734d9173b991ad0dbad176656bcdd122b237ad8e66c8bb8d27",
          "maxFeePerBlobGas": undefined,
          "maxFeePerGas": 52n,
          "maxPriorityFeePerGas": 0n,
          "nonce": 0,
          "nonceKey": 0n,
          "signature": {
            "signature": {
              "r": 109138999611428423935638076183946123521306623193860567277616743266345498830820n,
              "s": 12860439641179187070338651426150505874828490137488252860826886918175099614794n,
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
      const account = Account.fromSecp256k1(
        '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
      )

      const hash = await client.sendTransaction({
        account,
        calls: [
          actions.token.create.call({
            admin: account.address,
            currency: 'USD',
            name: 'Test Token fromSecp256k1',
            symbol: 'TESTSK1',
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
              "data": "0xb395b9ac00000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000000000000000000000000000000000000000012000000000000000000000000020c0000000000000000000000000000000000000000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb9226600000000000000000000000000000000000000000000000000000000000000185465737420546f6b656e2066726f6d536563703235366b310000000000000000000000000000000000000000000000000000000000000000000000000000000754455354534b310000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000035553440000000000000000000000000000000000000000000000000000000000",
              "to": "0x20fc000000000000000000000000000000000000",
              "value": 0n,
            },
          ],
          "chainId": 1337,
          "data": undefined,
          "feePayerSignature": undefined,
          "feeToken": null,
          "from": "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
          "gas": 27172n,
          "gasPrice": 44n,
          "hash": "0x400e275e1540c17086b05ecd6e4daa37fddafbd676b47b1f0981bc8216eb654a",
          "maxFeePerBlobGas": undefined,
          "maxFeePerGas": 52n,
          "maxPriorityFeePerGas": 0n,
          "nonce": 0,
          "nonceKey": 0n,
          "signature": {
            "signature": {
              "r": 73995635588157864110703635405456507247469597044411573177334972366428354808217n,
              "s": 37740248009926202386196453489803538196386444896263721074378075064733528728206n,
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
      const account = Account.fromSecp256k1(
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
            "r": "0xbd4c2efa889264b73ea58da963f689c68ea3e79983e44804b87a42dba4d535e1",
            "s": "0x5f60684acb7ab75a918e27ff7101eefed088d91faaf0bba0e7511a9e4aa0e1fd",
            "v": 28n,
            "yParity": 1,
          },
          "feeToken": null,
          "from": "0x740474977e01d056f04a314b5537e4dd88f35952",
          "gas": 23938n,
          "gasPrice": 44n,
          "hash": "0xab4e8c5d81e6844c0bf4849c2d1110a22830e7f6bf38e08ccf56fe096a2a6a92",
          "maxFeePerBlobGas": undefined,
          "maxFeePerGas": 52n,
          "maxPriorityFeePerGas": 0n,
          "nonce": 0,
          "nonceKey": 0n,
          "signature": {
            "signature": {
              "r": 57529433750104717587188830658740614931036289821226247990356551183525592780540n,
              "s": 10002488104883700305011101877673344375623420672519358767427885699981263116256n,
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
          "gas": 29012n,
          "gasPrice": 44n,
          "hash": "0x5d293163d0b210f78a0dee03b6e54912aa15cc650bc5e28ed50c9326ee070443",
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
              "r": 7207635234891404555919597426404661500201269184319987635455970800332581561294n,
              "s": 251272180768457310709618657346194050413575350586906884456274047798327075051n,
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
            "r": "0x5cae644ac0a662332ada8f2c2895bb72093f369a323fdf64a55b80aaab8be850",
            "s": "0x7c451fc3fcd3b41e71f877aa8c941f37ff37b79c8ac644c1a49d44c4e109c60f",
            "v": 27n,
            "yParity": 0,
          },
          "feeToken": null,
          "from": "0x5f704c6c7075acd14ee36527f03b5b5dcb4a966f",
          "gas": 28947n,
          "gasPrice": 44n,
          "hash": "0x648b17b708f439c863760f1f1b65ef188e6935dedfffff20edb7d9e012af12ce",
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
              "r": 14609282695690304838769033201319975718415948147193164353762772228428997076107n,
              "s": 47240957621279971783558004908938837548169992956085430312695263529928907815255n,
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
          "gas": 41404n,
          "gasPrice": 44n,
          "hash": "0xc4472128b54ed7065df4e49843918e8f8c1f0b5ff2bada87a20d171310493ee6",
          "maxFeePerBlobGas": undefined,
          "maxFeePerGas": 52n,
          "maxPriorityFeePerGas": 0n,
          "nonce": 0,
          "nonceKey": 0n,
          "signature": {
            "metadata": {
              "authenticatorData": "0x49960de5880e8c687434170f6476605b8fe4aeb9a28632c7995cf3ba831d97630500000000",
              "clientDataJSON": "{"type":"webauthn.get","challenge":"Mi-NP4GDslnYKfc5qqMbU_tqNeHBToPSwoP8AITlk8g","origin":"http://localhost","crossOrigin":false}",
            },
            "publicKey": {
              "prefix": 4,
              "x": 76851314197341596384765982852901663495246887984601955818013524729577854391357n,
              "y": 28479403900638612718017087999484027026245572142646745985103165612268853186552n,
            },
            "signature": {
              "r": 44162859558614167353447864664850951423002526445838901639905826696570613211300n,
              "s": 25345021215518996053422388739613243608589360679037420632399406945128144264819n,
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
            "r": "0x7a7e29084de1aaef929cac566d924d44f2b8e1ac88f146ea93e0bf4ee625dfdd",
            "s": "0x2477517ce4c2795b4826abaaa424b2213682cf6b07cbaf22a33186f7d443c9fb",
            "v": 27n,
            "yParity": 0,
          },
          "feeToken": null,
          "from": "0x5f704c6c7075acd14ee36527f03b5b5dcb4a966f",
          "gas": 41340n,
          "gasPrice": 44n,
          "hash": "0xafb08af3bce40c8bfdc75d6efd65575402e52bb37e9fb415ec243d0edb8aeb86",
          "maxFeePerBlobGas": undefined,
          "maxFeePerGas": 52n,
          "maxPriorityFeePerGas": 0n,
          "nonce": 0,
          "nonceKey": 0n,
          "signature": {
            "metadata": {
              "authenticatorData": "0x49960de5880e8c687434170f6476605b8fe4aeb9a28632c7995cf3ba831d97630500000000",
              "clientDataJSON": "{"type":"webauthn.get","challenge":"lJka_Us5mZWkidy4Dq6iFxGIKqn2uLkOd05-z9egDRs","origin":"http://localhost","crossOrigin":false}",
            },
            "publicKey": {
              "prefix": 4,
              "x": 89768657165983002447270155621964907577955735922001002175265262336201091268103n,
              "y": 21692506528696391747937034302216251793515398807520467579078748804389014172835n,
            },
            "signature": {
              "r": 33797108726219551256914333634291605632271299975638869426028264954524768306217n,
              "s": 34402974996213987134394337903336705869588823365488875000409562127878891454238n,
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
          "r": "0x979a5a723c8d1d9a4266f5af180117baebe4ec56bcadda01448f988a8b76bd06",
          "s": "0x5c11508ecd1cad7405b48c9894502c827e37983f1576ef6eff992a7ba16c2845",
          "v": 27n,
          "yParity": 0,
        },
        "feeToken": null,
        "from": "0x740474977e01d056f04a314b5537e4dd88f35952",
        "gas": 24002n,
        "gasPrice": 44n,
        "hash": "0xddaba848398d431d2f6d0c5870fb905a9ac314263b24c5df8e4412c475fa4c06",
        "maxFeePerBlobGas": undefined,
        "maxFeePerGas": 52n,
        "maxPriorityFeePerGas": 0n,
        "nonce": 0,
        "nonceKey": 0n,
        "signature": {
          "signature": {
            "r": 107298247890766957037248098470109981124064767822518726119287327218298928256722n,
            "s": 17927278251920541347120428674564615734539841606587364713194494536827982421269n,
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
            "r": "0xea0f2dfafb8281307866f63efc73c286aa027db290110b6136b8ec9c41bfc63d",
            "s": "0x3bcd105fdc6918c157034f3a0647ed96f648bb6c560d794e8ddd6881152427c9",
            "v": 28n,
            "yParity": 1,
          },
          "feeToken": null,
          "from": "0x740474977e01d056f04a314b5537e4dd88f35952",
          "gas": 25168n,
          "gasPrice": 44n,
          "hash": "0xb205e49a4f4652aa36788440096d478c90d872de2658b26fe73de697f2ce1247",
          "maxFeePerBlobGas": undefined,
          "maxFeePerGas": 52n,
          "maxPriorityFeePerGas": 0n,
          "nonce": 0,
          "nonceKey": 0n,
          "signature": {
            "signature": {
              "r": 6069939265818634993962914027347890769006246779527095345874969099775994272458n,
              "s": 24265304946109302590403909934383840738120649448951588254677364132956378093663n,
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
            "r": "0x1ba552edfbc279c589d1d6911ad448b2590ee44c45763eaacaa19c8050a0fa1a",
            "s": "0x5d70c8b23d927370a1a71a5eb9bb60f71fc747faafb839daadcdaffff54d9e16",
            "v": 28n,
            "yParity": 1,
          },
          "feeToken": null,
          "from": "0x5f704c6c7075acd14ee36527f03b5b5dcb4a966f",
          "gas": 30178n,
          "gasPrice": 44n,
          "hash": "0x04d9d10024e91007e2d5af99b3389485aa011b43fdf34e501e05522d7161064b",
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
              "r": 82404444731315382397428384899864831264689940057911347036436139233139625455061n,
              "s": 28886490472215912470052239457234864999712951824492973608194359778055432565621n,
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
            "r": "0x6fcfacc4d0203a83ce1166c6e44dd6ed2802b4dc6928a159c5d8dc8e20be9829",
            "s": "0x03d6ca55db55af4aeb5f3ee17337ca40fe727e985c73cd19307f5ad3b1db17c8",
            "v": 27n,
            "yParity": 0,
          },
          "feeToken": null,
          "from": "0x5f704c6c7075acd14ee36527f03b5b5dcb4a966f",
          "gas": 42570n,
          "gasPrice": 44n,
          "hash": "0x34a5e6b5d0ff5a3ad90799118a782779092793fcf454688e61a85eeb203e6a06",
          "maxFeePerBlobGas": undefined,
          "maxFeePerGas": 52n,
          "maxPriorityFeePerGas": 0n,
          "nonce": 0,
          "nonceKey": 0n,
          "signature": {
            "metadata": {
              "authenticatorData": "0x49960de5880e8c687434170f6476605b8fe4aeb9a28632c7995cf3ba831d97630500000000",
              "clientDataJSON": "{"type":"webauthn.get","challenge":"_7nQ5s2_okzlafk6EzIfdvNG7bHpxN0ZlbSNIDyIHSw","origin":"http://localhost","crossOrigin":false}",
            },
            "publicKey": {
              "prefix": 4,
              "x": 89768657165983002447270155621964907577955735922001002175265262336201091268103n,
              "y": 21692506528696391747937034302216251793515398807520467579078748804389014172835n,
            },
            "signature": {
              "r": 103221035414911154219470632880872806939726531365232257565568526906347370980468n,
              "s": 46384716350597906130494508835955319069627500359955248183222931224085938871042n,
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
