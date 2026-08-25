import { useMutation, useQueryClient } from '@tanstack/react-query'

import { saveTravelPlan, type TravelPlanRequestDto } from './api'
import { travelQueryKeys } from './query-keys'

export function useSaveTravelPlanMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: TravelPlanRequestDto) => saveTravelPlan(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: travelQueryKeys.all }),
  })
}
