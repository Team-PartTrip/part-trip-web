import { isAxiosError } from 'axios'
import { apiClient } from './client'
import { isMissingTravelPlanResponse } from './mainError'
import { runtimeConfig } from '@shared/config'

export type TravelPlanRequestDto = {
  countryName?: string
  cityName?: string
  startDate?: string
  endDate?: string
}

export type DdayResponseDto = {
  countryName?: string
  cityName?: string
  startDate?: string
  endDate?: string
  dday?: string
}

export type TourPlaceResponseDto = {
  placeName?: string
  description?: string
  imageUrl?: string
  latitude?: number
  longitude?: number
}

export type PopulationInfoResponseDto = {
  populationInfoId?: number
  nationCode?: string
  nationName?: string
  percent?: number
}

export type FoodInfoResponseDto = {
  foodName?: string
  description?: string
  imageUrl?: string
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

export type TodayPhraseResponseDto = {
  dayNumber?: number
  meaning?: string
  phrase?: string
}

const MAIN_API_PATHS = {
  base: '/main',
  travelPlan: '/main/travel-plan',
  dday: '/main/dday',
  tourPlace: '/main/tour-place',
  population: '/main/population-info',
  food: '/main/food-info',
  festivals: '/main/festivals',
  countryInfo: '/main/country-info',
  todayPhrase: '/main/today-phrase',
} as const

// Mock 데이터 정의 (useMockApi가 true일 때 임시로 사용)
const mockCountries: CountryInfoResponseDto[] = [
  { countryInfoId: 1, countryName: '싱가포르', cityName: '싱가포르', imageUrl: '', summary: '머라이언 파크가 있는 동남아시아의 허브 도시 국가' },
  { countryInfoId: 2, countryName: '베트남', cityName: '다낭', imageUrl: '', summary: '가족 여행지로 인기가 높은 아름다운 해변 도시' },
  { countryInfoId: 3, countryName: '일본', cityName: '도쿄', imageUrl: '', summary: '현대 문명과 전통이 공존하는 트렌디한 대도시' },
]

let mockActivePlan: DdayResponseDto | null = {
  countryName: '싱가포르',
  cityName: '싱가포르',
  startDate: '2026-08-15',
  endDate: '2026-08-20',
  dday: '40',
}

export async function saveTravelPlan(payload: TravelPlanRequestDto): Promise<DdayResponseDto> {
  if (runtimeConfig.useMockApi) {
    mockActivePlan = {
      ...payload,
      dday: '30', // 가짜 디데이 값 설정
    }
    return mockActivePlan
  }
  const { data } = await apiClient.post<DdayResponseDto>(MAIN_API_PATHS.travelPlan, payload)
  return data
}

export async function getDday(): Promise<DdayResponseDto | undefined> {
  if (runtimeConfig.useMockApi) {
    return mockActivePlan ?? undefined
  }
  try {
    const { data } = await apiClient.get<DdayResponseDto>(MAIN_API_PATHS.dday)
    return data
  } catch (error) {
    if (isAxiosError(error) && isMissingTravelPlanResponse(error.response?.status, error.response?.data)) {
      return undefined
    }
    throw error
  }
}

export async function getTourPlace(countryName: string): Promise<TourPlaceResponseDto[]> {
  if (runtimeConfig.useMockApi) {
    return [
      {
        placeName: '마리나 베이 샌즈',
        description: '싱가포르의 랜드마크이자 인피니티 풀이 유명한 호텔&복합단지',
        imageUrl: '',
        latitude: 1.2829,
        longitude: 103.8587
      },
      {
        placeName: '센토사 섬',
        description: '케이블카, 루지, 유니버셜 스튜디오 등 놀거리가 가득한 휴양 섬',
        imageUrl: '',
        latitude: 1.2494,
        longitude: 103.8303
      }
    ]
  }
  const { data } = await apiClient.get<TourPlaceResponseDto[]>(MAIN_API_PATHS.tourPlace, {
    params: { countryName }
  })
  return data
}

export async function getPopulationInfo(countryName: string): Promise<PopulationInfoResponseDto[]> {
  if (runtimeConfig.useMockApi) {
    return [
      { nationCode: 'CN', nationName: '중국계', percent: 74 },
      { nationCode: 'MY', nationName: '말레이계', percent: 14 },
      { nationCode: 'IN', nationName: '인도계', percent: 9 },
    ]
  }
  const { data } = await apiClient.get<PopulationInfoResponseDto[]>(MAIN_API_PATHS.population, {
    params: { countryName }
  })
  return data
}

export async function getFoodInfo(countryName: string): Promise<FoodInfoResponseDto[]> {
  if (runtimeConfig.useMockApi) {
    return [
      { foodName: '칠리 크랩', description: '매콤달콤한 소스에 볶아낸 싱가포르 최고의 게 요리', imageUrl: '' },
      { foodName: '카야 토스트', description: '바삭하게 구운 빵에 카야잼과 버터를 바르고 반숙 계란에 찍어먹는 아침식사', imageUrl: '' },
    ]
  }
  const { data } = await apiClient.get<FoodInfoResponseDto[]>(MAIN_API_PATHS.food, {
    params: { countryName }
  })
  return data
}

export async function getFestivals(countryName: string): Promise<FestivalResponseDto[]> {
  if (runtimeConfig.useMockApi) {
    return [
      {
        title: '싱가포르 푸드 페스티벌',
        category: '음식',
        description: '싱가포르 전역의 셰프들이 한자리에 모여 다양한 음식을 뽐내는 미식 축제',
        startDate: '2026-08-01',
        startTime: '11:00',
        location: '베이프론트 이벤트 스페이스',
        imageUrl: ''
      }
    ]
  }
  const { data } = await apiClient.get<FestivalResponseDto[]>(MAIN_API_PATHS.festivals, {
    params: { countryName }
  })
  return data
}

export async function getCountryInfo(countryName: string): Promise<CountryInfoResponseDto> {
  if (runtimeConfig.useMockApi) {
    const found = mockCountries.find(c => c.countryName === countryName)
    if (!found) throw new Error('Country not found')
    return found
  }
  const { data } = await apiClient.get<CountryInfoResponseDto>(MAIN_API_PATHS.countryInfo, {
    params: { countryName }
  })
  return data
}

export async function getCountries(): Promise<CountryInfoResponseDto[]> {
  return mockCountries
}

export async function getTodayPhrase(countryName: string, dayNumber: number): Promise<TodayPhraseResponseDto> {
  if (runtimeConfig.useMockApi) {
    return { dayNumber, meaning: '안녕하세요', phrase: 'Hello' }
  }
  const { data } = await apiClient.get<TodayPhraseResponseDto>(MAIN_API_PATHS.todayPhrase, {
    params: { countryName, dayNumber },
  })
  return data
}

export async function getMainPage(): Promise<string> {
  if (runtimeConfig.useMockApi) {
    return 'Welcome to PartTrip!'
  }
  const { data } = await apiClient.get<string>(MAIN_API_PATHS.base)
  return data
}
