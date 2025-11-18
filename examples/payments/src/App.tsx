import type { UseMutationResult } from '@tanstack/react-query'
import { useState } from 'react'
import { Hooks } from 'tempo.ts/wagmi'
import { formatUnits, pad, parseUnits, stringToHex } from 'viem'
import {
  useAccount,
  useConnect,
  useConnectors,
  useDisconnect,
  useWatchBlockNumber,
} from 'wagmi'
import { alphaUsd, betaUsd, sponsorAccount } from './wagmi.config'

function DebugPanel({
  mutation,
}: {
  mutation: UseMutationResult<any, any, any, any>
}) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  // Only show if mutation has been triggered
  if (mutation.status === 'idle') return null

  return (
    <div style={{ backgroundColor: '#eaeaea' }}>
      <div>
        <strong>Debug Info</strong>
        <button type="button" onClick={() => setIsCollapsed(!isCollapsed)}>
          {isCollapsed ? 'Expand' : 'Collapse'}
        </button>
      </div>

      {!isCollapsed && (
        <div>
          <div>
            <strong>Status:</strong> {mutation.status ?? 'idle'}
          </div>
          <div>
            <strong>isPending:</strong> {String(mutation.isPending)}
          </div>
          <div>
            <strong>isSuccess:</strong> {String(mutation.isSuccess)}
          </div>
          <div>
            <strong>isError:</strong> {String(mutation.isError)}
          </div>
          {mutation.error && (
            <div>
              <strong>Error:</strong>
              <div>{String(mutation.error)}</div>
            </div>
          )}
          {mutation.variables && (
            <div>
              <strong>Variables:</strong>
              <pre>
                {JSON.stringify(
                  mutation.variables,
                  (_key, value) =>
                    typeof value === 'bigint' ? value.toString() : value,
                  2,
                )}
              </pre>
            </div>
          )}
          {mutation.data && (
            <div>
              <strong>Response Data:</strong>
              <pre>
                {JSON.stringify(
                  mutation.data,
                  (_key, value) =>
                    typeof value === 'bigint' ? value.toString() : value,
                  2,
                )}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function App() {
  const account = useAccount()

  const alphaUsdBalance = Hooks.token.useGetBalance({
    account: account?.address,
    token: alphaUsd,
  })

  const sponsorAlphaUsdBalance = Hooks.token.useGetBalance({
    account: sponsorAccount.address,
    token: alphaUsd,
  })

  const alphaUsdMetadata = Hooks.token.useGetMetadata({
    token: alphaUsd,
  })

  useWatchBlockNumber({
    onBlockNumber() {
      sponsorAlphaUsdBalance.refetch()
    },
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
          <Balance />
          {alphaUsdBalance.data && alphaUsdBalance.data > 0n && (
            <>
              <h2>Send 100 Alpha USD</h2>
              <div>
                <div>
                  <strong>Sponsor Account: </strong>
                  {sponsorAccount.address}
                </div>
                <div>
                  <strong>Sponsor Balance: </strong>
                  {alphaUsdMetadata.data &&
                    `${formatUnits(sponsorAlphaUsdBalance.data ?? 0n, alphaUsdMetadata.data?.decimals ?? 6)} ${alphaUsdMetadata.data?.symbol}`}
                </div>
              </div>
              <SendPayment />
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

export function Balance() {
  const account = useAccount()

  const alphaUsdBalance = Hooks.token.useGetBalance({
    account: account?.address,
    token: alphaUsd,
  })
  const betaUsdBalance = Hooks.token.useGetBalance({
    account: account?.address,
    token: betaUsd,
  })

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
            betaUsdBalance.data ?? 0n,
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
  const [recipient, setRecipient] = useState<`0x${string}` | ''>('')
  const [memo, setMemo] = useState('')
  const [feeToken, setFeeToken] = useState<`0x${string}`>(alphaUsd)

  const sendWithFeeToken = Hooks.token.useTransferSync()
  const sendSponsored = Hooks.token.useTransferSync()
  const sendRelayed = Hooks.token.useTransferSync()

  const metadata = Hooks.token.useGetMetadata({
    token: alphaUsd,
  })

  const handleSend = (mode: 'feeToken' | 'sponsored' | 'relayed') => {
    if (!recipient) throw new Error('Recipient is required')
    if (!metadata.data?.decimals) throw new Error('metadata.decimals not found')

    const baseParams = {
      amount: parseUnits('100', metadata.data.decimals),
      to: recipient,
      token: alphaUsd as `0x${string}`,
      memo: memo ? pad(stringToHex(memo), { size: 32 }) : undefined,
    }

    if (mode === 'feeToken') {
      sendWithFeeToken.mutate({
        ...baseParams,
        feeToken,
      })
    } else if (mode === 'sponsored') {
      sendSponsored.mutate({
        ...baseParams,
        feePayer: sponsorAccount,
      })
    } else if (mode === 'relayed') {
      sendRelayed.mutate({
        ...baseParams,
        feePayer: true,
      })
    }
  }

  const activeMutation =
    sendWithFeeToken.status !== 'idle'
      ? sendWithFeeToken
      : sendSponsored.status !== 'idle'
        ? sendSponsored
        : sendRelayed.status !== 'idle'
          ? sendRelayed
          : null

  const isAnyPending =
    sendWithFeeToken.isPending ||
    sendSponsored.isPending ||
    sendRelayed.isPending

  return (
    <div>
      <div>
        <label htmlFor="recipient">Recipient address</label>
        <input
          type="text"
          name="recipient"
          placeholder="0x..."
          value={recipient}
          onChange={(e) => setRecipient(e.target.value as `0x${string}`)}
        />
      </div>

      <div>
        <label htmlFor="memo">Memo (optional)</label>
        <input
          type="text"
          name="memo"
          placeholder="INV-12345"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="feeToken">Fee Token (for fee token mode)</label>
        <select
          name="feeToken"
          value={feeToken}
          onChange={(e) => setFeeToken(e.target.value as `0x${string}`)}
        >
          <option value={alphaUsd}>Alpha USD</option>
          <option value={betaUsd}>Beta USD</option>
        </select>
      </div>

      <div>
        <button
          disabled={isAnyPending}
          type="button"
          onClick={() => handleSend('feeToken')}
        >
          Send with Fee Token
        </button>
        <button
          disabled={isAnyPending}
          type="button"
          onClick={() => handleSend('sponsored')}
        >
          Send Gasless (Direct Sponsor)
        </button>
        <button
          disabled={isAnyPending}
          type="button"
          onClick={() => handleSend('relayed')}
        >
          Send Gasless (Relayed)
        </button>
      </div>

      {activeMutation?.data && (
        <a
          href={`https://explore.tempo.xyz/tx/${activeMutation.data.receipt.transactionHash}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          View receipt
        </a>
      )}

      {activeMutation && <DebugPanel mutation={activeMutation} />}
    </div>
  )
}
