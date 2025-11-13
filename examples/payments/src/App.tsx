import * as React from 'react'
import { Hooks } from 'tempo.ts/wagmi'
import { formatUnits, pad, parseUnits, stringToHex } from 'viem'
import {
  useAccount,
  useConnect,
  useConnectors,
  useDisconnect,
  useWatchBlockNumber,
} from 'wagmi'
import { alphaUsd, betaUsd } from './wagmi.config'

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

export function SendPayment() {
  const [recipient, setRecipient] = React.useState<string>('')
  const [memo, setMemo] = React.useState<string>('')
  const sendPayment = Hooks.token.useTransferSync()
  const metadata = Hooks.token.useGetMetadata({
    token: alphaUsd,
  })

  return (
    <div>
      <div className="flex flex-col flex-2">
        <label htmlFor="recipient">Recipient address</label>
        <input
          type="text"
          name="recipient"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          placeholder="0x..."
        />
      </div>
      <div className="flex flex-col flex-1">
        <label htmlFor="memo">Memo (optional)</label>
        <input
          type="text"
          name="memo"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          placeholder="INV-12345"
        />
      </div>
      <button
        disabled={sendPayment.isPending}
        type="button"
        onClick={() =>
          sendPayment.mutate({
            amount: parseUnits('100', metadata.data?.decimals ?? 6),
            to: recipient,
            token: alphaUsd,
            memo: memo ? pad(stringToHex(memo), { size: 32 }) : undefined,
          })
        }
      >
        Send
      </button>
      {sendPayment.data && (
        <a
          href={`https://explore.tempo.xyz/tx/${sendPayment.data.receipt.transactionHash}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          View receipt
        </a>
      )}
    </div>
  )
}

export function SendPaymentWithFeeToken() {
  const [recipient, setRecipient] = React.useState<string>('')
  const [memo, setMemo] = React.useState<string>('')
  const sendPayment = Hooks.token.useTransferSync()
  const metadata = Hooks.token.useGetMetadata({
    token: alphaUsd,
  })

  return (
    <div>
      <div className="flex flex-col flex-2">
        <label htmlFor="recipient">Recipient address</label>
        <input
          type="text"
          name="recipient"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          placeholder="0x..."
        />
      </div>
      <div className="flex flex-col flex-1">
        <label htmlFor="memo">Memo (optional)</label>
        <input
          type="text"
          name="memo"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          placeholder="INV-12345"
        />
      </div>
      <button
        disabled={sendPayment.isPending}
        type="button"
        onClick={() =>
          sendPayment.mutate({
            amount: parseUnits('100', metadata.data?.decimals ?? 6),
            to: recipient,
            token: alphaUsd,
            memo: memo ? pad(stringToHex(memo), { size: 32 }) : undefined,
            feeToken: betaUsd,
          })
        }
      >
        Send
      </button>
      {sendPayment.data && (
        <a
          href={`https://explore.tempo.xyz/tx/${sendPayment.data.receipt.transactionHash}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          View receipt
        </a>
      )}
    </div>
  )
}
