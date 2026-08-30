import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useMyTrips } from '@/entities/trip-plan'
import { useCountriesQuery } from '@/entities/travel'
import { useWorldMapQuery, useWorldMapStatsQuery } from '@/entities/world-map'
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

const PROFILE_COUNTRY_KEY = 'parttrip:profile-selected-country'
const continentGroups: ReadonlyArray<readonly [string, string]> = [
  ['아프리카', 'DZ AO BJ BW BF BI CM CV CF TD KM CD CG CI DJ EG GQ ER SZ ET GA GM GH GN GW KE LS LR LY MG MW ML MR MU YT MA MZ NA NE NG RE RW SH ST SN SC SL SO ZA SS SD TZ TG TN UG EH ZM ZW'],
  ['아시아', 'AF AM AZ BH BD BT BN KH CN CX CC CY GE HK IN ID IR IQ IL JP JO KZ KW KG LA LB MO MY MV MN MM NP KP OM PK PS PH QA SA SG LK SY TW TJ TH TL TR TM AE UZ VN YE'],
  ['유럽', 'AX AL AD AT BY BE BA BG HR CZ DK FO FI FR DE GI GR GG VA HU IS IE IM IT JE LV LI LT LU MT MD MC ME NL MK NO PL PT RO RU SM RS SK SI ES SJ SE CH UA GB'],
  ['북아메리카', 'AI AG AW BS BB BZ BM BQ CA KY CR CU CW DM DO SV GL GD GP GT HT HN JM MQ MX MS NI PA PR BL KN LC MF PM VC SX TT TC US VI'],
  ['남아메리카', 'AR BO BR CL CO EC FK GF GY PY PE SR GS UY VE'],
  ['오세아니아', 'AS AU CK FJ PF GU KI MH FM NR NC NZ NU NF MP PW PG PN WS SB TK TO TV VU WF'],
  ['남극', 'AQ BV HM TF UM'],
]
const continentByCountryCode: Record<string, string> = Object.fromEntries(
  continentGroups.flatMap(([continent, codes]) => codes.split(' ').map((code) => [code, continent] as const)),
)

function countryVisitCount(country: string, visited: Array<{ countryName?: string; visitCount?: number }> | undefined, trips: Array<{ countryName?: string }>) {
  return visited?.find((item) => item.countryName === country)?.visitCount ?? trips.filter((trip) => trip.countryName === country).length
}

