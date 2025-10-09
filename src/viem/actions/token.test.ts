import { setTimeout } from 'node:timers/promises'
import { Hex } from 'ox'
import * as actions from 'tempo/viem/actions'
import { parseEther, publicActions } from 'viem'
import { mnemonicToAccount } from 'viem/accounts'
import { getCode, writeContractSync } from 'viem/actions'
import { describe, expect, test } from 'vitest'
import { tempoTest } from '../../../test/viem/config.js'
import { tip20Abi } from '../abis.js'
import { defaultFeeTokenAddress, defaultFeeTokenId } from '../addresses.js'
import { createTempoClient } from '../client.js'

const account = mnemonicToAccount(
  'test test test test test test test test test test test junk',
)
const account2 = mnemonicToAccount(
  'test test test test test test test test test test test junk',
  { accountIndex: 1 },
)
const account3 = mnemonicToAccount(
  'test test test test test test test test test test test junk',
  { accountIndex: 2 },
)

const client = createTempoClient({
  account,
  chain: tempoTest,
  pollingInterval: 100,
}).extend(publicActions)

describe('approve', () => {
  test('default', async () => {
    {
      // approve
      const { receipt, ...result } = await actions.token.approveSync(client, {
        spender: account2.address,
        amount: parseEther('100'),
      })
      expect(receipt).toBeDefined()
      expect(result).toMatchInlineSnapshot(`
        {
          "amount": 100000000000000000000n,
          "owner": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
          "spender": "0x8C8d35429F74ec245F8Ef2f4Fd1e551cFF97d650",
        }
      `)
    }

    {
      // check allowance
      const allowance = await actions.token.getAllowance(client, {
        spender: account2.address,
      })
      expect(allowance).toBe(parseEther('100'))
    }

    // transfer tokens for gas
    await writeContractSync(client, {
      abi: tip20Abi,
      address: defaultFeeTokenAddress,
      functionName: 'transfer',
      args: [account2.address, parseEther('1')],
    })

    // transfer tokens from approved account
    await actions.token.transferSync(client, {
      amount: parseEther('50'),
      account: account2,
      from: account.address,
      to: '0x0000000000000000000000000000000000000001',
    })

    {
      // verify updated allowance
      const allowance = await actions.token.getAllowance(client, {
        spender: account2.address,
      })
      expect(allowance).toBe(parseEther('50'))
    }

    // verify balance
    const balance = await actions.token.getBalance(client, {
      account: '0x0000000000000000000000000000000000000001',
    })
    expect(balance).toBe(parseEther('50'))
  })

  test('behavior: token address', async () => {
    {
      // approve
      const { receipt, ...result } = await actions.token.approveSync(client, {
        amount: parseEther('100'),
        token: defaultFeeTokenAddress,
        spender: account2.address,
      })
      expect(receipt).toBeDefined()
      expect(result).toMatchInlineSnapshot(`
        {
          "amount": 100000000000000000000n,
          "owner": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
          "spender": "0x8C8d35429F74ec245F8Ef2f4Fd1e551cFF97d650",
        }
      `)
    }

    {
      // check allowance
      const allowance = await actions.token.getAllowance(client, {
        token: defaultFeeTokenAddress,
        spender: account2.address,
      })
      expect(allowance).toBe(parseEther('100'))
    }

    // transfer tokens for gas
    await writeContractSync(client, {
      abi: tip20Abi,
      address: defaultFeeTokenAddress,
      functionName: 'transfer',
      args: [account2.address, parseEther('1')],
    })

    // transfer tokens from approved account
    await actions.token.transferSync(client, {
      amount: parseEther('50'),
      account: account2,
      from: account.address,
      to: '0x0000000000000000000000000000000000000001',
      token: defaultFeeTokenAddress,
    })

    {
      // verify updated allowance
      const allowance = await actions.token.getAllowance(client, {
        spender: account2.address,
        token: defaultFeeTokenAddress,
      })
      expect(allowance).toBe(parseEther('50'))
    }

    // verify balance
    const balance = await actions.token.getBalance(client, {
      account: '0x0000000000000000000000000000000000000001',
      token: defaultFeeTokenAddress,
    })
    expect(balance).toBe(parseEther('50'))
  })

  test('behavior: token address', async () => {
    {
      // approve
      const { receipt, ...result } = await actions.token.approveSync(client, {
        amount: parseEther('100'),
        token: defaultFeeTokenId,
        spender: account2.address,
      })
      expect(receipt).toBeDefined()
      expect(result).toMatchInlineSnapshot(`
        {
          "amount": 100000000000000000000n,
          "owner": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
          "spender": "0x8C8d35429F74ec245F8Ef2f4Fd1e551cFF97d650",
        }
      `)
    }

    {
      // check allowance
      const allowance = await actions.token.getAllowance(client, {
        token: defaultFeeTokenId,
        spender: account2.address,
      })
      expect(allowance).toBe(parseEther('100'))
    }

    // transfer tokens for gas
    await writeContractSync(client, {
      abi: tip20Abi,
      address: defaultFeeTokenAddress,
      functionName: 'transfer',
      args: [account2.address, parseEther('1')],
    })

    // transfer tokens from approved account
    await actions.token.transferSync(client, {
      amount: parseEther('50'),
      account: account2,
      from: account.address,
      to: '0x0000000000000000000000000000000000000001',
      token: defaultFeeTokenId,
    })

    {
      // verify updated allowance
      const allowance = await actions.token.getAllowance(client, {
        spender: account2.address,
        token: defaultFeeTokenId,
      })
      expect(allowance).toBe(parseEther('50'))
    }

    // verify balance
    const balance = await actions.token.getBalance(client, {
      account: '0x0000000000000000000000000000000000000001',
      token: defaultFeeTokenId,
    })
    expect(balance).toBe(parseEther('50'))
  })
})

describe('create', () => {
  test('default', async () => {
    const { receipt, ...result } = await actions.token.createSync(client, {
      currency: 'USD',
      name: 'Test USD',
      symbol: 'TUSD',
    })

    expect(result).toMatchInlineSnapshot(`
      {
        "admin": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        "currency": "USD",
        "name": "Test USD",
        "symbol": "TUSD",
        "token": "0x20C0000000000000000000000000000000000004",
        "tokenId": 4n,
      }
    `)
    expect(receipt).toBeDefined()

    const code = await getCode(client, {
      address: result.token,
    })
    expect(code).toBe('0xef')
  })
})

describe('getAllowance', () => {
  test('default', async () => {
    // First, approve some allowance
    await writeContractSync(client, {
      abi: tip20Abi,
      address: defaultFeeTokenAddress,
      functionName: 'approve',
      args: [account2.address, parseEther('50')],
    })

    {
      // Test with default token
      const allowance = await actions.token.getAllowance(client, {
        spender: account2.address,
      })
      expect(allowance).toBe(parseEther('50'))
    }

    {
      // Test with token address
      const allowance = await actions.token.getAllowance(client, {
        token: defaultFeeTokenAddress,
        spender: account2.address,
      })

      expect(allowance).toBe(parseEther('50'))
    }

    {
      // Test with token ID
      const allowance = await actions.token.getAllowance(client, {
        token: defaultFeeTokenId,
        spender: account2.address,
      })

      expect(allowance).toBe(parseEther('50'))
    }
  })
})

