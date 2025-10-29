import * as Hex from 'ox/Hex'
import * as Hash from 'ox/Hash'
import * as TokenId from './TokenId.js'

/**
 * Converts a user token and validator token to a pool ID.
 *
 * @param value - User token and validator token.
 * @returns The pool ID.
 */
export function from(value: from.Value): Hex.Hex {
  return Hash.keccak256(
    Hex.concat(
      Hex.padLeft(TokenId.toAddress(value.userToken), 32),
      Hex.padLeft(TokenId.toAddress(value.validatorToken), 32),
    ),
  )
}

export declare namespace from {
  export type Value = {
    /** User token. */
    userToken: TokenId.TokenIdOrAddress
    /** Validator token. */
    validatorToken: TokenId.TokenIdOrAddress
  }
}
