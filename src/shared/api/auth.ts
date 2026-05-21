import { apiClient } from './client'

type VerificationPurpose = 'sign-up' | 'change-password'

type EmptySuccessResponse = {
  ok: true
}

type LoginResponse = {
  accessToken: string
}

export type LoginRequest = {
  id: string
  password: string
}

export type SendVerificationCodeRequest = {
  email: string
  purpose: VerificationPurpose
}

export type VerifyCodeRequest = {
  code: string
  email: string
  purpose: VerificationPurpose
}

export type SignUpRequest = {
  code: string
  email: string
  id: string
  password: string
  phoneNumber: string
}

export type ResetPasswordRequest = {
  code: string
  email: string
  newPassword: string
}

const authEndpoints = {
  login: '',
  resetPassword: '',
  sendVerificationCode: '',
  signUp: '/auth',
  verifyCode: '',
} as const

async function postOrMock<TResponse>(
  endpoint: string,
  payload: unknown,
  mockResponse: TResponse,
) {
  if (!endpoint) {
    return mockResponse
  }

  const { data } = await apiClient.post<TResponse>(endpoint, payload)
  return data
}

export async function login(payload: LoginRequest) {
  return postOrMock<LoginResponse>(authEndpoints.login, payload, {
    accessToken: '',
  })
}

export async function sendVerificationCode(
  payload: SendVerificationCodeRequest,
) {
  return postOrMock<EmptySuccessResponse>(
    authEndpoints.sendVerificationCode,
    payload,
    { ok: true },
  )
}

export async function verifyCode(payload: VerifyCodeRequest) {
  return postOrMock<EmptySuccessResponse>(authEndpoints.verifyCode, payload, {
    ok: true,
  })
}

export async function signUp(payload: SignUpRequest) {
  return postOrMock<EmptySuccessResponse>(authEndpoints.signUp, payload, {
    ok: true,
  })
}

export async function resetPassword(payload: ResetPasswordRequest) {
  return postOrMock<EmptySuccessResponse>(
    authEndpoints.resetPassword,
    payload,
    { ok: true },
  )
}