describe('getBalance', () => {
  test('default', async () => {
    {
      // Test with default token
      const balance = await actions.token.getBalance(client)
      expect(balance).toBeGreaterThan(0n)
    }

    {
      // Test with token address
      const balance = await actions.token.getBalance(client, {
        token: defaultFeeTokenAddress,
      })

      expect(balance).toBeGreaterThan(0n)
    }

    {
      // Test with token ID & different account
      const balance = await actions.token.getBalance(client, {
        token: defaultFeeTokenId,
        account: Hex.random(20),
      })

      expect(balance).toBe(0n)
    }
  })
})

describe('getMetadata', () => {
  test('default', async () => {
    const metadata = await actions.token.getMetadata(client)

    expect(metadata).toMatchInlineSnapshot(`
      {
        "currency": "USD",
        "decimals": 6,
        "name": "AlphaUSD",
        "paused": false,
        "supplyCap": 115792089237316195423570985008687907853269984665640564039457584007913129639935n,
        "symbol": "AlphaUSD",
        "totalSupply": 340282366920938465308049014802723372955n,
        "transferPolicy": "always-allow",
      }
    `)
  })

  test('behavior: custom token (address)', async () => {
    const { token } = await actions.token.createSync(client, {
      currency: 'USD',
      name: 'Test USD',
      symbol: 'TUSD',
    })

    const metadata = await actions.token.getMetadata(client, {
      token,
    })

    expect(metadata).toMatchInlineSnapshot(`
      {
        "currency": "USD",
        "decimals": 6,
        "name": "Test USD",
        "paused": false,
        "supplyCap": 115792089237316195423570985008687907853269984665640564039457584007913129639935n,
        "symbol": "TUSD",
        "totalSupply": 0n,
        "transferPolicy": "always-allow",
      }
    `)
  })

  test('behavior: custom token (id)', async () => {
    const token = await actions.token.createSync(client, {
      currency: 'USD',
      name: 'Test USD',
      symbol: 'TUSD',
    })

    const metadata = await actions.token.getMetadata(client, {
      token: token.tokenId,
    })

    expect(metadata).toMatchInlineSnapshot(`
      {
        "currency": "USD",
        "decimals": 6,
        "name": "Test USD",
        "paused": false,
        "supplyCap": 115792089237316195423570985008687907853269984665640564039457584007913129639935n,
        "symbol": "TUSD",
        "totalSupply": 0n,
        "transferPolicy": "always-allow",
      }
    `)
  })
})

describe('mint', () => {
  test('default', async () => {
    // Create a new token where we're the admin
    const { token } = await actions.token.createSync(client, {
      currency: 'USD',
      name: 'Mintable Token',
      symbol: 'MINT',
    })

    // Grant issuer role
    await actions.token.grantRolesSync(client, {
      token,
      roles: ['issuer'],
      to: client.account.address,
    })

    // Check initial balance
    const balanceBefore = await actions.token.getBalance(client, {
      token,
      account: account2.address,
    })
    expect(balanceBefore).toBe(0n)

    // Mint tokens
    const { receipt: mintReceipt, ...mintResult } =
      await actions.token.mintSync(client, {
        token,
        to: account2.address,
        amount: parseEther('1000'),
      })
    expect(mintReceipt).toBeDefined()
    expect(mintResult).toMatchInlineSnapshot(`
      {
        "amount": 1000000000000000000000n,
        "to": "0x8C8d35429F74ec245F8Ef2f4Fd1e551cFF97d650",
      }
    `)

    // Check balance after mint
    const balanceAfter = await actions.token.getBalance(client, {
      token,
      account: account2.address,
    })
    expect(balanceAfter).toBe(parseEther('1000'))

    // Check total supply
    const metadata = await actions.token.getMetadata(client, {
      token,
    })
    expect(metadata.totalSupply).toBe(parseEther('1000'))
  })

  // TODO: fix
  test.skip('with memo', async () => {
    // Create a new token
    const { token } = await actions.token.createSync(client, {
      admin: client.account,
      currency: 'USD',
      name: 'Mintable Token 2',
      symbol: 'MINT2',
    })

    // Grant issuer role
    await actions.token.grantRolesSync(client, {
      token,
      roles: ['issuer'],
      to: client.account.address,
    })

    // Mint tokens with memo
    const { receipt: mintMemoReceipt, ...mintMemoResult } =
      await actions.token.mintSync(client, {
        token,
        to: account2.address,
        amount: parseEther('500'),
        memo: Hex.fromString('test'),
      })
    expect(mintMemoReceipt.status).toBe('success')
    expect(mintMemoResult).toMatchInlineSnapshot(`
      {
        "amount": 500000000000000000000n,
        "to": "0x8C8d35429F74ec245F8Ef2f4Fd1e551cFF97d650",
      }
    `)

    // Verify balance
    const balance = await actions.token.getBalance(client, {
      token,
      account: account2.address,
    })
    expect(balance).toBe(parseEther('500'))
  })
})

describe.todo('permitToken')

