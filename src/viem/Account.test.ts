import { Hex, Value, WebCryptoP256 } from 'ox'
import { describe, expect, test } from 'vitest'
import * as Account from './Account.js'
import * as SignatureEnvelope from '../ox/SignatureEnvelope.js'

const privateKey_secp256k1 =
  '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'
const privateKey_p256 =
  '0x5c878151adef73f88b1c360d33e9bf9dd1b6e2e0e07bc555fc33cb8cf6bc9b28'

describe('fromSecp256k1', () => {
  test('default', async () => {
    const account = Account.fromSecp256k1(privateKey_secp256k1)
    expect(account).toMatchInlineSnapshot(`
      {
        "address": "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
        "keyType": "secp256k1",
        "parentAddress": undefined,
        "publicKey": "0x8318535b54105d4a7aae60c08fc45f9687181b4fdfc625bd1a753fa7397fed753547f11ca8696646f2f3acb08e31016afac23e630c5d11f59f61fef57b0d2aa5",
        "sign": [Function],
        "signAuthorization": [Function],
        "signKeyAuthorization": [Function],
        "signMessage": [Function],
        "signTransaction": [Function],
        "signTypedData": [Function],
        "source": "privateKey",
        "type": "local",
      }
    `)

    const signature = await account.sign({
      hash: '0xdeadbeef',
    })
    expect(signature).toMatchInlineSnapshot(
      `"0xfa78c5905fb0b9d6066ef531f962a62bc6ef0d5eb59ecb134056d206f75aaed7780926ff2601a935c2c79707d9e1799948c9f19dcdde1e090e903b19a07923d01c"`,
    )
    expect(SignatureEnvelope.deserialize(signature)).toMatchInlineSnapshot(`
      {
        "signature": {
          "r": 113291597329930009559670063131885256927775966057121513567941051428123344285399n,
          "s": 54293712598725100598138577281441749550405991478212695085505730636505228583888n,
          "yParity": 1,
        },
        "type": "secp256k1",
      }
    `)
  })

  test('behavior: access key', async () => {
    const account = Account.fromSecp256k1(privateKey_secp256k1)
    const access = Account.fromSecp256k1(
      '0x06a952d58c24d287245276dd8b4272d82a921d27d90874a6c27a3bc19ff4bfde',
      {
        parent: account,
      },
    )

    const signature = await access.sign({
      hash: '0xdeadbeef',
    })
    expect(signature).toMatchInlineSnapshot(
      `"0x03f39fd6e51aad88f6f4ce6ab8827279cfffb9226627c4025daa5c473942fd6282cfb7c07edb48a1764fb3c228fc094a715300e0e56fcf8a7849bb8bcc2938d8a041fdbce56d2b6c70aadbae6a0b70b4a1e98256161b"`,
    )
    expect(SignatureEnvelope.deserialize(signature)).toMatchInlineSnapshot(`
      {
        "inner": {
          "signature": {
            "r": 17986519448152736741806679848301503760738507672285374215138617395147700232421n,
            "s": 50573419219106101097329274608677894804280434221354410855341207650465321473558n,
            "yParity": 0,
          },
          "type": "secp256k1",
        },
        "type": "keychain",
        "userAddress": "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
      }
    `)
  })
})

