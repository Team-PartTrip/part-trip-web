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
  const images = timeline.map((item) => item.imageUrl).filter((url): url is string => Boolean(url))
  const coverImage = resolveApiAssetUrl(card?.coverImageUrl) ?? card?.coverImageUrl
  let recordImages = images
  if (!recordImages.length) recordImages = coverImage ? [coverImage] : []

  return {
    cityName: card?.cityName,
    content: timeline.map((item) => item.comment).filter(Boolean).join('\n') || undefined,
    countryName: card?.countryName,
    endDate: detail?.endDate ?? card?.endDate,
    images: recordImages,
    photoCount: card?.photoCount ?? images.length,
    places: detail ? timeline
      .filter((item) => item.type === 'PLACE')
      .map((item, index) => ({
        dayNumber: index + 1,
        latitude: item.latitude,
        longitude: item.longitude,
        placeName: item.placeName,
        placeSub: item.address,
      })) : undefined,
    startDate: detail?.startDate ?? card?.startDate,
    title: destination ? `${destination} 여행` : undefined,
    tripId: card?.cardId ?? detail?.cardId,
    timeline,
  }
}

export async function getTravelRecord(tripId: number, summary?: TravelRecordDto): Promise<TravelRecordDto> {
  const cachedCard: TravelCardListItemDto | undefined = summary ? {
    cardId: summary.tripId,
    cityName: summary.cityName,
    countryName: summary.countryName,
    coverImageUrl: summary.images?.[0],
    endDate: summary.endDate,
    photoCount: summary.photoCount,
    startDate: summary.startDate,
  } : undefined
  const [cardsResult, detailResult] = await Promise.allSettled([
    summary ? Promise.resolve([]) : listTravelCards(),
    getTravelCard(tripId),
  ])
  if (detailResult.status === 'rejected') throw detailResult.reason

  const card = cachedCard ?? (cardsResult.status === 'fulfilled'
    ? cardsResult.value.find((item) => item.cardId === tripId)
    : undefined)
  const record = toTravelRecord(card, detailResult.value)
  return summary
    ? { ...summary, ...record, images: record.timeline?.some((item) => item.imageUrl) ? record.images : summary.images ?? record.images }
    : record
}

export async function getTravelRecords(): Promise<TravelRecordDto[]> {
  const cards = await listTravelCards()
  return sortTravelRecordsNewestFirst(cards.map((card) => toTravelRecord(card)))
}
