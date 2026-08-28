import { apiClient } from '@/shared/libs/api-client'
import { requestWithMockFallback } from '@/shared/libs/api-fallback'

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
  tripId?: number
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

const mockVisited = [
  { cities: ['오사카', '도쿄'], countryCode: 'JP', countryName: '일본', visitCount: 3 },
  { cities: ['타이베이'], countryCode: 'TW', countryName: '대만', visitCount: 1 },
  { cities: ['파리'], countryCode: 'FR', countryName: '프랑스', visitCount: 1 },
]

const mockContinents = [
  { acquiredCount: 4, continent: '아시아', totalCount: 48 },
  { acquiredCount: 1, continent: '유럽', totalCount: 44 },
  { acquiredCount: 0, continent: '북아메리카', totalCount: 23 },
  { acquiredCount: 0, continent: '남아메리카', totalCount: 12 },
  { acquiredCount: 0, continent: '아프리카', totalCount: 54 },
  { acquiredCount: 0, continent: '오세아니아', totalCount: 14 },
]

export async function getWorldMap(): Promise<WorldMapResponseDto> {
  return requestWithMockFallback(
    async () => {
      const { data } = await apiClient.get<WorldMapResponseDto>(WORLD_MAP_API_PATHS.base)
      return data
    },
    () => ({ totalCountries: 195, visited: mockVisited }),
  )
}

export async function acquireCountry(payload: AcquireCountryRequestDto): Promise<AcquireCountryResponseDto> {
  return requestWithMockFallback(
    async () => {
      const { data } = await apiClient.post<AcquireCountryResponseDto>(WORLD_MAP_API_PATHS.countries, payload)
      return data
    },
    () => ({ countryCode: 'JP', isNew: true }),
  )
}

export async function getWorldMapCountry(countryCode: string): Promise<WorldMapCountryResponseDto> {
  return requestWithMockFallback(
    async () => {
      const { data } = await apiClient.get<WorldMapCountryResponseDto>(WORLD_MAP_API_PATHS.country(countryCode))
      return data
    },
    () => ({ countryName: countryCode === 'JP' ? '일본' : countryCode, cities: ['오사카'], trips: [], visitCount: 3 }),
  )
}

export async function getWorldMapStats(): Promise<WorldMapStatsResponseDto> {
  return requestWithMockFallback(
    async () => {
      const { data } = await apiClient.get<WorldMapStatsResponseDto>(WORLD_MAP_API_PATHS.stats)
      return data
    },
    () => ({ acquiredCount: 5, byContinent: mockContinents, percentage: 2.6, totalCount: 195 }),
  )
}
