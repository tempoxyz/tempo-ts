---
"tempo.ts": minor
---

**Breaking:** Removed `createTempoClient`. Construct your Client with `viem` primitives:

```diff
-import { createTempoClient } from 'tempo.ts/viem'
+import { createClient, http } from 'viem'
+import { tempo } from 'tempo.ts/chains'

-const client = createTempoClient()
+const client = createClient({
+  chain: tempo({ 
+    feeToken: '0x20c0000000000000000000000000000000000001'
+  }),
+  transport: http(),
+})
```
