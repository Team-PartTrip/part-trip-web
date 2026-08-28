import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useGenerateTravelCardReportMutation } from '@/entities/trip-card'
import { useMyTrips } from '@/entities/trip-plan'
import { paths } from '@/shared/config'
import { Skeleton } from '@/shared/ui/parttrip'
import { AppShell } from '@/widgets/app-shell'

import * as S from './RecordReportPage.styles'

export function RecordReportPage() {
  const navigate = useNavigate()
  const { hasError, isLoading, trips } = useMyTrips()
  const trip = trips[0]
  const photos = trip?.images?.slice(0, 3) ?? []
  const places = trip?.places ?? []
  const visitedPlaces = new Set(places.map((place) => place.placeName).filter(Boolean)).size
  const reportMutation = useGenerateTravelCardReportMutation()
  const [reportUrl, setReportUrl] = useState('')
  const [reportError, setReportError] = useState('')

  const handleGenerateReport = async () => {
    if (!trip?.tripId) return
    try {
      setReportError('')
      const result = await reportMutation.mutateAsync({ cardId: trip.tripId, payload: { type: 'PDF' } })
      setReportUrl(result.reportUrl ?? '')
    } catch {
      setReportError('리포트를 생성하지 못했습니다.')
    }
  }

  return (
    <AppShell>
      <S.Page>
        <S.Header><S.Title>여행 리포트</S.Title><S.Subtitle>이번 여행에서 남긴 기록을 요약합니다. · 보류 상태</S.Subtitle></S.Header>
        {isLoading ? <Skeleton aria-busy="true" aria-label="여행 리포트 로딩 중" $height="470px" $radius="16px" /> : null}
        {hasError ? <S.Empty>여행 기록을 불러오지 못했습니다.</S.Empty> : null}
        {!isLoading && !hasError && trip ? <><S.ReportStats><S.Stat><small>기록</small><strong>{places.length}</strong><span>여행 기록</span></S.Stat><S.Stat><small>사진</small><strong>{trip.images?.length ?? 0}</strong><span>사진과 메모</span></S.Stat><S.Stat><small>방문 장소</small><strong>{visitedPlaces}</strong><span>여행지</span></S.Stat></S.ReportStats>{photos.length ? <S.ReportPhotos>{photos.map((image, index) => <S.ReportPhoto key={`${image}-${index}`}><img src={image} alt={`${trip.title || '여행'} 사진 ${index + 1}`} /><strong>{places[index]?.placeName || '장소 정보 없음'}</strong><span>Day {places[index]?.dayNumber || index + 1}</span></S.ReportPhoto>)}</S.ReportPhotos> : <S.Empty>남겨진 사진이 없습니다.</S.Empty>}<S.ReportActions><button type="button" disabled={!trip.tripId || reportMutation.isPending} onClick={() => void handleGenerateReport()}>{reportMutation.isPending ? '생성 중' : 'PDF로 내보내기'}</button>{reportUrl ? <a href={reportUrl} target="_blank" rel="noreferrer">생성된 리포트 열기</a> : null}{reportError ? <span role="alert">{reportError}</span> : null}</S.ReportActions></> : null}
        {!isLoading && !hasError && !trip ? <S.Empty><strong>리포트를 만들 여행 기록이 없습니다.</strong><button type="button" onClick={() => navigate({ to: paths.record })}>기록으로 돌아가기</button></S.Empty> : null}
      </S.Page>
    </AppShell>
  )
}
