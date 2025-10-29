# Agent Guidelines

This document provides guidelines for AI code generation agents working on this codebase.

## Code Generation

### Viem

When generating Viem actions (in `src/viem/Actions/`), follow these guidelines.

An example of a generated action set can be found in `src/viem/Actions/token.ts`.

#### Source of Truth

- **All actions must be based on precompile contract specifications** in `test/docs/specs/`.
- It could be likely that some interfaces may be inconsistent between the specs (`test/docs/specs`) and the precompiles (`test/tempo/crates/contracts/src/precompiles`). Always prefer the precompile interfaces over the specs.
- If the specification is unclear or missing details, **prompt the developer** for guidance rather than making assumptions

#### Documentation Requirements

All actions **must include comprehensive JSDoc** with:

1. **Function description** - What the action does
2. **`@example` block** - Complete working example showing:
   - Required imports (`createClient`, `http`, action imports)
   - Client setup with chain and transport
   - Action usage with realistic parameters
   - Expected return value handling (if applicable)
3. **`@param` tags** - For each parameter (client, parameters)
4. **`@returns` tag** - Description of the return value

Example:
```typescript
/**
 * Gets the pool ID for a token pair.
 *
 * @example
 * ```ts
 * import { createClient, http } from 'viem'
 * import { tempo } from 'tempo.ts/chains'
 * import * as actions from 'tempo.ts/viem/actions'
 *
 * const client = createClient({
 *   chain: tempo,
 *   transport: http(),
 * })
 *
 * const poolId = await actions.amm.getPoolId(client, {
 *   userToken: '0x...',
 *   validatorToken: '0x...',
 * })
 * ```
 *
 * @param client - Client.
 * @param parameters - Parameters.
 * @returns The pool ID.
 */
```

#### Action Types

##### Read-Only Actions

For view/pure functions that only read state:

- Use `readContract` from `viem/actions`
- Return type should use `ReadContractReturnType`
- Parameters extend `ReadParameters`

##### Mutate-Based Actions

For state-changing functions, **both variants must be implemented**:

**1. Standard Async Variant**

- Uses `writeContract` from `viem/actions`
- Returns transaction hash
- Async operation that doesn't wait for confirmation

```typescript
export async function myAction<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: myAction.Parameters<chain, account>,
): Promise<myAction.ReturnValue> {
  return myAction.inner(writeContract, client, parameters)
}
```

**2. Sync Variant (`*Sync`)**

- Named with `Sync` suffix (e.g., `mintSync`, `burnSync`, `rebalanceSwapSync`)
- Uses `writeContractSync` from `viem/actions`
- **Waits for transaction confirmation**
- Returns both the receipt and extracted event data
- **Must use `extractEvent` to get return values** (not `simulateContract`)

```typescript
export async function myActionSync<
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  client: Client<Transport, chain, account>,
  parameters: myActionSync.Parameters<chain, account>,
): Promise<myActionSync.ReturnValue> {
  const { throwOnReceiptRevert = true, ...rest } = parameters
  const receipt = await myAction.inner(writeContractSync, client, {
    ...rest,
    throwOnReceiptRevert,
  } as never)
  const { args } = myAction.extractEvent(receipt.logs)
  return {
    ...args,
    receipt,
  } as never
}
```

#### Namespace Properties

All actions **must include** the following components within their namespace:

##### 1. `Parameters` Type

```typescript
// Read actions
export type Parameters = ReadParameters & Args 

// Write actions
export type Parameters<
  chain extends Chain | undefined = Chain | undefined,
  account extends Account | undefined = Account | undefined,
> = WriteParameters<chain, account> & Args 
```

##### 2. `Args` Type

Arguments must be documented with JSDoc.

```typescript
export type Args = {
  /** JSDoc for each argument */
  argName: Type
}
```

##### 3. `ReturnValue` Type

```typescript
// Read actions
export type ReturnValue = ReadContractReturnType<typeof Abis.myAbi, 'functionName', never>

// Write actions
export type ReturnValue = WriteContractReturnType
```

##### 4. `ErrorType` Type (for write actions)

Write actions must include an `ErrorType` export. Use `BaseErrorType` from `viem` as a placeholder with a TODO comment for future exhaustive error typing:

```typescript
// TODO: exhaustive error type
export type ErrorType = BaseErrorType
```

##### 5. `call` Function

