import {
  Address,
  P256,
  Secp256k1,
  Value,
  WebAuthnP256,
  WebCryptoP256,
} from 'ox'
import { getTransactionCount } from 'viem/actions'
import { beforeEach, expect, test } from 'vitest'
import { chainId, rpcUrl } from '../../test/config.js'
import { client, fundAddress } from '../../test/viem/config.js'
import { SignatureEnvelope } from './index.js'
import * as Transaction from './Transaction.js'
import * as TransactionEnvelopeAA from './TransactionEnvelopeAA.js'

beforeEach(async () => {
  await fetch(`${rpcUrl}/restart`)
})

test('behavior: default (secp256k1)', async () => {
  const privateKey = Secp256k1.randomPrivateKey()
  const address = Address.fromPublicKey(Secp256k1.getPublicKey({ privateKey }))

  await fundAddress(client, {
    address,
  })

  const nonce = await getTransactionCount(client, {
    address,
    blockTag: 'pending',
  })

  const transaction = TransactionEnvelopeAA.from({
    calls: [
      {
        to: '0x0000000000000000000000000000000000000000',
      },
    ],
    chainId,
    feeToken: '0x20c0000000000000000000000000000000000001',
    nonce: BigInt(nonce),
    gas: 100_000n,
    maxFeePerGas: Value.fromGwei('20'),
    maxPriorityFeePerGas: Value.fromGwei('10'),
  })

  const signature = Secp256k1.sign({
    payload: TransactionEnvelopeAA.getSignPayload(transaction),
    privateKey,
  })

  const serialized_signed = TransactionEnvelopeAA.serialize(transaction, {
    signature: SignatureEnvelope.from(signature),
  })

  const receipt = await client.request({
    method: 'eth_sendRawTransactionSync',
    params: [serialized_signed],
  })

  expect(receipt).toBeDefined()

  {
    const response = await client.request({
      method: 'eth_getTransactionByHash',
      params: [receipt.transactionHash],
    })
    if (!response) throw new Error()

    const {
      blockNumber,
      blockHash,
      chainId,
      hash,
      // @ts-expect-error
      feeToken: _,
      from,
      nonce,
      maxFeePerGas,
      maxPriorityFeePerGas,
      // @ts-expect-error
      signature,
      ...rest
    } = response

    expect(blockNumber).toBeDefined()
    expect(blockHash).toBeDefined()
    expect(chainId).toBe(chainId)
    expect(hash).toBe(receipt.transactionHash)
    expect(from).toBe(address)
    expect(maxFeePerGas).toBeDefined()
    expect(maxPriorityFeePerGas).toBeDefined()
    expect(nonce).toBeDefined()
    expect(signature).toBeDefined()
    expect(rest).toMatchInlineSnapshot(`
      {
        "aaAuthorizationList": [],
        "accessList": [],
        "calls": [
          {
            "data": null,
            "input": "0x",
            "to": "0x0000000000000000000000000000000000000000",
            "value": "0x0",
          },
        ],
        "feePayerSignature": null,
        "gas": "0x186a0",
        "gasPrice": "0x4a817c800",
        "nonceKey": "0x0",
        "transactionIndex": "0x1",
        "type": "0x76",
        "validAfter": null,
        "validBefore": null,
      }
    `)
  }

  const {
    blockNumber,
    blockHash,
    // @ts-expect-error
    feeToken: _,
    from,
    logs,
    logsBloom,
    transactionHash,
    ...rest
  } = receipt

  expect(blockNumber).toBeDefined()
  expect(blockHash).toBeDefined()
  expect(from).toBe(address)
  expect(logs).toBeDefined()
  expect(logsBloom).toBeDefined()
  expect(transactionHash).toBe(receipt.transactionHash)
  expect(rest).toMatchInlineSnapshot(`
    {
      "contractAddress": null,
      "cumulativeGasUsed": "0x5c30",
      "effectiveGasPrice": "0x4a817c800",
      "gasUsed": "0x5c30",
      "status": "0x1",
      "to": "0x0000000000000000000000000000000000000000",
      "transactionIndex": "0x1",
      "type": "0x76",
    }
  `)
})

