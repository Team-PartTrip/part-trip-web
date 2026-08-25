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
import { getProfile } from '../user/api'
import { travelQueryKeys } from './query-keys'

const currencyByCountry: Record<string, string> = {
  베트남: 'VND',
  싱가포르: 'SGD',
  일본: 'JPY',
  태국: 'THB',
}

export const countriesQueryOptions = () =>
  queryOptions({
    queryKey: travelQueryKeys.countries(),
    queryFn: getCountries,
  })

export const ddayQueryOptions = () =>
  queryOptions({
    queryKey: travelQueryKeys.dday(),
    queryFn: getDday,
  })

export const festivalsQueryOptions = (countryName: string) =>
  queryOptions({
    queryKey: travelQueryKeys.festivals(countryName),
    queryFn: () => getFestivals(countryName),
    enabled: Boolean(countryName),
  })

export function useCountriesQuery() {
  return useQuery(countriesQueryOptions())
}

export function useDdayQuery() {
  return useQuery(ddayQueryOptions())
}

export function useFestivalsQuery(countryName?: string) {
  return useQuery(festivalsQueryOptions(countryName ?? ''))
}

export const tourPlacesQueryOptions = (countryName: string) =>
  queryOptions({
    queryKey: [...travelQueryKeys.all, 'tour-places', countryName] as const,
    queryFn: () => getTourPlace(countryName),
    enabled: Boolean(countryName),
  })

export function useTourPlacesQuery(countryName?: string) {
  return useQuery(tourPlacesQueryOptions(countryName ?? ''))
}

export type DestinationQueryData = {
  destinations: readonly Destination[]
  recentDestinations: readonly Destination[]
  travelPlanId?: number
  userId?: string
}

export async function getDestinationData(): Promise<DestinationQueryData> {
  const [countries, popularPlaces, profile, currentPlan] = await Promise.all([
    getCountries(),
    getPopularPlaces(),
    getProfile(),
    getDday().catch(() => undefined),
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
  const recentSearches = await getRecentSearches(profile.userId)

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
    userId: profile.userId,
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
  const countryName = ddayQuery.data?.countryName ?? '한국'
  const results = useQueries({
    queries: [
      { queryKey: [...travelQueryKeys.all, 'country', countryName], queryFn: () => getCountryInfo(countryName) },
      { queryKey: [...travelQueryKeys.all, 'population', countryName], queryFn: () => getPopulationInfo(countryName) },
      { queryKey: [...travelQueryKeys.all, 'tour-places', countryName], queryFn: () => getTourPlace(countryName) },
      { queryKey: [...travelQueryKeys.all, 'food', countryName], queryFn: () => getFoodInfo(countryName) },
      { queryKey: travelQueryKeys.festivals(countryName), queryFn: () => getFestivals(countryName) },
      { queryKey: [...travelQueryKeys.all, 'phrase', countryName], queryFn: () => getTodayPhrase(countryName, 1), retry: false },
      { queryKey: [...travelQueryKeys.all, 'weather', countryName], queryFn: () => getWeather(countryName), retry: false },
      { queryKey: [...travelQueryKeys.all, 'exchange-rate', countryName], queryFn: () => getExchangeRate(countryName), retry: false },
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
