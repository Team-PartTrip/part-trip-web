import { infiniteQueryOptions, queryOptions, useInfiniteQuery, useQuery } from '@tanstack/react-query'
import {
  getDday,
  getFestivals,
  getMoreTourPlaces,
  searchPlaces,
  getTourPlace,
  getTourPlaceAccessibility,
  type DdayResponseDto,
  type TourPlaceResponseDto,
} from './api'
import { travelQueryKeys } from './query-keys'

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

export function usePlaceSearchQuery(keyword: string, enabled = true) {
  return useQuery(queryOptions({
    queryKey: travelQueryKeys.places(keyword),
    queryFn: () => searchPlaces(keyword),
    enabled: enabled && Boolean(keyword.trim()),
    retry: false,
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

export function useTourPlaceAccessibilityQuery(tourPlaceId: number, enabled = true) {
  return useQuery({
    queryKey: travelQueryKeys.tourPlaceAccessibility(tourPlaceId),
    queryFn: () => getTourPlaceAccessibility(tourPlaceId),
    enabled: enabled && Number.isSafeInteger(tourPlaceId) && tourPlaceId > 0,
  })
}

type MainTravelQueryData = {
  plan?: DdayResponseDto
  tourPlaces: TourPlaceResponseDto[]
}

export function useMainTravelQuery() {
  const ddayQuery = useDdayQuery()
  const cityName = ddayQuery.data?.cityName?.trim() || ddayQuery.data?.regionName?.trim()
  const countryName = cityName ? '대한민국' : ''
  const hasCountry = Boolean(countryName)
    && (ddayQuery.data?.status === 'BEFORE' || ddayQuery.data?.status === 'DURING')
  const tourPlaces = useQuery(tourPlacesQueryOptions(countryName, cityName, undefined, hasCountry))

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
