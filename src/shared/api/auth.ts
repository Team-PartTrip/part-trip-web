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

type EmptySuccessResponse = {
  ok: true
}

type LoginResponse = {
  accessToken: string
}

export type LoginRequest = {
  userId: string
  userPwd: string
}

export type SendVerificationCodeRequest = {
  email: string
}

export type VerifyCodeRequest = {
  code: string
  email: string
}

export type SignUpRequest = {
  email: string
  id: string
  password: string
}

type SignUpPayload = {
  myCountry: string
  signUpDivision: string
  userId: string
  userMail: string
  userPwd: string
}

export type ResetPasswordRequest = {
  confirmPassword: string
  email: string
  newPassword: string
}

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
  },
  signUp: '/auth/signup',
} as const

async function post<TResponse>(path: string, payload: unknown) {
  const { data } = await apiClient.post<TResponse>(path, payload)

  return data
}

export async function login(payload: LoginRequest) {
  if (runtimeConfig.useMockApi) return loginMock(payload)
  return post<LoginResponse>(AUTH_API_PATHS.session.login, payload)
}

export type GoogleLoginRequest = {
  code: string
}

export async function googleLogin(payload: GoogleLoginRequest) {
  if (runtimeConfig.useMockApi) return googleLoginMock()
  return post<LoginResponse>(AUTH_API_PATHS.session.google, payload)
}

export async function sendVerificationCode(
  payload: SendVerificationCodeRequest,
) {
  if (runtimeConfig.useMockApi) return { ok: true as const }
  return post<EmptySuccessResponse>(AUTH_API_PATHS.email.sendCode, payload)
}

export async function verifyCode(payload: VerifyCodeRequest) {
  if (runtimeConfig.useMockApi) return verifyCodeMock(payload)
  return post<EmptySuccessResponse>(AUTH_API_PATHS.email.verifyCode, payload)
}

export async function sendPasswordResetCode(
  payload: SendVerificationCodeRequest,
) {
  if (runtimeConfig.useMockApi) return { ok: true as const }
  return post<EmptySuccessResponse>(AUTH_API_PATHS.password.sendCode, payload)
}

export async function verifyPasswordResetCode(payload: VerifyCodeRequest) {
  if (runtimeConfig.useMockApi) return verifyCodeMock(payload)
  return post<EmptySuccessResponse>(AUTH_API_PATHS.password.verifyCode, payload)
}

export async function signUp(payload: SignUpRequest) {
  if (runtimeConfig.useMockApi) return signUpMock(payload)
  const { email, id, password } = payload

  return post<EmptySuccessResponse>(AUTH_API_PATHS.signUp, {
    myCountry: 'KR',
    signUpDivision: 'USER',
    userId: id,
    userMail: email,
    userPwd: password,
  } satisfies SignUpPayload)
}

export async function resetPassword(payload: ResetPasswordRequest) {
  if (runtimeConfig.useMockApi) return resetPasswordMock(payload)
  return post<EmptySuccessResponse>(AUTH_API_PATHS.password.reset, payload)
}

export async function logout() {
  if (runtimeConfig.useMockApi) return logoutMock()
  return post<EmptySuccessResponse>('/auth/logout', {})
}
