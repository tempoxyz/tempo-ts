import * as Address from 'ox/Address'
import * as Bytes from 'ox/Bytes'
import type * as Hex from 'ox/Hex'
import * as PublicKey from 'ox/PublicKey'
import {
  createClient,
  type EIP1193Provider,
  getAddress,
  type LocalAccount,
  SwitchChainError,
} from 'viem'
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'
import { ChainNotConfiguredError, createConnector } from 'wagmi'
import type { OneOf } from '../internal/types.js'
import * as KeyAuthorization from '../ox/KeyAuthorization.js'
import * as SignatureEnvelope from '../ox/SignatureEnvelope.js'
import * as Account from '../viem/Account.js'
import type * as tempo_Chain from '../viem/Chain.js'
import * as Storage from '../viem/Storage.js'
import { walletNamespaceCompat } from '../viem/Transport.js'
import * as WebAuthnP256 from '../viem/WebAuthnP256.js'
import * as WebCryptoP256 from '../viem/WebCryptoP256.js'

type Chain = ReturnType<ReturnType<typeof tempo_Chain.define>>

/**
 * Connector for a Secp256k1 EOA.
 *
 * WARNING: NOT RECOMMENDED FOR PRODUCTION USAGE.
 * This connector stores private keys in clear text, and are bound to the session
 * length of the storage used.
 *
 * @returns Connector.
 */
export function dangerous_secp256k1(
  options: dangerous_secp256k1.Parameters = {},
) {
  let account: LocalAccount | undefined

  type Properties = {
    connect<withCapabilities extends boolean = false>(parameters: {
      capabilities?:
        | OneOf<
            | {
                type: 'sign-up'
              }
            | {}
          >
        | undefined
      chainId?: number | undefined
      isReconnecting?: boolean | undefined
      withCapabilities?: withCapabilities | boolean | undefined
    }): Promise<{
      accounts: readonly Address.Address[]
      chainId: number
    }>
  }
  type Provider = Pick<EIP1193Provider, 'request'>
  type StorageItem = {
    'secp256k1.activeAddress': Address.Address
    'secp256k1.lastActiveAddress': Address.Address
    [key: `secp256k1.${string}.privateKey`]: Hex.Hex
  }

  return createConnector<Provider, Properties, StorageItem>((config) => ({
    id: 'secp256k1',
    name: 'EOA (Secp256k1)',
    type: 'secp256k1',
    async setup() {
      const address = await config.storage?.getItem('secp256k1.activeAddress')
      const privateKey = await config.storage?.getItem(
        `secp256k1.${address}.privateKey`,
      )
      if (privateKey) account = privateKeyToAccount(privateKey)
      else if (
        address &&
        options.account &&
        Address.isEqual(address, options.account.address)
      )
        account = options.account
    },
    async connect(parameters = {}) {
      const address = await (async () => {
        if (
          'capabilities' in parameters &&
          parameters.capabilities?.type === 'sign-up'
        ) {
          const privateKey = generatePrivateKey()
          const account = privateKeyToAccount(privateKey)
          const address = account.address
          await config.storage?.setItem(
            `secp256k1.${address}.privateKey`,
            privateKey,
          )
          await config.storage?.setItem('secp256k1.activeAddress', address)
          await config.storage?.setItem('secp256k1.lastActiveAddress', address)
          return address
        }

        const address = await config.storage?.getItem(
          'secp256k1.lastActiveAddress',
        )
        const privateKey = await config.storage?.getItem(
          `secp256k1.${address}.privateKey`,
        )

        if (privateKey) account = privateKeyToAccount(privateKey)
        else if (options.account) {
          account = options.account
          await config.storage?.setItem(
            'secp256k1.lastActiveAddress',
            account.address,
          )
        }

        if (!account) throw new Error('account not found.')

        await config.storage?.setItem(
          'secp256k1.activeAddress',
          account.address,
        )
        return account.address
      })()

      const chainId = parameters.chainId ?? config.chains[0]?.id
      if (!chainId) throw new ChainNotConfiguredError()

      return {
        accounts: (parameters.withCapabilities
          ? [{ address }]
          : [address]) as never,
        chainId,
      }
    },
    async disconnect() {
      await config.storage?.removeItem('secp256k1.activeAddress')
      account = undefined
    },
    async getAccounts() {
      if (!account) return []
      return [getAddress(account.address)]
    },
    async getChainId() {
      return config.chains[0]?.id!
    },
    async isAuthorized() {
      try {
        const accounts = await this.getAccounts()
        return !!accounts.length
      } catch (error) {
        console.error(
          'Connector.secp256k1: Failed to check authorization',
          error,
        )
        return false
      }
    },
    async switchChain({ chainId }) {
      const chain = config.chains.find((chain) => chain.id === chainId)
      if (!chain) throw new SwitchChainError(new ChainNotConfiguredError())
      return chain
    },
    onAccountsChanged() {},
    onChainChanged(chain) {
      const chainId = Number(chain)
      config.emitter.emit('change', { chainId })
    },
    async onDisconnect() {
      config.emitter.emit('disconnect')
      account = undefined
    },
    async getClient({ chainId } = {}) {
      const chain =
        config.chains.find((x) => x.id === chainId) ?? config.chains[0]
      if (!chain) throw new ChainNotConfiguredError()

      const transports = config.transports
      if (!transports) throw new ChainNotConfiguredError()

      const transport = transports[chain.id]
      if (!transport) throw new ChainNotConfiguredError()

      return createClient({
        account,
        chain: chain as Chain,
        transport: walletNamespaceCompat(transport),
      })
    },
    async getProvider({ chainId } = {}) {
      const { request } = await this.getClient!({ chainId })
      return { request }
    },
  }))
}

