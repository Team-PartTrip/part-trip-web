import { useState, type FormEvent } from 'react'
import { useNavigate, useParams } from '@tanstack/react-router'
import {
  useGuideCameraResultQuery,
  useSaveGuideCameraRecordMutation,
  useUploadGuideCameraImageMutation,
  type PhotoAnalysisResponseDto,
} from '@/entities/travel-record'
import { paths } from '@/shared/config'
import { useMyTrips } from '@/entities/trip-plan'
import { Button as PartTripButton, Input as PartTripInput, Select as PartTripSelect, Textarea as PartTripTextarea } from '@/shared/ui/parttrip'
import { AppShell } from '@/widgets/app-shell'

import * as S from './RecordCameraPage.styles'

function getCurrentPosition() {
  return new Promise<GeolocationPosition>((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported'))
      return
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true })
  })
}

export function RecordCameraPage() {
  const navigate = useNavigate()
  const { trips, isLoading } = useMyTrips()
  const [travelId, setTravelId] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [latitude, setLatitude] = useState<number>()
  const [longitude, setLongitude] = useState<number>()
  const [errorMessage, setErrorMessage] = useState('')
  const uploadMutation = useUploadGuideCameraImageMutation()
  const isSubmitting = uploadMutation.isPending

  const handleLocation = async () => {
    try {
      setErrorMessage('')
      const position = await getCurrentPosition()
      setLatitude(position.coords.latitude)
      setLongitude(position.coords.longitude)
    } catch {
      setErrorMessage('현재 위치를 가져오지 못했습니다.')
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const selectedTravelId = travelId.trim()
    if (!selectedTravelId || !Number.isInteger(Number(selectedTravelId)) || !imageFile || latitude == null || longitude == null) {
      setErrorMessage('여행, 사진, 촬영 위치를 모두 입력해주세요.')
      return
    }
    try {
      setErrorMessage('')
      const result = await uploadMutation.mutateAsync({
        imageFile,
        latitude: String(latitude),
        longitude: String(longitude),
        travelId: selectedTravelId,
      })
      if (result.imageId == null) throw new Error('imageId is missing')
      navigate({ params: { imageId: String(result.imageId) }, to: '/record/camera/$imageId' })
    } catch {
      setErrorMessage('사진 분석 요청을 처리하지 못했습니다.')
    }
  }

  return (
    <AppShell>
      <S.Page>
        <S.Header><div><S.Title>촬영 기록 분석</S.Title><S.Subtitle>사진을 올리면 장소와 여행 정보를 분석합니다.</S.Subtitle></div><PartTripButton type="button" $variant="secondary" onClick={() => navigate({ to: paths.record })}>여행 기록</PartTripButton></S.Header>
        <S.Form onSubmit={(event) => void handleSubmit(event)}>
          <S.Field><label htmlFor="camera-travel">여행</label><PartTripSelect id="camera-travel" value={travelId} onChange={(event) => setTravelId(event.target.value)} disabled={isLoading}><option value="">여행을 선택하세요</option>{trips.map((trip) => <option key={trip.tripId} value={trip.tripId}>{trip.title || `${trip.cityName || trip.countryName || '여행'} 기록`}</option>)}</PartTripSelect></S.Field>
          <S.Field><label htmlFor="camera-image">사진</label><input id="camera-image" type="file" accept="image/*" onChange={(event) => setImageFile(event.target.files?.[0] ?? null)} /><small>{imageFile?.name || '분석할 사진을 선택하세요.'}</small></S.Field>
          <S.LocationBox><div><strong>촬영 위치</strong><span>{latitude != null && longitude != null ? `${latitude.toFixed(5)}, ${longitude.toFixed(5)}` : '위치가 입력되지 않았습니다.'}</span></div><PartTripButton type="button" $variant="secondary" onClick={() => void handleLocation}>현재 위치 가져오기</PartTripButton></S.LocationBox>
          {errorMessage ? <S.Error role="alert">{errorMessage}</S.Error> : null}
          <PartTripButton type="submit" disabled={isSubmitting || isLoading}>{isSubmitting ? '분석 요청 중' : '사진 분석하기'}</PartTripButton>
        </S.Form>
      </S.Page>
    </AppShell>
  )
}

export function RecordCameraDetailPage() {
  const navigate = useNavigate()
  const { imageId = '' } = useParams({ strict: false })
  const parsedImageId = Number(imageId)
  const isValidImageId = Number.isInteger(parsedImageId)
  const resultQuery = useGuideCameraResultQuery(parsedImageId)
  const result = resultQuery.data
  const errorMessage = isValidImageId
    ? resultQuery.isError ? '분석 결과를 불러오지 못했습니다.' : ''
    : '잘못된 분석 결과입니다.'
  const isLoading = isValidImageId && resultQuery.isLoading

  return (
    <AppShell>
      <S.Page>
        <S.Header><div><S.Title>촬영 기록 상세</S.Title><S.Subtitle>분석된 장소와 설명을 확인하세요.</S.Subtitle></div><PartTripButton type="button" $variant="secondary" onClick={() => navigate({ to: paths.recordCamera })}>사진 다시 올리기</PartTripButton></S.Header>
        {isLoading ? <S.State aria-busy="true">분석 결과를 불러오는 중입니다.</S.State> : null}
        {errorMessage ? <S.Error role="alert">{errorMessage}</S.Error> : null}
        {result ? <S.DetailCard><S.Badge>분석 완료</S.Badge><h2>{result.title || result.designation || '분석된 장소'}</h2><p>{result.era || result.current_status || ''}</p><S.DetailGrid><div><small>개요</small><span>{result.overview || '개요가 없습니다.'}</span></div><div><small>배경</small><span>{result.background || '배경 정보가 없습니다.'}</span></div><div><small>특징</small><span>{result.features || '특징 정보가 없습니다.'}</span></div><div><small>출처</small><span>{result.sourceName || '출처 정보가 없습니다.'}</span></div></S.DetailGrid><PartTripButton type="button" disabled={result.photoId == null} onClick={() => navigate({ params: { imageId: String(imageId) }, to: '/record/camera/$imageId/write' })}>코멘트 작성</PartTripButton></S.DetailCard> : null}
      </S.Page>
    </AppShell>
  )
}

export function RecordCameraWritePage() {
  const navigate = useNavigate()
  const { imageId = '' } = useParams({ strict: false })
  const parsedImageId = Number(imageId)
  const isValidImageId = Number.isInteger(parsedImageId)
  const resultQuery = useGuideCameraResultQuery(parsedImageId)
  const result = resultQuery.data
  const [title, setTitle] = useState<string>()
  const [content, setContent] = useState<string>()
  const [photoDate, setPhotoDate] = useState<string>()
  const isLoading = isValidImageId && resultQuery.isLoading
  const [saved, setSaved] = useState<PhotoAnalysisResponseDto | null>(null)
  const [errorMessage, setErrorMessage] = useState(isValidImageId ? '' : '잘못된 분석 결과입니다.')
  const saveMutation = useSaveGuideCameraRecordMutation()
  const isSaving = saveMutation.isPending

  const queryErrorMessage = resultQuery.isError ? '분석 결과를 불러오지 못했습니다.' : ''
  const titleValue = title ?? result?.commTitle ?? result?.title ?? ''
  const contentValue = content ?? result?.commContent ?? ''
  const photoDateValue = photoDate ?? result?.photoDate ?? new Date().toISOString().slice(0, 10)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (result?.photoId == null || !titleValue.trim() || !contentValue.trim() || !photoDateValue) {
      setErrorMessage('제목, 코멘트, 촬영일을 입력해주세요.')
      return
    }
    try {
      setErrorMessage('')
      const nextSaved = await saveMutation.mutateAsync({
        commContent: contentValue.trim(),
        commTitle: titleValue.trim(),
        photoDate: photoDateValue,
        photoId: result.photoId,
      })
      setSaved(nextSaved)
    } catch {
      setErrorMessage('기록을 저장하지 못했습니다.')
    }
  }

  return (
    <AppShell>
      <S.Page>
        <S.Header><div><S.Title>{saved ? '기록 저장 완료' : '코멘트 작성'}</S.Title><S.Subtitle>{saved ? '촬영 기록이 저장되었습니다.' : '분석 결과에 나만의 코멘트를 남겨보세요.'}</S.Subtitle></div><PartTripButton type="button" $variant="secondary" onClick={() => navigate({ params: { imageId: String(imageId) }, to: '/record/camera/$imageId' })}>상세로 돌아가기</PartTripButton></S.Header>
        {isLoading ? <S.State aria-busy="true">기록 정보를 준비하는 중입니다.</S.State> : null}
        {errorMessage || queryErrorMessage ? <S.Error role="alert">{errorMessage || queryErrorMessage}</S.Error> : null}
        {saved ? <S.DetailCard><S.Badge>저장 완료</S.Badge><h2>{saved.commTitle || titleValue}</h2><p>{saved.commContent || contentValue}</p><PartTripButton type="button" onClick={() => navigate({ to: paths.record })}>여행 기록으로 이동</PartTripButton></S.DetailCard> : <S.Form onSubmit={(event) => void handleSubmit(event)}><S.Field><label htmlFor="camera-title">제목</label><PartTripInput id="camera-title" value={titleValue} onChange={(event) => setTitle(event.target.value)} placeholder="기록 제목" /></S.Field><S.Field><label htmlFor="camera-date">촬영일</label><PartTripInput id="camera-date" type="date" value={photoDateValue} onChange={(event) => setPhotoDate(event.target.value)} /></S.Field><S.Field><label htmlFor="camera-content">코멘트</label><PartTripTextarea id="camera-content" value={contentValue} onChange={(event) => setContent(event.target.value)} placeholder="이 장소에서의 기억을 남겨보세요." /></S.Field><PartTripButton type="submit" disabled={isSaving || isLoading}>{isSaving ? '저장 중' : '기록 저장'}</PartTripButton></S.Form>}
      </S.Page>
    </AppShell>
  )
}
