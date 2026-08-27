import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { getTripDurationDays, useMyTrips } from '@/entities/trip-plan'
import { useCountriesQuery } from '@/entities/travel'
import { figmaHomeHero, figmaProfileTrip, figmaWorldMap } from '@/shared/assets'
import { paths } from '@/shared/config'
import { Button as PartTripButton } from '@/shared/ui/parttrip'
import { AppShell } from '@/widgets/app-shell'

import * as S from './ProfileInsightPage.styles'

export type ProfileInsightKind = 'map' | 'claim' | 'countries' | 'achievements'

const copy: Record<ProfileInsightKind, { title: string; subtitle: string }> = {
  map: { title: '내 세계지도', subtitle: '방문한 나라를 지도 위에서 확인하세요.' },
  claim: { title: '방문 국가 획득', subtitle: '여행 기록을 남기고 새로운 나라를 획득하세요.' },
  countries: { title: '국가별 여행 기록', subtitle: '나라를 선택하면 해당 국가의 여행 기록을 모아봅니다.' },
  achievements: { title: '달성 현황', subtitle: '여행 기록과 방문 국가로 쌓은 성취를 확인하세요.' },
}

export function ProfileInsightPage({ kind }: { kind: ProfileInsightKind }) {
  const navigate = useNavigate()
  const { hasError, isLoading, trips } = useMyTrips()
  const countriesQuery = useCountriesQuery(kind === 'map' || kind === 'claim')
  const [selectedCountry, setSelectedCountry] = useState<string>()
  const visitedCountries = [...new Set(trips.map((trip) => trip.countryName).filter(Boolean))]
  const activeCountry = selectedCountry && visitedCountries.includes(selectedCountry) ? selectedCountry : visitedCountries[0]
  const activeTrips = trips.filter((trip) => trip.countryName === activeCountry)
  const catalogCountries = [...new Set((countriesQuery.data ?? []).map((country) => country.countryName).filter(Boolean))]
  const tripDays = getTripDurationDays(trips)
  const { title, subtitle } = copy[kind]

  return (
    <AppShell>
      <S.Page>
        <S.Header><S.Title>{title}</S.Title><S.Subtitle>{subtitle}</S.Subtitle></S.Header>
        {hasError ? <S.State role="alert">여행 기록을 불러오지 못했습니다.</S.State> : null}
        {isLoading ? <S.State aria-busy="true">여행 기록을 불러오는 중입니다.</S.State> : null}

        {!isLoading && !hasError && (kind === 'map' || kind === 'claim') ? <S.MapBody><S.MapCard><S.SectionTitle>방문 국가</S.SectionTitle><img src={figmaWorldMap} alt="방문 국가 세계 지도" /><S.MapLegend><span />방문 {visitedCountries.length}개</S.MapLegend></S.MapCard><S.CountryStats>{kind === 'claim' ? <><h2>{activeCountry || '일본'}</h2><p>{activeTrips.map((trip) => trip.cityName).filter(Boolean).join(' · ') || '여행 기록을 남기면 표시됩니다.'}</p><S.Badge>{activeTrips.length ? '획득 완료' : '기록 필요'}</S.Badge><span>{activeTrips.length ? `여행 기록 ${activeTrips.length}개가 있어 국가가 개인 세계지도에 표시되었습니다.` : '여행 기록을 남기면 국가가 개인 세계지도에 표시됩니다.'}</span></> : <><S.SectionTitle>방문 국가</S.SectionTitle><strong>{visitedCountries.length}개</strong><p>아시아 {Math.max(0, visitedCountries.length - 3)}개 · 유럽 2개 · 북미 1개</p><S.Badge>{catalogCountries.length ? `${visitedCountries.length} / ${catalogCountries.length}개 국가` : `${visitedCountries.length}개 국가`}</S.Badge></>}<PartTripButton type="button" onClick={() => navigate({ to: paths.profileCountries })}>나라별 기록 보기</PartTripButton></S.CountryStats></S.MapBody> : null}

        {!isLoading && !hasError && kind === 'countries' ? <S.CountryRecordsLayout><S.CountryList><S.SectionTitle>방문 국가</S.SectionTitle>{visitedCountries.map((country) => <S.CountryRow key={country} type="button" $active={country === activeCountry} onClick={() => setSelectedCountry(country)}>{country} · {trips.filter((trip) => trip.countryName === country).length}개 기록</S.CountryRow>)}{visitedCountries.length === 0 ? <S.Empty>여행 기록을 저장하면 국가별 기록이 표시됩니다.</S.Empty> : null}</S.CountryList><S.CountryPhotos>{activeTrips.map((trip, index) => <S.CountryPhoto key={trip.tripId ?? index} type="button" onClick={() => trip.tripId && navigate({ params: { recordId: String(trip.tripId) }, to: '/record/$recordId' })}><img src={trip.images?.[0] || (index === 0 ? figmaHomeHero : figmaProfileTrip)} alt="" /><strong>{trip.cityName || activeCountry || '여행'}</strong><span>{trip.countryName || activeCountry} · Day {trip.places?.[0]?.dayNumber || index + 1}</span></S.CountryPhoto>)}{activeTrips.length === 0 ? <S.Empty>선택한 국가의 여행 기록이 없습니다.</S.Empty> : null}</S.CountryPhotos></S.CountryRecordsLayout> : null}

        {!isLoading && !hasError && kind === 'achievements' ? <><S.AchievementStats><S.AchievementStat><small>방문 국가</small><strong>{visitedCountries.length}개</strong><span>세계의 4%</span></S.AchievementStat><S.AchievementStat><small>여행 기록</small><strong>{trips.length}개</strong><span>사진과 메모</span></S.AchievementStat><S.AchievementStat><small>최장 여행</small><strong>{tripDays}일</strong><span>여행 일수</span></S.AchievementStat><S.AchievementStat><small>함께한 멤버</small><strong>-</strong><span>그룹 여행</span></S.AchievementStat></S.AchievementStats><S.AchievementMap><S.SectionTitle>달성 지도</S.SectionTitle><img src={figmaWorldMap} alt="달성한 국가 세계 지도" /></S.AchievementMap></> : null}
      </S.Page>
    </AppShell>
  )
}
