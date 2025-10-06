import { afterEach, beforeEach, describe, expect, test } from 'bun:test'
import { setTimeout } from 'node:timers/promises'
import { Hex } from 'ox'
import { tempoLocal } from 'tempo/chains'
import { Instance } from 'tempo/prool'
import * as actions from 'tempo/viem/actions'
import { parseEther, publicActions } from 'viem'
import { mnemonicToAccount } from 'viem/accounts'
import { getCode, waitForTransactionReceipt, writeContract } from 'viem/actions'
import { tip20Abi } from '../abis.js'
import { usdAddress, usdId } from '../addresses.js'
import { createTempoClient } from '../client.js'

const instance = Instance.tempo({ port: 8545 })

beforeEach(() => instance.start())
afterEach(() => instance.stop())

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
  chain: tempoLocal,
  pollingInterval: 100,
}).extend(publicActions)

describe.skipIf(!!process.env.CI)('approve', () => {
  test('default', async () => {
    {
      // approve
      const hash = await actions.token.approve(client, {
        spender: account2.address,
        amount: parseEther('100'),
      })
      await waitForTransactionReceipt(client, { hash })
    }

    {
      // check allowance
      const allowance = await actions.token.getAllowance(client, {
        spender: account2.address,
      })
      expect(allowance).toBe(parseEther('100'))
    }

    {
      // transfer tokens for gas
      const hash = await writeContract(client, {
        abi: tip20Abi,
        address: usdAddress,
        functionName: 'transfer',
        args: [account2.address, parseEther('1')],
      })
      await waitForTransactionReceipt(client, { hash })
    }

    {
      // transfer tokens from approved account
      const hash = await actions.token.transfer(client, {
        amount: parseEther('50'),
        account: account2,
        from: account.address,
        to: '0x0000000000000000000000000000000000000001',
      })
      await waitForTransactionReceipt(client, { hash })
    }

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
      const hash = await actions.token.approve(client, {
        amount: parseEther('100'),
        token: usdAddress,
        spender: account2.address,
      })
      await waitForTransactionReceipt(client, { hash })
    }

    {
      // check allowance
      const allowance = await actions.token.getAllowance(client, {
        token: usdAddress,
        spender: account2.address,
      })
      expect(allowance).toBe(parseEther('100'))
    }

    {
      // transfer tokens for gas
      const hash = await writeContract(client, {
        abi: tip20Abi,
        address: usdAddress,
        functionName: 'transfer',
        args: [account2.address, parseEther('1')],
      })
      await waitForTransactionReceipt(client, { hash })
    }

    {
      // transfer tokens from approved account
      const hash = await actions.token.transfer(client, {
        amount: parseEther('50'),
        account: account2,
        from: account.address,
        to: '0x0000000000000000000000000000000000000001',
        token: usdAddress,
      })
      await waitForTransactionReceipt(client, { hash })
    }

    {
      // verify updated allowance
      const allowance = await actions.token.getAllowance(client, {
        spender: account2.address,
        token: usdAddress,
      })
      expect(allowance).toBe(parseEther('50'))
    }

    // verify balance
    const balance = await actions.token.getBalance(client, {
      account: '0x0000000000000000000000000000000000000001',
      token: usdAddress,
    })
    expect(balance).toBe(parseEther('50'))
  })

  test('behavior: token address', async () => {
    {
      // approve
      const hash = await actions.token.approve(client, {
        amount: parseEther('100'),
        token: usdId,
        spender: account2.address,
      })
      await waitForTransactionReceipt(client, { hash })
    }

    {
      // check allowance
      const allowance = await actions.token.getAllowance(client, {
        token: usdId,
        spender: account2.address,
      })
      expect(allowance).toBe(parseEther('100'))
    }

    {
      // transfer tokens for gas
      const hash = await writeContract(client, {
        abi: tip20Abi,
        address: usdAddress,
        functionName: 'transfer',
        args: [account2.address, parseEther('1')],
      })
      await waitForTransactionReceipt(client, { hash })
    }

    {
      // transfer tokens from approved account
      const hash = await actions.token.transfer(client, {
        amount: parseEther('50'),
        account: account2,
        from: account.address,
        to: '0x0000000000000000000000000000000000000001',
        token: usdId,
      })
      await waitForTransactionReceipt(client, { hash })
    }

    {
      // verify updated allowance
      const allowance = await actions.token.getAllowance(client, {
        spender: account2.address,
        token: usdId,
      })
      expect(allowance).toBe(parseEther('50'))
    }

    // verify balance
    const balance = await actions.token.getBalance(client, {
      account: '0x0000000000000000000000000000000000000001',
      token: usdId,
    })
    expect(balance).toBe(parseEther('50'))
  })
})

describe.skipIf(!!process.env.CI)('create', () => {
  test('default', async () => {
    const { hash, ...result } = await actions.token.create(client, {
      currency: 'USD',
      name: 'Test USD',
      symbol: 'TUSD',
    })

    expect(result).toMatchInlineSnapshot(`
        {
          "address": "0x20c0000000000000000000000000000000000001",
          "admin": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
          "id": 1n,
        }
      `)
    expect(hash).toBeDefined()

    await waitForTransactionReceipt(client, { hash })

    const code = await getCode(client, {
      address: result.address,
    })
    expect(code).toBe('0xef')
  })
})

