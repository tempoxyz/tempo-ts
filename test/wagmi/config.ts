import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { connect, getAccount, getConnectorClient } from '@wagmi/core'
import * as React from 'react'
import { defineChain, http } from 'viem'
import {
  type RenderHookOptions,
  type RenderHookResult,
  type RenderResult,
  render as vbr_render,
  renderHook as vbr_renderHook,
} from 'vitest-browser-react'
import { createConfig, WagmiProvider } from 'wagmi'
import { tempoLocal } from '../../src/chains.js'
import { dangerous_secp256k1 } from '../../src/wagmi/Connector.js'
import {
  accounts,
  setupPoolWithLiquidity as viem_setupPoolWithLiquidity,
  setupTokenPair as viem_setupTokenPair,
} from '../viem/config.js'

export const id =
  (typeof process !== 'undefined' &&
    Number(process.env.VITEST_POOL_ID ?? 1) +
      Math.floor(Math.random() * 10_000)) ||
  1 + Math.floor(Math.random() * 10_000)

export const rpcUrl = `http://localhost:8546/${id}`

export const tempoTest = defineChain({
  ...tempoLocal,
  rpcUrls: {
    default: {
      http: [rpcUrl],
    },
  },
})

export const config = createConfig({
  batch: {
    multicall: false,
  },
  chains: [tempoTest],
  connectors: [
    dangerous_secp256k1({
      account: accounts.at(0),
    }),
    dangerous_secp256k1({
      account: accounts.at(1),
    }),
  ],
  pollingInterval: 100,
  storage: null,
  transports: {
    [tempoTest.id]: http(),
  },
})

export const queryClient = new QueryClient()

export function createWrapper<component extends React.FunctionComponent<any>>(
  Wrapper: component,
  props: Parameters<component>[0],
) {
  type Props = { children?: React.ReactNode | undefined }
  return function CreatedWrapper({ children }: Props) {
    return React.createElement(
      Wrapper,
      props,
      React.createElement(
        QueryClientProvider,
        { client: queryClient },
        children,
      ),
    )
  }
}

export function renderHook<result, props>(
  renderCallback: (initialProps?: props) => result,
  options?: RenderHookOptions<props>,
): Promise<RenderHookResult<result, props>> {
  queryClient.clear()
  return vbr_renderHook(renderCallback, {
    wrapper: createWrapper(WagmiProvider, { config, reconnectOnMount: false }),
    ...options,
  })
}

export function render(
  ...args: Parameters<typeof vbr_render>
): Promise<RenderResult> {
  queryClient.clear()
  return vbr_render(args[0], {
    ...args[1],
    wrapper: createWrapper(WagmiProvider, { config, reconnectOnMount: false }),
  })
}

export async function setupPoolWithLiquidity() {
  if (getAccount(config).status === 'disconnected')
    await connect(config, {
      connector: config.connectors[0]!,
    })
  const client = await getConnectorClient(config)
  return viem_setupPoolWithLiquidity(client as never)
}

export async function setupTokenPair() {
  if (getAccount(config).status === 'disconnected')
    await connect(config, {
      connector: config.connectors[0]!,
    })
  const client = await getConnectorClient(config)
  return viem_setupTokenPair(client as never)
}

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
