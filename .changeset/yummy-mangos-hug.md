---
'tempo.ts': minor
---

**Breaking:** Refactored structure to use PascalCased namespaces to future-proof against naming conflicts, excessive imports, and future versions of Viem.

- Renamed `actions` import to `Actions`.

```diff
- import { actions } from 'tempo.ts/viem'
+ import { Actions } from 'tempo.ts/viem'
```

- Renamed `parseTransaction` to `deserialize`.

```diff
- import { parseTransaction } from 'tempo.ts/viem'
+ import { Transaction } from 'tempo.ts/viem'

- parseTransaction(serialized)
+ Transaction.deserialize(serialized)
```

- Renamed `serializeTransaction` to `serialize`.

```diff
- import { serializeTransaction } from 'tempo.ts/viem'
+ import { Transaction } from 'tempo.ts/viem'

- serializeTransaction(transaction)
+ Transaction.serialize(transaction)
```

- Placed all `*Abi` exports in the `Abis` namespace.

```diff
- import { tip20Abi } from 'tempo.ts/viem'
+ import { Abis } from 'tempo.ts/viem'

- tip20Abi
+ Abis.tip20
```

- Placed all `*Address` exports in the `Addresses` namespace.

```diff
- import { feeManagerAddress } from 'tempo.ts/viem'
+ import { Addresses } from 'tempo.ts/viem'

- feeManagerAddress
+ Addresses.feeManager
```
