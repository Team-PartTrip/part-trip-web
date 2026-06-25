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

const authEndpoints = {
  login: {
    method: 'post',
    path: '/auth/login',
  },
  resetPassword: {
    method: 'post',
    path: '/auth/password/reset',
  },
  sendPasswordResetCode: {
    method: 'post',
    path: '/auth/password/send-code',
  },
  sendVerificationCode: {
    method: 'post',
    path: '/auth/email/send',
  },
  signUp: {
    method: 'post',
    path: '/auth/signup',
  },
  verifyCode: {
    method: 'post',
    path: '/auth/email/verify',
  },
  verifyPasswordResetCode: {
    method: 'post',
    path: '/auth/password/verify-code',
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

export async function sendPasswordResetCode(
  payload: SendVerificationCodeRequest,
) {
  return request<EmptySuccessResponse>(
    authEndpoints.sendPasswordResetCode,
    payload,
  )
}

export async function verifyPasswordResetCode(payload: VerifyCodeRequest) {
  return request<EmptySuccessResponse>(
    authEndpoints.verifyPasswordResetCode,
    payload,
  )
}

export async function signUp(payload: SignUpRequest) {
  const { email, id, password } = payload

  return request<EmptySuccessResponse>(authEndpoints.signUp, {
    myCountry: 'KR',
    signUpDivision: 'USER',
    userId: id,
    userMail: email,
    userPwd: password,
  } satisfies SignUpPayload)
}

export async function resetPassword(payload: ResetPasswordRequest) {
  return request<EmptySuccessResponse>(authEndpoints.resetPassword, payload)
}
