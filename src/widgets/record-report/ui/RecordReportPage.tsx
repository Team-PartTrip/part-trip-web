import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'

import { useMyTrips, type TripPlanResponseDto } from '@/entities/trip-plan'
import { paths } from '@/shared/config'
import { Button as PartTripButton, Select as PartTripSelect } from '@/shared/ui/parttrip'
import { AppShell } from '@/widgets/app-shell'

import * as S from './RecordReportPage.styles'

function dateLabel(value?: string) {
  return value?.replaceAll('-', '.') || '-'
}

function reportLabel(trip: TripPlanResponseDto) {
  return trip.title || `${trip.cityName || trip.countryName || '여행'} 기록`
}

export function RecordReportPage() {
  const navigate = useNavigate()
  const { hasError, isLoading, trips } = useMyTrips()
  const [selectedTripId, setSelectedTripId] = useState('')
  const selectedTrip = trips.find((trip) => String(trip.tripId) === selectedTripId) ?? trips[0]

  return (
    <AppShell>
      <S.Page>
        <S.Header>
          <div><S.Title>여행 리포트</S.Title><S.Subtitle>사진과 일정이 담긴 여행 기록을 인쇄하거나 PDF로 저장하세요.</S.Subtitle></div>
          <S.Actions><PartTripButton type="button" $variant="secondary" onClick={() => navigate({ to: paths.record })}>기록으로 돌아가기</PartTripButton>{selectedTrip ? <PartTripButton type="button" onClick={() => window.print()}>PDF로 저장</PartTripButton> : null}</S.Actions>
        </S.Header>
        {isLoading ? <S.Empty>여행 기록을 불러오는 중입니다.</S.Empty> : hasError ? <S.Empty>여행 기록을 불러오지 못했습니다.</S.Empty> : selectedTrip ? <>
          <S.Controls><label htmlFor="report-trip">리포트 여행 선택</label><PartTripSelect id="report-trip" value={selectedTripId || String(selectedTrip.tripId ?? '')} onChange={(event) => setSelectedTripId(event.target.value)}>{trips.map((trip, index) => <option key={trip.tripId ?? index} value={trip.tripId}>{reportLabel(trip)}</option>)}</PartTripSelect></S.Controls>
          <S.Report>
            <S.Hero><h2>{reportLabel(selectedTrip)}</h2><p>{[selectedTrip.countryName, selectedTrip.cityName].filter(Boolean).join(' · ') || '여행지 미정'} · {dateLabel(selectedTrip.startDate)} – {dateLabel(selectedTrip.endDate)}</p></S.Hero>
            <S.Section><h3>여행 메모</h3><p>{selectedTrip.content || '작성된 여행 메모가 없습니다.'}</p></S.Section>
            <S.Section><h3>여행 일정</h3>{selectedTrip.places?.length ? <S.PlaceList>{selectedTrip.places.map((place, index) => <li key={place.tripPlaceId ?? index}><strong>DAY {place.dayNumber ?? index + 1}</strong> · {place.placeName || '장소'}{place.placeSub ? ` · ${place.placeSub}` : ''}</li>)}</S.PlaceList> : <p>등록된 세부 일정이 없습니다.</p>}</S.Section>
            <S.Section><h3>사진</h3>{selectedTrip.images?.length ? <S.PhotoGrid>{selectedTrip.images.map((image, index) => <img key={`${image}-${index}`} src={image} alt={`${reportLabel(selectedTrip)} 사진 ${index + 1}`} />)}</S.PhotoGrid> : <p>등록된 사진이 없습니다.</p>}</S.Section>
          </S.Report>
        </> : <S.Empty>리포트를 만들 여행 기록이 없습니다.</S.Empty>}
      </S.Page>
    </AppShell>
  )
}
