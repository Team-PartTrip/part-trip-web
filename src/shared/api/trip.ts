import { apiClient } from './client'
import { runtimeConfig } from '@shared/config'

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

// Mock 데이터 정의 (useMockApi가 true일 때 임시로 사용)
const mockTrips: TripResponseDto[] = [
  {
    tripId: 1,
    userId: 'user1',
    nickName: '여행가',
    title: '나의 첫 싱가포르 여행',
    countryInfoId: 1,
    countryName: '싱가포르',
    cityName: '싱가포르',
    startDate: '2026-06-08',
    endDate: '2026-06-12',
    content: '너무 재미있었던 싱가포르 여행!',
    images: [],
    likeCount: 5,
    liked: false,
    commentCount: 2,
    isPublic: true,
    createDate: '2026-07-06T10:00:00Z',
    places: [
      { tripPlaceId: 1, dayNumber: 1, placeName: '마리나 베이', placeSub: '호텔 체크인' },
      { tripPlaceId: 2, dayNumber: 2, placeName: '가든스 바이 더 베이', placeSub: '슈퍼트리 쇼 관람' }
    ]
  }
]

export async function getTrip(tripId: number): Promise<TripResponseDto> {
  if (runtimeConfig.useMockApi) {
    const found = mockTrips.find(t => t.tripId === tripId)
    if (!found) throw new Error('Trip not found')
    return found
  }
  const { data } = await apiClient.get<TripResponseDto>(TRIP_API_PATHS.detail(tripId))
  return data
}

export async function createTrip(payload: TripRequestDto): Promise<TripResponseDto> {
  if (runtimeConfig.useMockApi) {
    const newTrip: TripResponseDto = {
      ...payload,
      tripId: Date.now(),
      userId: 'mock-user',
      nickName: '임시유저',
      likeCount: 0,
      liked: false,
      commentCount: 0,
      isPublic: true,
      createDate: new Date().toISOString(),
      places: payload.places?.map((p, i) => ({
        tripPlaceId: Date.now() + i,
        ...p
      })) || []
    }
    mockTrips.push(newTrip)
    return newTrip
  }
  const { data } = await apiClient.post<TripResponseDto>(TRIP_API_PATHS.base, payload)
  return data
}

export async function updateTrip(tripId: number, payload: TripRequestDto): Promise<TripResponseDto> {
  if (runtimeConfig.useMockApi) {
    const index = mockTrips.findIndex(t => t.tripId === tripId)
    if (index === -1) throw new Error('Trip not found')
    const updated: TripResponseDto = {
      ...mockTrips[index],
      ...payload,
      places: payload.places?.map((p, i) => ({
        tripPlaceId: Date.now() + i,
        ...p
      })) || mockTrips[index].places
    }
    mockTrips[index] = updated
    return updated
  }
  const { data } = await apiClient.put<TripResponseDto>(TRIP_API_PATHS.detail(tripId), payload)
  return data
}

export async function deleteTrip(tripId: number): Promise<string> {
  if (runtimeConfig.useMockApi) {
    const index = mockTrips.findIndex(t => t.tripId === tripId)
    if (index === -1) throw new Error('Trip not found')
    mockTrips.splice(index, 1)
    return 'success'
  }
  const { data } = await apiClient.delete<string>(TRIP_API_PATHS.detail(tripId))
  return data
}

export async function getMyTrips(): Promise<TripResponseDto[]> {
  if (runtimeConfig.useMockApi) {
    return mockTrips
  }
  const { data } = await apiClient.get<TripResponseDto[]>(TRIP_API_PATHS.mine)
  return data
}
