---
"tempo.ts": minor
---

Removed `tempo.ts/prool`. The `tempo` prool instance has been upstreamed directly into `prool`.

```diff
- import { Instance } from 'tempo.ts/prool'
+ import { Instance } from 'prool'

const instance = Instance.tempo()
```
