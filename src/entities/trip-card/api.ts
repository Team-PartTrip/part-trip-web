import { apiClient } from '@/shared/libs/api-client'
import { requestWithMockFallback } from '@/shared/libs/api-fallback'
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

export type TravelCardListItemDto = {
  cardId?: number
  cityName?: string
  countryName?: string
  coverImageUrl?: string
  endDate?: string
  photoCount?: number
  startDate?: string
}

export type TravelCardDetailDto = TravelCardListItemDto & {
  timeline?: Array<{
    cityName?: string
    comment?: string
    imageUrl?: string
    placeName?: string
    takenAt?: string
    type?: 'PLACE' | 'PHOTO'
  }>
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

export type TravelCardDeleteRequestDto = {
  cardIds: number[]
}

export type TravelCardReportRequestDto = {
  type: string
}

export type TravelCardReportResponseDto = {
  reportUrl?: string
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
  report: (cardId: number) => `/travel-cards/${cardId}/report`,
} as const

const mockTravelCards: TravelCardDetailDto[] = [
  { cardId: 1, cityName: '오사카', countryName: '일본', endDate: '2026-08-27', photoCount: 24, startDate: '2026-08-23', timeline: [{ placeName: '도톤보리', type: 'PLACE' }, { placeName: '오사카성', type: 'PLACE' }] },
  { cardId: 2, cityName: '도쿄', countryName: '일본', endDate: '2026-05-12', photoCount: 16, startDate: '2026-05-10', timeline: [{ placeName: '시부야', type: 'PLACE' }] },
  { cardId: 3, cityName: '제주', countryName: '대한민국', endDate: '2025-12-24', photoCount: 42, startDate: '2025-12-20', timeline: [{ placeName: '성산일출봉', type: 'PLACE' }] },
]

function toSharedTrip(card: TravelCardListItemDto): SharedTripResponseDto {
  const detail = card as TravelCardDetailDto
  return {
    cityName: card.cityName,
    countryName: card.countryName,
    endDate: card.endDate,
    images: detail.timeline?.flatMap((item) => item.imageUrl ? [item.imageUrl] : []) ?? [],
    places: detail.timeline?.filter((item) => item.type === 'PLACE').map((item, index) => ({ dayNumber: index + 1, placeName: item.placeName })) ?? [],
    startDate: card.startDate,
    title: `${card.cityName || card.countryName || '여행'} 여행`,
    tripId: card.cardId,
  }
}

function getMockTravelCard(cardId?: number) {
  const card = mockTravelCards.find((item) => item.cardId === cardId)
  if (!card) throw new Error('여행 카드를 찾을 수 없습니다.')
  return card
}

export async function listTravelCards(): Promise<TravelCardListItemDto[]> {
  return requestWithMockFallback(
    async () => {
      const { data } = await apiClient.get<TravelCardListItemDto[]>(TRAVEL_CARD_API_PATHS.base)
      return data
    },
    () => mockTravelCards,
  )
}

export async function getTravelCard(cardId: number): Promise<TravelCardDetailDto> {
  return requestWithMockFallback(
    async () => {
      const { data } = await apiClient.get<TravelCardDetailDto>(TRAVEL_CARD_API_PATHS.detail(cardId))
      return data
    },
    () => getMockTravelCard(cardId),
  )
}

export async function createTravelCardEntry(cardId: number, payload: TravelCardEntryRequestDto): Promise<TravelCardEntryResponseDto> {
  return requestWithMockFallback(
    async () => {
      const { data } = await apiClient.postForm<TravelCardEntryResponseDto>(TRAVEL_CARD_API_PATHS.entries(cardId), payload)
      return data
    },
    () => ({ entryId: Date.now(), imageUrl: URL.createObjectURL(payload.imageFile), takenAt: new Date(payload.imageFile.lastModified).toISOString() }),
  )
}

export async function deleteTravelCards(payload: TravelCardDeleteRequestDto): Promise<string> {
  return requestWithMockFallback(
    async () => {
      const { data } = await apiClient.delete<string>(TRAVEL_CARD_API_PATHS.base, { data: payload })
      return data
    },
    () => {
      for (const cardId of payload.cardIds) {
        const index = mockTravelCards.findIndex((card) => card.cardId === cardId)
        if (index >= 0) mockTravelCards.splice(index, 1)
      }
      return '삭제되었습니다.'
    },
  )
}

export async function generateTravelCardReport(cardId: number, payload: TravelCardReportRequestDto): Promise<TravelCardReportResponseDto> {
  return requestWithMockFallback(
    async () => {
      const { data } = await apiClient.post<TravelCardReportResponseDto>(TRAVEL_CARD_API_PATHS.report(cardId), payload)
      return data
    },
    () => ({ reportUrl: `/mock/travel-cards/${cardId}/report?type=${encodeURIComponent(payload.type)}` }),
  )
}

export async function listSharedTrips(params?: {
  page?: number
  size?: number
}): Promise<PageResponseDtoSharedTripResponseDto> {
  const cards = await listTravelCards()
  return { content: cards.map(toSharedTrip), page: params?.page ?? 0, size: params?.size ?? cards.length, totalElements: cards.length, totalPages: 1, hasNext: false }
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
  return toSharedTrip(await getTravelCard(tripId))
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
    () => [],
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
    () => ({ ...payload, commentId: Date.now(), createDate: new Date().toISOString(), userId: 'mock-user' }),
  )
}
