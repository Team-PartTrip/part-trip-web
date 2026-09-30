import { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { useGuardianLinksQuery } from '@/entities/guardian'
import { useDeleteProfileMutation, useUserProfileQuery } from '@/entities/user'
import { clearAuthTokens } from '@/shared/libs/token-storage'
import { getErrorMessage } from '@/shared/utils'
import { ProfileForm } from '@/features/fix-profile'
import { paths } from '@/shared/config'
import { Button as PartTripButton } from '@/shared/ui/parttrip'
import { AppShell } from '@/widgets/app-shell'
import { LogoutDialog } from '@/widgets/sidebar'
import * as S from './ProfilePage.styles'

type ProfilePageProps = { editMode?: boolean }

export function ProfilePage({ editMode = false }: ProfilePageProps = {}) {
  const navigate = useNavigate()
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false)
  const [deleteError, setDeleteError] = useState('')
  const [failedAvatarUrl, setFailedAvatarUrl] = useState<string>()
  const queryClient = useQueryClient()
  const deleteMutation = useDeleteProfileMutation()
  const { data: profile, isError, isLoading } = useUserProfileQuery()
  const { data: guardians } = useGuardianLinksQuery()
  const name = profile?.name || '여행자'
  const initials = name.slice(0, 2).toUpperCase()

  const handleDeleteAccount = async () => {
    if (!window.confirm('계정을 삭제하면 복구할 수 없습니다. 정말 탈퇴할까요?')) return
    try {
      setDeleteError('')
      await deleteMutation.mutateAsync()
    } catch (error) {
      setDeleteError(getErrorMessage(error))
      return
    }
    clearAuthTokens()
    queryClient.clear()
    await navigate({ replace: true, to: paths.login })
  }

  return (
    <AppShell fillHeight>
      <S.Page>
        <S.Header>
          <S.Title>마이페이지</S.Title>
          <S.Subtitle>프로필·보호자·여행 편의 설정을 관리하세요.</S.Subtitle>
        </S.Header>
        {isLoading ? <S.State role="status">프로필을 불러오는 중이에요.</S.State> : null}
        {isError ? (
          <>
            <S.State role="alert">프로필 정보를 불러오지 못했어요.</S.State>
            <S.ErrorActions><S.LogoutButton type="button" onClick={() => setIsLogoutDialogOpen(true)}>로그아웃</S.LogoutButton></S.ErrorActions>
          </>
        ) : null}
        {!isLoading && !isError && profile ? (
          <>
            <S.AccountPanel>
              <S.AccountHeader>
                <S.Avatar>
                  {profile.avatarUrl && profile.avatarUrl !== failedAvatarUrl ? <img src={profile.avatarUrl} alt={`${name} 프로필 사진`} width={64} height={64} onError={() => setFailedAvatarUrl(profile.avatarUrl)} /> : initials}
                </S.Avatar>
                <S.AccountCopy>
                  <strong>{name}</strong>
                  <span>리더 · 여행 편의 설정과 보호자 연결을 관리해요</span>
                  <small>@{profile.id}</small>
                </S.AccountCopy>
                <S.ProfileActions>
                  <PartTripButton as={Link} to={paths.profileEdit} $variant="secondary">프로필 수정</PartTripButton>
                  <S.LogoutButton type="button" onClick={() => setIsLogoutDialogOpen(true)}>로그아웃</S.LogoutButton>
                </S.ProfileActions>
              </S.AccountHeader>
            </S.AccountPanel>
            <S.SettingsNav aria-label="마이 설정">
              <S.SettingsGroup aria-labelledby="travel-settings-title">
                <h2 id="travel-settings-title">여행 관리</h2>
                <S.SettingsList>
                  <S.SettingsRow to={paths.profileTravelPreferences}>
                    <span><strong>여행 편의 설정</strong><small>이동수단 · 하루 일정 개수 · 계단 이용</small></span><b>관리</b>
                  </S.SettingsRow>
                  <S.SettingsRow to={paths.profileGuardians}>
                    <span><strong>보호자 연결</strong><small>일정 공유 · 현재 위치 보기</small></span>
                    <b>{guardians ? `${guardians.length}명 연결됨 · 관리` : '관리'}</b>
                  </S.SettingsRow>
                </S.SettingsList>
              </S.SettingsGroup>
              <S.SettingsGroup aria-labelledby="app-settings-title">
                <h2 id="app-settings-title">앱 설정</h2>
                <S.SettingsList>
                  <S.SettingsRow to={paths.notificationSettings}>
                    <span><strong>알림 안내</strong><small>받을 수 있는 여행 알림 종류를 확인해요</small></span><b>확인</b>
                  </S.SettingsRow>
                  <S.SettingsRow to={paths.profileAccessibility}>
                    <span><strong>접근성 설정</strong><small>휴대폰 글자 크기 · 고대비 설정</small></span><b>확인</b>
                  </S.SettingsRow>
                  <S.SettingsRow to={paths.privacy}>
                    <span><strong>개인정보처리방침</strong><small>개인정보 처리 내용을 확인해요</small></span><b>보기</b>
                  </S.SettingsRow>
                </S.SettingsList>
              </S.SettingsGroup>
            </S.SettingsNav>
            <S.ErrorActions><S.LogoutButton type="button" disabled={deleteMutation.isPending} onClick={() => void handleDeleteAccount()}>{deleteMutation.isPending ? '탈퇴 중' : '회원 탈퇴'}</S.LogoutButton></S.ErrorActions>
            {deleteError ? <S.DeletionError role="alert">계정 삭제에 실패했습니다. {deleteError}</S.DeletionError> : null}
          </>
        ) : null}
      </S.Page>
      {editMode && profile ? <><S.ModalBackdrop /><ProfileForm profile={profile} /></> : null}
      {isLogoutDialogOpen ? (
        <LogoutDialog onClose={() => setIsLogoutDialogOpen(false)} moveToLogin={() => navigate({ replace: true, to: paths.login })} />
      ) : null}
    </AppShell>
  )
}
