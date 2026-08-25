import axios, { type InternalAxiosRequestConfig } from 'axios'

import {
  clearAuthTokens,
  getAccessToken,
  getRefreshToken,
  saveAuthTokens,
  type AuthTokens,
} from './token-storage.ts'

export const apiClient = axios.create({
  baseURL: import.meta.env?.VITE_API_BASE_URL ?? '',
  timeout: 100000,
  headers: {
    'Content-Type': 'application/json',
    // 무료 ngrok 도메인이 띄우는 브라우저 경고 페이지 우회
    'ngrok-skip-browser-warning': 'true',
  },
})

// 저장된 accessToken을 모든 요청 헤더에 자동 첨부
apiClient.interceptors.request.use((config) => {
  const token = getAccessToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean
}

let refreshPromise: Promise<AuthTokens> | null = null

async function requestNewTokens(refreshToken: string) {
  if (!refreshPromise) {
    const baseURL = apiClient.defaults.baseURL ?? ''
    refreshPromise = axios
      .post<AuthTokens>(`${baseURL}/auth/refresh`, { refreshToken })
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
    if (!axios.isAxiosError(error) || error.response?.status !== 401 || !error.config) {
      return Promise.reject(error)
    }

    const originalRequest = error.config as RetryableRequestConfig
    const refreshToken = getRefreshToken()
    const isRefreshRequest = originalRequest.url?.includes('/auth/refresh')

    if (originalRequest._retry || !refreshToken || isRefreshRequest) {
      clearAuthTokens()
      return Promise.reject(error)
    }

    originalRequest._retry = true

    try {
      const tokens = await requestNewTokens(refreshToken)
      originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`
      return apiClient(originalRequest)
    } catch (refreshError) {
      clearAuthTokens()
      return Promise.reject(refreshError)
    }
  },
)
