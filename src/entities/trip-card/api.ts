import { apiClient } from '../../shared/libs/api-client.ts'
import type { CommentRequestDto, CommentResponseDto } from '../community/types.ts'

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
  address?: string
  tripPlaceId?: number
  dayNumber?: number
  placeName?: string
  placeSub?: string
  rating?: number
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
  coverImageUrl?: string
  isPublic?: boolean
  createDate?: string
  photoCount?: number
  places?: SharedTripPlaceResponseDto[]
  timeline?: TravelCardTimelineItemDto[]
}

export type TravelCardListItemDto = {
  cardId?: number
  cityName?: string
  countryName?: string
  coverImageUrl?: string
  endDate?: string
  photoCount?: number
  startDate?: string
}

export type TravelCardTimelineItemDto = {
  address?: string
  comment?: string
  date?: string
  entryId?: number
  imageUrl?: string
  latitude?: number
  longitude?: number
  placeName?: string
  rating?: number
  takenAt?: string
  type?: 'PLACE' | 'PHOTO'
}

export type TravelCardDetailDto = {
  cardId?: number
  endDate?: string
  startDate?: string
  timeline?: TravelCardTimelineItemDto[]
}

export type TravelCardEntryRequestDto = {
  comment?: string
  imageFile: File
}

export type TravelCardEntryResponseDto = {
  entryId?: number
  imageUrl?: string
  latitude?: number
  longitude?: number
  takenAt?: string
}

export type TravelCardEntryCommentRequestDto = {
  comment: string
}

export type TravelCardDeleteRequestDto = {
  cardIds: number[]
}

const TRAVEL_CARD_API_PATHS = {
  base: '/travel-cards',
  detail: (cardId: number) => `/travel-cards/${cardId}`,
  entries: (cardId: number) => `/travel-cards/${cardId}/entries`,
  entry: (cardId: number, entryId: number) => `/travel-cards/${cardId}/entries/${entryId}`,
} as const

export async function listTravelCards(): Promise<TravelCardListItemDto[]> {
  const { data } = await apiClient.get<TravelCardListItemDto[]>(TRAVEL_CARD_API_PATHS.base)
  return data
}

export async function getTravelCard(cardId: number): Promise<TravelCardDetailDto> {
  const { data } = await apiClient.get<TravelCardDetailDto>(TRAVEL_CARD_API_PATHS.detail(cardId))
  return data
}

export async function createTravelCardEntry(cardId: number, payload: TravelCardEntryRequestDto): Promise<TravelCardEntryResponseDto> {
  const { data } = await apiClient.postForm<TravelCardEntryResponseDto>(TRAVEL_CARD_API_PATHS.entries(cardId), payload)
  return data
}

export async function deleteTravelCards(payload: TravelCardDeleteRequestDto): Promise<string> {
  const { data } = await apiClient.delete<string>(TRAVEL_CARD_API_PATHS.base, { data: payload })
  return data
}

export async function deleteTravelCardEntry(cardId: number, entryId: number): Promise<void> {
  await apiClient.delete(TRAVEL_CARD_API_PATHS.entry(cardId, entryId))
}

export async function updateTravelCardEntryComment(
  cardId: number,
  entryId: number,
  payload: TravelCardEntryCommentRequestDto,
): Promise<void> {
  await apiClient.patch(TRAVEL_CARD_API_PATHS.entry(cardId, entryId), payload)
}

const SHARED_TRIP_API_UNAVAILABLE = '최신 API 명세서에 공유 여행 API가 없습니다.'

export async function listSharedTrips(params?: {
  page?: number
  size?: number
}): Promise<PageResponseDtoSharedTripResponseDto> {
  void params
  throw new Error(SHARED_TRIP_API_UNAVAILABLE)
}

export async function shareTrip(payload: ShareTripRequestDto): Promise<SharedTripResponseDto> {
  void payload
  throw new Error(SHARED_TRIP_API_UNAVAILABLE)
}

export async function getSharedTripDetail(tripId: number): Promise<SharedTripResponseDto> {
  void tripId
  throw new Error(SHARED_TRIP_API_UNAVAILABLE)
}

export async function importTrip(tripId: number): Promise<SharedTripResponseDto> {
  void tripId
  throw new Error(SHARED_TRIP_API_UNAVAILABLE)
}

export async function getSharedTripComments(tripId: number): Promise<CommentResponseDto[]> {
  void tripId
  throw new Error(SHARED_TRIP_API_UNAVAILABLE)
}

export async function createSharedTripComment(
  tripId: number,
  payload: CommentRequestDto
): Promise<CommentResponseDto> {
  void tripId
  void payload
  throw new Error(SHARED_TRIP_API_UNAVAILABLE)
}
