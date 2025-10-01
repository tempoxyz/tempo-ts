import { afterEach, beforeEach, describe, expect, test } from 'bun:test'
import { setTimeout } from 'node:timers/promises'
import { tempoLocal } from 'tempo/chains'
import { Instance } from 'tempo/prool'
import * as actions from 'tempo/viem/actions'
import { publicActions } from 'viem'
import { mnemonicToAccount } from 'viem/accounts'
import { waitForTransactionReceipt } from 'viem/actions'
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

describe.skipIf(!!process.env.CI)('create', () => {
  test('default', async () => {
    // create whitelist policy
    const { hash, policyId } = await actions.policy.create(client, {
      type: 'whitelist',
    })
    await waitForTransactionReceipt(client, { hash })

    // verify policy was created
    const data = await actions.policy.getData(client, {
      policyId,
    })
    expect(data.admin).toBe(account.address)
    expect(data.type).toBe('whitelist')
  })

  test('behavior: blacklist', async () => {
    // create blacklist policy
    const { hash, policyId } = await actions.policy.create(client, {
      type: 'blacklist',
    })
    await waitForTransactionReceipt(client, { hash })

    // verify policy was created
    const data = await actions.policy.getData(client, {
      policyId,
    })
    expect(data.admin).toBe(account.address)
    expect(data.type).toBe('blacklist')
  })

  test.skip('behavior: with initial addresses', async () => {
    // create policy with initial addresses
    const { hash, policyId } = await actions.policy.create(client, {
      type: 'whitelist',
      addresses: [account2.address, account3.address],
    })
    await waitForTransactionReceipt(client, { hash })

    // verify addresses are whitelisted
    const isAuthorized2 = await actions.policy.isAuthorized(client, {
      policyId,
      user: account2.address,
    })
    expect(isAuthorized2).toBe(true)

    const isAuthorized3 = await actions.policy.isAuthorized(client, {
      policyId,
      user: account3.address,
    })
    expect(isAuthorized3).toBe(true)

    // verify other address is not whitelisted
    const isAuthorized = await actions.policy.isAuthorized(client, {
      policyId,
      user: account.address,
    })
    expect(isAuthorized).toBe(false)
  })
})

describe.skipIf(!!process.env.CI)('setAdmin', () => {
  test('default', async () => {
    // create policy
    const { hash, policyId } = await actions.policy.create(client, {
      type: 'whitelist',
    })
    await waitForTransactionReceipt(client, { hash })

    {
      // set new admin
      const hash = await actions.policy.setAdmin(client, {
        policyId,
        admin: account2.address,
      })
      await waitForTransactionReceipt(client, { hash })
    }

    {
      // verify new admin
      const data = await actions.policy.getData(client, {
        policyId,
      })
      expect(data.admin).toBe(account2.address)
    }
  })
})

describe.skipIf(!!process.env.CI)('modifyWhitelist', () => {
  test('default', async () => {
    // create whitelist policy
    const { hash, policyId } = await actions.policy.create(client, {
      type: 'whitelist',
    })
    await waitForTransactionReceipt(client, { hash })

    {
      // verify account2 is not authorized
      const isAuthorized = await actions.policy.isAuthorized(client, {
        policyId,
        user: account2.address,
      })
      expect(isAuthorized).toBe(false)
    }

    {
      // add account2 to whitelist
      const hash = await actions.policy.modifyWhitelist(client, {
        policyId,
        address: account2.address,
        allowed: true,
      })
      await waitForTransactionReceipt(client, { hash })
    }

    {
      // verify account2 is authorized
      const isAuthorized = await actions.policy.isAuthorized(client, {
        policyId,
        user: account2.address,
      })
      expect(isAuthorized).toBe(true)
    }

    {
      // remove account2 from whitelist
      const hash = await actions.policy.modifyWhitelist(client, {
        policyId,
        address: account2.address,
        allowed: false,
      })
      await waitForTransactionReceipt(client, { hash })
    }

    {
      // verify account2 is no longer authorized
      const isAuthorized = await actions.policy.isAuthorized(client, {
        policyId,
        user: account2.address,
      })
      expect(isAuthorized).toBe(false)
    }
  })
})

