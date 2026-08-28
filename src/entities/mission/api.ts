import { apiClient } from '@/shared/libs/api-client'
import { requestWithMockFallback } from '@/shared/libs/api-fallback'

export type MissionResponseDto = {
  missionId?: number
  missionTitle?: string
  missionDescription?: string
  completed?: boolean
  missionCountry?: string
  missionCategory?: string
  missionPoint?: number
  imgUrl?: string
}

const MISSION_API_PATHS = {
  base: '/mission',
  completed: '/mission/completed',
  detail: (missionId: number) => `/mission/${missionId}`,
} as const

let mockMissions: MissionResponseDto[] = [
  { completed: false, missionCategory: '기록', missionDescription: '여행 사진과 코멘트를 남겨보세요.', missionId: 1, missionPoint: 10, missionTitle: '첫 여행 기록 남기기' },
  { completed: false, missionCategory: '탐험', missionDescription: '새로운 여행지를 찾아보세요.', missionId: 2, missionPoint: 20, missionTitle: '새로운 나라 방문하기' },
  { completed: true, missionCategory: '플래너', missionDescription: '친구와 여행 계획을 만들어보세요.', missionId: 3, missionPoint: 30, missionTitle: '여행 계획 완성하기' },
]

export async function getMissions(): Promise<MissionResponseDto[]> {
  return requestWithMockFallback(
    async () => {
      const { data } = await apiClient.get<MissionResponseDto[]>(MISSION_API_PATHS.base)
      return data
    },
    () => mockMissions,
  )
}

export async function getCompletedMissions(): Promise<MissionResponseDto[]> {
  return requestWithMockFallback(
    async () => {
      const { data } = await apiClient.get<MissionResponseDto[]>(MISSION_API_PATHS.completed)
      return data
    },
    () => mockMissions.filter((mission) => mission.completed),
  )
}

export async function completeMission(missionId: number): Promise<void> {
  await requestWithMockFallback(
    async () => { await apiClient.patch(MISSION_API_PATHS.detail(missionId)) },
    () => {
      mockMissions = mockMissions.map((mission) => mission.missionId === missionId ? { ...mission, completed: true } : mission)
    },
  )
}
