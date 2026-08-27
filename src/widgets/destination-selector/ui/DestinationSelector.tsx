import { useMemo, useState } from 'react'
import type { CountryInfoResponseDto } from '@/entities/travel'
import { useCountriesQuery, useDdayQuery, useSaveTravelPlanMutation } from '@/entities/travel'
import { Button as PartTripButton, Input as PartTripInput } from '@/shared/ui/parttrip'

import * as S from './DestinationSelector.styles'

type Props = { onBack: () => void }

function dateValue(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function dateLabel(value?: string) {
  return value ? value.replaceAll('-', '.') : '-'
}

export function DestinationSelector({ onBack }: Props) {
  const { data: plan } = useDdayQuery()
  const countriesQuery = useCountriesQuery()
  const saveMutation = useSaveTravelPlanMutation()
  const firstMonth = plan?.startDate ? new Date(plan.startDate) : new Date()
  const [month, setMonth] = useState(new Date(firstMonth.getFullYear(), firstMonth.getMonth(), 1))
  const [countryName, setCountryName] = useState(plan?.countryName ?? '')
  const [cityName, setCityName] = useState(plan?.cityName ?? '')
  const [startDate, setStartDate] = useState(plan?.startDate ?? '')
  const [endDate, setEndDate] = useState(plan?.endDate ?? '')
  const [errorMessage, setErrorMessage] = useState('')
  const countries = countriesQuery.data ?? []
  const cells = useMemo(() => {
    const first = new Date(month.getFullYear(), month.getMonth(), 1).getDay()
    const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()
    return [...Array(first).fill(null), ...Array.from({ length: days }, (_, index) => index + 1)]
  }, [month])

  const selectDestination = (country: CountryInfoResponseDto) => {
    setCountryName(country.countryName ?? '')
    setCityName(country.cityName ?? '')
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!countryName.trim() || !cityName.trim() || !startDate || !endDate || startDate > endDate) {
      setErrorMessage('여행지와 올바른 여행 기간을 입력해주세요.')
      return
    }
    try {
      setErrorMessage('')
      await saveMutation.mutateAsync({ cityName: cityName.trim(), countryName: countryName.trim(), endDate, headcount: plan?.headcount, startDate })
      onBack()
    } catch {
      setErrorMessage('여행 정보를 저장하지 못했습니다.')
    }
  }

  return (
    <S.Root>
      <S.Header><S.Title>여행지와 기간</S.Title><S.Subtitle>함께 검토할 여행 후보의 기본 조건을 입력하세요.</S.Subtitle></S.Header>
      {errorMessage || countriesQuery.isError ? <S.Error role="alert">{errorMessage || '여행지 목록을 불러오지 못했습니다.'}</S.Error> : null}
      <S.Body>
        <S.FormCard as="form" onSubmit={(event) => void handleSubmit(event)}><S.SectionTitle>여행 조건</S.SectionTitle><S.Field><label>출발 국가</label><PartTripInput value="대한민국" readOnly /></S.Field><S.Field><label htmlFor="destination-city">여행지 후보</label><PartTripInput id="destination-city" value={cityName} onChange={(event) => setCityName(event.target.value)} placeholder="오사카" /></S.Field><S.Field><label>인기 여행지</label><S.DestinationGrid>{countries.slice(0, 4).map((country) => <S.DestinationButton key={country.countryInfoId ?? `${country.countryName}-${country.cityName}`} type="button" $active={country.cityName === cityName} onClick={() => selectDestination(country)}><strong>{country.cityName || country.countryName}</strong><span>{country.countryName}</span></S.DestinationButton>)}</S.DestinationGrid></S.Field><S.Field><label>여행 기간</label><S.DateRange><PartTripInput type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} /><span>–</span><PartTripInput type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} /></S.DateRange></S.Field><PartTripButton type="submit" disabled={saveMutation.isPending}>{saveMutation.isPending ? '저장 중' : '후보 저장'}</PartTripButton></S.FormCard>
        <S.PreviewCard><S.SectionTitle>여행 기간</S.SectionTitle><S.MonthBar><strong>{month.getFullYear()}년 {month.getMonth() + 1}월</strong><span><button type="button" aria-label="이전 달" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}>‹</button><button type="button" aria-label="다음 달" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}>›</button></span></S.MonthBar><S.Weekdays>{['일', '월', '화', '수', '목', '금', '토'].map((day) => <span key={day}>{day}</span>)}</S.Weekdays><S.CalendarGrid>{cells.map((day, index) => { const value = day ? dateValue(month.getFullYear(), month.getMonth(), day) : ''; const selected = Boolean(value && startDate && endDate && value >= startDate && value <= endDate); const edge = value === startDate || value === endDate; return <S.CalendarCell key={`${day}-${index}`} $selected={selected} $edge={edge}>{day}</S.CalendarCell> })}</S.CalendarGrid><S.DateSummary><strong>{startDate && endDate ? `${dateLabel(startDate)} – ${dateLabel(endDate)}` : '여행 기간을 선택하세요'}</strong><span>{startDate && endDate ? '4박 5일' : ''}</span></S.DateSummary></S.PreviewCard>
      </S.Body>
    </S.Root>
  )
}

export default DestinationSelector
