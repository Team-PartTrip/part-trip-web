import { createUnsupportedApiError } from '@/shared/libs/unsupported-api-error'

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

export async function getMissions(): Promise<MissionResponseDto[]> {
  throw createUnsupportedApiError('미션')
}

export async function getCompletedMissions(): Promise<MissionResponseDto[]> {
  throw createUnsupportedApiError('미션')
}

export async function completeMission(_missionId: number): Promise<void> {
  void _missionId
  throw createUnsupportedApiError('미션')
}
