import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useMyTrips } from '@/entities/trip-plan'
import { useAcquireCountryMutation, useWorldMapQuery, useWorldMapStatsQuery } from '@/entities/world-map'
import { paths } from '@/shared/config'
import { readSessionValue, writeSessionValue } from '@/shared/libs/session-storage'
import { isPositiveSafeInteger } from '@/shared/utils'
import { AppShell } from '@/widgets/app-shell'

import * as S from './ProfileInsightPage.styles'
import {
  ProfileAchievementsView,
  ProfileClaimView,
  ProfileCountriesView,
  ProfileMapView,
} from './ProfileInsightModeViews'

export type ProfileInsightKind = 'map' | 'claim' | 'countries' | 'achievements'

const copy: Record<ProfileInsightKind, { title: string; subtitle: string }> = {
  map: { title: '내 세계지도', subtitle: '방문한 국가를 확인하세요.' },
  claim: { title: '방문 국가 획득', subtitle: '여행 기록을 선택해 국가를 획득하세요.' },
  countries: { title: '국가별 여행 기록', subtitle: '나라를 선택하면 해당 국가의 여행 기록을 모아봅니다.' },
  achievements: { title: '여행 달성 현황', subtitle: '방문 국가와 대륙별 달성률을 확인하세요.' },
}

const PROFILE_COUNTRY_KEY = 'parttrip:profile-selected-country'

export function ProfileInsightPage({ kind }: { kind: ProfileInsightKind }) {
  const navigate = useNavigate()
  const { hasError: hasTripsError, isLoading: isTripsLoading, trips } = useMyTrips()
  const needsWorldMap = kind === 'map' || kind === 'claim' || kind === 'countries'
  const needsStats = kind === 'achievements'
  const worldMapQuery = useWorldMapQuery(needsWorldMap)
  const worldMapStatsQuery = useWorldMapStatsQuery(needsStats)
  const acquireCountryMutation = useAcquireCountryMutation()
  const [selectedCity, setSelectedCity] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(() => readSessionValue(PROFILE_COUNTRY_KEY) ?? '')
  const [claimFeedback, setClaimFeedback] = useState('')
  const isLoading = isTripsLoading || (needsWorldMap && worldMapQuery.isLoading) || (needsStats && worldMapStatsQuery.isLoading)
  const hasError = hasTripsError || (needsWorldMap && worldMapQuery.isError) || (needsStats && worldMapStatsQuery.isError)
  const visited = worldMapQuery.data?.visited ?? []
  const visitedCountries = [...new Set(visited.map((country) => country.countryName).filter((country): country is string => Boolean(country)))]
  const claimCountries = [...new Set(trips.map((trip) => trip.countryName).filter((country): country is string => Boolean(country)))]
  const countryChoices = kind === 'claim' ? claimCountries : visitedCountries
  const activeCountry = countryChoices.includes(selectedCountry) ? selectedCountry : countryChoices[0]
  const countryTrips = trips.filter((trip) => trip.countryName === activeCountry)
  const selectedTrip = countryTrips.find((trip) => isPositiveSafeInteger(trip.tripId))
  const countryCode = visited.find((country) => country.countryName === activeCountry)?.countryCode ?? '--'
  const countryCities = [...new Set(countryTrips.map((trip) => trip.cityName).filter((city): city is string => Boolean(city)))]
  const firstVisit = countryTrips.map((trip) => trip.startDate).filter(Boolean).sort()[0]?.replaceAll('-', '.') || '-'
  const totalCountries = worldMapQuery.data?.totalCountries ?? worldMapStatsQuery.data?.totalCount ?? 0
  const acquiredCount = worldMapStatsQuery.data?.acquiredCount ?? visitedCountries.length
  const achievementPercentage = worldMapStatsQuery.data?.percentage ?? (totalCountries ? acquiredCount / totalCountries * 100 : 0)
  const { title, subtitle } = copy[kind]
  const pageTitle = kind === 'countries' ? activeCountry || title : title
  const pageSubtitle = kind === 'countries' ? `첫 방문 ${firstVisit}` : subtitle
  const continentProgress = worldMapStatsQuery.data?.byContinent?.length
    ? worldMapStatsQuery.data.byContinent.map((item) => [item.continent || '대륙', item.acquiredCount || 0, item.totalCount || 0] as const)
    : []

  const selectCountry = (country: string) => {
    setSelectedCountry(country)
    writeSessionValue(PROFILE_COUNTRY_KEY, country)
    setSelectedCity('')
    setClaimFeedback('')
  }

  const handleAcquireCountry = async () => {
    const tripId = selectedTrip?.tripId
    if (!isPositiveSafeInteger(tripId)) {
      setClaimFeedback('획득할 여행 기록을 찾을 수 없습니다.')
      return
    }

    try {
      const result = await acquireCountryMutation.mutateAsync({ tripId })
      setClaimFeedback(result.isNew ? `${activeCountry}을 새로 획득했어요.` : `${activeCountry}은 이미 획득한 국가예요.`)
    } catch {
      setClaimFeedback('국가 획득에 실패했습니다. 여행 기록을 확인해주세요.')
    }
  }

  return (
    <AppShell>
      <S.Page $wide={kind === 'countries'}>
        {!isLoading ? <S.Header $wide={kind === 'countries'} $hasSubtitle={Boolean(pageSubtitle)}><S.Title>{pageTitle}</S.Title>{pageSubtitle ? <S.Subtitle>{pageSubtitle}</S.Subtitle> : null}</S.Header> : null}
        {hasError ? <S.State role="alert">세계지도 정보를 불러오지 못했습니다.</S.State> : null}
        {isLoading ? <S.LoadingLayout aria-busy="true" aria-label="세계지도 정보 로딩 중"><S.LoadingHeader />{kind === 'map' || kind === 'countries' ? <S.LoadingGrid><S.LoadingPanel /><S.LoadingPanel /></S.LoadingGrid> : <S.LoadingSingle />}</S.LoadingLayout> : null}

        {!isLoading && !hasError && kind === 'map' ? <ProfileMapView totalCountries={totalCountries} trips={trips} visited={visited} visitedCountries={visitedCountries} onOpenCountries={() => navigate({ to: paths.profileCountries })} onSelectCountry={selectCountry} /> : null}
        {!isLoading && !hasError && kind === 'claim' ? <ProfileClaimView acquiredCount={acquiredCount} activeCountry={activeCountry} claimCountries={claimCountries} claimFeedback={claimFeedback} countryCode={countryCode} countryTrips={countryTrips} isPending={acquireCountryMutation.isPending} onAcquire={() => void handleAcquireCountry()} onMap={() => navigate({ to: paths.profileMap })} onSelectCountry={selectCountry} totalCountries={totalCountries} achievementPercentage={achievementPercentage} /> : null}
        {!isLoading && !hasError && kind === 'countries' ? <ProfileCountriesView activeCountry={activeCountry} acquiredCount={acquiredCount} countryCities={countryCities} countryCode={countryCode} firstVisit={firstVisit} onOpenRecord={(tripId) => navigate({ params: { recordId: String(tripId) }, to: '/record/$recordId' })} onSelectCity={setSelectedCity} onSelectCountry={selectCountry} selectedCity={selectedCity} totalCountries={totalCountries} visitedCountries={visitedCountries} trips={countryTrips} /> : null}
        {!isLoading && !hasError && kind === 'achievements' ? <ProfileAchievementsView acquiredCount={acquiredCount} achievementPercentage={achievementPercentage} continentProgress={continentProgress} totalCountries={totalCountries} /> : null}
      </S.Page>
    </AppShell>
  )
}