describe.skipIf(!!process.env.CI)('modifyBlacklist', () => {
  test('default', async () => {
    // create blacklist policy
    const { hash, policyId } = await actions.policy.create(client, {
      type: 'blacklist',
    })
    await waitForTransactionReceipt(client, { hash })

    {
      // verify account2 is authorized (not blacklisted)
      const isAuthorized = await actions.policy.isAuthorized(client, {
        policyId,
        user: account2.address,
      })
      expect(isAuthorized).toBe(true)
    }

    {
      // add account2 to blacklist
      const hash = await actions.policy.modifyBlacklist(client, {
        policyId,
        address: account2.address,
        restricted: true,
      })
      await waitForTransactionReceipt(client, { hash })
    }

    {
      // verify account2 is not authorized (blacklisted)
      const isAuthorized = await actions.policy.isAuthorized(client, {
        policyId,
        user: account2.address,
      })
      expect(isAuthorized).toBe(false)
    }

    {
      // remove account2 from blacklist
      const hash = await actions.policy.modifyBlacklist(client, {
        policyId,
        address: account2.address,
        restricted: false,
      })
      await waitForTransactionReceipt(client, { hash })
    }

    {
      // verify account2 is authorized again
      const isAuthorized = await actions.policy.isAuthorized(client, {
        policyId,
        user: account2.address,
      })
      expect(isAuthorized).toBe(true)
    }
  })
})

describe.skipIf(!!process.env.CI)('getData', () => {
  test('default', async () => {
    // create policy
    const { hash, policyId } = await actions.policy.create(client, {
      type: 'whitelist',
    })
    await waitForTransactionReceipt(client, { hash })

    {
      // get policy data
      const data = await actions.policy.getData(client, {
        policyId,
      })
      expect(data.admin).toBe(account.address)
      expect(data.type).toBe('whitelist')
    }
  })

  test('behavior: blacklist', async () => {
    // create blacklist policy
    const { hash, policyId } = await actions.policy.create(client, {
      type: 'blacklist',
    })
    await waitForTransactionReceipt(client, { hash })

    {
      // get policy data
      const data = await actions.policy.getData(client, {
        policyId,
      })
      expect(data.admin).toBe(account.address)
      expect(data.type).toBe('blacklist')
    }
  })
})

describe.skipIf(!!process.env.CI)('isAuthorized', () => {
  test('special policy: always-reject (policyId 0)', async () => {
    const isAuthorized = await actions.policy.isAuthorized(client, {
      policyId: 0n,
      user: account.address,
    })
    expect(isAuthorized).toBe(false)
  })

  test('special policy: always-allow (policyId 1)', async () => {
    const isAuthorized = await actions.policy.isAuthorized(client, {
      policyId: 1n,
      user: account.address,
    })
    expect(isAuthorized).toBe(true)
  })

  test.skip('whitelist policy', async () => {
    // create whitelist policy
    const { hash, policyId } = await actions.policy.create(client, {
      type: 'whitelist',
      addresses: [account2.address],
    })
    await waitForTransactionReceipt(client, { hash })

    {
      // verify whitelisted address is authorized
      const isAuthorized = await actions.policy.isAuthorized(client, {
        policyId,
        user: account2.address,
      })
      expect(isAuthorized).toBe(true)
    }

    {
      // verify non-whitelisted address is not authorized
      const isAuthorized = await actions.policy.isAuthorized(client, {
        policyId,
        user: account.address,
      })
      expect(isAuthorized).toBe(false)
    }
  })

  test.skip('blacklist policy', async () => {
    // create blacklist policy
    const { hash, policyId } = await actions.policy.create(client, {
      type: 'blacklist',
      addresses: [account2.address],
    })
    await waitForTransactionReceipt(client, { hash })

    {
      // verify blacklisted address is not authorized
      const isAuthorized = await actions.policy.isAuthorized(client, {
        policyId,
        user: account2.address,
      })
      expect(isAuthorized).toBe(false)
    }

    {
      // verify non-blacklisted address is authorized
      const isAuthorized = await actions.policy.isAuthorized(client, {
        policyId,
        user: account.address,
      })
      expect(isAuthorized).toBe(true)
    }
  })
})

