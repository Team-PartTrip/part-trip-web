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

const MISSION_API_UNAVAILABLE = '최신 API 명세서에 미션 API가 없습니다.'

export async function getMissions(): Promise<MissionResponseDto[]> {
  throw new Error(MISSION_API_UNAVAILABLE)
}

export async function getCompletedMissions(): Promise<MissionResponseDto[]> {
  throw new Error(MISSION_API_UNAVAILABLE)
}

export async function completeMission(_missionId: number): Promise<void> {
  void _missionId
  throw new Error(MISSION_API_UNAVAILABLE)
}
