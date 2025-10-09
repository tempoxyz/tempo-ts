import { Hash, Hex } from 'ox'
import { TokenRole } from 'tempo.ts/ox'
import { expect, test } from 'vitest'

test('serialize', () => {
  TokenRole.roles.forEach((role) => {
    if (role === 'defaultAdmin')
      expect(TokenRole.serialize(role)).toBe(
        '0x0000000000000000000000000000000000000000000000000000000000000000',
      )
    else
      expect(TokenRole.serialize(role)).toBe(
        Hash.keccak256(Hex.fromString(TokenRole.toPreHashed[role])),
      )
  })

  expect(TokenRole.serialize('ARBITRARY_ROLE')).toBe(
    '0x1288a906030fe58348e9da8c4847d9d03a41eabb4999a3d64d7c0a7fb8b15c5c',
  )
})
