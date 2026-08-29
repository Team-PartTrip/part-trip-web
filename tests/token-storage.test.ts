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

test('브라우저 기본 저장소는 sessionStorage를 사용하고 legacy 토큰을 제거한다', () => {
  const sessionStorage = createStorage()
  const legacyStorage = createStorage()
  const previousWindow = globalThis.window
  legacyStorage.setItem(ACCESS_TOKEN_KEY, 'legacy-access')
  legacyStorage.setItem(REFRESH_TOKEN_KEY, 'legacy-refresh')
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: { localStorage: legacyStorage, sessionStorage },
  })

  try {
    saveAuthTokens({ accessToken: 'access', refreshToken: 'refresh' })

    assert.equal(sessionStorage.getItem(ACCESS_TOKEN_KEY), 'access')
    assert.equal(sessionStorage.getItem(REFRESH_TOKEN_KEY), 'refresh')
    assert.equal(legacyStorage.getItem(ACCESS_TOKEN_KEY), null)
    assert.equal(legacyStorage.getItem(REFRESH_TOKEN_KEY), null)
  } finally {
    clearAuthTokens()
    Object.defineProperty(globalThis, 'window', { configurable: true, value: previousWindow })
  }
})
