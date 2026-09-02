import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useMyTrips } from '@/entities/trip-plan'
import { useAcquireCountryMutation, useWorldMapQuery, useWorldMapStatsQuery } from '@/entities/world-map'
import { figmaWorldMap } from '@/shared/assets'
import { paths } from '@/shared/config'
import { Button as PartTripButton } from '@/shared/ui/parttrip'
import { isPositiveSafeInteger } from '@/shared/utils'
import { AppShell } from '@/widgets/app-shell'

import * as S from './ProfileInsightPage.styles'

export type ProfileInsightKind = 'map' | 'claim' | 'countries' | 'achievements'

const copy: Record<ProfileInsightKind, { title: string; subtitle: string }> = {
  map: { title: '내 세계지도', subtitle: '방문한 국가를 확인하세요.' },
  claim: { title: '방문 국가 획득', subtitle: '여행 기록을 선택해 국가를 획득하세요.' },
  countries: { title: '국가별 여행 기록', subtitle: '나라를 선택하면 해당 국가의 여행 기록을 모아봅니다.' },
  achievements: { title: '여행 달성 현황', subtitle: '방문 국가와 대륙별 달성률을 확인하세요.' },
}

const PROFILE_COUNTRY_KEY = 'parttrip:profile-selected-country'

function readSelectedCountry() {
  if (typeof window === 'undefined') return ''
  try {
    return window.sessionStorage.getItem(PROFILE_COUNTRY_KEY) ?? ''
  } catch {
    return ''
  }
}

function saveSelectedCountry(country: string) {
  if (typeof window === 'undefined') return
  try {
    window.sessionStorage.setItem(PROFILE_COUNTRY_KEY, country)
  } catch {
    // Storage access can be blocked by browser privacy settings.
  }
}

