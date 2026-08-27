import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useUploadImageMutation } from '@/entities/file'
import { useCreateTripMutation } from '@/entities/trip-plan'
import { useCountriesQuery } from '@/entities/travel'
import { figmaRecordMapPhoto } from '@/shared/assets'
import { paths } from '@/shared/config'
import { Button as PartTripButton, Input as PartTripInput, Textarea as PartTripTextarea } from '@/shared/ui/parttrip'
import { AppShell } from '@/widgets/app-shell'

import * as S from './RecordWritePage.styles'

export function RecordWritePage() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [destination, setDestination] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [memo, setMemo] = useState('')
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoUrl, setPhotoUrl] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const createTripMutation = useCreateTripMutation()
  const uploadImageMutation = useUploadImageMutation()
  const isSubmitting = createTripMutation.isPending || uploadImageMutation.isPending
  const { data: countries = [], isError: hasCountriesError } = useCountriesQuery()

  useEffect(() => () => { if (photoUrl) URL.revokeObjectURL(photoUrl) }, [photoUrl])

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null
    if (photoUrl) URL.revokeObjectURL(photoUrl)
    setPhotoFile(file)
    setPhotoUrl(file ? URL.createObjectURL(file) : '')
  }

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
      setErrorMessage('')
      const images = photoFile ? [Object.values(await uploadImageMutation.mutateAsync(photoFile))[0]].filter(Boolean) : []
      const record = await createTripMutation.mutateAsync({
        content: memo.trim(),
        countryInfoId: country.countryInfoId,
        endDate,
        images,
        places: [],
        startDate,
        title: title.trim(),
      })
      if (!record.tripId) throw new Error('Created trip id is missing')
      navigate({ params: { recordId: String(record.tripId) }, to: '/record/$recordId', replace: true })
    } catch {
      setErrorMessage('여행 기록을 저장하지 못했습니다. 다시 시도해주세요.')
    }
  }

  return (
    <AppShell>
      <S.Content>
        <S.Header><div><h1>여행 기록 작성</h1><p>사진과 짧은 메모로 오늘의 여행을 남겨보세요.</p></div></S.Header>
        <S.Layout>
          <S.Preview><img src={photoUrl || figmaRecordMapPhoto} alt="대표 여행 사진 미리보기" /><p>여행 사진을 대표 이미지로 사용합니다.</p><label>사진 바꾸기<input type="file" accept="image/*" onChange={handlePhotoChange} /></label></S.Preview>
          <S.Form onSubmit={(event) => void handleSubmit(event)} noValidate>
            <S.FormHeading>기록 내용</S.FormHeading>
            <S.PlaceLabel>장소 · {destination || 'Dotonbori'}</S.PlaceLabel>
            <S.Field><label htmlFor="record-memo">기록 내용</label><PartTripTextarea id="record-memo" value={memo} onChange={(event) => setMemo(event.target.value)} placeholder="오늘의 순간을 기록해보세요." maxLength={1000} /></S.Field>
            <S.BasicFields><summary>여행 기본 정보</summary><S.Field><label htmlFor="record-title">기록 제목</label><PartTripInput id="record-title" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="여행 기록의 제목" maxLength={60} /></S.Field><S.Field><label htmlFor="record-destination">여행지</label><PartTripInput id="record-destination" list="record-destinations" value={destination} onChange={(event) => setDestination(event.target.value)} placeholder="예: 싱가포르" maxLength={40} /><datalist id="record-destinations">{countries.map((country) => <option key={country.countryInfoId ?? `${country.countryName}-${country.cityName}`} value={country.countryName ?? country.cityName}>{country.cityName ? `${country.cityName}, ${country.countryName}` : country.countryName}</option>)}</datalist></S.Field><S.DateFields><S.Field><label htmlFor="record-start">시작일</label><PartTripInput id="record-start" type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} /></S.Field><S.Field><label htmlFor="record-end">종료일</label><PartTripInput id="record-end" type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} /></S.Field></S.DateFields></S.BasicFields>
            {errorMessage || hasCountriesError ? <S.ErrorMessage role="alert">{errorMessage || '여행지 목록을 불러오지 못했습니다.'}</S.ErrorMessage> : null}
            <S.Actions><PartTripButton type="button" $variant="secondary" onClick={() => navigate({ to: paths.record })}>취소</PartTripButton><PartTripButton type="submit" disabled={isSubmitting}>{isSubmitting ? '저장 중' : '기록 저장'}</PartTripButton></S.Actions>
          </S.Form>
        </S.Layout>
      </S.Content>
    </AppShell>
  )
}