describe('fromP256', () => {
  test('default', async () => {
    const account = Account.fromP256(privateKey_p256)
    expect(account).toMatchInlineSnapshot(`
      {
        "address": "0xc3cf8b814b729a1ad648b49fbbded3767bcd35fd",
        "keyType": "p256",
        "parentAddress": undefined,
        "publicKey": "0x20fe09fa1af47a6b3b4e973040f0588a1c2c96df1ce78b10e50903566ad9b7d87ffe0b281b616196c2ccdb64cd51230d8dc1f1d258ca7e8cb33a63cf8c812240",
        "sign": [Function],
        "signAuthorization": [Function],
        "signKeyAuthorization": [Function],
        "signMessage": [Function],
        "signTransaction": [Function],
        "signTypedData": [Function],
        "source": "p256",
        "type": "local",
      }
    `)

    const signature = await account.sign({
      hash: '0xdeadbeef',
    })
    expect(signature).toMatchInlineSnapshot(
      `"0x01daab749a3dea3f76c52ff0cfc86f0d433ecaf4d20f2ea327042bf5c15bccf847098dc3591fc68bf94d8db6d16cf326808dbf0f44d8e8373e8a7fcaf39b38281020fe09fa1af47a6b3b4e973040f0588a1c2c96df1ce78b10e50903566ad9b7d87ffe0b281b616196c2ccdb64cd51230d8dc1f1d258ca7e8cb33a63cf8c81224000"`,
    )
  })

  test('behavior: access key', async () => {
    const account = Account.fromP256(privateKey_p256)
    const access = Account.fromP256(
      '0x5c878151adef73f88b1c360d33e9bf9dd1b6e2e0e07bc555fc33cb8cf6bc9b28',
      {
        parent: account,
      },
    )

    const signature = await access.sign({
      hash: '0xdeadbeef',
    })
    expect(signature).toMatchInlineSnapshot(
      `"0x03c3cf8b814b729a1ad648b49fbbded3767bcd35fd01daab749a3dea3f76c52ff0cfc86f0d433ecaf4d20f2ea327042bf5c15bccf847098dc3591fc68bf94d8db6d16cf326808dbf0f44d8e8373e8a7fcaf39b38281020fe09fa1af47a6b3b4e973040f0588a1c2c96df1ce78b10e50903566ad9b7d87ffe0b281b616196c2ccdb64cd51230d8dc1f1d258ca7e8cb33a63cf8c81224000"`,
    )
    expect(SignatureEnvelope.deserialize(signature)).toMatchInlineSnapshot(`
      {
        "inner": {
          "prehash": false,
          "publicKey": {
            "prefix": 4,
            "x": 14922859167660714031319135249406228569331107293314503672038378501577989797848n,
            "y": 57892587925019714505251703757706314187537979987563648366993255393643804566080n,
          },
          "signature": {
            "r": 98907136600157604623356371387339224256063842362088951992859252568183251204167n,
            "s": 4321289316702385668777418513388640777474210589895706234285069930616319387664n,
          },
          "type": "p256",
        },
        "type": "keychain",
        "userAddress": "0xc3cf8b814b729a1ad648b49fbbded3767bcd35fd",
      }
    `)
  })
})

