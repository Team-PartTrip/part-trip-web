import { apiClient } from '@/shared/libs/api-client'
import { requestWithMockFallback } from '@/shared/libs/api-fallback'
import type { CommentRequestDto, CommentResponseDto } from './types'
import { getMockLikeState } from './mock-state'

export type ReviewRequestDto = {
  countryInfoId?: number
  title?: string
  rating?: number
  content?: string
  images?: string[]
}

export type ReviewResponseDto = {
  reviewId?: number
  countryInfoId?: number
  countryName?: string
  cityName?: string
  userId?: string
  nickName?: string
  title?: string
  rating?: number
  content?: string
  images?: string[]
  likeCount?: number
  liked?: boolean
  commentCount?: number
  createDate?: string
}

export type PageResponseDtoReviewResponseDto = {
  content?: ReviewResponseDto[]
  page?: number
  size?: number
  totalElements?: number
  totalPages?: number
  hasNext?: boolean
}

const REVIEW_API_PATHS = {
  base: '/community/reviews',
  detail: (reviewId: number) => `/community/reviews/${reviewId}`,
  mine: '/community/reviews/mine',
  comments: (reviewId: number) => `/community/reviews/${reviewId}/comments`,
} as const

let mockReviews: ReviewResponseDto[] = []
const mockReviewComments = new Map<number, CommentResponseDto[]>()

function mockPage<T>(content: T[], params?: { page?: number; size?: number }) {
  const page = params?.page ?? 0
  const size = params?.size ?? content.length
  const totalPages = size > 0 ? Math.ceil(content.length / size) : 0
  return {
    content: content.slice(page * size, page * size + size),
    hasNext: page + 1 < totalPages,
    page,
    size,
    totalElements: content.length,
    totalPages,
  }
}

export async function getReviews(params?: {
  countryInfoId?: number
  page?: number
  size?: number
}): Promise<PageResponseDtoReviewResponseDto> {
  return requestWithMockFallback(
    async () => {
      const { data } = await apiClient.get<PageResponseDtoReviewResponseDto>(REVIEW_API_PATHS.base, { params })
      return data
    },
    () => mockPage(mockReviews.map((review) => review.reviewId == null ? review : { ...review, ...getMockLikeState('REVIEW', review.reviewId, review.liked, review.likeCount) }), params),
  )
}

export async function createReview(payload: ReviewRequestDto): Promise<ReviewResponseDto> {
  return requestWithMockFallback(
    async () => {
      const { data } = await apiClient.post<ReviewResponseDto>(REVIEW_API_PATHS.base, payload)
      return data
    },
    () => {
      const review = { ...payload, cityName: '여행지', countryName: '국가', createDate: new Date().toISOString(), commentCount: 0, likeCount: 0, nickName: '나', reviewId: Date.now(), userId: 'mock-user' }
      mockReviews = [review, ...mockReviews]
      return review
    },
  )
}

export async function getReview(reviewId: number): Promise<ReviewResponseDto> {
  return requestWithMockFallback(
    async () => {
      const { data } = await apiClient.get<ReviewResponseDto>(REVIEW_API_PATHS.detail(reviewId))
      return data
    },
    () => {
      const review = mockReviews.find((item) => item.reviewId === reviewId)
      if (!review) throw new Error('여행 후기를 찾을 수 없습니다.')
      return review.reviewId == null ? review : { ...review, ...getMockLikeState('REVIEW', review.reviewId, review.liked, review.likeCount) }
    },
  )
}

export async function updateReview(reviewId: number, payload: ReviewRequestDto): Promise<ReviewResponseDto> {
  return requestWithMockFallback(
    async () => {
      const { data } = await apiClient.put<ReviewResponseDto>(REVIEW_API_PATHS.detail(reviewId), payload)
      return data
    },
    () => {
      const current = mockReviews.find((review) => review.reviewId === reviewId)
      if (!current) throw new Error('여행 후기를 찾을 수 없습니다.')
      const updated = { ...current, ...payload, reviewId }
      mockReviews = mockReviews.map((review) => review.reviewId === reviewId ? updated : review)
      return updated
    },
  )
}

export async function deleteReview(reviewId: number): Promise<string> {
  return requestWithMockFallback(
    async () => {
      const { data } = await apiClient.delete<string>(REVIEW_API_PATHS.detail(reviewId))
      return data
    },
    () => {
      mockReviews = mockReviews.filter((review) => review.reviewId !== reviewId)
      mockReviewComments.delete(reviewId)
      return '삭제되었습니다.'
    },
  )
}

export async function getMyReviews(params?: {
  page?: number
  size?: number
}): Promise<PageResponseDtoReviewResponseDto> {
  return requestWithMockFallback(
    async () => {
      const { data } = await apiClient.get<PageResponseDtoReviewResponseDto>(REVIEW_API_PATHS.mine, { params })
      return data
    },
    () => mockPage(mockReviews, params),
  )
}

export async function getReviewComments(reviewId: number): Promise<CommentResponseDto[]> {
  return requestWithMockFallback(
    async () => {
      const { data } = await apiClient.get<CommentResponseDto[]>(REVIEW_API_PATHS.comments(reviewId))
      return data
    },
    () => mockReviewComments.get(reviewId) ?? [],
  )
}

export async function createReviewComment(
  reviewId: number,
  payload: CommentRequestDto
): Promise<CommentResponseDto> {
  return requestWithMockFallback(
    async () => {
      const { data } = await apiClient.post<CommentResponseDto>(REVIEW_API_PATHS.comments(reviewId), payload)
      return data
    },
    () => {
      const comment = { ...payload, commentId: Date.now(), createDate: new Date().toISOString(), targetId: reviewId, userId: 'mock-user' }
      mockReviewComments.set(reviewId, [...(mockReviewComments.get(reviewId) ?? []), comment])
      return comment
    },
  )
}

export function updateMockReviewComment(
  commentId: number,
  payload: CommentRequestDto,
): CommentResponseDto | undefined {
  for (const [reviewId, comments] of mockReviewComments) {
    const index = comments.findIndex((comment) => comment.commentId === commentId)
    if (index >= 0) {
      const updated = { ...comments[index], ...payload, commentId, userId: 'mock-user' }
      mockReviewComments.set(reviewId, comments.map((comment, commentIndex) => commentIndex === index ? updated : comment))
      return updated
    }
  }
  return undefined
}

export function deleteMockReviewComment(commentId: number) {
  for (const [reviewId, comments] of mockReviewComments) {
    mockReviewComments.set(reviewId, comments.filter((comment) => comment.commentId !== commentId))
  }
}
