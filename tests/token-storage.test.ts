import assert from 'node:assert/strict'
import test from 'node:test'

import {
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  clearAuthTokens,
  getRefreshToken,
  saveAuthTokens,
} from '../src/shared/libs/token-storage.ts'

function createStorage() {
  const values = new Map<string, string>()
  return {
    getItem: (key: string) => values.get(key) ?? null,
    removeItem: (key: string) => values.delete(key),
    setItem: (key: string, value: string) => values.set(key, value),
  }
}

test('access token과 refresh token을 함께 저장한다', () => {
  const storage = createStorage()
  saveAuthTokens({ accessToken: 'access', refreshToken: 'refresh' }, storage)

  assert.equal(storage.getItem(ACCESS_TOKEN_KEY), 'access')
  assert.equal(getRefreshToken(storage), 'refresh')
})

test('로그아웃 시 두 토큰을 모두 제거한다', () => {
  const storage = createStorage()
  saveAuthTokens({ accessToken: 'access', refreshToken: 'refresh' }, storage)
  clearAuthTokens(storage)

  assert.equal(storage.getItem(ACCESS_TOKEN_KEY), null)
  assert.equal(storage.getItem(REFRESH_TOKEN_KEY), null)
})

test('빈 인증 토큰은 저장하지 않는다', () => {
  const storage = createStorage()

  assert.throws(() => saveAuthTokens({ accessToken: ' ', refreshToken: 'refresh' }, storage), /인증 토큰/)
  assert.equal(storage.getItem(ACCESS_TOKEN_KEY), null)
  assert.equal(storage.getItem(REFRESH_TOKEN_KEY), null)
})

test('브라우저 기본 저장소는 localStorage를 사용한다', () => {
  const localStorage = createStorage()
  const sessionStorage = createStorage()
  const previousWindow = Object.getOwnPropertyDescriptor(globalThis, 'window')
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: { localStorage, sessionStorage },
  })

  try {
    saveAuthTokens({ accessToken: 'access', refreshToken: 'refresh' })

    assert.equal(localStorage.getItem(ACCESS_TOKEN_KEY), 'access')
    assert.equal(localStorage.getItem(REFRESH_TOKEN_KEY), 'refresh')
    assert.equal(sessionStorage.getItem(ACCESS_TOKEN_KEY), null)
    assert.equal(sessionStorage.getItem(REFRESH_TOKEN_KEY), null)
  } finally {
    clearAuthTokens()
    if (previousWindow) {
      Object.defineProperty(globalThis, 'window', previousWindow)
    } else {
      Reflect.deleteProperty(globalThis, 'window')
    }
  }
})

test('토큰 갱신은 세션을 유지하고 로그인과 로그아웃은 세션을 바꾼다', async () => {
  const { AUTH_SESSION_KEY, getAuthSessionVersion, startAuthSession } = await import('../src/shared/libs/token-storage.ts')
  const previousStorage = Object.getOwnPropertyDescriptor(globalThis, 'localStorage')
  const storage = createStorage()
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: storage })
  try {
    startAuthSession({ accessToken: 'A', refreshToken: 'refresh-A' })
    const first = getAuthSessionVersion()
    saveAuthTokens({ accessToken: 'A-next', refreshToken: 'refresh-A-next' })
    assert.equal(getAuthSessionVersion(), first)
    startAuthSession({ accessToken: 'B', refreshToken: 'refresh-B' })
    assert.notEqual(getAuthSessionVersion(), first)
    const second = getAuthSessionVersion()
    clearAuthTokens()
    assert.notEqual(getAuthSessionVersion(), second)
    assert.equal(storage.getItem(AUTH_SESSION_KEY), null)
  } finally {
    clearAuthTokens()
    if (previousStorage) Object.defineProperty(globalThis, 'localStorage', previousStorage)
    else Reflect.deleteProperty(globalThis, 'localStorage')
  }
})

test('세션 키가 없는 기존 로그인도 첫 토큰 갱신 중에는 같은 세션을 유지한다', async () => {
  const { AUTH_SESSION_KEY, getAuthSessionVersion } = await import('../src/shared/libs/token-storage.ts')
  const previousStorage = Object.getOwnPropertyDescriptor(globalThis, 'localStorage')
  const storage = createStorage()
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: storage })
  storage.setItem(ACCESS_TOKEN_KEY, 'legacy-access')
  storage.setItem(REFRESH_TOKEN_KEY, 'legacy-refresh')
  try {
    const initial = getAuthSessionVersion()
    assert.ok(storage.getItem(AUTH_SESSION_KEY))
    saveAuthTokens({ accessToken: 'refreshed', refreshToken: 'rotated-refresh' })
    assert.equal(getAuthSessionVersion(), initial)
  } finally {
    clearAuthTokens()
    if (previousStorage) Object.defineProperty(globalThis, 'localStorage', previousStorage)
    else Reflect.deleteProperty(globalThis, 'localStorage')
  }
})
