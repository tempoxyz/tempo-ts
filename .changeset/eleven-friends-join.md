---
'tempo.ts': minor
---

**Breaking:** Renamed `usdAddress` and `usdId`.

```diff
- import { usdAddress, usdId } from 'tempo.ts/viem'
+ import { Addresses, TokenId } from 'tempo.ts/viem'

- usdAddress
+ Addresses.linkingToken

- usdId
+ TokenId.linkingToken
```