describe('transfer', () => {
  test('default', async () => {
    // Get initial balances
    const senderBalanceBefore = await actions.token.getBalance(client, {
      account: account.address,
    })
    const receiverBalanceBefore = await actions.token.getBalance(client, {
      account: account2.address,
    })

    // Transfer tokens
    const { receipt: transferReceipt, ...transferResult } =
      await actions.token.transferSync(client, {
        to: account2.address,
        amount: parseEther('10'),
      })
    expect(transferReceipt).toBeDefined()
    expect(transferResult).toMatchInlineSnapshot(`
      {
        "amount": 10000000000000000000n,
        "from": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        "to": "0x8C8d35429F74ec245F8Ef2f4Fd1e551cFF97d650",
      }
    `)

    // Verify balances
    const senderBalanceAfter = await actions.token.getBalance(client, {
      account: account.address,
    })
    const receiverBalanceAfter = await actions.token.getBalance(client, {
      account: account2.address,
    })

    expect(senderBalanceAfter - senderBalanceBefore).toBeLessThan(
      parseEther('10'),
    )
    expect(receiverBalanceAfter - receiverBalanceBefore).toBe(parseEther('10'))
  })

  test('behavior: with custom token', async () => {
    // Create a new token
    const { token } = await actions.token.createSync(client, {
      currency: 'USD',
      name: 'Transfer Token',
      symbol: 'XFER',
    })

    // Grant issuer role and mint tokens
    await actions.token.grantRolesSync(client, {
      token,
      roles: ['issuer'],
      to: client.account.address,
    })

    await actions.token.mintSync(client, {
      token,
      to: client.account.address,
      amount: parseEther('1000'),
    })

    // Transfer custom tokens
    await actions.token.transferSync(client, {
      token,
      to: account2.address,
      amount: parseEther('100'),
    })

    // Verify balance
    const balance = await actions.token.getBalance(client, {
      token,
      account: account2.address,
    })
    expect(balance).toBe(parseEther('100'))
  })

  test('behavior: with memo', async () => {
    const memo = Hex.fromString('Payment for services')

    const { receipt: transferMemoReceipt, ...transferMemoResult } =
      await actions.token.transferSync(client, {
        to: account2.address,
        amount: parseEther('5'),
        memo,
      })

    expect(transferMemoReceipt.status).toBe('success')
    expect(transferMemoResult).toMatchInlineSnapshot(`
      {
        "amount": 5000000000000000000n,
        "from": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        "to": "0x8C8d35429F74ec245F8Ef2f4Fd1e551cFF97d650",
      }
    `)
  })

  test('behavior: from another account (transferFrom)', async () => {
    // First approve account2 to spend tokens
    await actions.token.approveSync(client, {
      spender: account2.address,
      amount: parseEther('50'),
    })

    // Transfer tokens for gas
    await writeContractSync(client, {
      abi: tip20Abi,
      address: defaultFeeTokenAddress,
      functionName: 'transfer',
      args: [account2.address, parseEther('1')],
    })

    // Get initial balance
    const balanceBefore = await actions.token.getBalance(client, {
      account: account3.address,
    })

    // Account2 transfers from account to account3
    await actions.token.transferSync(client, {
      account: account2,
      from: account.address,
      to: account3.address,
      amount: parseEther('25'),
    })

    // Verify balance
    const balanceAfter = await actions.token.getBalance(client, {
      account: account3.address,
    })
    expect(balanceAfter - balanceBefore).toBe(parseEther('25'))

    // Verify allowance was reduced
    const allowance = await actions.token.getAllowance(client, {
      spender: account2.address,
    })
    expect(allowance).toBe(parseEther('25'))
  })
})

describe('burn', () => {
  test('default', async () => {
    // Create a new token where we have issuer role
    const { token } = await actions.token.createSync(client, {
      currency: 'USD',
      name: 'Burnable Token',
      symbol: 'BURN',
    })

    // Grant issuer role
    await actions.token.grantRolesSync(client, {
      token,
      roles: ['issuer'],
      to: client.account.address,
    })

    // Mint some tokens
    await actions.token.mintSync(client, {
      token,
      to: client.account.address,
      amount: parseEther('1000'),
    })

    // Check balance before burn
    const balanceBefore = await actions.token.getBalance(client, {
      token,
    })
    expect(balanceBefore).toBe(parseEther('1000'))

    // Check total supply before
    const metadataBefore = await actions.token.getMetadata(client, {
      token,
    })
    expect(metadataBefore.totalSupply).toBe(parseEther('1000'))

    // Burn tokens
    const { receipt, ...result } = await actions.token.burnSync(client, {
      token,
      amount: parseEther('100'),
    })
    expect(receipt).toBeDefined()
    expect(result).toMatchInlineSnapshot(`
      {
        "amount": 100000000000000000000n,
        "from": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      }
    `)

    // Check balance after burn
    const balanceAfter = await actions.token.getBalance(client, {
      token,
    })
    expect(balanceAfter).toBe(parseEther('900'))

    // Check total supply after
    const metadataAfter = await actions.token.getMetadata(client, {
      token,
    })
    expect(metadataAfter.totalSupply).toBe(parseEther('900'))
  })

  test('behavior: requires issuer role', async () => {
    // Create a new token
    const { token } = await actions.token.createSync(client, {
      currency: 'USD',
      name: 'Restricted Burn Token',
      symbol: 'RBURN',
    })

    // Grant issuer role to account2 (not us)
    await actions.token.grantRolesSync(client, {
      token,
      roles: ['issuer'],
      to: account2.address,
    })

    // Transfer gas to account2
    await writeContractSync(client, {
      abi: tip20Abi,
      address: defaultFeeTokenAddress,
      functionName: 'transfer',
      args: [account2.address, parseEther('1')],
    })

    await actions.token.mintSync(client, {
      account: account2,
      token,
      to: client.account.address,
      amount: parseEther('100'),
    })

    // Try to burn without issuer role - should fail
    await expect(
      actions.token.burnSync(client, {
        token,
        amount: parseEther('10'),
      }),
    ).rejects.toThrow()
  })
})

describe.todo('burnBlockedToken')

describe.todo('changeTokenTransferPolicy')

describe('pause', () => {
  test('default', async () => {
    // Create a new token
    const { token } = await actions.token.createSync(client, {
      currency: 'USD',
      name: 'Pausable Token',
      symbol: 'PAUSE',
    })

    // Grant pause role
    await actions.token.grantRolesSync(client, {
      token,
      roles: ['pause'],
      to: client.account.address,
    })

    // Grant issuer role and mint tokens
    await actions.token.grantRolesSync(client, {
      token,
      roles: ['issuer'],
      to: client.account.address,
    })

    await actions.token.mintSync(client, {
      token,
      to: account2.address,
      amount: parseEther('1000'),
    })

    // Verify token is not paused
    let metadata = await actions.token.getMetadata(client, {
      token,
    })
    expect(metadata.paused).toBe(false)

    // Transfer gas
    await writeContractSync(client, {
      abi: tip20Abi,
      address: defaultFeeTokenAddress,
      functionName: 'transfer',
      args: [account2.address, parseEther('1')],
    })

    await actions.token.transferSync(client, {
      account: account2,
      token,
      to: account3.address,
      amount: parseEther('100'),
    })

    // Pause the token
    const { receipt: pauseReceipt, ...pauseResult } =
      await actions.token.pauseSync(client, {
        token,
      })
    expect(pauseReceipt).toBeDefined()
    expect(pauseResult).toMatchInlineSnapshot(`
      {
        "isPaused": true,
        "updater": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      }
    `)

    // Verify token is paused
    metadata = await actions.token.getMetadata(client, {
      token,
    })
    expect(metadata.paused).toBe(true)

    // Transfers should now fail
    await expect(
      actions.token.transferSync(client, {
        account: account2,
        token,
        to: account3.address,
        amount: parseEther('100'),
      }),
    ).rejects.toThrow()
  })

  test('behavior: requires pause role', async () => {
    // Create a new token
    const { token } = await actions.token.createSync(client, {
      currency: 'USD',
      name: 'Restricted Pause Token',
      symbol: 'RPAUSE',
    })

    // Try to pause without pause role - should fail
    await expect(
      actions.token.pauseSync(client, {
        token,
      }),
    ).rejects.toThrow()

    // Grant pause role to account2
    await actions.token.grantRolesSync(client, {
      token,
      roles: ['pause'],
      to: account2.address,
    })

    // Transfer gas to account2
    await writeContractSync(client, {
      abi: tip20Abi,
      address: defaultFeeTokenAddress,
      functionName: 'transfer',
      args: [account2.address, parseEther('1')],
    })

    await actions.token.pauseSync(client, {
      account: account2,
      token,
    })

    // Verify token is paused
    const metadata = await actions.token.getMetadata(client, {
      token,
    })
    expect(metadata.paused).toBe(true)
  })

  test('behavior: cannot pause already paused token', async () => {
    // Create a new token
    const { token: address } = await actions.token.createSync(client, {
      currency: 'USD',
      name: 'Double Pause Token',
      symbol: 'DPAUSE',
    })

    // Grant pause role
    await actions.token.grantRolesSync(client, {
      token: address,
      roles: ['pause'],
      to: client.account.address,
    })

    // Pause the token
    await actions.token.pauseSync(client, {
      token: address,
    })

    // Try to pause again - implementation may vary, but typically this succeeds without error
    const { receipt: doublePauseReceipt, ...doublePauseResult } =
      await actions.token.pauseSync(client, {
        token: address,
      })
    expect(doublePauseReceipt.status).toBe('success')
    expect(doublePauseResult).toMatchInlineSnapshot(`
      {
        "isPaused": true,
        "updater": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      }
    `)
  })
})