**Required for all actions** - enables composition with other viem actions:

```typescript
/**
 * Defines a call to the `functionName` function.
 *
 * Can be passed as a parameter to:
 * - [`estimateContractGas`](https://viem.sh/docs/contract/estimateContractGas): estimate the gas cost of the call
 * - [`simulateContract`](https://viem.sh/docs/contract/simulateContract): simulate the call
 * - [`sendCalls`](https://viem.sh/docs/actions/wallet/sendCalls): send multiple calls
 *
 * @example
 * ```ts
 * import { createClient, http, walletActions } from 'viem'
 * import { tempo } from 'tempo.ts/chains'
 * import * as actions from 'tempo.ts/viem/actions'
 *
 * const client = createClient({
 *   chain: tempo,
 *   transport: http(),
 * }).extend(walletActions)
 *
 * const hash = await client.sendTransaction({
 *   calls: [actions.amm.myAction.call({ arg1, arg2 })],
 * })
 * ```
 *
 * @param args - Arguments.
 * @returns The call.
 */
export function call(args: Args) {
  return defineCall({
    address: Addresses.contractName,
    abi: Abis.contractName,
    args: [/* transformed args */],
    functionName: 'functionName',
  })
}
```

The `call` function enables these use cases:
- `sendCalls` - Batch multiple calls in one transaction
- `sendTransaction` with `calls` - Send transaction with multiple operations
- `multicall` - Execute multiple calls in parallel
- `estimateContractGas` - Estimate gas costs
- `simulateContract` - Simulate execution

##### 6. `extractEvent` Function (for mutate-based actions)

**Required for all actions that emit events**:

```typescript
/**
 * Extracts the `EventName` event from logs.
 *
 * @param logs - The logs.
 * @returns The `EventName` event.
 */
export function extractEvent(logs: Log[]) {
  const [log] = parseEventLogs({
    abi: Abis.contractName,
    logs,
    eventName: 'EventName',
    strict: true,
  })
  if (!log) throw new Error('`EventName` event not found.')
  return log
}
```

##### 7. `inner` Function (for write actions)

```typescript
/** @internal */
export async function inner<
  action extends typeof writeContract | typeof writeContractSync,
  chain extends Chain | undefined,
  account extends Account | undefined,
>(
  action: action,
  client: Client<Transport, chain, account>,
  parameters: Parameters<chain, account>,
): Promise<ReturnType<action>> {
  const { arg1, arg2, ...rest } = parameters
  const call = myAction.call({ arg1, arg2 })
  return (await action(client, {
    ...rest,
    ...call,
  } as never)) as never
}
```

#### Namespace Structure

Organize actions using namespace pattern:

```typescript
export async function myAction(...) { ... }

export namespace myAction {
  export type Parameters = ...
  export type Args = ...
  export type ReturnValue = ...
  
  export async function inner(...) { ... }  // for write actions
  export function call(args: Args) { ... }
  export function extractEvent(logs: Log[]) { ... }  // for mutate actions
}
```

#### Decision-Making

When encountering situations that require judgment:

- **Specification ambiguities**: Prompt developer for clarification
- **Missing contract details**: Request ABI or specification update
- **Event structure uncertainty**: Ask for event definition
- **Parameter transformations**: Confirm expected input/output formats
- **Edge cases**: Discuss handling strategy with developer

#### Naming Conventions

- Action names should match contract function names (in camelCase)
- Sync variants use `Sync` suffix (e.g., `myActionSync`)
- Event names in `extractEvent` should match contract event names exactly
- Namespace components should be exported within the action's namespace

#### Testing

Tests should be co-located with actions in `*action-name*.test.ts` files. Reference contract tests in `test/tempo/crates/precompiles/` for expected behavior. 

See `src/viem/Actions/token.test.ts` for a comprehensive example of test patterns and structure.

##### Test Structure

Organize tests by action name with a default test case and behavior-specific tests:

```typescript
describe('actionName', () => {
  test('default', async () => {
    // Test the primary/happy path scenario
    const { receipt, ...result } = await actions.namespace.actionSync(client, {
      param1: value1,
      param2: value2,
    })
    
    expect(receipt).toBeDefined()
    expect(result).toMatchInlineSnapshot(`...`)
  })

  test('behavior: specific edge case', async () => {
    // Test specific behaviors, edge cases, or variations
  })

  test('behavior: error conditions', async () => {
    // Test error handling
    await expect(
      actions.namespace.actionSync(client, { ... })
    ).rejects.toThrow()
  })
})

describe.todo('unimplementedAction')
```

