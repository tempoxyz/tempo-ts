import type { Account, Address } from 'viem';
import type { IsUndefined, MaybeRequired } from "../internal/types.js";
export type GetAccountParameter<account extends Account | undefined = Account | undefined, accountOverride extends Account | Address | undefined = Account | Address, required extends boolean = true, nullish extends boolean = false> = MaybeRequired<{
    account?: accountOverride | Account | Address | (nullish extends true ? null : never) | undefined;
}, IsUndefined<account> extends true ? required extends true ? true : false : false>;
//# sourceMappingURL=types.d.ts.map