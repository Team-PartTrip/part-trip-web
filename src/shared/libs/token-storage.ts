export const ACCESS_TOKEN_KEY = 'accessToken'
export const REFRESH_TOKEN_KEY = 'refreshToken'
export const AUTH_SESSION_KEY = 'parttrip:auth-session'

export type AuthTokens = {
  accessToken: string
  refreshToken: string
}

type TokenStorage = Pick<Storage, 'getItem' | 'removeItem' | 'setItem'>

let sessionVersion = 0

export function getAuthSessionVersion() {
  return `${sessionVersion}:${getStorage().getItem(AUTH_SESSION_KEY) ?? ''}`
}

function getStorage(storage?: TokenStorage) {
  if (storage) return storage
  if (typeof window !== 'undefined') return window.localStorage
  return localStorage
}

export function saveAuthTokens(tokens: AuthTokens, storage?: TokenStorage) {
  const accessToken = typeof tokens?.accessToken === 'string' ? tokens.accessToken.trim() : ''
  const refreshToken = typeof tokens?.refreshToken === 'string' ? tokens.refreshToken.trim() : ''
  if (!accessToken || !refreshToken) throw new Error('인증 토큰 응답이 올바르지 않습니다.')

  const target = getStorage(storage)
  target.setItem(ACCESS_TOKEN_KEY, accessToken)
  target.setItem(REFRESH_TOKEN_KEY, refreshToken)
  if (!target.getItem(AUTH_SESSION_KEY)) target.setItem(AUTH_SESSION_KEY, crypto.randomUUID())
  return { accessToken, refreshToken }
}

export function startAuthSession(tokens: AuthTokens) {
  const saved = saveAuthTokens(tokens)
  getStorage().setItem(AUTH_SESSION_KEY, crypto.randomUUID())
  return saved
}

export function getAccessToken(storage?: TokenStorage) {
  return getStorage(storage).getItem(ACCESS_TOKEN_KEY)
}

export function getRefreshToken(storage?: TokenStorage) {
  return getStorage(storage).getItem(REFRESH_TOKEN_KEY)
}

export function clearAuthTokens(storage?: TokenStorage) {
  sessionVersion += 1
  const target = getStorage(storage)
  target.removeItem(ACCESS_TOKEN_KEY)
  target.removeItem(REFRESH_TOKEN_KEY)
  target.removeItem(AUTH_SESSION_KEY)
}
