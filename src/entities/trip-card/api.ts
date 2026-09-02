import { apiClient } from '../../shared/libs/api-client.ts'

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
