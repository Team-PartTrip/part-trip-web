import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useMyTrips } from '@/entities/trip-plan'
import { useCountriesQuery } from '@/entities/travel'
import { useAcquireCountryMutation, useWorldMapQuery, useWorldMapStatsQuery } from '@/entities/world-map'
import { figmaWorldMap } from '@/shared/assets'
import { paths } from '@/shared/config'
import { Button as PartTripButton } from '@/shared/ui/parttrip'
import { AppShell } from '@/widgets/app-shell'

import * as S from './ProfileInsightPage.styles'

export type ProfileInsightKind = 'map' | 'claim' | 'countries' | 'achievements'

const copy: Record<ProfileInsightKind, { title: string; subtitle: string }> = {
  map: { title: '내 세계지도', subtitle: '방문한 국가 5' },
  claim: { title: '방문 국가 획득', subtitle: '여행 기록을 남기고 새로운 나라를 획득하세요.' },
  countries: { title: '국가별 여행 기록', subtitle: '나라를 선택하면 해당 국가의 여행 기록을 모아봅니다.' },
  achievements: { title: '여행 달성 현황', subtitle: '' },
}

export function ProfileInsightPage({ kind }: { kind: ProfileInsightKind }) {
  const navigate = useNavigate()
  const { hasError: hasTripsError, isLoading: isTripsLoading, trips } = useMyTrips()
  const countriesQuery = useCountriesQuery(kind === 'map' || kind === 'claim')
  const worldMapQuery = useWorldMapQuery()
  const worldMapStatsQuery = useWorldMapStatsQuery(kind === 'achievements' || kind === 'claim' || kind === 'map')
  const [selectedCity, setSelectedCity] = useState('')
  const [claimMessage, setClaimMessage] = useState('')
  const acquireCountryMutation = useAcquireCountryMutation()
  const isLoading = isTripsLoading || worldMapQuery.isLoading || ((kind === 'map' || kind === 'claim') && countriesQuery.isLoading) || (kind === 'achievements' && worldMapStatsQuery.isLoading)
  const hasError = hasTripsError || worldMapQuery.isError || ((kind === 'map' || kind === 'claim') && countriesQuery.isError) || (kind === 'achievements' && worldMapStatsQuery.isError)
  const visitedCountries = [...new Set((worldMapQuery.data?.visited?.map((country) => country.countryName).filter(Boolean) ?? trips.map((trip) => trip.countryName).filter(Boolean)))]
  const activeCountry = visitedCountries[0]
  const countryTrips = trips.filter((trip) => trip.countryName === activeCountry)
  const activeTrips = selectedCity ? countryTrips.filter((trip) => trip.cityName === selectedCity) : countryTrips
  const countryCode = worldMapQuery.data?.visited?.find((country) => country.countryName === activeCountry)?.countryCode ?? '--'
  const countryCities = [...new Set(countryTrips.map((trip) => trip.cityName).filter((city): city is string => Boolean(city)))]
  const countryPhotoCount = activeTrips.reduce((total, trip) => total + (trip.images?.length ?? 0), 0)
  const firstVisit = countryTrips.map((trip) => trip.startDate).filter(Boolean).sort()[0]?.slice(0, 7).replace('-', '.') || '-'
  const catalogCountries = [...new Set((countriesQuery.data ?? []).map((country) => country.countryName).filter(Boolean))]
  const totalCountries = worldMapQuery.data?.totalCountries ?? catalogCountries.length
  const acquiredCount = worldMapStatsQuery.data?.acquiredCount ?? visitedCountries.length
  const achievementPercentage = worldMapStatsQuery.data?.percentage ?? (totalCountries ? acquiredCount / totalCountries * 100 : 0)
  const { title, subtitle } = copy[kind]
  const pageTitle = kind === 'countries' ? activeCountry || '국가별 여행 기록' : title
  const pageSubtitle = kind === 'countries' ? `아시아 · 첫 방문 ${firstVisit}` : kind === 'map' ? `방문한 국가 ${visitedCountries.length}` : subtitle
  const claimCountry = activeCountry
  const continentProgress = worldMapStatsQuery.data?.byContinent?.length
    ? worldMapStatsQuery.data.byContinent.map((item) => [item.continent || '대륙', item.acquiredCount || 0, item.totalCount || 0] as const)
    : []

  const handleClaimCountry = async () => {
    const tripId = countryTrips[0]?.tripId
    if (tripId == null) {
      setClaimMessage('획득할 여행 기록이 없습니다.')
      return
    }
    try {
      setClaimMessage('')
      const result = await acquireCountryMutation.mutateAsync({ tripId })
      setClaimMessage(result.isNew === false ? '이미 획득한 국가입니다.' : '국가를 획득했습니다.')
    } catch {
      setClaimMessage('국가 획득에 실패했습니다.')
    }
  }

  return (
    <AppShell>
      <S.Page $wide={kind === 'countries'}>
        {!isLoading && kind !== 'claim' ? <S.Header><S.Title>{pageTitle}</S.Title>{pageSubtitle ? <S.Subtitle>{pageSubtitle}</S.Subtitle> : null}</S.Header> : null}
        {hasError ? <S.State role="alert">여행 기록을 불러오지 못했습니다.</S.State> : null}
        {isLoading ? <S.LoadingLayout aria-busy="true" aria-label="여행 정보 로딩 중"><S.LoadingHeader />{kind === 'map' || kind === 'countries' ? <S.LoadingGrid><S.LoadingPanel /><S.LoadingPanel /></S.LoadingGrid> : <S.LoadingSingle />}</S.LoadingLayout> : null}

        {!isLoading && !hasError && kind === 'map' ? <S.MapBody><S.MapCard><S.SectionTitle>방문한 국가</S.SectionTitle><img src={figmaWorldMap} alt="방문 국가 세계 지도" /><S.MapLegend><S.LegendItem><S.LegendDot $visited={false} />미방문</S.LegendItem><S.LegendItem><S.LegendDot $visited />방문한 국가</S.LegendItem></S.MapLegend></S.MapCard><S.CountryStats><S.SectionTitle>획득한 국가 {visitedCountries.length} / {totalCountries || '-'}</S.SectionTitle>{visitedCountries.length ? <S.CountrySummaryList>{visitedCountries.slice(0, 3).map((country) => <S.CountrySummaryRow key={country}><strong>{country}</strong><span>방문 기록 있음 <b>›</b></span></S.CountrySummaryRow>)}</S.CountrySummaryList> : <S.Empty>아직 방문한 국가가 없습니다.</S.Empty>}<S.MoreLink type="button" onClick={() => navigate({ to: paths.profileCountries })}>+ {Math.max(0, totalCountries - 3)}개국 더 보기</S.MoreLink></S.CountryStats></S.MapBody> : null}

        {!isLoading && !hasError && kind === 'claim' ? claimCountry ? <S.ClaimBody><S.ClaimCountry>{countryCode}</S.ClaimCountry><S.ClaimNew>NEW</S.ClaimNew><S.ClaimTitle>{claimCountry}을 획득했어요!</S.ClaimTitle><S.ClaimSubtitle>{countryTrips.length ? `${claimCountry} 여행 기록을 바탕으로 자동 등록됐어요` : '여행 기록을 남기면 국가를 획득할 수 있어요'}</S.ClaimSubtitle><S.ClaimInfo><S.InfoRow><span>국가</span><strong>{claimCountry}</strong></S.InfoRow><S.InfoRow><span>대륙</span><strong>아시아</strong></S.InfoRow><S.InfoRow><span>첫 방문</span><strong>{countryTrips[0]?.startDate || '-'}</strong></S.InfoRow><S.InfoRow><span>방문 횟수</span><strong>{countryTrips.length}회</strong></S.InfoRow></S.ClaimInfo><S.ClaimNotice>이미 획득한 국가는 중복 등록되지 않아요</S.ClaimNotice><S.ClaimProgress><strong>획득 진행도 <b>{acquiredCount} / {totalCountries || '-'}</b></strong><S.ProgressTrack><S.ProgressBar $progress={achievementPercentage} /></S.ProgressTrack></S.ClaimProgress><S.ActionRow><PartTripButton type="button" disabled={acquireCountryMutation.isPending || countryTrips[0]?.tripId == null} onClick={() => void handleClaimCountry()}>{acquireCountryMutation.isPending ? '획득 중' : '국가 획득하기'}</PartTripButton><PartTripButton type="button" $variant="secondary" onClick={() => navigate({ to: paths.profileMap })}>세계지도에서 보기</PartTripButton></S.ActionRow>{claimMessage ? <S.ClaimNotice role="status">{claimMessage}</S.ClaimNotice> : null}</S.ClaimBody> : <S.State>획득할 국가가 없습니다.</S.State> : null}

        {!isLoading && !hasError && kind === 'countries' ? activeCountry ? <S.CountryRecordsLayout><S.CountrySummaryCard><S.CountryCode>{countryCode}</S.CountryCode><h2>{activeCountry}</h2><p>아시아 · 첫 방문 {firstVisit}</p><S.CountryMetrics><div><strong>{activeTrips.length}</strong><span>방문 횟수</span></div><div><strong>{countryCities.length}</strong><span>방문 도시</span></div><div><strong>{countryPhotoCount}</strong><span>총 기록</span></div></S.CountryMetrics><S.CountryProgress><S.ProgressTrack><S.ProgressBar $progress={totalCountries ? acquiredCount / totalCountries * 100 : 0} /></S.ProgressTrack><span>획득 국가 {acquiredCount} / {totalCountries || '-'}</span></S.CountryProgress></S.CountrySummaryCard><S.CountryRecordsPanel><S.SectionTitle>방문 도시</S.SectionTitle><S.CityTabs>{countryCities.map((city) => <button key={city} type="button" className={selectedCity === city ? 'active' : ''} onClick={() => setSelectedCity((current) => current === city ? '' : city)}>{city}</button>)}</S.CityTabs><S.SectionTitle>여행 기록</S.SectionTitle><S.CountryRecordList>{activeTrips.map((trip, index) => <S.CountryRecordRow key={trip.tripId ?? index} type="button" onClick={() => trip.tripId && navigate({ params: { recordId: String(trip.tripId) }, to: '/record/$recordId' })}><strong>{trip.title || `${trip.cityName || activeCountry} 여행`}</strong><span>{trip.startDate || '-'} – {trip.endDate || '-'}</span><b aria-hidden="true">›</b></S.CountryRecordRow>)}{activeTrips.length === 0 ? <S.Empty>선택한 국가의 여행 기록이 없습니다.</S.Empty> : null}</S.CountryRecordList></S.CountryRecordsPanel></S.CountryRecordsLayout> : <S.State>방문한 국가가 없습니다.</S.State> : null}

        {!isLoading && !hasError && kind === 'achievements' ? <><S.AchievementSummary><S.AchievementCount $progress={achievementPercentage}><strong>{acquiredCount}</strong><span>국가</span></S.AchievementCount><S.AchievementCopy><span>전 세계 {totalCountries || '-'}개국 중</span><strong>{achievementPercentage.toFixed(1)}% 달성</strong><b>획득 국가 현황</b><em>다음 여행을 기록해보세요.</em></S.AchievementCopy></S.AchievementSummary><S.ContinentSection><S.SectionTitle>대륙별 현황</S.SectionTitle>{continentProgress.length ? continentProgress.map(([name, count, total]) => <S.ContinentRow key={name}><div><strong>{name}</strong><span>{count} / {total}</span></div><S.ProgressTrack><S.ProgressBar $progress={total ? count / total * 100 : 0} /></S.ProgressTrack></S.ContinentRow>) : <S.Empty>대륙별 현황이 없습니다.</S.Empty>}</S.ContinentSection></> : null}
      </S.Page>
    </AppShell>
  )
}