describe('fromHeadlessWebAuthn', () => {
  test('default', async () => {
    const account = Account.fromHeadlessWebAuthn(privateKey_p256, {
      rpId: 'localhost',
      origin: 'http://localhost',
    })
    expect(account).toMatchInlineSnapshot(`
      {
        "address": "0xc3cf8b814b729a1ad648b49fbbded3767bcd35fd",
        "keyType": "webAuthn",
        "parentAddress": undefined,
        "publicKey": "0x20fe09fa1af47a6b3b4e973040f0588a1c2c96df1ce78b10e50903566ad9b7d87ffe0b281b616196c2ccdb64cd51230d8dc1f1d258ca7e8cb33a63cf8c812240",
        "sign": [Function],
        "signAuthorization": [Function],
        "signKeyAuthorization": [Function],
        "signMessage": [Function],
        "signTransaction": [Function],
        "signTypedData": [Function],
        "source": "webAuthn",
        "type": "local",
      }
    `)

    const signature = await account.sign({
      hash: '0xdeadbeef',
    })
    expect(signature).toMatchInlineSnapshot(
      `"0x0249960de5880e8c687434170f6476605b8fe4aeb9a28632c7995cf3ba831d976305000000007b2274797065223a22776562617574686e2e676574222c226368616c6c656e6765223a223371322d3777222c226f726967696e223a22687474703a2f2f6c6f63616c686f7374222c2263726f73734f726967696e223a66616c73657d1b3346991a9ad1498e401dc0448e93d1bde113778d442f5bcafc44925cf3121961e9b1c21b054e54fe6c2eec0cd310c8535b7e7dd1f7dd7bf749e6d78154b48120fe09fa1af47a6b3b4e973040f0588a1c2c96df1ce78b10e50903566ad9b7d87ffe0b281b616196c2ccdb64cd51230d8dc1f1d258ca7e8cb33a63cf8c812240"`,
    )
  })

  test('behavior: access key', async () => {
    const account = Account.fromHeadlessWebAuthn(privateKey_p256, {
      rpId: 'localhost',
      origin: 'http://localhost',
    })
    const access = Account.fromHeadlessWebAuthn(privateKey_p256, {
      parent: account,
      rpId: 'localhost',
      origin: 'http://localhost',
    })

    const signature = await access.sign({
      hash: '0xdeadbeef',
    })
    expect(signature).toMatchInlineSnapshot(
      `"0x03c3cf8b814b729a1ad648b49fbbded3767bcd35fd0249960de5880e8c687434170f6476605b8fe4aeb9a28632c7995cf3ba831d976305000000007b2274797065223a22776562617574686e2e676574222c226368616c6c656e6765223a223371322d3777222c226f726967696e223a22687474703a2f2f6c6f63616c686f7374222c2263726f73734f726967696e223a66616c73657d1b3346991a9ad1498e401dc0448e93d1bde113778d442f5bcafc44925cf3121961e9b1c21b054e54fe6c2eec0cd310c8535b7e7dd1f7dd7bf749e6d78154b48120fe09fa1af47a6b3b4e973040f0588a1c2c96df1ce78b10e50903566ad9b7d87ffe0b281b616196c2ccdb64cd51230d8dc1f1d258ca7e8cb33a63cf8c812240"`,
    )
    expect(SignatureEnvelope.deserialize(signature)).toMatchInlineSnapshot(`
      {
        "inner": {
          "metadata": {
            "authenticatorData": "0x49960de5880e8c687434170f6476605b8fe4aeb9a28632c7995cf3ba831d97630500000000",
            "clientDataJSON": "{"type":"webauthn.get","challenge":"3q2-7w","origin":"http://localhost","crossOrigin":false}",
          },
          "publicKey": {
            "prefix": 4,
            "x": 14922859167660714031319135249406228569331107293314503672038378501577989797848n,
            "y": 57892587925019714505251703757706314187537979987563648366993255393643804566080n,
          },
          "signature": {
            "r": 12303043361969813321008510595799352303777626167191077212436720864556362175001n,
            "s": 44287248520848853208449965274039658906134850867725872574460252467151437608065n,
          },
          "type": "webAuthn",
        },
        "type": "keychain",
        "userAddress": "0xc3cf8b814b729a1ad648b49fbbded3767bcd35fd",
      }
    `)
  })
})

describe('fromWebCryptoP256', () => {
  test('default', async () => {
    const keyPair = await WebCryptoP256.createKeyPair()
    const account = Account.fromWebCryptoP256(keyPair)
    expect(account.source).toBe('p256')
  })
})

