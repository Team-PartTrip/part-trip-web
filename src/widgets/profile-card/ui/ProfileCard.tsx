import { useNavigate } from 'react-router-dom'
import type { UserProfile } from '@shared/api'
import badge1Url from '@shared/assets/profile-badge-1.png'
import badge2Url from '@shared/assets/profile-badge-2.png'
import badge3Url from '@shared/assets/profile-badge-3.png'
import badge4Url from '@shared/assets/profile-badge-4.png'
import badge5Url from '@shared/assets/profile-badge-5.png'
import badge6Url from '@shared/assets/profile-badge-6.png'
import characterUrl from '@shared/assets/profile-character.jpg'
import { paths } from '@shared/config'

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
        <S.Avatar aria-hidden="true" />
        <S.BasicInfo><h1>{profile.name}</h1><p>{profile.travelStyle}</p></S.BasicInfo>
        <S.EditButton
          type="button"
          onClick={() => onEdit ? onEdit() : navigate(paths.profileEdit)}
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
          <img src={characterUrl} alt="마트 여행 캐릭터" />
          <h3>마트</h3>
          <span>즉흥 경험형 코알라</span>
          <S.TypeDescription><strong>즉흥적일 때의 경험을 좋아하는 코알라 마트</strong><p>마트는 궁금증이 많은 친구예요!</p><p>“저건 뭐지?”라는 생각이 들면 바로 발걸음을 옮기는 행동파! 낯선 풍경과 새로운 이야기를 발견할 때 가장 행복해지는 여행 메이트랍니다.</p></S.TypeDescription>
        </S.TypePanel>
      </S.Body>
    </S.Card>
  )
}
