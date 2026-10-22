import { getProfile, type ProfileResponseDto } from './api.ts'
import { resolveApiAssetUrl } from '../../shared/libs/api-client.ts'

export type UserProfile = {
  email?: string
  avatarUrl?: string
  imgUrl?: string
  id?: string
  name: string
}

export function toUserProfile(profile: ProfileResponseDto): UserProfile {
  return {
    email: profile.email?.trim() || (profile.userId.includes('@') ? profile.userId : undefined),
    avatarUrl: resolveApiAssetUrl(profile.imgUrl),
    imgUrl: profile.imgUrl ?? undefined,
    id: profile.userId,
    name: profile.nickName ?? '',
  }
}

export async function getUserProfile(): Promise<UserProfile> {
  return toUserProfile(await getProfile())
}
