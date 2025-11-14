import { Actions, Addresses } from 'tempo.ts/viem'
import { Hooks } from 'tempo.ts/wagmi'
import { formatUnits, parseUnits } from 'viem'
import {
  useAccount,
  useConnect,
  useConnectors,
  useDisconnect,
  useSendTransactionSync,
  useWatchBlockNumber,
} from 'wagmi'
import { alphaUsd, linkingUsd } from './wagmi.config'

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
          <h2>Fund Account</h2>
          <FundAccount />
          <h2>Balance</h2>
          <Balance />
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

export function PlaceOrder() {
  const { data: metadata } = Hooks.token.useGetMetadata({
    token: alphaUsd,
  })

  const sendTransaction = useSendTransactionSync()

  const amount = parseUnits('100', metadata?.decimals || 6)

  const calls = [
    Actions.token.approve.call({
      spender: Addresses.stablecoinExchange,
      amount,
      token: linkingUsd,
    }),
    Actions.dex.place.call({
      amount,
      tick: 0,
      token: alphaUsd,
      type: 'buy',
    }),
  ]

  return (
    <div>
      <button
        onClick={async () => {
          await sendTransaction.sendTransactionSyncAsync({
            calls,
            feeToken: alphaUsd,
          })
        }}
        type="button"
      >
        Place Order
      </button>
      {sendTransaction.data && (
        <div>
          <a
            href={`https://explore.tempo.xyz/tx/${sendTransaction.data.transactionHash}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View receipt
          </a>
        </div>
      )}
    </div>
  )
}
