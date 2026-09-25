import { apiClient } from '../../shared/libs/api-client.ts'

export type ProfileUpdateRequestDto = {
  imgUrl?: string
  nickName: string
}

export type ProfileResponseDto = {
  imgUrl?: string | null
  nickName: string
  userId: string
}

export type TravelPreferenceRequestDto = {
  preferredTransport: 'WALKING' | 'PUBLIC_TRANSIT' | 'TAXI' | 'CAR'
  dailyScheduleCount: number
  canUseStairs: boolean
}

export type TravelPreferenceResponseDto = Partial<TravelPreferenceRequestDto>

const PROFILE_API_PATHS = {
  base: '/profile',
  image: '/profile/image',
  mine: '/profile/myInfo',
  travelPreferences: '/profile/travel-preferences',
} as const

export async function getProfile(): Promise<ProfileResponseDto> {
  const { data } = await apiClient.get<ProfileResponseDto>(PROFILE_API_PATHS.mine)
  return data
}

export async function updateProfile(payload: ProfileUpdateRequestDto): Promise<ProfileResponseDto> {
  const { data } = await apiClient.put<ProfileResponseDto>(PROFILE_API_PATHS.base, payload)
  return data
}

export async function uploadProfileImage(file: File): Promise<string> {
  const { data } = await apiClient.postForm<string>(PROFILE_API_PATHS.image, { file })
  return data
}

export async function getTravelPreferences(): Promise<TravelPreferenceResponseDto> {
  const { data } = await apiClient.get<TravelPreferenceResponseDto>(PROFILE_API_PATHS.travelPreferences)
  return data
}

export async function updateTravelPreferences(payload: TravelPreferenceRequestDto): Promise<TravelPreferenceResponseDto> {
  const { data } = await apiClient.put<TravelPreferenceResponseDto>(PROFILE_API_PATHS.travelPreferences, payload)
  return data
}
