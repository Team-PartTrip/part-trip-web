import { useEffect, useState } from 'react'
import logoUrl from '@shared/assets/logo.svg'
import { getProfileMock, type UserProfile } from '@shared/api'
import { ProfileForm } from '@widgets/profile-form'
import { MENUS, Sidebar } from '@widgets/sidebar'

import * as S from './ProfileEditPage.styles'

export function ProfileEditPage() {
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
        {hasError ? <S.State role="alert">프로필 정보를 불러오지 못했습니다.</S.State> : null}
        {!hasError && !profile ? <S.State aria-busy="true">수정할 정보를 준비하고 있습니다.</S.State> : null}
        {profile ? <ProfileForm profile={profile} /> : null}
      </S.Content>
    </S.Page>
  )
}
