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

export type ProfileStatsResponseDto = {
  countryCount: number
  recordCount: number
  tripCount: number
}

const PROFILE_API_PATHS = {
  base: '/profile',
  image: '/profile/image',
  mine: '/profile/myInfo',
  stats: '/profile/stats',
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

export async function getProfileStats(): Promise<ProfileStatsResponseDto> {
  const { data } = await apiClient.get<ProfileStatsResponseDto>(PROFILE_API_PATHS.stats)
  return data
}
