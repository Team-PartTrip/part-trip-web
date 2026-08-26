import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import {
  figmaRecordDotonbori,
  figmaRecordNamba,
  figmaRecordOsakaCastle,
} from '@/shared/assets'
import { paths } from '@/shared/config'
import { useMyTrips } from '@/entities/trip-plan'
import { Button as PartTripButton, Select as PartTripSelect, Tab as PartTripTab, Tabs as PartTripTabs } from '@/shared/ui/parttrip'
import { AppShell } from '@/widgets/app-shell'

import * as S from './RecordPage.styles'

type RecordTab = 'timeline' | 'photos'

const fallbackImages = [figmaRecordNamba, figmaRecordOsakaCastle, figmaRecordDotonbori]

export function RecordPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<RecordTab>('timeline')
  const [selectedTripId, setSelectedTripId] = useState('all')
  const { hasError, isLoading, trips } = useMyTrips()
  const errorMessage = hasError ? '여행 기록을 불러오지 못했습니다.' : ''
  const visibleTrips = selectedTripId === 'all'
    ? trips
    : trips.filter((trip) => String(trip.tripId) === selectedTripId)

  return (
    <AppShell>
      <S.Page>
        <S.Header>
          <div>
            <S.Title>여행 기록</S.Title>
            <S.Subtitle>여행의 순간을 날짜와 장소별로 다시 만나보세요.</S.Subtitle>
          </div>
          <S.HeaderActions>
            <PartTripButton type="button" $variant="secondary" onClick={() => navigate({ to: paths.recordMap })}>지도 보기</PartTripButton>
            <PartTripButton type="button" $variant="secondary" onClick={() => navigate({ to: paths.recordCalendar })}>캘린더</PartTripButton>
            <PartTripButton type="button" $variant="secondary" onClick={() => navigate({ to: paths.recordCamera })}>사진 분석</PartTripButton>
            <PartTripButton type="button" $variant="secondary" onClick={() => navigate({ to: paths.recordReport })}>리포트</PartTripButton>
            <PartTripButton type="button" onClick={() => navigate({ to: paths.recordWrite })}>기록 작성</PartTripButton>
          </S.HeaderActions>
        </S.Header>

        <S.FilterRow>
          <label htmlFor="record-trip-filter">여행별 기록</label>
          <PartTripSelect id="record-trip-filter" value={selectedTripId} onChange={(event) => setSelectedTripId(event.target.value)}>
            <option value="all">전체 여행</option>
            {trips.filter((trip) => trip.tripId != null).map((trip) => <option key={trip.tripId} value={trip.tripId}>{trip.title || `${trip.cityName || trip.countryName || '여행'} 기록`}</option>)}
          </PartTripSelect>
        </S.FilterRow>

        <PartTripTabs aria-label="여행 기록 보기 방식">
          <PartTripTab type="button" role="tab" aria-selected={activeTab === 'timeline'} $active={activeTab === 'timeline'} onClick={() => setActiveTab('timeline')}>여행별 기록</PartTripTab>
          <PartTripTab type="button" role="tab" aria-selected={activeTab === 'photos'} $active={activeTab === 'photos'} onClick={() => setActiveTab('photos')}>사진 중심 목록</PartTripTab>
        </PartTripTabs>

        {isLoading ? <S.State aria-busy="true">여행 기록을 불러오는 중입니다.</S.State> : null}
        {errorMessage ? <S.State role="alert">{errorMessage}</S.State> : null}
        {!isLoading && !errorMessage && visibleTrips.length === 0 ? (
          <S.Empty><strong>{selectedTripId === 'all' ? '아직 여행 기록이 없습니다.' : '선택한 여행에 기록이 없습니다.'}</strong><span>첫 여행 기록을 남겨보세요.</span></S.Empty>
        ) : null}

        {!isLoading && !errorMessage && visibleTrips.length > 0 && activeTab === 'timeline' ? (
          <S.Timeline>
            {visibleTrips.map((trip, index) => (
              <S.TimelineItem key={trip.tripId ?? `${trip.title}-${index}`}>
                <S.Dot aria-hidden="true" />
                <S.RecordCard>
                  <img src={trip.images?.[0] || fallbackImages[index % fallbackImages.length]} alt="" />
                  <S.RecordCopy>
                    <small>{trip.startDate?.replaceAll('-', '.')} · {trip.cityName || trip.countryName || '여행지'}</small>
                    <h2>{trip.title || '제목 없는 여행 기록'}</h2>
                    <p>{trip.content || '작성된 여행 메모가 없습니다.'}</p>
                  </S.RecordCopy>
                  <S.ViewButton type="button" disabled={!trip.tripId} onClick={() => trip.tripId && navigate({ params: { recordId: String(trip.tripId) }, to: '/record/$recordId' })}>보기</S.ViewButton>
                </S.RecordCard>
              </S.TimelineItem>
            ))}
          </S.Timeline>
        ) : null}

        {!isLoading && !errorMessage && visibleTrips.length > 0 && activeTab === 'photos' ? (
          <S.PhotoGrid>
            {visibleTrips.flatMap((trip, tripIndex) => (trip.images?.length ? trip.images : [fallbackImages[tripIndex % fallbackImages.length]]).map((image, imageIndex) => (
              <button key={`${trip.tripId ?? tripIndex}-${imageIndex}`} type="button" onClick={() => trip.tripId && navigate({ params: { recordId: String(trip.tripId) }, to: '/record/$recordId' })}>
                <img src={image} alt={`${trip.title || '여행'} 사진 ${imageIndex + 1}`} />
              </button>
            )))}
          </S.PhotoGrid>
        ) : null}
      </S.Page>
    </AppShell>
  )
}
