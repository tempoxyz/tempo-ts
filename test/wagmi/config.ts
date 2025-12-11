import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { connect, getAccount, getConnectorClient } from '@wagmi/core'
import * as React from 'react'
import { http } from 'viem'
import {
  type RenderHookOptions,
  type RenderHookResult,
  type RenderResult,
  render as vbr_render,
  renderHook as vbr_renderHook,
} from 'vitest-browser-react'
import { createConfig, WagmiProvider } from 'wagmi'
import { dangerous_secp256k1 } from '../../src/wagmi/Connector.js'
import {
  accounts,
  chain,
  setupOrders as viem_setupOrders,
  setupPoolWithLiquidity as viem_setupPoolWithLiquidity,
  setupToken as viem_setupToken,
  setupTokenPair as viem_setupTokenPair,
} from '../viem/config.js'

export { accounts }

export const config = createConfig({
  chains: [chain],
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
  // @ts-expect-error
  transports: {
    [chain.id]: http(),
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

export async function setupToken() {
  if (getAccount(config).status === 'disconnected')
    await connect(config, {
      connector: config.connectors[0]!,
    })
  const client = await getConnectorClient(config)
  return viem_setupToken(client as never)
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

export async function setupOrders() {
  if (getAccount(config).status === 'disconnected')
    await connect(config, {
      connector: config.connectors[0]!,
    })
  const client = await getConnectorClient(config)
  return viem_setupOrders(client as never)
}

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
