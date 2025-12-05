import { useState } from 'react'
import { Hooks } from 'tempo.ts/wagmi'
import { type Address, formatUnits, pad, parseUnits, stringToHex } from 'viem'
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
          connect.connect({ connector, capabilities: { type: 'sign-up' } })
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

      {create.data?.token && (
        <GrantTokenRoles
          token={create.data.token}
          roles={['issuer', 'pause', 'unpause', 'burnBlocked']}
        />
      )}
    </div>
  )
}

export function GrantTokenRoles(props: {
  token: Address
  roles: Array<'issuer' | 'pause' | 'unpause' | 'burnBlocked'>
}) {
  const { token, roles } = props
  const { address } = useAccount()

  const grant = Hooks.token.useGrantRolesSync()

  return (
    <div>
      <h2>Grant Token Roles</h2>

      <form
        onSubmit={(event) => {
          event.preventDefault()
          const formData = new FormData(event.target as HTMLFormElement)
          const recipient = formData.get('recipient') as `0x${string}`

          if (!recipient) throw new Error('Recipient is required')

          grant.mutate({
            token,
            roles,
            to: recipient,
            feeToken: alphaUsd,
          })
        }}
      >
        <label htmlFor="recipient">Grant roles to address</label>
        <input
          type="text"
          name="recipient"
          placeholder="0x..."
          defaultValue={address}
        />
        <p>Roles to grant: {roles.join(', ')}</p>
        <button disabled={!address || grant.isPending} type="submit">
          {grant.isPending ? 'Granting...' : 'Grant Roles'}
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
      </form>

      {grant.isSuccess && (
        <>
          <SetSupplyCap token={token} />
          <MintToken token={token} />
          <BurnToken token={token} />
          <CreateTokenPolicy token={token} />
          <PauseUnpauseTransfers token={token} />
          <RevokeTokenRoles token={token} roles={roles} />
          <h1>FeeAMM Management</h1>
          <CheckFeeAmmPool token={token} />
          <MintFeeAmmLiquidity token={token} />
          <BurnFeeAmmLiquidity token={token} />
          <h1>Rewards</h1>
          <OptInToRewards token={token} />
          <StartReward token={token} />
          <ClaimReward token={token} />
        </>
      )}
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
        <button disabled={!address || mint.isPending} type="submit">
          {mint.isPending ? 'Minting...' : 'Mint'}
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
            amount: parseUnits('100', metadata.data.decimals),
            token,
            memo: memo ? pad(stringToHex(memo), { size: 32 }) : undefined,
            feeToken: alphaUsd,
          })
        }}
      >
        <label htmlFor="memo">Memo (optional)</label>
        <input type="text" name="memo" placeholder="INV-12345" />
        <button disabled={!address || burn.isPending} type="submit">
          {burn.isPending ? 'Burning...' : 'Burn'}
        </button>
        {burn.data && (
          <div>
            <a
              href={`https://explore.tempo.xyz/tx/${burn.data.receipt.transactionHash}`}
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

export function RevokeTokenRoles(props: {
  token: Address
  roles: Array<'issuer' | 'pause' | 'unpause' | 'burnBlocked'>
}) {
  const { token, roles } = props
  const { address } = useAccount()

  const revoke = Hooks.token.useRevokeRolesSync()

  return (
    <div>
      <h2>Revoke Token Roles</h2>

      <form
        onSubmit={(event) => {
          event.preventDefault()
          const formData = new FormData(event.target as HTMLFormElement)
          const from = formData.get('from') as `0x${string}`

          if (!from) throw new Error('Address is required')

          revoke.mutate({
            token,
            roles,
            from,
            feeToken: alphaUsd,
          })
        }}
      >
        <label htmlFor="from">Revoke roles from address</label>
        <input
          type="text"
          name="from"
          placeholder="0x..."
          defaultValue={address}
        />
        <p>Roles to revoke: {roles.join(', ')}</p>
        <button disabled={!address || revoke.isPending} type="submit">
          {revoke.isPending ? 'Revoking...' : 'Revoke Roles'}
        </button>
        {revoke.data && (
          <div>
            <a
              href={`https://explore.tempo.xyz/tx/${revoke.data.receipt.transactionHash}`}
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

export function SetSupplyCap(props: { token: Address }) {
  const { token } = props
  const { address } = useAccount()

  const { data: metadata, refetch: refetchMetadata } =
    Hooks.token.useGetMetadata({
      token,
    })

  const setSupplyCap = Hooks.token.useSetSupplyCapSync({
    mutation: {
      onSettled() {
        refetchMetadata()
      },
    },
  })

  return (
    <div>
      <h2>Set Supply Cap</h2>

      <form
        onSubmit={(event) => {
          event.preventDefault()
          const formData = new FormData(event.target as HTMLFormElement)
          const cap = formData.get('cap') as string

          if (!cap) throw new Error('Supply cap is required')
          if (!metadata?.decimals)
            throw new Error('metadata.decimals not found')

          setSupplyCap.mutate({
            token,
            supplyCap: parseUnits(cap, metadata.decimals),
            feeToken: alphaUsd,
          })
        }}
      >
        <label htmlFor="cap">Supply cap amount</label>
        <input type="text" name="cap" placeholder="1000" defaultValue="1000" />
        <button disabled={!address || setSupplyCap.isPending} type="submit">
          {setSupplyCap.isPending ? 'Setting...' : 'Set Supply Cap'}
        </button>
        {setSupplyCap.data && (
          <div>
            <a
              href={`https://explore.tempo.xyz/tx/${setSupplyCap.data.receipt.transactionHash}`}
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

export function CreateTokenPolicy(props: { token: Address }) {
  const { token } = props
  const { address } = useAccount()

  const createPolicy = Hooks.policy.useCreateSync()

  return (
    <div>
      <h2>Create Transfer Policy</h2>

      <form
        onSubmit={(event) => {
          event.preventDefault()
          const formData = new FormData(event.target as HTMLFormElement)
          const addresses = formData.get('addresses') as string
          const type = formData.get('type') as 'blacklist' | 'whitelist'

          if (!addresses) throw new Error('Addresses are required')

          const addressList = addresses
            .split(',')
            .map((addr) => addr.trim() as `0x${string}`)

          createPolicy.mutate({
            addresses: addressList,
            type,
            feeToken: alphaUsd,
          })
        }}
      >
        <label htmlFor="addresses">Addresses (comma-separated)</label>
        <input type="text" name="addresses" placeholder="0x..., 0x..." />

        <label htmlFor="type">Policy type</label>
        <select name="type" defaultValue="blacklist">
          <option value="blacklist">Blacklist</option>
          <option value="whitelist">Whitelist</option>
        </select>

        <button disabled={!address || createPolicy.isPending} type="submit">
          {createPolicy.isPending ? 'Creating...' : 'Create Policy'}
        </button>

        {createPolicy.data && (
          <div>
            <p>Policy ID: {createPolicy.data.policyId.toString()}</p>
            <a
              href={`https://explore.tempo.xyz/tx/${createPolicy.data.receipt.transactionHash}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View receipt
            </a>
          </div>
        )}
      </form>

      {createPolicy.isSuccess && createPolicy.data && (
        <LinkTokenPolicy token={token} policyId={createPolicy.data.policyId} />
      )}
    </div>
  )
}

export function LinkTokenPolicy(props: { token: Address; policyId: bigint }) {
  const { token, policyId } = props
  const { address } = useAccount()

  const { data: metadata, refetch: refetchMetadata } =
    Hooks.token.useGetMetadata({
      token,
    })

  const linkPolicy = Hooks.token.useChangeTransferPolicySync({
    mutation: {
      onSuccess() {
        refetchMetadata()
      },
    },
  })

  const handleLinkPolicy = () => {
    linkPolicy.mutate({
      policyId,
      token,
      feeToken: alphaUsd,
    })
  }

  return (
    <div>
      <h2>Link Transfer Policy</h2>

      <p>
        Token: {metadata?.name || token}
        <br />
        Policy ID: {policyId.toString()}
      </p>

      <button
        disabled={!address || linkPolicy.isPending}
        onClick={handleLinkPolicy}
        type="button"
      >
        {linkPolicy.isPending ? 'Linking...' : 'Link Policy'}
      </button>

      {linkPolicy.data && (
        <div>
          <a
            href={`https://explore.tempo.xyz/tx/${linkPolicy.data.receipt.transactionHash}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View receipt
          </a>
        </div>
      )}

      {linkPolicy.data && <BurnTokenBlocked token={token} />}
    </div>
  )
}

export function PauseUnpauseTransfers(props: { token: Address }) {
  const { token } = props
  const { address } = useAccount()
  const [hash, setHash] = useState('')

  const { data: metadata, refetch: refetchMetadata } =
    Hooks.token.useGetMetadata({
      token,
    })

  const pause = Hooks.token.usePauseSync({
    mutation: {
      onSettled(data) {
        refetchMetadata()
        setHash((data?.receipt?.transactionHash as string) || '')
      },
    },
  })

  const unpause = Hooks.token.useUnpauseSync({
    mutation: {
      onSettled(data) {
        refetchMetadata()
        setHash((data?.receipt?.transactionHash as string) || '')
      },
    },
  })

  const paused = metadata?.paused || false
  const isProcessing = pause.isPending || unpause.isPending

  const handleToggle = () => {
    if (paused) {
      unpause.mutate({ token, feeToken: alphaUsd })
    } else {
      pause.mutate({ token, feeToken: alphaUsd })
    }
  }

  return (
    <div>
      <h2>Pause/Unpause Transfers</h2>

      <p>Current status: {paused ? 'Paused' : 'Active'}</p>

      <button
        disabled={!address || isProcessing}
        onClick={handleToggle}
        type="button"
      >
        {isProcessing ? 'Processing...' : paused ? 'Unpause' : 'Pause'}
      </button>

      {!!hash && (
        <div>
          <a
            href={`https://explore.tempo.xyz/tx/${hash}`}
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

export function BurnTokenBlocked(props: { token: Address }) {
  const { token } = props
  const { address } = useAccount()

  const metadata = Hooks.token.useGetMetadata({
    token,
  })

  const burnBlocked = Hooks.token.useBurnBlockedSync()

  return (
    <div>
      <h2>Burn Blocked Tokens</h2>

      <form
        onSubmit={(event) => {
          event.preventDefault()
          const formData = new FormData(event.target as HTMLFormElement)
          const from = formData.get('from') as `0x${string}`

          if (!from) throw new Error('Blocked address is required')
          if (!metadata.data?.decimals)
            throw new Error('metadata.decimals not found')

          burnBlocked.mutate({
            amount: parseUnits('100', metadata.data.decimals),
            from,
            token,
            feeToken: alphaUsd,
          })
        }}
      >
        <label htmlFor="from">Blocked address</label>
        <input type="text" name="from" placeholder="0x..." />
        <button disabled={!address || burnBlocked.isPending} type="submit">
          {burnBlocked.isPending ? 'Burning...' : 'Burn Blocked Tokens'}
        </button>
        {burnBlocked.data && (
          <div>
            <a
              href={`https://explore.tempo.xyz/tx/${burnBlocked.data.receipt.transactionHash}`}
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

export function MintFeeAmmLiquidity(props: { token: Address }) {
  const { token } = props
  const { address } = useAccount()

  const mintFeeLiquidity = Hooks.amm.useMintSync()

  return (
    <div>
      <h2>Mint Fee AMM Liquidity</h2>

      <form
        onSubmit={(event) => {
          event.preventDefault()
          const formData = new FormData(event.target as HTMLFormElement)
          const amount = formData.get('amount') as string

          if (!amount) throw new Error('Amount is required')

          mintFeeLiquidity.mutate({
            userTokenAddress: token,
            validatorTokenAddress: alphaUsd,
            validatorTokenAmount: parseUnits(amount, 6),
            to: address,
            feeToken: alphaUsd,
          })
        }}
      >
        <label htmlFor="amount">Amount of validator token (AlphaUSD)</label>
        <input type="text" name="amount" placeholder="100" defaultValue="100" />

        <button disabled={!address || mintFeeLiquidity.isPending} type="submit">
          {mintFeeLiquidity.isPending ? 'Adding Liquidity...' : 'Add Liquidity'}
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
      </form>
    </div>
  )
}

export function CheckFeeAmmPool(props: { token: Address }) {
  const { token } = props
  const { address } = useAccount()

  const { data: pool } = Hooks.amm.usePool({
    userToken: token,
    alphaUsd,
  })

  const { data: lpBalance } = Hooks.amm.useLiquidityBalance({
    address,
    userToken: token,
    alphaUsd,
  })

  const { data: metadata } = Hooks.token.useGetMetadata({
    token,
  })

  const { data: validatorMetadata } = Hooks.token.useGetMetadata({
    token: alphaUsd,
  })

  return (
    <div>
      <h2>Check Fee AMM Pool</h2>

      {address && pool && lpBalance !== undefined ? (
        <div>
          <div>
            <strong>Your LP Balance:</strong>{' '}
            {formatUnits(lpBalance, validatorMetadata?.decimals || 6)} LP tokens
          </div>
          <div>
            <strong>Validator Token Reserves:</strong>{' '}
            {formatUnits(
              pool.reserveValidatorToken,
              validatorMetadata?.decimals || 6,
            )}{' '}
            AlphaUSD
          </div>
          <div>
            <strong>User Token Reserves:</strong>{' '}
            {formatUnits(pool.reserveUserToken, metadata?.decimals || 6)}{' '}
            {metadata?.symbol || ''}
          </div>
        </div>
      ) : (
        <div>Loading pool information...</div>
      )}
    </div>
  )
}

export function BurnFeeAmmLiquidity(props: { token: Address }) {
  const { token } = props
  const { address } = useAccount()

  const { data: lpBalance } = Hooks.amm.useLiquidityBalance({
    address,
    userToken: token,
    validatorToken: alphaUsd,
  })

  const { data: validatorMetadata } = Hooks.token.useGetMetadata({
    token: alphaUsd,
  })

  const burnLiquidity = Hooks.amm.useBurnSync()

  return (
    <div>
      <h2>Burn Fee AMM Liquidity</h2>

      <form
        onSubmit={(event) => {
          event.preventDefault()
          const formData = new FormData(event.target as HTMLFormElement)
          const amount = formData.get('amount') as string

          if (!amount) throw new Error('Amount is required')

          burnLiquidity.mutate({
            userToken: token,
            validatorToken: alphaUsd,
            liquidity: parseUnits(amount, validatorMetadata?.decimals || 6),
            to: address,
            feeToken: alphaUsd,
          })
        }}
      >
        <label htmlFor="amount">Amount of LP tokens to burn</label>
        <input type="text" name="amount" placeholder="10" defaultValue="10" />

        <button disabled={!address || burnLiquidity.isPending} type="submit">
          {burnLiquidity.isPending ? 'Burning Liquidity...' : 'Burn Liquidity'}
        </button>

        {burnLiquidity.data && (
          <div>
            <a
              href={`https://explore.tempo.xyz/tx/${burnLiquidity.data.receipt.transactionHash}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View receipt
            </a>
          </div>
        )}
      </form>

      {lpBalance !== undefined && (
        <div>
          <strong>Available LP Balance:</strong>{' '}
          {formatUnits(lpBalance, validatorMetadata?.decimals || 6)} LP tokens
        </div>
      )}
    </div>
  )
}

export function OptInToRewards(props: { token: Address }) {
  const { token } = props
  const { address } = useAccount()

  const setRecipient = Hooks.reward.useSetRecipientSync()

  return (
    <div>
      <h2>Opt In to Rewards</h2>
      <button
        type="button"
        disabled={!address || setRecipient.isPending}
        onClick={() => {
          if (!address) throw new Error('Address is required')
          setRecipient.mutate({
            recipient: address,
            token,
            feeToken: alphaUsd,
          })
        }}
      >
        {setRecipient.isPending ? 'Opting in...' : 'Opt In'}
      </button>
      {setRecipient.data && (
        <div>
          <a
            href={`https://explore.tempo.xyz/tx/${setRecipient.data.receipt.transactionHash}`}
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

export function StartReward(props: { token: Address }) {
  const { token } = props
  const { address } = useAccount()

  const metadata = Hooks.token.useGetMetadata({ token })
  const start = Hooks.reward.useStartSync()

  return (
    <div>
      <h2>Distribute 50 {metadata.name} Reward</h2>
      <button
        type="button"
        disabled={!address || start.isPending || !metadata.data?.decimals}
        onClick={() => {
          if (!metadata?.data?.decimals)
            throw new Error('metadata.decimals not found')
          start.mutate({
            amount: parseUnits('50', metadata.data.decimals),
            token,
            feeToken: alphaUsd,
          })
        }}
      >
        {start.isPending ? 'Starting...' : 'Start Reward'}
      </button>
      {start.data && (
        <div>
          <a
            href={`https://explore.tempo.xyz/tx/${start.data.receipt.transactionHash}`}
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

export function ClaimReward(props: { token: Address }) {
  const { token } = props
  const { address } = useAccount()

  const claim = Hooks.reward.useClaimSync()

  return (
    <div>
      <h2>Claim Reward</h2>
      <button
        type="button"
        disabled={!address || claim.isPending}
        onClick={() => {
          claim.mutate({
            token,
            feeToken: alphaUsd,
          })
        }}
      >
        {claim.isPending ? 'Claiming...' : 'Claim'}
      </button>
      {claim.data && (
        <div>
          <a
            href={`https://explore.tempo.xyz/tx/${claim.data.receipt.transactionHash}`}
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
