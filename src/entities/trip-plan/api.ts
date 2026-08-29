import { apiClient } from '@/shared/libs/api-client'
import { requestWithMockFallback } from '@/shared/libs/api-fallback'

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
  latitude?: number
  longitude?: number
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
  history: '/trips/history',
} as const

let mockTrips: TripPlanResponseDto[] = [
  {
    cityName: '오사카',
    countryName: '일본',
    endDate: '2026-08-27',
    images: [],
    places: [
      { dayNumber: 1, latitude: 34.6687, longitude: 135.5013, placeName: '도톤보리' },
      { dayNumber: 2, latitude: 34.6873, longitude: 135.5262, placeName: '오사카성' },
    ],
    startDate: '2026-08-23',
    title: '오사카 4박 5일',
    tripId: 1,
  },
  {
    cityName: '도쿄',
    countryName: '일본',
    endDate: '2026-05-12',
    images: [],
    places: [{ dayNumber: 1, placeName: '시부야' }],
    startDate: '2026-05-10',
    title: '도쿄 주말 여행',
    tripId: 2,
  },
  {
    cityName: '제주',
    countryName: '대한민국',
    endDate: '2025-12-24',
    images: [],
    places: [{ dayNumber: 1, placeName: '성산일출봉' }],
    startDate: '2025-12-20',
    title: '제주 겨울 여행',
    tripId: 3,
  },
]

export async function getTrip(tripId: number): Promise<TripPlanResponseDto> {
  return requestWithMockFallback(
    async () => {
      const { data } = await apiClient.get<TripPlanResponseDto>(TRIP_API_PATHS.detail(tripId))
      return data
    },
    () => {
      const trip = mockTrips.find((item) => item.tripId === tripId)
      if (!trip) throw new Error('여행 기록을 찾을 수 없습니다.')
      return trip
    },
    { mockFirst: true },
  )
}

export async function createTrip(payload: TripPlanRequestDto): Promise<TripPlanResponseDto> {
  return requestWithMockFallback(
    async () => {
      const { data } = await apiClient.post<TripPlanResponseDto>(TRIP_API_PATHS.base, payload)
      return data
    },
    () => {
      const trip = { ...payload, tripId: Date.now() }
      mockTrips = [trip, ...mockTrips]
      return trip
    },
    { mockFirst: true },
  )
}

export async function updateTrip(tripId: number, payload: TripPlanRequestDto): Promise<TripPlanResponseDto> {
  return requestWithMockFallback(
    async () => {
      const { data } = await apiClient.put<TripPlanResponseDto>(TRIP_API_PATHS.detail(tripId), payload)
      return data
    },
    () => {
      const current = mockTrips.find((trip) => trip.tripId === tripId) ?? {}
      const updated = { ...current, ...payload, tripId }
      mockTrips = mockTrips.map((trip) => trip.tripId === tripId ? updated : trip)
      return updated
    },
    { mockFirst: true },
  )
}

export async function deleteTrip(tripId: number): Promise<string> {
  return requestWithMockFallback(
    async () => {
      const { data } = await apiClient.delete<string>(TRIP_API_PATHS.detail(tripId))
      return data
    },
    () => {
      mockTrips = mockTrips.filter((trip) => trip.tripId !== tripId)
      return '삭제되었습니다.'
    },
    { mockFirst: true },
  )
}

export async function getMyTrips(): Promise<TripPlanResponseDto[]> {
  return getTripHistory()
}

export async function getTripHistory(): Promise<TripPlanResponseDto[]> {
  return requestWithMockFallback(
    async () => {
      const { data } = await apiClient.get<TripPlanResponseDto[]>(TRIP_API_PATHS.history)
      return data
    },
    () => mockTrips,
    { mockFirst: true },
  )
}
