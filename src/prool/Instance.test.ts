import { afterEach, describe, expect, test } from 'bun:test'
import type { Instance as prool_Instance } from 'prool/instances'
import { Instance } from 'tempo/prool'

const instances: prool_Instance[] = []

const tempo = (parameters: Instance.tempo.Parameters = {}) => {
  const instance = Instance.tempo(parameters)
  instances.push(instance)
  return instance
}

afterEach(async () => {
  for (const instance of instances) await instance.stop().catch(() => {})
})

describe.skipIf(!!process.env.CI)('tempo', () => {
  test('default', async () => {
    const messages: string[] = []
    const stdouts: string[] = []

    const instance = tempo()

    instance.on('message', (m) => messages.push(m))
    instance.on('stdout', (m) => stdouts.push(m))

    expect(instance.messages.get()).toMatchInlineSnapshot('[]')

    await instance.start()
    expect(instance.status).toEqual('started')

    expect(messages.join('')).toBeDefined()
    expect(stdouts.join('')).toBeDefined()
    expect(instance.messages.get().join('')).toBeDefined()

    await instance.stop()
    expect(instance.status).toEqual('stopped')

    expect(messages.join('')).toBeDefined()
    expect(stdouts.join('')).toBeDefined()
    expect(instance.messages.get()).toMatchInlineSnapshot('[]')
  })

  test('behavior: instance errored (duplicate ports)', async () => {
    const instance_1 = tempo({ port: 8545 })
    const instance_2 = tempo({ port: 8545 })

    await instance_1.start()
    expect(instance_2.start()).rejects.toThrowError(
      'shutting down due to error',
    )
  })

  test(
    'behavior: start and stop multiple times',
    async () => {
      const instance = tempo()

      await instance.start()
      await instance.stop()
      await instance.start()
      await instance.stop()
      await instance.start()
      await instance.stop()
    },
    { timeout: 10_000 },
  )

  test('behavior: can subscribe to stdout', async () => {
    const messages: string[] = []
    const instance = tempo()
    instance.on('stdout', (message) => messages.push(message))

    await instance.start()
    expect(messages.length).toBeGreaterThanOrEqual(1)
  })

  test('behavior: can subscribe to stderr', async () => {
    const messages: string[] = []

    const instance_1 = tempo({ port: 8545 })
    const instance_2 = tempo({ port: 8545 })

    await instance_1.start()
    instance_2.on('stderr', (message) => messages.push(message))
    expect(instance_2.start()).rejects.toThrow(
      'Failed to start process "tempo"',
    )
  })

  test('behavior: exit when status is starting', async () => {
    const instance = tempo()

    const promise = instance.start()
    expect(instance.status).toEqual('starting')

    instance._internal.process.kill()

    expect(promise).rejects.toThrowError('Failed to start process "tempo"')
  })
})
