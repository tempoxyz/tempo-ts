import { useMutation } from '@tanstack/react-query'
import { getConnectorClient } from '@wagmi/core'
import { tempoAndantino } from 'tempo.ts/chains'
import { withFeePayer } from 'tempo.ts/viem'
import { Hooks } from 'tempo.ts/wagmi'
import { createWalletClient, formatUnits, http, stringify } from 'viem'
import {
  useAccount,
  useConnect,
  useConnectors,
  useDisconnect,
  useWatchBlockNumber,
} from 'wagmi'
import { alphaUsd, config } from './wagmi.config'

export function App() {
  const account = useAccount()
  return (
    <div>
      <h1>With Fee Payer Example</h1>
      <hr />
      {account.isConnected ? (
        <>
          <h2>Account</h2>
          <Account />
          <h2>Balance</h2>
          <Balance />
          <h2>Sign Transaction with Relay</h2>
          <SignTransactionWithRelay />
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
  const [connector] = useConnectors()

  return (
    <div>
      <button
        onClick={() =>
          connect.connect({ connector, capabilities: { createAccount: true } })
        }
        type="button"
      >
        Sign up
      </button>
      <button onClick={() => connect.connect({ connector })} type="button">
        Sign in
      </button>
    </div>
  )
}

export function Account() {
  const account = useAccount()
  const disconnect = useDisconnect()

  return (
    <div>
      <div>
        <strong>Address: </strong>
        {account.address}
      </div>
      <button type="button" onClick={() => disconnect.disconnect()}>
        Disconnect
      </button>
    </div>
  )
}

export function Balance() {
  const account = useAccount()
  const balance = Hooks.token.useGetBalance({
    account: account?.address,
    token: alphaUsd,
  })
  const metadata = Hooks.token.useGetMetadata({
    token: alphaUsd,
  })

  useWatchBlockNumber({
    onBlockNumber() {
      balance.refetch()
    },
  })

  if (!metadata.data) return null
  return (
    <div>
      <strong>{metadata.data?.name} Balance: </strong>
      {formatUnits(balance.data ?? 0n, metadata.data?.decimals ?? 6)}{' '}
      {metadata.data?.symbol}
    </div>
  )
}

export function SignTransactionWithRelay() {
  const sendTransactionWithPolicy = async (
    policy: 'sign-only' | 'sign-and-broadcast',
  ) => {
    const connectorClient = await getConnectorClient(config as never)

    // Create wallet client with relay transport
    const walletClient = createWalletClient({
      account: connectorClient.account,
      chain: tempoAndantino({ feeToken: alphaUsd }),
      transport: withFeePayer(
        http(undefined, {
          fetchOptions: {
            headers: {
              Authorization: `Basic ${btoa('eng:zealous-mayer')}`,
            },
          },
        }),
        http('http://localhost:3050'),
        { policy },
      ),
    })

    // Step 1: Prepare transaction request with feePayer: true
    const request = await walletClient.prepareTransactionRequest({
      data: '0xdeadbeef',
      to: '0xcafebabecafebabecafebabecafebabecafebabe',
      feePayer: true,
    })

    // Step 2: Sign transaction (creates partial signature with feePayerSignature: null)
    const signedTransaction = await walletClient.signTransaction(request as any)

    // Step 3: Send to relay
    const receipt = await walletClient.sendRawTransactionSync({
      serializedTransaction: signedTransaction,
    })

    return { receipt }
  }

  // Policy 'sign-only': Relay co-signs, transport auto-broadcasts via default transport
  const signOnly = useMutation({
    mutationFn: () => sendTransactionWithPolicy('sign-only'),
  })

  // Policy 'sign-and-broadcast': Relay co-signs and broadcasts in one step
  const signAndBroadcast = useMutation({
    mutationFn: () => sendTransactionWithPolicy('sign-and-broadcast'),
  })

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <h3>Policy: 'sign-only'</h3>
        <p>
          Relay co-signs, then transport auto-broadcasts via default transport.
        </p>
        <button
          disabled={signOnly.isPending}
          onClick={() => signOnly.mutate()}
          type="button"
        >
          {signOnly.isPending ? 'Sending...' : 'Send Transaction (sign only)'}
        </button>

        {signOnly.isError && (
          <div style={{ color: 'red' }}>
            <pre>Error: {stringify(signOnly.error, null, 2)}</pre>
          </div>
        )}

        {signOnly.data && (
          <div>
            ✅ Transaction Hash:{' '}
            <a
              href={`https://explore.tempo.xyz/tx/${signOnly.data.receipt.transactionHash}`}
              target="_blank"
            >
              {signOnly.data.receipt.transactionHash}
            </a>
          </div>
        )}
      </div>

      <div>
        <h3>Policy: 'sign-and-broadcast'</h3>
        <p>Relay co-signs and broadcasts in one step.</p>
        <button
          disabled={signAndBroadcast.isPending}
          onClick={() => signAndBroadcast.mutate()}
          type="button"
        >
          {signAndBroadcast.isPending
            ? 'Sending...'
            : 'Send Transaction (sign-and-broadcast)'}
        </button>

        {signAndBroadcast.isError && (
          <div style={{ color: 'red' }}>
            <pre>Error: {stringify(signAndBroadcast.error, null, 2)}</pre>
          </div>
        )}

        {signAndBroadcast.data && (
          <>
            <div>✅ Transaction sent successfully!</div>
            <div>
              Transaction Hash:{' '}
              <a
                href={`https://explore.tempo.xyz/tx/${signAndBroadcast.data.receipt.transactionHash}`}
                target="_blank"
              >
                {signAndBroadcast.data.receipt.transactionHash}
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
