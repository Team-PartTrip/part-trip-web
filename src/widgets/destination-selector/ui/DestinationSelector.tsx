import { useEffect, useMemo, useRef, useState } from 'react'
import { useCountriesQuery, useDdayQuery } from '@/entities/travel'
import { Button as PartTripButton, Input as PartTripInput } from '@/shared/ui/parttrip'
import { formatCalendarDate, formatDate, formatTripDuration, getMonthCalendarDays } from '@/shared/utils'

import * as S from './DestinationSelector.styles'

type Props = { onBack: () => void }

function monthFromDate(value?: string | null) {
  if (!value) return undefined
  const [year, month] = value.split('-').map(Number)
  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) return undefined
  return new Date(year, month - 1, 1)
}

export function DestinationSelector({ onBack }: Props) {
  const planQuery = useDdayQuery()
  const plan = planQuery.data
  const countriesQuery = useCountriesQuery()
  const [month, setMonth] = useState(() => monthFromDate(plan?.startDate) ?? new Date(new Date().getFullYear(), new Date().getMonth(), 1))
  const monthChangedRef = useRef(false)
  const countries = countriesQuery.data ?? []
  const displayCityName = plan?.cityName ?? ''
  const displayStartDate = plan?.startDate ?? ''
  const displayEndDate = plan?.endDate ?? ''
  const tripDuration = formatTripDuration(displayStartDate, displayEndDate)
  useEffect(() => {
    const nextMonth = monthFromDate(plan?.startDate)
    if (nextMonth && !monthChangedRef.current) setMonth(nextMonth)
  }, [plan?.startDate])

  const cells = useMemo(() => getMonthCalendarDays(month.getFullYear(), month.getMonth()), [month])

  return (
    <S.Root>
      <S.Header><S.Title>여행지와 기간</S.Title><S.Subtitle>최신 명세서에 정의된 여행지 정보를 확인합니다.</S.Subtitle></S.Header>
      {countriesQuery.isError ? <S.Error role="alert">여행지 목록을 불러오지 못했습니다.</S.Error> : <S.Error role="status">최신 API 명세서에 여행 일정 저장 endpoint가 없어 조회만 지원합니다.</S.Error>}
      {planQuery.isLoading || countriesQuery.isLoading ? <S.LoadingLayout aria-busy="true" aria-label="여행지 정보 로딩 중"><S.LoadingHeader /><S.LoadingBody><S.LoadingPanel /><S.LoadingPanel /></S.LoadingBody></S.LoadingLayout> : <S.Body>
        <S.FormCard><S.SectionTitle>여행 조건</S.SectionTitle><S.Field><label htmlFor="departure-country">출발 국가</label><PartTripInput id="departure-country" value="대한민국" readOnly /></S.Field><S.Field><label htmlFor="destination-city">여행지 후보</label><PartTripInput id="destination-city" autoComplete="off" value={displayCityName} readOnly placeholder="오사카" /></S.Field><S.Field><label>인기 여행지</label><S.DestinationGrid>{countries.slice(0, 4).map((country) => <S.DestinationButton key={country.countryInfoId ?? `${country.countryName}-${country.cityName}`} type="button" disabled $active={country.cityName === displayCityName}><strong>{country.cityName || country.countryName}</strong><span>{country.countryName}</span></S.DestinationButton>)}</S.DestinationGrid></S.Field><S.Field><span>여행 기간</span><S.DateRange><label htmlFor="destination-start-date">출발일</label><PartTripInput id="destination-start-date" type="date" value={displayStartDate} readOnly /><span>–</span><label htmlFor="destination-end-date">도착일</label><PartTripInput id="destination-end-date" type="date" value={displayEndDate} readOnly /></S.DateRange></S.Field><PartTripButton type="button" $variant="secondary" onClick={onBack}>돌아가기</PartTripButton></S.FormCard>
        <S.PreviewCard><S.SectionTitle>여행 기간</S.SectionTitle><S.MonthBar><strong>{month.getFullYear()}년 {month.getMonth() + 1}월</strong><span><button type="button" aria-label="이전 달" onClick={() => { monthChangedRef.current = true; setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1)) }}>‹</button><button type="button" aria-label="다음 달" onClick={() => { monthChangedRef.current = true; setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1)) }}>›</button></span></S.MonthBar><S.Weekdays>{['일', '월', '화', '수', '목', '금', '토'].map((day) => <span key={day}>{day}</span>)}</S.Weekdays><S.CalendarGrid>{cells.map((day, index) => { const value = day ? formatCalendarDate(month.getFullYear(), month.getMonth(), day) : ''; const selected = Boolean(value && displayStartDate && displayEndDate && value >= displayStartDate && value <= displayEndDate); const edge = value === displayStartDate || value === displayEndDate; return <S.CalendarCell key={`${day}-${index}`} $selected={selected} $edge={edge}>{day}</S.CalendarCell> })}</S.CalendarGrid><S.DateSummary><strong>{displayStartDate && displayEndDate ? `${formatDate(displayStartDate)} – ${formatDate(displayEndDate)}` : '여행 기간을 선택하세요'}</strong><span>{tripDuration}</span></S.DateSummary></S.PreviewCard>
      </S.Body>}
    </S.Root>
  )
}

export default DestinationSelector
