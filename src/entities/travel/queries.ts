import { queryOptions, useQueries, useQuery } from '@tanstack/react-query'
import {
  getCountries,
  getCountryInfo,
  getDday,
  getExchangeRate,
  getFestivals,
  getFoodInfo,
  getPopulationInfo,
  getTodayPhrase,
  getTourPlace,
  getWeather,
  type CountryInfoResponseDto,
  type DdayResponseDto,
  type ExchangeRateResponseDto,
  type FestivalResponseDto,
  type FoodInfoResponseDto,
  type PopulationInfoResponseDto,
  type TodayPhraseResponseDto,
  type TourPlaceResponseDto,
  type WeatherResponseDto,
} from './api'
import { travelQueryKeys } from './query-keys'

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
