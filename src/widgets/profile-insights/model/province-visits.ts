import type { TripResponseDto } from '@/entities/region-map/api'
import { getDomesticRegion } from '../../../entities/region-map/domestic-regions.ts'

export function countProvinceTrips(trips: TripResponseDto[]) {
  const counts = new Map<string, Set<string>>()
  trips.forEach((trip, index) => {
    const region = getDomesticRegion(String(trip.regionCode ?? '').slice(0, 2))
    if (!region) return
    const visits = counts.get(region.code) ?? new Set<string>()
    visits.add(String(trip.tripCardId ?? `trip-${index}`))
    counts.set(region.code, visits)
  })
  return counts
}