### Wagmi Actions

When generating Wagmi actions (in `src/wagmi/Actions/`), follow these guidelines.

An example of a generated action set can be found in `src/wagmi/Actions/fee.ts`.

#### Source of Truth

- **All actions must be based on their corresponding Viem actions** from `src/viem/Actions/`
- Wagmi actions are wrappers around Viem actions that integrate with Wagmi's config and TanStack Query
- If the Viem action is unclear or missing, implement the Viem action first

#### Documentation Requirements

All actions **must include comprehensive JSDoc** with:

1. **Function description** - What the action does
2. **`@example` block** - Complete working example showing:
   - Required imports (`createConfig`, `http`, action imports)
   - Config setup with chains and transports
   - Action usage with realistic parameters
   - Expected return value handling (if applicable)
3. **`@param` tags** - For each parameter (config, parameters)
4. **`@returns` tag** - Description of the return value

Example:
```typescript
/**
 * Gets the user's default fee token.
 *
 * @example
 * ```ts
 * import { createConfig, http } from '@wagmi/core'
 * import { tempo } from 'tempo.ts/chains'
 * import { Actions } from 'tempo.ts/wagmi'
 *
 * const config = createConfig({
 *   chains: [tempo],
 *   transports: {
 *     [tempo.id]: http(),
 *   },
 * })
 *
 * const token = await Actions.fee.getUserToken(config, {
 *   account: '0x...',
 * })
 * ```
 *
 * @param config - Config.
 * @param parameters - Parameters.
 * @returns The user's fee token address.
 */
```

#### Action Types

##### Query-based Actions (Read-Only)

For read-only actions that fetch data:

- Return the result from the corresponding Viem action
- Parameters include `ChainIdParameter<config>` and the Viem action's parameters
- Must include query utilities for TanStack Query integration

```typescript
export function myAction<config extends Config>(
  config: config,
  parameters: myAction.Parameters<config>,
) {
  const { chainId, ...rest } = parameters
  const client = config.getClient({ chainId })
  return viem_Actions.myAction(client, rest)
}
```

##### Mutation-based Actions (Write)

For state-changing actions, both variants must be implemented:

**1. Standard Variant**

- Uses `getConnectorClient` to get the wallet client
- Returns the result from the corresponding Viem action
- Does not wait for transaction confirmation

```typescript
export async function myAction<config extends Config>(
  config: config,
  parameters: myAction.Parameters<config>,
): Promise<viem_Actions.myAction.ReturnValue> {
  const { account, chainId, connector } = parameters
  
  const client = await getConnectorClient(config, {
    account,
    assertChainId: false,
    chainId,
    connector,
  })
  
  return viem_Actions.myAction(
    client,
    parameters as viem_Actions.myAction.Parameters,
  )
}
```

**2. Sync Variant (`*Sync`)**

- Named with `Sync` suffix (e.g., `setUserTokenSync`)
- Uses `getConnectorClient` to get the wallet client
- Waits for transaction inclusion on a block before returning a response
- Returns both the receipt and extracted event data

```typescript
export async function myActionSync<config extends Config>(
  config: config,
  parameters: myActionSync.Parameters<config>,
): Promise<viem_Actions.myActionSync.ReturnValue> {
  const { account, chainId, connector } = parameters
  
  const client = await getConnectorClient(config, {
    account,
    assertChainId: false,
    chainId,
    connector,
  })
  
  return viem_Actions.myActionSync(
    client,
    parameters as viem_Actions.myActionSync.Parameters,
  )
}
```

#### Namespace Properties

##### Query-based Actions

All query-based actions must include the following components:

