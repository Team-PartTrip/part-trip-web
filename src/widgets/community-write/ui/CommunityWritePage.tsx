import { useState, type FormEvent } from 'react'
import { useNavigate } from '@tanstack/react-router'
import {
  createBoard,
  createReview,
} from '@/entities/community/api'
import { useCountriesQuery } from '@/entities/travel'
import { useMyTrips } from '@/entities/trip-plan'
import { shareTrip } from '@/entities/trip-card/api'
import { uploadImage } from '@/entities/file/api'
import { createCommunityDetailPath, paths } from '@/shared/config'
import { AppShell } from '@/widgets/app-shell'

import * as S from './CommunityWritePage.styles'

const categories = ['자유게시판', '여행 후기', '경로/일정 공유'] as const

export function CommunityWritePage() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [destination, setDestination] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState<(typeof categories)[number]>('자유게시판')
  const [file, setFile] = useState<File | null>(null)
  const [selectedTripId, setSelectedTripId] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { trips, hasError: hasTripsError } = useMyTrips()
  const countriesQuery = useCountriesQuery()
  const countries = countriesQuery.data ?? []

  const selectedTripValue = selectedTripId || (trips[0]?.tripId != null ? String(trips[0].tripId) : '')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (category === '경로/일정 공유' && !selectedTripValue) {
      setErrorMessage('공유할 여행 기록을 선택해주세요.')
      return
    }
    if (category !== '경로/일정 공유' && (!title.trim() || !content.trim())) {
      setErrorMessage('제목과 내용을 모두 입력해주세요.')
      return
    }

    try {
      setIsSubmitting(true)
      setErrorMessage('')
      const images = file ? [Object.values(await uploadImage(file))[0]].filter(Boolean) : []

      if (category === '자유게시판') {
        const post = await createBoard({
          content: destination.trim() ? `[${destination.trim()}]\n${content.trim()}` : content.trim(),
          images,
          title: title.trim(),
        })
        navigate({ to: createCommunityDetailPath(`board-${post.boardId}`) as never, replace: true })
        return
      }

      if (category === '여행 후기') {
        const normalizedDestination = destination.trim().toLocaleLowerCase()
        const country = countries.find((item) =>
          `${item.countryName ?? ''} ${item.cityName ?? ''}`.toLocaleLowerCase().includes(normalizedDestination),
        ) ?? countries[0]
        const post = await createReview({
          content: content.trim(),
          countryInfoId: country?.countryInfoId,
          images,
          rating: 5,
          title: title.trim(),
        })
        navigate({ to: createCommunityDetailPath(`review-${post.reviewId}`) as never, replace: true })
        return
      }

      const post = await shareTrip({ tripId: Number(selectedTripValue) })
      navigate({ to: createCommunityDetailPath(`trip-${post.tripId}`) as never, replace: true })
    } catch {
      setErrorMessage('게시글을 등록하지 못했습니다. 다시 시도해주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AppShell>
      <S.Page>
      <S.Content>
        <S.Header><div><h1>게시글 작성</h1><p>여행 경험과 궁금한 점을 공유해보세요.</p></div><button type="button" onClick={() => navigate({ to: paths.community as never })}>취소</button></S.Header>
        <S.Form onSubmit={(event) => void handleSubmit(event)} noValidate>
          <S.Field>
            <span>게시판</span>
            <S.CategoryRow>{categories.map((item) => <button key={item} type="button" className={category === item ? 'active' : ''} onClick={() => setCategory(item)}>{item}</button>)}</S.CategoryRow>
          </S.Field>
          {category === '경로/일정 공유' ? (
            <S.Field>
              <label htmlFor="community-trip">공유할 여행 기록</label>
              <select id="community-trip" value={selectedTripValue} onChange={(event) => setSelectedTripId(event.target.value)}>
                {trips.map((trip) => <option key={trip.tripId} value={trip.tripId}>{trip.title ?? `${trip.countryName ?? ''} 여행`}</option>)}
              </select>
            </S.Field>
          ) : (
            <>
              <S.Field><label htmlFor="community-title">제목</label><input id="community-title" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="제목을 입력하세요." maxLength={80} /></S.Field>
              <S.Field><label htmlFor="community-destination">여행지</label><input id="community-destination" value={destination} onChange={(event) => setDestination(event.target.value)} placeholder="예: 교토, 일본" maxLength={40} /></S.Field>
              <S.Field><label htmlFor="community-content">내용</label><textarea id="community-content" value={content} onChange={(event) => setContent(event.target.value)} placeholder="여행 이야기를 자유롭게 작성하세요." maxLength={1200} /></S.Field>
              <S.UploadArea>
                <span>{file?.name || '사진을 추가할 수 있습니다.'}</span>
                <label>사진 선택<input type="file" accept="image/*" onChange={(event) => setFile(event.target.files?.[0] ?? null)} /></label>
              </S.UploadArea>
            </>
          )}
          {errorMessage || hasTripsError || countriesQuery.isError ? <S.ErrorMessage role="alert">{errorMessage || '작성에 필요한 정보를 불러오지 못했습니다.'}</S.ErrorMessage> : null}
          <S.Actions><button type="button" onClick={() => navigate({ to: paths.community as never })}>취소</button><button type="submit" disabled={isSubmitting}>{isSubmitting ? '등록 중' : '게시글 등록'}</button></S.Actions>
        </S.Form>
      </S.Content>
      </S.Page>
    </AppShell>
  )
}
