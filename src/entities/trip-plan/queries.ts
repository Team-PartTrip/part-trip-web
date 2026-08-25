import { queryOptions, useQuery } from '@tanstack/react-query'
import { getMyTrips, getTrip } from './api'
import { tripPlanQueryKeys } from './query-keys'
import type { TripPlanResponseDto } from './types'

export const tripQueryOptions = (tripId: number) =>
  queryOptions({
    queryKey: tripPlanQueryKeys.detail(tripId),
    queryFn: () => getTrip(tripId),
    enabled: Number.isInteger(tripId),
  })

export const myTripsQueryOptions = (enabled = true) =>
  queryOptions({
    queryKey: tripPlanQueryKeys.mine(),
    queryFn: getMyTrips,
    enabled,
  })

export function useMyTrips(enabled = true) {
  const query = useQuery(myTripsQueryOptions(enabled))

  return {
    hasError: query.isError,
    isLoading: query.isLoading,
    trips: query.data ?? ([] as TripPlanResponseDto[]),
  }
}

export function useTripQuery(tripId: number) {
  return useQuery(tripQueryOptions(tripId))
}
