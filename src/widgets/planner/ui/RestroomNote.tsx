import { useTourPlaceAccessibilityQuery } from '@/entities/travel'
import { accessibilityMessage } from '../model/accessibility'

export function RestroomNote({ tourPlaceId }: { tourPlaceId: number }) {
  const { data, isError, isLoading } = useTourPlaceAccessibilityQuery(tourPlaceId)
  const message = accessibilityMessage(data, isError)
  if (isLoading) return <small role="status">무장애 정보 확인 중…</small>
  if (message) return <small>{message}</small>
  const text = data?.status === 'FOUND' || data?.matched ? data.items?.find((item) => item.key === 'RESTROOM')?.text?.trim() : undefined
  return text ? <small>화장실 · {text}</small> : null
}
