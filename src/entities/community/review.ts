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

const COMMUNITY_API_UNAVAILABLE = '최신 API 명세서에 커뮤니티 API가 없습니다.'

export async function getReviews(params?: { countryInfoId?: number; page?: number; size?: number }): Promise<PageResponseDtoReviewResponseDto> {
  void params
  throw new Error(COMMUNITY_API_UNAVAILABLE)
}

export async function createReview(payload: ReviewRequestDto): Promise<ReviewResponseDto> {
  void payload
  throw new Error(COMMUNITY_API_UNAVAILABLE)
}

export async function getReview(reviewId: number): Promise<ReviewResponseDto> {
  void reviewId
  throw new Error(COMMUNITY_API_UNAVAILABLE)
}

export async function updateReview(reviewId: number, payload: ReviewRequestDto): Promise<ReviewResponseDto> {
  void reviewId
  void payload
  throw new Error(COMMUNITY_API_UNAVAILABLE)
}

export async function deleteReview(reviewId: number): Promise<string> {
  void reviewId
  throw new Error(COMMUNITY_API_UNAVAILABLE)
}

export async function getMyReviews(params?: { page?: number; size?: number }): Promise<PageResponseDtoReviewResponseDto> {
  void params
  throw new Error(COMMUNITY_API_UNAVAILABLE)
}

export async function getReviewComments(reviewId: number): Promise<CommentResponseDto[]> {
  void reviewId
  throw new Error(COMMUNITY_API_UNAVAILABLE)
}

export async function createReviewComment(reviewId: number, payload: CommentRequestDto): Promise<CommentResponseDto> {
  void reviewId
  void payload
  throw new Error(COMMUNITY_API_UNAVAILABLE)
}
