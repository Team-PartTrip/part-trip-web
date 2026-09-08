import type { FestivalResponseDto } from '@/entities/travel'
import { formatDate } from '@/shared/utils'

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
  dateRange,
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
  dateRange?: DateRange
  eventByDay: Map<string, FestivalResponseDto>
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
        const date = day ? `${viewMonth.getFullYear()}-${String(viewMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` : ''
        const event = day ? eventByDay.get(date) : undefined
        const inTrip = day != null && plan?.startDate != null && plan?.endDate != null && date >= plan.startDate && date <= plan.endDate
        return <S.Cell key={`${day}-${index}`} type="button" disabled={day === null} $empty={day === null} $inTrip={Boolean(inTrip)} $selected={date === selectedDate} aria-pressed={day === null ? undefined : date === selectedDate} onClick={() => { if (date) onSelectDate(date) }}>{day ? <><strong>{day}</strong>{event ? <S.EventLabel>{event.category || '행사'}</S.EventLabel> : null}</> : null}</S.Cell>
      })}</S.CalendarGrid>
      {!isLoading && !hasFestivals ? <S.Note>{dateRange ? '여행 기간 전후 1주일에 등록된 행사가 없습니다.' : '여행 기간을 설정하면 전후 1주일의 행사를 볼 수 있습니다.'}</S.Note> : null}
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
}: {
  dateRange?: DateRange
  isLoading: boolean
  onBack: () => void
  onClearDate: () => void
  selectedDate?: string
  visibleFestivals: FestivalResponseDto[]
}) {
  return (
    <S.FestivalList>
      <h2>{selectedDate ? `${formatDate(selectedDate)} 축제 ${visibleFestivals.length}건` : `여행 전후 축제 ${visibleFestivals.length}건`}</h2>
      {selectedDate ? <S.FilterButton type="button" onClick={onClearDate}>전체 기간 보기</S.FilterButton> : null}
      {visibleFestivals.map((event) => <S.FestivalRow key={`${event.festivalId ?? event.title}-${event.startDate}`}><div><strong>{event.title || '이름 없는 이벤트'}</strong><span>{eventDateLabel(event)}{event.location ? ` · ${event.location}` : ''}</span></div><small>{event.category || '행사'}</small></S.FestivalRow>)}
      {!isLoading && visibleFestivals.length === 0 ? <S.Note>{selectedDate ? '선택한 날짜에 등록된 행사가 없습니다.' : dateRange ? '표시할 행사가 없습니다.' : '여행 기간을 설정하면 행사를 볼 수 있습니다.'}</S.Note> : null}
      <button type="button" onClick={onBack}>여행 기록으로 돌아가기</button>
    </S.FestivalList>
  )
}
