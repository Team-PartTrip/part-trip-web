import { useMemo, type KeyboardEvent, type MouseEvent } from 'react'
import { Button as PartTripButton } from '@/shared/ui/parttrip'
import koreaRegionsSvg from '@/shared/assets/figma/korea-regions.svg?raw'
import { isPositiveSafeInteger } from '@/shared/utils'
import type { DomesticRegionVisit } from '../model/profile-insight'

import * as S from './ProfileInsightPage.styles'

type TripRecord = {
  cityName?: string | null
  countryName?: string | null
  endDate?: string | null
  images?: unknown[] | null
  photoCount?: number | null
  startDate?: string | null
  title?: string | null
  tripId?: number | null
}

export function ProfileMapView({
  regions,
  unknownCities,
  onOpenCountries,
  onOpenRecords,
  onOpenYearReview,
  onSelectRegion,
}: {
  regions: DomesticRegionVisit[]
  unknownCities: string[]
  onOpenCountries: () => void
  onOpenRecords: () => void
  onOpenYearReview: () => void
  onSelectRegion: (region: string) => void
}) {
  const regionKey = regions.map((region) => region.mapName).join('|')
  const mapMarkup = useMemo(() => {
    const visited = new Set(regionKey.split('|'))
    return koreaRegionsSvg.replace(
      /<g id="([^"]+)" data-region="([^"]+)" data-visited="false"/g,
      (_group, id: string, name: string) => {
        const hasVisited = visited.has(name)
        return `<g id="${id}" data-region="${name}" data-visited="${hasVisited}" tabindex="0" role="button" aria-label="${name} ${hasVisited ? '방문 기록 보기' : '여행 기록 없음'}">`
      },
    )
  }, [regionKey])
  const selectMapRegion = (event: MouseEvent<HTMLDivElement> | KeyboardEvent<HTMLDivElement>) => {
    if ('key' in event && event.key !== 'Enter' && event.key !== ' ') return
    const target = event.target
    if (!(target instanceof Element)) return
    const region = target.closest<SVGGElement>('[data-region][role="button"]')
    const name = region?.dataset.region
    if (!name) return
    event.preventDefault()
    onSelectRegion(name)
    onOpenCountries()
  }

  return (
    <S.MapBody>
      <S.MapCard>
        <S.SectionTitle>방문한 시·도</S.SectionTitle>
        <S.MapCanvas><S.KoreaMap role="group" aria-label="대한민국 시·도 지도. 지역을 선택하면 여행 기록을 볼 수 있어요." onClick={selectMapRegion} onKeyDown={selectMapRegion} dangerouslySetInnerHTML={{ __html: mapMarkup }} /></S.MapCanvas>
        <S.MapLegend><span><S.LegendDot aria-hidden="true" />미방문</span><span><S.LegendDot $visited aria-hidden="true" />방문 완료</span></S.MapLegend>
      </S.MapCard>
      <S.CountryStats>
        <S.SectionTitle>방문한 지역 {regions.length} / 17</S.SectionTitle>
        {regions.length ? (
          <S.CountrySummaryList>
            {regions.map((region) => (
              <S.CountrySummaryRow key={region.code} type="button" onClick={() => { onSelectRegion(region.name); onOpenCountries() }}>
                <strong>{region.name}</strong>
                <span>{region.trips.length}회 방문 <b>›</b></span>
              </S.CountrySummaryRow>
            ))}
          </S.CountrySummaryList>
        ) : <S.Empty>아직 기록된 국내 여행이 없어요.</S.Empty>}
        {unknownCities.length ? <S.UnknownRegionNotice>지역을 자동으로 연결하지 못한 기록: {unknownCities.join(', ')}</S.UnknownRegionNotice> : null}
        <S.MoreLink type="button" onClick={onOpenRecords}>여행 기록 보기</S.MoreLink>
        <S.MoreLink type="button" onClick={onOpenYearReview}>올해의 여행 돌아보기</S.MoreLink>
      </S.CountryStats>
    </S.MapBody>
  )
}