describe('unpause', () => {
  test('default', async () => {
    // Create a new token
    const { token: address } = await actions.token.createSync(client, {
      currency: 'USD',
      name: 'Unpausable Token',
      symbol: 'UNPAUSE',
    })

    // Grant pause and unpause roles
    await actions.token.grantRolesSync(client, {
      token: address,
      roles: ['pause'],
      to: client.account.address,
    })

    await actions.token.grantRolesSync(client, {
      token: address,
      roles: ['unpause'],
      to: client.account.address,
    })

    // Grant issuer role and mint tokens
    await actions.token.grantRolesSync(client, {
      token: address,
      roles: ['issuer'],
      to: client.account.address,
    })

    await actions.token.mintSync(client, {
      token: address,
      to: account2.address,
      amount: parseEther('1000'),
    })

    // First pause the token
    await actions.token.pauseSync(client, {
      token: address,
    })

    // Verify token is paused
    let metadata = await actions.token.getMetadata(client, {
      token: address,
    })
    expect(metadata.paused).toBe(true)

    // Transfer gas to account2
    await writeContractSync(client, {
      abi: tip20Abi,
      address: defaultFeeTokenAddress,
      functionName: 'transfer',
      args: [account2.address, parseEther('1')],
    })

    // Verify transfers fail when paused
    await expect(
      actions.token.transferSync(client, {
        account: account2,
        token: address,
        to: account3.address,
        amount: parseEther('100'),
      }),
    ).rejects.toThrow()

    // Unpause the token
    const { receipt: unpauseReceipt, ...unpauseResult } =
      await actions.token.unpauseSync(client, {
        token: address,
      })
    expect(unpauseReceipt).toBeDefined()
    expect(unpauseResult).toMatchInlineSnapshot(`
      {
        "isPaused": false,
        "updater": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      }
    `)

    // Verify token is unpaused
    metadata = await actions.token.getMetadata(client, {
      token: address,
    })
    expect(metadata.paused).toBe(false)

    // Transfers should work again
    await actions.token.transferSync(client, {
      account: account2,
      token: address,
      to: account3.address,
      amount: parseEther('100'),
    })

    const balance = await actions.token.getBalance(client, {
      token: address,
      account: account3.address,
    })
    expect(balance).toBe(parseEther('100'))
  })

  test('behavior: requires unpause role', async () => {
    // Create a new token
    const { token: address } = await actions.token.createSync(client, {
      currency: 'USD',
      name: 'Restricted Unpause Token',
      symbol: 'RUNPAUSE',
    })

    // Grant pause role and pause the token
    await actions.token.grantRolesSync(client, {
      token: address,
      roles: ['pause'],
      to: client.account.address,
    })

    await actions.token.pauseSync(client, {
      token: address,
    })

    // Try to unpause without unpause role - should fail
    await expect(
      actions.token.unpauseSync(client, {
        token: address,
      }),
    ).rejects.toThrow()

    // Grant unpause role to account2
    await actions.token.grantRolesSync(client, {
      token: address,
      roles: ['unpause'],
      to: account2.address,
    })

    // Transfer gas to account2
    await writeContractSync(client, {
      abi: tip20Abi,
      address: defaultFeeTokenAddress,
      functionName: 'transfer',
      args: [account2.address, parseEther('1')],
    })

    // Now account2 should be able to unpause
    await actions.token.unpauseSync(client, {
      account: account2,
      token: address,
    })

    // Verify token is unpaused
    const metadata = await actions.token.getMetadata(client, {
      token: address,
    })
    expect(metadata.paused).toBe(false)
  })

  test('behavior: different roles for pause and unpause', async () => {
    // Create a new token
    const { token: address } = await actions.token.createSync(client, {
      currency: 'USD',
      name: 'Split Role Token',
      symbol: 'SPLIT',
    })

    // Grant pause role to account2
    await actions.token.grantRolesSync(client, {
      token: address,
      roles: ['pause'],
      to: account2.address,
    })

    // Grant unpause role to account3
    await actions.token.grantRolesSync(client, {
      token: address,
      roles: ['unpause'],
      to: account3.address,
    })

    // Transfer gas to both accounts
    await writeContractSync(client, {
      abi: tip20Abi,
      address: defaultFeeTokenAddress,
      functionName: 'transfer',
      args: [account2.address, parseEther('1')],
    })

    await writeContractSync(client, {
      abi: tip20Abi,
      address: defaultFeeTokenAddress,
      functionName: 'transfer',
      args: [account3.address, parseEther('1')],
    })

    // Account2 can pause
    await actions.token.pauseSync(client, {
      account: account2,
      token: address,
    })

    // Account2 cannot unpause
    await expect(
      actions.token.unpauseSync(client, {
        account: account2,
        token: address,
      }),
    ).rejects.toThrow()

    // Account3 can unpause
    await actions.token.unpauseSync(client, {
      account: account3,
      token: address,
    })

    // Verify token is unpaused
    const metadata = await actions.token.getMetadata(client, {
      token: address,
    })
    expect(metadata.paused).toBe(false)
  })
})

describe.todo('setTokenSupplyCap')

describe('grantRoles', () => {
  test('default', async () => {
    // Create a new token where we're the admin
    const { token: address } = await actions.token.createSync(client, {
      admin: client.account,
      currency: 'USD',
      name: 'Test Token',
      symbol: 'TEST',
    })

    // Grant issuer role to account2
    const { receipt: grantReceipt, value: grantValue } =
      await actions.token.grantRolesSync(client, {
        token: address,
        roles: ['issuer'],
        to: account2.address,
      })

    expect(grantReceipt.status).toBe('success')
    expect(grantValue).toMatchInlineSnapshot(`
      [
        {
          "account": "0x8C8d35429F74ec245F8Ef2f4Fd1e551cFF97d650",
          "hasRole": true,
          "role": "0x114e74f6ea3bd819998f78687bfcb11b140da08e9b7d222fa9c1f1ba1f2aa122",
          "sender": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        },
      ]
    `)
  })
})

