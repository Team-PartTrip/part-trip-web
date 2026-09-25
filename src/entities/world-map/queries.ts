import { queryOptions, useQuery } from '@tanstack/react-query'
import { getWorldMap, getWorldMapStats } from './api'
import { worldMapQueryKeys } from './query-keys'

export const worldMapQueryOptions = (enabled = true) => queryOptions({ queryKey: worldMapQueryKeys.map(), queryFn: getWorldMap, enabled })

export function useWorldMapQuery(enabled = true) {
  return useQuery(worldMapQueryOptions(enabled))
}

export const worldMapStatsQueryOptions = (enabled = true) => queryOptions({ queryKey: worldMapQueryKeys.stats(), queryFn: getWorldMapStats, enabled })

export function useWorldMapStatsQuery(enabled = true) {
  return useQuery(worldMapStatsQueryOptions(enabled))
}