```typescript
export function myAction<config extends Config>(
  config: config,
  parameters: myAction.Parameters<config>,
): Promise<myAction.ReturnValue> { ... }

export namespace myAction {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    viem_Actions.myAction.Parameters

  export type ReturnValue = viem_Actions.myAction.ReturnValue

  export function queryKey<config extends Config>(
    parameters: Parameters<config>,
  ) {
    return ['myAction', parameters] as const
  }

  export type QueryKey<config extends Config> = ReturnType<
    typeof queryKey<config>
  >

  export function queryOptions<config extends Config, selectData = ReturnValue>(
    config: Config,
    parameters: queryOptions.Parameters<config, selectData>,
  ): queryOptions.ReturnValue<config, selectData> {
    const { query, ...rest } = parameters
    return {
      ...query,
      queryKey: queryKey(rest),
      async queryFn({ queryKey }) {
        const [, parameters] = queryKey
        return await myAction(config, parameters)
      },
    }
  }

  export declare namespace queryOptions {
    export type Parameters<
      config extends Config,
      selectData = myAction.ReturnValue,
    > = myAction.Parameters<config> & {
      query?:
        | Omit<ReturnValue<config, selectData>, 'queryKey' | 'queryFn'>
        | undefined
    }

    export type ReturnValue<
      config extends Config,
      selectData = myAction.ReturnValue,
    > = RequiredBy<
      Query.QueryOptions<
        myAction.ReturnValue,
        Query.DefaultError,
        selectData,
        myAction.QueryKey<config>
      >,
      'queryKey' | 'queryFn'
    >
  }
}
```

##### Mutation-based Actions

All mutation-based actions must include the following components:

```typescript
export async function myAction<config extends Config>(
  config: config,
  parameters: myAction.Parameters<config>,
): Promise<viem_Actions.myAction.ReturnValue> { ... }

export declare namespace myAction {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    ConnectorParameter &
    Omit<viem_Actions.myAction.Parameters<undefined, Account>, 'chain'>

  export type ReturnValue = viem_Actions.myAction.ReturnValue

  export type ErrorType = viem_Actions.myAction.ErrorType
}

export declare namespace myActionSync {
  export type Parameters<config extends Config> = ChainIdParameter<config> &
    ConnectorParameter &
    Omit<viem_Actions.myActionSync.Parameters<undefined, Account>, 'chain'>

  export type ReturnValue = viem_Actions.myActionSync.ReturnValue

  export type ErrorType = viem_Actions.myActionSync.ErrorType
}
```

#### Testing

Tests should be co-located with actions in `*action-name*.test.ts` files.

**Important**: Wagmi action tests should follow the same test flows as the corresponding Viem action tests in `src/viem/Actions/`. This includes:
- Setting up the same initial state (creating tokens, granting roles, minting tokens, etc.)
- Testing the same behaviors and edge cases
- Using the same test data and assertions where applicable

The main difference is that wagmi tests use `config` instead of `client`, and mutation actions don't require explicit `account` parameters since they use the connector's account.

See `src/wagmi/Actions/token.test.ts` for a comprehensive example of test patterns and structure.

##### Test Structure

Organize tests by action name with a default test case. Use namespace imports for cleaner code:

```typescript
import { connect } from '@wagmi/core'
import { describe, expect, test } from 'vitest'
import { accounts } from '../../../test/viem/config.js'
import { config, queryClient } from '../../../test/wagmi/config.js'
import * as myAction from './myAction.js'

const account = accounts[0]

// Query-based actions
describe('myAction', () => {
  test('default', async () => {
    const result = await myAction.myAction(config, {
      // ...
    })
    expect(result).toMatchInlineSnapshot(`...`)
  })

  describe('queryOptions', () => {
    test('default', async () => {
      const options = myAction.myAction.queryOptions(config, {
        // ...
      })
      expect(await queryClient.fetchQuery(options)).toMatchInlineSnapshot(`...`)
    })
  })
})

// Mutation-based actions
describe('myAction', () => {
  test('default', async () => {
    await connect(config, {
      connector: config.connectors[0]!,
    })
    
    // Include any necessary setup from the corresponding viem test
    // e.g., create tokens, grant roles, mint tokens, etc.
    
    const hash = await myAction.myAction(config, {
      // ... (no account parameter needed)
    })
    expect(hash).toBeDefined()
  })
})

describe('myActionSync', () => {
  test('default', async () => {
    await connect(config, {
      connector: config.connectors[0]!,
    })
    
    // Include any necessary setup from the corresponding viem test
    
    const result = await myAction.myActionSync(config, {
      // ... (no account parameter needed)
    })
    expect(result).toBeDefined()
  })
})
```

### Wagmi Hooks

When generating Wagmi hooks (in `src/wagmi/Hooks/`), follow these guidelines.

