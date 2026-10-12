import { useTourPlaceAccessibilityQuery } from '@/entities/travel'

export function RestroomNote({ tourPlaceId }: { tourPlaceId: number }) {
  const { data } = useTourPlaceAccessibilityQuery(tourPlaceId)
  const text = data?.matched ? data.items?.find((item) => item.key === 'RESTROOM')?.text?.trim() : undefined
  return text ? <small>화장실 · {text}</small> : null
}
