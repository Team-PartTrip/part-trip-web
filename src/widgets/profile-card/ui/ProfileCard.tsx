import { useNavigate } from 'react-router-dom'
import type { UserProfile } from '@shared/api'
import { paths } from '@shared/config'

import * as S from './ProfileCard.styles'

type ProfileCardProps = {
  profile: UserProfile
}

export function ProfileCard({ profile }: ProfileCardProps) {
  const navigate = useNavigate()

  return (
    <S.Card>
      <S.Avatar aria-hidden="true">{profile.name.slice(0, 1)}</S.Avatar>
      <S.Header>
        <div>
          <S.Eyebrow>MY PROFILE</S.Eyebrow>
          <h1>{profile.name}</h1>
          <p>@{profile.id}</p>
        </div>
        <S.EditButton type="button" onClick={() => navigate(paths.profileEdit)}>
          프로필 수정
        </S.EditButton>
      </S.Header>
      <S.StyleBadge>{profile.travelStyle}</S.StyleBadge>
      <S.Bio>{profile.bio}</S.Bio>
      <S.InfoGrid>
        <div><span>이메일</span><strong>{profile.email}</strong></div>
        <div><span>전화번호</span><strong>{profile.phone}</strong></div>
        <div><span>거주 국가</span><strong>{profile.country}</strong></div>
      </S.InfoGrid>
    </S.Card>
  )
}
