import * as Hex from 'ox/Hex'
import * as PublicKey from 'ox/PublicKey'
import type { LocalAccount } from 'viem'
import {
  hashAuthorization,
  hashMessage,
  hashTypedData,
  keccak256,
} from 'viem/utils'
import type { RequiredBy } from '../../internal/types.js'
import * as SignatureEnvelope from '../../ox/SignatureEnvelope.js'
import * as Transaction from '../Transaction.js'

// TODO: this function will be redundant when Viem migrates to Ox.
/** @internal */
export function toPrivateKeyAccount(
  parameters: toPrivateKeyAccount.Parameters,
): toPrivateKeyAccount.ReturnValue {
  const { address, sign, source = 'privateKey' } = parameters
  const publicKey = PublicKey.toHex(parameters.publicKey, {
    includePrefix: false,
  })
  return {
    address,
    sign,
    async signAuthorization(parameters) {
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
    async signTransaction(transaction) {
      const signature = await sign({
        hash: keccak256(await Transaction.serialize(transaction)),
      })
      const envelope = SignatureEnvelope.from(signature)
      return await Transaction.serialize(transaction, envelope)
    },
    async signTypedData(typedData) {
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
    source,
    type: 'local',
  }
}

export declare namespace toPrivateKeyAccount {
  export type Parameters = {
    /** Address. */
    address: Hex.Hex
    /** Public key. */
    publicKey: PublicKey.PublicKey
    /** Sign function. */
    sign: NonNullable<LocalAccount['sign']>
    /** Source. */
    source?: string | undefined
  }

  export type ReturnValue = RequiredBy<
    Omit<LocalAccount, 'signTransaction'>,
    'sign' | 'signAuthorization'
  > & {
    signTransaction: (
      transaction: Transaction.TransactionSerializable,
    ) => Promise<Hex.Hex>
  }
}
