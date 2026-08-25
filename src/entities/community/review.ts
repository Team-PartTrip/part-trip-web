import { apiClient } from '@/shared/libs/api-client'
import { type CommentRequestDto, type CommentResponseDto } from '@/entities/community/board'

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

export async function getReviews(params?: {
  countryInfoId?: number
  page?: number
  size?: number
}): Promise<PageResponseDtoReviewResponseDto> {
  const { data } = await apiClient.get<PageResponseDtoReviewResponseDto>(REVIEW_API_PATHS.base, { params })
  return data
}

export async function createReview(payload: ReviewRequestDto): Promise<ReviewResponseDto> {
  const { data } = await apiClient.post<ReviewResponseDto>(REVIEW_API_PATHS.base, payload)
  return data
}

export async function getReview(reviewId: number): Promise<ReviewResponseDto> {
  const { data } = await apiClient.get<ReviewResponseDto>(REVIEW_API_PATHS.detail(reviewId))
  return data
}

export async function updateReview(reviewId: number, payload: ReviewRequestDto): Promise<ReviewResponseDto> {
  const { data } = await apiClient.put<ReviewResponseDto>(REVIEW_API_PATHS.detail(reviewId), payload)
  return data
}

export async function deleteReview(reviewId: number): Promise<string> {
  const { data } = await apiClient.delete<string>(REVIEW_API_PATHS.detail(reviewId))
  return data
}

export async function getMyReviews(params?: {
  page?: number
  size?: number
}): Promise<PageResponseDtoReviewResponseDto> {
  const { data } = await apiClient.get<PageResponseDtoReviewResponseDto>(REVIEW_API_PATHS.mine, { params })
  return data
}

export async function getReviewComments(reviewId: number): Promise<CommentResponseDto[]> {
  const { data } = await apiClient.get<CommentResponseDto[]>(REVIEW_API_PATHS.comments(reviewId))
  return data
}

export async function createReviewComment(
  reviewId: number,
  payload: CommentRequestDto
): Promise<CommentResponseDto> {
  const { data } = await apiClient.post<CommentResponseDto>(REVIEW_API_PATHS.comments(reviewId), payload)
  return data
}
