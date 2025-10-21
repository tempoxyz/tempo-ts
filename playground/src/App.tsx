import { useMutation, useQuery } from '@tanstack/react-query'
import { Actions } from 'tempo.ts/viem'
import {
  type Address,
  type Chain,
  type Client,
  formatUnits,
  type Hex,
  parseUnits,
  stringify,
  type Transport,
} from 'viem'
import { mnemonicToAccount } from 'viem/accounts'
import {
  useAccount,
  useClient,
  useConnect,
  useConnectorClient,
  useConnectors,
  useDisconnect,
} from 'wagmi'

export function App() {
  const account = useAccount()
  const balance = useBalance({ address: account?.address })

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
  const [connector] = useConnectors()
  return (
    <>
      <button
        onClick={async () => {
          connect.connect({
            connector,
            create: {
              name: 'Tempo.ts Playground',
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
      {connect.error && <div>Error: {connect.error.message}</div>}
    </>
  )
}

function Balance() {
  const account = useAccount()
  const client = useClient()

  const balance = useBalance({ address: account?.address })

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
  const account = useAccount()
  const client = useClient()
  const { data: connectorClient } = useConnectorClient()

  // TODO: Hooks.token.useTransferSync() in `tempo.ts/wagmi`
  const sendUsd = useMutation({
    async mutationFn(parameters: { amount: string; to: Hex }) {
      const { amount, to } = parameters
      if (!account.address) throw new Error('account.address not found')
      if (!client) throw new Error('client not found')
      if (!connectorClient) throw new Error('connectorClient not found')
      return await Actions.token.transferSync(connectorClient, {
        amount: parseUnits(amount, 6),
        to,
      })
    },
  })

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        const formData = new FormData(event.target as HTMLFormElement)
        const to = formData.get('to') as `0x${string}`
        const amount = formData.get('amount') as string
        sendUsd.mutate({ amount, to })
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
        <button type="submit" disabled={sendUsd.isPending}>
          {sendUsd.isPending ? 'Sending...' : 'Send'}
        </button>
      </div>
      {sendUsd.isError && (
        <div style={{ color: 'red' }}>Error: {sendUsd.error?.message}</div>
      )}
      {sendUsd.data && (
        <>
          <div>Transaction sent successfully!</div>
          <pre>{stringify(sendUsd.data, null, 2)}</pre>
        </>
      )}
    </form>
  )
}

function CreateToken() {
  const { data: connectorClient } = useConnectorClient()

  const createToken = useMutation({
    async mutationFn(parameters: { name: string; symbol: string }) {
      const { name, symbol } = parameters
      if (!connectorClient) throw new Error('connectorClient not found')
      return await Actions.token.createSync(connectorClient, {
        name,
        gas: 100_000n,
        symbol,
        currency: 'USD',
      })
    },
  })

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        const formData = new FormData(event.target as HTMLFormElement)
        const name = formData.get('name') as string
        const symbol = formData.get('symbol') as string
        createToken.mutate({ name, symbol })
      }}
    >
      <div>
        <input type="text" name="name" placeholder="Name" />
      </div>
      <div>
        <input type="text" name="symbol" placeholder="Symbol" />
      </div>
      <div>
        <button type="submit" disabled={createToken.isPending}>
          {createToken.isPending ? 'Creating...' : 'Create'}
        </button>
      </div>
      {createToken.isError && <div>Error: {createToken.error?.message}</div>}
      {createToken.isSuccess && (
        <>
          <div>Token created successfully!</div>
          <pre>{stringify(createToken.data, undefined, 2)}</pre>
        </>
      )}
    </form>
  )
}

function TokenMetadata() {
  const client = useClient()

  const getMetadata = useMutation({
    async mutationFn(parameters: { token: string }) {
      const { token } = parameters
      if (!client) throw new Error('client not found')
      return await Actions.token.getMetadata(
        client as Client<Transport, Chain>,
        {
          token: token.startsWith('0x') ? (token as Address) : BigInt(token),
        },
      )
    },
  })

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        const formData = new FormData(event.target as HTMLFormElement)
        const token = formData.get('token') as Address
        getMetadata.mutate({ token })
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
        <button type="submit" disabled={getMetadata.isPending}>
          {getMetadata.isPending ? 'Fetching...' : 'Get Metadata'}
        </button>
      </div>
      {getMetadata.isError && (
        <div style={{ color: 'red' }}>Error: {getMetadata.error?.message}</div>
      )}
      {getMetadata.data && (
        <>
          <div>Token metadata:</div>
          <pre>{stringify(getMetadata.data, null, 2)}</pre>
        </>
      )}
    </form>
  )
}

// TODO: Hooks.token.useBalance() in `tempo.ts/wagmi`
// biome-ignore lint/correctness/noUnusedVariables: _
function useBalance(parameters: useBalance.Parameters) {
  const { address } = parameters
  const client = useClient()

  return useQuery({
    enabled: !!address,
    queryKey: ['balance', client?.uid, { address }] as const,
    async queryFn({ queryKey }) {
      const [, , { address }] = queryKey

      if (!address) throw new Error('address not found')
      if (!client) throw new Error('client not found')

      return await Actions.token.getBalance(
        client as Client<Transport, Chain>,
        {
          account: address,
        },
      )
    },
    refetchInterval: 4_000,
  })
}

export declare namespace useBalance {
  type Parameters = {
    address?: Address | undefined
  }
}
