import { queryOptions, useQueries, useQuery } from '@tanstack/react-query'
import {
  getCountries,
  getCountryInfo,
  getDday,
  getFestivals,
  getPopularCities,
  getTourPlace,
  type CountryInfoResponseDto,
  type DdayResponseDto,
  type FestivalResponseDto,
  type TourPlaceResponseDto,
} from './api'
import { travelQueryKeys } from './query-keys'
import { getCalendarMonthsInRange, getDateRangeWithPadding, isDateInRange } from '@/shared/utils'

export const countriesQueryOptions = (keyword = '', enabled = true) =>
  queryOptions({
    queryKey: travelQueryKeys.countries(keyword),
    queryFn: () => getCountries(keyword),
    enabled,
    placeholderData: (previousData) => previousData,
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

export const popularCitiesQueryOptions = (limit = 8, enabled = true) =>
  queryOptions({
    queryKey: travelQueryKeys.popularCities(limit),
    queryFn: () => getPopularCities(limit),
    enabled,
  })

export function usePopularCitiesQuery(limit = 8, enabled = true) {
  return useQuery(popularCitiesQueryOptions(limit, enabled))
}

export function useDdayQuery(enabled = true) {
  return useQuery(ddayQueryOptions(enabled))
}

export function useFestivalsQuery(countryName?: string, year?: number, month?: number) {
  return useQuery(festivalsQueryOptions(countryName ?? '', year, month))
}

export function useTripFestivalsQuery(countryName?: string | null, startDate?: string | null, endDate?: string | null) {
  const dateRange = getDateRangeWithPadding(startDate, endDate)
  const months = getCalendarMonthsInRange(dateRange?.startDate, dateRange?.endDate)
  const queries = useQueries({
    queries: months.map(({ year, month }) => festivalsQueryOptions(countryName ?? '', year, month)),
  })
  const festivals = queries.flatMap((query) => query.data ?? [])

  return {
    data: festivals.filter((festival) => isDateInRange(festival?.startDate, dateRange?.startDate, dateRange?.endDate)),
    dateRange,
    isError: queries.some((query) => query.isError),
    isLoading: queries.some((query) => query.isLoading),
  }
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
