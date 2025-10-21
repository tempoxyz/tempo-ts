import { useMutation, useQuery } from '@tanstack/react-query'
import { atom, useAtom } from 'jotai'
import { Account, Actions, WebAuthnP256 } from 'tempo.ts/viem'
import {
  type Address,
  formatUnits,
  type Hex,
  parseUnits,
  stringify,
} from 'viem'
import { mnemonicToAccount } from 'viem/accounts'
import { useClient } from 'wagmi'

// TODO: remove once we have passkey wagmi connector.
const accountAtom = atom<Account.Account | undefined>(undefined)

export function App() {
  const [account] = useAtom(accountAtom)
  const balance = useBalance({ address: account?.address })

  return (
    <div>
      <h2>Connect</h2>
      <Connect />

      {account && (
        <>
          <h2>Balance</h2>
          <Balance />

          {(balance.data ?? 0n) > 0n && (
            <>
              <h2>Send USD</h2>
              <Transfer />
            </>
          )}
        </>
      )}
    </div>
  )
}

// TODO: migrate to connector
function Connect() {
  const [account, setAccount] = useAtom(accountAtom)
  return (
    <>
      <button
        onClick={async () => {
          const credential = await WebAuthnP256.createCredential({
            name: 'Example',
          })
          localStorage.setItem(credential.id, credential.publicKey)
          const account = Account.fromWebAuthnP256(credential)
          setAccount(account)
        }}
        type="button"
      >
        Sign up
      </button>
      <button
        onClick={async () => {
          const credential = await WebAuthnP256.getCredential({
            async getPublicKey(credential) {
              const publicKey = localStorage.getItem(credential.id)
              if (!publicKey) throw new Error('publicKey not found in storage')
              return publicKey as `0x${string}`
            },
          })
          const account = Account.fromWebAuthnP256(credential)
          setAccount(account)
        }}
        type="button"
      >
        Log in
      </button>
      {account && <div>Account: {account.address}</div>}
    </>
  )
}

function Balance() {
  const [account] = useAtom(accountAtom)
  const client = useClient()

  const balance = useBalance({ address: account?.address })

  const fundAccount = useMutation({
    async mutationFn() {
      if (!account) throw new Error('account not found')
      if (!client) throw new Error('client not found')

      if (import.meta.env.VITE_LOCAL !== 'true') {
        await client.request<any>({
          method: 'tempo_fundAccount',
          params: [account.address],
        })
      } else {
        await Actions.token.transferSync(client, {
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
  const [account] = useAtom(accountAtom)
  const client = useClient()

  // TODO: Hooks.token.useTransferSync()
  const sendUsd = useMutation({
    async mutationFn(parameters: { amount: string; to: Hex }) {
      const { amount, to } = parameters
      if (!account) throw new Error('account not found')
      if (!client) throw new Error('client not found')
      return await Actions.token.transferSync(client, {
        account,
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

// TODO: Hooks.token.useBalance()
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

      return await Actions.token.getBalance(client, {
        account: address,
      })
    },
    refetchInterval: 1_000,
  })
}

export declare namespace useBalance {
  type Parameters = {
    address?: Address | undefined
  }
}
