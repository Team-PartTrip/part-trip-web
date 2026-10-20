import { useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useMyPlannersQuery } from '@/entities/planner'
import { useMainTravelQuery, type DdayResponseDto, type TourPlaceResponseDto } from '@/entities/travel'
import { figmaPlannerIcon } from '@/shared/assets'
import { paths } from '@/shared/config'
import { formatCalendarDate, formatDateRange, formatTripDuration, normalizeStatus } from '@/shared/utils'
import { activatePlannerSession } from '@/widgets/planner'
import { AppShell } from '@/widgets/app-shell'

import { formatDday, getTravelStatusCopy, hasTravelPlan } from '../model/dday'
import { getMainQueryPresentation } from '../model/main-query-presentation'
import { heroImageOf } from '../model/hero-image'
import { pickRecommendations, readRecommendations, saveRecommendations } from '../model/recommendations'
import * as S from './MainPage.styles'
import { TodaySchedule } from './TodaySchedule'

function RecommendationCategoryIcon({ category = '' }: { category?: string }) {
  return <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {/맛집|식당|음식|RESTAURANT|FOOD|DINING/i.test(category) ? <><path d="M4 3v5a3 3 0 0 0 6 0V3M7 3v18M20 3c-4 0-5 5-5 9h5M20 3v18" /></>
      : /카페|CAFE/i.test(category) ? <><path d="M4 8h12v7a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5ZM16 9h2a3 3 0 0 1 0 6h-2M7 3v2m5-2v2" /></>
        : /숙소|숙박|ACCOMMODATION|HOTEL/i.test(category) ? <><path d="M3 18v3m18-3v3M3 10V5m0 12h18v-5a2 2 0 0 0-2-2H3v7Z" /><circle cx="7" cy="13" r="1" /></>
          : <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>}
  </svg>
}

// 사진을 못 받으면 빈 칸 대신 카테고리 아이콘을 보인다
function RecommendationPhoto({ imageUrl, category }: { imageUrl?: string; category?: string }) {
  const [failed, setFailed] = useState(false)
  return <S.RecommendationImage aria-hidden="true">
    {imageUrl && !failed ? <img src={imageUrl} alt="" onError={() => setFailed(true)} /> : <RecommendationCategoryIcon category={category} />}
  </S.RecommendationImage>
}

