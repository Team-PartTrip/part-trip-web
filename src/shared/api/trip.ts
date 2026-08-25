import { apiClient } from '../libs/api-client'

export type TripPlanPlaceRequestDto = {
  dayNumber?: number
  placeName?: string
  placeSub?: string
}

export type TripPlanRequestDto = {
  title?: string
  countryInfoId?: number
  startDate?: string
  endDate?: string
  content?: string
  images?: string[]
  places?: TripPlanPlaceRequestDto[]
}

export type TripPlanPlaceResponseDto = {
  tripPlaceId?: number
  dayNumber?: number
  placeName?: string
  placeSub?: string
}

export type TripPlanResponseDto = {
  tripId?: number
  userId?: string
  nickName?: string
  title?: string
  countryInfoId?: number
  countryName?: string
  cityName?: string
  startDate?: string
  endDate?: string
  content?: string
  images?: string[]
  likeCount?: number
  liked?: boolean
  commentCount?: number
  isPublic?: boolean
  createDate?: string
  places?: TripPlanPlaceResponseDto[]
}

const TRIP_API_PATHS = {
  detail: (tripId: number) => `/trips/${tripId}`,
  base: '/trips',
  mine: '/trips/mine',
} as const

export async function getTrip(tripId: number): Promise<TripPlanResponseDto> {
  const { data } = await apiClient.get<TripPlanResponseDto>(TRIP_API_PATHS.detail(tripId))
  return data
}

export async function createTrip(payload: TripPlanRequestDto): Promise<TripPlanResponseDto> {
  const { data } = await apiClient.post<TripPlanResponseDto>(TRIP_API_PATHS.base, payload)
  return data
}

export async function updateTrip(tripId: number, payload: TripPlanRequestDto): Promise<TripPlanResponseDto> {
  const { data } = await apiClient.put<TripPlanResponseDto>(TRIP_API_PATHS.detail(tripId), payload)
  return data
}

export async function deleteTrip(tripId: number): Promise<string> {
  const { data } = await apiClient.delete<string>(TRIP_API_PATHS.detail(tripId))
  return data
}

export async function getMyTrips(): Promise<TripPlanResponseDto[]> {
  const { data } = await apiClient.get<TripPlanResponseDto[]>(TRIP_API_PATHS.mine)
  return data
}
