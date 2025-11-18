import { QueryClientProvider } from '@tanstack/react-query'
import { Hooks } from 'tempo.ts/wagmi'
import { formatUnits, pad, parseUnits, stringToHex } from 'viem'
import {
  useAccount,
  useConnect,
  useConnectors,
  useDisconnect,
  useWatchBlockNumber,
  WagmiProvider,
} from 'wagmi'
import { alphaUsd, betaUsd, sponsorAccount } from './wagmi.config'
import { relayConfig, relayQueryClient } from './wagmi-relay.config'

export function App() {
  const account = useAccount()

  const alphaUsdBalance = Hooks.token.useGetBalance({
    account: account?.address,
    token: alphaUsd,
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
              <h2>Send 100 Alpha USD with Fee Token</h2>
              <SendPaymentWithFeeToken />
              <h2>Send 100 Alpha USD (Gasless - Direct Sponsor)</h2>
              <SendSponsoredPayment />
              <h2>Send 100 Alpha USD (Gasless - Relayed via Proxy)</h2>
              <WagmiProvider config={relayConfig}>
                <QueryClientProvider client={relayQueryClient}>
                  <SendRelayedPayment />
                </QueryClientProvider>
              </WagmiProvider>
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
  const sendPayment = Hooks.token.useTransferSync()
  const metadata = Hooks.token.useGetMetadata({
    token: alphaUsd,
  })

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        const formData = new FormData(event.target as HTMLFormElement)
        const recipient = formData.get('recipient') as `0x${string}`
        const memo = formData.get('memo') as string

        if (!recipient) throw new Error('Recipient is required')
        if (!metadata.data?.decimals)
          throw new Error('metadata.decimals not found')

        sendPayment.mutate({
          amount: parseUnits('100', metadata.data.decimals),
          to: recipient,
          token: alphaUsd,
          memo: memo ? pad(stringToHex(memo), { size: 32 }) : undefined,
        })
      }}
    >
      <div>
        <label htmlFor="recipient">Recipient address</label>
        <input type="text" name="recipient" placeholder="0x..." />
      </div>

      <div>
        <label htmlFor="memo">Memo (optional)</label>
        <input type="text" name="memo" placeholder="INV-12345" />
      </div>

      <button disabled={sendPayment.isPending} type="submit">
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
    </form>
  )
}

export function SendPaymentWithFeeToken() {
  const sendPayment = Hooks.token.useTransferSync()
  const metadata = Hooks.token.useGetMetadata({
    token: alphaUsd,
  })

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        const formData = new FormData(event.target as HTMLFormElement)
        const recipient = formData.get('recipient') as `0x${string}`
        const memo = formData.get('memo') as string
        const feeToken = formData.get('feeToken') as `0x${string}`

        if (!recipient) throw new Error('Recipient is required')
        if (!metadata.data?.decimals)
          throw new Error('metadata.decimals not found')

        sendPayment.mutate({
          amount: parseUnits('100', metadata.data.decimals),
          feeToken,
          memo: memo ? pad(stringToHex(memo), { size: 32 }) : undefined,
          to: recipient,
          token: alphaUsd,
        })
      }}
    >
      <div>
        <label htmlFor="recipient">Recipient address</label>
        <input type="text" name="recipient" placeholder="0x..." />
      </div>

      <div>
        <label htmlFor="memo">Memo (optional)</label>
        <input type="text" name="memo" placeholder="INV-12345" />
      </div>

      <div>
        <label htmlFor="feeToken">Fee Token</label>
        <select name="feeToken">
          <option value={alphaUsd}>Alpha USD</option>
          <option value={betaUsd}>Beta USD</option>
        </select>
      </div>

      <button disabled={sendPayment.isPending} type="submit">
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
    </form>
  )
}

export function SendSponsoredPayment() {
  const sendPayment = Hooks.token.useTransferSync()
  const metadata = Hooks.token.useGetMetadata({
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
      <div>
        <strong>✨ Gasless Transaction - Direct Sponsor</strong>
        <div>Sponsor: {sponsorAccount.address}</div>
        <div>
          Sponsor Balance:{' '}
          {alphaUsdMetadata.data &&
            `${formatUnits(sponsorAlphaUsdBalance.data ?? 0n, alphaUsdMetadata.data?.decimals ?? 6)} ${alphaUsdMetadata.data?.symbol}`}
        </div>
        <div style={{ fontSize: '0.85em', marginTop: '5px', color: '#666' }}>
          Pattern: Frontend has sponsor private key, signs directly
        </div>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault()
          const formData = new FormData(event.target as HTMLFormElement)
          const recipient = formData.get('recipient') as `0x${string}`
          const memo = formData.get('memo') as string

          if (!recipient) throw new Error('Recipient is required')
          if (!metadata.data?.decimals)
            throw new Error('metadata.decimals not found')

          sendPayment.mutate({
            amount: parseUnits('100', metadata.data.decimals),
            feePayer: sponsorAccount,
            memo: memo ? pad(stringToHex(memo), { size: 32 }) : undefined,
            to: recipient,
            token: alphaUsd,
          })
        }}
      >
        <div>
          <label htmlFor="recipient">Recipient address</label>
          <input type="text" name="recipient" placeholder="0x..." />
        </div>

        <div>
          <label htmlFor="memo">Memo (optional)</label>
          <input type="text" name="memo" placeholder="INV-12345" />
        </div>

        <button disabled={sendPayment.isPending} type="submit">
          Send (Gasless)
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
      </form>
    </div>
  )
}

export function SendRelayedPayment() {
  const sendPayment = Hooks.token.useTransferSync()
  const metadata = Hooks.token.useGetMetadata({
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
      <div>
        <strong>🔗 Gasless Transaction - Relayed via Proxy</strong>
        <div>Sponsor: {sponsorAccount.address}</div>
        <div>
          Sponsor Balance:{' '}
          {alphaUsdMetadata.data &&
            `${formatUnits(sponsorAlphaUsdBalance.data ?? 0n, alphaUsdMetadata.data?.decimals ?? 6)} ${alphaUsdMetadata.data?.symbol}`}
        </div>
        <div style={{ fontSize: '0.85em', marginTop: '5px', color: '#666' }}>
          Pattern: Frontend uses relay server, sponsor key stays on server
        </div>
        <div style={{ fontSize: '0.85em', color: '#d97706' }}>
          ⚠️ Requires relay server running on http://localhost:3050
        </div>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault()
          const formData = new FormData(event.target as HTMLFormElement)
          const recipient = formData.get('recipient') as `0x${string}`
          const memo = formData.get('memo') as string

          if (!recipient) throw new Error('Recipient is required')
          if (!metadata.data?.decimals)
            throw new Error('metadata.decimals not found')

          sendPayment.mutate({
            amount: parseUnits('100', metadata.data.decimals),
            feePayer: true,
            memo: memo ? pad(stringToHex(memo), { size: 32 }) : undefined,
            to: recipient,
            token: alphaUsd,
          })
        }}
      >
        <div>
          <label htmlFor="recipient">Recipient address</label>
          <input type="text" name="recipient" placeholder="0x..." />
        </div>

        <div>
          <label htmlFor="memo">Memo (optional)</label>
          <input type="text" name="memo" placeholder="INV-12345" />
        </div>

        <button disabled={sendPayment.isPending} type="submit">
          Send (Relayed)
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
      </form>
    </div>
  )
}