An example of a generated hook set can be found in `src/wagmi/Hooks/fee.ts`.

#### Source of Truth

- **All hooks must be based on their corresponding Wagmi actions** from `src/wagmi/Actions/`
- Wagmi hooks are React hooks that wrap Wagmi actions with TanStack Query's `useQuery` and `useMutation`
- If the Wagmi action is unclear or missing, implement the Wagmi action first

#### Documentation Requirements

All hooks **must include comprehensive JSDoc** with:

1. **Function description** - What the hook does
2. **`@example` block** - Complete working example showing:
   - Required imports (hook imports)
   - React component usage
   - Hook usage with realistic parameters
   - Expected return value handling (if applicable)
3. **@param parameters** - Parameters description
4. **`@returns` tag** - Description of the return value

Example:
```typescript
/**
 * Hook for getting the user's default fee token.
 *
 * @example
 * ```tsx
 * import { Hooks } from 'tempo.ts/wagmi'
 *
 * function App() {
 *   const { data, isLoading } = Hooks.fee.useUserToken({
 *     account: '0x20c...0055',
 *   })
 *
 *   if (isLoading) return <div>Loading...</div>
 *   return <div>Token: {data?.address}</div>
 * }
 * ```
 *
 * @param parameters - Parameters.
 * @returns Query result with token address and ID.
 */
```

#### Query Hooks

For read-only hooks that fetch data:

- Use `useQuery` from `wagmi/query`
- Use `useConfig` and `useChainId` from `wagmi`
- Call the corresponding action's `queryOptions` function
- All parameters should be optional. Use `ExactPartial` to make all query parameters optional
- Support optional `query` parameter for TanStack Query options
- Default `parameters` to `{}` only if all parameters are truly optional (no required non-reactive parameters like `token`, `role`, etc.)
- Include `enabled` logic to disable the query when required reactive parameters (e.g. addresses) are undefined
- The `enabled` conditional must check ALL required reactive parameters (e.g., `account && spender` for allowance checks)

```typescript
export function useMyAction<
  config extends Config = ResolvedRegister['config'],
  selectData = myAction.ReturnValue,
>(parameters: useMyAction.Parameters<config, selectData> = {}) {
  const { account, query = {} } = parameters

  const config = useConfig(parameters)
  const chainId = useChainId({ config })

  const options = myAction.queryOptions(config, {
    ...parameters,
    chainId: parameters.chainId ?? chainId,
    query: undefined,
  } as never)
  const enabled = Boolean(account && (query.enabled ?? true))

  return useQuery({ ...query, ...options, enabled })
}
```

#### Mutation Hooks

For state-changing hooks, both variants must be implemented:

**1. Standard Variant**

```typescript
export function useMyAction<
  config extends Config = ResolvedRegister['config'],
  context = unknown,
>(
  parameters: useMyAction.Parameters<config, context> = {},
): useMyAction.ReturnType<config, context> {
  const { mutation } = parameters
  const config = useConfig(parameters)
  return useMutation({
    ...mutation,
    async mutationFn(variables) {
      return myAction(config, variables)
    },
    mutationKey: ['myAction'],
  })
}
```

**2. Sync Variant (`use*Sync`)**

```typescript
export function useMyActionSync<
  config extends Config = ResolvedRegister['config'],
  context = unknown,
>(
  parameters: useMyActionSync.Parameters<config, context> = {},
): useMyActionSync.ReturnType<config, context> {
  const { mutation } = parameters
  const config = useConfig(parameters)
  return useMutation({
    ...mutation,
    async mutationFn(variables) {
      return myActionSync(config, variables)
    },
    mutationKey: ['myActionSync'],
  })
}
```

#### Watch Hooks

For event watching hooks:

- Call the corresponding action's watch function inside `useEffect`
- All parameters should be optional using `ExactPartial`
- Include an `enabled` parameter (defaults to `true`) to control whether the watcher is active
- Check if the callback is defined before setting up the watcher
- Return the unwatch function from the `useEffect` for cleanup

All watch hooks must include comprehensive JSDoc with:
1. **Function description** - What events the hook watches for
2. **`@example` block** - Complete working example showing hook usage in a React component
3. **`@param` tag** - Parameters description

