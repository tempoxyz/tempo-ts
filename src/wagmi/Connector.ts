import { Account, createTempoClient, WebAuthnP256 } from 'tempo.ts/viem'
import {
  type Address,
  type EIP1193Provider,
  getAddress,
  type Hex,
  SwitchChainError,
} from 'viem'
import { ChainNotConfiguredError, createConnector } from 'wagmi'

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
      create?: boolean | { label?: string | undefined } | undefined
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
    currentCredential: WebAuthnP256.P256Credential
    publicKey: Record<string, Hex>
  }

  return createConnector<Provider, Properties, StorageItem>((config) => ({
    id: 'eoa',
    name: 'Externally Owned Account',
    type: 'eoa',
    async setup() {
      const credential = await config.storage?.getItem('currentCredential')
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
            label:
              createOptions.label ??
              options.createOptions?.label ??
              `Account ${new Date().toISOString().split('T')[0]}`,
          })
          config.storage?.setItem('publicKey', {
            [credential.id]: credential.publicKey,
          })
        } else {
          // Load credential (log in)
          credential = await WebAuthnP256.getCredential({
            ...(options.getOptions ?? {}),
            async getPublicKey(credential) {
              const publicKeyMap = (await config.storage?.getItem(
                'publicKey',
              )) as Record<string, Hex> | undefined
              if (!publicKeyMap) throw new Error('publicKey not found')
              const publicKey = publicKeyMap[credential.id]
              if (!publicKey) throw new Error('publicKey not found')
              return publicKey
            },
          })
        }

        config.storage?.setItem('currentCredential', credential)
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
      await config.storage?.removeItem('currentCredential')
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
        console.error('Connector.eoa: Failed to check authorization', error)
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
          'createFn' | 'label' | 'rpId' | 'userId' | 'timeout'
        >
      | undefined
    getOptions?:
      | Pick<WebAuthnP256.getCredential.Parameters, 'getFn' | 'rpId'>
      | undefined
  }
}
