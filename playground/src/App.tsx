import { useMutation } from '@tanstack/react-query'
import { Address } from 'ox'
import { useState } from 'react'
import { Actions } from 'tempo.ts/viem'
import { Hooks } from 'tempo.ts/wagmi'
import {
  type Chain,
  type Client,
  formatUnits,
  parseUnits,
  stringify,
  type Transport,
} from 'viem'
import { mnemonicToAccount } from 'viem/accounts'
import {
  useAccount,
  useClient,
  useConnect,
  useConnectors,
  useDisconnect,
} from 'wagmi'

export function App() {
  const account = useAccount()
  const balance = Hooks.token.useGetBalance({ account: account?.address })

  return (
    <div>
      {account.address ? (
        <>
          <h2>Account</h2>
          <AccountDetails />

          <h2>Balance</h2>
          <Balance />

          {(balance.data ?? 0n) > 0n && (
            <>
              <h2>Send USD</h2>
              <Transfer />

              <h2>Create Token</h2>
              <CreateToken />
            </>
          )}
        </>
      ) : (
        <>
          <h2>Connect</h2>
          <Connect />
        </>
      )}

      <h2>Token Metadata</h2>
      <TokenMetadata />
    </div>
  )
}

function AccountDetails() {
  const account = useAccount()
  const disconnect = useDisconnect()
  return (
    <>
      <div>Address: {account.address}</div>
      <div>Chain ID: {account.chainId}</div>
      <button
        onClick={() => {
          disconnect.disconnect()
        }}
        type="button"
      >
        Disconnect
      </button>
    </>
  )
}

function Connect() {
  const connect = useConnect()
  const connectors = useConnectors()
  return (
    <>
      {connectors.map((connector) => (
        <>
          <h4>{connector.name}</h4>
          <button
            onClick={async () => {
              connect.connect({
                connector,
                capabilities: {
                  createAccount: { label: 'Tempo.ts Playground' },
                },
              })
            }}
            type="button"
          >
            Sign up
          </button>
          <button
            onClick={async () => {
              connect.connect({
                connector,
              })
            }}
            type="button"
          >
            Log in
          </button>
        </>
      ))}
      {connect.error && <div>Error: {connect.error.message}</div>}
    </>
  )
}

function Balance() {
  const account = useAccount()
  const client = useClient()

  const balance = Hooks.token.useGetBalance({ account: account?.address })

  const fundAccount = useMutation({
    async mutationFn() {
      if (!account.address) throw new Error('account.address not found')
      if (!client) throw new Error('client not found')

      if (import.meta.env.VITE_LOCAL !== 'true') {
        await client.request<any>({
          method: 'tempo_fundAddress',
          params: [account.address],
        })
      } else {
        await Actions.token.transferSync(client as Client<Transport, Chain>, {
          account: mnemonicToAccount(
            'test test test test test test test test test test test junk',
          ),
          amount: parseUnits('10000', 6),
          to: account.address,
        })
      }

      balance.refetch()
    },
  })
  return (
    <>
      <div>Balance: {formatUnits(balance.data ?? 0n, 6)}</div>
      <button onClick={() => fundAccount.mutate()} type="button">
        Fund Account
      </button>
      {fundAccount.isSuccess && <div>Funded account successfully</div>}
      {fundAccount.isError && (
        <div>Error funding account: {fundAccount.error.message}</div>
      )}
    </>
  )
}

function Transfer() {
  const transfer = Hooks.token.useTransferSync()

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        const formData = new FormData(event.target as HTMLFormElement)
        const to = formData.get('to') as `0x${string}`
        const amount = formData.get('amount') as string
        transfer.mutate({ amount: parseUnits(amount, 6), to })
      }}
    >
      <div>
        <input
          type="text"
          name="to"
          placeholder="To"
          style={{ width: '320px' }}
        />
      </div>
      <div>
        <input type="text" name="amount" placeholder="Amount (USD)" />
      </div>
      <div>
        <button type="submit" disabled={transfer.isPending}>
          {transfer.isPending ? 'Sending...' : 'Send'}
        </button>
      </div>
      {transfer.isError && (
        <div style={{ color: 'red' }}>Error: {transfer.error?.message}</div>
      )}
      {transfer.data && (
        <>
          <div>Transaction sent successfully!</div>
          <pre>{stringify(transfer.data, null, 2)}</pre>
        </>
      )}
    </form>
  )
}

function CreateToken() {
  const create = Hooks.token.useCreateSync()

  return (
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
      <div>
        <input type="text" name="name" placeholder="Name" />
      </div>
      <div>
        <input type="text" name="symbol" placeholder="Symbol" />
      </div>
      <div>
        <button type="submit" disabled={create.isPending}>
          {create.isPending ? 'Creating...' : 'Create'}
        </button>
      </div>
      {create.isError && <div>Error: {create.error?.message}</div>}
      {create.isSuccess && (
        <>
          <div>Token created successfully!</div>
          <pre>{stringify(create.data, undefined, 2)}</pre>
        </>
      )}
    </form>
  )
}

function TokenMetadata() {
  const [token, setToken] = useState<Address.Address | undefined>(undefined)
  const metadata = Hooks.token.useGetMetadata({
    token: token
      ? Address.validate(token)
        ? token
        : BigInt(token)
      : undefined,
    query: {
      enabled: !!token,
    },
  })

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        const formData = new FormData(event.target as HTMLFormElement)
        const token = formData.get('token') as Address.Address
        setToken(token)
      }}
    >
      <div>
        <input
          type="text"
          name="token"
          placeholder="Token Address or ID"
          style={{ width: '320px' }}
        />
      </div>
      <div>
        <button type="submit" disabled={metadata.isFetching}>
          {metadata.isFetching ? 'Fetching...' : 'Get Metadata'}
        </button>
      </div>
      {metadata.isError && (
        <div style={{ color: 'red' }}>Error: {metadata.error?.message}</div>
      )}
      {metadata.data && (
        <>
          <div>Token metadata:</div>
          <pre>{stringify(metadata.data, null, 2)}</pre>
        </>
      )}
    </form>
  )
}