```typescript
/**
 * Hook for watching TIP20 token mint events.
 *
 * @example
 * ```tsx
 * import { Hooks } from 'tempo.ts/wagmi'
 *
 * function App() {
 *   Hooks.token.useWatchMint({
 *     onMint(args) {
 *       console.log('Mint:', args)
 *     },
 *   })
 *
 *   return <div>Watching for mints...</div>
 * }
 * ```
 *
 * @param parameters - Parameters.
 */
export function useWatchMyEvent<
  config extends Config = ResolvedRegister['config'],
>(parameters: useWatchMyEvent.Parameters<config> = {}) {
  const { enabled = true, onMyEvent, ...rest } = parameters

  const config = useConfig({ config: parameters.config })
  const configChainId = useChainId({ config })
  const chainId = parameters.chainId ?? configChainId

  useEffect(() => {
    if (!enabled) return
    if (!onMyEvent) return
    return Actions.watchMyEvent(config, {
      ...rest,
      chainId,
      onMyEvent,
    })
  }, [config, enabled, onMyEvent, rest])
}

export declare namespace useWatchMyEvent {
  type Parameters<config extends Config = Config> = UnionCompute<
    ExactPartial<Actions.watchMyEvent.Parameters<config>> &
      ConfigParameter<config> & { enabled?: boolean | undefined }
  >
}
```

#### Namespace Properties

##### Query Hooks

All query hooks must include the following components:

```typescript
export function useMyAction<
  config extends Config = ResolvedRegister['config'],
  selectData = myAction.ReturnValue,
>(parameters: useMyAction.Parameters<config, selectData> = {}) { ... }

export declare namespace useMyAction {
  export type Parameters<
    config extends Config = ResolvedRegister['config'],
    selectData = myAction.ReturnValue,
  > = ConfigParameter<config> &
    QueryParameter<
      myAction.ReturnValue,
      DefaultError,
      selectData,
      myAction.QueryKey<config>
    > &
    ExactPartial<
      Omit<myAction.queryOptions.Parameters<config, selectData>, 'query'>
    >

  export type ReturnValue<selectData = myAction.ReturnValue> =
    UseQueryReturnType<selectData, Error>
}
```

**Note:** Use `ExactPartial<T>` to make all query parameters optional. This ensures that reactive parameters can be undefined initially and populated later for proper reactivity.


##### Watch Hooks

All watch hooks must include the following components:

```typescript
export function useWatchMyEvent<
  config extends Config = ResolvedRegister['config'],
>(parameters: useWatchMyEvent.Parameters<config> = {}) { ... }

export declare namespace useWatchMyEvent {
  type Parameters<config extends Config = Config> = UnionCompute<
    ExactPartial<Actions.watchMyEvent.Parameters<config>> &
      ConfigParameter<config> & { enabled?: boolean | undefined }
  >
}
```

**Note:** Watch hooks don't have a return value - they set up event listeners in a `useEffect` and automatically clean up when the component unmounts or dependencies change.

##### Mutation Hooks

All mutation hooks must include the following components:

```typescript
export function useMyAction<
  config extends Config = ResolvedRegister['config'],
  context = unknown,
>(
  parameters: useMyAction.Parameters<config, context> = {},
): useMyAction.ReturnType<config, context> { ... }

export declare namespace useMyAction {
  type Parameters<
    config extends Config = Config,
    context = unknown,
  > = ConfigParameter<config> & {
    mutation?:
      | UseMutationParameters<
          myAction.ReturnValue,
          myAction.ErrorType,
          myAction.Parameters<config>,
          context
        >
      | undefined
  }

  type ReturnType<
    config extends Config = Config,
    context = unknown,
  > = UseMutationResult<
    myAction.ReturnValue,
    myAction.ErrorType,
    myAction.Parameters<config>,
    context
  >
}

export declare namespace useMyActionSync {
  type Parameters<
    config extends Config = Config,
    context = unknown,
  > = ConfigParameter<config> & {
    mutation?:
      | UseMutationParameters<
          myActionSync.ReturnValue,
          myActionSync.ErrorType,
          myActionSync.Parameters<config>,
          context
        >
      | undefined
  }

  type ReturnType<
    config extends Config = Config,
    context = unknown,
  > = UseMutationResult<
    myActionSync.ReturnValue,
    myActionSync.ErrorType,
    myActionSync.Parameters<config>,
    context
  >
}
```

#### Testing

Tests should be co-located with hooks in `useHookName.test.ts` files.

