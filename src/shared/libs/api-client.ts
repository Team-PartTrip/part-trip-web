import axios, { type InternalAxiosRequestConfig } from 'axios'

import {
  clearAuthTokens,
  getAccessToken,
  getAuthSessionVersion,
  getRefreshToken,
  saveAuthTokens,
  type AuthTokens,
} from './token-storage.ts'
import { notifyAuthExpired } from './auth-expiration.ts'

export { AUTH_EXPIRED_EVENT } from './auth-expiration.ts'

const REQUEST_TIMEOUT_MS = 100_000

function isLocalDevelopmentUrl(url: URL) {
  return import.meta.env?.DEV && ['localhost', '127.0.0.1', '::1', '[::1]'].includes(url.hostname)
}

function getSafeApiBaseUrl() {
  const baseURL = import.meta.env?.VITE_API_BASE_URL?.trim() ?? ''
  if (typeof window === 'undefined') return baseURL

  const apiUrl = new URL(baseURL || '/', window.location.origin)
  if (apiUrl.protocol !== 'https:' && !isLocalDevelopmentUrl(apiUrl)) {
    throw new Error('인증 요청은 HTTPS 연결에서만 사용할 수 있습니다.')
  }

  return baseURL
}

export const apiClient = axios.create({
  baseURL: getSafeApiBaseUrl(),
  timeout: REQUEST_TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
    ...(import.meta.env?.DEV
      ? { 'ngrok-skip-browser-warning': 'true' }
      : {}),
  },
})

export function resolveApiAssetUrl(url?: string | null): string | undefined {
  if (!url || !url.startsWith('/')) return url ?? undefined
  if (typeof window === 'undefined') return url
  const apiBaseUrl = new URL(apiClient.defaults.baseURL ?? '/', window.location.origin)
  return new URL(url, apiBaseUrl.origin).href
}

function isAuthRequest(url?: string) {
  if (!url) return false

  try {
    const pathname = new URL(url, 'https://parttrip.invalid').pathname
    return pathname === '/auth' || pathname.startsWith('/auth/')
  } catch {
    return false
  }
}

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean
  _sessionVersion?: string
}

// 보호 API 요청에만 저장된 accessToken을 자동 첨부
apiClient.interceptors.request.use((config) => {
  const request = config as RetryableRequestConfig
  const sessionVersion = getAuthSessionVersion()
  if (request._sessionVersion != null && request._sessionVersion !== sessionVersion) {
    throw new axios.CanceledError('종료된 세션의 요청입니다.')
  }
  request._sessionVersion = sessionVersion
  const token = getAccessToken()
  const isAuth = isAuthRequest(config.url)

  if (!token && !isAuth) {
    expireSession()
    return Promise.reject(new Error('로그인이 필요합니다.'))
  }

  if (token && !isAuth) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

let refreshRequest: { sessionVersion: string; refreshToken: string; promise: Promise<AuthTokens> } | null = null

function getRefreshUrl() {
  const baseURL = apiClient.defaults.baseURL ?? ''
  const refreshPath = `${baseURL.replace(/\/$/, '')}/auth/refresh`
  if (typeof window === 'undefined') return refreshPath

  const origin = window.location.origin
  const refreshUrl = new URL(refreshPath, origin)

  if (refreshUrl.protocol !== 'https:' && !isLocalDevelopmentUrl(refreshUrl)) {
    throw new Error('인증 갱신은 HTTPS 연결에서만 사용할 수 있습니다.')
  }

  return refreshUrl.href
}

function expireSession() {
  clearAuthTokens()
  notifyAuthExpired()
}

async function requestNewTokens(refreshToken: string, sessionVersion: string) {
  if (!refreshRequest || refreshRequest.sessionVersion !== sessionVersion || refreshRequest.refreshToken !== refreshToken) {
    const promise = axios
      .post<AuthTokens>(
        getRefreshUrl(),
        { refreshToken },
        { timeout: REQUEST_TIMEOUT_MS },
      )
      .then(({ data }) => {
        if (getAuthSessionVersion() !== sessionVersion || getRefreshToken() !== refreshToken) {
          throw new axios.CanceledError('종료된 세션의 인증 갱신입니다.')
        }
        return saveAuthTokens(data)
      })
      .finally(() => {
        if (refreshRequest?.promise === promise) refreshRequest = null
      })
    refreshRequest = { sessionVersion, refreshToken, promise }
  }

  return refreshRequest.promise
}

apiClient.interceptors.response.use(
  (response) => {
    const request = response.config as RetryableRequestConfig
    if (request._sessionVersion !== getAuthSessionVersion()) {
      throw new axios.CanceledError('종료된 세션의 응답입니다.')
    }
    return response
  },
  async (error: unknown) => {
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 403 &&
      !getAccessToken() &&
      !isAuthRequest(error.config?.url)
    ) {
      expireSession()
    }

    if (!axios.isAxiosError(error) || error.response?.status !== 401 || !error.config) {
      return Promise.reject(error)
    }

    const originalRequest = error.config as RetryableRequestConfig
    const sessionVersion = getAuthSessionVersion()
    if (originalRequest._sessionVersion !== sessionVersion) {
      return Promise.reject(new axios.CanceledError('종료된 세션의 응답입니다.'))
    }
    const refreshToken = getRefreshToken()
    const isRefreshRequest = originalRequest.url?.includes('/auth/refresh')

    if (originalRequest._retry || !refreshToken || isRefreshRequest || isAuthRequest(originalRequest.url)) {
      expireSession()
      return Promise.reject(error)
    }

    originalRequest._retry = true

    try {
      const tokens = await requestNewTokens(refreshToken, sessionVersion)
      if (getAuthSessionVersion() !== sessionVersion || getAccessToken() !== tokens.accessToken) {
        throw new axios.CanceledError('종료된 세션의 재시도입니다.')
      }
      originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`
      return apiClient(originalRequest)
    } catch (refreshError) {
      if (!axios.isCancel(refreshError) && getAuthSessionVersion() === sessionVersion && getRefreshToken() === refreshToken) {
        expireSession()
      }
      return Promise.reject(refreshError)
    }
  },
)
