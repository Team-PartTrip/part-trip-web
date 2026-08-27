import { useNavigate } from '@tanstack/react-router'
import { useMainTravelQuery } from '@/entities/travel'
import { useUserProfileQuery } from '@/entities/user'
import { figmaHomeHero } from '@/shared/assets'
import { paths } from '@/shared/config'
import { formatDate, getDateRangeDays } from '@/shared/utils'
import { AppShell } from '@/widgets/app-shell'

import * as S from './MainPage.styles'

function parseDday(value?: string) {
  const matched = value?.match(/-?\d+/)
  return matched ? Number(matched[0]) : undefined
}

function durationLabel(startDate?: string, endDate?: string) {
  const days = getDateRangeDays(startDate, endDate)
  return days == null ? '여행 기간 미설정' : `${days}일`
}

function dateRangeLabel(startDate?: string, endDate?: string) {
  const start = formatDate(startDate)
  const end = formatDate(endDate)
  if (start.length >= 7 && end.startsWith(start.slice(0, 7))) return `${start} – ${end.slice(5)}`
  return `${start} – ${end}`
}

export function MainPage() {
  const navigate = useNavigate()
  const { data, isError, isLoading } = useMainTravelQuery()
  const { data: profile } = useUserProfileQuery()

  const plan = data.plan
  const destination = plan?.cityName || plan?.countryName || data.country?.cityName || data.country?.countryName
  const dday = parseDday(plan?.dday)
  const dateRange = plan ? dateRangeLabel(plan.startDate, plan.endDate) : '여행 정보가 없습니다.'

  return (
    <AppShell>
      <S.Page>
        <S.Header>
          <S.Title>다음 여행을 준비하세요</S.Title>
          <S.Subtitle>{profile?.name ? `${profile.name}님, ${destination || '다음'} 여행까지 남은 시간을 확인해보세요.` : '다음 여행까지 남은 시간을 확인해보세요.'}</S.Subtitle>
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
                  <S.TripStatus><span>예정 여행</span><b>{plan.dday ?? '-'}</b></S.TripStatus>
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
                <S.ProgressTrack><S.ProgressBar $progress={plan.startDate && plan.endDate ? 67 : 33} /></S.ProgressTrack>
                <S.StatusGrid>
                  <S.StatusItem><span>항공</span><b>{plan.countryName ? '확정' : '미설정'}</b></S.StatusItem>
                  <S.StatusItem><span>숙소</span><b>{plan.startDate && plan.endDate ? '확정' : '미설정'}</b></S.StatusItem>
                  <S.StatusItem><span>일정</span><b data-warning="true">투표 중</b></S.StatusItem>
                </S.StatusGrid>
              </S.InfoCard>
              <S.InfoCard>
                <S.CardTitle>해야 할 일</S.CardTitle>
                <S.TodoButton type="button" onClick={() => navigate({ to: paths.planner })}>
                  <span>플래너에서 투표 이어가기</span><small>3건 대기 중</small><b>›</b>
                </S.TodoButton>
                <S.TodoButton type="button" onClick={() => navigate({ to: paths.record })}>
                  <span>체크리스트 작성</span><small>12개 중 8개 완료</small><b>›</b>
                </S.TodoButton>
              </S.InfoCard>
            </S.LowerGrid>

            <S.Recommendations>
              <S.CardTitle>이번 여행지 추천</S.CardTitle>
              <S.RecommendationGrid>
                {data.tourPlaces.slice(0, 3).map((place, index) => (
                  <S.Recommendation key={`${place.placeName}-${place.latitude}-${index}`}>
                    <S.RecommendationImage $imageUrl={place.imageUrl} aria-hidden="true" />
                    <span>{place.placeName || '추천 장소'}</span>
                    <small>{destination} · 추천</small>
                  </S.Recommendation>
                ))}
                {data.tourPlaces.length === 0 ? <S.RecommendationEmpty>추천 장소 데이터가 없습니다.</S.RecommendationEmpty> : null}
              </S.RecommendationGrid>
            </S.Recommendations>

          </>
        ) : null}
      </S.Page>
    </AppShell>
  )
}

export default MainPage
