import { apiClient } from '@/shared/libs/api-client'

export type WorldMapVisitedCountryDto = {
  cities?: string[]
  countryCode?: string
  countryName?: string
  visitCount?: number
}

export type WorldMapResponseDto = {
  totalCountries?: number
  visited?: WorldMapVisitedCountryDto[]
}

export type AcquireCountryRequestDto = {
  tripId: number
}

export type AcquireCountryResponseDto = {
  countryCode?: string
  isNew?: boolean
}

export type WorldMapTripSummaryDto = {
  cityName?: string
  endDate?: string
  startDate?: string
  tripCardId?: number
}

export type WorldMapCountryResponseDto = {
  cities?: string[]
  countryName?: string
  trips?: WorldMapTripSummaryDto[]
  visitCount?: number
}

export type ContinentProgressDto = {
  continent?: string
  acquiredCount?: number
  totalCount?: number
}

export type WorldMapStatsResponseDto = {
  acquiredCount?: number
  byContinent?: ContinentProgressDto[]
  percentage?: number
  totalCount?: number
}

const WORLD_MAP_API_PATHS = {
  base: '/world-map',
  country: (countryCode: string) => `/world-map/countries/${countryCode}`,
  countries: '/world-map/countries',
  stats: '/world-map/stats',
} as const

export async function getWorldMap(): Promise<WorldMapResponseDto> {
  const { data } = await apiClient.get<WorldMapResponseDto>(WORLD_MAP_API_PATHS.base)
  return data
}

export async function acquireCountry(payload: AcquireCountryRequestDto): Promise<AcquireCountryResponseDto> {
  const { data } = await apiClient.post<AcquireCountryResponseDto>(WORLD_MAP_API_PATHS.countries, payload)
  return data
}

export async function getWorldMapCountry(countryCode: string): Promise<WorldMapCountryResponseDto> {
  const { data } = await apiClient.get<WorldMapCountryResponseDto>(WORLD_MAP_API_PATHS.country(countryCode))
  return data
}

export async function getWorldMapStats(): Promise<WorldMapStatsResponseDto> {
  const { data } = await apiClient.get<WorldMapStatsResponseDto>(WORLD_MAP_API_PATHS.stats)
  return data
}