describe.skipIf(!!process.env.CI)('getAllowance', () => {
  test('default', async () => {
    // First, approve some allowance
    const hash = await writeContract(client, {
      abi: tip20Abi,
      address: usdAddress,
      functionName: 'approve',
      args: [account2.address, parseEther('50')],
    })
    await waitForTransactionReceipt(client, { hash })

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
        token: usdAddress,
        spender: account2.address,
      })

      expect(allowance).toBe(parseEther('50'))
    }

    {
      // Test with token ID
      const allowance = await actions.token.getAllowance(client, {
        token: usdId,
        spender: account2.address,
      })

      expect(allowance).toBe(parseEther('50'))
    }
  })
})

describe.skipIf(!!process.env.CI)('getBalance', () => {
  test('default', async () => {
    {
      // Test with default token
      const balance = await actions.token.getBalance(client)
      expect(balance).toBeGreaterThan(0n)
    }

    {
      // Test with token address
      const balance = await actions.token.getBalance(client, {
        token: usdAddress,
      })

      expect(balance).toBeGreaterThan(0n)
    }

    {
      // Test with token ID & different account
      const balance = await actions.token.getBalance(client, {
        token: usdId,
        account: Hex.random(20),
      })

      expect(balance).toBe(0n)
    }
  })
})

