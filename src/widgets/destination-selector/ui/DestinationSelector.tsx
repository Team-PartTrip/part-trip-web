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
  const planQuery = useDdayQuery()
  const plan = planQuery.data
  const countriesQuery = useCountriesQuery()
  const saveMutation = useSaveTravelPlanMutation()
  const firstMonth = plan?.startDate ? new Date(plan.startDate) : new Date()
  const [month, setMonth] = useState(new Date(firstMonth.getFullYear(), firstMonth.getMonth(), 1))
  const [countryName, setCountryName] = useState('')
  const [cityName, setCityName] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [isFormEdited, setIsFormEdited] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const countries = countriesQuery.data ?? []
  const displayCountryName = isFormEdited ? countryName : plan?.countryName ?? countryName
  const displayCityName = isFormEdited ? cityName : plan?.cityName ?? cityName
  const displayStartDate = isFormEdited ? startDate : plan?.startDate ?? startDate
  const displayEndDate = isFormEdited ? endDate : plan?.endDate ?? endDate
  const cells = useMemo(() => {
    const first = new Date(month.getFullYear(), month.getMonth(), 1).getDay()
    const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()
    return [...Array(first).fill(null), ...Array.from({ length: days }, (_, index) => index + 1)]
  }, [month])

  const startEditing = () => {
    if (isFormEdited) return
    setCountryName(plan?.countryName ?? '')
    setCityName(plan?.cityName ?? '')
    setStartDate(plan?.startDate ?? '')
    setEndDate(plan?.endDate ?? '')
    setIsFormEdited(true)
  }

  const selectDestination = (country: CountryInfoResponseDto) => {
    startEditing()
    setCountryName(country.countryName ?? '')
    setCityName(country.cityName ?? '')
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const normalizedCity = displayCityName.trim().toLocaleLowerCase()
    const matchedCountry = countries.find((country) =>
      country.cityName?.toLocaleLowerCase() === normalizedCity
      || country.countryName?.toLocaleLowerCase() === normalizedCity,
    )
    const nextCountryName = displayCountryName.trim() || matchedCountry?.countryName || ''
    const nextCityName = matchedCountry?.cityName || displayCityName.trim()
    if (!nextCountryName || !nextCityName || !displayStartDate || !displayEndDate || displayStartDate > displayEndDate) {
      setErrorMessage('여행지와 올바른 여행 기간을 입력해주세요.')
      return
    }
    try {
      setErrorMessage('')
      await saveMutation.mutateAsync({ cityName: nextCityName, countryName: nextCountryName, endDate: displayEndDate, headcount: plan?.headcount, startDate: displayStartDate })
      onBack()
    } catch {
      setErrorMessage('여행 정보를 저장하지 못했습니다.')
    }
  }

  return (
    <S.Root>
      <S.Header><S.Title>여행지와 기간</S.Title><S.Subtitle>함께 검토할 여행 후보의 기본 조건을 입력하세요.</S.Subtitle></S.Header>
      {errorMessage || countriesQuery.isError ? <S.Error role="alert">{errorMessage || '여행지 목록을 불러오지 못했습니다.'}</S.Error> : null}
      {planQuery.isLoading || countriesQuery.isLoading ? <S.LoadingLayout aria-busy="true" aria-label="여행지 정보 로딩 중"><S.LoadingHeader /><S.LoadingBody><S.LoadingPanel /><S.LoadingPanel /></S.LoadingBody></S.LoadingLayout> : <S.Body>
        <S.FormCard as="form" onSubmit={(event) => void handleSubmit(event)}><S.SectionTitle>여행 조건</S.SectionTitle><S.Field><label>출발 국가</label><PartTripInput value="대한민국" readOnly /></S.Field><S.Field><label htmlFor="destination-city">여행지 후보</label><PartTripInput id="destination-city" value={displayCityName} onChange={(event) => { const value = event.target.value; const normalized = value.trim().toLocaleLowerCase(); const matched = countries.find((country) => country.cityName?.toLocaleLowerCase() === normalized || country.countryName?.toLocaleLowerCase() === normalized); startEditing(); setCityName(value); setCountryName(matched?.countryName ?? '') }} placeholder="오사카" /></S.Field><S.Field><label>인기 여행지</label><S.DestinationGrid>{countries.slice(0, 4).map((country) => <S.DestinationButton key={country.countryInfoId ?? `${country.countryName}-${country.cityName}`} type="button" $active={country.cityName === displayCityName} onClick={() => selectDestination(country)}><strong>{country.cityName || country.countryName}</strong><span>{country.countryName}</span></S.DestinationButton>)}</S.DestinationGrid></S.Field><S.Field><label>여행 기간</label><S.DateRange><PartTripInput type="date" value={displayStartDate} onChange={(event) => { startEditing(); setStartDate(event.target.value) }} /><span>–</span><PartTripInput type="date" value={displayEndDate} onChange={(event) => { startEditing(); setEndDate(event.target.value) }} /></S.DateRange></S.Field><PartTripButton type="submit" disabled={saveMutation.isPending}>{saveMutation.isPending ? '저장 중' : '후보 저장'}</PartTripButton></S.FormCard>
        <S.PreviewCard><S.SectionTitle>여행 기간</S.SectionTitle><S.MonthBar><strong>{month.getFullYear()}년 {month.getMonth() + 1}월</strong><span><button type="button" aria-label="이전 달" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}>‹</button><button type="button" aria-label="다음 달" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}>›</button></span></S.MonthBar><S.Weekdays>{['일', '월', '화', '수', '목', '금', '토'].map((day) => <span key={day}>{day}</span>)}</S.Weekdays><S.CalendarGrid>{cells.map((day, index) => { const value = day ? dateValue(month.getFullYear(), month.getMonth(), day) : ''; const selected = Boolean(value && displayStartDate && displayEndDate && value >= displayStartDate && value <= displayEndDate); const edge = value === displayStartDate || value === displayEndDate; return <S.CalendarCell key={`${day}-${index}`} $selected={selected} $edge={edge}>{day}</S.CalendarCell> })}</S.CalendarGrid><S.DateSummary><strong>{displayStartDate && displayEndDate ? `${dateLabel(displayStartDate)} – ${dateLabel(displayEndDate)}` : '여행 기간을 선택하세요'}</strong><span>{displayStartDate && displayEndDate ? '4박 5일' : ''}</span></S.DateSummary></S.PreviewCard>
      </S.Body>}
    </S.Root>
  )
}

export default DestinationSelector
