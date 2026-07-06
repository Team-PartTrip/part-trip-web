import { apiClient } from './client'
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

export async function listSharedTrips(params?: {
  page?: number
  size?: number
}): Promise<PageResponseDtoTripResponseDto> {
  const { data } = await apiClient.get<PageResponseDtoTripResponseDto>(SHARED_TRIP_API_PATHS.base, { params })
  return data
}

export async function shareTrip(payload: ShareTripRequestDto): Promise<TripResponseDto> {
  const { data } = await apiClient.post<TripResponseDto>(SHARED_TRIP_API_PATHS.base, payload)
  return data
}

export async function getSharedTripDetail(tripId: number): Promise<TripResponseDto> {
  const { data } = await apiClient.get<TripResponseDto>(SHARED_TRIP_API_PATHS.detail(tripId))
  return data
}

export async function importTrip(tripId: number): Promise<TripResponseDto> {
  const { data } = await apiClient.post<TripResponseDto>(SHARED_TRIP_API_PATHS.import(tripId))
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
