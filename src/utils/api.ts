// src/apiConfig.ts
export type ApiConfig = {
  baseUrl: string
  timeout?: number
  headers?: Record<string, string>
}

export const createApiConfig = (config: ApiConfig): ApiConfig => ({
  baseUrl: config.baseUrl.replace(/\/+$/, ''),
  timeout: config.timeout ?? 10000,
  headers: config.headers ?? { 'Content-Type': 'application/json' }
})

// src/apiError.ts
export class ApiError extends Error {
  readonly status?: number
  readonly data?: unknown
  constructor(message: string, status?: number, data?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

// src/request.ts
import { ApiConfig } from './apiConfig'
import { ApiError } from './apiError'

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

export type RequestOptions = {
  method?: HttpMethod
  path: string
  params?: Record<string, string | number | boolean>
  body?: unknown
  headers?: Record<string, string>
}

export type ApiResponse<T> = {
  data: T
  status: number
  headers: Headers
}

/**
 * Performs an HTTP request to the ecommerce API.
 * @template T Response data type
 * @param config API configuration
 * @param options Request options
 * @returns ApiResponse<T>
 * @throws ApiError
 */
export const apiRequest = async <T>(
  config: ApiConfig,
  options: RequestOptions
): Promise<ApiResponse<T>> => {
  const url = buildUrl(config.baseUrl, options.path, options.params)
  const headers = { ...config.headers, ...options.headers }
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), config.timeout)
  try {
    const response = await fetch(url, {
      method: options.method ?? 'GET',
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
      signal: controller.signal
    })
    clearTimeout(timeout)
    const contentType = response.headers.get('content-type')
    const isJson = contentType?.includes('application/json')
    const data = isJson ? await response.json() : await response.text()
    if (!response.ok) throw new ApiError('API Error', response.status, data)
    return { data, status: response.status, headers: response.headers }
  } catch (err) {
    clearTimeout(timeout)
    if (err instanceof ApiError) throw err
    throw new ApiError('Network Error', undefined, err)
  }
}

const buildUrl = (
  baseUrl: string,
  path: string,
  params?: Record<string, string | number | boolean>
): string => {
  const url = [baseUrl.replace(/\/+$/, ''), path.replace(/^\/+/, '')].join('/')
  if (!params) return url
  const search = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => search.append(k, String(v)))
  return `${url}?${search.toString()}`
}

// tests/apiConfig.test.ts
import { describe, it, expect } from 'vitest'
import { createApiConfig } from '../src/apiConfig'

describe('createApiConfig', () => {
  it('returns config with defaults', () => {
    const config = createApiConfig({ baseUrl: 'https://api.com/' })
    expect(config.baseUrl).toBe('https://api.com')
    expect(config.timeout).toBe(10000)
    expect(config.headers).toEqual({ 'Content-Type': 'application/json' })
  })
  it('overrides defaults', () => {
    const config = createApiConfig({
      baseUrl: 'https://api.com/',
      timeout: 5000,
      headers: { Authorization: 'token' }
    })
    expect(config.timeout).toBe(5000)
    expect(config.headers).toEqual({ Authorization: 'token' })
  })
})

// tests/apiError.test.ts
import { describe, it, expect } from 'vitest'
import { ApiError } from '../src/apiError'

describe('ApiError', () => {
  it('sets properties', () => {
    const err = new ApiError('fail', 404, { foo: 'bar' })
    expect(err.message).toBe('fail')
    expect(err.status).toBe(404)
    expect(err.data).toEqual({ foo: 'bar' })
    expect(err.name).toBe('ApiError')
  })
})

// tests/request.test.ts
import { describe, it, expect, vi } from 'vitest'
import { apiRequest } from '../src/request'
import { createApiConfig } from '../src/apiConfig'

global.fetch = vi.fn()

describe('apiRequest', () => {
  const config = createApiConfig({ baseUrl: 'https://api.com' })
  it('returns data on success', async () => {
    ;(fetch as any).mockResolvedValueOnce({
      ok: true,
      status: 200,
      headers: { get: () => 'application/json' },
      json: async () => ({ id: 1 }),
    })
    const res = await apiRequest<{ id: number }>(config, { path: '/products/1' })
    expect(res.data).toEqual({ id: 1 })
    expect(res.status).toBe(200)
  })
  it('throws ApiError on failure', async () => {
    ;(fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 404,
      headers: { get: () => 'application/json' },
      json: async () => ({ error: 'Not found' }),
    })
    await expect(
      apiRequest(config, { path: '/products/999' })
    ).rejects.toHaveProperty('status', 404)
  })
  it('throws ApiError on network error', async () => {
    ;(fetch as any).mockRejectedValueOnce(new Error('fail'))
    await expect(
      apiRequest(config, { path: '/products/1' })
    ).rejects.toHaveProperty('name', 'ApiError')
  })
})