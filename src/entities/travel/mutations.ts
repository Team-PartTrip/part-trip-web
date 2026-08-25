import { useMutation, useQueryClient } from '@tanstack/react-query'

import {
  changeTravelCountry,
  deleteRecentSearch,
  saveRecentSearch,
  saveTravelPlan,
  type RecentSearchRequestDto,
  type TravelChangeRequestDto,
  type TravelPlanRequestDto,
} from './api'
import { travelQueryKeys } from './query-keys'

export function useSaveTravelPlanMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: TravelPlanRequestDto) => saveTravelPlan(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: travelQueryKeys.all }),
  })
}

export function useChangeTravelCountryMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: TravelChangeRequestDto) => changeTravelCountry(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: travelQueryKeys.all }),
  })
}

export function useSaveRecentSearchMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: RecentSearchRequestDto) => saveRecentSearch(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: travelQueryKeys.destinationSelector() }),
  })
}

export function useDeleteRecentSearchMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (recentSearchId: number) => deleteRecentSearch(recentSearchId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: travelQueryKeys.destinationSelector() }),
  })
}
