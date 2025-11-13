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
import { alphaUsd } from './wagmi.config'

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
          <h2>Balance</h2>
          <Balance />
          <h2>Create Stablecoin</h2>
          <CreateStablecoin />
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

  if (connect.isPending) return <div>Check prompt...</div>
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
        {account.address?.slice(0, 6)}...{account.address?.slice(-4)}
      </div>
      <button onClick={() => disconnect.disconnect()} type="button">
        Sign out
      </button>
    </div>
  )
}

export function Balance() {
  const account = useAccount()

  const balance = Hooks.token.useGetBalance({
    account: account.address,
    token: account.chain?.feeToken,
  })
  const metadata = Hooks.token.useGetMetadata({
    token: account.chain?.feeToken,
  })
  const addFunds = Hooks.faucet.useFund({
    mutation: {
      onSuccess() {
        balance.refetch()
      },
    },
  })

  useWatchBlockNumber({
    onBlockNumber() {
      console.log('refetching balance')
      balance.refetch()
    },
  })

  if (balance.isLoading || metadata.isLoading) return <div>Loading...</div>
  if (!balance.data && !addFunds.isSuccess)
    return (
      <button
        disabled={addFunds.isPending}
        onClick={() => addFunds.mutate({ account: account.address! })}
        type="button"
      >
        Add Funds
      </button>
    )
  return (
    <div>
      {metadata.data?.name} Balance:{' '}
      {formatUnits(balance.data ?? 0n, metadata.data?.decimals ?? 6)}
    </div>
  )
}

export function CreateStablecoin() {
  const create = Hooks.token.useCreateSync()

  return (
    <div>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          const formData = new FormData(event.target as HTMLFormElement)
          const name = formData.get('name') as string
          const symbol = formData.get('symbol') as string
          create.mutate({
            name,
            symbol,
            currency: 'USD',
          })
        }}
      >
        <input type="text" name="name" placeholder="jakeUSD" required />
        <input type="text" name="symbol" placeholder="JUSD" required />
        <button disabled={create.isPending} type="submit">
          {create.isPending ? 'Creating...' : 'Create'}
        </button>
      </form>
      {create.isError && (
        <div style={{ color: 'red' }}>Error: {create.error?.message}</div>
      )}
      {create.data && (
        <div>
          {create.data.name} created successfully!{' '}
          <a
            href={`https://explore.tempo.xyz/tx/${create.data.receipt.transactionHash}`}
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

export function GrantTokenRoles() {
  const { address } = useAccount()
  const tokenAddress = '0x20c0000000000000000000000000000000000004'

  const grant = Hooks.token.useGrantRolesSync()

  return (
    <div>
      <button
        disabled={!address}
        onClick={() =>
          grant.mutate({
            token: tokenAddress,
            roles: ['issuer'],
            to: address,
            feeToken: alphaUsd,
          })
        }
        type="button"
      >
        Grant
      </button>
      {grant.data && (
        <div>
          <a
            href={`https://explore.tempo.xyz/tx/${grant.data.receipt.transactionHash}`}
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

export function MintToken() {
  const { address } = useAccount()
  const tokenAddress = '0x20c0000000000000000000000000000000000004'

  const [recipient, setRecipient] = React.useState<string>('')
  const [memo, setMemo] = React.useState<string>('')

  const metadata = Hooks.token.useGetMetadata({
    token: tokenAddress,
  })
  const mint = Hooks.token.useMintSync()

  return (
    <div>
      <label htmlFor="recipient">Recipient address</label>
      <input
        type="text"
        name="recipient"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        placeholder="0x..."
      />
      <label htmlFor="memo">Memo (optional)</label>
      <input
        type="text"
        name="memo"
        value={memo}
        onChange={(e) => setMemo(e.target.value)}
        placeholder="INV-12345"
      />
      <button
        disabled={!address}
        onClick={() =>
          mint.mutate({
            amount: parseUnits('100', metadata.decimals),
            to: recipient,
            token: tokenAddress,
            memo: memo ? pad(stringToHex(memo), { size: 32 }) : undefined,
            feeToken: alphaUsd,
          })
        }
        type="button"
        className="text-[14px] -tracking-[2%] font-normal"
      >
        Mint
      </button>
      {mint.data && (
        <div>
          <a
            href={`https://explore.tempo.xyz/tx/${mint.data.receipt.transactionHash}`}
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
