import { useNavigate } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { useMyPlannersQuery, usePlannerScheduleQuery } from '@/entities/planner'
import { useMainTravelQuery, type DdayResponseDto } from '@/entities/travel'
import { figmaPlannerIcon } from '@/shared/assets'
import { paths } from '@/shared/config'
import { formatCalendarDate, formatDateRange, formatTripDuration, normalizeStatus } from '@/shared/utils'
import { activatePlannerSession } from '@/widgets/planner'
import { AppShell } from '@/widgets/app-shell'

import { formatDday, getTravelStatusCopy, hasTravelPlan } from '../model/dday'
import { getMainQueryPresentation } from '../model/main-query-presentation'
import * as S from './MainPage.styles'

function MainHero({
  plan,
  destination,
  dateRange,
  today,
  todayStops,
  scheduleMessage,
  scheduleError,
  scheduleLoading,
  onStartPlanner,
  onOpenTodaySchedule,
}: {
  plan?: DdayResponseDto
  destination: string
  dateRange: string
  today: string
  todayStops: string[]
  scheduleMessage: string
  scheduleError: boolean
  scheduleLoading: boolean
  onStartPlanner: () => void
  onOpenTodaySchedule: () => void
}) {
  if (plan?.status === 'NO_TRIP') {
    return (
      <S.Hero>
        <S.HeroLabel>여행을 준비해요</S.HeroLabel>
        <S.HeroTitle>다음 여행이 아직 없어요</S.HeroTitle>
        <S.HeroCopy>국내 도시와 날짜를 정해 나만의 일정을 만들어 보세요.</S.HeroCopy>
        <S.HeroAction type="button" onClick={onStartPlanner}>여행 플래너 시작</S.HeroAction>
      </S.Hero>
    )
  }
  if (plan?.status === 'DURING') {
    return (
      <S.Hero>
        <S.HeroLabel>오늘 일정 · {today.replace(/-/g, '.')}</S.HeroLabel>
        <S.HeroTitle>{todayStops[0] || `${destination} 여행`}</S.HeroTitle>
        {todayStops.length ? (
          <S.TodayRoute aria-label={`오늘 일정 순서: ${todayStops.join(', ')}`}>
            {todayStops.map((stop, index) => <span key={`${stop}-${index}`}>{index ? <i aria-hidden="true">→</i> : null}{stop}</span>)}
          </S.TodayRoute>
        ) : <S.HeroCopy role={scheduleError ? 'alert' : scheduleLoading ? 'status' : undefined}>{scheduleMessage}</S.HeroCopy>}
        {todayStops.length ? <S.HeroMeta>확정된 일정 · 오늘 {todayStops.length}곳</S.HeroMeta> : null}
        <S.HeroAction type="button" onClick={onOpenTodaySchedule}>오늘 일정 보기</S.HeroAction>
      </S.Hero>
    )
  }
  if (plan && hasTravelPlan(plan)) {
    return (
      <S.Hero>
        <S.HeroLabel>{getTravelStatusCopy(plan.status)}</S.HeroLabel>
        {plan.status === 'BEFORE' || plan.dday === 'D-Day' ? <S.Dday>{formatDday(plan.dday)}</S.Dday> : null}
        <S.Destination>{destination} · {formatTripDuration(plan.startDate, plan.endDate) || '여행 기간 미설정'}</S.Destination>
        <S.HeroMeta>{dateRange} · {plan.headcount ?? '-'}명</S.HeroMeta>
      </S.Hero>
    )
  }
  return <S.State>{getTravelStatusCopy(plan?.status)}</S.State>
}

