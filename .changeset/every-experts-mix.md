---
"tempo.ts": minor
---

Added support for Native "Account Abstraction" accounts.

New account types supported:

### WebAuthn (P256)

```ts
import { Account, WebAuthnP256 } from 'tempo.ts/viem'

const credential = await WebAuthnP256.createCredential({ 
  name: 'Example',
})
const account = Account.fromWebAuthnP256(credential)
```

### WebCrypto (P256)

```ts
import { Account, WebCryptoP256 } from 'tempo.ts/viem'

const keyPair = await WebCryptoP256.createKeyPair()
const account = Account.fromWebCryptoP256(keyPair)
```

### P256

```ts
import { Account, P256 } from 'tempo.ts/viem'

const privateKey = P256.randomPrivateKey()
const account = Account.fromP256(privateKey)
```

