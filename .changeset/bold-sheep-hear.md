---
"tempo.ts": minor
---

Removed `userToken.amount` from `amm.mint`, and flattened the API:

```diff
Actions.amm.mint({
- userToken: {
-   address: '0x...',
-   amount: 100n,
- },
+ userTokenAddress: '0x...',
- validatorToken: {
-   address: '0x...',
-   amount: 100n,
- },
+ validatorTokenAddress: '0x...',
+ validatorTokenAmount: 100n,
  to: '0x...',
})
```