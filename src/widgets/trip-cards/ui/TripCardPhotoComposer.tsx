import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react'

import { Button as PartTripButton, Input as PartTripInput, Textarea as PartTripTextarea } from '@/shared/ui/parttrip'

import * as S from './TripCardsPage.styles'

type PhotoDraft = {
  file: File
  url: string
}

type GeneratedDraft = {
  content: string
  endDate: string
  photos: PhotoDraft[]
  startDate: string
  title: string
}

function dateValue(timestamp: number) {
  return new Date(timestamp).toISOString().slice(0, 10)
}

export function TripCardPhotoComposer() {
  const [photos, setPhotos] = useState<PhotoDraft[]>([])
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [generatedDraft, setGeneratedDraft] = useState<GeneratedDraft | null>(null)

  useEffect(() => () => photos.forEach(({ url }) => URL.revokeObjectURL(url)), [photos])

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextPhotos = Array.from(event.target.files ?? [])
      .filter((file) => file.type.startsWith('image/'))
      .map((file) => ({ file, url: URL.createObjectURL(file) }))
      .sort((a, b) => a.file.lastModified - b.file.lastModified)

    photos.forEach(({ url }) => URL.revokeObjectURL(url))
    setPhotos(nextPhotos)
    setGeneratedDraft(null)
    setErrorMessage(nextPhotos.length === 0 ? '이미지 파일을 하나 이상 선택해주세요.' : '')
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!title.trim() || photos.length === 0) {
      setErrorMessage('제목과 이미지를 입력해주세요.')
      return
    }

    const nextStartDate = startDate || dateValue(photos[0].file.lastModified)
    const nextEndDate = endDate || dateValue(photos.at(-1)?.file.lastModified ?? photos[0].file.lastModified)
    if (nextStartDate > nextEndDate) {
      setErrorMessage('종료일은 시작일보다 빠를 수 없습니다.')
      return
    }

    setErrorMessage('')
    setStartDate(nextStartDate)
    setEndDate(nextEndDate)
    setGeneratedDraft({
      content: content.trim() || '사진 파일의 촬영 시각을 기준으로 생성한 여행 기록 초안입니다.',
      endDate: nextEndDate,
      photos,
      startDate: nextStartDate,
      title: title.trim(),
    })
  }

  return (
    <S.Composer>
      <S.Notice>서버 연결 전에는 선택한 사진의 파일 시각으로 여행 카드 초안을 생성합니다. 저장·공유는 서버 API 연결 후 동작합니다.</S.Notice>
      <S.Form onSubmit={handleSubmit}>
        <label>사진 선택<input type="file" accept="image/*" multiple onChange={handlePhotoChange} /></label>
        <S.PreviewGrid>
          {photos.map((photo) => <S.PreviewImage key={`${photo.file.name}-${photo.file.lastModified}`}><img src={photo.url} alt={photo.file.name} /><small>{dateValue(photo.file.lastModified)}</small></S.PreviewImage>)}
        </S.PreviewGrid>
        <label>여행 카드 제목<PartTripInput value={title} onChange={(event) => setTitle(event.target.value)} placeholder="예: 오사카 봄 여행" maxLength={60} /></label>
        <S.DateFields><label>시작일<PartTripInput type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} /></label><label>종료일<PartTripInput type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} /></label></S.DateFields>
        <label>여행 메모<PartTripTextarea value={content} onChange={(event) => setContent(event.target.value)} placeholder="사진과 함께 남길 메모" maxLength={1000} /></label>
        {errorMessage ? <S.ErrorMessage role="alert">{errorMessage}</S.ErrorMessage> : null}
        <PartTripButton type="submit">사진으로 초안 만들기</PartTripButton>
      </S.Form>
      {generatedDraft ? <S.GeneratedCard><S.Badge>프론트 초안</S.Badge><h2>{generatedDraft.title}</h2><p>{generatedDraft.startDate} – {generatedDraft.endDate}</p><p>{generatedDraft.content}</p><S.PreviewGrid>{generatedDraft.photos.map((photo) => <S.PreviewImage key={`${photo.file.name}-${photo.file.lastModified}-generated`}><img src={photo.url} alt={photo.file.name} /></S.PreviewImage>)}</S.PreviewGrid></S.GeneratedCard> : null}
    </S.Composer>
  )
}