export function RecommendationCards({
  city,
  places,
  status,
  emptyMessage = '추천 장소가 아직 준비되지 않았어요. 잠시 후 새로고침해 주세요.',
  onRefresh,
  isRefreshing = false,
}: {
  city: string
  places: TourPlaceResponseDto[]
  status: 'loading' | 'error' | 'empty' | 'ready'
  emptyMessage?: string
  onRefresh?: () => void
  isRefreshing?: boolean
}) {
  const [recommendations, setRecommendations] = useState(() => city ? readRecommendations(city, places) ?? pickRecommendations(places) : [])
  useEffect(() => {
    if (city && status === 'ready') saveRecommendations(city, recommendations)
  }, [city, recommendations, status])

  let content
  if (status === 'loading') {
    content = <>{[0, 1, 2].map((index) => <S.LoadingRecommendation key={index} aria-hidden="true" />)}</>
  } else if (status === 'error') {
    content = <S.RecommendationState role="alert">추천 장소를 불러오지 못했어요. 새로고침해 다시 시도해 주세요.</S.RecommendationState>
  } else if (recommendations.length) {
    content = recommendations.map((place, index) => (
      <S.Recommendation key={`${place.placeName || '추천 장소'}-${index}`}>
        <RecommendationPhoto imageUrl={place.imageUrl} category={place.category} />
        <span>{place.placeName || '추천 장소'}</span>
        <small>{[place.category, typeof place.rating === 'number' && Number.isFinite(place.rating) ? `평점 ${place.rating.toFixed(1)}` : undefined].filter(Boolean).join(' · ')}</small>
      </S.Recommendation>
    ))
  } else {
    content = <S.RecommendationState>{emptyMessage}</S.RecommendationState>
  }

  return <S.Recommendations>
    <S.RecommendationsHeading>
      <S.SectionTitle>가볼 만한 곳</S.SectionTitle>
      <S.RefreshRecommendations type="button" disabled={status === 'loading' || isRefreshing} onClick={() => {
        if (status !== 'ready' || !city || !places.length) {
          onRefresh?.()
          return
        }
        const next = pickRecommendations(places, recommendations)
        saveRecommendations(city, next)
        setRecommendations(next)
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 7v5h-5M4 17v-5h5" /><path d="M6.1 7a7 7 0 0 1 11.6-1L20 9M4 15l2.3 3A7 7 0 0 0 17.9 17" /></svg>
        {isRefreshing ? '불러오는 중' : '새로고침'}
      </S.RefreshRecommendations>
    </S.RecommendationsHeading>
    <S.RecommendationGrid>{content}</S.RecommendationGrid>
  </S.Recommendations>
}

function MainHeroPhoto({ imageUrl }: { imageUrl: string }) {
  const [failed, setFailed] = useState(false)
  return failed ? null : <S.HeroPhoto aria-hidden="true"><img src={imageUrl} alt="" onError={() => setFailed(true)} /></S.HeroPhoto>
}

function MainHero({
  plan,
  destination,
  dateRange,
  today,
  hasTodayPlaces,
  imageUrl,
  onStartPlanner,
  onOpenTodaySchedule,
}: {
  plan?: DdayResponseDto
  destination: string
  dateRange: string
  today: string
  hasTodayPlaces: boolean
  imageUrl?: string
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
        {imageUrl ? <MainHeroPhoto key={imageUrl} imageUrl={imageUrl} /> : null}
        <S.HeroLabel>오늘 일정 · {today.replace(/-/g, '.')}</S.HeroLabel>
        <S.HeroTitle>{destination} 여행</S.HeroTitle>
        {!hasTodayPlaces ? <S.HeroCopy>오늘 확정된 일정이 없어요.</S.HeroCopy> : null}
        <S.HeroAction type="button" onClick={onOpenTodaySchedule}>오늘 일정 보기</S.HeroAction>
      </S.Hero>
    )
  }
  if (plan && hasTravelPlan(plan)) {
    return (
      <S.Hero>
        {imageUrl ? <MainHeroPhoto key={imageUrl} imageUrl={imageUrl} /> : null}
        <S.HeroLabel>{getTravelStatusCopy(plan.status)}</S.HeroLabel>
        {plan.status === 'BEFORE' || plan.dday === 'D-Day' ? <S.Dday>{formatDday(plan.dday)}</S.Dday> : null}
        <S.Destination>{destination} · {formatTripDuration(plan.startDate, plan.endDate) || '여행 기간 미설정'}</S.Destination>
        <S.HeroMeta>{dateRange}</S.HeroMeta>
      </S.Hero>
    )
  }
  return <S.State>{getTravelStatusCopy(plan?.status)}</S.State>
}

export function MainPage() {
  const navigate = useNavigate()
  const { data, isError, isLoading, isRecommendationsError, isRecommendationsLoading, isRefreshing, refetch } = useMainTravelQuery()
  const plan = data.plan
  const recommendationCity = plan?.cityName?.trim() || plan?.regionName?.trim() || ''
  const hasPlan = hasTravelPlan(plan)
  const hasActivePlan = hasPlan && plan?.status !== 'ENDED'
  const canOpenCalendar = Boolean(hasActivePlan && recommendationCity && plan?.startDate && plan.endDate)
  const isDuring = plan?.status === 'DURING'
  const date = new Date()
  const today = formatCalendarDate(date.getFullYear(), date.getMonth(), date.getDate())
  const { data: planners = [] } = useMyPlannersQuery(isDuring)
  const currentPlanner = planners.find((planner) =>
    isDuring
    && Boolean(planner.plannerId && plan?.startDate && plan.endDate)
    && ['CONFIRMED', 'TRAVELING'].includes(normalizeStatus(planner.status))
    && planner.startDate === plan?.startDate
    && planner.endDate === plan?.endDate
    && (!plan?.cityName || !planner.cityName || planner.cityName.trim() === plan.cityName.trim()),
  )
  const todaySlots = isDuring ? plan.todaySchedule ?? [] : []
  const destination = plan?.cityName || plan?.regionName || '여행지'
  const dateRange = plan ? formatDateRange(plan.startDate, plan.endDate) : '여행 정보가 없습니다.'
  const presentation = getMainQueryPresentation({
    isPlanLoading: isLoading,
    isRecommendationsLoading,
    isScheduleLoading: false,
    isRecommendationsError,
    recommendationCount: data.tourPlaces.length,
    isPlanError: isError,
    hasPlanData: Boolean(plan),
  })
  const openTodaySchedule = () => {
    if (currentPlanner?.plannerId) {
      activatePlannerSession(currentPlanner.plannerId)
      void navigate({ to: '/planner/$plannerId', params: { plannerId: String(currentPlanner.plannerId) } })
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
            hasTodayPlaces={todaySlots.some((slot) => slot.place != null)}
            imageUrl={hasActivePlan ? heroImageOf(data.tourPlaces) : undefined}
            onStartPlanner={() => void navigate({ to: paths.plannerDestination })}
            onOpenTodaySchedule={openTodaySchedule}
          />
        )}

        {isDuring ? <TodaySchedule key={today} date={today} slots={todaySlots} /> : null}

        {presentation.page !== 'loading' ? (
          <>
            <S.CalendarCard type="button" disabled={!canOpenCalendar} onClick={() => navigate({ to: paths.recordCalendar })}>
              <S.CalendarIcon><img src={figmaPlannerIcon} alt="" /></S.CalendarIcon>
              <S.CalendarCopy>
                <strong>축제 · 이벤트 캘린더</strong>
                <span>{canOpenCalendar ? `${plan?.regionName || recommendationCity}의 여행 기간 전후 일정` : '여행지와 날짜가 아직 정해지지 않았어요. 여행을 정하면 축제 일정을 확인할 수 있어요.'}</span>
              </S.CalendarCopy>
              {canOpenCalendar ? <S.CalendarArrow aria-hidden="true">›</S.CalendarArrow> : null}
            </S.CalendarCard>

            <RecommendationCards
              key={`${recommendationCity}:${presentation.recommendations}`}
              city={recommendationCity}
              places={hasActivePlan ? data.tourPlaces : []}
              status={presentation.page === 'error' ? 'error' : hasActivePlan ? presentation.recommendations : 'empty'}
              emptyMessage={!hasActivePlan || !recommendationCity ? '여행지가 아직 정해지지 않았어요. 여행지를 정하면 가볼 만한 곳을 추천해 드릴게요.' : undefined}
              onRefresh={() => { void refetch() }}
              isRefreshing={isRefreshing}
            />
          </>
        ) : null}
      </S.Page>
    </AppShell>
  )
}

export default MainPage
