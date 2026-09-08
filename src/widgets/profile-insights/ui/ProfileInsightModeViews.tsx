import { Button as PartTripButton } from '@/shared/ui/parttrip'
import { WorldMap } from '@/shared/ui'
import { isPositiveSafeInteger } from '@/shared/utils'

import * as S from './ProfileInsightPage.styles'

type TripRecord = {
  cityName?: string | null
  countryName?: string | null
  endDate?: string | null
  images?: unknown[] | null
  startDate?: string | null
  title?: string | null
  tripId?: number | null
}

type VisitedCountry = {
  countryCode?: string | null
  countryName?: string | null
}

export function ProfileMapView({
  totalCountries,
  trips,
  visited,
  visitedCountries,
  onOpenCountries,
  onSelectCountry,
}: {
  totalCountries: number
  trips: TripRecord[]
  visited: VisitedCountry[]
  visitedCountries: string[]
  onOpenCountries: () => void
  onSelectCountry: (country: string) => void
}) {
  const countryCodes = visited
    .map((country) => country.countryCode)
    .filter((code): code is string => Boolean(code))

  return (
    <S.MapBody>
      <S.MapCard>
        <S.SectionTitle>방문한 국가</S.SectionTitle>
        <S.MapCanvas><WorldMap ariaLabel="방문 국가 세계 지도" countryCodes={countryCodes} /></S.MapCanvas>
      </S.MapCard>
      <S.CountryStats>
        <S.SectionTitle>획득한 국가 {visitedCountries.length} / {totalCountries || '-'}</S.SectionTitle>
        {visitedCountries.length ? (
          <S.CountrySummaryList>
            {visitedCountries.slice(0, 3).map((country) => (
              <S.CountrySummaryRow key={country} type="button" onClick={() => { onSelectCountry(country); onOpenCountries() }}>
                <strong>{country}</strong>
                <span>{trips.filter((trip) => trip.countryName === country).length}회 방문 <b>›</b></span>
              </S.CountrySummaryRow>
            ))}
          </S.CountrySummaryList>
        ) : <S.Empty>아직 방문한 국가가 없습니다.</S.Empty>}
        {visitedCountries.length < totalCountries ? <S.MoreLink type="button" onClick={onOpenCountries}>+ {Math.max(0, totalCountries - visitedCountries.length)}개국 더 보기</S.MoreLink> : null}
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
  activeCountry,
  acquiredCount,
  countryCities,
  countryCode,
  firstVisit,
  onOpenRecord,
  onSelectCity,
  onSelectCountry,
  selectedCity,
  totalCountries,
  visitedCountries,
  trips,
}: {
  activeCountry?: string
  acquiredCount: number
  countryCities: string[]
  countryCode: string
  firstVisit: string
  onOpenRecord: (tripId: number) => void
  onSelectCity: (city: string) => void
  onSelectCountry: (country: string) => void
  selectedCity: string
  totalCountries: number
  visitedCountries: string[]
  trips: TripRecord[]
}) {
  if (!activeCountry) return <S.State>방문한 국가가 없습니다.</S.State>

  const activeTrips = selectedCity ? trips.filter((trip) => trip.cityName === selectedCity) : trips
  const countryPhotoCount = activeTrips.reduce((total, trip) => total + (trip.images?.length ?? 0), 0)

  return (
    <S.CountryRecordsLayout>
      <S.CountrySummaryCard>
        <S.CountryCode>{countryCode}</S.CountryCode>
        <h2>{activeCountry}</h2>
        <p>첫 방문 {firstVisit}</p>
        <S.CountryMetrics><div><strong>{activeTrips.length}</strong><span>방문 횟수</span></div><div><strong>{countryCities.length}</strong><span>방문 도시</span></div><div><strong>{countryPhotoCount}</strong><span>총 기록</span></div></S.CountryMetrics>
        <S.CountryProgress><S.ProgressTrack><S.ProgressBar $progress={totalCountries ? acquiredCount / totalCountries * 100 : 0} /></S.ProgressTrack><span>획득 국가 {acquiredCount} / {totalCountries || '-'}</span></S.CountryProgress>
      </S.CountrySummaryCard>
      <S.CountryRecordsPanel>
        {visitedCountries.length > 1 ? <S.CityTabs aria-label="방문 국가 선택">{visitedCountries.map((country) => <button key={country} type="button" className={activeCountry === country ? 'active' : ''} onClick={() => onSelectCountry(country)}>{country}</button>)}</S.CityTabs> : null}
        <S.SectionTitle>방문 도시</S.SectionTitle>
        <S.CityTabs>{countryCities.map((city) => <button key={city} type="button" className={selectedCity === city ? 'active' : ''} onClick={() => onSelectCity(selectedCity === city ? '' : city)}>{city}</button>)}</S.CityTabs>
        <S.SectionTitle>여행 기록</S.SectionTitle>
        <S.CountryRecordList>{activeTrips.map((trip, index) => <S.CountryRecordRow key={trip.tripId ?? index} type="button" onClick={() => trip.tripId && onOpenRecord(trip.tripId)}><strong>{trip.title || `${trip.cityName || activeCountry} 여행`}</strong><span>{trip.startDate || '-'} – {trip.endDate || '-'}</span><b aria-hidden="true">›</b></S.CountryRecordRow>)}{activeTrips.length === 0 ? <S.Empty>선택한 국가의 여행 기록이 없습니다.</S.Empty> : null}</S.CountryRecordList>
      </S.CountryRecordsPanel>
    </S.CountryRecordsLayout>
  )
}

export function ProfileAchievementsView({
  acquiredCount,
  achievementPercentage,
  continentProgress,
  totalCountries,
}: {
  acquiredCount: number
  achievementPercentage: number
  continentProgress: Array<readonly [string, number, number]>
  totalCountries: number
}) {
  return (
    <>
      <S.AchievementSummary><S.AchievementCount $progress={achievementPercentage}><strong>{acquiredCount}</strong><span>국가</span></S.AchievementCount><S.AchievementCopy><span>전 세계 {totalCountries || '-'}개국 중</span><strong>{achievementPercentage.toFixed(1)}% 달성</strong><b>획득 국가 현황</b><em>다음 여행을 기록해보세요.</em></S.AchievementCopy></S.AchievementSummary>
      <S.ContinentSection><S.SectionTitle>대륙별 현황</S.SectionTitle>{continentProgress.length ? continentProgress.map(([name, count, total]) => <S.ContinentRow key={name}><div><strong>{name}</strong><span>{count} / {total}</span></div><S.ProgressTrack><S.ProgressBar $tone={name === '유럽' ? 'accent' : 'primary'} $progress={total ? count / total * 100 : 0} /></S.ProgressTrack></S.ContinentRow>) : <S.Empty>대륙별 현황이 없습니다.</S.Empty>}</S.ContinentSection>
    </>
  )
}
