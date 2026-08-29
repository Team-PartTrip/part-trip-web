import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useMyTrips } from '@/entities/trip-plan'
import { figmaRecordMap } from '@/shared/assets'
import { paths } from '@/shared/config'
import { AppShell } from '@/widgets/app-shell'

import * as S from './RecordMapPage.styles'

// ponytail: the bundled raster map is Osaka-only; replace with a real map viewport for other cities.
const OSAKA_MAP_BOUNDS = {
  east: 135.6,
  north: 34.75,
  south: 34.6,
  west: 135.42,
}

function mapPosition(latitude?: number, longitude?: number) {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null
  if (latitude! < OSAKA_MAP_BOUNDS.south || latitude! > OSAKA_MAP_BOUNDS.north || longitude! < OSAKA_MAP_BOUNDS.west || longitude! > OSAKA_MAP_BOUNDS.east) return null
  return {
    left: (longitude! - OSAKA_MAP_BOUNDS.west) / (OSAKA_MAP_BOUNDS.east - OSAKA_MAP_BOUNDS.west) * 100,
    top: (OSAKA_MAP_BOUNDS.north - latitude!) / (OSAKA_MAP_BOUNDS.north - OSAKA_MAP_BOUNDS.south) * 100,
  }
}

function routeSegment(start: { left: number; top: number }, end: { left: number; top: number }) {
  const deltaX = end.left - start.left
  const deltaY = end.top - start.top
  return {
    angle: Math.atan2(deltaY, deltaX) * 180 / Math.PI,
    left: start.left,
    length: Math.hypot(deltaX, deltaY),
    top: start.top,
  }
}

export function RecordMapPage() {
  const navigate = useNavigate()
  const { hasError, isLoading, trips } = useMyTrips()
  const [selectedTripId, setSelectedTripId] = useState<number>()
  const trip = trips.find((item) => item.tripId === selectedTripId) ?? trips[0]
  const title = trip ? [trip.countryName, trip.cityName].filter(Boolean).join(' · ') || '여행 기록' : '여행 기록'
  const locations = trip?.places?.flatMap((place, index) => place.placeName ? [{
    latitude: place.latitude,
    longitude: place.longitude,
    name: place.placeName,
    photos: `Day ${place.dayNumber ?? index + 1}`,
  }] : []) ?? []
  const mappedLocations = locations.flatMap((location) => {
    const position = mapPosition(location.latitude, location.longitude)
    return position ? [{ ...location, ...position }] : []
  })
  const canRenderMap = trip?.cityName === '오사카' && mappedLocations.length > 0
  const locationCount = locations.length

  return (
    <AppShell>
      <S.Page>
        {isLoading ? <S.LoadingLayout aria-busy="true" aria-label="여행 지도 로딩 중"><S.LoadingHeader /><S.LoadingTabs /><S.LoadingBody><S.LoadingMap /><S.LoadingLocations /></S.LoadingBody></S.LoadingLayout> : <>
          <S.Header>
            <div><S.Title>{title}</S.Title><S.Subtitle>촬영 위치 {locationCount}곳</S.Subtitle></div>
            {trips.length > 1 ? <S.TripSelect aria-label="지도에 표시할 여행 선택" value={trip?.tripId ?? ''} onChange={(event) => setSelectedTripId(Number(event.target.value))}>{trips.map((item) => <option key={item.tripId} value={item.tripId}>{item.title || `${item.cityName || item.countryName || '여행'} 기록`}</option>)}</S.TripSelect> : null}
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
                {canRenderMap ? <><img src={figmaRecordMap} alt={`${title} 도심 지도`} />{mappedLocations.slice(1).map((location, index) => { const segment = routeSegment(mappedLocations[index], location); return <S.RouteSegment key={`${location.name}-${index}`} $left={segment.left} $top={segment.top} $length={segment.length} $angle={segment.angle} aria-hidden="true" /> })}{mappedLocations.map((location, index) => <S.MarkerGroup key={`${location.name}-${index}`} $left={location.left} $top={location.top}><S.MapMarker data-number={String(index + 1)} aria-label={`${location.name} 촬영 위치`} /><S.MapLabel>{location.name}</S.MapLabel></S.MarkerGroup>)}</> : <S.MapState>{!trip ? '표시할 여행 기록이 없습니다.' : mappedLocations.length === 0 ? '위치 좌표가 있는 기록이 없어 지도를 표시할 수 없습니다.' : '현재 지역의 지도 배경을 지원하지 않습니다.'}</S.MapState>}
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
