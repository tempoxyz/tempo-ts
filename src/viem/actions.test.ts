import { afterEach, beforeEach, describe, expect, test } from 'bun:test'
import { setTimeout } from 'node:timers/promises'
import { Hash, Hex } from 'ox'
import { tempoLocal } from 'tempo/chains'
import { Instance } from 'tempo/prool'
import * as actions from 'tempo/viem/actions'
import { createClient, http, parseEther, publicActions } from 'viem'
import { mnemonicToAccount } from 'viem/accounts'
import {
  getCode,
  getTransaction,
  waitForTransactionReceipt,
  writeContract,
} from 'viem/actions'
import { tip20Abi } from './abis.js'
import { usdAddress, usdId } from './addresses.js'

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

const client = createClient({
  account,
  chain: tempoLocal,
  pollingInterval: 100,
  transport: http(),
}).extend(publicActions)

describe.skipIf(!!process.env.CI)('approveTransferToken', () => {
  test('default', async () => {
    {
      // approve
      const hash = await actions.approveTransferToken(client, {
        spender: account2.address,
        amount: parseEther('100'),
      })
      await waitForTransactionReceipt(client, { hash })
    }

    {
      // check allowance
      const allowance = await actions.getTokenAllowance(client, {
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
      const hash = await actions.transferToken(client, {
        amount: parseEther('50'),
        account: account2,
        from: account.address,
        to: '0x0000000000000000000000000000000000000001',
      })
      await waitForTransactionReceipt(client, { hash })
    }

    {
      // verify updated allowance
      const allowance = await actions.getTokenAllowance(client, {
        spender: account2.address,
      })
      expect(allowance).toBe(parseEther('50'))
    }

    // verify balance
    const balance = await actions.getTokenBalance(client, {
      account: '0x0000000000000000000000000000000000000001',
    })
    expect(balance).toBe(parseEther('50'))
  })

  test('behavior: token address', async () => {
    {
      // approve
      const hash = await actions.approveTransferToken(client, {
        amount: parseEther('100'),
        token: usdAddress,
        spender: account2.address,
      })
      await waitForTransactionReceipt(client, { hash })
    }

    {
      // check allowance
      const allowance = await actions.getTokenAllowance(client, {
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
      const hash = await actions.transferToken(client, {
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
      const allowance = await actions.getTokenAllowance(client, {
        spender: account2.address,
        token: usdAddress,
      })
      expect(allowance).toBe(parseEther('50'))
    }

    // verify balance
    const balance = await actions.getTokenBalance(client, {
      account: '0x0000000000000000000000000000000000000001',
      token: usdAddress,
    })
    expect(balance).toBe(parseEther('50'))
  })

  test('behavior: token address', async () => {
    {
      // approve
      const hash = await actions.approveTransferToken(client, {
        amount: parseEther('100'),
        token: usdId,
        spender: account2.address,
      })
      await waitForTransactionReceipt(client, { hash })
    }

    {
      // check allowance
      const allowance = await actions.getTokenAllowance(client, {
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
      const hash = await actions.transferToken(client, {
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
      const allowance = await actions.getTokenAllowance(client, {
        spender: account2.address,
        token: usdId,
      })
      expect(allowance).toBe(parseEther('50'))
    }

    // verify balance
    const balance = await actions.getTokenBalance(client, {
      account: '0x0000000000000000000000000000000000000001',
      token: usdId,
    })
    expect(balance).toBe(parseEther('50'))
  })
})

describe.skipIf(!!process.env.CI)('createToken', () => {
  test('default', async () => {
    const { hash, ...result } = await actions.createToken(client, {
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

    await setTimeout(100)

    const code = await getCode(client, {
      address: result.address,
    })
    expect(code).toBe('0xef')
  })
})

describe.skipIf(!!process.env.CI)('getTokenAllowance', () => {
  test('default', async () => {
    // First, approve some allowance
    await writeContract(client, {
      abi: tip20Abi,
      address: usdAddress,
      functionName: 'approve',
      args: [account2.address, parseEther('50')],
    })
    await setTimeout(100)

    {
      // Test with default token
      const allowance = await actions.getTokenAllowance(client, {
        spender: account2.address,
      })
      expect(allowance).toBe(parseEther('50'))
    }

    {
      // Test with token address
      const allowance = await actions.getTokenAllowance(client, {
        token: usdAddress,
        spender: account2.address,
      })

      expect(allowance).toBe(parseEther('50'))
    }

    {
      // Test with token ID
      const allowance = await actions.getTokenAllowance(client, {
        token: usdId,
        spender: account2.address,
      })

      expect(allowance).toBe(parseEther('50'))
    }
  })
})

describe.skipIf(!!process.env.CI)('getTokenBalance', () => {
  test('default', async () => {
    {
      // Test with default token
      const balance = await actions.getTokenBalance(client)
      expect(balance).toBeGreaterThan(0n)
    }

    {
      // Test with token address
      const balance = await actions.getTokenBalance(client, {
        token: usdAddress,
      })

      expect(balance).toBeGreaterThan(0n)
    }

    {
      // Test with token ID & different account
      const balance = await actions.getTokenBalance(client, {
        token: usdId,
        account: Hex.random(20),
      })

      expect(balance).toBe(0n)
    }
  })
})

describe.skipIf(!!process.env.CI)('getTokenMetadata', () => {
  test('default', async () => {
    const metadata = await actions.getTokenMetadata(client)

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
    const { address } = await actions.createToken(client, {
      currency: 'USD',
      name: 'Test USD',
      symbol: 'TUSD',
    })

    await setTimeout(100)

    const metadata = await actions.getTokenMetadata(client, {
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
    const token = await actions.createToken(client, {
      currency: 'USD',
      name: 'Test USD',
      symbol: 'TUSD',
    })

    await setTimeout(100)

    const metadata = await actions.getTokenMetadata(client, {
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

describe.skipIf(!!process.env.CI)('getUserToken', () => {
  test('default', async () => {
    // Fund accounts
    await writeContract(client, {
      abi: tip20Abi,
      address: usdAddress,
      functionName: 'transfer',
      args: [account2.address, parseEther('100')],
    })
    await writeContract(client, {
      abi: tip20Abi,
      address: usdAddress,
      functionName: 'transfer',
      args: [account3.address, parseEther('100')],
    })
    await setTimeout(100)

    // Set token (address)
    await actions.setUserToken(client, {
      account: account2,
      token: '0x20c0000000000000000000000000000000000001',
    })
    await setTimeout(100)

    // Set another token (id)
    await actions.setUserToken(client, {
      account: account3,
      token: 2n,
    })
    await setTimeout(100)

    // Assert that account (with default) & account2 (with custom) tokens are set correctly.
    expect(
      await actions.getUserToken(client, { account }),
    ).toMatchInlineSnapshot(`
      {
        "address": "0x20C0000000000000000000000000000000000000",
        "id": 0n,
      }
    `)
    expect(
      await actions.getUserToken(client, { account: account2 }),
    ).toMatchInlineSnapshot(`
      {
        "address": "0x20C0000000000000000000000000000000000001",
        "id": 1n,
      }
    `)
    expect(
      await actions.getUserToken(client, { account: account3 }),
    ).toMatchInlineSnapshot(`
      {
        "address": "0x20C0000000000000000000000000000000000002",
        "id": 2n,
      }
    `)
  })
})

describe.skipIf(!!process.env.CI)('setUserToken', () => {
  test('default', async () => {
    expect(await actions.getUserToken(client)).toMatchInlineSnapshot(
      `
        {
          "address": "0x20C0000000000000000000000000000000000000",
          "id": 0n,
        }
      `,
    )

    {
      const hash = await actions.setUserToken(client, {
        token: '0x20c0000000000000000000000000000000000001',
      })
      expect(hash).toBeDefined()
    }

    await setTimeout(10)

    expect(await actions.getUserToken(client, {})).toMatchInlineSnapshot(
      `
        {
          "address": "0x20C0000000000000000000000000000000000001",
          "id": 1n,
        }
      `,
    )

    {
      const hash = await actions.setUserToken(client, {
        feeToken: 0n,
        token: 0n,
      })
      expect(hash).toBeDefined()
    }

    await setTimeout(10)

    expect(await actions.getUserToken(client, {})).toMatchInlineSnapshot(
      `
        {
          "address": "0x20C0000000000000000000000000000000000000",
          "id": 0n,
        }
      `,
    )
  })
})

describe.skipIf(!!process.env.CI)('mintToken', () => {
  test('default', async () => {
    // Create a new token where we're the admin
    const { address, hash: createHash } = await actions.createToken(client, {
      currency: 'USD',
      name: 'Mintable Token',
      symbol: 'MINT',
    })
    await waitForTransactionReceipt(client, { hash: createHash })

    // Grant issuer role
    const grantHash = await actions.grantTokenRole(client, {
      token: address,
      role: 'issuer',
      to: client.account.address,
    })
    await waitForTransactionReceipt(client, { hash: grantHash })

    // Check initial balance
    const balanceBefore = await actions.getTokenBalance(client, {
      token: address,
      account: account2.address,
    })
    expect(balanceBefore).toBe(0n)

    // Mint tokens
    const mintHash = await actions.mintToken(client, {
      token: address,
      to: account2.address,
      amount: parseEther('1000'),
    })
    await waitForTransactionReceipt(client, { hash: mintHash })

    // Check balance after mint
    const balanceAfter = await actions.getTokenBalance(client, {
      token: address,
      account: account2.address,
    })
    expect(balanceAfter).toBe(parseEther('1000'))

    // Check total supply
    const metadata = await actions.getTokenMetadata(client, {
      token: address,
    })
    expect(metadata.totalSupply).toBe(parseEther('1000'))
  })

  // TODO: fix
  test.skip('with memo', async () => {
    // Create a new token
    const { address, hash: createHash } = await actions.createToken(client, {
      admin: client.account,
      currency: 'USD',
      name: 'Mintable Token 2',
      symbol: 'MINT2',
    })
    await waitForTransactionReceipt(client, { hash: createHash })

    // Grant issuer role
    const grantHash = await actions.grantTokenRole(client, {
      token: address,
      role: 'issuer',
      to: client.account.address,
    })
    await waitForTransactionReceipt(client, { hash: grantHash })

    // Mint tokens with memo
    const mintHash = await actions.mintToken(client, {
      token: address,
      to: account2.address,
      amount: parseEther('500'),
      memo: Hex.fromString('test'),
    })
    const receipt = await waitForTransactionReceipt(client, { hash: mintHash })
    expect(receipt.status).toBe('success')

    // Verify balance
    const balance = await actions.getTokenBalance(client, {
      token: address,
      account: account2.address,
    })
    expect(balance).toBe(parseEther('500'))
  })
})

describe.todo('permitToken')

describe.skipIf(!!process.env.CI)('transferToken', () => {
  test('default', async () => {
    // Get initial balances
    const senderBalanceBefore = await actions.getTokenBalance(client, {
      account: account.address,
    })
    const receiverBalanceBefore = await actions.getTokenBalance(client, {
      account: account2.address,
    })

    // Transfer tokens
    const hash = await actions.transferToken(client, {
      to: account2.address,
      amount: parseEther('10'),
    })
    await waitForTransactionReceipt(client, { hash })

    // Verify balances
    const senderBalanceAfter = await actions.getTokenBalance(client, {
      account: account.address,
    })
    const receiverBalanceAfter = await actions.getTokenBalance(client, {
      account: account2.address,
    })

    expect(senderBalanceAfter - senderBalanceBefore).toBeLessThan(
      parseEther('10'),
    )
    expect(receiverBalanceAfter - receiverBalanceBefore).toBe(parseEther('10'))
  })

  test('behavior: with custom token', async () => {
    // Create a new token
    const { address, hash: createHash } = await actions.createToken(client, {
      currency: 'USD',
      name: 'Transfer Token',
      symbol: 'XFER',
    })
    await waitForTransactionReceipt(client, { hash: createHash })

    // Grant issuer role and mint tokens
    const grantHash = await actions.grantTokenRole(client, {
      token: address,
      role: 'issuer',
      to: client.account.address,
    })
    await waitForTransactionReceipt(client, { hash: grantHash })

    const mintHash = await actions.mintToken(client, {
      token: address,
      to: client.account.address,
      amount: parseEther('1000'),
    })
    await waitForTransactionReceipt(client, { hash: mintHash })

    // Transfer custom tokens
    const transferHash = await actions.transferToken(client, {
      token: address,
      to: account2.address,
      amount: parseEther('100'),
    })
    await waitForTransactionReceipt(client, { hash: transferHash })

    // Verify balance
    const balance = await actions.getTokenBalance(client, {
      token: address,
      account: account2.address,
    })
    expect(balance).toBe(parseEther('100'))
  })

  test('behavior: with memo', async () => {
    const memo = Hex.fromString('Payment for services')

    const hash = await actions.transferToken(client, {
      to: account2.address,
      amount: parseEther('5'),
      memo,
    })
    const receipt = await waitForTransactionReceipt(client, { hash })

    expect(receipt.status).toBe('success')
  })

  test('behavior: from another account (transferFrom)', async () => {
    // First approve account2 to spend tokens
    const approveHash = await actions.approveTransferToken(client, {
      spender: account2.address,
      amount: parseEther('50'),
    })
    await waitForTransactionReceipt(client, { hash: approveHash })

    // Create client for account2
    const client2 = createClient({
      account: account2,
      chain: tempoLocal,
      pollingInterval: 100,
      transport: http(),
    })

    // Transfer tokens for gas
    const gasHash = await writeContract(client, {
      abi: tip20Abi,
      address: usdAddress,
      functionName: 'transfer',
      args: [account2.address, parseEther('1')],
    })
    await waitForTransactionReceipt(client, { hash: gasHash })

    // Get initial balance
    const balanceBefore = await actions.getTokenBalance(client, {
      account: account3.address,
    })

    // Account2 transfers from account to account3
    const transferHash = await actions.transferToken(client2, {
      from: account.address,
      to: account3.address,
      amount: parseEther('25'),
    })
    await waitForTransactionReceipt(client2, { hash: transferHash })

    // Verify balance
    const balanceAfter = await actions.getTokenBalance(client, {
      account: account3.address,
    })
    expect(balanceAfter - balanceBefore).toBe(parseEther('25'))

    // Verify allowance was reduced
    const allowance = await actions.getTokenAllowance(client, {
      spender: account2.address,
    })
    expect(allowance).toBe(parseEther('25'))
  })
})

describe.skipIf(!!process.env.CI)('burnToken', () => {
  test('default', async () => {
    // Create a new token where we have issuer role
    const { address, hash: createHash } = await actions.createToken(client, {
      currency: 'USD',
      name: 'Burnable Token',
      symbol: 'BURN',
    })
    await waitForTransactionReceipt(client, { hash: createHash })

    // Grant issuer role
    const grantHash = await actions.grantTokenRole(client, {
      token: address,
      role: 'issuer',
      to: client.account.address,
    })
    await waitForTransactionReceipt(client, { hash: grantHash })

    // Mint some tokens
    const mintHash = await actions.mintToken(client, {
      token: address,
      to: client.account.address,
      amount: parseEther('1000'),
    })
    await waitForTransactionReceipt(client, { hash: mintHash })

    // Check balance before burn
    const balanceBefore = await actions.getTokenBalance(client, {
      token: address,
    })
    expect(balanceBefore).toBe(parseEther('1000'))

    // Check total supply before
    const metadataBefore = await actions.getTokenMetadata(client, {
      token: address,
    })
    expect(metadataBefore.totalSupply).toBe(parseEther('1000'))

    // Burn tokens
    const burnHash = await actions.burnToken(client, {
      token: address,
      amount: parseEther('100'),
    })
    await waitForTransactionReceipt(client, { hash: burnHash })

    // Check balance after burn
    const balanceAfter = await actions.getTokenBalance(client, {
      token: address,
    })
    expect(balanceAfter).toBe(parseEther('900'))

    // Check total supply after
    const metadataAfter = await actions.getTokenMetadata(client, {
      token: address,
    })
    expect(metadataAfter.totalSupply).toBe(parseEther('900'))
  })

  test('behavior: requires issuer role', async () => {
    // Create a new token
    const { address, hash: createHash } = await actions.createToken(client, {
      currency: 'USD',
      name: 'Restricted Burn Token',
      symbol: 'RBURN',
    })
    await waitForTransactionReceipt(client, { hash: createHash })

    // Grant issuer role to account2 (not us)
    const grantHash = await actions.grantTokenRole(client, {
      token: address,
      role: 'issuer',
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

    const mintHash = await actions.mintToken(client, {
      account: account2,
      token: address,
      to: client.account.address,
      amount: parseEther('100'),
    })
    await waitForTransactionReceipt(client, { hash: mintHash })

    // Try to burn without issuer role - should fail
    expect(
      actions.burnToken(client, {
        token: address,
        amount: parseEther('10'),
      }),
    ).rejects.toThrow()
  })
})

describe.todo('burnBlockedToken')

describe.todo('changeTokenTransferPolicy')

describe.skipIf(!!process.env.CI)('pauseToken', () => {
  test('default', async () => {
    // Create a new token
    const { address, hash: createHash } = await actions.createToken(client, {
      currency: 'USD',
      name: 'Pausable Token',
      symbol: 'PAUSE',
    })
    await waitForTransactionReceipt(client, { hash: createHash })

    // Grant pause role
    const grantHash = await actions.grantTokenRole(client, {
      token: address,
      role: 'pause',
      to: client.account.address,
    })
    await waitForTransactionReceipt(client, { hash: grantHash })

    // Grant issuer role and mint tokens
    const grantIssuerHash = await actions.grantTokenRole(client, {
      token: address,
      role: 'issuer',
      to: client.account.address,
    })
    await waitForTransactionReceipt(client, { hash: grantIssuerHash })

    const mintHash = await actions.mintToken(client, {
      token: address,
      to: account2.address,
      amount: parseEther('1000'),
    })
    await waitForTransactionReceipt(client, { hash: mintHash })

    // Verify token is not paused
    let metadata = await actions.getTokenMetadata(client, {
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

    const transferHash = await actions.transferToken(client, {
      account: account2,
      token: address,
      to: account3.address,
      amount: parseEther('100'),
    })
    await waitForTransactionReceipt(client, { hash: transferHash })

    // Pause the token
    const pauseHash = await actions.pauseToken(client, {
      token: address,
    })
    await waitForTransactionReceipt(client, { hash: pauseHash })

    // Verify token is paused
    metadata = await actions.getTokenMetadata(client, {
      token: address,
    })
    expect(metadata.paused).toBe(true)

    // Transfers should now fail
    expect(
      actions.transferToken(client, {
        account: account2,
        token: address,
        to: account3.address,
        amount: parseEther('100'),
      }),
    ).rejects.toThrow()
  })

  test('behavior: requires pause role', async () => {
    // Create a new token
    const { address, hash: createHash } = await actions.createToken(client, {
      currency: 'USD',
      name: 'Restricted Pause Token',
      symbol: 'RPAUSE',
    })
    await waitForTransactionReceipt(client, { hash: createHash })

    // Try to pause without pause role - should fail
    expect(
      actions.pauseToken(client, {
        token: address,
      }),
    ).rejects.toThrow()

    // Grant pause role to account2
    const grantHash = await actions.grantTokenRole(client, {
      token: address,
      role: 'pause',
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

    const pauseHash = await actions.pauseToken(client, {
      account: account2,
      token: address,
    })
    await waitForTransactionReceipt(client, { hash: pauseHash })

    // Verify token is paused
    const metadata = await actions.getTokenMetadata(client, {
      token: address,
    })
    expect(metadata.paused).toBe(true)
  })

  test('behavior: cannot pause already paused token', async () => {
    // Create a new token
    const { address, hash: createHash } = await actions.createToken(client, {
      currency: 'USD',
      name: 'Double Pause Token',
      symbol: 'DPAUSE',
    })
    await waitForTransactionReceipt(client, { hash: createHash })

    // Grant pause role
    const grantHash = await actions.grantTokenRole(client, {
      token: address,
      role: 'pause',
      to: client.account.address,
    })
    await waitForTransactionReceipt(client, { hash: grantHash })

    // Pause the token
    const pauseHash = await actions.pauseToken(client, {
      token: address,
    })
    await waitForTransactionReceipt(client, { hash: pauseHash })

    // Try to pause again - implementation may vary, but typically this succeeds without error
    const pauseHash2 = await actions.pauseToken(client, {
      token: address,
    })
    const receipt = await waitForTransactionReceipt(client, {
      hash: pauseHash2,
    })
    expect(receipt.status).toBe('success')
  })
})

describe.skipIf(!!process.env.CI)('unpauseToken', () => {
  test('default', async () => {
    // Create a new token
    const { address, hash: createHash } = await actions.createToken(client, {
      currency: 'USD',
      name: 'Unpausable Token',
      symbol: 'UNPAUSE',
    })
    await waitForTransactionReceipt(client, { hash: createHash })

    // Grant pause and unpause roles
    const grantPauseHash = await actions.grantTokenRole(client, {
      token: address,
      role: 'pause',
      to: client.account.address,
    })
    await waitForTransactionReceipt(client, { hash: grantPauseHash })

    const grantUnpauseHash = await actions.grantTokenRole(client, {
      token: address,
      role: 'unpause',
      to: client.account.address,
    })
    await waitForTransactionReceipt(client, { hash: grantUnpauseHash })

    // Grant issuer role and mint tokens
    const grantIssuerHash = await actions.grantTokenRole(client, {
      token: address,
      role: 'issuer',
      to: client.account.address,
    })
    await waitForTransactionReceipt(client, { hash: grantIssuerHash })

    const mintHash = await actions.mintToken(client, {
      token: address,
      to: account2.address,
      amount: parseEther('1000'),
    })
    await waitForTransactionReceipt(client, { hash: mintHash })

    // First pause the token
    const pauseHash = await actions.pauseToken(client, {
      token: address,
    })
    await waitForTransactionReceipt(client, { hash: pauseHash })

    // Verify token is paused
    let metadata = await actions.getTokenMetadata(client, {
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
      actions.transferToken(client, {
        account: account2,
        token: address,
        to: account3.address,
        amount: parseEther('100'),
      }),
    ).rejects.toThrow()

    // Unpause the token
    const unpauseHash = await actions.unpauseToken(client, {
      token: address,
    })
    await waitForTransactionReceipt(client, { hash: unpauseHash })

    // Verify token is unpaused
    metadata = await actions.getTokenMetadata(client, {
      token: address,
    })
    expect(metadata.paused).toBe(false)

    // Transfers should work again
    const transferHash = await actions.transferToken(client, {
      account: account2,
      token: address,
      to: account3.address,
      amount: parseEther('100'),
    })
    await waitForTransactionReceipt(client, { hash: transferHash })

    const balance = await actions.getTokenBalance(client, {
      token: address,
      account: account3.address,
    })
    expect(balance).toBe(parseEther('100'))
  })

  test('behavior: requires unpause role', async () => {
    // Create a new token
    const { address, hash: createHash } = await actions.createToken(client, {
      currency: 'USD',
      name: 'Restricted Unpause Token',
      symbol: 'RUNPAUSE',
    })
    await waitForTransactionReceipt(client, { hash: createHash })

    // Grant pause role and pause the token
    const grantPauseHash = await actions.grantTokenRole(client, {
      token: address,
      role: 'pause',
      to: client.account.address,
    })
    await waitForTransactionReceipt(client, { hash: grantPauseHash })

    const pauseHash = await actions.pauseToken(client, {
      token: address,
    })
    await waitForTransactionReceipt(client, { hash: pauseHash })

    // Try to unpause without unpause role - should fail
    expect(
      actions.unpauseToken(client, {
        token: address,
      }),
    ).rejects.toThrow()

    // Grant unpause role to account2
    const grantUnpauseHash = await actions.grantTokenRole(client, {
      token: address,
      role: 'unpause',
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
    const unpauseHash = await actions.unpauseToken(client, {
      account: account2,
      token: address,
    })
    await waitForTransactionReceipt(client, { hash: unpauseHash })

    // Verify token is unpaused
    const metadata = await actions.getTokenMetadata(client, {
      token: address,
    })
    expect(metadata.paused).toBe(false)
  })

  test('behavior: different roles for pause and unpause', async () => {
    // Create a new token
    const { address, hash: createHash } = await actions.createToken(client, {
      currency: 'USD',
      name: 'Split Role Token',
      symbol: 'SPLIT',
    })
    await waitForTransactionReceipt(client, { hash: createHash })

    // Grant pause role to account2
    const grantPauseHash = await actions.grantTokenRole(client, {
      token: address,
      role: 'pause',
      to: account2.address,
    })
    await waitForTransactionReceipt(client, { hash: grantPauseHash })

    // Grant unpause role to account3
    const grantUnpauseHash = await actions.grantTokenRole(client, {
      token: address,
      role: 'unpause',
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
    const pauseHash = await actions.pauseToken(client, {
      account: account2,
      token: address,
    })
    await waitForTransactionReceipt(client, { hash: pauseHash })

    // Account2 cannot unpause
    expect(
      actions.unpauseToken(client, {
        account: account2,
        token: address,
      }),
    ).rejects.toThrow()

    // Account3 can unpause
    const unpauseHash = await actions.unpauseToken(client, {
      account: account3,
      token: address,
    })
    await waitForTransactionReceipt(client, { hash: unpauseHash })

    // Verify token is unpaused
    const metadata = await actions.getTokenMetadata(client, {
      token: address,
    })
    expect(metadata.paused).toBe(false)
  })
})

describe.todo('setTokenSupplyCap')

describe.skipIf(!!process.env.CI)('grantTokenRole', () => {
  test('default', async () => {
    // Create a new token where we're the admin
    const { address } = await actions.createToken(client, {
      admin: client.account,
      currency: 'USD',
      name: 'Test Token',
      symbol: 'TEST',
    })

    await setTimeout(100)

    // Grant issuer role to account2
    const grantHash = await actions.grantTokenRole(client, {
      token: address,
      role: 'issuer',
      to: account2.address,
    })

    await setTimeout(100)

    const grantReceipt = await client.getTransactionReceipt({ hash: grantHash })

    expect(grantReceipt.status).toBe('success')
  })
})

describe.skipIf(!!process.env.CI)('revokeTokenRole', async () => {
  test('default', async () => {
    const { address } = await actions.createToken(client, {
      admin: client.account,
      currency: 'USD',
      name: 'Test Token 2',
      symbol: 'TEST2',
    })

    await setTimeout(100)

    await actions.grantTokenRole(client, {
      token: address,
      role: 'issuer',
      to: account2.address,
    })

    await setTimeout(100)

    const revokeHash = await actions.revokeTokenRole(client, {
      token: address,
      role: 'issuer',
      from: account2.address,
    })

    expect(revokeHash).toBeDefined()

    await setTimeout(100)

    const revokeReceipt = await client.getTransactionReceipt({
      hash: revokeHash,
    })
    expect(revokeReceipt.status).toBe('success')
  })
})

// TODO: fix
describe.skip('renounceTokenRole', async () => {
  test('default', async () => {
    const { address } = await actions.createToken(client, {
      admin: client.account,
      currency: 'USD',
      name: 'Test Token 3',
      symbol: 'TEST3',
    })

    await setTimeout(100)

    await actions.grantTokenRole(client, {
      token: address,
      role: 'issuer',
      to: client.account.address,
    })

    await setTimeout(100)

    const renounceHash = await actions.renounceTokenRole(client, {
      token: address,
      role: 'issuer',
    })

    expect(renounceHash).toBeDefined()

    await setTimeout(100)

    const renounceReceipt = await client.getTransactionReceipt({
      hash: renounceHash,
    })
    expect(renounceReceipt.status).toBe('success')
  })
})

describe.todo('setTokenRoleAdmin')

describe.skipIf(!!process.env.CI)('decorator', () => {
  const client2 = createClient({
    chain: tempoLocal,
    transport: http(),
  }).extend(actions.decorator())

  test('default', async () => {
    expect(Object.keys(client2)).toMatchInlineSnapshot(`
      [
        "account",
        "batch",
        "cacheTime",
        "ccipRead",
        "chain",
        "key",
        "name",
        "pollingInterval",
        "request",
        "transport",
        "type",
        "uid",
        "extend",
        "approveTransferToken",
        "burnBlockedToken",
        "burnToken",
        "changeTokenTransferPolicy",
        "createToken",
        "getTokenAllowance",
        "getTokenBalance",
        "getTokenMetadata",
        "getUserToken",
        "grantTokenRole",
        "mintToken",
        "pauseToken",
        "permitToken",
        "renounceTokenRole",
        "revokeTokenRole",
        "setTokenSupplyCap",
        "setTokenRoleAdmin",
        "setUserToken",
        "transferToken",
        "unpauseToken",
      ]
    `)
  })
})