test('behavior: default (p256)', async () => {
  const privateKey = P256.randomPrivateKey()
  const publicKey = P256.getPublicKey({ privateKey })
  const address = Address.fromPublicKey(publicKey)

  await fundAddress(client, {
    address,
  })

  const transaction = TransactionEnvelopeAA.from({
    calls: [
      {
        to: '0x0000000000000000000000000000000000000000',
      },
    ],
    chainId,
    feeToken: '0x20c0000000000000000000000000000000000001',
    gas: 100_000n,
    maxFeePerGas: Value.fromGwei('20'),
    maxPriorityFeePerGas: Value.fromGwei('10'),
  })

  const signature = P256.sign({
    payload: TransactionEnvelopeAA.getSignPayload(transaction),
    privateKey,
    hash: false,
  })

  const serialized_signed = TransactionEnvelopeAA.serialize(transaction, {
    signature: SignatureEnvelope.from({
      signature,
      publicKey,
      prehash: false,
    }),
  })

  const receipt = await client.request({
    method: 'eth_sendRawTransactionSync',
    params: [serialized_signed],
  })

  expect(receipt).toBeDefined()

  {
    const response = await client.request({
      method: 'eth_getTransactionByHash',
      params: [receipt.transactionHash],
    })
    if (!response) throw new Error()

    const {
      blockNumber,
      blockHash,
      chainId,
      // @ts-expect-error
      feeToken: _,
      from,
      hash,
      nonce,
      maxFeePerGas,
      maxPriorityFeePerGas,
      // @ts-expect-error
      signature,
      ...rest
    } = response

    expect(blockNumber).toBeDefined()
    expect(blockHash).toBeDefined()
    expect(chainId).toBe(chainId)
    expect(from).toBe(address)
    expect(hash).toBe(receipt.transactionHash)
    expect(nonce).toBeDefined()
    expect(maxFeePerGas).toBeDefined()
    expect(maxPriorityFeePerGas).toBeDefined()
    expect(signature).toBeDefined()
    expect(rest).toMatchInlineSnapshot(`
      {
        "aaAuthorizationList": [],
        "accessList": [],
        "calls": [
          {
            "data": null,
            "input": "0x",
            "to": "0x0000000000000000000000000000000000000000",
            "value": "0x0",
          },
        ],
        "feePayerSignature": null,
        "gas": "0x186a0",
        "gasPrice": "0x4a817c800",
        "nonceKey": "0x0",
        "transactionIndex": "0x1",
        "type": "0x76",
        "validAfter": null,
        "validBefore": null,
      }
    `)
  }

  const {
    blockNumber,
    blockHash,
    // @ts-expect-error
    feeToken: _,
    from,
    logs,
    logsBloom,
    transactionHash,
    ...rest
  } = receipt

  expect(blockNumber).toBeDefined()
  expect(blockHash).toBeDefined()
  expect(from).toBe(address)
  expect(logs).toBeDefined()
  expect(logsBloom).toBeDefined()
  expect(transactionHash).toBe(receipt.transactionHash)
  expect(rest).toMatchInlineSnapshot(`
    {
      "contractAddress": null,
      "cumulativeGasUsed": "0x6fb8",
      "effectiveGasPrice": "0x4a817c800",
      "gasUsed": "0x6fb8",
      "status": "0x1",
      "to": "0x0000000000000000000000000000000000000000",
      "transactionIndex": "0x1",
      "type": "0x76",
    }
  `)
})

