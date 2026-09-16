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
