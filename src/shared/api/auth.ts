import { apiClient } from './client'

type VerificationPurpose = 'sign-up' | 'change-password'
type HttpMethod = 'delete' | 'get' | 'patch' | 'post' | 'put'

type ApiEndpoint = {
  method: HttpMethod
  path: string
}

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
  login: {
    method: 'post',
    path: '',
  },
  resetPassword: {
    method: 'post',
    path: '',
  },
  sendVerificationCode: {
    method: 'post',
    path: '',
  },
  signUp: {
    method: 'post',
    path: '/auth',
  },
  verifyCode: {
    method: 'post',
    path: '',
  },
} as const satisfies Record<string, ApiEndpoint>

async function request<TResponse>(endpoint: ApiEndpoint, payload: unknown) {
  if (!endpoint.path) {
    throw new Error('API endpoint path is not configured.')
  }

  const { data } = await apiClient.request<TResponse>({
    data: endpoint.method === 'get' ? undefined : payload,
    method: endpoint.method,
    params: endpoint.method === 'get' ? payload : undefined,
    url: endpoint.path,
  })
  return data
}

export async function login(payload: LoginRequest) {
  return request<LoginResponse>(authEndpoints.login, payload)
}

export async function sendVerificationCode(
  payload: SendVerificationCodeRequest,
) {
  return request<EmptySuccessResponse>(
    authEndpoints.sendVerificationCode,
    payload,
  )
}

export async function verifyCode(payload: VerifyCodeRequest) {
  return request<EmptySuccessResponse>(authEndpoints.verifyCode, payload)
}

export async function signUp(payload: SignUpRequest) {
  return request<EmptySuccessResponse>(authEndpoints.signUp, payload)
}

export async function resetPassword(payload: ResetPasswordRequest) {
  return request<EmptySuccessResponse>(authEndpoints.resetPassword, payload)
}
