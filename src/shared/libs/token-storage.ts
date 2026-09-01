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
  const accessToken = typeof tokens?.accessToken === 'string' ? tokens.accessToken.trim() : ''
  const refreshToken = typeof tokens?.refreshToken === 'string' ? tokens.refreshToken.trim() : ''
  if (!accessToken || !refreshToken) throw new Error('인증 토큰 응답이 올바르지 않습니다.')

  const target = getStorage(storage)
  target.setItem(ACCESS_TOKEN_KEY, accessToken)
  target.setItem(REFRESH_TOKEN_KEY, refreshToken)
  if (!storage) clearLegacyTokens()
  return { accessToken, refreshToken }
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
