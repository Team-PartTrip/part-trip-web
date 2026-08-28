import { getProfile, getTravelThemes, type ProfileResponseDto, type TravelThemeResponseDto } from './api.ts'
import { resolveApiAssetUrl } from '../../shared/libs/api-client.ts'

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
  themeId?: number
  travelStyle?: string
}

export function toUserProfile(
  profile: ProfileResponseDto,
  theme?: TravelThemeResponseDto,
): UserProfile {
  const themeName = theme?.themeName ?? profile.themeName
  const themeDescription = theme?.description ?? profile.themeDescription
  return {
    avatarUrl: resolveApiAssetUrl(profile.imgUrl),
    bio: themeDescription,
    characterImageUrl: resolveApiAssetUrl(theme?.imageUrl),
    characterName: themeName,
    id: profile.userId,
    name: profile.nickName ?? '',
    themeId: profile.themeId ?? theme?.themeId,
    travelStyle: theme?.themeCode ?? themeName,
  }
}

export async function getUserProfile(): Promise<UserProfile> {
  const [profile, themes] = await Promise.all([
    getProfile(),
    getTravelThemes().catch(() => []),
  ])
  const theme = themes.find((item) => item.themeId === profile.themeId)
  return toUserProfile(profile, theme)
}