export function ProfileClaimView({
  acquiredCount,
  activeCountry,
  claimCountries,
  claimFeedback,
  countryCode,
  countryTrips,
  isPending,
  onAcquire,
  onMap,
  onSelectCountry,
  totalCountries,
  achievementPercentage,
}: {
  acquiredCount: number
  achievementPercentage: number
  activeCountry?: string
  claimCountries: string[]
  claimFeedback: string
  countryCode: string
  countryTrips: TripRecord[]
  isPending: boolean
  onAcquire: () => void
  onMap: () => void
  onSelectCountry: (country: string) => void
  totalCountries: number
}) {
  if (!activeCountry) return <S.State>획득할 여행 기록이 없습니다.</S.State>
  const selectedTrip = countryTrips.find((trip) => isPositiveSafeInteger(trip.tripId ?? undefined))

  return (
    <S.ClaimBody>
      {claimCountries.length > 1 ? <S.CityTabs aria-label="획득할 국가 선택">{claimCountries.map((country) => <button key={country} type="button" className={activeCountry === country ? 'active' : ''} onClick={() => onSelectCountry(country)}>{country}</button>)}</S.CityTabs> : null}
      <S.ClaimCountry>{countryCode}</S.ClaimCountry>
      <S.ClaimNew>CLAIM</S.ClaimNew>
      <S.ClaimTitle>{activeCountry} 국가를 획득하세요</S.ClaimTitle>
      <S.ClaimSubtitle>{countryTrips.length ? `${countryTrips.length}개의 여행 기록을 바탕으로 처리합니다.` : '여행 기록을 남기면 국가를 획득할 수 있어요'}</S.ClaimSubtitle>
      <S.ClaimInfo>
        <S.InfoRow><span>국가</span><strong>{activeCountry}</strong></S.InfoRow>
        <S.InfoRow><span>여행 기록</span><strong>{selectedTrip?.title || `${activeCountry} 여행`}</strong></S.InfoRow>
        <S.InfoRow><span>여행 기간</span><strong>{selectedTrip?.startDate || '-'} – {selectedTrip?.endDate || '-'}</strong></S.InfoRow>
      </S.ClaimInfo>
      <S.ClaimNotice>종료된 여행 기록만 국가로 등록할 수 있어요.</S.ClaimNotice>
      <S.ClaimProgress><strong>획득 진행도 <b>{acquiredCount} / {totalCountries || '-'}</b></strong><S.ProgressTrack><S.ProgressBar $progress={achievementPercentage} /></S.ProgressTrack></S.ClaimProgress>
      <S.ActionRow>
        <PartTripButton type="button" disabled={!selectedTrip?.tripId || isPending} onClick={onAcquire}>{isPending ? '획득 중' : '국가 획득'}</PartTripButton>
        <PartTripButton type="button" $variant="secondary" onClick={onMap}>세계지도에서 보기</PartTripButton>
      </S.ActionRow>
      {claimFeedback ? <S.ClaimSubtitle role="status">{claimFeedback}</S.ClaimSubtitle> : null}
    </S.ClaimBody>
  )
}

