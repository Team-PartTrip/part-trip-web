import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useGuardianLinksQuery } from '@/entities/guardian'
import { useUserProfileQuery } from '@/entities/user'
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
  const { data: profile, isError, isLoading } = useUserProfileQuery()
  const { data: guardians } = useGuardianLinksQuery()
  const name = profile?.name || '여행자'
  const initials = name.slice(0, 2).toUpperCase()

  return (
    <AppShell fillHeight>
      <S.Page>
        <S.Header>
          <S.Title>마이</S.Title>
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
          <S.AccountPanel>
            <S.AccountHeader>
              <S.Avatar>
                {profile.avatarUrl ? <img src={profile.avatarUrl} alt={`${name} 프로필 사진`} /> : initials}
              </S.Avatar>
              <S.AccountCopy>
                <strong>{name}</strong>
                <span>리더 · 여행 편의 설정과 보호자 연결을 관리해요</span>
                <small>@{profile.id}</small>
              </S.AccountCopy>
              <S.ProfileActions>
                <PartTripButton type="button" $variant="secondary" onClick={() => navigate({ to: paths.profileEdit })}>프로필 수정</PartTripButton>
                <S.LogoutButton type="button" onClick={() => setIsLogoutDialogOpen(true)}>로그아웃</S.LogoutButton>
              </S.ProfileActions>
            </S.AccountHeader>
            <S.SettingsList aria-label="마이 설정">
              <S.SettingsRow type="button" onClick={() => navigate({ to: paths.profileTravelPreferences })}>
                <span><strong>여행 편의 설정</strong><small>이동수단 · 하루 일정 개수 · 계단 이용</small></span><b>관리</b>
              </S.SettingsRow>
              <S.SettingsRow type="button" onClick={() => navigate({ to: paths.profileGuardians })}>
                <span><strong>보호자 연결</strong><small>일정 공유 · 현재 위치 보기</small></span>
                <b>{guardians ? `${guardians.length}명 연결됨 · 관리` : '관리'}</b>
              </S.SettingsRow>
              <S.SettingsRow type="button" onClick={() => navigate({ to: paths.notificationSettings })}>
                <span><strong>알림 설정</strong><small>여행 알림과 읽음 상태를 관리해요</small></span><b>관리</b>
              </S.SettingsRow>
              <S.SettingsRow type="button" onClick={() => navigate({ to: paths.profileAccessibility })}>
                <span><strong>접근성 설정</strong><small>휴대폰 글자 크기 · 고대비 설정</small></span><b>확인</b>
              </S.SettingsRow>
            </S.SettingsList>
          </S.AccountPanel>
        ) : null}
      </S.Page>
      {editMode && profile ? <><S.ModalBackdrop /><ProfileForm profile={profile} /></> : null}
      {isLogoutDialogOpen ? (
        <LogoutDialog onClose={() => setIsLogoutDialogOpen(false)} moveToLogin={() => navigate({ replace: true, to: paths.login })} />
      ) : null}
    </AppShell>
  )
}