describe('revokeTokenRole', async () => {
  test('default', async () => {
    const { token: address } = await actions.token.createSync(client, {
      admin: client.account,
      currency: 'USD',
      name: 'Test Token 2',
      symbol: 'TEST2',
    })

    await actions.token.grantRolesSync(client, {
      token: address,
      roles: ['issuer'],
      to: account2.address,
    })

    const { receipt: revokeReceipt, value: revokeValue } =
      await actions.token.revokeRolesSync(client, {
        from: account2.address,
        token: address,
        roles: ['issuer'],
      })

    expect(revokeReceipt.status).toBe('success')
    expect(revokeValue).toMatchInlineSnapshot(`
      [
        {
          "account": "0x8C8d35429F74ec245F8Ef2f4Fd1e551cFF97d650",
          "hasRole": false,
          "role": "0x114e74f6ea3bd819998f78687bfcb11b140da08e9b7d222fa9c1f1ba1f2aa122",
          "sender": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        },
      ]
    `)
  })
})

describe('renounceTokenRole', async () => {
  test('default', async () => {
    const { token: address } = await actions.token.createSync(client, {
      admin: client.account,
      currency: 'USD',
      name: 'Test Token 3',
      symbol: 'TEST3',
    })

    const { receipt: grantReceipt } = await actions.token.grantRolesSync(
      client,
      {
        token: address,
        roles: ['issuer'],
        to: client.account.address,
      },
    )
    expect(grantReceipt.status).toBe('success')

    const { receipt: renounceReceipt, value: renounceValue } =
      await actions.token.renounceRolesSync(client, {
        token: address,
        roles: ['issuer'],
      })

    expect(renounceReceipt.status).toBe('success')
    expect(renounceValue).toMatchInlineSnapshot(`
      [
        {
          "account": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
          "hasRole": false,
          "role": "0x114e74f6ea3bd819998f78687bfcb11b140da08e9b7d222fa9c1f1ba1f2aa122",
          "sender": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        },
      ]
    `)
  })
})

describe.todo('setRoleAdmin')

describe('watchCreate', () => {
  test('default', async () => {
    const receivedTokens: Array<{
      args: actions.token.watchCreate.Args
      log: actions.token.watchCreate.Log
    }> = []

    const unwatch = actions.token.watchCreate(client, {
      onTokenCreated: (args, log) => {
        receivedTokens.push({ args, log })
      },
    })

    try {
      await actions.token.createSync(client, {
        currency: 'USD',
        name: 'Watch Test Token 1',
        symbol: 'WATCH1',
      })

      await actions.token.createSync(client, {
        currency: 'USD',
        name: 'Watch Test Token 2',
        symbol: 'WATCH2',
      })

      await setTimeout(100)

      expect(receivedTokens).toHaveLength(2)

      expect(receivedTokens.at(0)!.args).toMatchInlineSnapshot(`
        {
          "admin": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
          "currency": "USD",
          "name": "Watch Test Token 1",
          "symbol": "WATCH1",
          "token": "0x20C0000000000000000000000000000000000001",
          "tokenId": 1n,
        }
      `)
      expect(receivedTokens.at(1)!.args).toMatchInlineSnapshot(`
        {
          "admin": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
          "currency": "USD",
          "name": "Watch Test Token 2",
          "symbol": "WATCH2",
          "token": "0x20C0000000000000000000000000000000000002",
          "tokenId": 2n,
        }
      `)
    } finally {
      // Clean up watcher
      if (unwatch) unwatch()
    }
  })

  test('behavior: filter by tokenId', async () => {
    // First, create a token to know what ID we're at
    const { tokenId: firstId } = await actions.token.createSync(client, {
      currency: 'USD',
      name: 'Setup Token',
      symbol: 'SETUP',
    })

    // We want to watch for the token with ID = firstId + 2
    const targetTokenId = firstId + 2n

    const receivedTokens: Array<{
      args: actions.token.watchCreate.Args
      log: actions.token.watchCreate.Log
    }> = []

    // Start watching for token creation events only for targetTokenId
    const unwatch = actions.token.watchCreate(client, {
      args: {
        tokenId: targetTokenId,
      },
      onTokenCreated: (args, log) => {
        receivedTokens.push({ args, log })
      },
    })

    try {
      // Create first token (should NOT be captured - ID will be firstId + 1)
      await actions.token.createSync(client, {
        currency: 'USD',
        name: 'Filtered Watch Token 1',
        symbol: 'FWATCH1',
      })

      // Create second token (should be captured - ID will be firstId + 2 = targetTokenId)
      const { tokenId: id2 } = await actions.token.createSync(client, {
        currency: 'USD',
        name: 'Filtered Watch Token 2',
        symbol: 'FWATCH2',
      })

      // Create third token (should NOT be captured - ID will be firstId + 3)
      await actions.token.createSync(client, {
        currency: 'USD',
        name: 'Filtered Watch Token 3',
        symbol: 'FWATCH3',
      })

      await setTimeout(100)

      // Should only receive 1 event (for targetTokenId)
      expect(receivedTokens).toHaveLength(1)

      expect(receivedTokens.at(0)!.args.tokenId).toBe(targetTokenId)
      expect(receivedTokens.at(0)!.args.tokenId).toBe(id2)
      expect(receivedTokens.at(0)!.args).toMatchInlineSnapshot(`
        {
          "admin": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
          "currency": "USD",
          "name": "Filtered Watch Token 2",
          "symbol": "FWATCH2",
          "token": "0x20C0000000000000000000000000000000000003",
          "tokenId": 3n,
        }
      `)

      // Verify the received token has the expected tokenId
      expect(receivedTokens.at(0)!.args.tokenId).toBe(targetTokenId)
    } finally {
      if (unwatch) unwatch()
    }
  })
})

