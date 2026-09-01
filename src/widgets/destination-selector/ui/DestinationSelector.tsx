import { useEffect, useMemo, useRef, useState } from 'react'
import type { CountryInfoResponseDto } from '@/entities/travel'
import { useCountriesQuery, useDdayQuery } from '@/entities/travel'
import { Button as PartTripButton, Input as PartTripInput } from '@/shared/ui/parttrip'
import { getDateRangeDays } from '@/shared/utils'

import * as S from './DestinationSelector.styles'

type Props = { onBack: () => void }

function dateValue(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function dateLabel(value?: string) {
  return value ? value.replaceAll('-', '.') : '-'
}

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
  const [cityName, setCityName] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [isFormEdited, setIsFormEdited] = useState(false)
  const countries = countriesQuery.data ?? []
  const displayCityName = isFormEdited ? cityName : plan?.cityName ?? cityName
  const displayStartDate = isFormEdited ? startDate : plan?.startDate ?? startDate
  const displayEndDate = isFormEdited ? endDate : plan?.endDate ?? endDate
  const tripDays = getDateRangeDays(displayStartDate, displayEndDate)
  useEffect(() => {
    const nextMonth = monthFromDate(plan?.startDate)
    if (nextMonth && !monthChangedRef.current) setMonth(nextMonth)
  }, [plan?.startDate])

  const cells = useMemo(() => {
    const first = new Date(month.getFullYear(), month.getMonth(), 1).getDay()
    const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()
    return [...Array(first).fill(null), ...Array.from({ length: days }, (_, index) => index + 1)]
  }, [month])

  const startEditing = () => {
    if (isFormEdited) return
    setCityName(plan?.cityName ?? '')
    setStartDate(plan?.startDate ?? '')
    setEndDate(plan?.endDate ?? '')
    setIsFormEdited(true)
  }

  const selectDestination = (country: CountryInfoResponseDto) => {
    startEditing()
    setCityName(country.cityName ?? '')
  }

  return (
    <S.Root>
      <S.Header><S.Title>여행지와 기간</S.Title><S.Subtitle>최신 명세서에 정의된 여행지 정보를 확인합니다.</S.Subtitle></S.Header>
      {countriesQuery.isError ? <S.Error role="alert">여행지 목록을 불러오지 못했습니다.</S.Error> : <S.Error role="status">최신 API 명세서에 여행 일정 저장 endpoint가 없어 조회만 지원합니다.</S.Error>}
      {planQuery.isLoading || countriesQuery.isLoading ? <S.LoadingLayout aria-busy="true" aria-label="여행지 정보 로딩 중"><S.LoadingHeader /><S.LoadingBody><S.LoadingPanel /><S.LoadingPanel /></S.LoadingBody></S.LoadingLayout> : <S.Body>
        <S.FormCard><S.SectionTitle>여행 조건</S.SectionTitle><S.Field><label>출발 국가</label><PartTripInput value="대한민국" readOnly /></S.Field><S.Field><label htmlFor="destination-city">여행지 후보</label><PartTripInput id="destination-city" autoComplete="off" value={displayCityName} onChange={(event) => { const value = event.target.value; startEditing(); setCityName(value) }} placeholder="오사카" /></S.Field><S.Field><label>인기 여행지</label><S.DestinationGrid>{countries.slice(0, 4).map((country) => <S.DestinationButton key={country.countryInfoId ?? `${country.countryName}-${country.cityName}`} type="button" $active={country.cityName === displayCityName} onClick={() => selectDestination(country)}><strong>{country.cityName || country.countryName}</strong><span>{country.countryName}</span></S.DestinationButton>)}</S.DestinationGrid></S.Field><S.Field><span>여행 기간</span><S.DateRange><label htmlFor="destination-start-date">출발일</label><PartTripInput id="destination-start-date" type="date" value={displayStartDate} onChange={(event) => { startEditing(); setStartDate(event.target.value) }} /><span>–</span><label htmlFor="destination-end-date">도착일</label><PartTripInput id="destination-end-date" type="date" value={displayEndDate} onChange={(event) => { startEditing(); setEndDate(event.target.value) }} /></S.DateRange></S.Field><PartTripButton type="button" $variant="secondary" onClick={onBack}>돌아가기</PartTripButton></S.FormCard>
        <S.PreviewCard><S.SectionTitle>여행 기간</S.SectionTitle><S.MonthBar><strong>{month.getFullYear()}년 {month.getMonth() + 1}월</strong><span><button type="button" aria-label="이전 달" onClick={() => { monthChangedRef.current = true; setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1)) }}>‹</button><button type="button" aria-label="다음 달" onClick={() => { monthChangedRef.current = true; setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1)) }}>›</button></span></S.MonthBar><S.Weekdays>{['일', '월', '화', '수', '목', '금', '토'].map((day) => <span key={day}>{day}</span>)}</S.Weekdays><S.CalendarGrid>{cells.map((day, index) => { const value = day ? dateValue(month.getFullYear(), month.getMonth(), day) : ''; const selected = Boolean(value && displayStartDate && displayEndDate && value >= displayStartDate && value <= displayEndDate); const edge = value === displayStartDate || value === displayEndDate; return <S.CalendarCell key={`${day}-${index}`} $selected={selected} $edge={edge}>{day}</S.CalendarCell> })}</S.CalendarGrid><S.DateSummary><strong>{displayStartDate && displayEndDate ? `${dateLabel(displayStartDate)} – ${dateLabel(displayEndDate)}` : '여행 기간을 선택하세요'}</strong><span>{tripDays == null ? '' : `${Math.max(0, tripDays - 1)}박 ${tripDays}일`}</span></S.DateSummary></S.PreviewCard>
      </S.Body>}
    </S.Root>
  )
}

export default DestinationSelector
