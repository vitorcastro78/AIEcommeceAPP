// storageUtils.ts

export type StorageType = 'local' | 'session'

export interface StorageOptions {
  storageType?: StorageType
  prefix?: string
}

const getStorage = (type: StorageType): Storage =>
  type === 'local' ? window.localStorage : window.sessionStorage

const getPrefixedKey = (key: string, prefix?: string): string =>
  prefix ? `${prefix}:${key}` : key

/**
 * Stores a value in the specified storage.
 * @param key Storage key
 * @param value Value to store
 * @param options Storage options
 */
export const setItem = <T>(
  key: string,
  value: T,
  options: StorageOptions = {}
): void => {
  try {
    const storage = getStorage(options.storageType ?? 'local')
    const storageKey = getPrefixedKey(key, options.prefix)
    const serialized = JSON.stringify(value)
    storage.setItem(storageKey, serialized)
  } catch {}
}

/**
 * Retrieves a value from the specified storage.
 * @param key Storage key
 * @param options Storage options
 * @returns The stored value or undefined
 */
export const getItem = <T>(
  key: string,
  options: StorageOptions = {}
): T | undefined => {
  try {
    const storage = getStorage(options.storageType ?? 'local')
    const storageKey = getPrefixedKey(key, options.prefix)
    const item = storage.getItem(storageKey)
    if (item === null) return undefined
    return JSON.parse(item) as T
  } catch {
    return undefined
  }
}

/**
 * Removes a value from the specified storage.
 * @param key Storage key
 * @param options Storage options
 */
export const removeItem = (
  key: string,
  options: StorageOptions = {}
): void => {
  try {
    const storage = getStorage(options.storageType ?? 'local')
    const storageKey = getPrefixedKey(key, options.prefix)
    storage.removeItem(storageKey)
  } catch {}
}

/**
 * Clears all values with the specified prefix from the storage.
 * @param options Storage options
 */
export const clearStorage = (options: StorageOptions = {}): void => {
  try {
    const storage = getStorage(options.storageType ?? 'local')
    if (!options.prefix) {
      storage.clear()
      return
    }
    const keysToRemove: string[] = []
    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i)
      if (key && key.startsWith(`${options.prefix}:`)) {
        keysToRemove.push(key)
      }
    }
    keysToRemove.forEach(k => storage.removeItem(k))
  } catch {}
}

// storageUtils.test.ts

import {
  setItem,
  getItem,
  removeItem,
  clearStorage,
  StorageOptions,
} from './storageUtils'

const mockStorage = (): Storage => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => (key in store ? store[key] : null),
    setItem: (key: string, value: string) => {
      store[key] = value
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
    key: (index: number) => Object.keys(store)[index] ?? null,
    get length() {
      return Object.keys(store).length
    },
  }
}

Object.defineProperty(window, 'localStorage', {
  value: mockStorage(),
})
Object.defineProperty(window, 'sessionStorage', {
  value: mockStorage(),
})

describe('storageUtils', () => {
  const options: StorageOptions = { storageType: 'local', prefix: 'ec' }

  it('sets and gets item', () => {
    setItem('cart', { items: [1, 2] }, options)
    const result = getItem<{ items: number[] }>('cart', options)
    expect(result).toEqual({ items: [1, 2] })
  })

  it('returns undefined for missing key', () => {
    const result = getItem('missing', options)
    expect(result).toBeUndefined()
  })

  it('removes item', () => {
    setItem('user', { id: 1 }, options)
    removeItem('user', options)
    expect(getItem('user', options)).toBeUndefined()
  })

  it('clears storage with prefix', () => {
    setItem('a', 1, options)
    setItem('b', 2, options)
    clearStorage(options)
    expect(getItem('a', options)).toBeUndefined()
    expect(getItem('b', options)).toBeUndefined()
  })

  it('clears all storage without prefix', () => {
    setItem('x', 1)
    setItem('y', 2)
    clearStorage()
    expect(getItem('x')).toBeUndefined()
    expect(getItem('y')).toBeUndefined()
  })

  it('handles invalid JSON gracefully', () => {
    window.localStorage.setItem('ec:broken', '{bad json')
    expect(getItem('broken', options)).toBeUndefined()
  })
})