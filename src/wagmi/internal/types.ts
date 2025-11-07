import type { Config } from 'wagmi'
import type { Chain } from '../../viem/Chain.js'

export type FeeTokenParameter<
  config extends Config<readonly [Chain, ...Chain[]]>,
  feeToken extends
    | config['chains'][number]['feeToken']
    | undefined = config['chains'][number]['feeToken'],
> = {
  feeToken?:
    | (feeToken extends config['chains'][number]['feeToken']
        ? feeToken
        : undefined)
    | config['chains'][number]['feeToken']
    | undefined
}
