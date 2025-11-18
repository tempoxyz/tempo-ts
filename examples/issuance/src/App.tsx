import { Hooks } from 'tempo.ts/wagmi'
import { type Address, formatUnits, pad, parseUnits, stringToHex } from 'viem'
import {
  useAccount,
  useConnect,
  useConnectors,
  useDisconnect,
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
          <h2>Balance</h2>
          <Balance />

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
      <h2>Create Stablecoin</h2>

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

      {create.data?.token && <GrantTokenRoles token={create.data.token} />}
      {create.data?.token && (
        <MintFeeAmmLiquidity tokenAddress={create.data.token} />
      )}
    </div>
  )
}

export function GrantTokenRoles(props: { token: Address }) {
  const { token } = props
  const { address } = useAccount()

  const grant = Hooks.token.useGrantRolesSync()

  if (!address) return null
  return (
    <div>
      <h2>Grant Issuer Role</h2>

      <button
        disabled={!address}
        onClick={() =>
          grant.mutate({
            token,
            roles: ['issuer'],
            to: address,
            feeToken: alphaUsd,
          })
        }
        type="button"
      >
        Grant to self
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

      {grant.isSuccess && <MintToken token={token} />}
    </div>
  )
}

export function MintToken(props: { token: Address }) {
  const { token } = props
  const { address } = useAccount()

  const metadata = Hooks.token.useGetMetadata({
    token,
  })
  const mint = Hooks.token.useMintSync()

  return (
    <div>
      <h2>Mint Token</h2>

      <form
        onSubmit={(event) => {
          event.preventDefault()
          const formData = new FormData(event.target as HTMLFormElement)
          const recipient = formData.get('recipient') as `0x${string}`
          const memo = formData.get('memo') as string

          if (!recipient) throw new Error('Recipient is required')
          if (!metadata.data?.decimals)
            throw new Error('metadata.decimals not found')

          mint.mutate({
            amount: parseUnits('100', metadata.data?.decimals),
            to: recipient,
            token,
            memo: memo ? pad(stringToHex(memo), { size: 32 }) : undefined,
            feeToken: alphaUsd,
          })
        }}
      >
        <label htmlFor="recipient">Recipient address</label>
        <input type="text" name="recipient" placeholder="0x..." />
        <label htmlFor="memo">Memo (optional)</label>
        <input type="text" name="memo" placeholder="INV-12345" />
        <button disabled={!address} type="submit">
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
      </form>
    </div>
  )
}

export function BurnToken(props: { token: Address }) {
  const { token } = props
  const { address } = useAccount()

  const metadata = Hooks.token.useGetMetadata({
    token,
  })
  const burn = Hooks.token.useBurnSync()

  return (
    <div>
      <h2>Burn Token</h2>

      <form
        onSubmit={(event) => {
          event.preventDefault()
          const formData = new FormData(event.target as HTMLFormElement)
          const memo = formData.get('memo') as string

          if (!metadata.data?.decimals)
            throw new Error('metadata.decimals not found')

          burn.mutate({
            amount: parseUnits('100', metadata.data?.decimals),
            token,
            memo: memo ? pad(stringToHex(memo), { size: 32 }) : undefined,
            feeToken: alphaUsd,
          })
        }}
      >
        <label htmlFor="memo">Memo (optional)</label>
        <input type="text" name="memo" placeholder="INV-12345" />
        <button disabled={!address} type="submit">
          Burn
        </button>
        {burn.data && (
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
      </form>
    </div>
  )
}

export function MintFeeAmmLiquidity({
  tokenAddress,
}: {
  tokenAddress: Address
}) {
  const { address } = useAccount()

  const mintFeeLiquidity = Hooks.amm.useMintSync()

  return (
    <div>
      <h2>Mint Fee Amm Liquidity</h2>

      <button
        onClick={() => {
          if (!address || !tokenAddress) return
          mintFeeLiquidity.mutate({
            userToken: {
              amount: 0n,
              address: tokenAddress,
            },
            validatorToken: {
              amount: parseUnits('100', 6),
              address: linkingUsd,
            },
            to: address,
            feeToken: alphaUsd,
          })
        }}
        type="button"
      >
        Add Liquidity
      </button>

      {mintFeeLiquidity.data && (
        <div>
          <a
            href={`https://explore.tempo.xyz/tx/${mintFeeLiquidity.data.receipt.transactionHash}`}
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
