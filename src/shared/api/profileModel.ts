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
  bio: string
  characterImageUrl?: string
  characterName?: string
  country: string
  email: string
  id: string
  name: string
  phone: string
  travelStyle: string
}

const fallbackProfile = {
  bio: '낯선 도시의 일상과 문화를 천천히 경험하는 여행을 좋아합니다.',
  country: '대한민국',
  email: 'parttrip@example.com',
  id: 'parttrip01',
  name: '김파트',
  phone: '010-1234-5678',
  travelStyle: '계획적인 문화 탐험가',
}

export function toUserProfile(
  profile: ProfileSource,
  character?: CharacterSource,
): UserProfile {
  return {
    ...fallbackProfile,
    avatarUrl: profile.imgUrl || undefined,
    bio: character?.characterDescription || fallbackProfile.bio,
    characterImageUrl: character?.imgUrl,
    characterName: character?.characterName,
    id: profile.userId || fallbackProfile.id,
    name: profile.nickName || fallbackProfile.name,
    travelStyle: character?.characterType || fallbackProfile.travelStyle,
  }
}
