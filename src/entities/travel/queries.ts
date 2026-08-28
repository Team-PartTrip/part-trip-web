import { queryOptions, useQueries, useQuery } from '@tanstack/react-query'
import {
  getCountries,
  getCountryInfo,
  getDday,
  getFestivals,
  getPopularPlaces,
  getRecentSearches,
  getTourPlace,
  type CountryInfoResponseDto,
  type DdayResponseDto,
  type Destination,
  type FestivalResponseDto,
  type TourPlaceResponseDto,
} from './api'
import { travelQueryKeys } from './query-keys'

const currencyByCountry: Record<string, string> = {
  베트남: 'VND',
  싱가포르: 'SGD',
  일본: 'JPY',
  태국: 'THB',
}

export const countriesQueryOptions = (keyword = '', enabled = true) =>
  queryOptions({
    queryKey: travelQueryKeys.countries(keyword),
    queryFn: () => getCountries(keyword),
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

export function useCountriesQuery(keywordOrEnabled: string | boolean = '', enabled = true) {
  const keyword = typeof keywordOrEnabled === 'string' ? keywordOrEnabled : ''
  const isEnabled = typeof keywordOrEnabled === 'boolean' ? keywordOrEnabled : enabled
  return useQuery(countriesQueryOptions(keyword, isEnabled))
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
  festivals: FestivalResponseDto[]
  plan?: DdayResponseDto
  tourPlaces: TourPlaceResponseDto[]
}

export function useMainTravelQuery() {
  const ddayQuery = useDdayQuery()
  const countryName = ddayQuery.data?.countryName ?? ''
  const hasCountry = Boolean(countryName)
  const results = useQueries({
    queries: [
      { queryKey: travelQueryKeys.country(countryName), queryFn: () => getCountryInfo(countryName), enabled: hasCountry },
      { queryKey: travelQueryKeys.tourPlaces(countryName), queryFn: () => getTourPlace(countryName), enabled: hasCountry },
      { queryKey: travelQueryKeys.festivals(countryName), queryFn: () => getFestivals(countryName), enabled: hasCountry },
    ],
  })
  const [country, tourPlaces, festivals] = results

  return {
    data: {
      country: country.data,
      festivals: festivals.data ?? [],
      plan: ddayQuery.data,
      tourPlaces: tourPlaces.data ?? [],
    } satisfies MainTravelQueryData,
    isError: ddayQuery.isError || results.some((query) => query.isError),
    isLoading: ddayQuery.isLoading || results.some((query) => query.isLoading),
  }
}
