import { useMutation, useQueryClient } from '@tanstack/react-query'

import {
  createSharedTripComment,
  importTrip,
  shareTrip,
  type ShareTripRequestDto,
} from './api'
import { tripCardQueryKeys } from './query-keys'

export function useShareTripMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: ShareTripRequestDto) => shareTrip(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: tripCardQueryKeys.all }),
  })
}

export function useImportTripMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (tripId: number) => importTrip(tripId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: tripCardQueryKeys.all })
      return queryClient.invalidateQueries({ queryKey: ['trip-plans'] })
    },
  })
}

export function useCreateSharedTripCommentMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ tripId, payload }: { tripId: number; payload: { content?: string; parentCommentId?: number } }) =>
      createSharedTripComment(tripId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['community'] }),
  })
}