describe('watchMint', () => {
  test('default', async () => {
    // Create a new token for testing
    const { token: address } = await actions.token.createSync(client, {
      currency: 'USD',
      name: 'Mint Watch Token',
      symbol: 'MINT',
    })

    // Grant issuer role
    await actions.token.grantRolesSync(client, {
      token: address,
      roles: ['issuer'],
      to: client.account.address,
    })

    const receivedMints: Array<{
      args: actions.token.watchMint.Args
      log: actions.token.watchMint.Log
    }> = []

    // Start watching for mint events
    const unwatch = actions.token.watchMint(client, {
      token: address,
      onMint: (args, log) => {
        receivedMints.push({ args, log })
      },
    })

    try {
      // Mint first batch
      await actions.token.mintSync(client, {
        token: address,
        to: account2.address,
        amount: parseEther('100'),
      })

      // Mint second batch
      await actions.token.mintSync(client, {
        token: address,
        to: account3.address,
        amount: parseEther('50'),
      })

      await setTimeout(100)

      expect(receivedMints).toHaveLength(2)

      expect(receivedMints.at(0)!.args).toMatchInlineSnapshot(`
        {
          "amount": 100000000000000000000n,
          "to": "0x8C8d35429F74ec245F8Ef2f4Fd1e551cFF97d650",
        }
      `)
      expect(receivedMints.at(1)!.args).toMatchInlineSnapshot(`
        {
          "amount": 50000000000000000000n,
          "to": "0x98e503f35D0a019cB0a251aD243a4cCFCF371F46",
        }
      `)
    } finally {
      if (unwatch) unwatch()
    }
  })

  test('behavior: filter by to address', async () => {
    // Create a new token for testing
    const { token: address } = await actions.token.createSync(client, {
      currency: 'USD',
      name: 'Filtered Mint Token',
      symbol: 'FMINT',
    })

    // Grant issuer role
    await actions.token.grantRolesSync(client, {
      token: address,
      roles: ['issuer'],
      to: client.account.address,
    })

    const receivedMints: Array<{
      args: actions.token.watchMint.Args
      log: actions.token.watchMint.Log
    }> = []

    // Start watching for mint events only to account2
    const unwatch = actions.token.watchMint(client, {
      token: address,
      args: {
        to: account2.address,
      },
      onMint: (args, log) => {
        receivedMints.push({ args, log })
      },
    })

    try {
      // Mint to account2 (should be captured)
      await actions.token.mintSync(client, {
        token: address,
        to: account2.address,
        amount: parseEther('100'),
      })

      // Mint to account3 (should NOT be captured)
      await actions.token.mintSync(client, {
        token: address,
        to: account3.address,
        amount: parseEther('50'),
      })

      // Mint to account2 again (should be captured)
      await actions.token.mintSync(client, {
        token: address,
        to: account2.address,
        amount: parseEther('75'),
      })

      await setTimeout(100)

      // Should only receive 2 events (for account2)
      expect(receivedMints).toHaveLength(2)

      expect(receivedMints.at(0)!.args).toMatchInlineSnapshot(`
        {
          "amount": 100000000000000000000n,
          "to": "0x8C8d35429F74ec245F8Ef2f4Fd1e551cFF97d650",
        }
      `)
      expect(receivedMints.at(1)!.args).toMatchInlineSnapshot(`
        {
          "amount": 75000000000000000000n,
          "to": "0x8C8d35429F74ec245F8Ef2f4Fd1e551cFF97d650",
        }
      `)

      // Verify all received mints are to account2
      for (const mint of receivedMints) {
        expect(mint.args.to).toBe(account2.address)
      }
    } finally {
      if (unwatch) unwatch()
    }
  })
})

describe('watchApprove', () => {
  test('default', async () => {
    // Create a new token for testing
    const { token: address } = await actions.token.createSync(client, {
      currency: 'USD',
      name: 'Approval Watch Token',
      symbol: 'APPR',
    })

    const receivedApprovals: Array<{
      args: actions.token.watchApprove.Args
      log: actions.token.watchApprove.Log
    }> = []

    // Start watching for approval events
    const unwatch = actions.token.watchApprove(client, {
      token: address,
      onApproval: (args, log) => {
        receivedApprovals.push({ args, log })
      },
    })

    try {
      // Approve account2
      await actions.token.approveSync(client, {
        token: address,
        spender: account2.address,
        amount: parseEther('100'),
      })

      // Approve account3
      await actions.token.approveSync(client, {
        token: address,
        spender: account3.address,
        amount: parseEther('50'),
      })

      await setTimeout(100)

      expect(receivedApprovals).toHaveLength(2)

      expect(receivedApprovals.at(0)!.args).toMatchInlineSnapshot(`
        {
          "amount": 100000000000000000000n,
          "owner": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
          "spender": "0x8C8d35429F74ec245F8Ef2f4Fd1e551cFF97d650",
        }
      `)
      expect(receivedApprovals.at(1)!.args).toMatchInlineSnapshot(`
        {
          "amount": 50000000000000000000n,
          "owner": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
          "spender": "0x98e503f35D0a019cB0a251aD243a4cCFCF371F46",
        }
      `)
    } finally {
      if (unwatch) unwatch()
    }
  })

  test('behavior: filter by spender address', async () => {
    // Create a new token for testing
    const { token: address } = await actions.token.createSync(client, {
      currency: 'USD',
      name: 'Filtered Approval Token',
      symbol: 'FAPPR',
    })

    const receivedApprovals: Array<{
      args: actions.token.watchApprove.Args
      log: actions.token.watchApprove.Log
    }> = []

    // Start watching for approval events only to account2
    const unwatch = actions.token.watchApprove(client, {
      token: address,
      args: {
        spender: account2.address,
      },
      onApproval: (args, log) => {
        receivedApprovals.push({ args, log })
      },
    })

    try {
      // Approve account2 (should be captured)
      await actions.token.approveSync(client, {
        token: address,
        spender: account2.address,
        amount: parseEther('100'),
      })

      // Approve account3 (should NOT be captured)
      await actions.token.approveSync(client, {
        token: address,
        spender: account3.address,
        amount: parseEther('50'),
      })

      // Approve account2 again (should be captured)
      await actions.token.approveSync(client, {
        token: address,
        spender: account2.address,
        amount: parseEther('75'),
      })

      await setTimeout(100)

      // Should only receive 2 events (for account2)
      expect(receivedApprovals).toHaveLength(2)

      expect(receivedApprovals.at(0)!.args).toMatchInlineSnapshot(`
        {
          "amount": 100000000000000000000n,
          "owner": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
          "spender": "0x8C8d35429F74ec245F8Ef2f4Fd1e551cFF97d650",
        }
      `)
      expect(receivedApprovals.at(1)!.args).toMatchInlineSnapshot(`
        {
          "amount": 75000000000000000000n,
          "owner": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
          "spender": "0x8C8d35429F74ec245F8Ef2f4Fd1e551cFF97d650",
        }
      `)

      // Verify all received approvals are for account2
      for (const approval of receivedApprovals) {
        expect(approval.args.spender).toBe(account2.address)
      }
    } finally {
      if (unwatch) unwatch()
    }
  })
})

