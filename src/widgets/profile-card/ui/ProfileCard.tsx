import { useNavigate } from '@tanstack/react-router'
import type { UserProfile } from '@/entities/user/api'
import badge1Url from '@/shared/assets/profile-badge-1.png'
import badge2Url from '@/shared/assets/profile-badge-2.png'
import badge3Url from '@/shared/assets/profile-badge-3.png'
import badge4Url from '@/shared/assets/profile-badge-4.png'
import badge5Url from '@/shared/assets/profile-badge-5.png'
import badge6Url from '@/shared/assets/profile-badge-6.png'
import characterUrl from '@/shared/assets/profile-character.jpg'
import { paths } from '@/shared/config'

import * as S from './ProfileCard.styles'

type ProfileCardProps = {
  onEdit?: () => void
  profile: UserProfile
}

export function ProfileCard({ onEdit, profile }: ProfileCardProps) {
  const navigate = useNavigate()
  const badges = [
    badge1Url,
    badge2Url,
    badge1Url,
    badge2Url,
    badge3Url,
    badge4Url,
    badge3Url,
    badge4Url,
    badge5Url,
    badge6Url,
    badge5Url,
    badge6Url,
  ]

  return (
    <S.Card>
      <S.ProfileLine>
        <S.Avatar aria-label={`${profile.name} 프로필 사진`}>
          {profile.avatarUrl ? <img src={profile.avatarUrl} alt="" /> : null}
        </S.Avatar>
        <S.BasicInfo><h1>{profile.name}</h1><p>{profile.travelStyle}</p></S.BasicInfo>
        <S.EditButton
          type="button"
          onClick={() => onEdit ? onEdit() : navigate({ to: paths.profileEdit })}
        >
          프로필 수정
        </S.EditButton>
      </S.ProfileLine>
      <S.Body>
        <S.BadgePanel>
          <S.PanelTitle><div><h2>모든 배지</h2><p>획득한 배지와 앞으로 도전할 배지를 확인해보세요.</p></div><strong>8 / 12 획득</strong></S.PanelTitle>
          <S.BadgeGrid>
            {badges.map((badge, index) => (
              <S.BadgeItem
                key={`${badge}-${index}`}
                $cropRight={badge === badge6Url}
              >
                <img src={badge} alt={`여행 배지 ${index + 1}`} />
              </S.BadgeItem>
            ))}
          </S.BadgeGrid>
        </S.BadgePanel>
        <S.TypePanel>
          <h2>여행 타입 상세</h2>
          <img src={profile.characterImageUrl || characterUrl} alt={`${profile.characterName || '여행'} 캐릭터`} />
          <h3>{profile.characterName || '마트'}</h3>
          <span>{profile.travelStyle}</span>
          <S.TypeDescription><strong>{profile.characterName ? `${profile.characterName}의 여행 성향` : '즉흥적일 때의 경험을 좋아하는 코알라 마트'}</strong><p>{profile.bio}</p></S.TypeDescription>
        </S.TypePanel>
      </S.Body>
    </S.Card>
  )
}
