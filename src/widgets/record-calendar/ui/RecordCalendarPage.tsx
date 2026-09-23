import { useMemo, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useDdayQuery, useFestivalMonthQuery, type FestivalResponseDto } from '@/entities/travel'
import { paths } from '@/shared/config'
import { Skeleton } from '@/shared/ui/parttrip'
import { formatDate, getDateRangeWithPadding, getMonthCalendarDays } from '@/shared/utils'
import { AppShell } from '@/widgets/app-shell'

import * as S from './RecordCalendarPage.styles'
import { CalendarSection, FestivalSection } from './RecordCalendarSections'

export function RecordCalendarPage() {
  const navigate = useNavigate()
  const [month, setMonth] = useState<Date>()
  const [selectedDate, setSelectedDate] = useState<string>()
  const [categoryFilter, setCategoryFilter] = useState('ALL')
  const { data: plan, isError: isPlanError, isLoading: isPlanLoading } = useDdayQuery()
  const planStartMonth = plan?.startDate ? new Date(`${plan.startDate}T00:00:00`) : undefined
  const viewMonth = month ?? (planStartMonth && !Number.isNaN(planStartMonth.getTime()) ? planStartMonth : new Date())
  const viewYear = viewMonth.getFullYear()
  const viewMonthIndex = viewMonth.getMonth()
  const festivalsQuery = useFestivalMonthQuery(plan?.countryName, viewYear, viewMonthIndex + 1)
  const festivals = festivalsQuery.data ?? []
  const dateRange = getDateRangeWithPadding(plan?.startDate, plan?.endDate)
  const safeFestivals = festivals.filter((festival): festival is FestivalResponseDto => Boolean(festival))
  const categories = [...new Set(safeFestivals.map((festival) => festival.category).filter((value): value is string => Boolean(value)))]
  const filteredFestivals = categoryFilter === 'ALL' || !categories.includes(categoryFilter)
    ? safeFestivals
    : safeFestivals.filter((festival) => festival.category === categoryFilter)
  const visibleFestivals = selectedDate ? filteredFestivals.filter((festival) => festival.startDate === selectedDate) : filteredFestivals
  const cells = useMemo(() => getMonthCalendarDays(viewYear, viewMonthIndex), [viewYear, viewMonthIndex])
  const eventByDay = filteredFestivals.reduce((byDay, festival) => {
    if (!festival.startDate) return byDay
    byDay.set(festival.startDate, [...(byDay.get(festival.startDate) ?? []), festival])
    return byDay
  }, new Map<string, FestivalResponseDto[]>())
  const isLoading = isPlanLoading || festivalsQuery.isLoading
  const hasError = isPlanError || festivalsQuery.isError
  const changeMonth = (offset: number) => {
    setSelectedDate(undefined)
    setCategoryFilter('ALL')
    setMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + offset, 1))
  }

  return (
    <AppShell>
      <S.Page>
        <S.Header><S.Title>축제 & 이벤트</S.Title>{plan ? <S.Subtitle>{plan.countryName || '여행지'} · {dateRange ? `${formatDate(dateRange.startDate)} – ${formatDate(dateRange.endDate)} (여행 기간 ±1주)` : '여행 기간 미설정'}</S.Subtitle> : null}</S.Header>
        {hasError ? <S.State role="alert">{isPlanError ? '여행 정보를 불러오지 못했습니다.' : '축제 및 이벤트 정보를 불러오지 못했습니다.'}</S.State> : isLoading ? <S.LoadingLayout aria-busy="true" aria-label="축제 이벤트 로딩 중"><Skeleton $height="650px" $radius="16px" /><Skeleton $height="650px" $radius="16px" /></S.LoadingLayout> : <S.CalendarLayout>
          <CalendarSection cells={cells} eventByDay={eventByDay} hasFestivals={filteredFestivals.length > 0} isLoading={isLoading} onChangeMonth={changeMonth} onSelectDate={(date) => setSelectedDate((current) => current === date ? undefined : date)} plan={plan} selectedDate={selectedDate} viewMonth={viewMonth} />
          <FestivalSection
            dateRange={dateRange ?? undefined}
            isLoading={isLoading}
            onBack={() => navigate({ to: paths.record })}
            onClearDate={() => setSelectedDate(undefined)}
            selectedDate={selectedDate}
            categories={categories}
            categoryFilter={categoryFilter}
            onCategoryChange={setCategoryFilter}
            viewMonth={viewMonth}
            visibleFestivals={visibleFestivals}
          />
        </S.CalendarLayout>}
      </S.Page>
    </AppShell>
  )
}