export function ProfileInsightPage({ kind }: { kind: ProfileInsightKind }) {
  const navigate = useNavigate()
  const { hasError: hasTripsError, isLoading: isTripsLoading, trips } = useMyTrips()
  const countriesQuery = useCountriesQuery(kind === 'map' || kind === 'claim')
  const worldMapQuery = useWorldMapQuery(false)
  const worldMapStatsQuery = useWorldMapStatsQuery(false)
  const [selectedCity, setSelectedCity] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(() => sessionStorage.getItem(PROFILE_COUNTRY_KEY) ?? '')
  const isLoading = isTripsLoading || worldMapQuery.isLoading || ((kind === 'map' || kind === 'claim') && countriesQuery.isLoading) || (kind === 'achievements' && worldMapStatsQuery.isLoading)
  const hasError = hasTripsError || worldMapQuery.isError || ((kind === 'map' || kind === 'claim') && countriesQuery.isError) || (kind === 'achievements' && worldMapStatsQuery.isError)
  const visitedCountries = [...new Set((worldMapQuery.data?.visited?.map((country) => country.countryName).filter((country): country is string => Boolean(country)) ?? trips.map((trip) => trip.countryName).filter((country): country is string => Boolean(country))))]
  const activeCountry = visitedCountries.includes(selectedCountry) ? selectedCountry : visitedCountries[0]
  const countryTrips = trips.filter((trip) => trip.countryName === activeCountry)
  const activeTrips = selectedCity ? countryTrips.filter((trip) => trip.cityName === selectedCity) : countryTrips
  const countryCode = worldMapQuery.data?.visited?.find((country) => country.countryName === activeCountry)?.countryCode ?? '--'
  const countryCities = [...new Set(countryTrips.map((trip) => trip.cityName).filter((city): city is string => Boolean(city)))]
  const countryPhotoCount = activeTrips.reduce((total, trip) => total + (trip.images?.length ?? 0), 0)
  const firstVisit = countryTrips.map((trip) => trip.startDate).filter(Boolean).sort()[0]?.replaceAll('-', '.') || '-'
  const catalogCountries = [...new Set((countriesQuery.data ?? []).map((country) => country.countryName).filter(Boolean))]
  const totalCountries = worldMapQuery.data?.totalCountries ?? catalogCountries.length
  const acquiredCount = worldMapStatsQuery.data?.acquiredCount ?? visitedCountries.length
  const achievementPercentage = worldMapStatsQuery.data?.percentage ?? (totalCountries ? acquiredCount / totalCountries * 100 : 0)
  const { title, subtitle } = copy[kind]
  const pageTitle = kind === 'countries' ? activeCountry || '국가별 여행 기록' : title
  const pageSubtitle = kind === 'countries' ? `첫 방문 ${firstVisit}` : kind === 'map' ? `방문한 국가 ${visitedCountries.length}` : subtitle
  const claimCountry = activeCountry
  const continentProgress = worldMapStatsQuery.data?.byContinent?.length
    ? worldMapStatsQuery.data.byContinent.map((item) => [item.continent || '대륙', item.acquiredCount || 0, item.totalCount || 0] as const)
    : []

  const selectCountry = (country: string) => {
    setSelectedCountry(country)
    sessionStorage.setItem(PROFILE_COUNTRY_KEY, country)
    setSelectedCity('')
  }

  return (
    <AppShell>
      <S.Page $wide={kind === 'countries'}>
        {!isLoading && kind !== 'claim' ? <S.Header $wide={kind === 'countries'} $hasSubtitle={Boolean(pageSubtitle)}><S.Title>{pageTitle}</S.Title>{pageSubtitle ? <S.Subtitle>{pageSubtitle}</S.Subtitle> : null}</S.Header> : null}
        {hasError ? <S.State role="alert">여행 기록을 불러오지 못했습니다.</S.State> : null}
        {isLoading ? <S.LoadingLayout aria-busy="true" aria-label="여행 정보 로딩 중"><S.LoadingHeader />{kind === 'map' || kind === 'countries' ? <S.LoadingGrid><S.LoadingPanel /><S.LoadingPanel /></S.LoadingGrid> : <S.LoadingSingle />}</S.LoadingLayout> : null}

        {/* ponytail: the raster map has no country geometry; omit a live legend until the API exposes it. */}
        {!isLoading && !hasError && kind === 'map' ? <S.MapBody><S.MapCard><S.SectionTitle>방문한 국가</S.SectionTitle><S.MapCanvas><img src={figmaWorldMap} alt="방문 국가 세계 지도" /></S.MapCanvas></S.MapCard><S.CountryStats><S.SectionTitle>획득한 국가 {visitedCountries.length} / {totalCountries || '-'}</S.SectionTitle>{visitedCountries.length ? <S.CountrySummaryList>{visitedCountries.slice(0, 3).map((country) => <S.CountrySummaryRow key={country} type="button" onClick={() => { selectCountry(country); navigate({ to: paths.profileCountries }) }}><strong>{country}</strong><span>{countryVisitCount(country, worldMapQuery.data?.visited, trips)}회 방문 <b>›</b></span></S.CountrySummaryRow>)}</S.CountrySummaryList> : <S.Empty>아직 방문한 국가가 없습니다.</S.Empty>}<S.MoreLink type="button" onClick={() => navigate({ to: paths.profileCountries })}>+ {Math.max(0, visitedCountries.length - 3)}개국 더 보기</S.MoreLink></S.CountryStats></S.MapBody> : null}

        {!isLoading && !hasError && kind === 'claim' ? claimCountry ? <S.ClaimBody><S.ClaimCountry>{countryCode}</S.ClaimCountry><S.ClaimNew>NEW</S.ClaimNew><S.ClaimTitle>{claimCountry}을 획득했어요!</S.ClaimTitle><S.ClaimSubtitle>{countryTrips.length ? `${claimCountry} 여행 기록을 바탕으로 표시하고 있어요.` : '여행 기록을 남기면 국가를 획득할 수 있어요'}</S.ClaimSubtitle><S.ClaimInfo><S.InfoRow><span>국가</span><strong>{claimCountry}</strong></S.InfoRow><S.InfoRow><span>대륙</span><strong>{continentByCountryCode[countryCode.toUpperCase()] || '정보 없음'}</strong></S.InfoRow><S.InfoRow><span>첫 방문</span><strong>{countryTrips[0]?.startDate || '-'}</strong></S.InfoRow><S.InfoRow><span>방문 횟수</span><strong>{countryTrips.length}회</strong></S.InfoRow></S.ClaimInfo><S.ClaimNotice>이미 획득한 국가는 중복 등록되지 않아요</S.ClaimNotice><S.ClaimProgress><strong>획득 진행도 <b>{acquiredCount} / {totalCountries || '-'}</b></strong><S.ProgressTrack><S.ProgressBar $progress={achievementPercentage} /></S.ProgressTrack></S.ClaimProgress><S.ActionRow><PartTripButton type="button" $variant="secondary" onClick={() => navigate({ to: paths.profileMap })}>세계지도에서 보기</PartTripButton></S.ActionRow></S.ClaimBody> : <S.State>획득할 국가가 없습니다.</S.State> : null}

        {!isLoading && !hasError && kind === 'countries' ? activeCountry ? <S.CountryRecordsLayout><S.CountrySummaryCard><S.CountryCode>{countryCode}</S.CountryCode><h2>{activeCountry}</h2><p>첫 방문 {firstVisit}</p><S.CountryMetrics><div><strong>{activeTrips.length}</strong><span>방문 횟수</span></div><div><strong>{countryCities.length}</strong><span>방문 도시</span></div><div><strong>{countryPhotoCount}</strong><span>총 기록</span></div></S.CountryMetrics><S.CountryProgress><S.ProgressTrack><S.ProgressBar $progress={totalCountries ? acquiredCount / totalCountries * 100 : 0} /></S.ProgressTrack><span>획득 국가 {acquiredCount} / {totalCountries || '-'}</span></S.CountryProgress></S.CountrySummaryCard><S.CountryRecordsPanel>{visitedCountries.length > 1 ? <S.CityTabs aria-label="방문 국가 선택">{visitedCountries.map((country) => <button key={country} type="button" className={activeCountry === country ? 'active' : ''} onClick={() => selectCountry(country)}>{country}</button>)}</S.CityTabs> : null}<S.SectionTitle>방문 도시</S.SectionTitle><S.CityTabs>{countryCities.map((city) => <button key={city} type="button" className={selectedCity === city ? 'active' : ''} onClick={() => setSelectedCity((current) => current === city ? '' : city)}>{city}</button>)}</S.CityTabs><S.SectionTitle>여행 기록</S.SectionTitle><S.CountryRecordList>{activeTrips.map((trip, index) => <S.CountryRecordRow key={trip.tripId ?? index} type="button" onClick={() => trip.tripId && navigate({ params: { recordId: String(trip.tripId) }, to: '/record/$recordId' })}><strong>{trip.title || `${trip.cityName || activeCountry} 여행`}</strong><span>{trip.startDate || '-'} – {trip.endDate || '-'}</span><b aria-hidden="true">›</b></S.CountryRecordRow>)}{activeTrips.length === 0 ? <S.Empty>선택한 국가의 여행 기록이 없습니다.</S.Empty> : null}</S.CountryRecordList></S.CountryRecordsPanel></S.CountryRecordsLayout> : <S.State>방문한 국가가 없습니다.</S.State> : null}

        {!isLoading && !hasError && kind === 'achievements' ? <><S.AchievementSummary><S.AchievementCount $progress={achievementPercentage}><strong>{acquiredCount}</strong><span>국가</span></S.AchievementCount><S.AchievementCopy><span>전 세계 {totalCountries || '-'}개국 중</span><strong>{achievementPercentage.toFixed(1)}% 달성</strong><b>획득 국가 현황</b><em>다음 여행을 기록해보세요.</em></S.AchievementCopy></S.AchievementSummary><S.ContinentSection><S.SectionTitle>대륙별 현황</S.SectionTitle>{continentProgress.length ? continentProgress.map(([name, count, total]) => <S.ContinentRow key={name}><div><strong>{name}</strong><span>{count} / {total}</span></div><S.ProgressTrack><S.ProgressBar $tone={name === '유럽' ? 'accent' : 'primary'} $progress={total ? count / total * 100 : 0} /></S.ProgressTrack></S.ContinentRow>) : <S.Empty>대륙별 현황이 없습니다.</S.Empty>}</S.ContinentSection></> : null}
      </S.Page>
    </AppShell>
  )
}
