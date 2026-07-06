import { apiClient } from './client'

export type TripPlaceRequestDto = {
  dayNumber?: number
  placeName?: string
  placeSub?: string
}

export type TripRequestDto = {
  title?: string
  countryInfoId?: number
  startDate?: string
  endDate?: string
  content?: string
  images?: string[]
  places?: TripPlaceRequestDto[]
}

export type TripPlaceResponseDto = {
  tripPlaceId?: number
  dayNumber?: number
  placeName?: string
  placeSub?: string
}

export type TripResponseDto = {
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
  places?: TripPlaceResponseDto[]
}

const TRIP_API_PATHS = {
  detail: (tripId: number) => `/trips/${tripId}`,
  base: '/trips',
  mine: '/trips/mine',
} as const

export async function getTrip(tripId: number): Promise<TripResponseDto> {
  const { data } = await apiClient.get<TripResponseDto>(TRIP_API_PATHS.detail(tripId))
  return data
}

export async function createTrip(payload: TripRequestDto): Promise<TripResponseDto> {
  const { data } = await apiClient.post<TripResponseDto>(TRIP_API_PATHS.base, payload)
  return data
}

export async function updateTrip(tripId: number, payload: TripRequestDto): Promise<TripResponseDto> {
  const { data } = await apiClient.put<TripResponseDto>(TRIP_API_PATHS.detail(tripId), payload)
  return data
}

export async function deleteTrip(tripId: number): Promise<string> {
  const { data } = await apiClient.delete<string>(TRIP_API_PATHS.detail(tripId))
  return data
}

export async function getMyTrips(): Promise<TripResponseDto[]> {
  const { data } = await apiClient.get<TripResponseDto[]>(TRIP_API_PATHS.mine)
  return data
}
