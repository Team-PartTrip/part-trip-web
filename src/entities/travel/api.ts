import { isAxiosError } from 'axios'
import { apiClient } from '@/shared/libs/api-client'
import { requestWithMockFallback } from '@/shared/libs/api-fallback'
import { isMissingTravelPlanResponse } from './main-error'

export type TravelPlanRequestDto = {
  countryName?: string
  cityName?: string
  headcount?: number
  startDate?: string
  endDate?: string
}

export type DdayResponseDto = {
  travelPlanId?: number
  countryName?: string
  cityName?: string
  headcount?: number
  startDate?: string
  endDate?: string
  dday?: string
}

export type TravelChangeRequestDto = {
  travelPlanId: number
  countryInfoId: number
}

export type TourPlaceResponseDto = {
  address?: string
  category?: string
  placeName?: string
  description?: string
  imageUrl?: string
  latitude?: number
  longitude?: number
  rating?: number
  tourPlaceId?: number
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

export type PopularPlaceResponseDto = CountryInfoResponseDto

export type RecentSearchResponseDto = {
  recentSearchId?: number
  countryName?: string
  cityName?: string
  imageUrl?: string
}

export type RecentSearchRequestDto = {
  countryInfoId: number
}

export type Destination = {
  country: string
  countryInfoId?: number
  currency: string
  id: string
  imageUrl?: string
  name: string
  recentSearchId?: number
}

const MAIN_API_PATHS = {
  travelPlan: '/main/travel-plan',
  travelChange: '/main/search/travel-change',
  dday: '/main/dday',
  tourPlace: '/main/tour-place',
  festivals: '/main/festivals',
  countryInfo: '/main/country-info',
  countries: '/main/countries',
  popular: '/main/search/popular',
  recent: '/main/search/recent',
} as const

const mockCountries: CountryInfoResponseDto[] = [
  { countryInfoId: 1, countryName: '일본', cityName: '오사카', summary: '도시와 미식이 함께하는 여행지' },
  { countryInfoId: 2, countryName: '태국', cityName: '방콕', summary: '시장과 사원이 있는 도시' },
  { countryInfoId: 3, countryName: '대만', cityName: '타이베이', summary: '골목과 야시장을 즐기는 여행지' },
  { countryInfoId: 4, countryName: '베트남', cityName: '다낭', summary: '바다와 휴식을 위한 여행지' },
]

const mockCountrySearchAliases: Record<number, string[]> = {
  1: ['japan', 'osaka'],
  2: ['thailand', 'bangkok'],
  3: ['taiwan', 'taipei'],
  4: ['vietnam', 'danang', 'da nang'],
}

const mockTourPlaces: TourPlaceResponseDto[] = [
  { tourPlaceId: 1, placeName: '이치란 라멘', category: '맛집', address: '도톤보리', rating: 4.6, description: '오사카에서 즐기는 대표 라멘' },
  { tourPlaceId: 2, placeName: '쿠시카츠 다루마', category: '맛집', address: '신세카이', rating: 4.4, description: '바삭한 쿠시카츠 전문점' },
  { tourPlaceId: 3, placeName: '하리주 그릴', category: '맛집', address: '난바', rating: 4.7, description: '오래된 오사카식 그릴' },
  { tourPlaceId: 4, placeName: '미즈노 오코노미야키', category: '맛집', address: '도톤보리', rating: 4.5, description: '현지식 오코노미야키' },
  { tourPlaceId: 5, placeName: '오사카성', category: '명소', address: '주오구', rating: 4.7, description: '오사카를 대표하는 역사 명소' },
  { tourPlaceId: 6, placeName: '호텔 닛코 오사카', category: '숙소', address: '신사이바시', rating: 4.3, description: '도심 이동이 편한 숙소' },
  { tourPlaceId: 7, placeName: '리로 커피 로스터스', category: '카페', address: '난바', rating: 4.5, description: '여행 중 쉬어가기 좋은 카페' },
  { tourPlaceId: 8, placeName: '유니버설 스튜디오 재팬', category: '액티비티', address: '고노하나구', rating: 4.8, description: '하루 종일 즐기는 테마파크' },
  { tourPlaceId: 9, placeName: '난바 파크스', category: '쇼핑', address: '난바', rating: 4.4, description: '쇼핑과 식사를 함께 즐기는 공간' },
]

const mockFestivals: FestivalResponseDto[] = [
  { festivalId: 1, title: '텐진 마츠리 불꽃', category: '축제', startDate: '2026-08-25', startTime: '19:30', location: '오사카성 공원' },
  { festivalId: 2, title: '난바 재즈 나이트', category: '공연', startDate: '2026-08-26', startTime: '20:00', location: '난바 홀' },
  { festivalId: 3, title: '구로몬 야시장', category: '마켓', startDate: '2026-08-27', startTime: '17:00', location: '구로몬 시장' },
]

const mockDday: DdayResponseDto = {
  cityName: '오사카',
  countryName: '일본',
  dday: 'D-3',
  endDate: '2026-08-27',
  headcount: 4,
  startDate: '2026-08-23',
}

export async function saveTravelPlan(payload: TravelPlanRequestDto): Promise<DdayResponseDto> {
  return requestWithMockFallback(
    async () => {
      const { data } = await apiClient.post<DdayResponseDto>(MAIN_API_PATHS.travelPlan, payload)
      return data
    },
    () => ({ ...mockDday, ...payload, dday: 'D-3' }),
  )
}

export async function changeTravelCountry(payload: TravelChangeRequestDto): Promise<void> {
  await requestWithMockFallback(
    async () => { await apiClient.patch(MAIN_API_PATHS.travelChange, payload) },
    () => undefined,
  )
}

export async function getDday(): Promise<DdayResponseDto | undefined> {
  return requestWithMockFallback(
    async () => {
      try {
        const { data } = await apiClient.get<DdayResponseDto>(MAIN_API_PATHS.dday)
        return data
      } catch (error) {
        if (isAxiosError(error) && isMissingTravelPlanResponse(error.response?.status, error.response?.data)) return undefined
        throw error
      }
    },
    () => mockDday,
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
    () => mockTourPlaces.filter((place) => !category || place.category === category),
  )
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
    () => mockFestivals,
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
          .filter(Boolean)
          .some((value) => value!.toLocaleLowerCase().includes(normalizedKeyword))
      })
    },
  )
}

export async function getPopularPlaces(): Promise<PopularPlaceResponseDto[]> {
  return requestWithMockFallback(
    async () => {
      const { data } = await apiClient.get<PopularPlaceResponseDto[]>(MAIN_API_PATHS.popular)
      return data
    },
    () => mockCountries.slice(0, 4),
  )
}

export async function getRecentSearches(): Promise<RecentSearchResponseDto[]> {
  return requestWithMockFallback(
    async () => {
      const { data } = await apiClient.get<RecentSearchResponseDto[]>(MAIN_API_PATHS.recent)
      return data
    },
    () => mockCountries.slice(0, 2).map(({ cityName, countryName, imageUrl }, index) => ({ cityName, countryName, imageUrl, recentSearchId: index + 1 })),
  )
}

export async function saveRecentSearch(payload: RecentSearchRequestDto): Promise<void> {
  await requestWithMockFallback(
    async () => { await apiClient.post(MAIN_API_PATHS.recent, payload) },
    () => undefined,
  )
}

export async function deleteRecentSearch(recentSearchId: number): Promise<void> {
  await requestWithMockFallback(
    async () => { await apiClient.delete(`${MAIN_API_PATHS.recent}/${recentSearchId}`) },
    () => undefined,
  )
}
