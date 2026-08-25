import { useMemo, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useDdayQuery, useFestivalsQuery } from '@/entities/travel'
import { paths } from '@/shared/config'
import { AppShell } from '@/widgets/app-shell'

import * as S from './RecordCalendarPage.styles'

const weekdays = ['일', '월', '화', '수', '목', '금', '토']

export function RecordCalendarPage() {
  const navigate = useNavigate()
  const [month, setMonth] = useState(() => new Date())
  const { data: plan, isLoading: isPlanLoading } = useDdayQuery()
  const { data: festivals = [], isLoading: isFestivalsLoading } = useFestivalsQuery(plan?.countryName)
  const isLoading = isPlanLoading || isFestivalsLoading

  const cells = useMemo(() => {
    const first = new Date(month.getFullYear(), month.getMonth(), 1).getDay()
    const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()
    return [...Array(first).fill(null), ...Array.from({ length: days }, (_, index) => index + 1)]
  }, [month])
  const festivalDays = new Set(festivals.map((festival) => Number(festival.startDate?.slice(-2))))

  return (
    <AppShell>
      <S.Page>
        <S.Header><div><S.Title>축제 & 이벤트 캘린더</S.Title><S.Subtitle>여행지의 행사와 이벤트를 날짜별로 확인하세요.</S.Subtitle></div><S.BackButton type="button" onClick={() => navigate({ to: paths.record as never })}>여행 기록</S.BackButton></S.Header>
        <S.CalendarCard><S.MonthBar><button type="button" aria-label="이전 달" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}>‹</button><strong>{month.getFullYear()}.{String(month.getMonth() + 1).padStart(2, '0')}</strong><button type="button" aria-label="다음 달" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}>›</button></S.MonthBar><S.Weekdays>{weekdays.map((day) => <span key={day}>{day}</span>)}</S.Weekdays><S.Grid>{cells.map((day, index) => <S.Cell key={`${day}-${index}`} $empty={day === null}>{day ? <><strong>{day}</strong>{festivalDays.has(day) ? <S.EventDot title="이벤트 있음" /> : null}</> : null}</S.Cell>)}</S.Grid>{isLoading ? <S.Note>이벤트를 불러오는 중입니다.</S.Note> : null}{!isLoading && festivals.length === 0 ? <S.Note>연결된 이벤트 데이터가 없습니다.</S.Note> : null}</S.CalendarCard>
      </S.Page>
    </AppShell>
  )
}
