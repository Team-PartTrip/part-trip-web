import { useMemo, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useMyTravelRecords, useTravelRecordQuery } from '@/entities/trip-card'
import { Button } from '@/shared/ui/parttrip'
import { formatDate } from '@/shared/utils'
import { getKakaoMapUrl } from '@/widgets/planner/model/schedule-edit'
import { paths } from '@/shared/config'
import { AppShell } from '@/widgets/app-shell'

import { getRecordLocations } from '../model/record-map'
import { hasMapCoordinates } from '@/shared/libs/kakao-maps'
import { RecordLocationMap } from './RecordLocationMap'
import * as S from './RecordMapPage.styles'

export function RecordMapPage() {
  const navigate = useNavigate()
  const tripsQuery = useMyTravelRecords()
  const { trips } = tripsQuery
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null)
  const [selectedTripId, setSelectedTripId] = useState<number>()
  const tripSummary = trips.find((item) => item.tripId === selectedTripId) ?? trips[0]
  const tripQuery = useTravelRecordQuery(Number(tripSummary?.tripId))
  const trip = tripQuery.data ?? tripSummary
  const isLoading = tripsQuery.isLoading || (tripSummary?.tripId != null && tripQuery.isLoading)
  const hasError = tripsQuery.hasError || tripQuery.isError
  const title = trip ? [trip.regionName || trip.countryName, trip.cityName].filter(Boolean).join(' · ') || '여행 기록' : '여행 기록'
  const locations = useMemo(() => getRecordLocations(tripQuery.data?.timeline), [tripQuery.data?.timeline])
  const locationCount = locations.length

  return (
    <AppShell>
      <S.Page>
        {isLoading ? <S.LoadingLayout aria-busy="true" aria-label="여행 지도 로딩 중"><S.LoadingHeader /><S.LoadingTabs /><S.LoadingBody><S.LoadingMap /><S.LoadingLocations /></S.LoadingBody></S.LoadingLayout> : <>
          <S.Header>
            <div><S.Title>{title}</S.Title><S.Subtitle>방문 장소 {locationCount}곳</S.Subtitle></div>
            {trips.length > 1 ? <S.TripSelect aria-label="지도에 표시할 여행 선택" value={trip?.tripId ?? ''} onChange={(event) => { setSelectedLocation(null); setSelectedTripId(Number(event.target.value)) }}>{trips.map((item) => <option key={item.tripId} value={item.tripId}>{item.title || `${item.cityName || item.regionName || item.countryName || '여행'} 기록`}</option>)}</S.TripSelect> : null}
          </S.Header>
          <S.RecordTabs aria-label="여행 기록 보기 방식">
            <button type="button" className="active" aria-current="page">지도</button>
            <button type="button" onClick={() => navigate({ to: paths.record })}>목록</button>
          </S.RecordTabs>

          {hasError ? <S.State role="alert">여행 기록을 불러오지 못했어요. <Button type="button" disabled={tripsQuery.isFetching || tripQuery.isFetching} onClick={() => { void tripsQuery.refetch(); if (tripSummary?.tripId) void tripQuery.refetch() }}>다시 시도</Button></S.State> : null}
        {!hasError ? (
          <S.Body>
            <S.MapPanel>
              <S.MapTitle>{title}</S.MapTitle>
              <S.MapSubtitle>방문 장소 {locationCount}곳</S.MapSubtitle>
              <RecordLocationMap key={trip?.tripId} locations={locations} selectedIndex={selectedLocation} onSelect={setSelectedLocation} />
            </S.MapPanel>
            <S.LocationPanel>
              <S.LocationTitle>방문 장소</S.LocationTitle>
              {locations.map((location, index) => (
                <div key={`${location.name}-${index}`}>
                  <S.LocationCard type="button" aria-pressed={selectedLocation === index} onClick={() => hasMapCoordinates(location) ? setSelectedLocation(index) : trip?.tripId && void navigate({ params: { recordId: String(trip.tripId) }, to: '/record/$recordId' })}>
                    <span><strong>{location.name}</strong><small>{formatDate(location.photos)}</small></span><b aria-hidden="true">›</b>
                  </S.LocationCard>
                  <a href={getKakaoMapUrl('PUBLIC_TRANSIT', location.name, location.latitude, location.longitude)} target="_blank" rel="noreferrer">{location.name} 지도 보기</a>
                </div>
              ))}
              {locations.length === 0 ? <S.State>방문한 장소가 없어요.</S.State> : null}
            </S.LocationPanel>
          </S.Body>
        ) : null}
        </>}
      </S.Page>
    </AppShell>
  )
}
