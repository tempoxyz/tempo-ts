import type { UseMutationResult } from '@tanstack/react-query'
import type { Config, ResolvedRegister } from '@wagmi/core'
import type { BaseErrorType } from 'viem'
import { useConfig } from 'wagmi'
import type { ConfigParameter } from 'wagmi/internal'
import { type UseMutationParameters, useMutation } from 'wagmi/query'

import { fund } from '../Actions/faucet.js'

/**
 * Hook for funding an account with an initial amount of set token(s)
 * on Tempo's testnet.
 *
 * @example
 * ```tsx
 * import { Hooks } from 'tempo.ts/wagmi'
 *
 * function App() {
 *   const { mutate, isPending } = Hooks.faucet.useFund()
 *
 *   return (
 *     <button
 *       onClick={() => mutate({ account: '0xdeadbeef...' })}
 *       disabled={isPending}
 *     >
 *       Fund Account
 *     </button>
 *   )
 * }
 * ```
 *
 * @param parameters - Parameters.
 * @returns Mutation result.
 */
export function useFund<
  config extends Config = ResolvedRegister['config'],
  context = unknown,
>(
  parameters: useFund.Parameters<config, context> = {},
): useFund.ReturnType<config, context> {
  const { mutation } = parameters
  const config = useConfig(parameters)
  return useMutation({
    ...mutation,
    async mutationFn(variables) {
      return fund(config, variables)
    },
    mutationKey: ['fund'],
  })
}

export declare namespace useFund {
  type Parameters<
    config extends Config = Config,
    context = unknown,
  > = ConfigParameter<config> & {
    mutation?:
      | UseMutationParameters<
          fund.ReturnValue,
          BaseErrorType,
          fund.Parameters<config>,
          context
        >
      | undefined
  }

  type ReturnType<
    config extends Config = Config,
    context = unknown,
  > = UseMutationResult<
    fund.ReturnValue,
    BaseErrorType,
    fund.Parameters<config>,
    context
  >
}
