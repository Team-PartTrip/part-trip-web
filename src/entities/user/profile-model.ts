type ProfileSource = {
  imgUrl?: string
  nickName?: string
  userId?: string
}

type CharacterSource = {
  characterDescription?: string
  characterName?: string
  characterType?: string
  imgUrl?: string
}

export type UserProfile = {
  avatarUrl?: string
  bio?: string
  characterImageUrl?: string
  characterName?: string
  country?: string
  email?: string
  id?: string
  name: string
  phone?: string
  travelStyle?: string
}

export function toUserProfile(
  profile: ProfileSource,
  character?: CharacterSource,
): UserProfile {
  return {
    avatarUrl: profile.imgUrl,
    bio: character?.characterDescription,
    characterImageUrl: character?.imgUrl,
    characterName: character?.characterName,
    id: profile.userId,
    name: profile.nickName ?? '',
    travelStyle: character?.characterType,
  }
}

export async function getUserProfile(): Promise<UserProfile> {
  const [profile, character] = await Promise.all([
    getProfile(),
    getCharacterInfo().catch(() => undefined),
  ])
  return toUserProfile(profile, character)
}
import { getCharacterInfo, getProfile } from './api.ts'
