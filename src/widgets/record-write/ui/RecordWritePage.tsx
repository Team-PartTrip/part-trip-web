import { useState, type FormEvent } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { createTrip } from '@/entities/trip-plan/api'
import { useCountriesQuery } from '@/entities/travel'
import { createRecordDetailPath, paths } from '@/shared/config'
import { AppShell } from '@/widgets/app-shell'

import * as S from './RecordWritePage.styles'

export function RecordWritePage() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [destination, setDestination] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [memo, setMemo] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { data: countries = [], isError: hasCountriesError } = useCountriesQuery()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!title.trim() || !destination.trim() || !startDate || !endDate || !memo.trim()) {
      setErrorMessage('모든 여행 정보를 입력해주세요.')
      return
    }
    if (startDate > endDate) {
      setErrorMessage('종료일은 시작일보다 빠를 수 없습니다.')
      return
    }

    const normalizedDestination = destination.trim().toLocaleLowerCase()
    const country = countries.find((item) =>
      item.countryName?.toLocaleLowerCase() === normalizedDestination
      || item.cityName?.toLocaleLowerCase() === normalizedDestination,
    )
    if (!country?.countryInfoId) {
      setErrorMessage('목록에 있는 국가 또는 도시를 입력해주세요.')
      return
    }

    try {
      setIsSubmitting(true)
      setErrorMessage('')
      const record = await createTrip({
        content: memo.trim(),
        countryInfoId: country.countryInfoId,
        endDate,
        images: [],
        places: [],
        startDate,
        title: title.trim(),
      })
      if (!record.tripId) throw new Error('Created trip id is missing')
      navigate({ to: createRecordDetailPath(String(record.tripId)) as never, replace: true })
    } catch {
      setErrorMessage('여행 기록을 저장하지 못했습니다. 다시 시도해주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AppShell>
      <S.Content>
        <S.Header><div><h1>새 여행 기록</h1><p>기억하고 싶은 여행을 한곳에 남겨보세요.</p></div><button type="button" onClick={() => navigate({ to: paths.record as never })}>취소</button></S.Header>
        <S.Layout>
          <S.Preview><div aria-hidden>⌖</div><strong>{destination || '여행지를 입력해주세요.'}</strong><span>{startDate && endDate ? `${startDate} - ${endDate}` : '여행 기간'}</span></S.Preview>
          <S.Form onSubmit={(event) => void handleSubmit(event)} noValidate>
            <S.Field><label htmlFor="record-title">기록 제목</label><input id="record-title" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="여행 기록의 제목" maxLength={60} /></S.Field>
            <S.Field><label htmlFor="record-destination">여행지</label><input id="record-destination" list="record-destinations" value={destination} onChange={(event) => setDestination(event.target.value)} placeholder="예: 싱가포르" maxLength={40} /><datalist id="record-destinations">{countries.map((country) => <option key={country.countryInfoId ?? `${country.countryName}-${country.cityName}`} value={country.countryName ?? country.cityName}>{country.cityName ? `${country.cityName}, ${country.countryName}` : country.countryName}</option>)}</datalist></S.Field>
            <S.DateFields><S.Field><label htmlFor="record-start">시작일</label><input id="record-start" type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} /></S.Field><S.Field><label htmlFor="record-end">종료일</label><input id="record-end" type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} /></S.Field></S.DateFields>
            <S.Field><label htmlFor="record-memo">여행 메모</label><textarea id="record-memo" value={memo} onChange={(event) => setMemo(event.target.value)} placeholder="여행에서 기억하고 싶은 순간을 작성하세요." maxLength={1000} /></S.Field>
            {errorMessage || hasCountriesError ? <S.ErrorMessage role="alert">{errorMessage || '여행지 목록을 불러오지 못했습니다.'}</S.ErrorMessage> : null}
            <S.Actions><button type="button" onClick={() => navigate({ to: paths.record as never })}>취소</button><button type="submit" disabled={isSubmitting}>{isSubmitting ? '저장 중' : '기록 저장'}</button></S.Actions>
          </S.Form>
        </S.Layout>
      </S.Content>
    </AppShell>
  )
}
