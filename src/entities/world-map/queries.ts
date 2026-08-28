import { queryOptions, useQuery } from '@tanstack/react-query'
import { getWorldMap, getWorldMapCountry, getWorldMapStats } from './api'
import { worldMapQueryKeys } from './query-keys'

export const worldMapQueryOptions = () => queryOptions({ queryKey: worldMapQueryKeys.map(), queryFn: getWorldMap })

export function useWorldMapQuery() {
  return useQuery(worldMapQueryOptions())
}

export const worldMapCountryQueryOptions = (countryCode: string) => queryOptions({ queryKey: worldMapQueryKeys.country(countryCode), queryFn: () => getWorldMapCountry(countryCode), enabled: Boolean(countryCode) })

export function useWorldMapCountryQuery(countryCode: string) {
  return useQuery(worldMapCountryQueryOptions(countryCode))
}

export const worldMapStatsQueryOptions = (enabled = true) => queryOptions({ queryKey: worldMapQueryKeys.stats(), queryFn: getWorldMapStats, enabled })

export function useWorldMapStatsQuery(enabled = true) {
  return useQuery(worldMapStatsQueryOptions(enabled))
}
