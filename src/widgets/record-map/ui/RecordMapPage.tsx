import { useNavigate } from '@tanstack/react-router'
import { useMyTrips } from '@/entities/trip-plan'
import { figmaRecordMap } from '@/shared/assets'
import { paths } from '@/shared/config'
import { AppShell } from '@/widgets/app-shell'

import * as S from './RecordMapPage.styles'

const markerPositions = [
  { left: 54, top: 88 },
  { left: 80, top: 58 },
  { left: 60, top: 93 },
  { left: 87, top: 72 },
]

export function RecordMapPage() {
  const navigate = useNavigate()
  const { hasError, isLoading, trips } = useMyTrips()
  const trip = trips[0]
  const title = trip ? [trip.countryName, trip.cityName].filter(Boolean).join(' · ') || '여행 기록' : '여행 기록'
  const locations = trip?.places?.flatMap((place, index) => place.placeName ? [{
    name: place.placeName,
    photos: `Day ${place.dayNumber ?? index + 1}`,
  }] : []) ?? []
  const locationCount = locations.length

  return (
    <AppShell>
      <S.Page>
        {isLoading ? <S.LoadingLayout aria-busy="true" aria-label="여행 지도 로딩 중"><S.LoadingHeader /><S.LoadingTabs /><S.LoadingBody><S.LoadingMap /><S.LoadingLocations /></S.LoadingBody></S.LoadingLayout> : <>
          <S.Header>
            <S.Title>{title}</S.Title>
            <S.Subtitle>촬영 위치 {locationCount}곳</S.Subtitle>
          </S.Header>
          <S.RecordTabs aria-label="여행 기록 보기 방식">
            <button type="button" className="active" aria-current="page">지도</button>
            <button type="button" onClick={() => navigate({ to: paths.record })}>목록</button>
          </S.RecordTabs>

          {hasError ? <S.State role="alert">여행 기록을 불러오지 못했습니다.</S.State> : null}
        {!hasError ? (
          <S.Body>
            <S.MapPanel>
              <S.MapTitle>{title}</S.MapTitle>
              <S.MapSubtitle>촬영 위치 {locationCount}곳</S.MapSubtitle>
              <S.MapCanvas aria-label={`${title} 촬영 위치 지도`}>
                <img src={figmaRecordMap} alt="오사카 도심 지도" />
                {locations.length > 1 ? <S.RouteSegment $left={54} $top={88} $length={8} $angle={40} aria-hidden="true" /> : null}
                {locations.length > 2 ? <S.RouteSegment $left={60} $top={93} $length={40} $angle={-60} aria-hidden="true" /> : null}
                {markerPositions.slice(0, locations.length).map((marker, index) => (
                  <S.MarkerGroup key={`${locations[index].name}-${index}`} $left={marker.left} $top={marker.top}>
                    <S.MapMarker data-number={String(index + 1)} aria-label={`${locations[index].name} 촬영 위치`} />
                    <S.MapLabel>{locations[index].name}</S.MapLabel>
                  </S.MarkerGroup>
                ))}
              </S.MapCanvas>
            </S.MapPanel>
            <S.LocationPanel>
              <S.LocationTitle>촬영 위치</S.LocationTitle>
              {locations.map((location, index) => (
                <S.LocationCard key={`${location.name}-${index}`} type="button" onClick={() => trip?.tripId && navigate({ params: { recordId: String(trip.tripId) }, to: '/record/$recordId' })}>
                  <span>
                    <strong>{location.name}</strong>
                    <small>{location.photos}</small>
                  </span>
                  <b aria-hidden="true">›</b>
                </S.LocationCard>
              ))}
              {locations.length === 0 ? <S.State>촬영된 위치가 없습니다.</S.State> : null}
            </S.LocationPanel>
          </S.Body>
        ) : null}
        </>}
      </S.Page>
    </AppShell>
  )
}
