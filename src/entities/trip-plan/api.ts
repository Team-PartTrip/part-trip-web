import { apiClient, resolveApiAssetUrl } from '@/shared/libs/api-client'
import {
  getTravelCard,
  listTravelCards,
  type TravelCardDetailDto,
  type TravelCardListItemDto,
} from '@/entities/trip-card/api'

export type TripPlanPlaceRequestDto = {
  dayNumber?: number
  placeName?: string
  placeSub?: string
}

export type TripPlanRequestDto = {
  title?: string
  countryInfoId?: number
  startDate?: string
  endDate?: string
  content?: string
  images?: string[]
  places?: TripPlanPlaceRequestDto[]
}

export type TripPlanPlaceResponseDto = {
  tripPlaceId?: number
  dayNumber?: number
  latitude?: number
  longitude?: number
  placeName?: string
  placeSub?: string
}

export type TripPlanResponseDto = {
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
  photoCount?: number
  likeCount?: number
  liked?: boolean
  commentCount?: number
  isPublic?: boolean
  createDate?: string
  places?: TripPlanPlaceResponseDto[]
}

const TRIP_API_PATHS = {
  detail: (tripId: number) => `/trips/${tripId}`,
  base: '/trips',
  cards: '/travel-cards',
} as const

function toTripPlan(
  card?: TravelCardListItemDto,
  detail?: TravelCardDetailDto,
): TripPlanResponseDto {
  const timeline = detail?.timeline ?? []
  const destination = card?.cityName || card?.countryName
  const images = timeline.flatMap((item) => {
    const imageUrl = resolveApiAssetUrl(item.imageUrl)
    return imageUrl ? [imageUrl] : []
  })

  return {
    cityName: card?.cityName,
    content: timeline.map((item) => item.comment).filter(Boolean).join('\n') || undefined,
    countryName: card?.countryName,
    endDate: detail?.endDate ?? card?.endDate,
    images: images.length
      ? images
      : card?.coverImageUrl
        ? [resolveApiAssetUrl(card.coverImageUrl) ?? card.coverImageUrl]
        : [],
    photoCount: card?.photoCount ?? images.length,
    places: timeline
      .filter((item) => item.type === 'PLACE')
      .map((item, index) => ({
        dayNumber: index + 1,
        latitude: item.latitude,
        longitude: item.longitude,
        placeName: item.placeName,
        placeSub: item.address,
      })),
    startDate: detail?.startDate ?? card?.startDate,
    title: destination ? `${destination} 여행` : undefined,
    tripId: card?.cardId ?? detail?.cardId,
  }
}

export async function getTrip(tripId: number): Promise<TripPlanResponseDto> {
  const [cards, detail] = await Promise.all([
    listTravelCards(),
    getTravelCard(tripId),
  ])
  return toTripPlan(cards.find((card) => card.cardId === tripId), detail)
}

export async function createTrip(payload: TripPlanRequestDto): Promise<TripPlanResponseDto> {
  const { data } = await apiClient.post<TripPlanResponseDto>(TRIP_API_PATHS.base, payload)
  return data
}

export async function updateTrip(tripId: number, payload: TripPlanRequestDto): Promise<TripPlanResponseDto> {
  const { data } = await apiClient.put<TripPlanResponseDto>(TRIP_API_PATHS.detail(tripId), payload)
  return data
}

export async function deleteTrip(tripId: number): Promise<string> {
  const { data } = await apiClient.delete<string>(TRIP_API_PATHS.cards, {
    data: { cardIds: [tripId] },
  })
  return data
}

export async function getMyTrips(): Promise<TripPlanResponseDto[]> {
  return getTripHistory()
}

export async function getTripHistory(): Promise<TripPlanResponseDto[]> {
  const cards = await listTravelCards()
  return cards.map((card) => toTripPlan(card))
}
