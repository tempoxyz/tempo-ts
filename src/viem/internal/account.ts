import * as Address from 'ox/Address'
import * as Hex from 'ox/Hex'
import * as PublicKey from 'ox/PublicKey'
import type { LocalAccount, Account as viem_Account } from 'viem'
import {
  hashAuthorization,
  hashMessage,
  hashTypedData,
  keccak256,
  parseAccount,
} from 'viem/utils'
import type { RequiredBy } from '../../internal/types.js'
import * as SignatureEnvelope from '../../ox/SignatureEnvelope.js'
import * as Transaction from '../Transaction.js'
import * as KeyAuthorization from '../../ox/KeyAuthorization.js'

export type Account = RequiredBy<LocalAccount, 'sign' | 'signAuthorization'> & {
  /** Key type. */
  keyType: SignatureEnvelope.Type
  /** Parent address. */
  parentAddress?: Address.Address | undefined
  /** Sign key authorization. */
  signKeyAuthorization: (
    parameters: Pick<KeyAuthorization.KeyAuthorization, 'expiry' | 'limits'> & {
      key: Pick<Account, 'address' | 'keyType'>
    },
  ) => Promise<KeyAuthorization.Signed>
}

/** @internal */
export function toPrivateKeyAccount(
  parameters: toPrivateKeyAccount.Parameters,
): toPrivateKeyAccount.ReturnValue {
  const { keyType = 'secp256k1', parent, source = 'privateKey' } = parameters
  const address = Address.fromPublicKey(parameters.publicKey)
  const publicKey = PublicKey.toHex(parameters.publicKey, {
    includePrefix: false,
  })

  const { address: parentAddress } = parent
    ? parseAccount(parent)
    : { address: undefined }

  async function sign({ hash }: { hash: Hex.Hex }) {
    const signature = await parameters.sign({ hash })
    if (parentAddress) {
      return SignatureEnvelope.serialize(
        SignatureEnvelope.from({
          userAddress: parentAddress,
          inner: SignatureEnvelope.from(signature),
          type: 'keychain',
        }),
      )
    }
    return signature
  }

  return {
    address,
    keyType,
    parentAddress,
    sign,
    async signAuthorization(parameters) {
      if (parent) throw new Error('Access keys cannot sign authorizations.')

      const { chainId, nonce } = parameters
      const address = parameters.contractAddress ?? parameters.address
      const signature = await sign({
        hash: hashAuthorization({ address, chainId, nonce }),
      })
      const envelope = SignatureEnvelope.from(signature)
      if (envelope.type !== 'secp256k1')
        throw new Error(
          'Unsupported signature type. Expected `secp256k1` but got `' +
            envelope.type +
            '`.',
        )
      const { r, s, yParity } = envelope.signature
      return {
        address,
        chainId,
        nonce,
        r: Hex.fromNumber(r, { size: 32 }),
        s: Hex.fromNumber(s, { size: 32 }),
        yParity,
      }
    },
    async signMessage(parameters) {
      if (parent) throw new Error('Access keys cannot sign messages.')

      const { message } = parameters
      const signature = await sign({ hash: hashMessage(message) })
      const envelope = SignatureEnvelope.from(signature)
      if (envelope.type !== 'secp256k1')
        throw new Error(
          'Unsupported signature type. Expected `secp256k1` but got `' +
            envelope.type +
            '`.',
        )
      return SignatureEnvelope.serialize(envelope)
    },
    async signKeyAuthorization(parameters) {
      if (parent) throw new Error('Access keys cannot sign key authorizations.')

      const { key, expiry, limits } = parameters
      const { address, keyType: type } = key

      const signature = await sign({
        hash: KeyAuthorization.getSignPayload({
          address,
          expiry,
          limits,
          type,
        }),
      })
      return KeyAuthorization.from({
        address,
        expiry,
        limits,
        signature: SignatureEnvelope.from(signature),
        type,
      })
    },
    async signTransaction(transaction, options) {
      const { serializer = Transaction.serialize } = options ?? {}
      const signature = await sign({
        hash: keccak256(await serializer(transaction)),
      })
      const envelope = SignatureEnvelope.from(signature)
      return await serializer(transaction, envelope as never)
    },
    async signTypedData(typedData) {
      if (parent) throw new Error('Access keys cannot sign typed data.')

      const signature = await sign({ hash: hashTypedData(typedData) })
      const envelope = SignatureEnvelope.from(signature)
      if (envelope.type !== 'secp256k1')
        throw new Error(
          'Unsupported signature type. Expected `secp256k1` but got `' +
            envelope.type +
            '`.',
        )
      return SignatureEnvelope.serialize(envelope)
    },
    publicKey,
    source: parent ? 'keychain' : source,
    type: 'local',
  }
}

export declare namespace toPrivateKeyAccount {
  export type Parameters = {
    /**
     * Parent account.
     * If defined, this account will act as an "access key", and use
     * the parent account's address as the keychain address.
     */
    parent?: viem_Account | Address.Address | undefined
    /** Public key. */
    publicKey: PublicKey.PublicKey
    /** Key type. */
    keyType?: SignatureEnvelope.Type | undefined
    /** Sign function. */
    sign: NonNullable<LocalAccount['sign']>
    /** Source. */
    source?: string | undefined
  }

  export type ReturnValue = Account
}
