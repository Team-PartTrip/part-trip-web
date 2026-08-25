import { isAxiosError } from 'axios'
import { apiClient } from '@/shared/libs/api-client'
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

export type WeatherResponseDto = {
  temperature?: number
  feelsLike?: number
  description?: string
}

export type ExchangeRateResponseDto = {
  currencyCode?: string
  krwRate?: number
  date?: string
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
  population: '/main/population-info',
  food: '/main/food-info',
  festivals: '/main/festivals',
  countryInfo: '/main/country-info',
  todayPhrase: '/main/today-phrase',
  countries: '/main/countries',
  weather: '/main/weather',
  exchangeRate: '/main/exchange-rate',
  popular: '/main/search/popular',
  recent: '/main/search/recent',
} as const

export async function saveTravelPlan(payload: TravelPlanRequestDto): Promise<DdayResponseDto> {
  const { data } = await apiClient.post<DdayResponseDto>(MAIN_API_PATHS.travelPlan, payload)
  return data
}

export async function changeTravelCountry(payload: TravelChangeRequestDto): Promise<void> {
  await apiClient.patch(MAIN_API_PATHS.travelChange, payload)
}

export async function getDday(): Promise<DdayResponseDto | undefined> {
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

export async function getPopulationInfo(countryName: string): Promise<PopulationInfoResponseDto[]> {
  const { data } = await apiClient.get<PopulationInfoResponseDto[]>(MAIN_API_PATHS.population, {
    params: { countryName }
  })
  return data
}

export async function getFoodInfo(countryName: string): Promise<FoodInfoResponseDto[]> {
  const { data } = await apiClient.get<FoodInfoResponseDto[]>(MAIN_API_PATHS.food, {
    params: { countryName }
  })
  return data
}

export async function getFestivals(
  countryName: string,
  year?: number,
  month?: number,
): Promise<FestivalResponseDto[]> {
  const { data } = await apiClient.get<FestivalResponseDto[]>(MAIN_API_PATHS.festivals, {
    params: { countryName, month, year },
  })
  return data
}

export async function getCountryInfo(countryName: string): Promise<CountryInfoResponseDto> {
  const { data } = await apiClient.get<CountryInfoResponseDto>(MAIN_API_PATHS.countryInfo, {
    params: { countryName }
  })
  return data
}

export async function getCountries(): Promise<CountryInfoResponseDto[]> {
  const { data } = await apiClient.get<CountryInfoResponseDto[]>(MAIN_API_PATHS.countries)
  return data
}

export async function getTodayPhrase(countryName: string, dayNumber: number): Promise<TodayPhraseResponseDto> {
  const { data } = await apiClient.get<TodayPhraseResponseDto>(MAIN_API_PATHS.todayPhrase, {
    params: { countryName, dayNumber },
  })
  return data
}

export async function getWeather(countryName: string): Promise<WeatherResponseDto> {
  const { data } = await apiClient.get<WeatherResponseDto>(MAIN_API_PATHS.weather, { params: { countryName } })
  return data
}

export async function getExchangeRate(countryName: string): Promise<ExchangeRateResponseDto> {
  const { data } = await apiClient.get<ExchangeRateResponseDto>(MAIN_API_PATHS.exchangeRate, { params: { countryName } })
  return data
}

export async function getPopularPlaces(): Promise<PopularPlaceResponseDto[]> {
  const { data } = await apiClient.get<PopularPlaceResponseDto[]>(MAIN_API_PATHS.popular)
  return data
}

export async function getRecentSearches(): Promise<RecentSearchResponseDto[]> {
  const { data } = await apiClient.get<RecentSearchResponseDto[]>(MAIN_API_PATHS.recent)
  return data
}

export async function saveRecentSearch(payload: RecentSearchRequestDto): Promise<void> {
  await apiClient.post(MAIN_API_PATHS.recent, payload)
}

export async function deleteRecentSearch(recentSearchId: number): Promise<void> {
  await apiClient.delete(`${MAIN_API_PATHS.recent}/${recentSearchId}`)
}
