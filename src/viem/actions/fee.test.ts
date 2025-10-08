import { setTimeout } from 'node:timers/promises'
import * as actions from 'tempo/viem/actions'
import { parseEther, publicActions } from 'viem'
import { mnemonicToAccount } from 'viem/accounts'
import { writeContractSync } from 'viem/actions'
import { describe, expect, test } from 'vitest'
import { tempoTest } from '../../../test/viem/config.js'
import { tip20Abi } from '../abis.js'
import { usdAddress } from '../addresses.js'
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

describe('getUserToken', () => {
  test('default', async () => {
    // Fund accounts
    await writeContractSync(client, {
      abi: tip20Abi,
      address: usdAddress,
      functionName: 'transfer',
      args: [account2.address, parseEther('100')],
    })
    await writeContractSync(client, {
      abi: tip20Abi,
      address: usdAddress,
      functionName: 'transfer',
      args: [account3.address, parseEther('100')],
    })

    // Set token (address)
    await actions.fee.setUserTokenSync(client, {
      account: account2,
      token: '0x20c0000000000000000000000000000000000001',
    })

    // Set another token (id)
    await actions.fee.setUserTokenSync(client, {
      account: account3,
      token: 2n,
    })

    // Assert that account (with default) & account2 (with custom) tokens are set correctly.
    expect(
      await actions.fee.getUserToken(client, { account }),
    ).toMatchInlineSnapshot(`
      {
        "address": "0x20C0000000000000000000000000000000000000",
        "id": 0n,
      }
    `)
    expect(
      await actions.fee.getUserToken(client, { account: account2 }),
    ).toMatchInlineSnapshot(`
      {
        "address": "0x20C0000000000000000000000000000000000001",
        "id": 1n,
      }
    `)
    expect(
      await actions.fee.getUserToken(client, { account: account3 }),
    ).toMatchInlineSnapshot(`
      {
        "address": "0x20C0000000000000000000000000000000000002",
        "id": 2n,
      }
    `)
  })
})

describe('setUserToken', () => {
  test('default', async () => {
    expect(await actions.fee.getUserToken(client)).toMatchInlineSnapshot(
      `
        {
          "address": "0x20C0000000000000000000000000000000000000",
          "id": 0n,
        }
      `,
    )

    const { receipt: setReceipt, ...setResult } =
      await actions.fee.setUserTokenSync(client, {
        token: '0x20c0000000000000000000000000000000000001',
      })
    expect(setReceipt).toBeDefined()
    expect(setResult).toMatchInlineSnapshot(`
      {
        "token": "0x20C0000000000000000000000000000000000001",
        "user": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      }
    `)

    expect(await actions.fee.getUserToken(client, {})).toMatchInlineSnapshot(
      `
        {
          "address": "0x20C0000000000000000000000000000000000001",
          "id": 1n,
        }
      `,
    )

    const { receipt: resetReceipt, ...resetResult } =
      await actions.fee.setUserTokenSync(client, {
        feeToken: 0n,
        token: 0n,
      })
    expect(resetReceipt).toBeDefined()
    expect(resetResult).toMatchInlineSnapshot(`
      {
        "token": "0x20C0000000000000000000000000000000000000",
        "user": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      }
    `)

    expect(await actions.fee.getUserToken(client, {})).toMatchInlineSnapshot(
      `
        {
          "address": "0x20C0000000000000000000000000000000000000",
          "id": 0n,
        }
      `,
    )
  })
})

describe('watchSetUserToken', () => {
  test('default', async () => {
    const receivedSets: Array<{
      args: actions.fee.watchSetUserToken.Args
      log: actions.fee.watchSetUserToken.Log
    }> = []

    // Start watching for user token set events
    const unwatch = actions.fee.watchSetUserToken(client, {
      onUserTokenSet: (args, log) => {
        receivedSets.push({ args, log })
      },
    })

    try {
      // Set token for account2
      await writeContractSync(client, {
        abi: tip20Abi,
        address: usdAddress,
        functionName: 'transfer',
        args: [account2.address, parseEther('1')],
      })

      await actions.fee.setUserTokenSync(client, {
        account: account2,
        token: '0x20c0000000000000000000000000000000000001',
      })

      // Set token for account3
      await writeContractSync(client, {
        abi: tip20Abi,
        address: usdAddress,
        functionName: 'transfer',
        args: [account3.address, parseEther('1')],
      })

      await actions.fee.setUserTokenSync(client, {
        account: account3,
        token: '0x20c0000000000000000000000000000000000002',
      })

      await setTimeout(100)

      expect(receivedSets).toHaveLength(2)

      expect(receivedSets.at(0)!.args).toMatchInlineSnapshot(`
        {
          "token": "0x20C0000000000000000000000000000000000001",
          "user": "0x8C8d35429F74ec245F8Ef2f4Fd1e551cFF97d650",
        }
      `)
      expect(receivedSets.at(1)!.args).toMatchInlineSnapshot(`
        {
          "token": "0x20C0000000000000000000000000000000000002",
          "user": "0x98e503f35D0a019cB0a251aD243a4cCFCF371F46",
        }
      `)
    } finally {
      if (unwatch) unwatch()
    }
  })

  test('behavior: filter by user address', async () => {
    const receivedSets: Array<{
      args: actions.fee.watchSetUserToken.Args
      log: actions.fee.watchSetUserToken.Log
    }> = []

    // Start watching for user token set events only for account2
    const unwatch = actions.fee.watchSetUserToken(client, {
      args: {
        user: account2.address,
      },
      onUserTokenSet: (args, log) => {
        receivedSets.push({ args, log })
      },
    })

    try {
      // Transfer gas to accounts
      await writeContractSync(client, {
        abi: tip20Abi,
        address: usdAddress,
        functionName: 'transfer',
        args: [account2.address, parseEther('1')],
      })

      await writeContractSync(client, {
        abi: tip20Abi,
        address: usdAddress,
        functionName: 'transfer',
        args: [account3.address, parseEther('1')],
      })

      // Set token for account2 (should be captured)
      await actions.fee.setUserTokenSync(client, {
        account: account2,
        token: '0x20c0000000000000000000000000000000000001',
      })

      // Set token for account3 (should NOT be captured)
      await actions.fee.setUserTokenSync(client, {
        account: account3,
        token: '0x20c0000000000000000000000000000000000002',
      })

      // Set token for account2 again (should be captured)
      await actions.fee.setUserTokenSync(client, {
        account: account2,
        feeToken: 0n,
        token: 2n,
      })

      await setTimeout(100)

      // Should only receive 2 events (for account2)
      expect(receivedSets).toHaveLength(2)

      expect(receivedSets.at(0)!.args).toMatchInlineSnapshot(`
        {
          "token": "0x20C0000000000000000000000000000000000001",
          "user": "0x8C8d35429F74ec245F8Ef2f4Fd1e551cFF97d650",
        }
      `)
      expect(receivedSets.at(1)!.args).toMatchInlineSnapshot(`
        {
          "token": "0x20C0000000000000000000000000000000000002",
          "user": "0x8C8d35429F74ec245F8Ef2f4Fd1e551cFF97d650",
        }
      `)

      // Verify all received events are for account2
      for (const set of receivedSets) {
        expect(set.args.user).toBe(account2.address)
      }
    } finally {
      if (unwatch) unwatch()
    }
  })
})