export declare namespace dangerous_secp256k1 {
  export type Parameters = {
    account?: LocalAccount | undefined
  }
}

/**
 * Connector for a WebAuthn EOA.
 *
 * @returns Connector.
 */
export function webAuthn(options: webAuthn.Parameters = {}) {
  let account: Account.RootAccount | undefined
  let accessKey: Account.AccessKeyAccount | undefined

  const idbStorage = Storage.idb<{
    [key: `accessKey:${string}`]: WebCryptoP256.createKeyPair.ReturnType
  }>()

  type Properties = {
    connect<withCapabilities extends boolean = false>(parameters: {
      chainId?: number | undefined
      capabilities?:
        | OneOf<
            | {
                label?: string | undefined
                type: 'sign-up'
              }
            | {
                selectAccount?: boolean | undefined
                type: 'sign-in'
              }
            | {}
          >
        | undefined
      isReconnecting?: boolean | undefined
      withCapabilities?: withCapabilities | boolean | undefined
    }): Promise<{ accounts: readonly Address.Address[]; chainId: number }>
  }
  type Provider = Pick<EIP1193Provider, 'request'>
  type StorageItem = {
    'webAuthn.activeCredential': WebAuthnP256.P256Credential
    'webAuthn.lastActiveCredential': WebAuthnP256.P256Credential
    [key: `webAuthn.publicKey.${string}`]: Hex.Hex
  }

  return createConnector<Provider, Properties, StorageItem>((config) => ({
    id: 'webAuthn',
    name: 'EOA (WebAuthn)',
    type: 'webAuthn',
    async setup() {
      const credential = await config.storage?.getItem(
        'webAuthn.activeCredential',
      )
      if (!credential) return
      account = Account.fromWebAuthnP256(credential)
    },
    async connect(parameters = {}) {
      const { grantAccessKey = false } = options
      const capabilities =
        'capabilities' in parameters ? (parameters.capabilities ?? {}) : {}

      // We are going to need to find:
      // - a WebAuthn `credential` to instantiate an account
      // - optionally, a `keyPair` to use as the access key for the account
      // - optionally, a signed `keyAuthorization` to provision the access key
      const { credential, keyAuthorization, keyPair } = await (async () => {
        // If the connection type is of "sign-up", we are going to create a new credential
        // and provision an access key (if needed).
        if (capabilities.type === 'sign-up') {
          const challenge = await options.createOptions?.getChallenge?.()
          const label =
            capabilities.label ??
            options.createOptions?.label ??
            new Date().toISOString()
          const rpId = options.createOptions?.rpId ?? options.rpId
          const credential = await WebAuthnP256.createCredential({
            ...(options.createOptions ?? {}),
            challenge: challenge
              ? new Uint8Array(Bytes.fromHex(challenge))
              : undefined,
            label,
            rpId,
          })
          config.storage?.setItem(
            `webAuthn.publicKey.${credential.id}`,
            credential.publicKey,
          )

          // Get key pair (access key) to use for the account.
          const keyPair = await (async () => {
            if (!grantAccessKey) return undefined
            return await WebCryptoP256.createKeyPair()
          })()

          return { credential, keyPair }
        }

        // If we are not selecting an account, we will check if an active credential is present in
        // storage and if so, we will use it to instantiate an account.
        if (!capabilities.selectAccount) {
          const credential = (await config.storage?.getItem(
            'webAuthn.activeCredential',
          )) as WebAuthnP256.getCredential.ReturnValue | undefined

          if (credential) {
            // Get key pair (access key) to use for the account.
            const keyPair = await (async () => {
              if (!grantAccessKey) return undefined
              const address = Address.fromPublicKey(
                PublicKey.fromHex(credential.publicKey),
              )
              return await idbStorage.getItem(`accessKey:${address}`)
            })()

            // If the access key policy is lax, return the credential and key pair (if exists).
            if (grantAccessKey === 'lax') return { credential, keyPair }

            // If a key pair is found, return the credential and key pair.
            if (keyPair) return { credential, keyPair }

            // If we are reconnecting, throw an error if not found.
            if (parameters.isReconnecting)
              throw new Error('credential not found.')

            // Otherwise, we want to continue to sign up or register against new key pair.
          }
        }

        // Discover credential
        {
          // Get key pair (access key) to use for the account.
          const keyPair = await (async () => {
            if (!grantAccessKey) return undefined
            return await WebCryptoP256.createKeyPair()
          })()

          // If we are provisioning an access key, we will need to sign a key authorization.
          // We will need the hash (digest) to sign, and the address of the access key to construct the key authorization.
          const { accessKeyAddress, hash } = await (async () => {
            if (!keyPair)
              return { accessKeyAddress: undefined, hash: undefined }
            const accessKeyAddress = Address.fromPublicKey(keyPair.publicKey)
            const hash = KeyAuthorization.getSignPayload({
              address: accessKeyAddress,
              type: 'p256',
            })
            return { accessKeyAddress, hash, keyPair }
          })()

          // If no active credential, we will attempt to load the last active credential from storage.
          const lastActiveCredential = !capabilities.selectAccount
            ? await config.storage?.getItem('webAuthn.lastActiveCredential')
            : undefined
          const credential = await WebAuthnP256.getCredential({
            ...(options.getOptions ?? {}),
            credentialId: lastActiveCredential?.id,
            async getPublicKey(credential) {
              {
                const publicKey =
                  await options.getOptions?.getPublicKey?.(credential)
                if (publicKey) return publicKey
              }

              {
                const publicKey = await config.storage?.getItem(
                  `webAuthn.publicKey.${credential.id}`,
                )
                if (!publicKey) throw new Error('publicKey not found')
                return publicKey as Hex.Hex
              }
            },
            hash,
            rpId: options.getOptions?.rpId ?? options.rpId,
          })

          const keyAuthorization = accessKeyAddress
            ? KeyAuthorization.from({
                address: accessKeyAddress,
                signature: SignatureEnvelope.from({
                  metadata: credential.metadata,
                  signature: credential.signature,
                  publicKey: PublicKey.fromHex(credential.publicKey),
                  type: 'webAuthn',
                }),
                type: 'p256',
              })
            : undefined

          return { credential, keyAuthorization, keyPair }
        }
      })()

      config.storage?.setItem('webAuthn.lastActiveCredential', credential)
      config.storage?.setItem('webAuthn.activeCredential', credential)

      account = Account.fromWebAuthnP256(credential, {
        storage: Storage.from(config.storage as never),
      })

      if (keyPair) {
        accessKey = Account.fromWebCryptoP256(keyPair, {
          access: account,
          storage: Storage.from(config.storage as never),
        })

        // If we are not reconnecting, orchestrate the provisioning of the access key.
        if (!parameters.isReconnecting) {
          const keyAuth =
            keyAuthorization ?? (await account.signKeyAuthorization(accessKey))

          await account.storage.setItem('pendingKeyAuthorization', keyAuth)
          await idbStorage.setItem(
            `accessKey:${account.address.toLowerCase()}`,
            keyPair,
          )
        }
        // If we are granting an access key, throw an error if the access key is not provisioned.
      } else if (grantAccessKey === true) {
        await config.storage?.removeItem('webAuthn.activeCredential')
        throw new Error('access key not found')
      }

      const address = getAddress(account.address)

      const chainId = parameters.chainId ?? config.chains[0]?.id
      if (!chainId) throw new ChainNotConfiguredError()

      return {
        accounts: (parameters.withCapabilities
          ? [{ address }]
          : [address]) as never,
        chainId,
      }
    },
    async disconnect() {
      await config.storage?.removeItem('webAuthn.activeCredential')
      account = undefined
    },
    async getAccounts() {
      if (!account) return []
      return [getAddress(account.address)]
    },
    async getChainId() {
      return config.chains[0]?.id!
    },
    async isAuthorized() {
      try {
        const accounts = await this.getAccounts()
        return !!accounts.length
      } catch (error) {
        console.error(
          'Connector.webAuthn: Failed to check authorization',
          error,
        )
        return false
      }
    },
    async switchChain({ chainId }) {
      const chain = config.chains.find((chain) => chain.id === chainId)
      if (!chain) throw new SwitchChainError(new ChainNotConfiguredError())
      return chain
    },
    onAccountsChanged() {},
    onChainChanged(chain) {
      const chainId = Number(chain)
      config.emitter.emit('change', { chainId })
    },
    async onDisconnect() {
      config.emitter.emit('disconnect')
      account = undefined
    },
    async getClient({ chainId } = {}) {
      const chain =
        config.chains.find((x) => x.id === chainId) ?? config.chains[0]
      if (!chain) throw new ChainNotConfiguredError()

      const transports = config.transports
      if (!transports) throw new ChainNotConfiguredError()

      const transport = transports[chain.id]
      if (!transport) throw new ChainNotConfiguredError()

      return createClient({
        account: accessKey ?? account,
        chain: chain as Chain,
        transport: walletNamespaceCompat(transport),
      })
    },
    async getProvider({ chainId } = {}) {
      const { request } = await this.getClient!({ chainId })
      return { request }
    },
  }))
}

