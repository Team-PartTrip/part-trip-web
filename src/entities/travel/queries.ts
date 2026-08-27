import { queryOptions, useQueries, useQuery } from '@tanstack/react-query'
import {
  getCountries,
  getCountryInfo,
  getDday,
  getExchangeRate,
  getFestivals,
  getFoodInfo,
  getPopularPlaces,
  getRecentSearches,
  getPopulationInfo,
  getTodayPhrase,
  getTourPlace,
  getWeather,
  type CountryInfoResponseDto,
  type DdayResponseDto,
  type Destination,
  type ExchangeRateResponseDto,
  type FestivalResponseDto,
  type FoodInfoResponseDto,
  type PopulationInfoResponseDto,
  type TodayPhraseResponseDto,
  type TourPlaceResponseDto,
  type WeatherResponseDto,
} from './api'
import { travelQueryKeys } from './query-keys'

const currencyByCountry: Record<string, string> = {
  베트남: 'VND',
  싱가포르: 'SGD',
  일본: 'JPY',
  태국: 'THB',
}

export const countriesQueryOptions = (enabled = true) =>
  queryOptions({
    queryKey: travelQueryKeys.countries(),
    queryFn: getCountries,
    enabled,
  })

export const ddayQueryOptions = (enabled = true) =>
  queryOptions({
    queryKey: travelQueryKeys.dday(),
    queryFn: getDday,
    enabled,
  })

export const festivalsQueryOptions = (countryName: string, year?: number, month?: number) =>
  queryOptions({
    queryKey: travelQueryKeys.festivals(countryName, year, month),
    queryFn: () => getFestivals(countryName, year, month),
    enabled: Boolean(countryName),
  })

export function useCountriesQuery(enabled = true) {
  return useQuery(countriesQueryOptions(enabled))
}

export function useDdayQuery(enabled = true) {
  return useQuery(ddayQueryOptions(enabled))
}

export function useFestivalsQuery(countryName?: string, year?: number, month?: number) {
  return useQuery(festivalsQueryOptions(countryName ?? '', year, month))
}

export const tourPlacesQueryOptions = (
  countryName: string,
  cityName?: string,
  category?: string,
  enabled = true,
) =>
  queryOptions({
    queryKey: travelQueryKeys.tourPlaces(countryName, cityName, category),
    queryFn: () => getTourPlace(countryName, cityName, category),
    enabled: enabled && Boolean(countryName),
  })

export function useTourPlacesQuery(
  countryName?: string,
  cityName?: string,
  category?: string,
  enabled = true,
) {
  return useQuery(tourPlacesQueryOptions(countryName ?? '', cityName, category, enabled))
}

export type DestinationQueryData = {
  destinations: readonly Destination[]
  recentDestinations: readonly Destination[]
  travelPlanId?: number
}

export async function getDestinationData(): Promise<DestinationQueryData> {
  const [countries, popularPlaces, currentPlan] = await Promise.all([
    getCountries(),
    getPopularPlaces(),
    getDday(),
  ])
  const destinations = countries.map((country, index) => ({
    country: country.countryName ?? '여행지',
    countryInfoId: country.countryInfoId,
    currency: currencyByCountry[country.countryName ?? ''] ?? '',
    id: String(country.countryInfoId ?? index),
    imageUrl: country.imageUrl,
    name: country.cityName || country.countryName || '여행지',
  }))
  const popularIds = new Set(popularPlaces.map((place) => place.countryInfoId))
  const recentSearches = await getRecentSearches()

  return {
    destinations: [...destinations].sort(
      (a, b) => Number(popularIds.has(b.countryInfoId)) - Number(popularIds.has(a.countryInfoId)),
    ),
    recentDestinations: recentSearches.map((item, index) => ({
      country: item.countryName ?? '여행지',
      currency: currencyByCountry[item.countryName ?? ''] ?? '',
      id: `recent-${item.recentSearchId ?? index}`,
      imageUrl: item.imageUrl,
      name: item.cityName || item.countryName || '여행지',
      recentSearchId: item.recentSearchId,
    })),
    travelPlanId: currentPlan?.travelPlanId,
  }
}

export const destinationQueryOptions = () =>
  queryOptions({
    queryKey: travelQueryKeys.destinationSelector(),
    queryFn: getDestinationData,
  })

export function useDestinationDataQuery() {
  return useQuery(destinationQueryOptions())
}

export type MainTravelQueryData = {
  country?: CountryInfoResponseDto
  exchangeRate?: ExchangeRateResponseDto
  festivals: FestivalResponseDto[]
  foodInfo: FoodInfoResponseDto[]
  plan?: DdayResponseDto
  phrase?: TodayPhraseResponseDto
  populationInfo: PopulationInfoResponseDto[]
  tourPlaces: TourPlaceResponseDto[]
  weather?: WeatherResponseDto
}

export function useMainTravelQuery() {
  const ddayQuery = useDdayQuery()
  const countryName = ddayQuery.data?.countryName ?? ''
  const hasCountry = Boolean(countryName)
  const results = useQueries({
    queries: [
      { queryKey: travelQueryKeys.country(countryName), queryFn: () => getCountryInfo(countryName), enabled: hasCountry },
      { queryKey: travelQueryKeys.population(countryName), queryFn: () => getPopulationInfo(countryName), enabled: hasCountry },
      { queryKey: travelQueryKeys.tourPlaces(countryName), queryFn: () => getTourPlace(countryName), enabled: hasCountry },
      { queryKey: travelQueryKeys.food(countryName), queryFn: () => getFoodInfo(countryName), enabled: hasCountry },
      { queryKey: travelQueryKeys.festivals(countryName), queryFn: () => getFestivals(countryName), enabled: hasCountry },
      { queryKey: travelQueryKeys.phrase(countryName), queryFn: () => getTodayPhrase(countryName, 1), enabled: hasCountry, retry: false },
      { queryKey: travelQueryKeys.weather(countryName), queryFn: () => getWeather(countryName), enabled: hasCountry, retry: false },
      { queryKey: travelQueryKeys.exchangeRate(countryName), queryFn: () => getExchangeRate(countryName), enabled: hasCountry, retry: false },
    ],
  })
  const [country, populationInfo, tourPlaces, foodInfo, festivals, phrase, weather, exchangeRate] = results

  return {
    data: {
      country: country.data,
      exchangeRate: exchangeRate.data,
      festivals: festivals.data ?? [],
      foodInfo: foodInfo.data ?? [],
      plan: ddayQuery.data,
      phrase: phrase.data,
      populationInfo: populationInfo.data ?? [],
      tourPlaces: tourPlaces.data ?? [],
      weather: weather.data,
    } satisfies MainTravelQueryData,
    isError: ddayQuery.isError || results.slice(0, 5).some((query) => query.isError),
    isLoading: ddayQuery.isLoading || results.some((query) => query.isLoading),
  }
}
