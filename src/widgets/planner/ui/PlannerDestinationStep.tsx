import { useState, type FormEvent } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useMyPlannersQuery } from '@/entities/planner'
import { useCitySearchQuery, usePopularCitiesQuery } from '@/entities/travel'
import { paths } from '@/shared/config'
import { Button, Input } from '@/shared/ui/parttrip'
import { formatCalendarDate, formatDateRange } from '@/shared/utils'
import { getDomesticCityNames } from '../model/domestic-cities'
import type { PlannerCreationDraft } from '../model/planner-creation'
import { writePlannerCreationDraft } from '../model/planner-creation'
import { isValidPlannerDateRange, overlapsExistingTrip } from '../model/planner-date'
import * as S from './PlannerAiFlow.styles'

function maxEndDateFor(startDate?: string) {
  if (!startDate) return undefined
  const date = new Date(`${startDate}T00:00:00`)
  date.setDate(date.getDate() + 13)
  return formatCalendarDate(date.getFullYear(), date.getMonth(), date.getDate())
}

export function PlannerDestinationStep({ initialDraft }: { initialDraft?: PlannerCreationDraft }) {
  const navigate = useNavigate()
  const plannersQuery = useMyPlannersQuery()
  const [cityName, setCityName] = useState(initialDraft?.cityName ?? '')
  const [startDate, setStartDate] = useState(initialDraft?.startDate ?? '')
  const [endDate, setEndDate] = useState(initialDraft?.endDate ?? '')
  const [message, setMessage] = useState('')
  const cityKeyword = cityName.trim()
  const isSearchingCities = Boolean(cityKeyword)
  const cityQuery = useCitySearchQuery('대한민국', cityKeyword, isSearchingCities)
  const popularCitiesQuery = usePopularCitiesQuery(100)
  const displayedCities = isSearchingCities ? cityQuery.data ?? [] : popularCitiesQuery.data ?? []
  const domesticCities = getDomesticCityNames(displayedCities)
  const cityListIsFetching = isSearchingCities ? cityQuery.isFetching : popularCitiesQuery.isFetching
  const cityListIsError = isSearchingCities ? cityQuery.isError : popularCitiesQuery.isError
  const now = new Date()
  const today = formatCalendarDate(now.getFullYear(), now.getMonth(), now.getDate())
  const maxEndDate = maxEndDateFor(startDate)
  const existingTripConflict = plannersQuery.data
    ? overlapsExistingTrip(plannersQuery.data, startDate, endDate)
    : false

  const handleStartDateChange = (nextStartDate: string) => {
    setStartDate(nextStartDate)
    const lastAllowedDate = maxEndDateFor(nextStartDate)
    if (endDate && lastAllowedDate && endDate > lastAllowedDate) setEndDate('')
  }

  const goToCriteria = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage('')
    if (plannersQuery.isLoading) return
    if (plannersQuery.isError) return setMessage('기존 여행 날짜를 확인하지 못했어요. 다시 불러온 뒤 계속해주세요.')
    if (!cityKeyword) return setMessage('국내 여행 도시를 선택해주세요.')
    if (cityQuery.isLoading || cityQuery.isFetching) return setMessage('국내 도시 목록을 불러오는 중이에요. 잠시 후 다시 시도해주세요.')
    if (cityQuery.isError) return setMessage('국내 도시 목록을 불러오지 못했어요. 다시 시도해주세요.')
    if (!domesticCities.includes(cityKeyword)) return setMessage('검색 결과에서 대한민국 도시를 선택해주세요.')
    if (startDate < today || !isValidPlannerDateRange(startDate, endDate)) {
      return setMessage('여행 날짜를 확인해주세요. 과거 날짜는 선택할 수 없고 최대 14일까지 계획할 수 있어요.')
    }
    if (existingTripConflict) return setMessage('선택한 기간에 다른 여행이 있어요. 날짜를 바꿔주세요.')

    writePlannerCreationDraft({ cityName: cityKeyword, startDate, endDate, blocks: [] })
    void navigate({ to: paths.plannerExplore })
  }

  return (
    <S.Grid>
      <S.Card>
        <S.Form onSubmit={goToCriteria}>
          <S.Field>
            <label htmlFor="planner-city-name">여행 도시 · 대한민국</label>
            <Input id="planner-city-name" autoComplete="off" maxLength={50}
              value={cityName} onChange={(event) => setCityName(event.target.value)} placeholder="국내 도시를 입력하세요" />
            <S.CityList aria-label={isSearchingCities ? '대한민국 도시 검색 결과' : '인기 국내 여행지'}>
              <strong>{isSearchingCities ? '검색 결과' : '인기 여행지'}</strong>
              {cityListIsFetching ? <p role="status">{isSearchingCities ? '국내 도시를 찾고 있어요.' : '인기 여행지를 불러오고 있어요.'}</p> : null}
              {cityListIsError ? <S.Error role="alert">{isSearchingCities ? '국내 도시 목록을 불러오지 못했어요.' : '인기 여행지를 불러오지 못했어요.'}</S.Error> : null}
              {!cityListIsFetching && !cityListIsError && !domesticCities.length ? <small>{isSearchingCities ? '일치하는 국내 도시가 없습니다. 국내 여행은 대한민국 도시만 선택할 수 있어요.' : '인기 여행지가 아직 없어요. 도시 이름을 검색해보세요.'}</small> : null}
              {!cityListIsFetching && domesticCities.map((city) => <S.City key={city} type="button" $active={cityKeyword === city} aria-pressed={cityKeyword === city} onClick={() => setCityName(city)}>
                <strong>{city}</strong><span>대한민국</span>
              </S.City>)}
            </S.CityList>
          </S.Field>
          <S.Field>
            <span>여행 기간</span>
            <S.DateGrid>
              <div><label htmlFor="planner-start-date">출발일</label><Input id="planner-start-date" type="date" min={today} max={maxEndDate} value={startDate} onChange={(event) => handleStartDateChange(event.target.value)} /></div>
              <div><label htmlFor="planner-end-date">도착일</label><Input id="planner-end-date" type="date" min={startDate || today} max={maxEndDate} value={endDate} onChange={(event) => setEndDate(event.target.value)} /></div>
            </S.DateGrid>
            <small>이미 다른 여행이 있는 날짜는 선택할 수 없어요. 날짜는 필수예요.</small>
          </S.Field>
          {message ? <S.Error role="alert">{message}</S.Error> : null}
          <S.ButtonRow>
            <Button type="submit" disabled={plannersQuery.isLoading || plannersQuery.isError}>
              {plannersQuery.isLoading ? '여행 일정 확인 중…' : '다음'}
            </Button>
          </S.ButtonRow>
        </S.Form>
      </S.Card>
      <S.Summary>
        <h2>여행 정보</h2>
        <dl>
          <div><dt>여행지</dt><dd>{cityName || '도시를 선택해주세요'}</dd></div>
          <div><dt>기간</dt><dd>{startDate && endDate ? formatDateRange(startDate, endDate) : '날짜를 선택해주세요'}</dd></div>
          <div><dt>여행 유형</dt><dd>국내 여행</dd></div>
        </dl>
      </S.Summary>
    </S.Grid>
  )
}
