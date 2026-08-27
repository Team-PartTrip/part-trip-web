import { useState, type FormEvent } from 'react'
import { useNavigate } from '@tanstack/react-router'

import { useCreateBoardMutation, useCreateReviewMutation } from '@/entities/community'
import { useCountriesQuery } from '@/entities/travel'
import { useMyTrips } from '@/entities/trip-plan'
import { useShareTripMutation } from '@/entities/trip-card'
import { useUploadImageMutation } from '@/entities/file'
import { findCountryForDestination, formatBoardContent } from './form'

export const communityWriteCategories = ['자유게시판', '여행 후기', '경로/일정 공유'] as const
export type CommunityWriteCategory = (typeof communityWriteCategories)[number]

export function useCommunityWriteForm() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [destination, setDestination] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState<CommunityWriteCategory>('자유게시판')
  const [file, setFile] = useState<File | null>(null)
  const [selectedTripId, setSelectedTripId] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const { trips, hasError: hasTripsError } = useMyTrips()
  const countriesQuery = useCountriesQuery()
  const countries = countriesQuery.data ?? []
  const createBoardMutation = useCreateBoardMutation()
  const createReviewMutation = useCreateReviewMutation()
  const shareTripMutation = useShareTripMutation()
  const uploadImageMutation = useUploadImageMutation()
  const isSubmitting =
    createBoardMutation.isPending ||
    createReviewMutation.isPending ||
    shareTripMutation.isPending ||
    uploadImageMutation.isPending

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
      setErrorMessage('')
      const images = file ? [Object.values(await uploadImageMutation.mutateAsync(file))[0]].filter(Boolean) : []

      if (category === '자유게시판') {
        const post = await createBoardMutation.mutateAsync({
          content: formatBoardContent(destination, content),
          images,
          title: title.trim(),
        })
        if (post.boardId == null) throw new Error('Created board id is missing')
        navigate({ params: { postId: `board-${post.boardId}` }, to: '/community/$postId', replace: true })
        return
      }

      if (category === '여행 후기') {
        const country = findCountryForDestination(countries, destination)
        if (!country?.countryInfoId) {
          setErrorMessage('여행 후기에 등록할 여행지를 입력해주세요.')
          return
        }
        const post = await createReviewMutation.mutateAsync({
          content: content.trim(),
          countryInfoId: country.countryInfoId,
          images,
          rating: 5,
          title: title.trim(),
        })
        if (post.reviewId == null) throw new Error('Created review id is missing')
        navigate({ params: { postId: `review-${post.reviewId}` }, to: '/community/$postId', replace: true })
        return
      }

      const post = await shareTripMutation.mutateAsync({ tripId: Number(selectedTripValue) })
      if (post.tripId == null) throw new Error('Shared trip id is missing')
      navigate({ params: { postId: `trip-${post.tripId}` }, to: '/community/$postId', replace: true })
    } catch {
      setErrorMessage('게시글을 등록하지 못했습니다. 다시 시도해주세요.')
    }
  }

  return {
    categories: communityWriteCategories,
    category,
    content,
    countries,
    destination,
    errorMessage,
    file,
    hasCountriesError: countriesQuery.isError,
    hasTripsError,
    handleSubmit,
    isSubmitting,
    selectedTripValue,
    setCategory,
    setContent,
    setDestination,
    setFile,
    setSelectedTripId,
    setTitle,
    title,
    trips,
  }
}
