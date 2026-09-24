import { queryOptions, useQuery } from '@tanstack/react-query'
import { isPositiveSafeInteger } from '@/shared/utils'
import { getTravelRecord, getTravelRecords } from './records'
import { tripCardQueryKeys } from './query-keys'

export const travelRecordQueryOptions = (tripId: number) =>
  queryOptions({
    queryKey: tripCardQueryKeys.record(tripId),
    queryFn: () => getTravelRecord(tripId),
    enabled: isPositiveSafeInteger(tripId),
  })

export const travelRecordsQueryOptions = (enabled = true) =>
  queryOptions({
    queryKey: tripCardQueryKeys.records(),
    queryFn: getTravelRecords,
    enabled,
  })

export function useMyTravelRecords(enabled = true) {
  const query = useQuery(travelRecordsQueryOptions(enabled))
  return { hasError: query.isError, isLoading: query.isLoading, trips: query.data ?? [] }
}

export function useTravelRecordQuery(tripId: number) {
  return useQuery(travelRecordQueryOptions(tripId))
}
