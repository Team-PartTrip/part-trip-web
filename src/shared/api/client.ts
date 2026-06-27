import axios from 'axios'

export const ACCESS_TOKEN_KEY = 'accessToken'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '',
  timeout: 100000,
  headers: {
    'Content-Type': 'application/json',
    // 무료 ngrok 도메인이 띄우는 브라우저 경고 페이지 우회
    'ngrok-skip-browser-warning': 'true',
  },
})

// 저장된 accessToken을 모든 요청 헤더에 자동 첨부
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY)

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})