describe('signKeyAuthorization', () => {
  test('secp256k1', async () => {
    const account = Account.fromSecp256k1(privateKey_secp256k1)
    const key = Account.fromSecp256k1(privateKey_secp256k1)

    const authorization = await account.signKeyAuthorization({
      expiry: 1234567890,
      key,
      limits: [
        {
          token: '0x20c0000000000000000000000000000000000001',
          limit: Value.from('10', 6),
        },
      ],
    })
    expect(authorization).toMatchInlineSnapshot(`
      {
        "address": "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
        "expiry": 1234567890,
        "limits": [
          {
            "limit": 10000000n,
            "token": "0x20c0000000000000000000000000000000000001",
          },
        ],
        "signature": {
          "signature": {
            "r": 17830338700299139354893598525373948287916133106642554227698432804910838571643n,
            "s": 5969958834757732989947551458790188313558742478368708500641251603136513224372n,
            "yParity": 1,
          },
          "type": "secp256k1",
        },
        "type": "secp256k1",
      }
    `)
  })

  test('p256', async () => {
    const account = Account.fromP256(privateKey_p256)
    const key = Account.fromSecp256k1(privateKey_p256)

    const authorization = await account.signKeyAuthorization({
      expiry: 1234567890,
      key,
      limits: [
        {
          token: '0x20c0000000000000000000000000000000000001',
          limit: Value.from('10', 6),
        },
      ],
    })
    expect(authorization).toMatchInlineSnapshot(`
      {
        "address": "0x7b9f73245dee5855ef858f5c00eea6205f9bb4d2",
        "expiry": 1234567890,
        "limits": [
          {
            "limit": 10000000n,
            "token": "0x20c0000000000000000000000000000000000001",
          },
        ],
        "signature": {
          "prehash": false,
          "publicKey": {
            "prefix": 4,
            "x": 14922859167660714031319135249406228569331107293314503672038378501577989797848n,
            "y": 57892587925019714505251703757706314187537979987563648366993255393643804566080n,
          },
          "signature": {
            "r": 20196596160761689661199970003242669268985095205260632048894484134977096593210n,
            "s": 41951093387293646495983366737242027653135648960329472457674570163456692390643n,
          },
          "type": "p256",
        },
        "type": "secp256k1",
      }
    `)
  })

  test('webAuthn', async () => {
    const account = Account.fromHeadlessWebAuthn(privateKey_p256, {
      rpId: 'localhost',
      origin: 'http://localhost',
    })
    const key = Account.fromSecp256k1(privateKey_secp256k1)

    const authorization = await account.signKeyAuthorization({
      expiry: 1234567890,
      key,
      limits: [
        {
          token: '0x20c0000000000000000000000000000000000001',
          limit: Value.from('10', 6),
        },
      ],
    })
    expect(authorization).toMatchInlineSnapshot(`
      {
        "address": "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
        "expiry": 1234567890,
        "limits": [
          {
            "limit": 10000000n,
            "token": "0x20c0000000000000000000000000000000000001",
          },
        ],
        "signature": {
          "metadata": {
            "authenticatorData": "0x49960de5880e8c687434170f6476605b8fe4aeb9a28632c7995cf3ba831d97630500000000",
            "clientDataJSON": "{"type":"webauthn.get","challenge":"huYxX_6d5kCzTfgQEfE6WR7-kEqWfvYnx3fBixcTbrM","origin":"http://localhost","crossOrigin":false}",
          },
          "publicKey": {
            "prefix": 4,
            "x": 14922859167660714031319135249406228569331107293314503672038378501577989797848n,
            "y": 57892587925019714505251703757706314187537979987563648366993255393643804566080n,
          },
          "signature": {
            "r": 98443286536384033749410066340754083364053641480649775009125504708424327017855n,
            "s": 42045349835592591269302868339985511279359127742997953345788675735964159176557n,
          },
          "type": "webAuthn",
        },
        "type": "secp256k1",
      }
    `)
  })

  test('multiple limits', async () => {
    const account = Account.fromSecp256k1(privateKey_secp256k1)
    const key = Account.fromSecp256k1(privateKey_secp256k1)

    const authorization = await account.signKeyAuthorization({
      expiry: 1234567890,
      key,
      limits: [
        {
          token: '0x20c0000000000000000000000000000000000001',
          limit: Value.from('10', 6),
        },
        {
          token: '0x20c0000000000000000000000000000000000002',
          limit: Value.from('20', 6),
        },
      ],
    })
    expect(authorization).toMatchInlineSnapshot(`
      {
        "address": "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
        "expiry": 1234567890,
        "limits": [
          {
            "limit": 10000000n,
            "token": "0x20c0000000000000000000000000000000000001",
          },
          {
            "limit": 20000000n,
            "token": "0x20c0000000000000000000000000000000000002",
          },
        ],
        "signature": {
          "signature": {
            "r": 110688399609937572552832643524108011859846253570894320670016520311505218610759n,
            "s": 4353629559496072529152967720041857644506920584336192730455606151402440838660n,
            "yParity": 0,
          },
          "type": "secp256k1",
        },
        "type": "secp256k1",
      }
    `)
  })

  test('empty', async () => {
    const account = Account.fromSecp256k1(privateKey_secp256k1)
    const key = Account.fromSecp256k1(privateKey_secp256k1)

    const authorization = await account.signKeyAuthorization({
      key,
    })

    expect(authorization).toMatchInlineSnapshot(`
      {
        "address": "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
        "expiry": undefined,
        "limits": undefined,
        "signature": {
          "signature": {
            "r": 37721136119011284096548390014992539348972503060868580949468237988268103471791n,
            "s": 45950071562708881433730007694361667669997383811671320041865921767315547275450n,
            "yParity": 1,
          },
          "type": "secp256k1",
        },
        "type": "secp256k1",
      }
    `)
  })
})
