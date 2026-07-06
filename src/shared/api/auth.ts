import { apiClient } from './client'
import { runtimeConfig } from '@shared/config'
import {
  googleLoginMock,
  loginMock,
  logoutMock,
  resetPasswordMock,
  signUpMock,
  verifyCodeMock,
} from './mock'

// === Swagger DTO Types ===

export type SignUpRequestDto = {
  userId: string
  userPwd: string
  userMail: string
  signUpDivision: string
  myCountry: string
}

export type RefreshRequestDto = {
  refreshToken: string
}

export type TokenResponseDto = {
  accessToken: string
  refreshToken: string
  surveyCompleted?: boolean
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

export type UserEntity = {
  userId: string
  userPwd?: string
  userMail: string
  signUpDivision: string
  nickName?: string
  myCountry: string
  createDate?: string
  surveyCompleted?: boolean
  imgUrl?: string
  characterId?: string
  userLevel?: number
  characterPoint?: number
}

// === Legacy Type Aliases for Backward Compatibility ===
export type EmptySuccessResponse = {
  ok: true
}

export type LoginResponse = TokenResponseDto

export type LoginRequest = LoginRequestDto

export type SendVerificationCodeRequest = EmailSendRequestDto

export type VerifyCodeRequest = EmailVerifyRequestDto

export type SignUpRequest = {
  email: string
  id: string
  password: string
}

export type ResetPasswordRequest = PasswordResetRequestDto

// === API Paths ===
const AUTH_API_PATHS = {
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
  if (runtimeConfig.useMockApi) {
    const mockRes = await loginMock(payload)
    return {
      accessToken: mockRes.accessToken,
      refreshToken: 'mock-refresh-token',
    }
  }
  return post<TokenResponseDto>(AUTH_API_PATHS.session.login, payload)
}

export async function googleLogin(payload: GoogleLoginRequestDto): Promise<TokenResponseDto> {
  if (runtimeConfig.useMockApi) {
    const mockRes = await googleLoginMock()
    return {
      accessToken: mockRes.accessToken,
      refreshToken: 'mock-refresh-token',
    }
  }
  return post<TokenResponseDto>(AUTH_API_PATHS.session.google, payload)
}

export async function sendVerificationCode(payload: EmailSendRequestDto): Promise<string> {
  if (runtimeConfig.useMockApi) return 'success'
  return post<string>(AUTH_API_PATHS.email.sendCode, payload)
}

export async function verifyCode(payload: EmailVerifyRequestDto): Promise<UserEntity> {
  if (runtimeConfig.useMockApi) {
    await verifyCodeMock(payload)
    return {
      userId: 'mock-user',
      userMail: payload.email,
      signUpDivision: 'USER',
      myCountry: 'KR',
    }
  }
  return post<UserEntity>(AUTH_API_PATHS.email.verifyCode, payload)
}

export async function sendPasswordResetCode(payload: EmailSendRequestDto): Promise<string> {
  if (runtimeConfig.useMockApi) return 'success'
  return post<string>(AUTH_API_PATHS.password.sendCode, payload)
}

export async function verifyPasswordResetCode(payload: EmailVerifyRequestDto): Promise<string> {
  if (runtimeConfig.useMockApi) {
    await verifyCodeMock(payload)
    return 'success'
  }
  return post<string>(AUTH_API_PATHS.password.verifyCode, payload)
}

export async function signUp(payload: SignUpRequest | SignUpRequestDto): Promise<string> {
  if (runtimeConfig.useMockApi) {
    if ('id' in payload) {
      await signUpMock(payload)
    } else {
      await signUpMock({
        email: payload.userMail,
        id: payload.userId,
        password: payload.userPwd,
      })
    }
    return 'success'
  }

  // DTO 형식인 경우 그대로 전송, Legacy 형식인 경우 변환해서 전송
  if ('userId' in payload) {
    return post<string>(AUTH_API_PATHS.signUp, payload)
  } else {
    const { email, id, password } = payload
    return post<string>(AUTH_API_PATHS.signUp, {
      myCountry: 'KR',
      signUpDivision: 'USER',
      userId: id,
      userMail: email,
      userPwd: password,
    } satisfies SignUpRequestDto)
  }
}

export async function resetPassword(payload: PasswordResetRequestDto): Promise<string> {
  if (runtimeConfig.useMockApi) {
    await resetPasswordMock(payload)
    return 'success'
  }
  return post<string>(AUTH_API_PATHS.password.reset, payload)
}

export async function logout(payload?: LogoutRequestDto): Promise<string> {
  if (runtimeConfig.useMockApi) {
    await logoutMock()
    return 'success'
  }
  return post<string>(AUTH_API_PATHS.session.logout, payload ?? { refreshToken: '' })
}

export async function refresh(payload: RefreshRequestDto): Promise<TokenResponseDto> {
  if (runtimeConfig.useMockApi) {
    return {
      accessToken: 'mock-new-access-token',
      refreshToken: payload.refreshToken,
    }
  }
  return post<TokenResponseDto>(AUTH_API_PATHS.session.refresh, payload)
}
