import { useMutation, useQueryClient } from '@tanstack/react-query'

import {
  createTravelCardEntry,
  deleteTravelCardEntry,
  deleteTravelCards,
  updateTravelCardEntryComment,
  type TravelCardDeleteRequestDto,
  type TravelCardEntryCommentRequestDto,
  type TravelCardEntryRequestDto,
} from './api'
import { tripPlanQueryKeys } from '@/entities/trip-plan/query-keys'
import { tripCardQueryKeys } from './query-keys'

export function useDeleteTravelCardsMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: TravelCardDeleteRequestDto) => deleteTravelCards(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: tripCardQueryKeys.all })
      void queryClient.invalidateQueries({ queryKey: tripPlanQueryKeys.all })
    },
  })
}

export function useCreateTravelCardEntryMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ cardId, payload }: { cardId: number; payload: TravelCardEntryRequestDto }) => createTravelCardEntry(cardId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: tripCardQueryKeys.all })
      void queryClient.invalidateQueries({ queryKey: tripPlanQueryKeys.all })
    },
  })
}

export function useDeleteTravelCardEntryMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ cardId, entryId }: { cardId: number; entryId: number }) => deleteTravelCardEntry(cardId, entryId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: tripCardQueryKeys.all })
      void queryClient.invalidateQueries({ queryKey: tripPlanQueryKeys.all })
    },
  })
}

export function useUpdateTravelCardEntryCommentMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ cardId, entryId, payload }: { cardId: number; entryId: number; payload: TravelCardEntryCommentRequestDto }) => updateTravelCardEntryComment(cardId, entryId, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: tripCardQueryKeys.all })
      void queryClient.invalidateQueries({ queryKey: tripPlanQueryKeys.all })
    },
  })
}
