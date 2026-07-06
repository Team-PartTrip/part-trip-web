import { apiClient } from './client'
import { getProfileMock, updateProfileMock } from './mock'
import { runtimeConfig } from '@shared/config'

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
  if (runtimeConfig.useMockApi) {
    const profile = await getProfileMock()
    return { imgUrl: profile.avatarUrl, nickName: profile.name, userId: profile.id }
  }
  const { data } = await apiClient.get<ProfileResponseDto>(PROFILE_API_PATHS.mine)
  return data
}

export async function updateProfile(payload: ProfileUpdateRequestDto): Promise<ProfileResponseDto> {
  if (runtimeConfig.useMockApi) {
    const profile = await getProfileMock()
    const updated = await updateProfileMock({
      ...profile,
      avatarUrl: payload.imgUrl,
      name: payload.nickName,
    })
    return { imgUrl: updated.avatarUrl, nickName: updated.name, userId: updated.id }
  }
  const { data } = await apiClient.put<ProfileResponseDto>(PROFILE_API_PATHS.base, payload)
  return data
}

export async function getCharacterInfo(): Promise<CharacterInfoResponseDto> {
  if (runtimeConfig.useMockApi) {
    return {
      characterDescription: '궁금한 곳을 발견하면 바로 움직이는 행동파 여행자입니다.',
      characterName: '마트',
      characterType: '즉흥 경험형 코알라',
    }
  }
  const { data } = await apiClient.get<CharacterInfoResponseDto>(PROFILE_API_PATHS.character)
  return data
}