**Important**: Wagmi hook tests should follow the same test flows as the corresponding Viem action tests in `src/viem/Actions/`. This includes:
- Setting up the same initial state (creating tokens, granting roles, minting tokens, etc.)
- Testing the same behaviors and edge cases
- Using the same test data and assertions where applicable

The main difference is that hooks use React rendering patterns with `renderHook`, and mutation hooks don't require explicit `account` parameters in `mutateAsync` calls since they use the connector's account.

See `src/wagmi/Hooks/fee.test.ts` for a comprehensive example of test patterns and structure.

##### Test Structure

Organize tests by hook name with a default test case. Use namespace imports for cleaner code when importing hooks:

```typescript
import { type Address } from 'viem'
import { describe, expect, test, vi } from 'vitest'
import { useConnect } from 'wagmi'
import { accounts } from '../../../test/viem/config.js'
import { config, renderHook } from '../../../test/wagmi/config.js'
import * as hooks from './myAction.js'

// Query hooks
describe('useMyAction', () => {
  test('default', async () => {
    const { result } = await renderHook(() =>
      hooks.useMyAction({ account: account.address }),
    )

    await vi.waitFor(() => expect(result.current.isSuccess).toBeTruthy())

    expect(result.current.data).toBeDefined()
    // Additional assertions...
  })

  test('reactivity: account parameter', async () => {
    const { result, rerender } = await renderHook(
      (props) =>
        hooks.useMyAction({ account: props?.account }),
      { initialProps: { account: undefined as Address | undefined } },
    )

    await vi.waitFor(() => result.current.fetchStatus === 'fetching')

    // Should be disabled when account is undefined
    expect(result.current.data).toBeUndefined()
    expect(result.current.isPending).toBe(true)
    expect(result.current.isEnabled).toBe(false)

    // Set account
    rerender({ account: account.address })

    await vi.waitFor(() => expect(result.current.isSuccess).toBeTruthy())

    // Should now be enabled and have data
    expect(result.current.isEnabled).toBe(true)
    expect(result.current.data).toBeDefined()
    // Additional assertions...
  })
})

// Mutation hooks
describe('useMyAction', () => {
  test('default', async () => {
    const { result } = await renderHook(() => ({
      connect: useConnect(),
      myAction: hooks.useMyAction(),
    }))

    await result.current.connect.connectAsync({
      connector: config.connectors[0]!,
    })

    // Include any necessary setup from the corresponding viem test
    // e.g., create tokens, grant roles, etc. using the action's mutateAsync

    const hash = await result.current.myAction.mutateAsync({
      // ... mutation parameters (no account parameter needed)
    })
    expect(hash).toBeDefined()

    await vi.waitFor(() =>
      expect(result.current.myAction.isSuccess).toBeTruthy(),
    )
  })
})

describe('useMyActionSync', () => {
  test('default', async () => {
    const { result } = await renderHook(() => ({
      connect: useConnect(),
      myAction: hooks.useMyActionSync(),
    }))

    await result.current.connect.connectAsync({
      connector: config.connectors[0]!,
    })

    // Include any necessary setup from the corresponding viem test

    const data = await result.current.myAction.mutateAsync({
      // ... mutation parameters (no account parameter needed)
    })
    expect(data).toBeDefined()

    await vi.waitFor(() =>
      expect(result.current.myAction.isSuccess).toBeTruthy(),
    )
  })
})

// Watch hooks
describe('useWatchMyEvent', () => {
  test('default', async () => {
    const { result: connectResult } = await renderHook(() => ({
      connect: useConnect(),
      createSync: hooks.useCreateSync(),
      // ... any other setup hooks needed
    }))

    await connectResult.current.connect.connectAsync({
      connector: config.connectors[0]!,
    })

    // Include any necessary setup (e.g., create token, grant roles)

    const events: any[] = []
    await renderHook(() =>
      hooks.useWatchMyEvent({
        // ... parameters
        onMyEvent(args) {
          events.push(args)
        },
      }),
    )

    // Trigger the event by calling a sync action
    // e.g., await connectResult.current.myActionSync.mutateAsync({ ... })

    await vi.waitUntil(() => events.length >= 1)

    expect(events.length).toBeGreaterThanOrEqual(1)
    expect(events[0]?.someField).toBe(expectedValue)
  })
})
```
