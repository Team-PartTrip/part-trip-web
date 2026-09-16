import { useMemo, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useDdayQuery, useTripFestivalsQuery, type FestivalResponseDto } from '@/entities/travel'
import { paths } from '@/shared/config'
import { Skeleton } from '@/shared/ui/parttrip'
import { formatDate, getMonthCalendarDays } from '@/shared/utils'
import { AppShell } from '@/widgets/app-shell'

import * as S from './RecordCalendarPage.styles'
import { CalendarSection, FestivalSection } from './RecordCalendarSections'

export function RecordCalendarPage() {
  const navigate = useNavigate()
  const [month, setMonth] = useState<Date>()
  const [selectedDate, setSelectedDate] = useState<string>()
  const { data: plan, isError: isPlanError, isLoading: isPlanLoading } = useDdayQuery()
  const { data: festivals = [], dateRange, isError: isFestivalsError, isLoading: isFestivalsLoading, isRangeTooLong } = useTripFestivalsQuery(plan?.countryName, plan?.startDate, plan?.endDate)
  const planStartMonth = plan?.startDate ? new Date(`${plan.startDate}T00:00:00`) : undefined
  const viewMonth = month ?? (planStartMonth && !Number.isNaN(planStartMonth.getTime()) ? planStartMonth : new Date())
  const viewYear = viewMonth.getFullYear()
  const viewMonthIndex = viewMonth.getMonth()
  const safeFestivals = festivals.filter((festival): festival is FestivalResponseDto => Boolean(festival))
  const visibleFestivals = selectedDate ? safeFestivals.filter((festival) => festival.startDate === selectedDate) : safeFestivals
  const cells = useMemo(() => getMonthCalendarDays(viewYear, viewMonthIndex), [viewYear, viewMonthIndex])
  const eventByDay = new Map(safeFestivals.flatMap((festival) => festival.startDate ? [[festival.startDate, festival] as const] : []))
  const isLoading = isPlanLoading || isFestivalsLoading
  const hasError = isPlanError || isFestivalsError
  const changeMonth = (offset: number) => {
    setSelectedDate(undefined)
    setMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + offset, 1))
  }

  return (
    <AppShell>
      <S.Page>
        <S.Header><S.Title>축제 & 이벤트</S.Title>{plan ? <S.Subtitle>{plan.countryName || '여행지'} · {dateRange ? `${formatDate(dateRange.startDate)} – ${formatDate(dateRange.endDate)} (여행 기간 ±1주)` : '여행 기간 미설정'}</S.Subtitle> : null}</S.Header>
        {hasError ? <S.State role="alert">{isRangeTooLong ? '여행 기간이 너무 길어 축제 조회를 지원하지 않습니다.' : '축제 및 이벤트 정보를 불러오지 못했습니다.'}</S.State> : isLoading ? <S.LoadingLayout aria-busy="true" aria-label="축제 이벤트 로딩 중"><Skeleton $height="650px" $radius="16px" /><Skeleton $height="650px" $radius="16px" /></S.LoadingLayout> : <S.CalendarLayout>
          <CalendarSection cells={cells} dateRange={dateRange} eventByDay={eventByDay} hasFestivals={safeFestivals.length > 0} isLoading={isLoading} onChangeMonth={changeMonth} onSelectDate={(date) => setSelectedDate((current) => current === date ? undefined : date)} plan={plan} selectedDate={selectedDate} viewMonth={viewMonth} />
          <FestivalSection dateRange={dateRange} isLoading={isLoading} onBack={() => navigate({ to: paths.record })} onClearDate={() => setSelectedDate(undefined)} selectedDate={selectedDate} visibleFestivals={visibleFestivals} />
        </S.CalendarLayout>}
      </S.Page>
    </AppShell>
  )
}
