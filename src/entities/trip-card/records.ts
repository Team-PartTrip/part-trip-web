import { resolveApiAssetUrl } from '@/shared/libs/api-client'
import { getTravelCard, listTravelCards, type TravelCardDetailDto, type TravelCardListItemDto } from './api'
import { sortTravelRecordsNewestFirst, sortTravelTimelineChronologically } from './record-metrics'

export type TravelRecordPlaceDto = {
  tripPlaceId?: number
  dayNumber?: number
  latitude?: number
  longitude?: number
  placeName?: string
  placeSub?: string
}

export type TravelRecordDto = {
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
  places?: TravelRecordPlaceDto[]
  timeline?: TravelCardDetailDto['timeline']
}

function toTravelRecord(card?: TravelCardListItemDto, detail?: TravelCardDetailDto): TravelRecordDto {
  const timeline = sortTravelTimelineChronologically((detail?.timeline ?? []).map((item) => ({
    ...item,
    imageUrl: resolveApiAssetUrl(item.imageUrl) ?? item.imageUrl,
  })))
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
    timeline,
  }
}

export async function getTravelRecord(tripId: number): Promise<TravelRecordDto> {
  const [cards, detail] = await Promise.all([listTravelCards(), getTravelCard(tripId)])
  return toTravelRecord(cards.find((card) => card.cardId === tripId), detail)
}

export async function getTravelRecords(): Promise<TravelRecordDto[]> {
  const cards = await listTravelCards()
  return sortTravelRecordsNewestFirst(cards.map((card) => toTravelRecord(card)))
}
