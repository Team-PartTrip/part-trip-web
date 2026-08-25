import { queryOptions, useQuery } from '@tanstack/react-query'
import { getMyTrips } from './api'
import { tripPlanQueryKeys } from './query-keys'
import type { TripPlanResponseDto } from './types'

export const myTripsQueryOptions = () =>
  queryOptions({
    queryKey: tripPlanQueryKeys.mine(),
    queryFn: getMyTrips,
  })

export function useMyTrips() {
  const query = useQuery(myTripsQueryOptions())

  return {
    hasError: query.isError,
    isLoading: query.isLoading,
    trips: query.data ?? ([] as TripPlanResponseDto[]),
  }
}
