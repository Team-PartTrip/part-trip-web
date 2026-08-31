import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useMyTrips } from '@/entities/trip-plan'
import { formatDate } from '@/shared/utils'
import { AppShell } from '@/widgets/app-shell'

import * as S from './RecordPage.styles'

export function RecordPage() {
  const navigate = useNavigate()
  const { hasError, isLoading, trips } = useMyTrips()
  const [year, setYear] = useState('all')
  const today = new Date().toISOString().slice(0, 10)
  const records = trips.map((trip) => ({
    id: trip.tripId,
    title: trip.title || `${trip.cityName || trip.countryName || '여행'} 여행`,
    date: `${formatDate(trip.startDate)} – ${formatDate(trip.endDate)}`,
    year: trip.startDate?.slice(0, 4) || trip.createDate?.slice(0, 4) || '',
    photoCount: trip.photoCount ?? trip.images?.length ?? 0,
    active: Boolean(trip.startDate && trip.endDate && trip.startDate <= today && today <= trip.endDate),
  }))
  const years = [...new Set(records.map((record) => record.year).filter(Boolean))].sort((a, b) => b.localeCompare(a))
  const filteredRecords = records.filter((record) => year === 'all' || record.year === year)

  return (
    <AppShell>
      <S.Page>
        <S.Header><S.Title>기록</S.Title></S.Header>
        <S.YearTabs aria-label="기록 연도 필터">
          {['all', ...years].map((value) => (
            <button key={value} type="button" className={year === value ? 'active' : ''} aria-pressed={year === value} onClick={() => setYear(value)}>
              {value === 'all' ? '전체' : value}
            </button>
          ))}
        </S.YearTabs>
        {isLoading ? <S.LoadingList aria-busy="true" aria-label="여행 기록 로딩 중"><S.LoadingRow /><S.LoadingRow /><S.LoadingRow /></S.LoadingList> : null}
        {hasError ? <S.State role="alert">여행 기록을 불러오지 못했습니다.</S.State> : null}
        {!isLoading && !hasError ? (
          <>
            {filteredRecords.length ? <S.RecordList>{filteredRecords.map((record) => <S.RecordRow key={record.id ?? record.title} type="button" onClick={() => record.id && navigate({ params: { recordId: String(record.id) }, to: '/record/$recordId' })}><S.RecordCopy><strong>{record.title}</strong><span>{record.date}</span><small>사진 {record.photoCount}장</small></S.RecordCopy>{record.active ? <S.RecordStatus>여행 중</S.RecordStatus> : <S.RowArrow aria-hidden="true">›</S.RowArrow>}</S.RecordRow>)}</S.RecordList> : <S.Empty><strong>아직 여행 기록이 없습니다.</strong><span>첫 여행의 순간을 남겨보세요.</span></S.Empty>}
          </>
        ) : null}
      </S.Page>
    </AppShell>
  )
}
