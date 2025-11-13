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

  // Fetch balances here to avoid redundant calls
  const alphaUsdBalance = Hooks.token.useGetBalance({
    account: account?.address,
    token: alphaUsd,
  })
  const betaUsdBalance = Hooks.token.useGetBalance({
    account: account?.address,
    token: betaUsd,
  })

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
          <Balance
            alphaUsdBalance={alphaUsdBalance}
            betaUsdBalance={betaUsdBalance}
          />
          {alphaUsdBalance.data && alphaUsdBalance.data > 0n && (
            <>
              <h2>Send 100 Alpha USD with Fee Token</h2>
              <SendPaymentWithFeeToken />
            </>
          )}
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

export function Balance({
  alphaUsdBalance,
  betaUsdBalance,
}: {
  alphaUsdBalance: ReturnType<typeof Hooks.token.useGetBalance>
  betaUsdBalance: ReturnType<typeof Hooks.token.useGetBalance>
}) {
  // Fetch metadata
  const alphaUsdMetadata = Hooks.token.useGetMetadata({
    token: alphaUsd,
  })
  const betaUsdMetadata = Hooks.token.useGetMetadata({
    token: betaUsd,
  })

  useWatchBlockNumber({
    onBlockNumber() {
      alphaUsdBalance.refetch()
      betaUsdBalance.refetch()
    },
  })

  // Only show section if either alphaUsd or betaUsd metadata are loaded
  if (!alphaUsdMetadata.data && !betaUsdMetadata.data) return null
  return (
    <div>
      {alphaUsdMetadata.data && (
        <div>
          <strong>{alphaUsdMetadata.data?.name} Balance: </strong>
          {formatUnits(
            alphaUsdBalance.data ?? 0n,
            alphaUsdMetadata.data?.decimals ?? 6,
          )}{' '}
          {alphaUsdMetadata.data?.symbol}
        </div>
      )}
      {betaUsdMetadata.data && (
        <div>
          <strong>{betaUsdMetadata.data?.name} Balance: </strong>
          {formatUnits(
            betaUsdBalance.data as bigint,
            betaUsdMetadata.data?.decimals ?? 6,
          )}{' '}
          {betaUsdMetadata.data?.symbol}
        </div>
      )}
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
  const [feeToken, setFeeToken] = React.useState<
    typeof alphaUsd | typeof betaUsd
  >(alphaUsd)
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
      <div className="flex flex-col flex-1">
        <label htmlFor="feeToken">Fee Token</label>
        <select
          name="feeToken"
          value={feeToken}
          onChange={(e) =>
            setFeeToken(e.target.value as typeof alphaUsd | typeof betaUsd)
          }
        >
          <option value={alphaUsd}>Alpha USD</option>
          <option value={betaUsd}>Beta USD</option>
        </select>
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
            feeToken: feeToken,
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
