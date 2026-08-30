import { apiClient } from '../../shared/libs/api-client.ts'
import { requestWithMockFallback } from '../../shared/libs/api-fallback.ts'
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
  countryCode?: string
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
  type?: 'PLACE' | 'PHOTO' | 'NO_INFO_PHOTO'
}

export type TravelCardDetailDto = {
  cardId?: number
  countryCode?: string
  endDate?: string
  startDate?: string
  timeline?: TravelCardTimelineItemDto[]
}

export type TravelCardEntryRequestDto = {
  comment: string
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

const SHARED_TRIP_API_PATHS = {
  base: '/community/shared-trips',
  detail: (tripId: number) => `/community/shared-trips/${tripId}`,
  import: (tripId: number) => `/community/shared-trips/${tripId}/import`,
  comments: (tripId: number) => `/community/shared-trips/${tripId}/comments`,
} as const

const TRAVEL_CARD_API_PATHS = {
  base: '/travel-cards',
  detail: (cardId: number) => `/travel-cards/${cardId}`,
  entries: (cardId: number) => `/travel-cards/${cardId}/entries`,
  entry: (cardId: number, entryId: number) => `/travel-cards/${cardId}/entries/${entryId}`,
} as const

type MockTravelCard = TravelCardListItemDto & TravelCardDetailDto

const mockTravelCards: MockTravelCard[] = [
  { cardId: 1, cityName: '오사카', countryName: '일본', endDate: '2026-08-27', photoCount: 24, startDate: '2026-08-23', timeline: [{ placeName: '도톤보리', type: 'PLACE' }, { placeName: '오사카성', type: 'PLACE' }] },
  { cardId: 2, cityName: '도쿄', countryName: '일본', endDate: '2026-05-12', photoCount: 16, startDate: '2026-05-10', timeline: [{ placeName: '시부야', type: 'PLACE' }] },
  { cardId: 3, cityName: '제주', countryName: '대한민국', endDate: '2025-12-24', photoCount: 42, startDate: '2025-12-20', timeline: [{ placeName: '성산일출봉', type: 'PLACE' }] },
]

const mockSharedTripComments = new Map<number, CommentResponseDto[]>()

export function toSharedTrip(card: TravelCardListItemDto | TravelCardDetailDto): SharedTripResponseDto {
  const listCard = 'cityName' in card ? card : undefined
  const timeline = 'timeline' in card ? card.timeline ?? [] : []
  const timelineImages = timeline.flatMap((item) => item.imageUrl ? [item.imageUrl] : [])
  const images = timelineImages.length ? timelineImages : listCard?.coverImageUrl ? [listCard.coverImageUrl] : []
  const destination = listCard?.cityName || listCard?.countryName
  const sharedTrip: SharedTripResponseDto = {
    cityName: listCard?.cityName,
    countryName: listCard?.countryName,
    coverImageUrl: listCard?.coverImageUrl,
    endDate: card.endDate,
    images,
    photoCount: listCard?.photoCount ?? timeline.filter((item) => item.type === 'PHOTO').length,
    places: timeline.filter((item) => item.type === 'PLACE').map((item, index) => ({
      address: item.address,
      dayNumber: index + 1,
      placeName: item.placeName,
      placeSub: item.address,
      rating: item.rating,
    })),
    startDate: card.startDate,
    timeline,
    title: destination ? `${destination} 여행` : undefined,
    tripId: card.cardId,
  }
  return sharedTrip
}

function getMockTravelCard(cardId?: number): MockTravelCard {
  const card = mockTravelCards.find((item) => item.cardId === cardId)
  if (!card) throw new Error('여행 카드를 찾을 수 없습니다.')
  return card
}

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

export async function listSharedTrips(params?: {
  page?: number
  size?: number
}): Promise<PageResponseDtoSharedTripResponseDto> {
  return requestWithMockFallback(
    async () => {
      const { data } = await apiClient.get<PageResponseDtoSharedTripResponseDto>(SHARED_TRIP_API_PATHS.base, { params })
      return data
    },
    () => {
      const page = params?.page ?? 0
      const size = params?.size ?? mockTravelCards.length
      const start = page * size
      const content = mockTravelCards.slice(start, start + size).map(toSharedTrip)
      const totalElements = mockTravelCards.length
      const totalPages = size > 0 ? Math.ceil(totalElements / size) : 0
      return { content, hasNext: page + 1 < totalPages, page, size, totalElements, totalPages }
    },
  )
}

export async function shareTrip(payload: ShareTripRequestDto): Promise<SharedTripResponseDto> {
  return requestWithMockFallback(
    async () => {
      const { data } = await apiClient.post<SharedTripResponseDto>(SHARED_TRIP_API_PATHS.base, payload)
      return data
    },
    () => toSharedTrip(getMockTravelCard(payload.tripId)),
  )
}

export async function getSharedTripDetail(tripId: number): Promise<SharedTripResponseDto> {
  return requestWithMockFallback(
    async () => {
      const { data } = await apiClient.get<SharedTripResponseDto>(SHARED_TRIP_API_PATHS.detail(tripId))
      return data
    },
    () => toSharedTrip(getMockTravelCard(tripId)),
  )
}

export async function importTrip(tripId: number): Promise<SharedTripResponseDto> {
  return requestWithMockFallback(
    async () => {
      const { data } = await apiClient.post<SharedTripResponseDto>(SHARED_TRIP_API_PATHS.import(tripId))
      return data
    },
    () => toSharedTrip(getMockTravelCard(tripId)),
  )
}

export async function getSharedTripComments(tripId: number): Promise<CommentResponseDto[]> {
  return requestWithMockFallback(
    async () => {
      const { data } = await apiClient.get<CommentResponseDto[]>(SHARED_TRIP_API_PATHS.comments(tripId))
      return data
    },
    () => mockSharedTripComments.get(tripId) ?? [],
  )
}

export async function createSharedTripComment(
  tripId: number,
  payload: CommentRequestDto
): Promise<CommentResponseDto> {
  return requestWithMockFallback(
    async () => {
      const { data } = await apiClient.post<CommentResponseDto>(SHARED_TRIP_API_PATHS.comments(tripId), payload)
      return data
    },
    () => {
      const comment = { ...payload, commentId: Date.now(), createDate: new Date().toISOString(), targetId: tripId, userId: 'mock-user' }
      mockSharedTripComments.set(tripId, [...(mockSharedTripComments.get(tripId) ?? []), comment])
      return comment
    },
  )
}
