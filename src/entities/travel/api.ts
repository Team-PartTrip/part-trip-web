import { isAxiosError } from 'axios'
import { apiClient } from '@/shared/libs/api-client'
import { requestWithMockFallback } from '@/shared/libs/api-fallback'
import { isMissingTravelPlanResponse } from './main-error'

export type DdayResponseDto = {
  countryName?: string | null
  cityName?: string | null
  headcount?: number | null
  startDate?: string | null
  endDate?: string | null
  dday?: string | null
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
  festivals: '/main/festivals',
  countryInfo: '/main/country-info',
  countries: '/main/countries',
  popularCities: '/main/popular-cities',
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
  { category: '맛집', address: '도톤보리', rating: 4.6, placeName: '이치란 라멘', description: '오사카에서 즐기는 대표 라멘' },
  { category: '맛집', address: '신세카이', rating: 4.4, placeName: '쿠시카츠 다루마', description: '바삭한 쿠시카츠 전문점' },
  { category: '맛집', address: '난바', rating: 4.7, placeName: '하리주 그릴', description: '오래된 오사카식 그릴' },
  { category: '맛집', address: '도톤보리', rating: 4.5, placeName: '미즈노 오코노미야키', description: '현지식 오코노미야키' },
  { category: '명소', address: '주오구', rating: 4.7, placeName: '오사카성', description: '오사카를 대표하는 역사 명소' },
  { category: '숙소', address: '신사이바시', rating: 4.3, placeName: '호텔 닛코 오사카', description: '도심 이동이 편한 숙소' },
  { category: '카페', address: '난바', rating: 4.5, placeName: '리로 커피 로스터스', description: '여행 중 쉬어가기 좋은 카페' },
  { category: '액티비티', address: '고노하나구', rating: 4.8, placeName: '유니버설 스튜디오 재팬', description: '하루 종일 즐기는 테마파크' },
  { category: '쇼핑', address: '난바', rating: 4.4, placeName: '난바 파크스', description: '쇼핑과 식사를 함께 즐기는 공간' },
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

function getMockDday(startDate?: string, endDate?: string) {
  if (!startDate || !endDate) return '쉬는 중'
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const start = new Date(`${startDate}T00:00:00`)
  const end = new Date(`${endDate}T00:00:00`)
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return '쉬는 중'
  const days = Math.round((start.getTime() - today.getTime()) / 86_400_000)
  if (days > 0) return `D-${days}`
  if (days === 0) return 'D-Day'
  return today <= end ? '여행 중' : '여행 종료'
}

export async function getDday(): Promise<DdayResponseDto> {
  return requestWithMockFallback(
    async () => {
      try {
        const { data } = await apiClient.get<DdayResponseDto>(MAIN_API_PATHS.dday)
        return data
      } catch (error) {
        if (isAxiosError(error) && isMissingTravelPlanResponse(error.response?.status, error.response?.data)) {
          return { cityName: null, countryName: null, dday: '쉬는 중', endDate: null, headcount: null, startDate: null }
        }
        throw error
      }
    },
    () => ({ ...mockDday, dday: getMockDday(mockDday.startDate ?? undefined, mockDday.endDate ?? undefined) }),
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
          .filter(Boolean)
          .some((value) => value!.toLocaleLowerCase().includes(normalizedKeyword))
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
