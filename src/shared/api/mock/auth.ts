import { ACCESS_TOKEN_KEY } from '../client'
import { MOCK_STORAGE_KEYS, waitForMock, writeMockStorage } from './storage'

type LoginPayload = {
  userId: string
  userPwd: string
}

type SignUpPayload = {
  email: string
  id: string
  password: string
}

type VerifyCodePayload = {
  code: string
  email: string
}

type ResetPasswordPayload = {
  confirmPassword: string
  email: string
  newPassword: string
}

const DEMO_ACCESS_TOKEN = 'parttrip-demo-access-token'

export async function loginMock({ userId, userPwd }: LoginPayload) {
  await waitForMock()

  if (!userId.trim() || !userPwd.trim()) {
    throw new Error('아이디와 비밀번호를 입력해주세요.')
  }

  writeMockStorage(MOCK_STORAGE_KEYS.session, { userId })
  return { accessToken: DEMO_ACCESS_TOKEN }
}

export async function googleLoginMock() {
  await waitForMock()
  writeMockStorage(MOCK_STORAGE_KEYS.session, { userId: 'google-demo' })
  return { accessToken: DEMO_ACCESS_TOKEN }
}

export async function signUpMock({ email, id }: SignUpPayload) {
  await waitForMock()
  writeMockStorage(MOCK_STORAGE_KEYS.profile, {
    bio: '새로운 여행을 준비하고 있습니다.',
    country: '대한민국',
    email,
    id,
    name: 'PartTrip 여행자',
    phone: '010-1234-5678',
    travelStyle: '균형 잡힌 탐험가',
  })
  return { ok: true as const }
}

export async function verifyCodeMock({ code }: VerifyCodePayload) {
  await waitForMock(300)
  if (!/^\d{6}$/.test(code)) {
    throw new Error('인증번호는 숫자 6자리로 입력해주세요.')
  }
  return { ok: true as const }
}

export async function resetPasswordMock({
  confirmPassword,
  newPassword,
}: ResetPasswordPayload) {
  await waitForMock()
  if (newPassword !== confirmPassword) {
    throw new Error('비밀번호가 일치하지 않습니다.')
  }
  return { ok: true as const }
}

export async function logoutMock() {
  await waitForMock(250)
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(MOCK_STORAGE_KEYS.session)
  return { ok: true as const }
}
