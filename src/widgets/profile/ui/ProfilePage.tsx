import { useNavigate } from '@tanstack/react-router'
import type { TripPlanResponseDto } from '@/entities/trip-plan/types'
import { useUserProfileQuery } from '@/entities/user'
import { figmaProfileHero, figmaProfileTrip } from '@/shared/assets'
import { paths } from '@/shared/config'
import { useMyTrips } from '@/entities/trip-plan'
import { AppShell } from '@/widgets/app-shell'

import * as S from './ProfilePage.styles'

function tripDays(trips: TripPlanResponseDto[]) {
  return trips.reduce((total, trip) => {
    if (!trip.startDate || !trip.endDate) return total
    return total + Math.max(1, Math.round((Date.parse(trip.endDate) - Date.parse(trip.startDate)) / 86400000) + 1)
  }, 0)
}

export function ProfilePage() {
  const navigate = useNavigate()
  const { hasError: hasTripsError, trips } = useMyTrips()
  const { data: profile, isError: hasProfileError, isLoading: isProfileLoading } = useUserProfileQuery()

  const countries = new Set(trips.map((trip) => trip.countryName).filter(Boolean)).size

  return (
    <AppShell>
      <S.Page>
        <S.Header><div><S.Title>마이페이지</S.Title><S.Subtitle>나의 여행 활동과 설정을 관리하세요.</S.Subtitle></div><S.EditButton type="button" onClick={() => navigate({ to: paths.profileEdit })}>프로필 수정</S.EditButton></S.Header>
        {hasProfileError || hasTripsError ? <S.State role="alert">{hasProfileError ? '프로필을 불러오지 못했습니다.' : '여행 기록을 불러오지 못했습니다.'}</S.State> : null}
        {!profile && !hasProfileError && isProfileLoading ? <S.State aria-busy="true">프로필을 불러오는 중입니다.</S.State> : null}
        {profile ? (
          <>
            <S.ProfileCard>
              <S.ProfileHero><img src={profile.avatarUrl || figmaProfileHero} alt="" /><div><h2>{profile.name}</h2><p>{profile.travelStyle}</p><span>{profile.bio}</span></div></S.ProfileHero>
              <S.Stats>
                <div><strong>{countries}</strong><span>방문 국가</span></div>
                <div><strong>{trips.length}</strong><span>여행 기록</span></div>
                <div><strong>{tripDays(trips)}</strong><span>여행 일수</span></div>
              </S.Stats>
            </S.ProfileCard>
            <S.Section>
              <S.SectionTitle>최근 여행</S.SectionTitle>
              <S.RecentGrid>
                {trips.slice(0, 3).map((trip, index) => <S.RecentTrip key={trip.tripId ?? index} type="button" onClick={() => trip.tripId && navigate({ params: { recordId: String(trip.tripId) }, to: '/record/$recordId' })}><img src={trip.images?.[0] || (index === 0 ? figmaProfileTrip : figmaProfileHero)} alt="" /><strong>{trip.title || '여행 기록'}</strong><span>{trip.cityName || trip.countryName || '여행지'}</span></S.RecentTrip>)}
                {trips.length === 0 ? <S.Empty>연결된 여행 기록이 없습니다.</S.Empty> : null}
              </S.RecentGrid>
            </S.Section>
            <S.Section>
              <S.SectionTitle>둘러보기</S.SectionTitle>
              <S.SettingsCard>
                <S.SettingsButton type="button" onClick={() => navigate({ to: paths.profileMap })}>개인 세계지도 <span>›</span></S.SettingsButton>
                <S.SettingsButton type="button" onClick={() => navigate({ to: paths.profileCountries })}>국가별 여행 기록 <span>›</span></S.SettingsButton>
                <S.SettingsButton type="button" onClick={() => navigate({ to: paths.profileAchievements })}>여행 달성 현황 <span>›</span></S.SettingsButton>
                <S.SettingsButton type="button" onClick={() => navigate({ to: paths.notificationSettings })}>알림 설정 <span>›</span></S.SettingsButton>
              </S.SettingsCard>
            </S.Section>
          </>
        ) : null}
      </S.Page>
    </AppShell>
  )
}
