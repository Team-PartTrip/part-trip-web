import { apiClient } from './client'
import { runtimeConfig } from '@shared/config'
import { type TripResponseDto } from './trip'
import { type CommentRequestDto, type CommentResponseDto } from './board'

export type ShareTripRequestDto = {
  tripId?: number
}

export type PageResponseDtoTripResponseDto = {
  content?: TripResponseDto[]
  page?: number
  size?: number
  totalElements?: number
  totalPages?: number
  hasNext?: boolean
}

const SHARED_TRIP_API_PATHS = {
  base: '/community/shared-trips',
  detail: (tripId: number) => `/community/shared-trips/${tripId}`,
  import: (tripId: number) => `/community/shared-trips/${tripId}/import`,
  comments: (tripId: number) => `/community/shared-trips/${tripId}/comments`,
} as const

// Mock 데이터 정의 (useMockApi가 true일 때 임시로 사용)
const mockSharedTrips: TripResponseDto[] = [
  {
    tripId: 101,
    userId: 'user5',
    nickName: '세계여행가',
    title: '베트남 다낭 3박 4일 일정 공유합니다',
    countryInfoId: 2,
    countryName: '베트남',
    cityName: '다낭',
    startDate: '2026-05-10',
    endDate: '2026-05-14',
    content: '부모님 모시고 가기 좋은 일정입니다. 힐링 코스 위주로 짰어요.',
    images: [],
    likeCount: 42,
    liked: false,
    commentCount: 2,
    isPublic: true,
    createDate: '2026-07-01T12:00:00Z',
    places: [
      { tripPlaceId: 201, dayNumber: 1, placeName: '다낭 국제공항', placeSub: '도착 후 숙소 이동' },
      { tripPlaceId: 202, dayNumber: 2, placeName: '바나힐', placeSub: '케이블카 및 골든브릿지' },
    ]
  }
]

const mockSharedComments: Record<number, CommentResponseDto[]> = {
  101: [
    {
      commentId: 501,
      targetType: 'SHARED_TRIP',
      targetId: 101,
      parentCommentId: undefined,
      userId: 'user6',
      nickName: '효도러',
      content: '부모님과 갈 때 참고할게요! 감사합니다.',
      createDate: '2026-07-02T10:00:00Z',
    }
  ]
}

export async function listSharedTrips(params?: {
  page?: number
  size?: number
}): Promise<PageResponseDtoTripResponseDto> {
  if (runtimeConfig.useMockApi) {
    return {
      content: mockSharedTrips,
      page: params?.page ?? 0,
      size: params?.size ?? 20,
      totalElements: mockSharedTrips.length,
      totalPages: 1,
      hasNext: false,
    }
  }
  const { data } = await apiClient.get<PageResponseDtoTripResponseDto>(SHARED_TRIP_API_PATHS.base, { params })
  return data
}

export async function shareTrip(payload: ShareTripRequestDto): Promise<TripResponseDto> {
  if (runtimeConfig.useMockApi) {
    const newShared: TripResponseDto = {
      tripId: payload.tripId || Date.now(),
      userId: 'mock-user',
      nickName: '임시공유자',
      title: '공유된 여행 일정',
      countryInfoId: 1,
      countryName: '싱가포르',
      cityName: '싱가포르',
      startDate: '2026-07-06',
      endDate: '2026-07-10',
      content: '사용자가 공유한 일정입니다.',
      images: [],
      likeCount: 0,
      liked: false,
      commentCount: 0,
      isPublic: true,
      createDate: new Date().toISOString(),
      places: []
    }
    mockSharedTrips.push(newShared)
    return newShared
  }
  const { data } = await apiClient.post<TripResponseDto>(SHARED_TRIP_API_PATHS.base, payload)
  return data
}

export async function getSharedTripDetail(tripId: number): Promise<TripResponseDto> {
  if (runtimeConfig.useMockApi) {
    const found = mockSharedTrips.find(t => t.tripId === tripId)
    if (!found) throw new Error('Shared trip not found')
    return found
  }
  const { data } = await apiClient.get<TripResponseDto>(SHARED_TRIP_API_PATHS.detail(tripId))
  return data
}

export async function importTrip(tripId: number): Promise<TripResponseDto> {
  if (runtimeConfig.useMockApi) {
    const found = mockSharedTrips.find(t => t.tripId === tripId)
    if (!found) throw new Error('Shared trip not found')
    return {
      ...found,
      tripId: Date.now(), // 새로 생성된 tripId
      userId: 'mock-user', // 내 보관함으로 복사
      isPublic: false,
      createDate: new Date().toISOString()
    }
  }
  const { data } = await apiClient.post<TripResponseDto>(SHARED_TRIP_API_PATHS.import(tripId))
  return data
}

export async function getSharedTripComments(tripId: number): Promise<CommentResponseDto[]> {
  if (runtimeConfig.useMockApi) {
    return mockSharedComments[tripId] || []
  }
  const { data } = await apiClient.get<CommentResponseDto[]>(SHARED_TRIP_API_PATHS.comments(tripId))
  return data
}

export async function createSharedTripComment(
  tripId: number,
  payload: CommentRequestDto
): Promise<CommentResponseDto> {
  if (runtimeConfig.useMockApi) {
    const newComment: CommentResponseDto = {
      commentId: Date.now(),
      targetType: 'SHARED_TRIP',
      targetId: tripId,
      parentCommentId: payload.parentCommentId,
      userId: 'mock-user',
      nickName: '임시댓글러',
      content: payload.content || '',
      createDate: new Date().toISOString(),
    }
    if (!mockSharedComments[tripId]) {
      mockSharedComments[tripId] = []
    }
    mockSharedComments[tripId].push(newComment)

    // 댓글 수 증가
    const trip = mockSharedTrips.find(t => t.tripId === tripId)
    if (trip) {
      trip.commentCount = (trip.commentCount || 0) + 1
    }

    return newComment
  }
  const { data } = await apiClient.post<CommentResponseDto>(SHARED_TRIP_API_PATHS.comments(tripId), payload)
  return data
}
