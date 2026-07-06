import { useEffect, useState } from 'react'
import logoUrl from '@shared/assets/logo.png'
import { getCharacterInfo, getProfile, toUserProfile, type UserProfile } from '@shared/api'
import { ProfileCard } from '@widgets/profile-card'
import { ProfileForm } from '@widgets/profile-form'
import { MENUS, Sidebar } from '@widgets/sidebar'

import * as S from './ProfilePage.styles'

export function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [hasError, setHasError] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    let isMounted = true
    void getProfile()
      .then(async (data) => {
        const character = await getCharacterInfo().catch(() => undefined)
        if (isMounted) setProfile(toUserProfile(data, character))
      })
      .catch(() => { if (isMounted) setHasError(true) })
    return () => { isMounted = false }
  }, [])

  return (
    <S.Page>
      <Sidebar logo={<S.Logo><img src={logoUrl} alt="PartTrip" /></S.Logo>} menus={MENUS} />
      <S.Content>
        {hasError ? <S.State role="alert">프로필을 불러오지 못했습니다.<button type="button" onClick={() => window.location.reload()}>다시 시도</button></S.State> : null}
        {!hasError && !profile ? <S.State aria-busy="true">프로필을 불러오는 중입니다.</S.State> : null}
        {profile ? <ProfileCard profile={profile} onEdit={() => setIsEditing(true)} /> : null}
      </S.Content>
      {profile && isEditing ? (
        <>
          <S.Backdrop onClick={() => setIsEditing(false)} />
          <ProfileForm
            profile={profile}
            onCancel={() => setIsEditing(false)}
            onSaved={(updatedProfile) => {
              setProfile(updatedProfile)
              setIsEditing(false)
            }}
          />
        </>
      ) : null}
    </S.Page>
  )
}
