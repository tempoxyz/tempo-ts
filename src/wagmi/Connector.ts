import { Account, createTempoClient, WebAuthnP256 } from 'tempo.ts/viem'
import {
  type Address,
  type EIP1193Provider,
  getAddress,
  type Hex,
  type PrivateKeyAccount,
  SwitchChainError,
} from 'viem'
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'
import { ChainNotConfiguredError, createConnector } from 'wagmi'

/**
 * Connector for a Secp256k1 EOA.
 *
 * WARNING: NOT RECOMMENDED FOR PRODUCTION USAGE. 
 * This connector stores private keys in clear text, and are bound to the session
 * length of the storage used. 
 *
 * @returns Connector.
 */
export function dangerous_secp256k1() {
  let account: PrivateKeyAccount | undefined

  type Properties = {
    connect<withCapabilities extends boolean = false>(parameters: {
      chainId?: number | undefined
      create?: boolean | undefined
      isReconnecting?: boolean | undefined
      withCapabilities?: withCapabilities | boolean | undefined
    }): Promise<{
      accounts: withCapabilities extends true
      ? readonly { address: Address }[]
      : readonly Address[]
      chainId: number
    }>
  }
  type Provider = Pick<EIP1193Provider, 'request'>
  type StorageItem = {
    'secp256k1.activeAddress': Address
    'secp256k1.lastActiveAddress': Address
    [key: `secp256k1.${string}.privateKey`]: Hex
  }

  return createConnector<Provider, Properties, StorageItem>((config) => ({
    id: 'secp256k1',
    name: 'EOA (Secp256k1)',
    type: 'secp256k1',
    async setup() {
      const address = await config.storage?.getItem(
        'secp256k1.activeAddress',
      )
      const privateKey = await config.storage?.getItem(
        `secp256k1.${address}.privateKey`,
      )
      if (privateKey) account = privateKeyToAccount(privateKey)
    },
    async connect(parameters = {}) {
      const address = await (async () => {
        // Create account from private key
        if ('create' in parameters && parameters.create) {
          const privateKey = generatePrivateKey()
          const account = privateKeyToAccount(privateKey)
          const address = getAddress(account.address)
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
    onAccountsChanged() { },
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

      return createTempoClient({
        account,
        chain,
        transport,
      })
    },
    async getProvider({ chainId } = {}) {
      const { request } = await this.getClient!({ chainId })
      return { request }
    },
  }))
}

/**
 * Connector for a WebAuthn EOA.
 *
 * @returns Connector.
 */
export function webAuthn(options: webAuthn.Parameters = {}) {
  let account: Account.Account | undefined

  type Properties = {
    connect<withCapabilities extends boolean = false>(parameters: {
      chainId?: number | undefined
      create?: boolean | { name?: string | undefined } | undefined
      isReconnecting?: boolean | undefined
      withCapabilities?: withCapabilities | boolean | undefined
    }): Promise<{
      accounts: withCapabilities extends true
      ? readonly { address: Address }[]
      : readonly Address[]
      chainId: number
    }>
  }
  type Provider = Pick<EIP1193Provider, 'request'>
  type StorageItem = {
    'webAuthn.activeCredential': WebAuthnP256.P256Credential
    'webAuthn.lastActiveCredential': WebAuthnP256.P256Credential
    [key: `webAuthn.${string}.publicKey`]: Hex
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
      account ??= await (async () => {
        let credential: WebAuthnP256.P256Credential | undefined

        if ('create' in parameters && parameters.create) {
          // Create credential (sign up)
          const createOptions =
            typeof parameters.create === 'boolean' ? {} : parameters.create
          credential = await WebAuthnP256.createCredential({
            ...(options.createOptions ?? {}),
            user: {
              ...(options.createOptions?.user ?? {}),
              name:
                createOptions.name ??
                options.createOptions?.name ??
                `Account ${new Date().toISOString().split('T')[0]}`,
            } as never,
          })
          config.storage?.setItem(
            `webAuthn.${credential.id}.publicKey`,
            credential.publicKey,
          )
        } else {
          // Load credential (log in)
          credential = (await config.storage?.getItem(
            'webAuthn.activeCredential',
          )) as WebAuthnP256.P256Credential | undefined

          // If no active credential, load (last active, if present) credential from keychain.
          const lastActiveCredential = await config.storage?.getItem(
            'webAuthn.lastActiveCredential',
          )
          credential ??= await WebAuthnP256.getCredential({
            ...(options.getOptions ?? {}),
            credentialId: lastActiveCredential?.id,
            async getPublicKey(credential) {
              const publicKey = await config.storage?.getItem(
                `webAuthn.${credential.id}.publicKey`,
              )
              if (!publicKey) throw new Error('publicKey not found')
              return publicKey as Hex
            },
          })
        }

        config.storage?.setItem('webAuthn.activeCredential', credential)
        config.storage?.setItem('webAuthn.lastActiveCredential', credential)
        return Account.fromWebAuthnP256(credential)
      })()

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
    onAccountsChanged() { },
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

      return createTempoClient({
        account,
        chain,
        transport,
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
    createOptions?:
    | Pick<
      WebAuthnP256.createCredential.Parameters,
      'createFn' | 'name' | 'rp' | 'timeout' | 'user'
    >
    | undefined
    getOptions?:
    | Pick<WebAuthnP256.getCredential.Parameters, 'getFn' | 'rpId'>
    | undefined
  }
}
