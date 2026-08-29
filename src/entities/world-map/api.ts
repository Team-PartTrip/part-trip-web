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

let mockVisited = [
  { cities: ['오사카', '도쿄'], countryCode: 'JP', countryName: '일본', visitCount: 3 },
  { cities: ['타이베이'], countryCode: 'TW', countryName: '대만', visitCount: 1 },
  { cities: ['파리'], countryCode: 'FR', countryName: '프랑스', visitCount: 1 },
]

const continentTotals = [
  { continent: '아시아', totalCount: 48 },
  { continent: '유럽', totalCount: 44 },
  { continent: '북아메리카', totalCount: 23 },
  { continent: '남아메리카', totalCount: 12 },
  { continent: '아프리카', totalCount: 54 },
  { continent: '오세아니아', totalCount: 14 },
]

const mockCountryByTripId: Record<number, { countryCode: string; countryName: string }> = {
  1: { countryCode: 'JP', countryName: '일본' },
  2: { countryCode: 'JP', countryName: '일본' },
  3: { countryCode: 'KR', countryName: '대한민국' },
}

const continentByCountryCode: Record<string, string> = {
  FR: '유럽',
  JP: '아시아',
  KR: '아시아',
  TW: '아시아',
}

function getMockStats(): WorldMapStatsResponseDto {
  const acquiredByContinent = new Map<string, number>()
  for (const country of mockVisited) {
    const continent = country.countryCode ? continentByCountryCode[country.countryCode] : undefined
    if (continent) acquiredByContinent.set(continent, (acquiredByContinent.get(continent) ?? 0) + 1)
  }
  const totalCount = 195
  return {
    acquiredCount: mockVisited.length,
    byContinent: continentTotals.map((item) => ({ ...item, acquiredCount: acquiredByContinent.get(item.continent) ?? 0 })),
    percentage: mockVisited.length / totalCount * 100,
    totalCount,
  }
}

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
    () => {
      const country = mockCountryByTripId[payload.tripId] ?? { countryCode: 'JP', countryName: '일본' }
      const alreadyVisited = mockVisited.some((item) => item.countryCode === country.countryCode)
      if (!alreadyVisited) {
        mockVisited = [...mockVisited, { cities: [], countryCode: country.countryCode, countryName: country.countryName, visitCount: 1 }]
      }
      return { countryCode: country.countryCode, isNew: !alreadyVisited }
    },
  )
}

export async function getWorldMapCountry(countryCode: string): Promise<WorldMapCountryResponseDto> {
  return requestWithMockFallback(
    async () => {
      const { data } = await apiClient.get<WorldMapCountryResponseDto>(WORLD_MAP_API_PATHS.country(countryCode))
      return data
    },
    () => {
      const country = mockVisited.find((item) => item.countryCode === countryCode)
      return { countryName: country?.countryName ?? countryCode, cities: country?.cities ?? [], trips: [], visitCount: country?.visitCount ?? 0 }
    },
  )
}

export async function getWorldMapStats(): Promise<WorldMapStatsResponseDto> {
  return requestWithMockFallback(
    async () => {
      const { data } = await apiClient.get<WorldMapStatsResponseDto>(WORLD_MAP_API_PATHS.stats)
      return data
    },
    getMockStats,
  )
}