describe.skipIf(!!process.env.CI)('getMetadata', () => {
  test('default', async () => {
    const metadata = await actions.token.getMetadata(client)

    expect(metadata).toMatchInlineSnapshot(`
      {
        "currency": "USD",
        "decimals": 6,
        "name": "TestUSD",
        "paused": false,
        "supplyCap": 115792089237316195423570985008687907853269984665640564039457584007913129639935n,
        "symbol": "TestUSD",
        "totalSupply": 340282366920938463647842048168863727605n,
        "transferPolicy": "always-allow",
      }
    `)
  })

  test('behavior: custom token (address)', async () => {
    const { address, hash } = await actions.token.create(client, {
      currency: 'USD',
      name: 'Test USD',
      symbol: 'TUSD',
    })
    await waitForTransactionReceipt(client, { hash })

    const metadata = await actions.token.getMetadata(client, {
      token: address,
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
    const token = await actions.token.create(client, {
      currency: 'USD',
      name: 'Test USD',
      symbol: 'TUSD',
    })
    await waitForTransactionReceipt(client, { hash: token.hash })

    const metadata = await actions.token.getMetadata(client, {
      token: token.id,
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

describe.skipIf(!!process.env.CI)('mint', () => {
  test('default', async () => {
    // Create a new token where we're the admin
    const { address, hash: createHash } = await actions.token.create(client, {
      currency: 'USD',
      name: 'Mintable Token',
      symbol: 'MINT',
    })
    await waitForTransactionReceipt(client, { hash: createHash })

    // Grant issuer role
    const grantHash = await actions.token.grantRoles(client, {
      token: address,
      roles: ['issuer'],
      to: client.account.address,
    })
    await waitForTransactionReceipt(client, { hash: grantHash })

    // Check initial balance
    const balanceBefore = await actions.token.getBalance(client, {
      token: address,
      account: account2.address,
    })
    expect(balanceBefore).toBe(0n)

    // Mint tokens
    const mintHash = await actions.token.mint(client, {
      token: address,
      to: account2.address,
      amount: parseEther('1000'),
    })
    await waitForTransactionReceipt(client, { hash: mintHash })

    // Check balance after mint
    const balanceAfter = await actions.token.getBalance(client, {
      token: address,
      account: account2.address,
    })
    expect(balanceAfter).toBe(parseEther('1000'))

    // Check total supply
    const metadata = await actions.token.getMetadata(client, {
      token: address,
    })
    expect(metadata.totalSupply).toBe(parseEther('1000'))
  })

  // TODO: fix
  test.skip('with memo', async () => {
    // Create a new token
    const { address, hash: createHash } = await actions.token.create(client, {
      admin: client.account,
      currency: 'USD',
      name: 'Mintable Token 2',
      symbol: 'MINT2',
    })
    await waitForTransactionReceipt(client, { hash: createHash })

    // Grant issuer role
    const grantHash = await actions.token.grantRoles(client, {
      token: address,
      roles: ['issuer'],
      to: client.account.address,
    })
    await waitForTransactionReceipt(client, { hash: grantHash })

    // Mint tokens with memo
    const mintHash = await actions.token.mint(client, {
      token: address,
      to: account2.address,
      amount: parseEther('500'),
      memo: Hex.fromString('test'),
    })
    const receipt = await waitForTransactionReceipt(client, { hash: mintHash })
    expect(receipt.status).toBe('success')

    // Verify balance
    const balance = await actions.token.getBalance(client, {
      token: address,
      account: account2.address,
    })
    expect(balance).toBe(parseEther('500'))
  })
})

describe.todo('permitToken')

describe.skipIf(!!process.env.CI)('transfer', () => {
  test('default', async () => {
    // Get initial balances
    const senderBalanceBefore = await actions.token.getBalance(client, {
      account: account.address,
    })
    const receiverBalanceBefore = await actions.token.getBalance(client, {
      account: account2.address,
    })

    // Transfer tokens
    const hash = await actions.token.transfer(client, {
      to: account2.address,
      amount: parseEther('10'),
    })
    await waitForTransactionReceipt(client, { hash })

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
    const { address, hash: createHash } = await actions.token.create(client, {
      currency: 'USD',
      name: 'Transfer Token',
      symbol: 'XFER',
    })
    await waitForTransactionReceipt(client, { hash: createHash })

    // Grant issuer role and mint tokens
    const grantHash = await actions.token.grantRoles(client, {
      token: address,
      roles: ['issuer'],
      to: client.account.address,
    })
    await waitForTransactionReceipt(client, { hash: grantHash })

    const mintHash = await actions.token.mint(client, {
      token: address,
      to: client.account.address,
      amount: parseEther('1000'),
    })
    await waitForTransactionReceipt(client, { hash: mintHash })

    // Transfer custom tokens
    const transferHash = await actions.token.transfer(client, {
      token: address,
      to: account2.address,
      amount: parseEther('100'),
    })
    await waitForTransactionReceipt(client, { hash: transferHash })

    // Verify balance
    const balance = await actions.token.getBalance(client, {
      token: address,
      account: account2.address,
    })
    expect(balance).toBe(parseEther('100'))
  })

  test('behavior: with memo', async () => {
    const memo = Hex.fromString('Payment for services')

    const hash = await actions.token.transfer(client, {
      to: account2.address,
      amount: parseEther('5'),
      memo,
    })
    const receipt = await waitForTransactionReceipt(client, { hash })

    expect(receipt.status).toBe('success')
  })

  test('behavior: from another account (transferFrom)', async () => {
    // First approve account2 to spend tokens
    const approveHash = await actions.token.approve(client, {
      spender: account2.address,
      amount: parseEther('50'),
    })
    await waitForTransactionReceipt(client, { hash: approveHash })

    // Transfer tokens for gas
    const gasHash = await writeContract(client, {
      abi: tip20Abi,
      address: usdAddress,
      functionName: 'transfer',
      args: [account2.address, parseEther('1')],
    })
    await waitForTransactionReceipt(client, { hash: gasHash })

    // Get initial balance
    const balanceBefore = await actions.token.getBalance(client, {
      account: account3.address,
    })

    // Account2 transfers from account to account3
    const transferHash = await actions.token.transfer(client, {
      account: account2,
      from: account.address,
      to: account3.address,
      amount: parseEther('25'),
    })
    await waitForTransactionReceipt(client, { hash: transferHash })

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

describe.skipIf(!!process.env.CI)('burn', () => {
  test('default', async () => {
    // Create a new token where we have issuer role
    const { address, hash: createHash } = await actions.token.create(client, {
      currency: 'USD',
      name: 'Burnable Token',
      symbol: 'BURN',
    })
    await waitForTransactionReceipt(client, { hash: createHash })

    // Grant issuer role
    const grantHash = await actions.token.grantRoles(client, {
      token: address,
      roles: ['issuer'],
      to: client.account.address,
    })
    await waitForTransactionReceipt(client, { hash: grantHash })

    // Mint some tokens
    const mintHash = await actions.token.mint(client, {
      token: address,
      to: client.account.address,
      amount: parseEther('1000'),
    })
    await waitForTransactionReceipt(client, { hash: mintHash })

    // Check balance before burn
    const balanceBefore = await actions.token.getBalance(client, {
      token: address,
    })
    expect(balanceBefore).toBe(parseEther('1000'))

    // Check total supply before
    const metadataBefore = await actions.token.getMetadata(client, {
      token: address,
    })
    expect(metadataBefore.totalSupply).toBe(parseEther('1000'))

    // Burn tokens
    const burnHash = await actions.token.burn(client, {
      token: address,
      amount: parseEther('100'),
    })
    await waitForTransactionReceipt(client, { hash: burnHash })

    // Check balance after burn
    const balanceAfter = await actions.token.getBalance(client, {
      token: address,
    })
    expect(balanceAfter).toBe(parseEther('900'))

    // Check total supply after
    const metadataAfter = await actions.token.getMetadata(client, {
      token: address,
    })
    expect(metadataAfter.totalSupply).toBe(parseEther('900'))
  })

  test('behavior: requires issuer role', async () => {
    // Create a new token
    const { address, hash: createHash } = await actions.token.create(client, {
      currency: 'USD',
      name: 'Restricted Burn Token',
      symbol: 'RBURN',
    })
    await waitForTransactionReceipt(client, { hash: createHash })

    // Grant issuer role to account2 (not us)
    const grantHash = await actions.token.grantRoles(client, {
      token: address,
      roles: ['issuer'],
      to: account2.address,
    })
    await waitForTransactionReceipt(client, { hash: grantHash })

    // Transfer gas to account2
    const gasHash = await writeContract(client, {
      abi: tip20Abi,
      address: usdAddress,
      functionName: 'transfer',
      args: [account2.address, parseEther('1')],
    })
    await waitForTransactionReceipt(client, { hash: gasHash })

    const mintHash = await actions.token.mint(client, {
      account: account2,
      token: address,
      to: client.account.address,
      amount: parseEther('100'),
    })
    await waitForTransactionReceipt(client, { hash: mintHash })

    // Try to burn without issuer role - should fail
    expect(
      actions.token.burn(client, {
        token: address,
        amount: parseEther('10'),
      }),
    ).rejects.toThrow()
  })
})

describe.todo('burnBlockedToken')

describe.todo('changeTokenTransferPolicy')

describe.skipIf(!!process.env.CI)('pause', () => {
  test('default', async () => {
    // Create a new token
    const { address, hash: createHash } = await actions.token.create(client, {
      currency: 'USD',
      name: 'Pausable Token',
      symbol: 'PAUSE',
    })
    await waitForTransactionReceipt(client, { hash: createHash })

    // Grant pause role
    const grantHash = await actions.token.grantRoles(client, {
      token: address,
      roles: ['pause'],
      to: client.account.address,
    })
    await waitForTransactionReceipt(client, { hash: grantHash })

    // Grant issuer role and mint tokens
    const grantIssuerHash = await actions.token.grantRoles(client, {
      token: address,
      roles: ['issuer'],
      to: client.account.address,
    })
    await waitForTransactionReceipt(client, { hash: grantIssuerHash })

    const mintHash = await actions.token.mint(client, {
      token: address,
      to: account2.address,
      amount: parseEther('1000'),
    })
    await waitForTransactionReceipt(client, { hash: mintHash })

    // Verify token is not paused
    let metadata = await actions.token.getMetadata(client, {
      token: address,
    })
    expect(metadata.paused).toBe(false)

    // Transfer gas
    const gasHash = await writeContract(client, {
      abi: tip20Abi,
      address: usdAddress,
      functionName: 'transfer',
      args: [account2.address, parseEther('1')],
    })
    await waitForTransactionReceipt(client, { hash: gasHash })

    const transferHash = await actions.token.transfer(client, {
      account: account2,
      token: address,
      to: account3.address,
      amount: parseEther('100'),
    })
    await waitForTransactionReceipt(client, { hash: transferHash })

    // Pause the token
    const pauseHash = await actions.token.pause(client, {
      token: address,
    })
    await waitForTransactionReceipt(client, { hash: pauseHash })

    // Verify token is paused
    metadata = await actions.token.getMetadata(client, {
      token: address,
    })
    expect(metadata.paused).toBe(true)

    // Transfers should now fail
    expect(
      actions.token.transfer(client, {
        account: account2,
        token: address,
        to: account3.address,
        amount: parseEther('100'),
      }),
    ).rejects.toThrow()
  })

  test('behavior: requires pause role', async () => {
    // Create a new token
    const { address, hash: createHash } = await actions.token.create(client, {
      currency: 'USD',
      name: 'Restricted Pause Token',
      symbol: 'RPAUSE',
    })
    await waitForTransactionReceipt(client, { hash: createHash })

    // Try to pause without pause role - should fail
    expect(
      actions.token.pause(client, {
        token: address,
      }),
    ).rejects.toThrow()

    // Grant pause role to account2
    const grantHash = await actions.token.grantRoles(client, {
      token: address,
      roles: ['pause'],
      to: account2.address,
    })
    await waitForTransactionReceipt(client, { hash: grantHash })

    // Transfer gas to account2
    const gasHash = await writeContract(client, {
      abi: tip20Abi,
      address: usdAddress,
      functionName: 'transfer',
      args: [account2.address, parseEther('1')],
    })
    await waitForTransactionReceipt(client, { hash: gasHash })

    const pauseHash = await actions.token.pause(client, {
      account: account2,
      token: address,
    })
    await waitForTransactionReceipt(client, { hash: pauseHash })

    // Verify token is paused
    const metadata = await actions.token.getMetadata(client, {
      token: address,
    })
    expect(metadata.paused).toBe(true)
  })

  test('behavior: cannot pause already paused token', async () => {
    // Create a new token
    const { address, hash: createHash } = await actions.token.create(client, {
      currency: 'USD',
      name: 'Double Pause Token',
      symbol: 'DPAUSE',
    })
    await waitForTransactionReceipt(client, { hash: createHash })

    // Grant pause role
    const grantHash = await actions.token.grantRoles(client, {
      token: address,
      roles: ['pause'],
      to: client.account.address,
    })
    await waitForTransactionReceipt(client, { hash: grantHash })

    // Pause the token
    const pauseHash = await actions.token.pause(client, {
      token: address,
    })
    await waitForTransactionReceipt(client, { hash: pauseHash })

    // Try to pause again - implementation may vary, but typically this succeeds without error
    const pauseHash2 = await actions.token.pause(client, {
      token: address,
    })
    const receipt = await waitForTransactionReceipt(client, {
      hash: pauseHash2,
    })
    expect(receipt.status).toBe('success')
  })
})

describe.skipIf(!!process.env.CI)('unpause', () => {
  test('default', async () => {
    // Create a new token
    const { address, hash: createHash } = await actions.token.create(client, {
      currency: 'USD',
      name: 'Unpausable Token',
      symbol: 'UNPAUSE',
    })
    await waitForTransactionReceipt(client, { hash: createHash })

    // Grant pause and unpause roles
    const grantPauseHash = await actions.token.grantRoles(client, {
      token: address,
      roles: ['pause'],
      to: client.account.address,
    })
    await waitForTransactionReceipt(client, { hash: grantPauseHash })

    const grantUnpauseHash = await actions.token.grantRoles(client, {
      token: address,
      roles: ['unpause'],
      to: client.account.address,
    })
    await waitForTransactionReceipt(client, { hash: grantUnpauseHash })

    // Grant issuer role and mint tokens
    const grantIssuerHash = await actions.token.grantRoles(client, {
      token: address,
      roles: ['issuer'],
      to: client.account.address,
    })
    await waitForTransactionReceipt(client, { hash: grantIssuerHash })

    const mintHash = await actions.token.mint(client, {
      token: address,
      to: account2.address,
      amount: parseEther('1000'),
    })
    await waitForTransactionReceipt(client, { hash: mintHash })

    // First pause the token
    const pauseHash = await actions.token.pause(client, {
      token: address,
    })
    await waitForTransactionReceipt(client, { hash: pauseHash })

    // Verify token is paused
    let metadata = await actions.token.getMetadata(client, {
      token: address,
    })
    expect(metadata.paused).toBe(true)

    // Transfer gas to account2
    const gasHash = await writeContract(client, {
      abi: tip20Abi,
      address: usdAddress,
      functionName: 'transfer',
      args: [account2.address, parseEther('1')],
    })
    await waitForTransactionReceipt(client, { hash: gasHash })

    // Verify transfers fail when paused
    expect(
      actions.token.transfer(client, {
        account: account2,
        token: address,
        to: account3.address,
        amount: parseEther('100'),
      }),
    ).rejects.toThrow()

    // Unpause the token
    const unpauseHash = await actions.token.unpause(client, {
      token: address,
    })
    await waitForTransactionReceipt(client, { hash: unpauseHash })

    // Verify token is unpaused
    metadata = await actions.token.getMetadata(client, {
      token: address,
    })
    expect(metadata.paused).toBe(false)

    // Transfers should work again
    const transferHash = await actions.token.transfer(client, {
      account: account2,
      token: address,
      to: account3.address,
      amount: parseEther('100'),
    })
    await waitForTransactionReceipt(client, { hash: transferHash })

    const balance = await actions.token.getBalance(client, {
      token: address,
      account: account3.address,
    })
    expect(balance).toBe(parseEther('100'))
  })

  test('behavior: requires unpause role', async () => {
    // Create a new token
    const { address, hash: createHash } = await actions.token.create(client, {
      currency: 'USD',
      name: 'Restricted Unpause Token',
      symbol: 'RUNPAUSE',
    })
    await waitForTransactionReceipt(client, { hash: createHash })

    // Grant pause role and pause the token
    const grantPauseHash = await actions.token.grantRoles(client, {
      token: address,
      roles: ['pause'],
      to: client.account.address,
    })
    await waitForTransactionReceipt(client, { hash: grantPauseHash })

    const pauseHash = await actions.token.pause(client, {
      token: address,
    })
    await waitForTransactionReceipt(client, { hash: pauseHash })

    // Try to unpause without unpause role - should fail
    expect(
      actions.token.unpause(client, {
        token: address,
      }),
    ).rejects.toThrow()

    // Grant unpause role to account2
    const grantUnpauseHash = await actions.token.grantRoles(client, {
      token: address,
      roles: ['unpause'],
      to: account2.address,
    })
    await waitForTransactionReceipt(client, { hash: grantUnpauseHash })

    // Transfer gas to account2
    const gasHash = await writeContract(client, {
      abi: tip20Abi,
      address: usdAddress,
      functionName: 'transfer',
      args: [account2.address, parseEther('1')],
    })
    await waitForTransactionReceipt(client, { hash: gasHash })

    // Now account2 should be able to unpause
    const unpauseHash = await actions.token.unpause(client, {
      account: account2,
      token: address,
    })
    await waitForTransactionReceipt(client, { hash: unpauseHash })

    // Verify token is unpaused
    const metadata = await actions.token.getMetadata(client, {
      token: address,
    })
    expect(metadata.paused).toBe(false)
  })

  test('behavior: different roles for pause and unpause', async () => {
    // Create a new token
    const { address, hash: createHash } = await actions.token.create(client, {
      currency: 'USD',
      name: 'Split Role Token',
      symbol: 'SPLIT',
    })
    await waitForTransactionReceipt(client, { hash: createHash })

    // Grant pause role to account2
    const grantPauseHash = await actions.token.grantRoles(client, {
      token: address,
      roles: ['pause'],
      to: account2.address,
    })
    await waitForTransactionReceipt(client, { hash: grantPauseHash })

    // Grant unpause role to account3
    const grantUnpauseHash = await actions.token.grantRoles(client, {
      token: address,
      roles: ['unpause'],
      to: account3.address,
    })
    await waitForTransactionReceipt(client, { hash: grantUnpauseHash })

    // Transfer gas to both accounts
    const gas2Hash = await writeContract(client, {
      abi: tip20Abi,
      address: usdAddress,
      functionName: 'transfer',
      args: [account2.address, parseEther('1')],
    })
    await waitForTransactionReceipt(client, { hash: gas2Hash })

    const gas3Hash = await writeContract(client, {
      abi: tip20Abi,
      address: usdAddress,
      functionName: 'transfer',
      args: [account3.address, parseEther('1')],
    })
    await waitForTransactionReceipt(client, { hash: gas3Hash })

    // Account2 can pause
    const pauseHash = await actions.token.pause(client, {
      account: account2,
      token: address,
    })
    await waitForTransactionReceipt(client, { hash: pauseHash })

    // Account2 cannot unpause
    expect(
      actions.token.unpause(client, {
        account: account2,
        token: address,
      }),
    ).rejects.toThrow()

    // Account3 can unpause
    const unpauseHash = await actions.token.unpause(client, {
      account: account3,
      token: address,
    })
    await waitForTransactionReceipt(client, { hash: unpauseHash })

    // Verify token is unpaused
    const metadata = await actions.token.getMetadata(client, {
      token: address,
    })
    expect(metadata.paused).toBe(false)
  })
})

describe.todo('setTokenSupplyCap')

describe.skipIf(!!process.env.CI)('grantRoles', () => {
  test('default', async () => {
    // Create a new token where we're the admin
    const { address, hash } = await actions.token.create(client, {
      admin: client.account,
      currency: 'USD',
      name: 'Test Token',
      symbol: 'TEST',
    })
    await waitForTransactionReceipt(client, { hash })

    // Grant issuer role to account2
    const grantHash = await actions.token.grantRoles(client, {
      token: address,
      roles: ['issuer'],
      to: account2.address,
    })
    const grantReceipt = await waitForTransactionReceipt(client, {
      hash: grantHash,
    })

    expect(grantReceipt.status).toBe('success')
  })
})

describe.skipIf(!!process.env.CI)('revokeTokenRole', async () => {
  test('default', async () => {
    const { address, hash } = await actions.token.create(client, {
      admin: client.account,
      currency: 'USD',
      name: 'Test Token 2',
      symbol: 'TEST2',
    })

    await waitForTransactionReceipt(client, { hash })

    const grantHash = await actions.token.grantRoles(client, {
      token: address,
      roles: ['issuer'],
      to: account2.address,
    })
    await waitForTransactionReceipt(client, {
      hash: grantHash,
    })

    const revokeHash = await actions.token.revokeRoles(client, {
      from: account2.address,
      token: address,
      roles: ['issuer'],
    })
    await waitForTransactionReceipt(client, { hash: revokeHash })

    const revokeReceipt = await client.getTransactionReceipt({
      hash: revokeHash,
    })
    expect(revokeReceipt.status).toBe('success')
  })
})

describe.skipIf(!!process.env.CI)('renounceTokenRole', async () => {
  test('default', async () => {
    const { address, hash } = await actions.token.create(client, {
      admin: client.account,
      currency: 'USD',
      name: 'Test Token 3',
      symbol: 'TEST3',
    })
    await waitForTransactionReceipt(client, { hash })

    const grantHash = await actions.token.grantRoles(client, {
      token: address,
      roles: ['issuer'],
      to: client.account.address,
    })
    await waitForTransactionReceipt(client, { hash: grantHash })

    const renounceHash = await actions.token.renounceRoles(client, {
      token: address,
      roles: ['issuer'],
    })
    await waitForTransactionReceipt(client, { hash: renounceHash })

    const renounceReceipt = await client.getTransactionReceipt({
      hash: renounceHash,
    })
    expect(renounceReceipt.status).toBe('success')
  })
})

describe.todo('setRoleAdmin')

describe.skipIf(!!process.env.CI)('watchCreate', () => {
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
      const { hash: hash1 } = await actions.token.create(client, {
        currency: 'USD',
        name: 'Watch Test Token 1',
        symbol: 'WATCH1',
      })
      await waitForTransactionReceipt(client, { hash: hash1 })

      const { hash: hash2 } = await actions.token.create(client, {
        currency: 'USD',
        name: 'Watch Test Token 2',
        symbol: 'WATCH2',
      })
      await waitForTransactionReceipt(client, { hash: hash2 })

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
    const { hash, id: firstId } = await actions.token.create(client, {
      currency: 'USD',
      name: 'Setup Token',
      symbol: 'SETUP',
    })
    await waitForTransactionReceipt(client, { hash })

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
      const { hash: hash1 } = await actions.token.create(client, {
        currency: 'USD',
        name: 'Filtered Watch Token 1',
        symbol: 'FWATCH1',
      })
      await waitForTransactionReceipt(client, { hash: hash1 })

      // Create second token (should be captured - ID will be firstId + 2 = targetTokenId)
      const { hash: hash2, id: id2 } = await actions.token.create(client, {
        currency: 'USD',
        name: 'Filtered Watch Token 2',
        symbol: 'FWATCH2',
      })
      await waitForTransactionReceipt(client, { hash: hash2 })

      // Create third token (should NOT be captured - ID will be firstId + 3)
      const { hash: hash3 } = await actions.token.create(client, {
        currency: 'USD',
        name: 'Filtered Watch Token 3',
        symbol: 'FWATCH3',
      })
      await waitForTransactionReceipt(client, { hash: hash3 })

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

describe.skipIf(!!process.env.CI)('watchMint', () => {
  test('default', async () => {
    // Create a new token for testing
    const { address, hash: createHash } = await actions.token.create(client, {
      currency: 'USD',
      name: 'Mint Watch Token',
      symbol: 'MINT',
    })
    await waitForTransactionReceipt(client, { hash: createHash })

    // Grant issuer role
    const grantHash = await actions.token.grantRoles(client, {
      token: address,
      roles: ['issuer'],
      to: client.account.address,
    })
    await waitForTransactionReceipt(client, { hash: grantHash })

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
      const hash1 = await actions.token.mint(client, {
        token: address,
        to: account2.address,
        amount: parseEther('100'),
      })
      await waitForTransactionReceipt(client, { hash: hash1 })

      // Mint second batch
      const hash2 = await actions.token.mint(client, {
        token: address,
        to: account3.address,
        amount: parseEther('50'),
      })
      await waitForTransactionReceipt(client, { hash: hash2 })

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
    const { address, hash: createHash } = await actions.token.create(client, {
      currency: 'USD',
      name: 'Filtered Mint Token',
      symbol: 'FMINT',
    })
    await waitForTransactionReceipt(client, { hash: createHash })

    // Grant issuer role
    const grantHash = await actions.token.grantRoles(client, {
      token: address,
      roles: ['issuer'],
      to: client.account.address,
    })
    await waitForTransactionReceipt(client, { hash: grantHash })

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
      const hash1 = await actions.token.mint(client, {
        token: address,
        to: account2.address,
        amount: parseEther('100'),
      })
      await waitForTransactionReceipt(client, { hash: hash1 })

      // Mint to account3 (should NOT be captured)
      const hash2 = await actions.token.mint(client, {
        token: address,
        to: account3.address,
        amount: parseEther('50'),
      })
      await waitForTransactionReceipt(client, { hash: hash2 })

      // Mint to account2 again (should be captured)
      const hash3 = await actions.token.mint(client, {
        token: address,
        to: account2.address,
        amount: parseEther('75'),
      })
      await waitForTransactionReceipt(client, { hash: hash3 })

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

describe.skipIf(!!process.env.CI)('watchApprove', () => {
  test('default', async () => {
    // Create a new token for testing
    const { address, hash: createHash } = await actions.token.create(client, {
      currency: 'USD',
      name: 'Approval Watch Token',
      symbol: 'APPR',
    })
    await waitForTransactionReceipt(client, { hash: createHash })

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
      const hash1 = await actions.token.approve(client, {
        token: address,
        spender: account2.address,
        amount: parseEther('100'),
      })
      await waitForTransactionReceipt(client, { hash: hash1 })

      // Approve account3
      const hash2 = await actions.token.approve(client, {
        token: address,
        spender: account3.address,
        amount: parseEther('50'),
      })
      await waitForTransactionReceipt(client, { hash: hash2 })

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
    const { address, hash: createHash } = await actions.token.create(client, {
      currency: 'USD',
      name: 'Filtered Approval Token',
      symbol: 'FAPPR',
    })
    await waitForTransactionReceipt(client, { hash: createHash })

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
      const hash1 = await actions.token.approve(client, {
        token: address,
        spender: account2.address,
        amount: parseEther('100'),
      })
      await waitForTransactionReceipt(client, { hash: hash1 })

      // Approve account3 (should NOT be captured)
      const hash2 = await actions.token.approve(client, {
        token: address,
        spender: account3.address,
        amount: parseEther('50'),
      })
      await waitForTransactionReceipt(client, { hash: hash2 })

      // Approve account2 again (should be captured)
      const hash3 = await actions.token.approve(client, {
        token: address,
        spender: account2.address,
        amount: parseEther('75'),
      })
      await waitForTransactionReceipt(client, { hash: hash3 })

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

describe.skipIf(!!process.env.CI)('watchBurn', () => {
  test('default', async () => {
    // Create a new token for testing
    const { address, hash: createHash } = await actions.token.create(client, {
      currency: 'USD',
      name: 'Burn Watch Token',
      symbol: 'BURN',
    })
    await waitForTransactionReceipt(client, { hash: createHash })

    {
      // Grant issuer role to mint/burn tokens
      const grantHash = await actions.token.grantRoles(client, {
        token: address,
        roles: ['issuer'],
        to: client.account.address,
      })
      await waitForTransactionReceipt(client, { hash: grantHash })
    }
    {
      // Grant issuer role to mint/burn tokens
      const grantHash = await actions.token.grantRoles(client, {
        token: address,
        roles: ['issuer'],
        to: account2.address,
      })
      await waitForTransactionReceipt(client, { hash: grantHash })
    }

    // Mint tokens to burn later
    const mintHash1 = await actions.token.mint(client, {
      token: address,
      to: client.account.address,
      amount: parseEther('200'),
    })
    await waitForTransactionReceipt(client, { hash: mintHash1 })

    const mintHash2 = await actions.token.mint(client, {
      token: address,
      to: account2.address,
      amount: parseEther('100'),
    })
    await waitForTransactionReceipt(client, { hash: mintHash2 })

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
      const hash1 = await actions.token.burn(client, {
        token: address,
        amount: parseEther('50'),
      })
      await waitForTransactionReceipt(client, { hash: hash1 })

      // Transfer gas to account2
      const gasHash = await writeContract(client, {
        abi: tip20Abi,
        address: usdAddress,
        functionName: 'transfer',
        args: [account2.address, parseEther('1')],
      })
      await waitForTransactionReceipt(client, { hash: gasHash })

      // Burn second batch from account2
      const hash2 = await actions.token.burn(client, {
        account: account2,
        token: address,
        amount: parseEther('25'),
      })
      await waitForTransactionReceipt(client, { hash: hash2 })

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
    const { address, hash: createHash } = await actions.token.create(client, {
      currency: 'USD',
      name: 'Filtered Burn Token',
      symbol: 'FBURN',
    })
    await waitForTransactionReceipt(client, { hash: createHash })

    {
      // Grant issuer role
      const hash = await actions.token.grantRoles(client, {
        token: address,
        roles: ['issuer'],
        to: client.account.address,
      })
      await waitForTransactionReceipt(client, { hash })
    }
    {
      // Grant issuer role
      const hash = await actions.token.grantRoles(client, {
        token: address,
        roles: ['issuer'],
        to: account2.address,
      })
      await waitForTransactionReceipt(client, { hash })
    }

    {
      // Mint tokens to multiple accounts
      const hash = await actions.token.mint(client, {
        token: address,
        to: client.account.address,
        amount: parseEther('200'),
      })
      await waitForTransactionReceipt(client, { hash })
    }

    {
      const hash = await actions.token.mint(client, {
        token: address,
        to: account2.address,
        amount: parseEther('200'),
      })
      await waitForTransactionReceipt(client, { hash })
    }

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
      const hash1 = await actions.token.burn(client, {
        token: address,
        amount: parseEther('50'),
      })
      await waitForTransactionReceipt(client, { hash: hash1 })

      // Transfer gas to account2
      const gasHash = await writeContract(client, {
        abi: tip20Abi,
        address: usdAddress,
        functionName: 'transfer',
        args: [account2.address, parseEther('1')],
      })
      await waitForTransactionReceipt(client, { hash: gasHash })

      // Burn from account2 (should NOT be captured)
      const hash2 = await actions.token.burn(client, {
        account: account2,
        token: address,
        amount: parseEther('25'),
      })
      await waitForTransactionReceipt(client, { hash: hash2 })

      // Burn from client.account again (should be captured)
      const hash3 = await actions.token.burn(client, {
        token: address,
        amount: parseEther('75'),
      })
      await waitForTransactionReceipt(client, { hash: hash3 })

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

describe.skipIf(!!process.env.CI)('watchAdminRole', () => {
  test('default', async () => {
    // Create a new token for testing
    const { address, hash: createHash } = await actions.token.create(client, {
      currency: 'USD',
      name: 'Admin Role Watch Token',
      symbol: 'ADMIN',
    })
    await waitForTransactionReceipt(client, { hash: createHash })

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
      const hash1 = await actions.token.setRoleAdmin(client, {
        token: address,
        role: 'issuer',
        adminRole: 'pause',
      })
      await waitForTransactionReceipt(client, { hash: hash1 })

      // Set role admin for pause role
      const hash2 = await actions.token.setRoleAdmin(client, {
        token: address,
        role: 'pause',
        adminRole: 'unpause',
      })
      await waitForTransactionReceipt(client, { hash: hash2 })

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

describe.skipIf(!!process.env.CI)('watchRole', () => {
  test('default', async () => {
    // Create a new token for testing
    const { address, hash: createHash } = await actions.token.create(client, {
      currency: 'USD',
      name: 'Role Watch Token',
      symbol: 'ROLE',
    })
    await waitForTransactionReceipt(client, { hash: createHash })

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
      const hash1 = await actions.token.grantRoles(client, {
        token: address,
        roles: ['issuer'],
        to: account2.address,
      })
      await waitForTransactionReceipt(client, { hash: hash1 })

      // Grant pause role to account3
      const hash2 = await actions.token.grantRoles(client, {
        token: address,
        roles: ['pause'],
        to: account3.address,
      })
      await waitForTransactionReceipt(client, { hash: hash2 })

      // Revoke issuer role from account2
      const hash3 = await actions.token.revokeRoles(client, {
        token: address,
        roles: ['issuer'],
        from: account2.address,
      })
      await waitForTransactionReceipt(client, { hash: hash3 })

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
    const { address, hash: createHash } = await actions.token.create(client, {
      currency: 'USD',
      name: 'Filtered Role Token',
      symbol: 'FROLE',
    })
    await waitForTransactionReceipt(client, { hash: createHash })

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
      const hash1 = await actions.token.grantRoles(client, {
        token: address,
        roles: ['issuer'],
        to: account2.address,
      })
      await waitForTransactionReceipt(client, { hash: hash1 })

      // Grant pause role to account3 (should NOT be captured)
      const hash2 = await actions.token.grantRoles(client, {
        token: address,
        roles: ['pause'],
        to: account3.address,
      })
      await waitForTransactionReceipt(client, { hash: hash2 })

      // Revoke issuer role from account2 (should be captured)
      const hash3 = await actions.token.revokeRoles(client, {
        token: address,
        roles: ['issuer'],
        from: account2.address,
      })
      await waitForTransactionReceipt(client, { hash: hash3 })

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

describe.skipIf(!!process.env.CI)('watchTransfer', () => {
  test('default', async () => {
    // Create a new token for testing
    const { address, hash: createHash } = await actions.token.create(client, {
      currency: 'USD',
      name: 'Transfer Watch Token',
      symbol: 'XFER',
    })
    await waitForTransactionReceipt(client, { hash: createHash })

    {
      // Grant issuer role to mint tokens
      const hash = await actions.token.grantRoles(client, {
        token: address,
        roles: ['issuer'],
        to: client.account.address,
      })
      await waitForTransactionReceipt(client, { hash })
    }

    {
      // Mint tokens to transfer
      const hash = await actions.token.mint(client, {
        token: address,
        to: client.account.address,
        amount: parseEther('500'),
      })
      await waitForTransactionReceipt(client, { hash })
    }

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
      const hash1 = await actions.token.transfer(client, {
        token: address,
        to: account2.address,
        amount: parseEther('100'),
      })
      await waitForTransactionReceipt(client, { hash: hash1 })

      // Transfer to account3
      const hash2 = await actions.token.transfer(client, {
        token: address,
        to: account3.address,
        amount: parseEther('50'),
      })
      await waitForTransactionReceipt(client, { hash: hash2 })

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
    const { address, hash: createHash } = await actions.token.create(client, {
      currency: 'USD',
      name: 'Filtered Transfer Token',
      symbol: 'FXFER',
    })
    await waitForTransactionReceipt(client, { hash: createHash })

    {
      // Grant issuer role
      const hash = await actions.token.grantRoles(client, {
        token: address,
        roles: ['issuer'],
        to: client.account.address,
      })
      await waitForTransactionReceipt(client, { hash })
    }

    {
      // Mint tokens
      const hash = await actions.token.mint(client, {
        token: address,
        to: client.account.address,
        amount: parseEther('500'),
      })
      await waitForTransactionReceipt(client, { hash })
    }

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
      const hash1 = await actions.token.transfer(client, {
        token: address,
        to: account2.address,
        amount: parseEther('100'),
      })
      await waitForTransactionReceipt(client, { hash: hash1 })

      // Transfer to account3 (should NOT be captured)
      const hash2 = await actions.token.transfer(client, {
        token: address,
        to: account3.address,
        amount: parseEther('50'),
      })
      await waitForTransactionReceipt(client, { hash: hash2 })

      // Transfer to account2 again (should be captured)
      const hash3 = await actions.token.transfer(client, {
        token: address,
        to: account2.address,
        amount: parseEther('75'),
      })
      await waitForTransactionReceipt(client, { hash: hash3 })

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
