import { isAxiosError } from 'axios'
import { apiClient } from '@/shared/libs/api-client'
import { requestWithMockFallback } from '@/shared/libs/api-fallback'
import { isMissingTravelPlanResponse } from './main-error'

export type TripPhase = 'NO_TRIP' | 'BEFORE' | 'DURING' | 'ENDED'

export type DdayResponseDto = {
  countryName?: string | null
  cityName?: string | null
  headcount?: number | null
  startDate?: string | null
  endDate?: string | null
  dday?: string | null
  status: TripPhase
}

export type TourPlaceResponseDto = {
  tourPlaceId?: number
  category?: string
  address?: string
  placeName?: string
  description?: string
  imageUrl?: string
  latitude?: number
  longitude?: number
  rating?: number
}

export type MoreTourPlacesResponseDto = {
  places?: TourPlaceResponseDto[]
  cursor?: string | null
}

export type FestivalResponseDto = {
  festivalId?: number
  title?: string
  category?: string
  description?: string
  startDate?: string
  startTime?: string
  location?: string
  imageUrl?: string
}

export type CountryInfoResponseDto = {
  countryInfoId?: number
  countryName?: string
  cityName?: string
  imageUrl?: string
  summary?: string
}

export type PopularCityResponseDto = {
  cityName?: string
  countryName?: string
  planCount?: number
}

const MAIN_API_PATHS = {
  dday: '/main/dday',
  tourPlace: '/main/tour-place',
  tourPlaceMore: '/main/tour-place/more',
  festivals: '/main/festivals',
  countryInfo: '/main/country-info',
  countries: '/main/countries',
  popularCities: '/main/popular-cities',
} as const

import {
  mockCountries,
  mockCountrySearchAliases,
  mockDday,
  mockFestivals,
  mockTourPlaces,
} from './mock-data'
function getMockDday(startDate?: string, endDate?: string): Pick<DdayResponseDto, 'dday' | 'status'> {
  if (!startDate || !endDate) return { dday: '쉬는 중', status: 'NO_TRIP' }
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const start = new Date(`${startDate}T00:00:00`)
  const end = new Date(`${endDate}T00:00:00`)
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return { dday: '쉬는 중', status: 'NO_TRIP' }
  const days = Math.round((start.getTime() - today.getTime()) / 86_400_000)
  if (days > 0) return { dday: `D-${days}`, status: 'BEFORE' }
  if (today <= end) return { dday: days === 0 ? 'D-Day' : '여행 중', status: 'DURING' }
  return { dday: '여행 종료', status: 'ENDED' }
}

function isTripPhase(value: unknown): value is TripPhase {
  return value === 'NO_TRIP' || value === 'BEFORE' || value === 'DURING' || value === 'ENDED'
}

type DdayResponseInput = Omit<DdayResponseDto, 'status'> & { status?: unknown }

export function normalizeDdayResponse(data: DdayResponseInput): DdayResponseDto {
  if (isTripPhase(data.status)) return { ...data, status: data.status }
  return { ...data, ...getMockDday(data.startDate ?? undefined, data.endDate ?? undefined) }
}

export async function getDday(): Promise<DdayResponseDto> {
  return requestWithMockFallback(
    async () => {
      try {
        const { data } = await apiClient.get<DdayResponseInput>(MAIN_API_PATHS.dday)
        return normalizeDdayResponse(data)
      } catch (error) {
        if (isAxiosError(error) && isMissingTravelPlanResponse(error.response?.status, error.response?.data)) {
          return { cityName: null, countryName: null, dday: '쉬는 중', endDate: null, headcount: null, startDate: null, status: 'NO_TRIP' }
        }
        throw error
      }
    },
    () => ({ ...mockDday, ...getMockDday(mockDday.startDate ?? undefined, mockDday.endDate ?? undefined) }),
  )
}

export async function getTourPlace(
  countryName: string,
  cityName?: string,
  category?: string,
): Promise<TourPlaceResponseDto[]> {
  return requestWithMockFallback(
    async () => {
      const { data } = await apiClient.get<TourPlaceResponseDto[]>(MAIN_API_PATHS.tourPlace, {
        params: { category, cityName, countryName },
      })
      return data
    },
    () => mockTourPlaces,
  )
}

export async function getMoreTourPlaces(
  countryName: string,
  cityName: string,
  category: string,
  cursor?: string,
): Promise<MoreTourPlacesResponseDto> {
  const { data } = await apiClient.get<MoreTourPlacesResponseDto>(MAIN_API_PATHS.tourPlaceMore, {
    params: { category, cityName, countryName, cursor },
  })
  return data
}

export async function getFestivals(
  countryName: string,
  year?: number,
  month?: number,
): Promise<FestivalResponseDto[]> {
  return requestWithMockFallback(
    async () => {
      const { data } = await apiClient.get<FestivalResponseDto[]>(MAIN_API_PATHS.festivals, { params: { countryName, month, year } })
      return data
    },
    () => mockFestivals.filter((festival) => {
      const date = festival.startDate ? new Date(`${festival.startDate}T00:00:00`) : undefined
      return countryName === '일본'
        && date != null
        && (year == null || date.getFullYear() === year)
        && (month == null || date.getMonth() + 1 === month)
    }),
  )
}

export async function getCountryInfo(countryName: string): Promise<CountryInfoResponseDto> {
  return requestWithMockFallback(
    async () => {
      const { data } = await apiClient.get<CountryInfoResponseDto>(MAIN_API_PATHS.countryInfo, { params: { countryName } })
      return data
    },
    () => mockCountries.find((country) => country.countryName === countryName) ?? mockCountries[0],
  )
}

export async function getCountries(keyword?: string): Promise<CountryInfoResponseDto[]> {
  return requestWithMockFallback(
    async () => {
      const normalizedKeyword = keyword?.trim()
      const { data } = await apiClient.get<CountryInfoResponseDto[]>(MAIN_API_PATHS.countries, {
        params: normalizedKeyword ? { keyword: normalizedKeyword } : undefined,
      })
      return data
    },
    () => {
      const normalizedKeyword = keyword?.trim().toLocaleLowerCase()
      if (!normalizedKeyword) return mockCountries

      return mockCountries.filter((country) => {
        const aliases = country.countryInfoId ? mockCountrySearchAliases[country.countryInfoId] ?? [] : []
        return [country.countryName, country.cityName, ...aliases]
          .filter((value): value is string => Boolean(value))
          .some((value) => value.toLocaleLowerCase().includes(normalizedKeyword))
      })
    },
  )
}

export async function getPopularCities(limit = 8): Promise<PopularCityResponseDto[]> {
  const normalizedLimit = Math.min(50, Math.max(1, Math.trunc(limit)))
  return requestWithMockFallback(
    async () => {
      const { data } = await apiClient.get<PopularCityResponseDto[]>(MAIN_API_PATHS.popularCities, { params: { limit: normalizedLimit } })
      return data
    },
    () => mockCountries
      .filter((country) => country.countryName && country.cityName)
      .map(({ cityName, countryName }, index) => ({ cityName, countryName, planCount: mockCountries.length - index }))
      .slice(0, normalizedLimit),
  )
}
