import { apiClient } from '../../shared/libs/api-client.ts'
import { requestWithMockFallback } from '../../shared/libs/api-fallback.ts'

export type ProfileUpdateRequestDto = {
  imgUrl?: string
  nickName: string
  themeId?: number
}

export type ProfileResponseDto = {
  imgUrl?: string
  nickName?: string
  themeDescription?: string
  themeId?: number
  themeName?: string
  userId?: string
}

export type TravelThemeResponseDto = {
  description?: string
  imageUrl?: string
  themeCode?: string
  themeId?: number
  themeName?: string
}

export type ProfileStatsResponseDto = {
  countryCount?: number
  recordCount?: number
  tripCount?: number
}

const PROFILE_API_PATHS = {
  base: '/profile',
  image: '/profile/image',
  mine: '/profile/myInfo',
  stats: '/profile/stats',
  themes: '/profile/themes',
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

export async function getTravelThemes(): Promise<TravelThemeResponseDto[]> {
  const { data } = await apiClient.get<TravelThemeResponseDto[]>(PROFILE_API_PATHS.themes)
  return data
}

export async function getProfileStats(): Promise<ProfileStatsResponseDto | undefined> {
  return requestWithMockFallback(
    async () => {
      const { data } = await apiClient.get<ProfileStatsResponseDto>(PROFILE_API_PATHS.stats)
      return data
    },
    () => undefined,
  )
}
