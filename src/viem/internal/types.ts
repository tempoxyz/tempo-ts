import type {
  Account,
  Address,
  Chain,
  ReadContractParameters as viem_ReadContractParameters,
  WriteContractSyncParameters as viem_WriteContractSyncParameters,
} from 'viem'
import type {
  IsUndefined,
  MaybeRequired,
  UnionPick,
} from '../../internal/types.js'
import type * as TokenId from '../../ox/TokenId.js'
import type { TransactionRequestTempo } from '../Transaction.js'

export type GetAccountParameter<
  account extends Account | undefined = Account | undefined,
  accountOverride extends Account | Address | undefined = Account | Address,
  required extends boolean = true,
  nullish extends boolean = false,
> = MaybeRequired<
  {
    account?:
      | accountOverride
      | Account
      | Address
      | (nullish extends true ? null : never)
      | undefined
  },
  IsUndefined<account> extends true
    ? required extends true
      ? true
      : false
    : false
>

export type GetFeeTokenParameter<
  chain extends Chain | undefined = Chain | undefined,
> = chain extends { feeToken: infer feeToken }
  ? IsUndefined<feeToken> extends true
    ? { feeToken: TokenId.TokenIdOrAddress | null }
    : { feeToken?: TokenId.TokenIdOrAddress | null | undefined }
  : { feeToken: TokenId.TokenIdOrAddress | null }

export type ReadParameters = Pick<
  viem_ReadContractParameters<never, never, never>,
  'account' | 'blockNumber' | 'blockOverrides' | 'blockTag' | 'stateOverride'
>

export type TokenIdOrAddress = bigint | Address

export type WriteParameters<
  chain extends Chain | undefined = Chain | undefined,
  account extends Account | undefined = Account | undefined,
> = UnionPick<
  viem_WriteContractSyncParameters<never, never, never, chain, account>,
  | 'account'
  | 'chain'
  | 'gas'
  | 'maxFeePerGas'
  | 'maxPriorityFeePerGas'
  | 'nonce'
  | 'throwOnReceiptRevert'
> &
  GetFeeTokenParameter<chain> &
  UnionPick<TransactionRequestTempo, 'feePayer'>
