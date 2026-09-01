import { createUnsupportedApiError } from '@/shared/libs/unsupported-api-error'

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

export async function getWorldMap(): Promise<WorldMapResponseDto> {
  throw createUnsupportedApiError('세계지도')
}

export async function acquireCountry(_payload: AcquireCountryRequestDto): Promise<AcquireCountryResponseDto> {
  void _payload
  throw createUnsupportedApiError('세계지도')
}

export async function getWorldMapCountry(_countryCode: string): Promise<WorldMapCountryResponseDto> {
  void _countryCode
  throw createUnsupportedApiError('세계지도')
}

export async function getWorldMapStats(): Promise<WorldMapStatsResponseDto> {
  throw createUnsupportedApiError('세계지도')
}
