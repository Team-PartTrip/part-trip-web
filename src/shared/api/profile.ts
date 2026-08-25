import { apiClient } from '../libs/api-client.ts'

export type ProfileUpdateRequestDto = {
  imgUrl?: string
  nickName: string
}

export type ProfileResponseDto = {
  imgUrl?: string
  nickName?: string
  userId?: string
}

export type CharacterInfoResponseDto = {
  characterDescription?: string
  characterName?: string
  characterType?: string
  imgUrl?: string
}

const PROFILE_API_PATHS = {
  base: '/profile',
  character: '/profile/character',
  mine: '/profile/myInfo',
} as const

export async function getProfile(): Promise<ProfileResponseDto> {
  const { data } = await apiClient.get<ProfileResponseDto>(PROFILE_API_PATHS.mine)
  return data
}

export async function updateProfile(payload: ProfileUpdateRequestDto): Promise<ProfileResponseDto> {
  const { data } = await apiClient.put<ProfileResponseDto>(PROFILE_API_PATHS.base, payload)
  return data
}

export async function getCharacterInfo(): Promise<CharacterInfoResponseDto> {
  const { data } = await apiClient.get<CharacterInfoResponseDto>(PROFILE_API_PATHS.character)
  return data
}