describe.skipIf(!!process.env.CI)('watchCreate', () => {
  test('default', async () => {
    const logs: any[] = []
    const unwatch = actions.policy.watchCreate(client, {
      onPolicyCreated: (args, log) => {
        logs.push({ args, log })
      },
    })

    // create policy
    const { hash } = await actions.policy.create(client, {
      type: 'whitelist',
    })
    await waitForTransactionReceipt(client, { hash })

    await setTimeout(500)
    unwatch()

    expect(logs.length).toBe(1)
    expect(logs[0].args.policyId).toBe(2n)
    expect(logs[0].args.updater).toBe(account.address)
    expect(logs[0].args.type).toBe('whitelist')
  })
})

describe.skipIf(!!process.env.CI)('watchAdminUpdated', () => {
  test('default', async () => {
    // create policy
    const { hash, policyId } = await actions.policy.create(client, {
      type: 'whitelist',
    })
    await waitForTransactionReceipt(client, { hash })

    const logs: any[] = []
    const unwatch = actions.policy.watchAdminUpdated(client, {
      onAdminUpdated: (args, log) => {
        logs.push({ args, log })
      },
    })

    {
      // set new admin
      const hash = await actions.policy.setAdmin(client, {
        policyId,
        admin: account2.address,
      })
      await waitForTransactionReceipt(client, { hash })
    }

    await setTimeout(500)
    unwatch()

    expect(logs.length).toBe(1)
    expect(logs[0].args.policyId).toBe(2n)
    expect(logs[0].args.updater).toBe(account.address)
    expect(logs[0].args.admin).toBe(account2.address)
  })
})

describe.skipIf(!!process.env.CI)('watchWhitelistUpdated', () => {
  test('default', async () => {
    // create whitelist policy
    const { hash, policyId } = await actions.policy.create(client, {
      type: 'whitelist',
    })
    await waitForTransactionReceipt(client, { hash })

    const logs: any[] = []
    const unwatch = actions.policy.watchWhitelistUpdated(client, {
      onWhitelistUpdated: (args, log) => {
        logs.push({ args, log })
      },
    })

    {
      // add address to whitelist
      const hash = await actions.policy.modifyWhitelist(client, {
        policyId,
        address: account2.address,
        allowed: true,
      })
      await waitForTransactionReceipt(client, { hash })
    }

    {
      // remove address from whitelist
      const hash = await actions.policy.modifyWhitelist(client, {
        policyId,
        address: account2.address,
        allowed: false,
      })
      await waitForTransactionReceipt(client, { hash })
    }

    await setTimeout(500)
    unwatch()

    expect(logs.length).toBe(2)
    expect(logs[0].args.policyId).toBe(2n)
    expect(logs[0].args.updater).toBe(account.address)
    expect(logs[0].args.account).toBe(account2.address)
    expect(logs[0].args.allowed).toBe(true)
    expect(logs[1].args.allowed).toBe(false)
  })
})

describe.skipIf(!!process.env.CI)('watchBlacklistUpdated', () => {
  test('default', async () => {
    // create blacklist policy
    const { hash, policyId } = await actions.policy.create(client, {
      type: 'blacklist',
    })
    await waitForTransactionReceipt(client, { hash })

    const logs: any[] = []
    const unwatch = actions.policy.watchBlacklistUpdated(client, {
      onBlacklistUpdated: (args, log) => {
        logs.push({ args, log })
      },
    })

    {
      // add address to blacklist
      const hash = await actions.policy.modifyBlacklist(client, {
        policyId,
        address: account2.address,
        restricted: true,
      })
      await waitForTransactionReceipt(client, { hash })
    }

    {
      // remove address from blacklist
      const hash = await actions.policy.modifyBlacklist(client, {
        policyId,
        address: account2.address,
        restricted: false,
      })
      await waitForTransactionReceipt(client, { hash })
    }

    await setTimeout(500)
    unwatch()

    expect(logs.length).toBe(2)
    expect(logs[0].args.policyId).toBe(2n)
    expect(logs[0].args.updater).toBe(account.address)
    expect(logs[0].args.account).toBe(account2.address)
    expect(logs[0].args.restricted).toBe(true)
    expect(logs[1].args.restricted).toBe(false)
  })
})
