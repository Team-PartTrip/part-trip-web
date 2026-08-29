import axios, { type InternalAxiosRequestConfig } from 'axios'

import {
  clearAuthTokens,
  getAccessToken,
  getRefreshToken,
  saveAuthTokens,
  type AuthTokens,
} from './token-storage.ts'
import { notifyAuthExpired } from './auth-expiration.ts'

export { AUTH_EXPIRED_EVENT } from './auth-expiration.ts'

const REQUEST_TIMEOUT_MS = 100_000

export const apiClient = axios.create({
  baseURL: import.meta.env?.VITE_API_BASE_URL ?? '',
  timeout: REQUEST_TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
    ...(import.meta.env?.DEV
      ? { 'ngrok-skip-browser-warning': 'true' }
      : {}),
  },
})

export function resolveApiAssetUrl(url?: string): string | undefined {
  if (!url || !url.startsWith('/')) return url
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

// 보호 API 요청에만 저장된 accessToken을 자동 첨부
apiClient.interceptors.request.use((config) => {
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

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean
}

let refreshPromise: Promise<AuthTokens> | null = null

function isLocalDevelopmentUrl(url: URL) {
  return import.meta.env?.DEV && ['localhost', '127.0.0.1', '::1', '[::1]'].includes(url.hostname)
}

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

async function requestNewTokens(refreshToken: string) {
  if (!refreshPromise) {
    refreshPromise = axios
      .post<AuthTokens>(
        getRefreshUrl(),
        { refreshToken },
        { timeout: REQUEST_TIMEOUT_MS },
      )
      .then(({ data }) => {
        saveAuthTokens(data)
        return data
      })
      .finally(() => {
        refreshPromise = null
      })
  }

  return refreshPromise
}

apiClient.interceptors.response.use(
  (response) => response,
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
    const refreshToken = getRefreshToken()
    const isRefreshRequest = originalRequest.url?.includes('/auth/refresh')

    if (originalRequest._retry || !refreshToken || isRefreshRequest || isAuthRequest(originalRequest.url)) {
      expireSession()
      return Promise.reject(error)
    }

    originalRequest._retry = true

    try {
      const tokens = await requestNewTokens(refreshToken)
      originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`
      return apiClient(originalRequest)
    } catch (refreshError) {
      expireSession()
      return Promise.reject(refreshError)
    }
  },
)
