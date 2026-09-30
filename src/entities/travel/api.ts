import { isAxiosError } from 'axios'
import { apiClient, resolveApiAssetUrl } from '@/shared/libs/api-client'
import { isMissingTravelPlanResponse } from './main-error'

export type TripPhase = 'NO_TRIP' | 'BEFORE' | 'DURING' | 'ENDED'

export type DdayResponseDto = {
  regionName?: string | null
  cityName?: string | null
  headcount?: number | null
  startDate?: string | null
  endDate?: string | null
  dday?: string | null
  todaySchedule?: Array<{ slotId?: number; tourPlaceId?: number }>
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

export type AccessibilityResponseDto = {
  matched?: boolean
  items?: Array<{ key?: string; label?: string; text?: string }>
}

export type FestivalResponseDto = {
  festivalId?: number
  title?: string
  category?: string
  description?: string
  startDate?: string
  endDate?: string
  startTime?: string
  location?: string
  imageUrl?: string
}

export type PlaceSearchResponseDto = {
  name: string
  address: string
  latitude: number
  longitude: number
}

const MAIN_API_PATHS = {
  dday: '/main/dday',
  tourPlace: '/main/tour-place',
  tourPlaceMore: '/main/tour-place/more',
  tourPlaceAccessibility: (tourPlaceId: number) => `/main/tour-place/${tourPlaceId}/accessibility`,
  festivals: '/main/festivals',
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
      return { cityName: null, regionName: null, dday: '쉬는 중', endDate: null, headcount: null, startDate: null, status: 'NO_TRIP' }
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
  return data.map(normalizeTourPlace)
}

function normalizeTourPlace(place: TourPlaceResponseDto): TourPlaceResponseDto {
  return { ...place, imageUrl: resolveApiAssetUrl(place.imageUrl) }
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
  return { ...data, places: data.places?.map(normalizeTourPlace) }
}

export async function getTourPlaceAccessibility(tourPlaceId: number): Promise<AccessibilityResponseDto> {
  const { data } = await apiClient.get<AccessibilityResponseDto>(MAIN_API_PATHS.tourPlaceAccessibility(tourPlaceId))
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

export async function searchPlaces(keyword: string): Promise<PlaceSearchResponseDto[]> {
  const { data } = await apiClient.get<PlaceSearchResponseDto[]>('/places/search', { params: { q: keyword.trim() } })
  return data
}
