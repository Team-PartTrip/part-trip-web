import { apiClient } from './client'
import { runtimeConfig } from '@shared/config'
import { type CommentRequestDto, type CommentResponseDto } from './board'

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

// Mock 데이터 정의 (useMockApi가 true일 때 임시로 사용)
const mockReviews: ReviewResponseDto[] = [
  {
    reviewId: 1,
    countryInfoId: 1,
    countryName: '싱가포르',
    cityName: '싱가포르',
    userId: 'user1',
    nickName: '싱가포르 매니아',
    title: '정말 좋았던 싱가포르 맛집 후기!',
    rating: 5,
    content: '칠리크랩과 카야토스트는 꼭 드세요!',
    images: [],
    likeCount: 12,
    liked: false,
    commentCount: 1,
    createDate: '2026-07-06T10:00:00Z',
  }
]

const mockComments: Record<number, CommentResponseDto[]> = {
  1: [
    {
      commentId: 1,
      targetType: 'REVIEW',
      targetId: 1,
      parentCommentId: undefined,
      userId: 'user2',
      nickName: '리플러',
      content: '좋은 정보 감사합니다!',
      createDate: '2026-07-06T11:00:00Z',
    }
  ]
}

export async function getReviews(params?: {
  countryInfoId?: number
  page?: number
  size?: number
}): Promise<PageResponseDtoReviewResponseDto> {
  if (runtimeConfig.useMockApi) {
    const list = params?.countryInfoId
      ? mockReviews.filter(r => r.countryInfoId === params.countryInfoId)
      : mockReviews
    return {
      content: list,
      page: params?.page ?? 0,
      size: params?.size ?? 20,
      totalElements: list.length,
      totalPages: 1,
      hasNext: false,
    }
  }
  const { data } = await apiClient.get<PageResponseDtoReviewResponseDto>(REVIEW_API_PATHS.base, { params })
  return data
}

export async function createReview(payload: ReviewRequestDto): Promise<ReviewResponseDto> {
  if (runtimeConfig.useMockApi) {
    const newReview: ReviewResponseDto = {
      ...payload,
      reviewId: Date.now(),
      countryName: '싱가포르',
      cityName: '싱가포르',
      userId: 'mock-user',
      nickName: '임시유저',
      likeCount: 0,
      liked: false,
      commentCount: 0,
      createDate: new Date().toISOString(),
    }
    mockReviews.push(newReview)
    return newReview
  }
  const { data } = await apiClient.post<ReviewResponseDto>(REVIEW_API_PATHS.base, payload)
  return data
}

export async function getReview(reviewId: number): Promise<ReviewResponseDto> {
  if (runtimeConfig.useMockApi) {
    const found = mockReviews.find(r => r.reviewId === reviewId)
    if (!found) throw new Error('Review not found')
    return found
  }
  const { data } = await apiClient.get<ReviewResponseDto>(REVIEW_API_PATHS.detail(reviewId))
  return data
}

export async function updateReview(reviewId: number, payload: ReviewRequestDto): Promise<ReviewResponseDto> {
  if (runtimeConfig.useMockApi) {
    const index = mockReviews.findIndex(r => r.reviewId === reviewId)
    if (index === -1) throw new Error('Review not found')
    const updated: ReviewResponseDto = {
      ...mockReviews[index],
      ...payload,
    }
    mockReviews[index] = updated
    return updated
  }
  const { data } = await apiClient.put<ReviewResponseDto>(REVIEW_API_PATHS.detail(reviewId), payload)
  return data
}

export async function deleteReview(reviewId: number): Promise<string> {
  if (runtimeConfig.useMockApi) {
    const index = mockReviews.findIndex(r => r.reviewId === reviewId)
    if (index === -1) throw new Error('Review not found')
    mockReviews.splice(index, 1)
    return 'success'
  }
  const { data } = await apiClient.delete<string>(REVIEW_API_PATHS.detail(reviewId))
  return data
}

export async function getMyReviews(params?: {
  page?: number
  size?: number
}): Promise<PageResponseDtoReviewResponseDto> {
  if (runtimeConfig.useMockApi) {
    return {
      content: mockReviews.filter(r => r.userId === 'mock-user' || r.userId === 'user1'),
      page: params?.page ?? 0,
      size: params?.size ?? 20,
      totalElements: mockReviews.length,
      totalPages: 1,
      hasNext: false,
    }
  }
  const { data } = await apiClient.get<PageResponseDtoReviewResponseDto>(REVIEW_API_PATHS.mine, { params })
  return data
}

export async function getReviewComments(reviewId: number): Promise<CommentResponseDto[]> {
  if (runtimeConfig.useMockApi) {
    return mockComments[reviewId] || []
  }
  const { data } = await apiClient.get<CommentResponseDto[]>(REVIEW_API_PATHS.comments(reviewId))
  return data
}

export async function createReviewComment(
  reviewId: number,
  payload: CommentRequestDto
): Promise<CommentResponseDto> {
  if (runtimeConfig.useMockApi) {
    const newComment: CommentResponseDto = {
      commentId: Date.now(),
      targetType: 'REVIEW',
      targetId: reviewId,
      parentCommentId: payload.parentCommentId,
      userId: 'mock-user',
      nickName: '임시댓글러',
      content: payload.content || '',
      createDate: new Date().toISOString(),
    }
    if (!mockComments[reviewId]) {
      mockComments[reviewId] = []
    }
    mockComments[reviewId].push(newComment)

    // 댓글 수 증가
    const review = mockReviews.find(r => r.reviewId === reviewId)
    if (review) {
      review.commentCount = (review.commentCount || 0) + 1
    }

    return newComment
  }
  const { data } = await apiClient.post<CommentResponseDto>(REVIEW_API_PATHS.comments(reviewId), payload)
  return data
}