test('behavior: default (p256 - webcrypto)', async () => {
  const keyPair = await WebCryptoP256.createKeyPair()
  const address = Address.fromPublicKey(keyPair.publicKey)

  await fundAddress(client, {
    address,
  })

  const transaction = TransactionEnvelopeAA.from({
    calls: [
      {
        to: '0x0000000000000000000000000000000000000000',
      },
    ],
    chainId,
    feeToken: '0x20c0000000000000000000000000000000000001',
    gas: 100_000n,
    maxFeePerGas: Value.fromGwei('20'),
    maxPriorityFeePerGas: Value.fromGwei('10'),
  })

  const signature = await WebCryptoP256.sign({
    payload: TransactionEnvelopeAA.getSignPayload(transaction),
    privateKey: keyPair.privateKey,
  })

  const serialized_signed = TransactionEnvelopeAA.serialize(transaction, {
    signature: SignatureEnvelope.from({
      signature,
      publicKey: keyPair.publicKey,
      prehash: true,
      type: 'p256',
    }),
  })

  const receipt = await client.request({
    method: 'eth_sendRawTransactionSync',
    params: [serialized_signed],
  })

  expect(receipt).toBeDefined()

  {
    const response = await client.request({
      method: 'eth_getTransactionByHash',
      params: [receipt.transactionHash],
    })
    if (!response) throw new Error()

    const {
      blockNumber,
      blockHash,
      chainId,
      feeToken: _,
      from,
      hash,
      nonce,
      maxFeePerGas,
      maxPriorityFeePerGas,
      signature,
      ...rest
    } = response as any

    expect(blockNumber).toBeDefined()
    expect(blockHash).toBeDefined()
    expect(chainId).toBeDefined()
    expect(from).toBeDefined()
    expect(hash).toBe(receipt.transactionHash)
    expect(nonce).toBeDefined()
    expect(maxFeePerGas).toBeDefined()
    expect(maxPriorityFeePerGas).toBeDefined()
    expect(signature).toBeDefined()
    expect(rest).toMatchInlineSnapshot(`
      {
        "aaAuthorizationList": [],
        "accessList": [],
        "calls": [
          {
            "data": null,
            "input": "0x",
            "to": "0x0000000000000000000000000000000000000000",
            "value": "0x0",
          },
        ],
        "feePayerSignature": null,
        "gas": "0x186a0",
        "gasPrice": "0x4a817c800",
        "nonceKey": "0x0",
        "transactionIndex": "0x1",
        "type": "0x76",
        "validAfter": null,
        "validBefore": null,
      }
    `)
  }

  const {
    blockNumber,
    blockHash,
    // @ts-expect-error
    feeToken: _,
    from,
    logs,
    logsBloom,
    transactionHash,
    ...rest
  } = receipt

  expect(blockNumber).toBeDefined()
  expect(blockHash).toBeDefined()
  expect(from).toBeDefined()
  expect(logs).toBeDefined()
  expect(logsBloom).toBeDefined()
  expect(transactionHash).toBe(receipt.transactionHash)
  expect(rest).toMatchInlineSnapshot(`
    {
      "contractAddress": null,
      "cumulativeGasUsed": "0x6fb8",
      "effectiveGasPrice": "0x4a817c800",
      "gasUsed": "0x6fb8",
      "status": "0x1",
      "to": "0x0000000000000000000000000000000000000000",
      "transactionIndex": "0x1",
      "type": "0x76",
    }
  `)
})

test('behavior: default (webauthn)', async () => {
  const privateKey = P256.randomPrivateKey()
  const publicKey = P256.getPublicKey({ privateKey })
  const address = Address.fromPublicKey(publicKey)

  await fundAddress(client, {
    address,
  })

  const transaction = TransactionEnvelopeAA.from({
    calls: [
      {
        to: '0x0000000000000000000000000000000000000000',
      },
    ],
    chainId,
    feeToken: '0x20c0000000000000000000000000000000000001',
    gas: 100_000n,
    maxFeePerGas: Value.fromGwei('20'),
    maxPriorityFeePerGas: Value.fromGwei('10'),
  })

  const { metadata, payload } = WebAuthnP256.getSignPayload({
    challenge: TransactionEnvelopeAA.getSignPayload(transaction),
    rpId: 'localhost',
    origin: 'http://localhost',
  })

  const signature = P256.sign({
    payload,
    privateKey,
    hash: true,
  })

  const serialized_signed = TransactionEnvelopeAA.serialize(transaction, {
    signature: SignatureEnvelope.from({
      signature,
      publicKey,
      metadata,
    }),
  })

  const receipt = await client.request({
    method: 'eth_sendRawTransactionSync',
    params: [serialized_signed],
  })

  expect(receipt).toBeDefined()

  {
    const response = await client.request({
      method: 'eth_getTransactionByHash',
      params: [receipt.transactionHash],
    })
    if (!response) throw new Error()

    const {
      blockNumber,
      blockHash,
      chainId,
      // @ts-expect-error
      feeToken: _,
      from,
      hash,
      nonce,
      maxFeePerGas,
      maxPriorityFeePerGas,
      // @ts-expect-error
      signature,
      ...rest
    } = response

    expect(blockNumber).toBeDefined()
    expect(blockHash).toBeDefined()
    expect(chainId).toBe(chainId)
    expect(from).toBeDefined()
    expect(hash).toBe(receipt.transactionHash)
    expect(nonce).toBeDefined()
    expect(maxFeePerGas).toBeDefined()
    expect(maxPriorityFeePerGas).toBeDefined()
    expect(signature).toBeDefined()
    expect(rest).toMatchInlineSnapshot(`
      {
        "aaAuthorizationList": [],
        "accessList": [],
        "calls": [
          {
            "data": null,
            "input": "0x",
            "to": "0x0000000000000000000000000000000000000000",
            "value": "0x0",
          },
        ],
        "feePayerSignature": null,
        "gas": "0x186a0",
        "gasPrice": "0x4a817c800",
        "nonceKey": "0x0",
        "transactionIndex": "0x1",
        "type": "0x76",
        "validAfter": null,
        "validBefore": null,
      }
    `)
  }

  const {
    blockNumber,
    blockHash,
    // @ts-expect-error
    feeToken: _,
    from,
    logs,
    logsBloom,
    transactionHash,
    ...rest
  } = receipt

  expect(blockNumber).toBeDefined()
  expect(blockHash).toBeDefined()
  expect(from).toBe(address)
  expect(logs).toBeDefined()
  expect(logsBloom).toBeDefined()
  expect(transactionHash).toBe(receipt.transactionHash)
  expect(rest).toMatchInlineSnapshot(`
    {
      "contractAddress": null,
      "cumulativeGasUsed": "0x79e8",
      "effectiveGasPrice": "0x4a817c800",
      "gasUsed": "0x79e8",
      "status": "0x1",
      "to": "0x0000000000000000000000000000000000000000",
      "transactionIndex": "0x1",
      "type": "0x76",
    }
  `)
})

