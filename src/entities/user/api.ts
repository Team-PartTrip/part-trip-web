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

export type TravelPreferenceResponseDto = Partial<TravelPreferenceRequestDto> & {
  home?: { name: string; address: string; latitude: number; longitude: number } | null
}

export type HomeRequestDto = { name: string; address?: string; latitude: number; longitude: number }

export type ProfileStatsResponseDto = {
  tripCount?: number
  regionCount?: number
  recordCount?: number
}

const PROFILE_API_PATHS = {
  base: '/profile',
  image: '/profile/image',
  mine: '/profile/myInfo',
  travelPreferences: '/profile/travel-preferences',
  home: '/profile/home',
  stats: '/profile/stats',
} as const

export async function getProfile(): Promise<ProfileResponseDto> {
  const { data } = await apiClient.get<ProfileResponseDto>(PROFILE_API_PATHS.mine)
  return data
}

export async function getProfileStats(): Promise<ProfileStatsResponseDto> {
  const { data } = await apiClient.get<ProfileStatsResponseDto>(PROFILE_API_PATHS.stats)
  return data
}

export async function updateProfile(payload: ProfileUpdateRequestDto): Promise<ProfileResponseDto> {
  const { data } = await apiClient.put<ProfileResponseDto>(PROFILE_API_PATHS.base, payload)
  return data
}

export async function deleteProfile(): Promise<void> {
  await apiClient.delete(PROFILE_API_PATHS.base)
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

export async function updateHome(payload: HomeRequestDto): Promise<void> {
  await apiClient.put(PROFILE_API_PATHS.home, payload)
}

export async function deleteHome(): Promise<void> {
  await apiClient.delete(PROFILE_API_PATHS.home)
}
