import { isAxiosError } from 'axios'
import { apiClient } from '@/shared/libs/api-client'
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

export type CitySearchResponseDto = {
  cityName?: string
  countryName?: string
  regionName?: string
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
  countries: '/main/countries',
  cities: '/main/cities',
  popularCities: '/main/popular-cities',
} as const

function isTripPhase(value: unknown): value is TripPhase {
  return value === 'NO_TRIP' || value === 'BEFORE' || value === 'DURING' || value === 'ENDED'
}

type DdayResponseInput = Omit<DdayResponseDto, 'status'> & { status?: unknown }

export function normalizeDdayResponse(data: DdayResponseInput): DdayResponseDto {
  if (isTripPhase(data.status)) return { ...data, status: data.status }
  throw new Error('여행 상태 응답이 올바르지 않습니다.')
}

export async function getDday(): Promise<DdayResponseDto> {
  try {
    const { data } = await apiClient.get<DdayResponseInput>(MAIN_API_PATHS.dday)
    return normalizeDdayResponse(data)
  } catch (error) {
    if (isAxiosError(error) && isMissingTravelPlanResponse(error.response?.status, error.response?.data)) {
      return { cityName: null, countryName: null, dday: '쉬는 중', endDate: null, headcount: null, startDate: null, status: 'NO_TRIP' }
    }
    throw error
  }
}

export async function getTourPlace(
  countryName: string,
  cityName?: string,
  category?: string,
): Promise<TourPlaceResponseDto[]> {
  const { data } = await apiClient.get<TourPlaceResponseDto[]>(MAIN_API_PATHS.tourPlace, {
    params: { category, cityName, countryName },
  })
  return data
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
  const { data } = await apiClient.get<FestivalResponseDto[]>(MAIN_API_PATHS.festivals, { params: { countryName, month, year } })
  return data
}

export async function getCountries(keyword?: string): Promise<CountryInfoResponseDto[]> {
  const normalizedKeyword = keyword?.trim()
  const { data } = await apiClient.get<CountryInfoResponseDto[]>(MAIN_API_PATHS.countries, {
    params: normalizedKeyword ? { keyword: normalizedKeyword } : undefined,
  })
  return data
}

export async function searchCities(countryName: string, keyword: string): Promise<CitySearchResponseDto[]> {
  const { data } = await apiClient.get<CitySearchResponseDto[]>(MAIN_API_PATHS.cities, {
    params: { countryName, keyword: keyword.trim() },
  })
  return data
}

export async function getPopularCities(limit: number): Promise<PopularCityResponseDto[]> {
  const { data } = await apiClient.get<PopularCityResponseDto[]>(MAIN_API_PATHS.popularCities, { params: { limit } })
  return data
}