test('behavior: feePayerSignature (user → feePayer)', async () => {
  const feePayerPrivateKey = Secp256k1.randomPrivateKey()
  const feePayerAddress = Address.fromPublicKey(
    Secp256k1.getPublicKey({ privateKey: feePayerPrivateKey }),
  )

  const senderPrivateKey = Secp256k1.randomPrivateKey()
  const senderAddress = Address.fromPublicKey(
    Secp256k1.getPublicKey({ privateKey: senderPrivateKey }),
  )

  await fundAddress(client, {
    address: feePayerAddress,
  })

  const nonce = await client.request({
    method: 'eth_getTransactionCount',
    params: [senderAddress, 'pending'],
  })

  //////////////////////////////////////////////////////////////////
  // Sender flow

  const transaction = TransactionEnvelopeAA.from({
    calls: [{ to: '0x0000000000000000000000000000000000000000', value: 0n }],
    chainId,
    feePayerSignature: null,
    nonce: BigInt(nonce),
    gas: 100000n,
    maxFeePerGas: Value.fromGwei('20'),
    maxPriorityFeePerGas: Value.fromGwei('10'),
  })

  const signature = Secp256k1.sign({
    payload: TransactionEnvelopeAA.getSignPayload(transaction),
    // unfunded PK
    privateKey: senderPrivateKey,
  })

  const transaction_signed = TransactionEnvelopeAA.from(transaction, {
    signature: SignatureEnvelope.from(signature),
  })

  //////////////////////////////////////////////////////////////////
  // Fee payer flow

  const transaction_feePayer = TransactionEnvelopeAA.from({
    ...transaction_signed,
    feeToken: '0x20c0000000000000000000000000000000000001',
  })

  const feePayerSignature = Secp256k1.sign({
    payload: TransactionEnvelopeAA.getFeePayerSignPayload(
      transaction_feePayer,
      { sender: senderAddress },
    ),
    privateKey: feePayerPrivateKey,
  })

  const serialized_signed = TransactionEnvelopeAA.serialize(
    transaction_feePayer,
    {
      feePayerSignature,
    },
  )

  const receipt = await client.request({
    method: 'eth_sendRawTransactionSync',
    params: [serialized_signed],
  })

  {
    const {
      blockNumber,
      blockHash,
      // @ts-expect-error
      feeToken: _,
      from,
      logs,
      logsBloom,
      transactionHash,
      transactionIndex,
      ...rest
    } = receipt

    expect(blockNumber).toBeDefined()
    expect(blockHash).toBeDefined()
    expect(from).toBe(senderAddress)
    expect(logs).toBeDefined()
    expect(logsBloom).toBeDefined()
    expect(transactionHash).toBe(receipt.transactionHash)
    expect(transactionIndex).toBeDefined()
    expect(rest).toMatchInlineSnapshot(`
      {
        "contractAddress": null,
        "cumulativeGasUsed": "0x5c30",
        "effectiveGasPrice": "0x4a817c800",
        "gasUsed": "0x5c30",
        "status": "0x1",
        "to": "0x0000000000000000000000000000000000000000",
        "type": "0x76",
      }
    `)
  }

  const { feePayer, feeToken, from } = (await client
    .request({
      method: 'eth_getTransactionByHash',
      params: [receipt.transactionHash],
    })
    .then((tx) => Transaction.fromRpc(tx as any))) as any

  expect(feePayer).toBe(feePayerAddress)
  expect(feeToken).toBe('0x20c0000000000000000000000000000000000001')
  expect(from).toBe(senderAddress)
})