describe('watchBurn', () => {
  test('default', async () => {
    // Create a new token for testing
    const { token: address } = await actions.token.createSync(client, {
      currency: 'USD',
      name: 'Burn Watch Token',
      symbol: 'BURN',
    })

    // Grant issuer role to mint/burn tokens
    await actions.token.grantRolesSync(client, {
      token: address,
      roles: ['issuer'],
      to: client.account.address,
    })

    // Grant issuer role to mint/burn tokens
    await actions.token.grantRolesSync(client, {
      token: address,
      roles: ['issuer'],
      to: account2.address,
    })

    // Mint tokens to burn later
    await actions.token.mintSync(client, {
      token: address,
      to: client.account.address,
      amount: parseEther('200'),
    })

    await actions.token.mintSync(client, {
      token: address,
      to: account2.address,
      amount: parseEther('100'),
    })

    const receivedBurns: Array<{
      args: actions.token.watchBurn.Args
      log: actions.token.watchBurn.Log
    }> = []

    // Start watching for burn events
    const unwatch = actions.token.watchBurn(client, {
      token: address,
      onBurn: (args, log) => {
        receivedBurns.push({ args, log })
      },
    })

    try {
      // Burn first batch
      await actions.token.burnSync(client, {
        token: address,
        amount: parseEther('50'),
      })

      // Transfer gas to account2
      await writeContractSync(client, {
        abi: tip20Abi,
        address: defaultFeeTokenAddress,
        functionName: 'transfer',
        args: [account2.address, parseEther('1')],
      })

      // Burn second batch from account2
      await actions.token.burnSync(client, {
        account: account2,
        token: address,
        amount: parseEther('25'),
      })

      await setTimeout(100)

      expect(receivedBurns).toHaveLength(2)

      expect(receivedBurns.at(0)!.args).toMatchInlineSnapshot(`
        {
          "amount": 50000000000000000000n,
          "from": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        }
      `)
      expect(receivedBurns.at(1)!.args).toMatchInlineSnapshot(`
        {
          "amount": 25000000000000000000n,
          "from": "0x8C8d35429F74ec245F8Ef2f4Fd1e551cFF97d650",
        }
      `)
    } finally {
      if (unwatch) unwatch()
    }
  })

  test('behavior: filter by from address', async () => {
    // Create a new token for testing
    const { token: address } = await actions.token.createSync(client, {
      currency: 'USD',
      name: 'Filtered Burn Token',
      symbol: 'FBURN',
    })

    // Grant issuer role
    await actions.token.grantRolesSync(client, {
      token: address,
      roles: ['issuer'],
      to: client.account.address,
    })

    // Grant issuer role
    await actions.token.grantRolesSync(client, {
      token: address,
      roles: ['issuer'],
      to: account2.address,
    })

    // Mint tokens to multiple accounts
    await actions.token.mintSync(client, {
      token: address,
      to: client.account.address,
      amount: parseEther('200'),
    })

    await actions.token.mintSync(client, {
      token: address,
      to: account2.address,
      amount: parseEther('200'),
    })

    const receivedBurns: Array<{
      args: actions.token.watchBurn.Args
      log: actions.token.watchBurn.Log
    }> = []

    // Start watching for burn events only from client.account
    const unwatch = actions.token.watchBurn(client, {
      token: address,
      args: {
        from: client.account.address,
      },
      onBurn: (args, log) => {
        receivedBurns.push({ args, log })
      },
    })

    try {
      // Burn from client.account (should be captured)
      await actions.token.burnSync(client, {
        token: address,
        amount: parseEther('50'),
      })

      // Transfer gas to account2
      await writeContractSync(client, {
        abi: tip20Abi,
        address: defaultFeeTokenAddress,
        functionName: 'transfer',
        args: [account2.address, parseEther('1')],
      })

      // Burn from account2 (should NOT be captured)
      await actions.token.burnSync(client, {
        account: account2,
        token: address,
        amount: parseEther('25'),
      })

      // Burn from client.account again (should be captured)
      await actions.token.burnSync(client, {
        token: address,
        amount: parseEther('75'),
      })

      await setTimeout(100)

      // Should only receive 2 events (from client.account)
      expect(receivedBurns).toHaveLength(2)

      expect(receivedBurns.at(0)!.args).toMatchInlineSnapshot(`
        {
          "amount": 50000000000000000000n,
          "from": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        }
      `)
      expect(receivedBurns.at(1)!.args).toMatchInlineSnapshot(`
        {
          "amount": 75000000000000000000n,
          "from": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        }
      `)

      // Verify all received burns are from client.account
      for (const burn of receivedBurns) {
        expect(burn.args.from).toBe(client.account.address)
      }
    } finally {
      if (unwatch) unwatch()
    }
  })
})

describe('watchAdminRole', () => {
  test('default', async () => {
    // Create a new token for testing
    const { token: address } = await actions.token.createSync(client, {
      currency: 'USD',
      name: 'Admin Role Watch Token',
      symbol: 'ADMIN',
    })

    const receivedAdminUpdates: Array<{
      args: actions.token.watchAdminRole.Args
      log: actions.token.watchAdminRole.Log
    }> = []

    // Start watching for role admin updates
    const unwatch = actions.token.watchAdminRole(client, {
      token: address,
      onRoleAdminUpdated: (args, log) => {
        receivedAdminUpdates.push({ args, log })
      },
    })

    try {
      // Set role admin for issuer role
      const { receipt: setRoleAdmin1Receipt, ...setRoleAdmin1Result } =
        await actions.token.setRoleAdminSync(client, {
          token: address,
          role: 'issuer',
          adminRole: 'pause',
        })
      expect(setRoleAdmin1Receipt).toBeDefined()
      expect(setRoleAdmin1Result).toMatchInlineSnapshot(`
        {
          "newAdminRole": "0x139c2898040ef16910dc9f44dc697df79363da767d8bc92f2e310312b816e46d",
          "role": "0x114e74f6ea3bd819998f78687bfcb11b140da08e9b7d222fa9c1f1ba1f2aa122",
          "sender": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        }
      `)

      // Set role admin for pause role
      await actions.token.setRoleAdminSync(client, {
        token: address,
        role: 'pause',
        adminRole: 'unpause',
      })

      await setTimeout(100)

      expect(receivedAdminUpdates).toHaveLength(2)

      expect(receivedAdminUpdates.at(0)!.args.sender).toBe(
        client.account.address,
      )
      expect(receivedAdminUpdates.at(1)!.args.sender).toBe(
        client.account.address,
      )
    } finally {
      if (unwatch) unwatch()
    }
  })
})

