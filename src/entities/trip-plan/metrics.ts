import type { TripPlanResponseDto } from './api'

export function getTripDurationDays(trips: TripPlanResponseDto[]) {
  return trips.reduce((total, trip) => {
    if (!trip.startDate || !trip.endDate) return total
    return total + Math.max(1, Math.round((Date.parse(trip.endDate) - Date.parse(trip.startDate)) / 86400000) + 1)
  }, 0)
}
