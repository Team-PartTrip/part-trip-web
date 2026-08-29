export const ACCESS_TOKEN_KEY = 'accessToken'
export const REFRESH_TOKEN_KEY = 'refreshToken'

export type AuthTokens = {
  accessToken: string
  refreshToken: string
}

type TokenStorage = Pick<Storage, 'getItem' | 'removeItem' | 'setItem'>

function clearLegacyTokens() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(ACCESS_TOKEN_KEY)
  window.localStorage.removeItem(REFRESH_TOKEN_KEY)
}

function getStorage(storage?: TokenStorage) {
  if (storage) return storage
  if (typeof window !== 'undefined') {
    clearLegacyTokens()
    return window.sessionStorage
  }
  return localStorage
}

export function saveAuthTokens(tokens: AuthTokens, storage?: TokenStorage) {
  const target = getStorage(storage)
  target.setItem(ACCESS_TOKEN_KEY, tokens.accessToken)
  target.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken)
  if (!storage) clearLegacyTokens()
}

export function getAccessToken(storage?: TokenStorage) {
  return getStorage(storage).getItem(ACCESS_TOKEN_KEY)
}

export function getRefreshToken(storage?: TokenStorage) {
  return getStorage(storage).getItem(REFRESH_TOKEN_KEY)
}

export function clearAuthTokens(storage?: TokenStorage) {
  const target = getStorage(storage)
  target.removeItem(ACCESS_TOKEN_KEY)
  target.removeItem(REFRESH_TOKEN_KEY)
  if (!storage) clearLegacyTokens()
}
