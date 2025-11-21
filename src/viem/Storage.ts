import { createStore, set, del, get } from 'idb-keyval'
import * as Json from 'ox/Json'

import type { MaybePromise } from '../internal/types.js'
import { normalizeValue } from './internal/utils.js'

export type Storage<
  schema extends Record<string, unknown> = Record<string, unknown>,
> = {
  getItem: <name extends keyof schema>(
    name: name,
  ) => MaybePromise<schema[name] | null>
  removeItem: <name extends keyof schema>(name: name) => MaybePromise<void>
  setItem: <name extends keyof schema>(
    name: name,
    value: schema[name],
  ) => MaybePromise<void>
}

export function from<schema extends Record<string, unknown>>(
  storage: Storage,
  options: { key?: string | undefined } = {},
): Storage<schema> {
  const key = (name: any) => `${options.key ? `${options.key}:` : ''}${name}`
  return {
    getItem: (name) => storage.getItem(key(name)) as never,
    removeItem: (name) => storage.removeItem(key(name)),
    setItem: (name, value) => storage.setItem(key(name), value),
  }
}

export function idb<schema extends Record<string, unknown>>() {
  const store =
    typeof indexedDB !== 'undefined'
      ? createStore('tempo.ts', 'store')
      : undefined
  return from<schema>({
    async getItem(name) {
      const value = await get(name, store)
      if (value === null) return null
      return value
    },
    async removeItem(name) {
      await del(name, store)
    },
    async setItem(name, value) {
      await set(name, normalizeValue(value), store)
    },
  })
}

export function localStorage<schema extends Record<string, unknown>>() {
  return from<schema>({
    async getItem(name) {
      const item = window.localStorage.getItem(name)
      if (item === null) return null
      try {
        return Json.parse(item)
      } catch {
        return null
      }
    },
    async removeItem(name) {
      window.localStorage.removeItem(name)
    },
    async setItem(name, value) {
      window.localStorage.setItem(name, Json.stringify(value))
    },
  })
}

const store = new Map<string, any>()
export function memory<schema extends Record<string, unknown>>() {
  return from<schema>({
    getItem(name) {
      return store.get(name) ?? null
    },
    removeItem(name) {
      store.delete(name)
    },
    setItem(name, value) {
      store.set(name, value)
    },
  })
}
