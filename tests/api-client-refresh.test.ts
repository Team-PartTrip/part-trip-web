import assert from 'node:assert/strict'
import test from 'node:test'
import axios, { AxiosError, type AxiosAdapter } from 'axios'

import { apiClient } from '../src/shared/libs/api-client.ts'
import { clearAuthTokens, saveAuthTokens } from '../src/shared/libs/token-storage.ts'

function createStorage() {
  const values = new Map<string, string>()
  return {
    getItem: (key: string) => values.get(key) ?? null,
    removeItem: (key: string) => values.delete(key),
    setItem: (key: string, value: string) => values.set(key, value),
  }
}

test('401 응답이면 refresh 후 원래 요청을 새 access token으로 재시도한다', async () => {
  const storage = createStorage()
  const previousStorage = globalThis.localStorage
  const previousAxiosAdapter = axios.defaults.adapter
  const previousApiAdapter = apiClient.defaults.adapter
  const requests: string[] = []
  const adapter: AxiosAdapter = async (config) => {
    const url = config.url ?? ''
    requests.push(url)

    if (url === '/auth/refresh') {
      return { config, data: { accessToken: 'refreshed', refreshToken: 'refresh-2' }, headers: {}, status: 200, statusText: 'OK' }
    }

    if (config.headers.Authorization === 'Bearer refreshed') {
      return { config, data: { ok: true }, headers: {}, status: 200, statusText: 'OK' }
    }

    const response = { config, data: {}, headers: {}, status: 401, statusText: 'Unauthorized' }
    return Promise.reject(new AxiosError('Unauthorized', AxiosError.ERR_BAD_REQUEST, config, undefined, response))
  }

  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: storage })
  axios.defaults.adapter = adapter
  apiClient.defaults.adapter = adapter
  saveAuthTokens({ accessToken: 'expired', refreshToken: 'refresh-1' })

  try {
    const response = await apiClient.get<{ ok: boolean }>('/private')
    assert.equal(response.data.ok, true)
    assert.deepEqual(requests, ['/private', '/auth/refresh', '/private'])
    assert.equal(storage.getItem('accessToken'), 'refreshed')
    assert.equal(storage.getItem('refreshToken'), 'refresh-2')
  } finally {
    clearAuthTokens()
    Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: previousStorage })
    axios.defaults.adapter = previousAxiosAdapter
    apiClient.defaults.adapter = previousApiAdapter
  }
})

test('보호 API는 access token 없이 요청하지 않는다', async () => {
  const storage = createStorage()
  const previousStorage = globalThis.localStorage
  const previousApiAdapter = apiClient.defaults.adapter
  let requested = false

  apiClient.defaults.adapter = async (config) => {
    requested = true
    return { config, data: {}, headers: {}, status: 200, statusText: 'OK' }
  }
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: storage })

  try {
    await assert.rejects(apiClient.get('/private'), /로그인이 필요합니다/)
    assert.equal(requested, false)
  } finally {
    clearAuthTokens()
    Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: previousStorage })
    apiClient.defaults.adapter = previousApiAdapter
  }
})

test('인증 API에는 저장된 access token을 첨부하지 않는다', async () => {
  const storage = createStorage()
  const previousStorage = globalThis.localStorage
  const previousApiAdapter = apiClient.defaults.adapter
  const authorizations: Array<[string, unknown]> = []

  apiClient.defaults.adapter = async (config) => {
    authorizations.push([config.url ?? '', config.headers.Authorization])
    return { config, data: {}, headers: {}, status: 200, statusText: 'OK' }
  }
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: storage })
  saveAuthTokens({ accessToken: 'stale-access', refreshToken: 'refresh-1' })

  try {
    await apiClient.post('/auth/login', {})
    await apiClient.get('/auth/login?next=/private')
    await apiClient.get('/users?redirect=/auth/login')
    await apiClient.get('/admin/auth/audit')
    assert.deepEqual(authorizations, [
      ['/auth/login', undefined],
      ['/auth/login?next=/private', undefined],
      ['/users?redirect=/auth/login', 'Bearer stale-access'],
      ['/admin/auth/audit', 'Bearer stale-access'],
    ])
  } finally {
    clearAuthTokens()
    Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: previousStorage })
    apiClient.defaults.adapter = previousApiAdapter
  }
})

test('access token이 없는 인증 API 요청은 세션 만료 없이 허용한다', async () => {
  const storage = createStorage()
  const previousStorage = globalThis.localStorage
  const previousWindow = Object.getOwnPropertyDescriptor(globalThis, 'window')
  const previousApiAdapter = apiClient.defaults.adapter
  let requested = false
  let expiredEvents = 0
  let authorization: unknown

  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: {
      dispatchEvent: () => {
        expiredEvents += 1
        return true
      },
      localStorage: createStorage(),
      sessionStorage: storage,
    },
  })
  apiClient.defaults.adapter = async (config) => {
    requested = true
    authorization = config.headers.Authorization
    return { config, data: {}, headers: {}, status: 200, statusText: 'OK' }
  }

  try {
    await apiClient.post('/auth/login', {})
    assert.equal(requested, true)
    assert.equal(authorization, undefined)
    assert.equal(expiredEvents, 0)
  } finally {
    clearAuthTokens()
    Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: previousStorage })
    apiClient.defaults.adapter = previousApiAdapter
    if (previousWindow) {
      Object.defineProperty(globalThis, 'window', previousWindow)
    } else {
      Reflect.deleteProperty(globalThis, 'window')
    }
  }
})

test('원격 인증 갱신은 HTTPS가 아니면 차단한다', async () => {
  const storage = createStorage()
  const previousWindow = Object.getOwnPropertyDescriptor(globalThis, 'window')
  const previousApiAdapter = apiClient.defaults.adapter
  const previousBaseURL = apiClient.defaults.baseURL
  let requested = 0

  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: {
      dispatchEvent: () => true,
      location: { origin: 'https://app.example' },
      localStorage: createStorage(),
      sessionStorage: storage,
    },
  })
  apiClient.defaults.baseURL = 'http://api.example/api'
  apiClient.defaults.adapter = async (config) => {
    requested += 1
    const response = { config, data: {}, headers: {}, status: 401, statusText: 'Unauthorized' }
    return Promise.reject(new AxiosError('Unauthorized', AxiosError.ERR_BAD_REQUEST, config, undefined, response))
  }
  saveAuthTokens({ accessToken: 'expired', refreshToken: 'refresh-1' })

  try {
    await assert.rejects(apiClient.get('/private'), /HTTPS/)
    assert.equal(requested, 1)
  } finally {
    clearAuthTokens()
    apiClient.defaults.adapter = previousApiAdapter
    apiClient.defaults.baseURL = previousBaseURL
    if (previousWindow) {
      Object.defineProperty(globalThis, 'window', previousWindow)
    } else {
      Reflect.deleteProperty(globalThis, 'window')
    }
  }
})
