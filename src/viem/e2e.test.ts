import * as Http from 'node:http'
import { createRequestListener } from '@remix-run/node-fetch-server'
import { RpcRequest, RpcResponse, WebCryptoP256 } from 'ox'
import { Account, Transaction } from 'tempo.ts/viem'
import { http, parseGwei, publicActions, walletActions } from 'viem'
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'
import { afterAll, afterEach, beforeAll, describe, expect, test } from 'vitest'
import { fetchOptions, rpcUrl } from '../../test/config.js'
import {
  accounts,
  client as client_,
  fundAddress,
  getClient,
} from '../../test/viem/config.js'
import * as actions from './Actions/index.js'
import { tempoActions } from './index.js'
import { withFeePayer } from './Transport.js'

const client = client_
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
        to: '0x0000000000000000000000000000000000000000',
      })
      await client.waitForTransactionReceipt({ hash })

      const {
        blockHash,
        blockNumber,
        chainId,
        from,
        gas,
        gasPrice,
        hash: hash_,
        maxFeePerGas,
        maxPriorityFeePerGas,
        nonce,
        signature,
        transactionIndex,
        ...transaction
      } = await client.getTransaction({ hash })

      expect(blockHash).toBeDefined()
      expect(blockNumber).toBeDefined()
      expect(chainId).toBeDefined()
      expect(from).toBe(account.address.toLowerCase())
      expect(gas).toBeDefined()
      expect(gasPrice).toBeDefined()
      expect(hash_).toBe(hash)
      expect(maxFeePerGas).toBeDefined()
      expect(maxPriorityFeePerGas).toBeDefined()
      expect(nonce).toBeDefined()
      expect(signature).toBeDefined()
      expect(transactionIndex).toBeDefined()
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
          "data": undefined,
          "feePayerSignature": undefined,
          "feeToken": "0x20c0000000000000000000000000000000000001",
          "keyAuthorization": null,
          "maxFeePerBlobGas": undefined,
          "nonceKey": 0n,
          "to": null,
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
      const account = accounts[0]

      const hash = await client.sendTransaction({
        account,
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

      const {
        blockHash,
        blockNumber,
        calls,
        chainId,
        from,
        gas,
        gasPrice,
        hash: hash_,
        maxFeePerGas,
        maxPriorityFeePerGas,
        nonce,
        signature,
        transactionIndex,
        ...transaction
      } = await client.getTransaction({ hash })

      expect(blockHash).toBeDefined()
      expect(blockNumber).toBeDefined()
      expect(calls?.length).toBe(1)
      expect(chainId).toBeDefined()
      expect(from).toBe(account.address.toLowerCase())
      expect(gas).toBeDefined()
      expect(gasPrice).toBeDefined()
      expect(hash_).toBe(hash)
      expect(maxFeePerGas).toBeDefined()
      expect(maxPriorityFeePerGas).toBeDefined()
      expect(nonce).toBeDefined()
      expect(signature).toBeDefined()
      expect(transactionIndex).toBeDefined()
      expect(transaction).toMatchInlineSnapshot(`
        {
          "aaAuthorizationList": [],
          "accessList": [],
          "authorizationList": undefined,
          "data": undefined,
          "feePayerSignature": undefined,
          "feeToken": "0x20c0000000000000000000000000000000000001",
          "keyAuthorization": null,
          "maxFeePerBlobGas": undefined,
          "nonceKey": 0n,
          "to": null,
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
      const account = privateKeyToAccount(generatePrivateKey())
      const feePayer = accounts[0]

      const hash = await client.sendTransaction({
        account,
        feePayer,
        to: '0x0000000000000000000000000000000000000000',
      })
      await client.waitForTransactionReceipt({ hash })

      const {
        blockHash,
        blockNumber,
        chainId,
        feePayerSignature,
        from,
        gas,
        gasPrice,
        hash: hash_,
        maxFeePerGas,
        maxPriorityFeePerGas,
        nonce,
        signature,
        transactionIndex,
        ...transaction
      } = await client.getTransaction({ hash })

      expect(blockHash).toBeDefined()
      expect(blockNumber).toBeDefined()
      expect(chainId).toBeDefined()
      expect(feePayerSignature).toBeDefined()
      expect(from).toBe(account.address.toLowerCase())
      expect(gas).toBeDefined()
      expect(gasPrice).toBeDefined()
      expect(hash_).toBe(hash)
      expect(maxFeePerGas).toBeDefined()
      expect(maxPriorityFeePerGas).toBeDefined()
      expect(nonce).toBeDefined()
      expect(signature).toBeDefined()
      expect(transactionIndex).toBeDefined()
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
          "data": undefined,
          "feeToken": "0x20c0000000000000000000000000000000000001",
          "keyAuthorization": null,
          "maxFeePerBlobGas": undefined,
          "nonceKey": 0n,
          "to": null,
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
      await fundAddress(client, { address: account.address })

      const receipt = await client.sendTransactionSync({
        account,
        data: '0xdeadbeef',
        to: '0x0000000000000000000000000000000000000000',
      })

      const {
        blockHash,
        blockNumber,
        chainId,
        from,
        gas,
        gasPrice,
        hash,
        maxFeePerGas,
        maxPriorityFeePerGas,
        nonce,
        signature,
        transactionIndex,
        ...transaction
      } = await client.getTransaction({
        hash: receipt.transactionHash,
      })

      expect(blockHash).toBeDefined()
      expect(blockNumber).toBeDefined()
      expect(chainId).toBeDefined()
      expect(from).toBe(account.address.toLowerCase())
      expect(gas).toBeDefined()
      expect(gasPrice).toBeDefined()
      expect(hash).toBe(receipt.transactionHash)
      expect(maxFeePerGas).toBeDefined()
      expect(maxPriorityFeePerGas).toBeDefined()
      expect(nonce).toBeDefined()
      expect(signature).toBeDefined()
      expect(transactionIndex).toBeDefined()
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
          "data": undefined,
          "feePayerSignature": undefined,
          "feeToken": "0x20c0000000000000000000000000000000000001",
          "keyAuthorization": null,
          "maxFeePerBlobGas": undefined,
          "nonceKey": 0n,
          "to": null,
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
      await fundAddress(client, { address: account.address })

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

      const {
        blockHash,
        blockNumber,
        calls,
        chainId,
        from,
        gas,
        gasPrice,
        hash,
        maxFeePerGas,
        maxPriorityFeePerGas,
        nonce,
        signature,
        transactionIndex,
        ...transaction
      } = await client.getTransaction({
        hash: receipt.transactionHash,
      })

      expect(blockHash).toBeDefined()
      expect(blockNumber).toBeDefined()
      expect(calls?.length).toBe(1)
      expect(chainId).toBeDefined()
      expect(from).toBe(account.address.toLowerCase())
      expect(gas).toBeDefined()
      expect(gasPrice).toBeDefined()
      expect(hash).toBe(receipt.transactionHash)
      expect(maxFeePerGas).toBeDefined()
      expect(maxPriorityFeePerGas).toBeDefined()
      expect(nonce).toBeDefined()
      expect(signature).toBeDefined()
      expect(transactionIndex).toBeDefined()
      expect(transaction).toMatchInlineSnapshot(`
        {
          "aaAuthorizationList": [],
          "accessList": [],
          "authorizationList": undefined,
          "data": undefined,
          "feePayerSignature": undefined,
          "feeToken": "0x20c0000000000000000000000000000000000001",
          "keyAuthorization": null,
          "maxFeePerBlobGas": undefined,
          "nonceKey": 0n,
          "to": null,
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
        blockHash,
        blockNumber,
        chainId,
        feePayerSignature,
        from,
        gas,
        gasPrice,
        hash: hash_,
        maxFeePerGas,
        maxPriorityFeePerGas,
        nonce,
        signature,
        transactionIndex,
        ...transaction
      } = await client.getTransaction({ hash })

      expect(blockHash).toBeDefined()
      expect(blockNumber).toBeDefined()
      expect(chainId).toBeDefined()
      expect(feePayerSignature).toBeDefined()
      expect(from).toBe(account.address.toLowerCase())
      expect(gas).toBeDefined()
      expect(gasPrice).toBeDefined()
      expect(hash_).toBe(hash)
      expect(maxFeePerGas).toBeDefined()
      expect(maxPriorityFeePerGas).toBeDefined()
      expect(nonce).toBeDefined()
      expect(signature).toBeDefined()
      expect(transactionIndex).toBeDefined()
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
          "data": undefined,
          "feeToken": "0x20c0000000000000000000000000000000000001",
          "keyAuthorization": null,
          "maxFeePerBlobGas": undefined,
          "nonceKey": 0n,
          "to": null,
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
      await fundAddress(client, { address: account.address })

      const receipt = await client.sendTransactionSync({
        account,
        data: '0xdeadbeef',
        to: '0x0000000000000000000000000000000000000000',
      })

      const {
        blockHash,
        blockNumber,
        chainId,
        from,
        gasPrice,
        hash,
        maxFeePerGas,
        maxPriorityFeePerGas,
        nonce,
        signature,
        transactionIndex,
        ...transaction
      } = await client.getTransaction({
        hash: receipt.transactionHash,
      })

      expect(blockHash).toBeDefined()
      expect(blockNumber).toBeDefined()
      expect(chainId).toBeDefined()
      expect(from).toBeDefined()
      expect(gasPrice).toBeDefined()
      expect(hash).toBe(receipt.transactionHash)
      expect(maxFeePerGas).toBeDefined()
      expect(maxPriorityFeePerGas).toBeDefined()
      expect(nonce).toBeDefined()
      expect(signature).toBeDefined()
      expect(transactionIndex).toBeDefined()
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
          "data": undefined,
          "feePayerSignature": undefined,
          "feeToken": "0x20c0000000000000000000000000000000000001",
          "gas": 29012n,
          "keyAuthorization": null,
          "maxFeePerBlobGas": undefined,
          "nonceKey": 0n,
          "to": null,
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
      await fundAddress(client, { address: account.address })

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

      const {
        blockHash,
        blockNumber,
        calls,
        chainId,
        from,
        gas,
        gasPrice,
        hash,
        maxFeePerGas,
        maxPriorityFeePerGas,
        nonce,
        signature,
        ...transaction
      } = await client.getTransaction({
        hash: receipt.transactionHash,
      })

      expect(blockHash).toBeDefined()
      expect(blockNumber).toBeDefined()
      expect(calls?.length).toBe(1)
      expect(chainId).toBeDefined()
      expect(from).toBeDefined()
      expect(gas).toBeDefined()
      expect(gasPrice).toBeDefined()
      expect(hash).toBe(receipt.transactionHash)
      expect(maxFeePerGas).toBeDefined()
      expect(maxPriorityFeePerGas).toBeDefined()
      expect(nonce).toBeDefined()
      expect(signature).toBeDefined()
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

      const {
        blockHash,
        blockNumber,
        chainId,
        from,
        gasPrice,
        hash: hash_,
        maxFeePerGas,
        maxPriorityFeePerGas,
        nonce,
        signature,
        ...transaction
      } = await client.getTransaction({ hash })

      expect(blockHash).toBeDefined()
      expect(blockNumber).toBeDefined()
      expect(chainId).toBeDefined()
      expect(from).toBeDefined()
      expect(gasPrice).toBeDefined()
      expect(hash_).toBe(hash)
      expect(maxFeePerGas).toBeDefined()
      expect(maxPriorityFeePerGas).toBeDefined()
      expect(nonce).toBeDefined()
      expect(signature).toBeDefined()
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
      await fundAddress(client, { address: account.address })

      const receipt = await client.sendTransactionSync({
        account,
        data: '0xdeadbeef',
        to: '0x0000000000000000000000000000000000000000',
      })

      const {
        blockHash,
        blockNumber,
        chainId,
        from,
        gas,
        gasPrice,
        hash,
        maxFeePerGas,
        maxPriorityFeePerGas,
        nonce,
        signature,
        transactionIndex,
        ...transaction
      } = await client.getTransaction({
        hash: receipt.transactionHash,
      })

      expect(blockHash).toBeDefined()
      expect(blockNumber).toBeDefined()
      expect(chainId).toBeDefined()
      expect(from).toBe(account.address.toLowerCase())
      expect(gas).toBeDefined()
      expect(gasPrice).toBeDefined()
      expect(hash).toBe(receipt.transactionHash)
      expect(maxFeePerGas).toBeDefined()
      expect(maxPriorityFeePerGas).toBeDefined()
      expect(nonce).toBeDefined()
      expect(signature).toBeDefined()
      expect(transactionIndex).toBeDefined()
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
          "data": undefined,
          "feePayerSignature": undefined,
          "feeToken": "0x20c0000000000000000000000000000000000001",
          "keyAuthorization": null,
          "maxFeePerBlobGas": undefined,
          "nonceKey": 0n,
          "to": null,
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
      await fundAddress(client, { address: account.address })

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

      const {
        blockHash,
        blockNumber,
        calls,
        chainId,
        from,
        gas,
        gasPrice,
        hash,
        maxFeePerGas,
        maxPriorityFeePerGas,
        nonce,
        signature,
        transactionIndex,
        ...transaction
      } = await client.getTransaction({
        hash: receipt.transactionHash,
      })

      expect(blockHash).toBeDefined()
      expect(blockNumber).toBeDefined()
      expect(calls?.length).toBe(1)
      expect(chainId).toBeDefined()
      expect(from).toBe(account.address.toLowerCase())
      expect(gas).toBeDefined()
      expect(gasPrice).toBeDefined()
      expect(hash).toBe(receipt.transactionHash)
      expect(maxFeePerGas).toBeDefined()
      expect(maxPriorityFeePerGas).toBeDefined()
      expect(nonce).toBeDefined()
      expect(signature).toBeDefined()
      expect(transactionIndex).toBeDefined()
      expect(transaction).toMatchInlineSnapshot(`
        {
          "aaAuthorizationList": [],
          "accessList": [],
          "authorizationList": undefined,
          "data": undefined,
          "feePayerSignature": undefined,
          "feeToken": "0x20c0000000000000000000000000000000000001",
          "keyAuthorization": null,
          "maxFeePerBlobGas": undefined,
          "nonceKey": 0n,
          "to": null,
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
        blockHash,
        blockNumber,
        chainId,
        feePayerSignature,
        from,
        gas,
        gasPrice,
        hash: hash_,
        maxFeePerGas,
        maxPriorityFeePerGas,
        nonce,
        signature,
        transactionIndex,
        ...transaction
      } = await client.getTransaction({ hash })

      expect(blockHash).toBeDefined()
      expect(blockNumber).toBeDefined()
      expect(chainId).toBeDefined()
      expect(feePayerSignature).toBeDefined()
      expect(from).toBe(account.address.toLowerCase())
      expect(gas).toBeDefined()
      expect(gasPrice).toBeDefined()
      expect(hash_).toBe(hash)
      expect(maxFeePerGas).toBeDefined()
      expect(maxPriorityFeePerGas).toBeDefined()
      expect(nonce).toBeDefined()
      expect(signature).toBeDefined()
      expect(transactionIndex).toBeDefined()
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
          "data": undefined,
          "feeToken": "0x20c0000000000000000000000000000000000001",
          "keyAuthorization": null,
          "maxFeePerBlobGas": undefined,
          "nonceKey": 0n,
          "to": null,
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
    let transaction = await client.signTransaction(request as never)

    transaction = await client.signTransaction({
      ...Transaction.deserialize(transaction),
      account,
      feePayer,
    } as never)
    const hash = await client.sendRawTransaction({
      serializedTransaction: transaction,
    })

    await client.waitForTransactionReceipt({ hash })

    const {
      blockHash,
      blockNumber,
      chainId,
      feePayerSignature,
      from,
      gasPrice,
      hash: hash_,
      maxFeePerGas,
      maxPriorityFeePerGas,
      nonce,
      signature,
      transactionIndex,
      ...transaction2
    } = await client.getTransaction({ hash })

    expect(blockHash).toBeDefined()
    expect(blockNumber).toBeDefined()
    expect(chainId).toBeDefined()
    expect(feePayerSignature).toBeDefined()
    expect(from).toBe(account.address.toLowerCase())
    expect(gasPrice).toBeDefined()
    expect(hash_).toBe(hash)
    expect(maxFeePerGas).toBeDefined()
    expect(maxPriorityFeePerGas).toBeDefined()
    expect(nonce).toBeDefined()
    expect(signature).toBeDefined()
    expect(transactionIndex).toBeDefined()
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
        "data": undefined,
        "feeToken": "0x20c0000000000000000000000000000000000001",
        "gas": 24002n,
        "keyAuthorization": null,
        "maxFeePerBlobGas": undefined,
        "nonceKey": 0n,
        "to": null,
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
  const client = getClient({
    transport: withFeePayer(
      http(undefined, { fetchOptions }),
      http('http://localhost:3050'),
      { policy: 'sign-and-broadcast' },
    ),
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
        const client = getClient({
          account: accounts[0],
        }).extend(walletActions)

        const request = RpcRequest.from(await r.json())

        // Validate method
        if (
          request.method !== 'eth_signTransaction' &&
          request.method !== 'eth_sendRawTransaction' &&
          request.method !== 'eth_sendRawTransactionSync'
        )
          return Response.json(
            RpcResponse.from(
              {
                error: new RpcResponse.InvalidParamsError({
                  message:
                    'service only supports `eth_signTransaction`, `eth_sendRawTransaction`, and `eth_sendRawTransactionSync`',
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
                  message: 'service only supports `0x76` transactions',
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

        // Handle based on RPC method
        if (request.method === 'eth_signTransaction') {
          // Policy: 'sign-only' - Return signed transaction without broadcasting
          return Response.json(
            RpcResponse.from({ result: serializedTransaction }, { request }),
          )
        }

        // Policy: 'sign-and-broadcast' - Sign, broadcast, and return hash
        const result = await client.request({
          method: request.method,
          params: [serializedTransaction],
        })

        return Response.json(RpcResponse.from({ result }, { request }))
      }),
    ).listen(3050)
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
        maxFeePerGas: parseGwei('20'),
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
        blockHash,
        blockNumber,
        chainId,
        feePayerSignature,
        from,
        gas,
        gasPrice,
        hash,
        maxFeePerGas,
        maxPriorityFeePerGas,
        nonce,
        signature,
        transactionIndex,
        ...transaction
      } = await client.getTransaction({ hash: receipt.transactionHash })

      expect(blockHash).toBeDefined()
      expect(blockNumber).toBeDefined()
      expect(chainId).toBeDefined()
      expect(feePayerSignature).toBeDefined()
      expect(from).toBe(account.address.toLowerCase())
      expect(gas).toBeDefined()
      expect(gasPrice).toBeDefined()
      expect(hash).toBe(receipt.transactionHash)
      expect(maxFeePerGas).toBeDefined()
      expect(maxPriorityFeePerGas).toBeDefined()
      expect(nonce).toBeDefined()
      expect(signature).toBeDefined()
      expect(transactionIndex).toBeDefined()
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
          "data": undefined,
          "feeToken": "0x20c0000000000000000000000000000000000001",
          "keyAuthorization": null,
          "maxFeePerBlobGas": undefined,
          "nonceKey": 0n,
          "to": null,
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
        blockHash,
        blockNumber,
        chainId,
        feePayerSignature,
        from,
        gas,
        gasPrice,
        hash,
        maxFeePerGas,
        maxPriorityFeePerGas,
        nonce,
        signature,
        transactionIndex,
        ...transaction
      } = await client.getTransaction({ hash: receipt.transactionHash })

      expect(blockHash).toBeDefined()
      expect(blockNumber).toBeDefined()
      expect(chainId).toBeDefined()
      expect(feePayerSignature).toBeDefined()
      expect(from).toBe(account.address.toLowerCase())
      expect(gas).toBeDefined()
      expect(gasPrice).toBeDefined()
      expect(hash).toBe(receipt.transactionHash)
      expect(maxFeePerGas).toBeDefined()
      expect(maxPriorityFeePerGas).toBeDefined()
      expect(nonce).toBeDefined()
      expect(signature).toBeDefined()
      expect(transactionIndex).toBeDefined()
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
          "data": undefined,
          "feeToken": "0x20c0000000000000000000000000000000000001",
          "keyAuthorization": null,
          "maxFeePerBlobGas": undefined,
          "nonceKey": 0n,
          "to": null,
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
        blockHash,
        blockNumber,
        chainId,
        feePayerSignature,
        from,
        gas,
        gasPrice,
        hash,
        maxFeePerGas,
        maxPriorityFeePerGas,
        nonce,
        signature,
        transactionIndex,
        ...transaction
      } = await client.getTransaction({ hash: receipt.transactionHash })

      expect(blockHash).toBeDefined()
      expect(blockNumber).toBeDefined()
      expect(chainId).toBeDefined()
      expect(feePayerSignature).toBeDefined()
      expect(from).toBe(account.address.toLowerCase())
      expect(gas).toBeDefined()
      expect(gasPrice).toBeDefined()
      expect(hash).toBe(receipt.transactionHash)
      expect(maxFeePerGas).toBeDefined()
      expect(maxPriorityFeePerGas).toBeDefined()
      expect(nonce).toBeDefined()
      expect(signature).toBeDefined()
      expect(transactionIndex).toBeDefined()
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
          "data": undefined,
          "feeToken": "0x20c0000000000000000000000000000000000001",
          "maxFeePerBlobGas": undefined,
          "nonceKey": 0n,
          "to": null,
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

  describe('policy: sign-only', () => {
    test('relay co-signs and transport auto-submits', async () => {
      const signClient = getClient({
        transport: withFeePayer(
          http(undefined, { fetchOptions }),
          http('http://localhost:3050'),
          { policy: 'sign-only' },
        ),
      })
        .extend(tempoActions())
        .extend(walletActions)
        .extend(publicActions)

      // unfunded account that needs sponsorship
      const account = privateKeyToAccount(
        '0xecc3fe55647412647e5c6b657c496803b08ef956f927b7a821da298cfbdd9666',
      )

      // With 'sign-only' policy, the relay co-signs and the transport auto-submits
      const { user, token, receipt } = await signClient.fee.setUserTokenSync({
        account,
        feePayer: true,
        token: 1n,
      })

      // Verify the action returned the expected values
      expect(user).toBe(account.address)
      expect(token).toBe('0x20C0000000000000000000000000000000000001')
      expect(receipt).toBeDefined()

      // Verify the transaction was successfully executed
      const userToken = await signClient.fee.getUserToken({
        account: account.address,
      })
      expect(userToken?.id).toBe(1n)

      const {
        feePayerSignature,
        from,
        gas,
        gasPrice,
        maxFeePerGas,
        maxPriorityFeePerGas,
        signature,
      } = (await signClient.getTransaction({
        hash: receipt.transactionHash,
      })) as any

      expect(feePayerSignature).toBeDefined()
      expect(from).toBe(account.address.toLowerCase())
      expect(gas).toBeDefined()
      expect(gasPrice).toBeDefined()
      expect(maxFeePerGas).toBeDefined()
      expect(maxPriorityFeePerGas).toBeDefined()
      expect(signature).toBeDefined()
    })
  })
})
