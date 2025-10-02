import { afterEach, beforeEach, describe, expect, test } from 'bun:test'
import { tempoLocal } from 'tempo/chains'
import { Instance } from 'tempo/prool'
import { createClient, http, publicActions, walletActions } from 'viem'
import {
  generatePrivateKey,
  mnemonicToAccount,
  privateKeyToAccount,
} from 'viem/accounts'

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

    expect(await client.getTransaction({ hash })).toMatchInlineSnapshot(`
      {
        "accessList": [],
        "authorizationList": [],
        "blockHash": null,
        "blockNumber": null,
        "chainId": 1337,
        "data": "0x",
        "feeToken": "0x20c0000000000000000000000000000000000000",
        "from": "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
        "gas": 21000n,
        "gasPrice": 52n,
        "hash": "0x7d2455f8401a00846195c0832eef2b90b10001ca6935dfa7b6c69193664c255f",
        "input": "0x",
        "maxFeePerBlobGas": undefined,
        "maxFeePerGas": 52n,
        "maxPriorityFeePerGas": 0n,
        "nonce": 0n,
        "r": 58460916333183078649529489738684041515880112183282369675165050600259272149944n,
        "s": 13523533666714072908825723941075329471154256851896494868115028113855216484763n,
        "to": "0x0000000000000000000000000000000000000000",
        "transactionIndex": null,
        "type": "feeToken",
        "typeHex": "0x77",
        "v": 27,
        "value": 0n,
        "yParity": 0,
      }
    `)
  })

  test('with feePayer', async () => {
    const account = privateKeyToAccount(generatePrivateKey())
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

    expect(await client.getTransaction({ hash })).toMatchInlineSnapshot(`
      {
        "accessList": [],
        "authorizationList": [],
        "blockHash": null,
        "blockNumber": null,
        "chainId": 1337,
        "data": "0x",
        "feePayer": "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
        "feePayerSignature": {
          "r": 11286424128721282775266272724702746872510383830215063669804848646959698490349n,
          "s": 30351356422537858197118359082981817290256330382709588048468048273925948847482n,
          "v": 27,
          "yParity": 0,
        },
        "feeToken": null,
        "from": "0xd11f6d1575eec8d56deba8765d9f1961ee039a3c",
        "gas": 21000n,
        "gasPrice": 52n,
        "hash": "0x9055384aebae8afe27f6a9f2e489f1fb7813a5a948947e22571179e811e8f5b9",
        "input": "0x",
        "maxFeePerBlobGas": undefined,
        "maxFeePerGas": 52n,
        "maxPriorityFeePerGas": 0n,
        "nonce": 0n,
        "r": 38885266474409614625227621611724570719292309861752108815266926328845485334960n,
        "s": 1679878097161792009952024493561086791213067999805727349270399592239671271019n,
        "to": "0x0000000000000000000000000000000000000000",
        "transactionIndex": null,
        "type": "feeToken",
        "typeHex": "0x77",
        "v": 28,
        "value": 0n,
        "yParity": 1,
      }
    `)
  })
})
