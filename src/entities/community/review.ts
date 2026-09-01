import { createUnsupportedApiError } from '@/shared/libs/unsupported-api-error'
import type { CommentRequestDto, CommentResponseDto } from './types'

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

export async function getReviews(params?: { countryInfoId?: number; page?: number; size?: number }): Promise<PageResponseDtoReviewResponseDto> {
  void params
  throw createUnsupportedApiError('커뮤니티')
}

export async function createReview(payload: ReviewRequestDto): Promise<ReviewResponseDto> {
  void payload
  throw createUnsupportedApiError('커뮤니티')
}

export async function getReview(reviewId: number): Promise<ReviewResponseDto> {
  void reviewId
  throw createUnsupportedApiError('커뮤니티')
}

export async function updateReview(reviewId: number, payload: ReviewRequestDto): Promise<ReviewResponseDto> {
  void reviewId
  void payload
  throw createUnsupportedApiError('커뮤니티')
}

export async function deleteReview(reviewId: number): Promise<string> {
  void reviewId
  throw createUnsupportedApiError('커뮤니티')
}

export async function getMyReviews(params?: { page?: number; size?: number }): Promise<PageResponseDtoReviewResponseDto> {
  void params
  throw createUnsupportedApiError('커뮤니티')
}

export async function getReviewComments(reviewId: number): Promise<CommentResponseDto[]> {
  void reviewId
  throw createUnsupportedApiError('커뮤니티')
}

export async function createReviewComment(reviewId: number, payload: CommentRequestDto): Promise<CommentResponseDto> {
  void reviewId
  void payload
  throw createUnsupportedApiError('커뮤니티')
}
