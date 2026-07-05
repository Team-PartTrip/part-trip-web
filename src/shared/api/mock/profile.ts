import { MOCK_STORAGE_KEYS, readMockStorage, waitForMock, writeMockStorage } from './storage'

export type UserProfile = {
  bio: string
  country: string
  email: string
  id: string
  name: string
  phone: string
  travelStyle: string
}

export const defaultUserProfile: UserProfile = {
  bio: '낯선 도시의 일상과 문화를 천천히 경험하는 여행을 좋아합니다.',
  country: '대한민국',
  email: 'parttrip@example.com',
  id: 'parttrip01',
  name: '김파트',
  phone: '010-1234-5678',
  travelStyle: '계획적인 문화 탐험가',
}

export async function getProfileMock() {
  await waitForMock()
  return readMockStorage(MOCK_STORAGE_KEYS.profile, defaultUserProfile)
}

export async function updateProfileMock(profile: UserProfile) {
  await waitForMock()
  return writeMockStorage(MOCK_STORAGE_KEYS.profile, profile)
}
