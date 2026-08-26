import { useMemo, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useDdayQuery, useFestivalsQuery, type FestivalResponseDto } from '@/entities/travel'
import { paths } from '@/shared/config'
import { AppShell } from '@/widgets/app-shell'

import * as S from './RecordCalendarPage.styles'

const weekdays = ['일', '월', '화', '수', '목', '금', '토']

function eventDateLabel(event: FestivalResponseDto) {
  return [event.startDate, event.startTime].filter(Boolean).join(' ')
}

function isInTravelPeriod(event: FestivalResponseDto, startDate?: string, endDate?: string) {
  if (!startDate || !endDate || !event.startDate) return true
  const eventStart = event.startDate.slice(0, 10)
  return eventStart >= startDate && eventStart <= endDate
}

export function RecordCalendarPage() {
  const navigate = useNavigate()
  const [month, setMonth] = useState(() => new Date())
  const [category, setCategory] = useState('전체')
  const { data: plan, isLoading: isPlanLoading } = useDdayQuery()
  const { data: festivals = [], isLoading: isFestivalsLoading } = useFestivalsQuery(
    plan?.countryName,
    month.getFullYear(),
    month.getMonth() + 1,
  )
  const isLoading = isPlanLoading || isFestivalsLoading

  const cells = useMemo(() => {
    const first = new Date(month.getFullYear(), month.getMonth(), 1).getDay()
    const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()
    return [...Array(first).fill(null), ...Array.from({ length: days }, (_, index) => index + 1)]
  }, [month])
  const categories = ['전체', ...new Set(festivals.map((festival) => festival.category || '기타'))]
  const activeCategory = categories.includes(category) ? category : '전체'
  const visibleFestivals = festivals.filter((festival) =>
    (activeCategory === '전체' || (festival.category || '기타') === activeCategory)
    && isInTravelPeriod(festival, plan?.startDate, plan?.endDate),
  )
  const festivalDays = new Set(visibleFestivals.map((festival) => Number(festival.startDate?.slice(-2))))

  return (
    <AppShell>
      <S.Page>
        <S.Header><div><S.Title>축제 & 이벤트 캘린더</S.Title><S.Subtitle>여행지의 행사와 이벤트를 날짜별로 확인하세요.</S.Subtitle></div><S.BackButton type="button" onClick={() => navigate({ to: paths.record })}>여행 기록</S.BackButton></S.Header>
        <S.CalendarCard><S.MonthBar><button type="button" aria-label="이전 달" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}>‹</button><strong>{month.getFullYear()}.{String(month.getMonth() + 1).padStart(2, '0')}</strong><button type="button" aria-label="다음 달" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}>›</button></S.MonthBar><S.Weekdays>{weekdays.map((day) => <span key={day}>{day}</span>)}</S.Weekdays><S.Grid>{cells.map((day, index) => <S.Cell key={`${day}-${index}`} $empty={day === null}>{day ? <><strong>{day}</strong>{festivalDays.has(day) ? <S.EventDot title="이벤트 있음" /> : null}</> : null}</S.Cell>)}</S.Grid>{isLoading ? <S.Note>이벤트를 불러오는 중입니다.</S.Note> : null}{!isLoading && festivals.length === 0 ? <S.Note>연결된 이벤트 데이터가 없습니다.</S.Note> : null}{!isLoading && festivals.length > 0 ? <><S.EventFilters aria-label="축제 종류 필터">{categories.map((item) => <S.EventFilter key={item} type="button" $active={activeCategory === item} aria-pressed={activeCategory === item} onClick={() => setCategory(item)}>{item}</S.EventFilter>)}</S.EventFilters>{visibleFestivals.length > 0 ? <S.EventList>{visibleFestivals.map((event) => <S.EventCard key={`${event.festivalId ?? event.title}-${event.startDate}`}><small>{event.category || '기타'} · {eventDateLabel(event) || '일정 미정'}</small><h3>{event.title || '이름 없는 이벤트'}</h3><p>{[event.location, event.description].filter(Boolean).join(' · ') || '상세 정보가 없습니다.'}</p></S.EventCard>)}</S.EventList> : <S.Note>선택한 조건에 맞는 이벤트가 없습니다.</S.Note>}</> : null}</S.CalendarCard>
      </S.Page>
    </AppShell>
  )
}
