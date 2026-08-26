import { useNavigate } from '@tanstack/react-router'
import { getTripDurationDays, useMyTrips } from '@/entities/trip-plan'
import { figmaWorldMap } from '@/shared/assets'
import { paths } from '@/shared/config'
import { AppShell } from '@/widgets/app-shell'

import * as S from './ProfileInsightPage.styles'

export type ProfileInsightKind = 'map' | 'countries' | 'achievements'

const copy: Record<ProfileInsightKind, { title: string; subtitle: string }> = {
  map: { title: '개인 세계지도', subtitle: '다녀온 나라와 앞으로 가고 싶은 곳을 지도에서 확인하세요.' },
  countries: { title: '국가별 여행 기록', subtitle: '나라별로 남긴 여행 기록을 모아볼 수 있습니다.' },
  achievements: { title: '여행 달성 현황', subtitle: '여행 데이터를 기준으로 달성 현황을 확인하세요.' },
}

export function ProfileInsightPage({ kind }: { kind: ProfileInsightKind }) {
  const navigate = useNavigate()
  const { hasError, isLoading, trips } = useMyTrips()
  const errorMessage = hasError ? '여행 기록을 불러오지 못했습니다.' : ''

  const countries = [...new Set(trips.map((trip) => trip.countryName).filter(Boolean))]
  const { title, subtitle } = copy[kind]

  return (
    <AppShell>
      <S.Page>
        <S.Header><div><S.Title>{title}</S.Title><S.Subtitle>{subtitle}</S.Subtitle></div><S.BackButton type="button" onClick={() => navigate({ to: paths.profile })}>마이페이지</S.BackButton></S.Header>
        {errorMessage ? <S.State role="alert">{errorMessage}</S.State> : null}
        {isLoading ? <S.State aria-busy="true">여행 기록을 불러오는 중입니다.</S.State> : null}
        {!isLoading && !errorMessage && kind === 'map' ? <S.MapCard><img src={figmaWorldMap} alt="세계 지도" /><S.MapLegend><span />방문한 국가</S.MapLegend><S.MapNote>{countries.length ? `${countries.length}개 국가를 방문했습니다.` : '아직 방문한 국가 데이터가 없습니다.'}</S.MapNote></S.MapCard> : null}
        {!isLoading && !errorMessage && kind === 'countries' ? <S.CountryGrid>{countries.map((country) => <S.CountryCard key={country}><strong>{country}</strong><span>{trips.filter((trip) => trip.countryName === country).length}개의 여행 기록</span></S.CountryCard>)}{countries.length === 0 ? <S.Empty>국가별 여행 기록이 없습니다.</S.Empty> : null}</S.CountryGrid> : null}
        {!isLoading && !errorMessage && kind === 'achievements' ? <S.AchievementGrid><S.Achievement><strong>{countries.length}</strong><span>방문 국가</span></S.Achievement><S.Achievement><strong>{trips.length}</strong><span>여행 기록</span></S.Achievement><S.Achievement><strong>{getTripDurationDays(trips)}</strong><span>여행 일수</span></S.Achievement></S.AchievementGrid> : null}
      </S.Page>
    </AppShell>
  )
}
