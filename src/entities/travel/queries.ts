import { infiniteQueryOptions, queryOptions, useInfiniteQuery, useQuery } from '@tanstack/react-query'
import {
  getCountries,
  getDday,
  getFestivals,
  getMoreTourPlaces,
  getPopularCities,
  searchCities,
  getTourPlace,
  type DdayResponseDto,
  type TourPlaceResponseDto,
} from './api'
import { travelQueryKeys } from './query-keys'

const countriesQueryOptions = (keyword = '', enabled = true) =>
  queryOptions({
    queryKey: travelQueryKeys.countries(keyword),
    queryFn: () => getCountries(keyword),
    enabled,
    placeholderData: (previousData) => previousData,
  })

const ddayQueryOptions = (enabled = true) =>
  queryOptions({
    queryKey: travelQueryKeys.dday(),
    queryFn: getDday,
    enabled,
  })

const festivalsQueryOptions = (countryName: string, year?: number, month?: number) =>
  queryOptions({
    queryKey: travelQueryKeys.festivals(countryName, year, month),
    queryFn: () => getFestivals(countryName, year, month),
    enabled: Boolean(countryName),
  })

export function useCountriesQuery(keyword = '', enabled = true) {
  return useQuery(countriesQueryOptions(keyword, enabled))
}

export function useCitySearchQuery(countryName: string, keyword: string, enabled = true) {
  return useQuery(queryOptions({
    queryKey: travelQueryKeys.cities(countryName, keyword),
    queryFn: () => searchCities(countryName, keyword),
    enabled: enabled && Boolean(countryName && keyword.trim()),
  }))
}

export function usePopularCitiesQuery(limit: number, enabled = true) {
  return useQuery(queryOptions({
    queryKey: travelQueryKeys.popularCities(limit),
    queryFn: () => getPopularCities(limit),
    enabled,
  }))
}

export function useDdayQuery(enabled = true) {
  return useQuery(ddayQueryOptions(enabled))
}

export function useFestivalMonthQuery(countryName: string | null | undefined, year: number, month: number) {
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

export const moreTourPlacesQueryOptions = (
  countryName: string,
  cityName: string,
  category: string,
  enabled = true,
) =>
  infiniteQueryOptions({
    queryKey: travelQueryKeys.moreTourPlaces(countryName, cityName, category),
    queryFn: ({ pageParam }) => getMoreTourPlaces(countryName, cityName, category, pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.cursor || undefined,
    enabled: enabled && Boolean(countryName && cityName && category),
  })

export function useMoreTourPlacesQuery(
  countryName?: string,
  cityName?: string,
  category?: string,
  enabled = true,
) {
  return useInfiniteQuery(moreTourPlacesQueryOptions(countryName ?? '', cityName ?? '', category ?? '', enabled))
}

type MainTravelQueryData = {
  plan?: DdayResponseDto
  tourPlaces: TourPlaceResponseDto[]
}

export function useMainTravelQuery() {
  const ddayQuery = useDdayQuery()
  const countryName = ddayQuery.data?.countryName ?? ''
  const hasCountry = Boolean(countryName)
    && (ddayQuery.data?.status === 'BEFORE' || ddayQuery.data?.status === 'DURING')
  const tourPlaces = useQuery(tourPlacesQueryOptions(countryName, undefined, undefined, hasCountry))

  return {
    data: {
      plan: ddayQuery.data,
      tourPlaces: tourPlaces.data ?? [],
    } satisfies MainTravelQueryData,
    isError: ddayQuery.isError,
    isRecommendationsError: tourPlaces.isError,
    isLoading: ddayQuery.isLoading,
    isRecommendationsLoading: tourPlaces.isLoading,
  }
}
