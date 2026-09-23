import { useNavigate } from '@tanstack/react-router'
import { useMyPlannersQuery, usePlannerScheduleQuery } from '@/entities/planner'
import { useMainTravelQuery } from '@/entities/travel'
import { figmaPlannerIcon } from '@/shared/assets'
import { paths } from '@/shared/config'
import { formatDateRange, formatTripDuration } from '@/shared/utils'
import { activatePlannerSession } from '@/widgets/planner'
import { AppShell } from '@/widgets/app-shell'

import { formatDday, getTravelStatusCopy, hasTravelPlan } from '../model/dday'
import * as S from './MainPage.styles'

export function MainPage() {
  const navigate = useNavigate()
  const { data, isError, isLoading } = useMainTravelQuery()
  const plan = data.plan
  const hasPlan = hasTravelPlan(plan)
  const isDuring = plan?.status === 'DURING'
  const today = getLocalDateKey()
  const { data: planners = [], isError: plannerListError, isLoading: isPlannerListLoading } = useMyPlannersQuery(isDuring)
  const currentPlanner = planners.find((planner) =>
    isDuring
    && Boolean(planner.plannerId && plan?.startDate && plan.endDate)
    && ['CONFIRMED', 'TRAVELING'].includes(planner.status?.trim().toUpperCase() ?? '')
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
  const todayScheduleMessage = plannerListError || scheduleQuery.isError
    ? '오늘 일정을 불러오지 못했어요.'
    : !currentPlanner
      ? '확정된 여행 일정을 찾을 수 없어요.'
      : !todayStops.length
        ? '오늘 확정된 일정이 없어요.'
        : ''
  const destination = plan?.cityName || plan?.countryName || data.country?.cityName || data.country?.countryName || '여행지'
  const dateRange = plan ? formatDateRange(plan.startDate, plan.endDate) : '여행 정보가 없습니다.'
  const recommendations = data.tourPlaces.slice(0, 3)

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
        {isError ? <S.Error role="alert">여행 정보를 불러오지 못했습니다.</S.Error> : null}
        {isLoading || isTodayScheduleLoading ? (
          <S.LoadingLayout aria-busy="true" aria-label="여행 정보 로딩 중">
            <S.LoadingHero />
            <S.LoadingCalendar />
            <S.LoadingRecommendations>
              <S.LoadingHeading />
              <div><S.LoadingRecommendation /><S.LoadingRecommendation /><S.LoadingRecommendation /></div>
            </S.LoadingRecommendations>
          </S.LoadingLayout>
        ) : isError ? null : plan?.status === 'NO_TRIP' ? (
          <S.Hero>
            <S.HeroLabel>여행을 준비해요</S.HeroLabel>
            <S.HeroTitle>다음 여행이 아직 없어요</S.HeroTitle>
            <S.HeroCopy>국내 도시와 날짜를 정해 나만의 일정을 만들어 보세요.</S.HeroCopy>
            <S.HeroAction type="button" onClick={() => void navigate({ to: paths.plannerDestination })}>
              여행 플래너 시작
            </S.HeroAction>
          </S.Hero>
        ) : isDuring ? (
          <S.Hero>
            <S.HeroLabel>오늘 일정 · {today.replace(/-/g, '.')}</S.HeroLabel>
            <S.HeroTitle>{todayStops[0] || `${destination} 여행`}</S.HeroTitle>
            {todayStops.length ? (
              <S.TodayRoute aria-label={`오늘 일정 순서: ${todayStops.join(', ')}`}>
                {todayStops.map((stop, index) => (
                  <span key={`${stop}-${index}`}>
                    {index ? <i aria-hidden="true">→</i> : null}
                    {stop}
                  </span>
                ))}
              </S.TodayRoute>
            ) : <S.HeroCopy role={plannerListError || scheduleQuery.isError ? 'alert' : undefined}>{todayScheduleMessage}</S.HeroCopy>}
            {todayStops.length ? <S.HeroMeta>확정된 일정 · 오늘 {todayStops.length}곳</S.HeroMeta> : null}
            <S.HeroAction type="button" onClick={openTodaySchedule}>오늘 일정 보기</S.HeroAction>
          </S.Hero>
        ) : hasPlan ? (
          <S.Hero>
            <S.HeroLabel>{getTravelStatusCopy(plan?.status)}</S.HeroLabel>
            {plan?.status === 'BEFORE' || plan?.dday === 'D-Day' ? <S.Dday>{formatDday(plan.dday)}</S.Dday> : null}
            <S.Destination>{destination} · {formatTripDuration(plan?.startDate, plan?.endDate) || '여행 기간 미설정'}</S.Destination>
            <S.HeroMeta>{dateRange} · {plan?.headcount ?? '-'}명</S.HeroMeta>
          </S.Hero>
        ) : <S.State>{getTravelStatusCopy(plan?.status)}</S.State>}

        {hasPlan && plan?.status !== 'ENDED' ? (
          <>
            <S.CalendarCard type="button" onClick={() => navigate({ to: paths.recordCalendar })}>
              <S.CalendarIcon><img src={figmaPlannerIcon} alt="" /></S.CalendarIcon>
              <S.CalendarCopy>
                <strong>축제 · 이벤트 캘린더</strong>
                <span>{data.country?.countryName || plan?.countryName || '여행지'}의 여행 기간 전후 일정</span>
              </S.CalendarCopy>
              <S.CalendarArrow aria-hidden="true">›</S.CalendarArrow>
            </S.CalendarCard>

            <S.Recommendations>
              <S.SectionTitle>이번 주 추천</S.SectionTitle>
              <S.RecommendationGrid>
                {recommendations.length ? recommendations.map((place, index) => (
                  <S.Recommendation key={`${place.placeName || '추천 장소'}-${index}`}>
                    <S.RecommendationImage $imageUrl={place.imageUrl}>{!place.imageUrl ? '이미지 없음' : null}</S.RecommendationImage>
                    <span>{place.placeName || '추천 장소'}</span>
                  </S.Recommendation>
                )) : <S.State>표시할 추천 장소가 없습니다.</S.State>}
              </S.RecommendationGrid>
            </S.Recommendations>
          </>
        ) : null}
      </S.Page>
    </AppShell>
  )
}

export default MainPage

function getLocalDateKey() {
  const date = new Date()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}