describe('watchRole', () => {
  test('default', async () => {
    // Create a new token for testing
    const { token: address } = await actions.token.createSync(client, {
      currency: 'USD',
      name: 'Role Watch Token',
      symbol: 'ROLE',
    })

    const receivedRoleUpdates: Array<{
      args: actions.token.watchRole.Args
      log: actions.token.watchRole.Log
    }> = []

    // Start watching for role membership updates
    const unwatch = actions.token.watchRole(client, {
      token: address,
      onRoleUpdated: (args, log) => {
        receivedRoleUpdates.push({ args, log })
      },
    })

    try {
      // Grant issuer role to account2
      await actions.token.grantRolesSync(client, {
        token: address,
        roles: ['issuer'],
        to: account2.address,
      })

      // Grant pause role to account3
      await actions.token.grantRolesSync(client, {
        token: address,
        roles: ['pause'],
        to: account3.address,
      })

      // Revoke issuer role from account2
      await actions.token.revokeRolesSync(client, {
        token: address,
        roles: ['issuer'],
        from: account2.address,
      })

      await setTimeout(100)

      expect(receivedRoleUpdates).toHaveLength(3)

      // First event: grant issuer
      expect(receivedRoleUpdates.at(0)!.args.type).toBe('granted')
      expect(receivedRoleUpdates.at(0)!.args.account).toBe(account2.address)
      expect(receivedRoleUpdates.at(0)!.args.hasRole).toBe(true)

      // Second event: grant pause
      expect(receivedRoleUpdates.at(1)!.args.type).toBe('granted')
      expect(receivedRoleUpdates.at(1)!.args.account).toBe(account3.address)
      expect(receivedRoleUpdates.at(1)!.args.hasRole).toBe(true)

      // Third event: revoke issuer
      expect(receivedRoleUpdates.at(2)!.args.type).toBe('revoked')
      expect(receivedRoleUpdates.at(2)!.args.account).toBe(account2.address)
      expect(receivedRoleUpdates.at(2)!.args.hasRole).toBe(false)
    } finally {
      if (unwatch) unwatch()
    }
  })

  test('behavior: filter by account address', async () => {
    // Create a new token for testing
    const { token: address } = await actions.token.createSync(client, {
      currency: 'USD',
      name: 'Filtered Role Token',
      symbol: 'FROLE',
    })

    const receivedRoleUpdates: Array<{
      args: actions.token.watchRole.Args
      log: actions.token.watchRole.Log
    }> = []

    // Start watching for role updates only for account2
    const unwatch = actions.token.watchRole(client, {
      token: address,
      args: {
        account: account2.address,
      },
      onRoleUpdated: (args, log) => {
        receivedRoleUpdates.push({ args, log })
      },
    })

    try {
      // Grant issuer role to account2 (should be captured)
      await actions.token.grantRolesSync(client, {
        token: address,
        roles: ['issuer'],
        to: account2.address,
      })

      // Grant pause role to account3 (should NOT be captured)
      await actions.token.grantRolesSync(client, {
        token: address,
        roles: ['pause'],
        to: account3.address,
      })

      // Revoke issuer role from account2 (should be captured)
      await actions.token.revokeRolesSync(client, {
        token: address,
        roles: ['issuer'],
        from: account2.address,
      })

      await setTimeout(100)

      // Should only receive 2 events (for account2)
      expect(receivedRoleUpdates).toHaveLength(2)

      // First: grant to account2
      expect(receivedRoleUpdates.at(0)!.args.type).toBe('granted')
      expect(receivedRoleUpdates.at(0)!.args.account).toBe(account2.address)
      expect(receivedRoleUpdates.at(0)!.args.hasRole).toBe(true)

      // Second: revoke from account2
      expect(receivedRoleUpdates.at(1)!.args.type).toBe('revoked')
      expect(receivedRoleUpdates.at(1)!.args.account).toBe(account2.address)
      expect(receivedRoleUpdates.at(1)!.args.hasRole).toBe(false)

      // Verify all received events are for account2
      for (const update of receivedRoleUpdates) {
        expect(update.args.account).toBe(account2.address)
      }
    } finally {
      if (unwatch) unwatch()
    }
  })
})

describe('watchTransfer', () => {
  test('default', async () => {
    // Create a new token for testing
    const { token: address } = await actions.token.createSync(client, {
      currency: 'USD',
      name: 'Transfer Watch Token',
      symbol: 'XFER',
    })

    // Grant issuer role to mint tokens
    await actions.token.grantRolesSync(client, {
      token: address,
      roles: ['issuer'],
      to: client.account.address,
    })

    // Mint tokens to transfer
    await actions.token.mintSync(client, {
      token: address,
      to: client.account.address,
      amount: parseEther('500'),
    })

    const receivedTransfers: Array<{
      args: actions.token.watchTransfer.Args
      log: actions.token.watchTransfer.Log
    }> = []

    // Start watching for transfer events
    const unwatch = actions.token.watchTransfer(client, {
      token: address,
      onTransfer: (args, log) => {
        receivedTransfers.push({ args, log })
      },
    })

    try {
      // Transfer to account2
      await actions.token.transferSync(client, {
        token: address,
        to: account2.address,
        amount: parseEther('100'),
      })

      // Transfer to account3
      await actions.token.transferSync(client, {
        token: address,
        to: account3.address,
        amount: parseEther('50'),
      })

      await setTimeout(200)

      expect(receivedTransfers).toHaveLength(2)

      expect(receivedTransfers.at(0)!.args).toMatchInlineSnapshot(`
        {
          "amount": 100000000000000000000n,
          "from": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
          "to": "0x8C8d35429F74ec245F8Ef2f4Fd1e551cFF97d650",
        }
      `)
      expect(receivedTransfers.at(1)!.args).toMatchInlineSnapshot(`
        {
          "amount": 50000000000000000000n,
          "from": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
          "to": "0x98e503f35D0a019cB0a251aD243a4cCFCF371F46",
        }
      `)
    } finally {
      if (unwatch) unwatch()
    }
  })

  test('behavior: filter by to address', async () => {
    // Create a new token for testing
    const { token: address } = await actions.token.createSync(client, {
      currency: 'USD',
      name: 'Filtered Transfer Token',
      symbol: 'FXFER',
    })

    // Grant issuer role
    await actions.token.grantRolesSync(client, {
      token: address,
      roles: ['issuer'],
      to: client.account.address,
    })

    // Mint tokens
    await actions.token.mintSync(client, {
      token: address,
      to: client.account.address,
      amount: parseEther('500'),
    })

    const receivedTransfers: Array<{
      args: actions.token.watchTransfer.Args
      log: actions.token.watchTransfer.Log
    }> = []

    // Start watching for transfer events only to account2
    const unwatch = actions.token.watchTransfer(client, {
      token: address,
      args: {
        to: account2.address,
      },
      onTransfer: (args, log) => {
        receivedTransfers.push({ args, log })
      },
    })

    try {
      // Transfer to account2 (should be captured)
      await actions.token.transferSync(client, {
        token: address,
        to: account2.address,
        amount: parseEther('100'),
      })

      // Transfer to account3 (should NOT be captured)
      await actions.token.transferSync(client, {
        token: address,
        to: account3.address,
        amount: parseEther('50'),
      })

      // Transfer to account2 again (should be captured)
      await actions.token.transferSync(client, {
        token: address,
        to: account2.address,
        amount: parseEther('75'),
      })

      await setTimeout(100)

      // Should only receive 2 events (to account2)
      expect(receivedTransfers).toHaveLength(2)

      expect(receivedTransfers.at(0)!.args).toMatchInlineSnapshot(`
        {
          "amount": 100000000000000000000n,
          "from": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
          "to": "0x8C8d35429F74ec245F8Ef2f4Fd1e551cFF97d650",
        }
      `)
      expect(receivedTransfers.at(1)!.args).toMatchInlineSnapshot(`
        {
          "amount": 75000000000000000000n,
          "from": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
          "to": "0x8C8d35429F74ec245F8Ef2f4Fd1e551cFF97d650",
        }
      `)

      // Verify all received transfers are to account2
      for (const transfer of receivedTransfers) {
        expect(transfer.args.to).toBe(account2.address)
      }
    } finally {
      if (unwatch) unwatch()
    }
  })
})
