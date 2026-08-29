import { apiClient } from '@/shared/libs/api-client'

export * from '@/shared/libs/token-storage'

// === Swagger DTO Types ===

export type SignUpRequestDto = {
  phoneNumber: string
  userId: string
  userPwd: string
  userMail: string
  signUpDivision?: string
  myCountry?: string
}

export type RefreshRequestDto = {
  refreshToken: string
}

export type TokenResponseDto = {
  accessToken: string
  refreshToken: string
}

export type EmailVerifyRequestDto = {
  email: string
  code: string
}

export type EmailSendRequestDto = {
  email: string
}

export type PasswordResetRequestDto = {
  email: string
  newPassword: string
  confirmPassword: string
}

export type LogoutRequestDto = {
  refreshToken: string
}

export type LoginRequestDto = {
  userId: string
  userPwd: string
}

export type GoogleLoginRequestDto = {
  idToken?: string
  code?: string
}

export type CheckUserIdResponseDto = Record<string, boolean>

export type UserEntity = {
  userId: string
  userPwd?: string
  userMail: string
  phoneNumber?: string
  signUpDivision: string
  nickName?: string
  myCountry: string
  createDate?: string
  imgUrl?: string
  characterId?: string
  userLevel?: number
  characterPoint?: number
}

// === API Paths ===
const AUTH_API_PATHS = {
  checkId: '/auth/check-id',
  email: {
    sendCode: '/auth/email/send',
    verifyCode: '/auth/email/verify',
  },
  password: {
    reset: '/auth/password/reset',
    sendCode: '/auth/password/send-code',
    verifyCode: '/auth/password/verify-code',
  },
  session: {
    login: '/auth/login',
    google: '/auth/google',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
  },
  signUp: '/auth/signup',
} as const

// Helper POST
async function post<TResponse>(path: string, payload: unknown) {
  const { data } = await apiClient.post<TResponse>(path, payload)
  return data
}

// === API Functions ===

export async function login(payload: LoginRequestDto): Promise<TokenResponseDto> {
  return post<TokenResponseDto>(AUTH_API_PATHS.session.login, payload)
}

export async function googleLogin(payload: GoogleLoginRequestDto): Promise<TokenResponseDto> {
  return post<TokenResponseDto>(AUTH_API_PATHS.session.google, payload)
}

export async function sendVerificationCode(payload: EmailSendRequestDto): Promise<string> {
  return post<string>(AUTH_API_PATHS.email.sendCode, payload)
}

export async function verifyCode(payload: EmailVerifyRequestDto): Promise<UserEntity> {
  return post<UserEntity>(AUTH_API_PATHS.email.verifyCode, payload)
}

export async function sendPasswordResetCode(payload: EmailSendRequestDto): Promise<string> {
  return post<string>(AUTH_API_PATHS.password.sendCode, payload)
}

export async function verifyPasswordResetCode(payload: EmailVerifyRequestDto): Promise<string> {
  return post<string>(AUTH_API_PATHS.password.verifyCode, payload)
}

export async function signUp(payload: SignUpRequestDto): Promise<string> {
  return post<string>(AUTH_API_PATHS.signUp, payload)
}

export async function resetPassword(payload: PasswordResetRequestDto): Promise<string> {
  return post<string>(AUTH_API_PATHS.password.reset, payload)
}

export async function logout(payload?: LogoutRequestDto): Promise<string> {
  return post<string>(AUTH_API_PATHS.session.logout, payload ?? { refreshToken: '' })
}

export async function refresh(payload: RefreshRequestDto): Promise<TokenResponseDto> {
  return post<TokenResponseDto>(AUTH_API_PATHS.session.refresh, payload)
}

export async function checkUserId(userId: string): Promise<CheckUserIdResponseDto> {
  const { data } = await apiClient.get<CheckUserIdResponseDto>(AUTH_API_PATHS.checkId, { params: { userId } })
  return data
}
