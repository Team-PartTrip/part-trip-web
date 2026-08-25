import { queryOptions, useQuery } from '@tanstack/react-query'
import { getCompletedMissions, getMissions } from './api'
import { missionQueryKeys } from './query-keys'

export const missionsQueryOptions = () =>
  queryOptions({ queryKey: missionQueryKeys.list(), queryFn: getMissions })

export const completedMissionsQueryOptions = () =>
  queryOptions({ queryKey: missionQueryKeys.completed(), queryFn: getCompletedMissions })

export function useMissionsQuery() {
  return useQuery(missionsQueryOptions())
}

export function useCompletedMissionsQuery() {
  return useQuery(completedMissionsQueryOptions())
}