export declare namespace webAuthn {
  export type Parameters = {
    /** Options for WebAuthn registration. */
    createOptions?:
      | (Pick<
          WebAuthnP256.createCredential.Parameters,
          'createFn' | 'label' | 'rpId' | 'userId' | 'timeout'
        > & {
          /** Function to fetch a challenge to sign over at registration. */
          getChallenge?: (() => Promise<Hex.Hex>) | undefined
        })
      | undefined
    /** Options for WebAuthn authentication. */
    getOptions?:
      | (Pick<WebAuthnP256.getCredential.Parameters, 'getFn' | 'rpId'> & {
          /** Function to fetch the public key for a credential. */
          getPublicKey?:
            | WebAuthnP256.getCredential.Parameters['getPublicKey']
            | undefined
        })
      | undefined
    /**
     * Whether or not to grant an access key upon connection.
     *
     * - `true`: The account MUST have an access key provisioned.
     *   On failure, the connection will fail.
     * - `"lax"`: The account MAY have an access key provisioned.
     *   On failure, the connection will succeed, but the access key will not be provisioned
     *   and must be provisioned manually if the user wants to enforce access keys.
     * - `false`: The account WILL NOT have an access key provisioned. The access key must be
     *   provisioned manually if the user wants to enforce access keys.
     *
     * @default false
     */
    grantAccessKey?: boolean | 'lax'
    /** The RP ID to use for WebAuthn. */
    rpId?: string | undefined
  }
}
