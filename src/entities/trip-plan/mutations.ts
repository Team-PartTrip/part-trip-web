import { useMutation, useQueryClient } from '@tanstack/react-query'

import { deleteTrip } from './api'
import { tripPlanQueryKeys } from './query-keys'

export function useDeleteTripMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (tripId: number) => deleteTrip(tripId),
    onSuccess: (_result, tripId) => {
      queryClient.removeQueries({ queryKey: tripPlanQueryKeys.detail(tripId) })
      return queryClient.invalidateQueries({ queryKey: tripPlanQueryKeys.mine() })
    },
  })
}