export function ProfileCountriesView({
  activeRegion,
  regions,
  onOpenRecord,
  onSelectRegion,
}: {
  activeRegion?: DomesticRegionVisit
  regions: DomesticRegionVisit[]
  onOpenRecord: (tripId: number) => void
  onSelectRegion: (region: string) => void
}) {
  if (!activeRegion) return <S.State>지역으로 확인할 수 있는 국내 여행 기록이 없습니다.</S.State>

  const cities = [...new Set(activeRegion.trips.map((trip) => trip.cityName?.trim()).filter((city): city is string => Boolean(city)))]
  const firstVisit = activeRegion.trips.map((trip) => trip.startDate).filter((date): date is string => Boolean(date)).sort()[0]?.replaceAll('-', '.') ?? '-'
  const photoCount = activeRegion.trips.reduce((count, trip) => count + (trip.photoCount ?? trip.images?.length ?? 0), 0)

  return (
    <S.CountryRecordsLayout>
      <S.CountrySummaryCard>
        <S.CountryCode>KR</S.CountryCode>
        <h2>{activeRegion.name}</h2>
        <p>국내 · 첫 방문 {firstVisit}</p>
        <S.CountryMetrics><div><strong>{activeRegion.trips.length}</strong><span>여행 기록</span></div><div><strong>{cities.length}</strong><span>방문 도시</span></div><div><strong>{photoCount}</strong><span>사진 기록</span></div></S.CountryMetrics>
        <S.CountryProgress><S.ProgressTrack><S.ProgressBar $progress={100} /></S.ProgressTrack><span>행정구역 코드 {activeRegion.code}</span></S.CountryProgress>
      </S.CountrySummaryCard>
      <S.CountryRecordsPanel>
        {regions.length > 1 ? <S.CityTabs aria-label="방문 지역 선택">{regions.map((region) => <button key={region.code} type="button" className={activeRegion.code === region.code ? 'active' : ''} aria-pressed={activeRegion.code === region.code} onClick={() => onSelectRegion(region.name)}>{region.name}</button>)}</S.CityTabs> : null}
        <S.SectionTitle>방문 도시</S.SectionTitle>
        <S.CityTabs aria-label="방문 도시">{cities.map((city) => <span key={city}>{city}</span>)}</S.CityTabs>
        <S.SectionTitle>여행 기록</S.SectionTitle>
        <S.CountryRecordList>{activeRegion.trips.map((trip, index) => <S.CountryRecordRow key={trip.tripId ?? index} type="button" disabled={!trip.tripId} onClick={() => trip.tripId && onOpenRecord(trip.tripId)}><strong>{trip.title || `${trip.cityName || activeRegion.name} 여행`}</strong><span>{trip.startDate || '-'} – {trip.endDate || '-'}</span><b aria-hidden="true">›</b></S.CountryRecordRow>)}{activeRegion.trips.length === 0 ? <S.Empty>선택한 지역의 여행 기록이 없습니다.</S.Empty> : null}</S.CountryRecordList>
      </S.CountryRecordsPanel>
    </S.CountryRecordsLayout>
  )
}

export function ProfileAchievementsView({
  summary,
  year,
}: {
  summary: {
    placesVisited: number
    tripCount: number
    mostVisitedName?: string
    mostVisitedCount: number
    longestStayName?: string | null
    longestStayDays: number
    placeVisits: Array<{ name: string; count: number; days: number }>
  }
  year: number
}) {
  return (
    <>
      <S.AchievementSummary><S.AchievementCount $progress={100}><strong>{summary.placesVisited}</strong><span>다녀온 곳</span></S.AchievementCount><S.AchievementCopy><span>{year}년 다녀온 곳</span><strong>{summary.placesVisited}곳</strong><b>가장 여러 번 간 곳 · {summary.mostVisitedName ? `${summary.mostVisitedName} ${summary.mostVisitedCount}회` : '기록 없음'}</b><em>가장 오래 머문 곳 · {summary.longestStayName ? `${summary.longestStayName} ${summary.longestStayDays}일` : '기록 없음'}</em></S.AchievementCopy></S.AchievementSummary>
      <S.ContinentSection><S.SectionTitle>올해의 기록</S.SectionTitle>{summary.placeVisits.length ? summary.placeVisits.map((place) => <S.ContinentRow key={place.name}><div><strong>{place.name}</strong><span>여행 {place.count}회 · 최장 {place.days}일</span></div><S.ProgressTrack><S.ProgressBar $progress={summary.tripCount ? place.count / summary.tripCount * 100 : 0} /></S.ProgressTrack></S.ContinentRow>) : <S.Empty>{year}년 국내 여행 기록이 아직 없어요.</S.Empty>}</S.ContinentSection>
    </>
  )
}
