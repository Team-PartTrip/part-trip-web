import { queryOptions, useQuery } from '@tanstack/react-query'
import { getSharedTripDetail, listSharedTrips } from './api'
import { tripCardQueryKeys } from './query-keys'

export const sharedTripsQueryOptions = () =>
  queryOptions({
    queryKey: tripCardQueryKeys.list(),
    queryFn: () => listSharedTrips({ page: 0, size: 30 }),
  })

export const sharedTripQueryOptions = (tripId: number) =>
  queryOptions({
    queryKey: tripCardQueryKeys.detail(tripId),
    queryFn: () => getSharedTripDetail(tripId),
    enabled: Number.isInteger(tripId),
  })

export function useSharedTripsQuery() {
  return useQuery(sharedTripsQueryOptions())
}

export function useSharedTripQuery(tripId: number) {
  return useQuery(sharedTripQueryOptions(tripId))
}
