import { useNavigate } from '@tanstack/react-router'
import { useMainTravelQuery } from '@/entities/travel'
import { figmaPlannerIcon } from '@/shared/assets'
import { paths } from '@/shared/config'
import { formatDate, getDateRangeDays } from '@/shared/utils'
import { AppShell } from '@/widgets/app-shell'

import * as S from './MainPage.styles'

function parseDday(value?: string) {
  const matched = value?.match(/-?\d+/)
  return matched ? Number(matched[0]) : undefined
}

function dateRangeLabel(startDate?: string, endDate?: string) {
  const start = formatDate(startDate)
  const end = formatDate(endDate)
  if (start.length >= 7 && end.startsWith(start.slice(0, 7))) return `${start} – ${end.slice(5)}`
  return `${start} – ${end}`
}

function durationLabel(startDate?: string, endDate?: string) {
  const days = getDateRangeDays(startDate, endDate)
  return days == null ? '여행 기간 미설정' : `${Math.max(0, days - 1)}박 ${days}일`
}

export function MainPage() {
  const navigate = useNavigate()
  const { data, isError, isLoading } = useMainTravelQuery()
  const plan = data.plan
  const destination = plan?.cityName || plan?.countryName || data.country?.cityName || data.country?.countryName || '여행지'
  const dday = parseDday(plan?.dday)
  const dateRange = plan ? dateRangeLabel(plan.startDate, plan.endDate) : '여행 정보가 없습니다.'
  const recommendations = data.tourPlaces.slice(0, 3)

  return (
    <AppShell>
      <S.Page>
        {isError ? <S.Error role="alert">여행 정보를 불러오지 못했습니다.</S.Error> : null}
        {isLoading ? <S.LoadingLayout aria-busy="true" aria-label="여행 정보 로딩 중"><S.LoadingHero /><S.LoadingCalendar /><S.LoadingRecommendations><S.LoadingHeading /><div><S.LoadingRecommendation /><S.LoadingRecommendation /><S.LoadingRecommendation /></div></S.LoadingRecommendations></S.LoadingLayout> : isError ? null : !plan ? <S.State>등록된 여행 정보가 없습니다.</S.State> : <>
          <S.Hero>
            <S.Eyebrow>PartTrip</S.Eyebrow>
            <S.HeroLabel>다가오는 여행</S.HeroLabel>
            <S.Dday>{dday === undefined ? '-' : `D${dday >= 0 ? '-' : '+'}${Math.abs(dday)}`}</S.Dday>
            <S.Destination>{destination} · {durationLabel(plan?.startDate, plan?.endDate)}</S.Destination>
            <S.HeroMeta>{dateRange} · {plan.headcount ?? '-'}명</S.HeroMeta>
          </S.Hero>

          <S.CalendarCard type="button" onClick={() => navigate({ to: paths.recordCalendar })}>
            <S.CalendarIcon><img src={figmaPlannerIcon} alt="" /></S.CalendarIcon>
            <S.CalendarCopy>
              <strong>축제 · 이벤트 캘린더</strong>
              <span>{data.country?.countryName || plan.countryName || '여행지'}의 이번 달 일정</span>
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
        </>}
      </S.Page>
    </AppShell>
  )
}

export default MainPage
