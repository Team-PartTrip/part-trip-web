import { useNavigate } from '@tanstack/react-router'
import { useMainTravelQuery } from '@/entities/travel'
import { figmaHomeHero } from '@/shared/assets'
import { paths } from '@/shared/config'
import { AppShell } from '@/widgets/app-shell'

import * as S from './MainPage.styles'

function parseDday(value?: string) {
  const matched = value?.match(/-?\d+/)
  return matched ? Number(matched[0]) : undefined
}

function dateLabel(date?: string) {
  return date?.replaceAll('-', '.') ?? '-'
}

function durationLabel(startDate?: string, endDate?: string) {
  if (!startDate || !endDate) return '여행 기간 미설정'
  const days = Math.max(
    1,
    Math.round((Date.parse(endDate) - Date.parse(startDate)) / 86400000) + 1,
  )
  return `${days}일`
}

export function MainPage() {
  const navigate = useNavigate()
  const { data, isError, isLoading } = useMainTravelQuery()

  const plan = data.plan
  const destination = plan?.cityName || plan?.countryName || data.country?.cityName || data.country?.countryName
  const dday = parseDday(plan?.dday)
  const dateRange = plan ? `${dateLabel(plan.startDate)} – ${dateLabel(plan.endDate)}` : '여행 정보가 없습니다.'

  return (
    <AppShell>
      <S.Page>
        <S.Header>
          <S.Title>다음 여행을 준비하세요</S.Title>
          <S.Subtitle>여행 정보를 한눈에 확인하고 다음 계획을 이어가세요.</S.Subtitle>
        </S.Header>

        {isError ? <S.Error role="alert">여행 정보를 불러오지 못했습니다.</S.Error> : null}
        {isLoading ? <S.State aria-busy="true">여행 정보를 불러오는 중입니다.</S.State> : null}

        {!isLoading && !plan ? (
          <S.EmptyCard>
            <strong>쉬는 중</strong>
            <span>여행지를 정하고 나만의 여행 계획을 시작해보세요.</span>
            <S.ActionButton type="button" onClick={() => navigate({ to: paths.plannerDestination })}>여행 정보 설정</S.ActionButton>
          </S.EmptyCard>
        ) : null}

        {plan ? (
          <>
            <S.HeroRow>
              <S.TripCard>
                <S.TripImage src={data.country?.imageUrl || figmaHomeHero} alt="" />
                <S.TripBody>
                  <strong>{destination}</strong>
                  <span>{dateRange}</span>
                  <S.TripStatus><span>계획 중</span><b>{plan.dday ?? '-'}</b></S.TripStatus>
                </S.TripBody>
              </S.TripCard>
              <S.DdayCard>
                <S.Eyebrow>NEXT TRIP</S.Eyebrow>
                <S.Dday>{dday === undefined ? '-' : `D${dday >= 0 ? '-' : '+'}${Math.abs(dday)}`}</S.Dday>
                <S.Destination>{destination}</S.Destination>
                <S.Dates>{dateRange} · {durationLabel(plan.startDate, plan.endDate)}</S.Dates>
                <S.ActionButton type="button" onClick={() => navigate({ to: paths.plannerDestination })}>여행 정보 수정</S.ActionButton>
              </S.DdayCard>
            </S.HeroRow>

            <S.LowerGrid>
              <S.InfoCard>
                <S.CardTitle>여행 준비</S.CardTitle>
                <S.ProgressTrack><S.ProgressBar $progress={plan.startDate && plan.endDate ? 100 : 50} /></S.ProgressTrack>
                <S.StatusGrid>
                  <S.StatusItem><span>여행지</span><b>확정</b></S.StatusItem>
                  <S.StatusItem><span>기간</span><b>{plan.startDate && plan.endDate ? '확정' : '미설정'}</b></S.StatusItem>
                  <S.StatusItem><span>플래너</span><b data-warning="true">API 준비 중</b></S.StatusItem>
                </S.StatusGrid>
              </S.InfoCard>
              <S.InfoCard>
                <S.CardTitle>해야 할 일</S.CardTitle>
                <S.TodoButton type="button" onClick={() => navigate({ to: paths.planner })}>
                  <span>플래너에서 일정 준비하기</span><small>플래너 API 연동 전</small><b>›</b>
                </S.TodoButton>
                <S.TodoButton type="button" onClick={() => navigate({ to: paths.record })}>
                  <span>지난 여행 기록 확인하기</span><small>여행 기록으로 이동</small><b>›</b>
                </S.TodoButton>
              </S.InfoCard>
            </S.LowerGrid>

            <S.Recommendations>
              <S.CardTitle>이번 여행지 추천</S.CardTitle>
              <S.RecommendationGrid>
                {data.tourPlaces.slice(0, 3).map((place) => (
                  <S.Recommendation key={`${place.placeName}-${place.latitude}`}>
                    <img src={place.imageUrl || figmaHomeHero} alt="" />
                    <span>{place.placeName || '추천 장소'}</span>
                    <small>{destination}</small>
                  </S.Recommendation>
                ))}
                {data.tourPlaces.length === 0 ? <S.RecommendationEmpty>추천 장소 데이터가 없습니다.</S.RecommendationEmpty> : null}
              </S.RecommendationGrid>
            </S.Recommendations>

            <S.InsightGrid>
              <S.InsightCard><small>오늘의 표현</small><strong>{data.phrase?.phrase || '표현 데이터가 없습니다.'}</strong><span>{data.phrase?.meaning || ''}</span></S.InsightCard>
              <S.InsightCard><small>오늘의 날씨</small><strong>{data.weather ? `${data.weather.temperature ?? '-'}°` : '날씨 데이터가 없습니다.'}</strong><span>{data.weather?.description || ''}</span></S.InsightCard>
              <S.InsightCard><small>환율</small><strong>{data.exchangeRate ? `${data.exchangeRate.currencyCode ?? ''} ${data.exchangeRate.krwRate ?? '-'}` : '환율 데이터가 없습니다.'}</strong><span>{data.exchangeRate?.date || ''}</span></S.InsightCard>
              <S.InsightCard><small>축제 & 이벤트</small><strong>{data.festivals[0]?.title || '등록된 이벤트가 없습니다.'}</strong><span>{data.festivals[0]?.location || ''}</span></S.InsightCard>
              <S.InsightCard><small>여행지 정보</small><strong>{data.foodInfo.length ? `${data.foodInfo.length}개 음식 정보` : '음식 정보가 없습니다.'}</strong><span>{data.populationInfo.length ? `${data.populationInfo.length}개 인구 정보` : ''}</span></S.InsightCard>
            </S.InsightGrid>
          </>
        ) : null}
      </S.Page>
    </AppShell>
  )
}

export default MainPage