export function ProfileInsightPage({ kind }: { kind: ProfileInsightKind }) {
  const navigate = useNavigate()
  const { hasError: hasTripsError, isLoading: isTripsLoading, trips } = useMyTrips()
  const needsWorldMap = kind === 'map' || kind === 'claim' || kind === 'countries'
  const needsStats = kind === 'achievements'
  const worldMapQuery = useWorldMapQuery(needsWorldMap)
  const worldMapStatsQuery = useWorldMapStatsQuery(needsStats)
  const acquireCountryMutation = useAcquireCountryMutation()
  const [selectedCity, setSelectedCity] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(readSelectedCountry)
  const [claimFeedback, setClaimFeedback] = useState('')
  const isLoading = isTripsLoading || (needsWorldMap && worldMapQuery.isLoading) || (needsStats && worldMapStatsQuery.isLoading)
  const hasError = hasTripsError || (needsWorldMap && worldMapQuery.isError) || (needsStats && worldMapStatsQuery.isError)
  const visited = worldMapQuery.data?.visited ?? []
  const visitedCountries = [...new Set(visited.map((country) => country.countryName).filter((country): country is string => Boolean(country)))]
  const claimCountries = [...new Set(trips.map((trip) => trip.countryName).filter((country): country is string => Boolean(country)))]
  const countryChoices = kind === 'claim' ? claimCountries : visitedCountries
  const activeCountry = countryChoices.includes(selectedCountry) ? selectedCountry : countryChoices[0]
  const countryTrips = trips.filter((trip) => trip.countryName === activeCountry)
  const activeTrips = selectedCity ? countryTrips.filter((trip) => trip.cityName === selectedCity) : countryTrips
  const selectedTrip = countryTrips.find((trip) => isPositiveSafeInteger(trip.tripId))
  const countryCode = visited.find((country) => country.countryName === activeCountry)?.countryCode ?? '--'
  const countryCities = [...new Set(countryTrips.map((trip) => trip.cityName).filter((city): city is string => Boolean(city)))]
  const countryPhotoCount = activeTrips.reduce((total, trip) => total + (trip.images?.length ?? 0), 0)
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
    saveSelectedCountry(country)
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

        {!isLoading && !hasError && kind === 'map' ? <S.MapBody><S.MapCard><S.SectionTitle>방문한 국가</S.SectionTitle><S.MapCanvas><img src={figmaWorldMap} alt="방문 국가 세계 지도" /></S.MapCanvas></S.MapCard><S.CountryStats><S.SectionTitle>획득한 국가 {visitedCountries.length} / {totalCountries || '-'}</S.SectionTitle>{visitedCountries.length ? <S.CountrySummaryList>{visitedCountries.slice(0, 3).map((country) => <S.CountrySummaryRow key={country} type="button" onClick={() => { selectCountry(country); navigate({ to: paths.profileCountries }) }}><strong>{country}</strong><span>{trips.filter((trip) => trip.countryName === country).length}회 방문 <b>›</b></span></S.CountrySummaryRow>)}</S.CountrySummaryList> : <S.Empty>아직 방문한 국가가 없습니다.</S.Empty>}{visitedCountries.length < totalCountries ? <S.MoreLink type="button" onClick={() => navigate({ to: paths.profileCountries })}>+ {Math.max(0, totalCountries - visitedCountries.length)}개국 더 보기</S.MoreLink> : null}</S.CountryStats></S.MapBody> : null}

        {!isLoading && !hasError && kind === 'claim' ? activeCountry ? <S.ClaimBody>{claimCountries.length > 1 ? <S.CityTabs aria-label="획득할 국가 선택">{claimCountries.map((country) => <button key={country} type="button" className={activeCountry === country ? 'active' : ''} onClick={() => selectCountry(country)}>{country}</button>)}</S.CityTabs> : null}<S.ClaimCountry>{countryCode}</S.ClaimCountry><S.ClaimNew>CLAIM</S.ClaimNew><S.ClaimTitle>{activeCountry} 국가를 획득하세요</S.ClaimTitle><S.ClaimSubtitle>{countryTrips.length ? `${countryTrips.length}개의 여행 기록을 바탕으로 처리합니다.` : '여행 기록을 남기면 국가를 획득할 수 있어요'}</S.ClaimSubtitle><S.ClaimInfo><S.InfoRow><span>국가</span><strong>{activeCountry}</strong></S.InfoRow><S.InfoRow><span>여행 기록</span><strong>{selectedTrip?.title || `${activeCountry} 여행`}</strong></S.InfoRow><S.InfoRow><span>여행 기간</span><strong>{selectedTrip?.startDate || '-'} – {selectedTrip?.endDate || '-'}</strong></S.InfoRow></S.ClaimInfo><S.ClaimNotice>종료된 여행 기록만 국가로 등록할 수 있어요.</S.ClaimNotice><S.ClaimProgress><strong>획득 진행도 <b>{acquiredCount} / {totalCountries || '-'}</b></strong><S.ProgressTrack><S.ProgressBar $progress={achievementPercentage} /></S.ProgressTrack></S.ClaimProgress><S.ActionRow><PartTripButton type="button" disabled={!selectedTrip?.tripId || acquireCountryMutation.isPending} onClick={() => void handleAcquireCountry()}>{acquireCountryMutation.isPending ? '획득 중' : '국가 획득'}</PartTripButton><PartTripButton type="button" $variant="secondary" onClick={() => navigate({ to: paths.profileMap })}>세계지도에서 보기</PartTripButton></S.ActionRow>{claimFeedback ? <S.ClaimSubtitle role="status">{claimFeedback}</S.ClaimSubtitle> : null}</S.ClaimBody> : <S.State>획득할 여행 기록이 없습니다.</S.State> : null}

        {!isLoading && !hasError && kind === 'countries' ? activeCountry ? <S.CountryRecordsLayout><S.CountrySummaryCard><S.CountryCode>{countryCode}</S.CountryCode><h2>{activeCountry}</h2><p>첫 방문 {firstVisit}</p><S.CountryMetrics><div><strong>{activeTrips.length}</strong><span>방문 횟수</span></div><div><strong>{countryCities.length}</strong><span>방문 도시</span></div><div><strong>{countryPhotoCount}</strong><span>총 기록</span></div></S.CountryMetrics><S.CountryProgress><S.ProgressTrack><S.ProgressBar $progress={totalCountries ? acquiredCount / totalCountries * 100 : 0} /></S.ProgressTrack><span>획득 국가 {acquiredCount} / {totalCountries || '-'}</span></S.CountryProgress></S.CountrySummaryCard><S.CountryRecordsPanel>{visitedCountries.length > 1 ? <S.CityTabs aria-label="방문 국가 선택">{visitedCountries.map((country) => <button key={country} type="button" className={activeCountry === country ? 'active' : ''} onClick={() => selectCountry(country)}>{country}</button>)}</S.CityTabs> : null}<S.SectionTitle>방문 도시</S.SectionTitle><S.CityTabs>{countryCities.map((city) => <button key={city} type="button" className={selectedCity === city ? 'active' : ''} onClick={() => setSelectedCity((current) => current === city ? '' : city)}>{city}</button>)}</S.CityTabs><S.SectionTitle>여행 기록</S.SectionTitle><S.CountryRecordList>{activeTrips.map((trip, index) => <S.CountryRecordRow key={trip.tripId ?? index} type="button" onClick={() => trip.tripId && navigate({ params: { recordId: String(trip.tripId) }, to: '/record/$recordId' })}><strong>{trip.title || `${trip.cityName || activeCountry} 여행`}</strong><span>{trip.startDate || '-'} – {trip.endDate || '-'}</span><b aria-hidden="true">›</b></S.CountryRecordRow>)}{activeTrips.length === 0 ? <S.Empty>선택한 국가의 여행 기록이 없습니다.</S.Empty> : null}</S.CountryRecordList></S.CountryRecordsPanel></S.CountryRecordsLayout> : <S.State>방문한 국가가 없습니다.</S.State> : null}

        {!isLoading && !hasError && kind === 'achievements' ? <><S.AchievementSummary><S.AchievementCount $progress={achievementPercentage}><strong>{acquiredCount}</strong><span>국가</span></S.AchievementCount><S.AchievementCopy><span>전 세계 {totalCountries || '-'}개국 중</span><strong>{achievementPercentage.toFixed(1)}% 달성</strong><b>획득 국가 현황</b><em>다음 여행을 기록해보세요.</em></S.AchievementCopy></S.AchievementSummary><S.ContinentSection><S.SectionTitle>대륙별 현황</S.SectionTitle>{continentProgress.length ? continentProgress.map(([name, count, total]) => <S.ContinentRow key={name}><div><strong>{name}</strong><span>{count} / {total}</span></div><S.ProgressTrack><S.ProgressBar $tone={name === '유럽' ? 'accent' : 'primary'} $progress={total ? count / total * 100 : 0} /></S.ProgressTrack></S.ContinentRow>) : <S.Empty>대륙별 현황이 없습니다.</S.Empty>}</S.ContinentSection></> : null}
      </S.Page>
    </AppShell>
  )
}
