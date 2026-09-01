import { getProfile, type ProfileResponseDto } from './api.ts'
import { resolveApiAssetUrl } from '../../shared/libs/api-client.ts'

export type UserProfile = {
  avatarUrl?: string
  id?: string
  name: string
}

export function toUserProfile(profile: ProfileResponseDto): UserProfile {
  return {
    avatarUrl: resolveApiAssetUrl(profile.imgUrl),
    id: profile.userId,
    name: profile.nickName ?? '',
  }
}

export async function getUserProfile(): Promise<UserProfile> {
  return toUserProfile(await getProfile())
}
