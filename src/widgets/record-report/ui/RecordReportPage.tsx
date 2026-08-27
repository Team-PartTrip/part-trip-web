import { useNavigate } from '@tanstack/react-router'
import { useMyTrips } from '@/entities/trip-plan'
import { figmaHomeHero, figmaRecordDetail, figmaRecordMapPhoto } from '@/shared/assets'
import { paths } from '@/shared/config'
import { AppShell } from '@/widgets/app-shell'

import * as S from './RecordReportPage.styles'

export function RecordReportPage() {
  const navigate = useNavigate()
  const { hasError, isLoading, trips } = useMyTrips()
  const trip = trips[0]
  const photos = trip?.images?.length ? trip.images.slice(0, 3) : [figmaHomeHero, figmaRecordMapPhoto, figmaRecordDetail]
  const places = trip?.places ?? []
  const visitedPlaces = new Set(places.map((place) => place.placeName).filter(Boolean)).size

  return (
    <AppShell>
      <S.Page>
        <S.Header><S.Title>여행 리포트</S.Title><S.Subtitle>이번 여행에서 남긴 기록을 요약합니다. · 보류 상태</S.Subtitle></S.Header>
        {isLoading ? <S.Empty>여행 기록을 불러오는 중입니다.</S.Empty> : null}
        {hasError ? <S.Empty>여행 기록을 불러오지 못했습니다.</S.Empty> : null}
        {!isLoading && !hasError && trip ? <><S.ReportStats><S.Stat><small>기록</small><strong>{places.length}</strong><span>여행 기록</span></S.Stat><S.Stat><small>사진</small><strong>{trip.images?.length ?? 0}</strong><span>사진과 메모</span></S.Stat><S.Stat><small>방문 장소</small><strong>{visitedPlaces}</strong><span>여행지</span></S.Stat></S.ReportStats><S.ReportPhotos>{photos.map((image, index) => <S.ReportPhoto key={`${image}-${index}`}><img src={image} alt={`${trip.title || '여행'} 사진 ${index + 1}`} /><strong>{places[index]?.placeName || ['Tokyo', 'Da Nang', 'Bangkok'][index]}</strong><span>Day {places[index]?.dayNumber || index + 1}</span></S.ReportPhoto>)}</S.ReportPhotos></> : null}
        {!isLoading && !hasError && !trip ? <S.Empty><strong>리포트를 만들 여행 기록이 없습니다.</strong><button type="button" onClick={() => navigate({ to: paths.record })}>기록으로 돌아가기</button></S.Empty> : null}
      </S.Page>
    </AppShell>
  )
}
