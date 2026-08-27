import type { TripPlanResponseDto } from './api'
import { getDateRangeDays } from '../../shared/utils/date.ts'

export function getTripDurationDays(trips: TripPlanResponseDto[]) {
  return trips.reduce((total, trip) => {
    const days = getDateRangeDays(trip.startDate, trip.endDate)
    return days == null ? total : total + days
  }, 0)
}
