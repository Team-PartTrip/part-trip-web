import { apiClient } from '@/shared/libs/api-client'

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

export async function getMissions(): Promise<MissionResponseDto[]> {
  const { data } = await apiClient.get<MissionResponseDto[]>(MISSION_API_PATHS.base)
  return data
}

export async function getCompletedMissions(): Promise<MissionResponseDto[]> {
  const { data } = await apiClient.get<MissionResponseDto[]>(MISSION_API_PATHS.completed)
  return data
}

export async function completeMission(missionId: number): Promise<void> {
  await apiClient.patch(MISSION_API_PATHS.detail(missionId))
}
