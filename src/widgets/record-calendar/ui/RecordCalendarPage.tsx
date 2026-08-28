import { useMemo, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useDdayQuery, useFestivalsQuery, type FestivalResponseDto } from '@/entities/travel'
import { paths } from '@/shared/config'
import { Skeleton } from '@/shared/ui/parttrip'
import { formatDate } from '@/shared/utils'
import { AppShell } from '@/widgets/app-shell'

import * as S from './RecordCalendarPage.styles'

const weekdays = ['일', '월', '화', '수', '목', '금', '토']

function eventDateLabel(event?: FestivalResponseDto | null) {
  if (!event) return ''
  return [event.startDate?.slice(5), event.startTime].filter(Boolean).join(' · ')
}

export function RecordCalendarPage() {
  const navigate = useNavigate()
  const [month, setMonth] = useState(() => new Date())
  const { data: plan, isLoading: isPlanLoading } = useDdayQuery()
  const { data: festivals = [], isLoading: isFestivalsLoading } = useFestivalsQuery(plan?.countryName, month.getFullYear(), month.getMonth() + 1)
  const safeFestivals = festivals.filter((festival): festival is FestivalResponseDto => Boolean(festival))
  const cells = useMemo(() => {
    const first = new Date(month.getFullYear(), month.getMonth(), 1).getDay()
    const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()
    return [...Array(first).fill(null), ...Array.from({ length: days }, (_, index) => index + 1)]
  }, [month])
  const eventByDay = new Map(safeFestivals.map((festival) => [Number(festival.startDate?.slice(-2)), festival]))
  const isLoading = isPlanLoading || isFestivalsLoading

  return (
    <AppShell>
      <S.Page>
        <S.Header><S.Title>축제 & 이벤트</S.Title>{plan ? <S.Subtitle>{plan.countryName || '여행지'} · {month.getFullYear()}년 {month.getMonth() + 1}월 기준</S.Subtitle> : null}</S.Header>
        {isLoading ? <S.LoadingLayout aria-busy="true" aria-label="축제 이벤트 로딩 중"><Skeleton $height="650px" $radius="16px" /><Skeleton $height="650px" $radius="16px" /></S.LoadingLayout> : <S.CalendarLayout>
          <S.CalendarCard><S.MonthBar><div><h2>{month.getFullYear()}년 {month.getMonth() + 1}월</h2><p>{plan?.cityName || plan?.countryName || '여행지'} · 여행 기간 {plan ? `${formatDate(plan.startDate)} – ${formatDate(plan.endDate)}` : '미설정'}</p></div><span><button type="button" aria-label="이전 달" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}>‹</button><button type="button" aria-label="다음 달" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}>›</button></span></S.MonthBar><S.Weekdays>{weekdays.map((day) => <span key={day}>{day}</span>)}</S.Weekdays><S.CalendarGrid>{cells.map((day, index) => { const event = day ? eventByDay.get(day) : undefined; const inTrip = day != null && plan?.startDate && plan?.endDate && `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` >= plan.startDate && `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` <= plan.endDate; return <S.Cell key={`${day}-${index}`} $empty={day === null} $inTrip={Boolean(inTrip)}>{day ? <><strong>{day}</strong>{event ? <S.EventLabel>{event.category || '행사'}</S.EventLabel> : null}</> : null}</S.Cell> })}</S.CalendarGrid>{!isLoading && safeFestivals.length === 0 ? <S.Note>연결된 이벤트 데이터가 없습니다.</S.Note> : null}</S.CalendarCard>
          <S.FestivalList><h2>이달의 축제 {safeFestivals.length}건</h2>{safeFestivals.map((event) => <S.FestivalRow key={`${event.festivalId ?? event.title}-${event.startDate}`}><div><strong>{event.title || '이름 없는 이벤트'}</strong><span>{eventDateLabel(event)}{event.location ? ` · ${event.location}` : ''}</span></div><small>{event.category || '행사'}</small></S.FestivalRow>)}{!isLoading && safeFestivals.length === 0 ? <S.Note>표시할 행사가 없습니다.</S.Note> : null}<button type="button" onClick={() => navigate({ to: paths.record })}>여행 기록으로 돌아가기</button></S.FestivalList>
        </S.CalendarLayout>}
      </S.Page>
    </AppShell>
  )
}
