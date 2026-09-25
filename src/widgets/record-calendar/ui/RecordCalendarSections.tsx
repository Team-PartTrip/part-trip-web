import type { ReactNode } from 'react'
import type { FestivalResponseDto } from '@/entities/travel'
import { formatCalendarDate, formatDate } from '@/shared/utils'

import * as S from './RecordCalendarPage.styles'

const weekdays = ['일', '월', '화', '수', '목', '금', '토']

type TravelPlan = {
  cityName?: string | null
  countryName?: string | null
  endDate?: string | null
  startDate?: string | null
}

type DateRange = {
  endDate: string
  startDate: string
}

export function CalendarSection({
  cells,
  eventByDay,
  hasFestivals,
  isLoading,
  onChangeMonth,
  onSelectDate,
  plan,
  selectedDate,
  viewMonth,
}: {
  cells: Array<number | null>
  eventByDay: Map<string, FestivalResponseDto[]>
  hasFestivals: boolean
  isLoading: boolean
  onChangeMonth: (offset: number) => void
  onSelectDate: (date: string) => void
  plan?: TravelPlan
  selectedDate?: string
  viewMonth: Date
}) {
  return (
    <S.CalendarCard>
      <S.MonthBar><div><h2>{viewMonth.getFullYear()}년 {viewMonth.getMonth() + 1}월</h2><p>{plan?.cityName || plan?.countryName || '여행지'} · 여행 기간 {plan ? `${formatDate(plan.startDate)} – ${formatDate(plan.endDate)}` : '미설정'}</p></div><span><button type="button" aria-label="이전 달" onClick={() => onChangeMonth(-1)}>‹</button><button type="button" aria-label="다음 달" onClick={() => onChangeMonth(1)}>›</button></span></S.MonthBar>
      <S.Weekdays>{weekdays.map((day) => <span key={day}>{day}</span>)}</S.Weekdays>
      <S.CalendarGrid>{cells.map((day, index) => {
        const date = day ? formatCalendarDate(viewMonth.getFullYear(), viewMonth.getMonth(), day) : ''
        const events = day ? eventByDay.get(date) ?? [] : []
        const inTrip = day != null && plan?.startDate != null && plan?.endDate != null && date >= plan.startDate && date <= plan.endDate
        let cellContent: ReactNode = null
        if (day) {
          const eventLabel = events.length > 1 ? `${events.length}건` : events[0]?.category || '행사'
          cellContent = <><strong>{day}</strong>{events.length ? <S.EventLabel>{eventLabel}</S.EventLabel> : null}</>
        }
        return <S.Cell key={`${day}-${index}`} type="button" disabled={day === null} $empty={day === null} $inTrip={Boolean(inTrip)} $selected={date === selectedDate} aria-pressed={day === null ? undefined : date === selectedDate} onClick={() => { if (date) onSelectDate(date) }}>{cellContent}</S.Cell>
      })}</S.CalendarGrid>
      {!isLoading && !hasFestivals ? <S.Note>{plan?.countryName ? '선택한 달에 등록된 축제 및 이벤트가 없습니다.' : '여행지를 설정하면 해당 지역의 월별 축제를 볼 수 있습니다.'}</S.Note> : null}
    </S.CalendarCard>
  )
}

function eventDateLabel(event: FestivalResponseDto) {
  return [event.startDate?.slice(5), event.startTime].filter(Boolean).join(' · ')
}

export function FestivalSection({
  dateRange,
  isLoading,
  onBack,
  onClearDate,
  selectedDate,
  visibleFestivals,
  categories,
  categoryFilter,
  onCategoryChange,
  viewMonth,
}: {
  dateRange?: DateRange
  isLoading: boolean
  onBack: () => void
  onClearDate: () => void
  selectedDate?: string
  visibleFestivals: FestivalResponseDto[]
  categories: string[]
  categoryFilter: string
  onCategoryChange: (category: string) => void
  viewMonth: Date
}) {
  let emptyMessage = '여행지를 설정하면 해당 지역의 월별 행사를 볼 수 있습니다.'
  if (dateRange) emptyMessage = '이 달에 표시할 행사가 없습니다.'
  if (selectedDate) emptyMessage = '선택한 날짜에 등록된 행사가 없습니다.'

  return (
    <S.FestivalList>
      <h2>{selectedDate ? `${formatDate(selectedDate)} 축제 ${visibleFestivals.length}건` : `${viewMonth.getFullYear()}년 ${viewMonth.getMonth() + 1}월 축제 ${visibleFestivals.length}건`}</h2>
      {categories.length ? <S.CategoryFilter aria-label="축제 종류 필터" value={categoryFilter} onChange={(event) => onCategoryChange(event.target.value)}>
        <option value="ALL">모든 축제 종류</option>{categories.map((category) => <option key={category} value={category}>{category}</option>)}
      </S.CategoryFilter> : null}
      <S.Note>현재 축제 정보에는 걷기 부담 데이터가 없어 걷기 조건으로 필터링할 수 없습니다.</S.Note>
      {selectedDate ? <S.FilterButton type="button" onClick={onClearDate}>전체 기간 보기</S.FilterButton> : null}
      {visibleFestivals.map((event) => <S.FestivalRow key={`${event.festivalId ?? event.title}-${event.startDate}`}><div><strong>{event.title || '이름 없는 이벤트'}</strong><span>{eventDateLabel(event)}{event.location ? ` · ${event.location}` : ''}</span></div><small>{event.category || '행사'}</small></S.FestivalRow>)}
      {!isLoading && visibleFestivals.length === 0 ? <S.Note>{emptyMessage}</S.Note> : null}
      <button type="button" onClick={onBack}>여행 기록으로 돌아가기</button>
    </S.FestivalList>
  )
}
