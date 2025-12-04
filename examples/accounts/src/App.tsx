import * as React from 'react'
import {
  useAccount,
  useChains,
  useConnect,
  useConnectors,
  useDisconnect,
  useSwitchChain,
} from 'wagmi'

export function App() {
  const account = useAccount()

  return (
    <div>
      <h1>Tempo Example</h1>
      <hr />
      {account.isConnected ? (
        <>
          <h2>Account</h2>
          <Account />
        </>
      ) : (
        <>
          <h2>Connect</h2>
          <Connect />
        </>
      )}
    </div>
  )
}

export function Connect() {
  const connect = useConnect()
  const connectors = useConnectors()

  const webAuthnConnector = React.useMemo(
    () => connectors.find((connector) => connector.id === 'webAuthn'),
    [connectors],
  )
  const walletConnectors = React.useMemo(
    () => connectors.filter((connector) => connector.id !== 'webAuthn'),
    [connectors],
  )

  if (connect.isPending) return <div>Check prompt...</div>
  return (
    <div>
      <h3>Passkey</h3>
      <button
        onClick={() =>
          connect.connect({
            connector: webAuthnConnector!,
            capabilities: { type: 'sign-up' },
          })
        }
        type="button"
      >
        Sign up
      </button>

      <button
        onClick={() => connect.connect({ connector: webAuthnConnector! })}
        type="button"
      >
        Sign in
      </button>

      {walletConnectors.length > 0 && (
        <>
          <h3>Wallets</h3>
          {walletConnectors.map((connector) => (
            <button
              key={connector.id}
              onClick={() => connect.connect({ connector })}
              type="button"
            >
              {connector.name}
            </button>
          ))}
        </>
      )}
    </div>
  )
}

export function Account() {
  const account = useAccount()
  const chains = useChains()
  const disconnect = useDisconnect()
  const switchChain = useSwitchChain()

  const [chain] = chains
  const isSupportedChain = chains.some((chain) => chain.id === account.chainId)

  return (
    <div>
      <div>
        Address: {account.address?.slice(0, 6)}...{account.address?.slice(-4)}
      </div>
      <div>
        Chain ID: {account.chainId}{' '}
        {!isSupportedChain && (
          <button
            onClick={() =>
              switchChain.switchChain({
                chainId: chain.id,
                addEthereumChainParameter: {
                  nativeCurrency: {
                    name: 'USD',
                    decimals: 18,
                    symbol: 'USD',
                  },
                },
              })
            }
            type="button"
          >
            Switch to {chain.name}
          </button>
        )}
      </div>
      <button onClick={() => disconnect.disconnect()} type="button">
        Sign out
      </button>
    </div>
  )
}