export function MainPage() {
  const navigate = useNavigate()
  const { data, isError, isLoading, isRecommendationsError, isRecommendationsLoading } = useMainTravelQuery()
  const plan = data.plan
  const hasPlan = hasTravelPlan(plan)
  const isDuring = plan?.status === 'DURING'
  const date = new Date()
  const today = formatCalendarDate(date.getFullYear(), date.getMonth(), date.getDate())
  const { data: planners = [], isError: plannerListError, isLoading: isPlannerListLoading } = useMyPlannersQuery(isDuring)
  const currentPlanner = planners.find((planner) =>
    isDuring
    && Boolean(planner.plannerId && plan?.startDate && plan.endDate)
    && ['CONFIRMED', 'TRAVELING'].includes(normalizeStatus(planner.status))
    && planner.startDate === plan?.startDate
    && planner.endDate === plan?.endDate
    && (!plan?.cityName || !planner.cityName || planner.cityName.trim() === plan.cityName.trim()),
  )
  const scheduleQuery = usePlannerScheduleQuery(currentPlanner?.plannerId ?? 0, isDuring && currentPlanner?.plannerId != null)
  const todaySchedule = scheduleQuery.data?.days?.find((day) => day.date === today)
  const todayStops = [...(todaySchedule?.slots ?? [])]
    .sort((left, right) => (left.order ?? 0) - (right.order ?? 0))
    .flatMap((slot) => slot.place?.name?.trim() ? [slot.place.name.trim()] : [])
  const isTodayScheduleLoading = isDuring && (isPlannerListLoading || Boolean(currentPlanner?.plannerId && scheduleQuery.isLoading))
  let todayScheduleMessage = ''
  if (plannerListError || scheduleQuery.isError) {
    todayScheduleMessage = '오늘 일정을 불러오지 못했어요.'
  } else if (!currentPlanner) {
    todayScheduleMessage = '확정된 여행 일정을 찾을 수 없어요.'
  } else if (!todayStops.length) {
    todayScheduleMessage = '오늘 확정된 일정이 없어요.'
  }
  const destination = plan?.cityName || plan?.countryName || '여행지'
  const dateRange = plan ? formatDateRange(plan.startDate, plan.endDate) : '여행 정보가 없습니다.'
  const recommendations = data.tourPlaces.slice(0, 3)
  const presentation = getMainQueryPresentation({
    isPlanLoading: isLoading,
    isRecommendationsLoading,
    isScheduleLoading: isTodayScheduleLoading,
    isRecommendationsError,
    recommendationCount: recommendations.length,
    isPlanError: isError,
    hasPlanData: Boolean(plan),
  })
  const effectiveScheduleMessage = isTodayScheduleLoading ? '오늘 일정을 불러오고 있어요.' : todayScheduleMessage
  let recommendationsContent: ReactNode
  if (presentation.recommendations === 'loading') {
    recommendationsContent = <>{[0, 1, 2].map((index) => <S.LoadingRecommendation key={index} aria-hidden="true" />)}</>
  } else if (presentation.recommendations === 'error') {
    recommendationsContent = <S.State role="alert">추천 장소를 불러오지 못했습니다.</S.State>
  } else if (recommendations.length) {
    recommendationsContent = recommendations.map((place, index) => (
      <S.Recommendation key={`${place.placeName || '추천 장소'}-${index}`}>
        <S.RecommendationImage $imageUrl={place.imageUrl}>{!place.imageUrl ? '이미지 없음' : null}</S.RecommendationImage>
        <span>{place.placeName || '추천 장소'}</span>
      </S.Recommendation>
    ))
  } else {
    recommendationsContent = <S.State>표시할 추천 장소가 없습니다.</S.State>
  }

  const openTodaySchedule = () => {
    if (currentPlanner?.plannerId) {
      activatePlannerSession(currentPlanner.plannerId)
      void navigate({ to: paths.plannerProgress })
      return
    }
    void navigate({ to: paths.planner })
  }

  return (
    <AppShell>
      <S.Page>
        {presentation.page === 'error' ? <S.Error role="alert">여행 정보를 불러오지 못했습니다.</S.Error> : null}
        {presentation.showPlanError ? <S.Error role="alert">여행 정보를 새로 불러오지 못했습니다. 마지막으로 불러온 여행 정보를 표시하고 있어요.</S.Error> : null}
        {presentation.page === 'loading' ? (
          <S.LoadingLayout aria-busy="true" aria-label="여행 정보 로딩 중">
            <S.LoadingHero />
            <S.LoadingCalendar />
            <S.LoadingRecommendations>
              <S.LoadingHeading />
              <div><S.LoadingRecommendation /><S.LoadingRecommendation /><S.LoadingRecommendation /></div>
            </S.LoadingRecommendations>
          </S.LoadingLayout>
        ) : presentation.page === 'error' ? null : (
          <MainHero
            plan={plan}
            destination={destination}
            dateRange={dateRange}
            today={today}
            todayStops={todayStops}
            scheduleMessage={effectiveScheduleMessage}
            scheduleError={plannerListError || scheduleQuery.isError}
            scheduleLoading={presentation.schedule === 'loading'}
            onStartPlanner={() => void navigate({ to: paths.plannerDestination })}
            onOpenTodaySchedule={openTodaySchedule}
          />
        )}

        {hasPlan && plan?.status !== 'ENDED' ? (
          <>
            <S.CalendarCard type="button" onClick={() => navigate({ to: paths.recordCalendar })}>
              <S.CalendarIcon><img src={figmaPlannerIcon} alt="" /></S.CalendarIcon>
              <S.CalendarCopy>
                <strong>축제 · 이벤트 캘린더</strong>
                <span>{plan?.countryName || '여행지'}의 여행 기간 전후 일정</span>
              </S.CalendarCopy>
              <S.CalendarArrow aria-hidden="true">›</S.CalendarArrow>
            </S.CalendarCard>

            <S.Recommendations>
              <S.SectionTitle>이번 주 추천</S.SectionTitle>
              <S.RecommendationGrid>{recommendationsContent}</S.RecommendationGrid>
            </S.Recommendations>
          </>
        ) : null}
      </S.Page>
    </AppShell>
  )
}

export default MainPage
