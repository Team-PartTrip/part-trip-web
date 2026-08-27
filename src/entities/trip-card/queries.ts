import { queryOptions, useQuery } from '@tanstack/react-query'
import { isPositiveSafeInteger } from '@/shared/utils'
import { getSharedTripDetail, listSharedTrips } from './api'
import { tripCardQueryKeys } from './query-keys'

export const sharedTripsQueryOptions = (enabled = true) =>
  queryOptions({
    queryKey: tripCardQueryKeys.list(),
    queryFn: () => listSharedTrips({ page: 0, size: 30 }),
    enabled,
  })

export const sharedTripQueryOptions = (tripId: number) =>
  queryOptions({
    queryKey: tripCardQueryKeys.detail(tripId),
    queryFn: () => getSharedTripDetail(tripId),
    enabled: isPositiveSafeInteger(tripId),
  })

export function useSharedTripsQuery(enabled = true) {
  return useQuery(sharedTripsQueryOptions(enabled))
}

export function useSharedTripQuery(tripId: number) {
  return useQuery(sharedTripQueryOptions(tripId))
}
