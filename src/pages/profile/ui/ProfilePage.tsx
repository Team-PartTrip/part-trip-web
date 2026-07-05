import { useEffect, useState } from 'react'
import logoUrl from '@shared/assets/logo.png'
import { getProfileMock, type UserProfile } from '@shared/api'
import { ProfileCard } from '@widgets/profile-card'
import { MENUS, Sidebar } from '@widgets/sidebar'

import * as S from './ProfilePage.styles'

export function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    let isMounted = true
    void getProfileMock()
      .then((data) => { if (isMounted) setProfile(data) })
      .catch(() => { if (isMounted) setHasError(true) })
    return () => { isMounted = false }
  }, [])

  return (
    <S.Page>
      <Sidebar logo={<S.Logo><img src={logoUrl} alt="PartTrip" /></S.Logo>} menus={MENUS} />
      <S.Content>
        {hasError ? <S.State role="alert">프로필을 불러오지 못했습니다.<button type="button" onClick={() => window.location.reload()}>다시 시도</button></S.State> : null}
        {!hasError && !profile ? <S.State aria-busy="true">프로필을 불러오는 중입니다.</S.State> : null}
        {profile ? <ProfileCard profile={profile} /> : null}
      </S.Content>
    </S.Page>
  )
}
