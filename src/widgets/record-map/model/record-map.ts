import type { TravelCardTimelineItemDto } from '@/entities/trip-card'

export function getRecordLocations(timeline: readonly TravelCardTimelineItemDto[] = []) {
  return timeline.flatMap((item) => {
    const isPlace = item.type === 'PLACE' && Boolean(item.placeName)
    const hasPhotoGps = (item.type === 'PHOTO' || item.type === 'NO_INFO_PHOTO')
      && Number.isFinite(item.latitude)
      && Number.isFinite(item.longitude)
    if (!isPlace && !hasPhotoGps) return []

    return [{
      latitude: item.latitude,
      longitude: item.longitude,
      name: item.placeName || item.address || '사진 촬영 위치',
      photos: item.date || item.takenAt?.slice(0, 10) || '촬영 위치',
    }]
  })
}
