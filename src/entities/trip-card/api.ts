import { apiClient } from '@/shared/libs/api-client'
import type { CommentRequestDto, CommentResponseDto } from '@/entities/community/types'

export type ShareTripRequestDto = {
  tripId?: number
}

export type PageResponseDtoSharedTripResponseDto = {
  content?: SharedTripResponseDto[]
  page?: number
  size?: number
  totalElements?: number
  totalPages?: number
  hasNext?: boolean
}

export type SharedTripPlaceResponseDto = {
  tripPlaceId?: number
  dayNumber?: number
  placeName?: string
  placeSub?: string
}

export type SharedTripResponseDto = {
  tripId?: number
  userId?: string
  nickName?: string
  title?: string
  countryInfoId?: number
  countryName?: string
  cityName?: string
  startDate?: string
  endDate?: string
  content?: string
  images?: string[]
  likeCount?: number
  liked?: boolean
  commentCount?: number
  isPublic?: boolean
  createDate?: string
  places?: SharedTripPlaceResponseDto[]
}

const SHARED_TRIP_API_PATHS = {
  base: '/community/shared-trips',
  detail: (tripId: number) => `/community/shared-trips/${tripId}`,
  import: (tripId: number) => `/community/shared-trips/${tripId}/import`,
  comments: (tripId: number) => `/community/shared-trips/${tripId}/comments`,
} as const

export async function listSharedTrips(params?: {
  page?: number
  size?: number
}): Promise<PageResponseDtoSharedTripResponseDto> {
  const { data } = await apiClient.get<PageResponseDtoSharedTripResponseDto>(SHARED_TRIP_API_PATHS.base, { params })
  return data
}

export async function shareTrip(payload: ShareTripRequestDto): Promise<SharedTripResponseDto> {
  const { data } = await apiClient.post<SharedTripResponseDto>(SHARED_TRIP_API_PATHS.base, payload)
  return data
}

export async function getSharedTripDetail(tripId: number): Promise<SharedTripResponseDto> {
  const { data } = await apiClient.get<SharedTripResponseDto>(SHARED_TRIP_API_PATHS.detail(tripId))
  return data
}

export async function importTrip(tripId: number): Promise<SharedTripResponseDto> {
  const { data } = await apiClient.post<SharedTripResponseDto>(SHARED_TRIP_API_PATHS.import(tripId))
  return data
}

export async function getSharedTripComments(tripId: number): Promise<CommentResponseDto[]> {
  const { data } = await apiClient.get<CommentResponseDto[]>(SHARED_TRIP_API_PATHS.comments(tripId))
  return data
}

export async function createSharedTripComment(
  tripId: number,
  payload: CommentRequestDto
): Promise<CommentResponseDto> {
  const { data } = await apiClient.post<CommentResponseDto>(SHARED_TRIP_API_PATHS.comments(tripId), payload)
  return data
}
