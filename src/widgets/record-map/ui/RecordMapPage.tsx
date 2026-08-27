import { useNavigate } from '@tanstack/react-router'
import { useMyTrips } from '@/entities/trip-plan'
import { figmaRecordMapPhoto } from '@/shared/assets'
import { paths } from '@/shared/config'
import { formatDate } from '@/shared/utils'
import { Button as PartTripButton } from '@/shared/ui/parttrip'
import { AppShell } from '@/widgets/app-shell'

import * as S from './RecordMapPage.styles'

export function RecordMapPage() {
  const navigate = useNavigate()
  const { hasError, isLoading, trips } = useMyTrips()
  const trip = trips[0]
  const markers = trips.slice(0, 3)

  return (
    <AppShell>
      <S.Page>
        <S.Header><S.Title>여행 기록</S.Title><S.Subtitle>여행의 순간과 이동 경로를 한 화면에서 다시 확인하세요.</S.Subtitle></S.Header>
        <S.RecordTabs aria-label="여행 기록 보기 방식"><button type="button" onClick={() => navigate({ to: paths.record })}>타임라인</button><button type="button" className="active" aria-current="page">지도</button></S.RecordTabs>
        {isLoading ? <S.State aria-busy="true">여행 기록을 불러오는 중입니다.</S.State> : null}
        {hasError ? <S.State role="alert">여행 기록을 불러오지 못했습니다.</S.State> : null}
        {!isLoading && !hasError ? <S.Body><S.RouteMap aria-label="여행 기록 이동 경로"><S.RouteLine />{markers.map((item, index) => <S.MapPin key={item.tripId ?? index} $index={index}><span>{item.cityName || item.countryName || ['난바', '오사카성', '우메다'][index]}</span></S.MapPin>)}<S.MapCaption>{trip ? `${trip.cityName || trip.countryName || '오사카'} · ${formatDate(trip.startDate)}` : '기록된 여행 경로'}</S.MapCaption></S.RouteMap><S.MapDetail>{trip ? <><img src={figmaRecordMapPhoto} alt="해설 카메라 위치" /><h2>해설 카메라 위치</h2><p>{trip.cityName || trip.countryName || '오사카'} · 09/03 · Day 1</p><S.Badge>현재 위치</S.Badge><span>여행 중 남긴 위치와 사진을 타임라인에 저장했습니다.</span><PartTripButton type="button" $variant="secondary" onClick={() => trip.tripId && navigate({ params: { recordId: String(trip.tripId) }, to: '/record/$recordId' })}>기록 보기</PartTripButton></> : <S.Empty>표시할 여행 기록이 없습니다.</S.Empty>}</S.MapDetail></S.Body> : null}
      </S.Page>
    </AppShell>
  )
}
