import { useMutation, useQueryClient } from '@tanstack/react-query'

import {
  createSharedTripComment,
  createTravelCardEntry,
  deleteTravelCardEntry,
  deleteTravelCards,
  importTrip,
  shareTrip,
  updateTravelCardEntryComment,
  type TravelCardDeleteRequestDto,
  type TravelCardEntryCommentRequestDto,
  type TravelCardEntryRequestDto,
  type ShareTripRequestDto,
} from './api'
import { communityQueryKeys } from '@/entities/community/query-keys'
import { tripPlanQueryKeys } from '@/entities/trip-plan/query-keys'
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
      return queryClient.invalidateQueries({ queryKey: tripPlanQueryKeys.all })
    },
  })
}

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

export function useCreateSharedTripCommentMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ tripId, payload }: { tripId: number; payload: { content?: string; parentCommentId?: number } }) =>
      createSharedTripComment(tripId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: communityQueryKeys.all }),
  })
}
