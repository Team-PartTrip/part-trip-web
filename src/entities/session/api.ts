import { apiClient } from '@/shared/libs/api-client'

export * from '@/shared/libs/token-storage'

export type TokenResponseDto = {
  accessToken: string
  refreshToken: string
}

export type LogoutRequestDto = {
  refreshToken: string
}

export type GoogleLoginRequestDto = {
  idToken?: string
  code?: string
}

export type KakaoLoginRequestDto = {
  accessToken?: string
  code?: string
  redirectUri?: string
}

// === API Paths ===
const AUTH_API_PATHS = {
  session: {
    google: '/auth/google',
    kakao: '/auth/kakao',
    logout: '/auth/logout',
  },
} as const

// Helper POST
async function post<TResponse>(path: string, payload: unknown) {
  const { data } = await apiClient.post<TResponse>(path, payload)
  return data
}

export async function googleLogin(payload: GoogleLoginRequestDto): Promise<TokenResponseDto> {
  return post<TokenResponseDto>(AUTH_API_PATHS.session.google, payload)
}

export async function kakaoLogin(payload: KakaoLoginRequestDto): Promise<TokenResponseDto> {
  return post<TokenResponseDto>(AUTH_API_PATHS.session.kakao, payload)
}

export async function logout(payload: LogoutRequestDto): Promise<string> {
  const { data } = await apiClient.post<string>(AUTH_API_PATHS.session.logout, payload)
  return data
}
