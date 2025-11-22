import { useMutation } from '@tanstack/react-query'
import { Hooks } from 'tempo.ts/wagmi'
import { createWalletClient, formatUnits, http, stringify } from 'viem'
import {
  useAccount,
  useConnect,
  useConnectors,
  useDisconnect,
  useWatchBlockNumber,
} from 'wagmi'
import { alphaUsd } from './wagmi.config'
import { tempoAndantino } from 'tempo.ts/chains'
import { withFeePayer } from 'tempo.ts/viem'

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
          <h2>Fund Account</h2>
          <FundAccount />
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

export function FundAccount() {
  const account = useAccount()
  const fund = Hooks.faucet.useFund()

  if (!account.address) return null
  return (
    <div>
      <button
        disabled={fund.isPending}
        type="button"
        onClick={() => fund.mutate({ account: account.address! })}
      >
        Fund Account
      </button>
      {fund.data && (
        <div>
          Receipts:{' '}
          {fund.data.map((hash) => (
            <div key={hash}>
              <a href={`https://explore.tempo.xyz/${hash}`} target="_blank">
                {hash}
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function SignTransactionWithRelay() {
  const account = useAccount()
  const walletClient = createWalletClient({
    account: account.address,
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
    ),
  })

  const sendTransaction = useMutation({
    async mutationFn() {
      if (!account.address) throw new Error('account.address not found')
      if (!walletClient) throw new Error('walletClient not found')

      // Step 1: Prepare transaction request with feePayer: true
      const request = await walletClient.prepareTransactionRequest({
        data: '0xdeadbeef',
        to: '0xcafebabecafebabecafebabecafebabecafebabe',
        feePayer: true,
      })

      // Step 2: Sign transaction (creates partial signature with feePayerSignature: null)
      const signedTransaction = await walletClient.signTransaction(
        request as any,
      )

      // Step 3: Submit via sendRawTransaction - relay will pick it up, sign, and submit
      const hash = await walletClient.sendRawTransaction({
        serializedTransaction: signedTransaction,
      })

      return { hash }
    },
  })

  return (
    <div>
      <button
        disabled={sendTransaction.isPending}
        onClick={() => sendTransaction.mutate()}
        type="button"
      >
        {sendTransaction.isPending
          ? 'Sending via Relay...'
          : 'Send Transaction (via Relay)'}
      </button>

      {sendTransaction.isError && (
        <div style={{ color: 'red' }}>
          <pre>Error: {stringify(sendTransaction.error, null, 2)}</pre>
        </div>
      )}

      {sendTransaction.data && (
        <>
          <div>Transaction sent successfully via relay!</div>
          <div>Hash: {sendTransaction.data.hash}</div>
        </>
      )}
    </div>
  )
}
