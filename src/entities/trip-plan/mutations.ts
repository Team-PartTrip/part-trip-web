import { useMutation, useQueryClient } from '@tanstack/react-query'

import { createTrip, deleteTrip, updateTrip, type TripPlanRequestDto } from './api'
import { tripPlanQueryKeys } from './query-keys'

export function useCreateTripMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: TripPlanRequestDto) => createTrip(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: tripPlanQueryKeys.all }),
  })
}

export function useUpdateTripMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ tripId, payload }: { tripId: number; payload: TripPlanRequestDto }) =>
      updateTrip(tripId, payload),
    onSuccess: (updated, { tripId }) => {
      queryClient.setQueryData(tripPlanQueryKeys.detail(tripId), updated)
      return queryClient.invalidateQueries({ queryKey: tripPlanQueryKeys.mine() })
    },
  })
}

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
