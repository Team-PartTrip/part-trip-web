import { apiClient } from './client'

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
}

export type VerifyCodeRequest = {
  code: string
  email: string
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
    path: '/auth/email/send',
  },
  signUp: {
    method: 'post',
    path: '/auth/sign-up',
  },
  verifyCode: {
    method: 'post',
    path: '/auth/email/verify',
  },
} as const satisfies Record<string, ApiEndpoint>

async function request<TResponse>(endpoint: ApiEndpoint, payload: unknown) {
  if (!endpoint.path) {
    throw new Error('API endpoint path is not configured.')
  }

  const { data } = await (async () => {
    switch (endpoint.method) {
      case 'delete':
        return apiClient.delete<TResponse>(endpoint.path, { data: payload })
      case 'get':
        return apiClient.get<TResponse>(endpoint.path, { params: payload })
      case 'patch':
        return apiClient.patch<TResponse>(endpoint.path, payload)
      case 'post':
        return apiClient.post<TResponse>(endpoint.path, payload)
      case 'put':
        return apiClient.put<TResponse>(endpoint.path, payload)
    }
  })()
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
