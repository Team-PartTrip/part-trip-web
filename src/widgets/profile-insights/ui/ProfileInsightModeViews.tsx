import { formatDate } from '@/shared/utils'
import type { DomesticRegionVisit } from '../model/profile-insight'

import * as S from './ProfileInsightPage.styles'

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
  const firstVisit = formatDate(activeRegion.trips.map((trip) => trip.startDate).filter((date): date is string => Boolean(date)).sort()[0])
  const photoCount = activeRegion.trips.reduce((count, trip) => count + (trip.photoCount ?? trip.images?.length ?? 0), 0)

  return (
    <S.CountryRecordsLayout>
      <S.CountrySummaryCard>
        <S.CountryCode>국내</S.CountryCode>
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
