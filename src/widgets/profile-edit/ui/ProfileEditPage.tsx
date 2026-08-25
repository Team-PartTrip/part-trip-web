import { useUserProfileQuery } from '@/entities/user'
import { AppShell } from '@/widgets/app-shell'
import { ProfileCard } from '@/widgets/profile-card'
import { ProfileForm } from '@/features/fix-profile'

import * as S from './ProfileEditPage.styles'

export function ProfileEditPage() {
  const { data: profile, isError: hasError, isLoading } = useUserProfileQuery()

  return (
    <AppShell>
      <S.Page>
      <S.Content>
        {hasError ? <S.State role="alert">프로필 정보를 불러오지 못했습니다.</S.State> : null}
        {!hasError && isLoading ? <S.State aria-busy="true">수정할 정보를 준비하고 있습니다.</S.State> : null}
        {profile ? <ProfileCard profile={profile} /> : null}
      </S.Content>
      {profile ? <><S.Backdrop /><ProfileForm profile={profile} /></> : null}
      </S.Page>
    </AppShell>
  )
}
