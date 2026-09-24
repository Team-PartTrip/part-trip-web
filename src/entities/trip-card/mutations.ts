import { useMutation, useQueryClient, type QueryClient } from '@tanstack/react-query'

import {
  createTravelCardEntry,
  deleteTravelCardEntry,
  deleteTravelCards,
  updateTravelCardEntryComment,
  type TravelCardDeleteRequestDto,
  type TravelCardEntryCommentRequestDto,
  type TravelCardEntryRequestDto,
} from './api'
import { tripCardQueryKeys } from './query-keys'

function invalidateTripCardQueries(queryClient: QueryClient) {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: tripCardQueryKeys.all }),
  ])
}

export function useDeleteTravelCardsMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: TravelCardDeleteRequestDto) => deleteTravelCards(payload),
    onSuccess: () => invalidateTripCardQueries(queryClient),
  })
}

export function useCreateTravelCardEntryMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ cardId, payload }: { cardId: number; payload: TravelCardEntryRequestDto }) => createTravelCardEntry(cardId, payload),
    onSuccess: () => {
      void invalidateTripCardQueries(queryClient)
    },
  })
}

export function useDeleteTravelCardEntryMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ cardId, entryId }: { cardId: number; entryId: number }) => deleteTravelCardEntry(cardId, entryId),
    onSuccess: () => {
      void invalidateTripCardQueries(queryClient)
    },
  })
}

export function useUpdateTravelCardEntryCommentMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ cardId, entryId, payload }: { cardId: number; entryId: number; payload: TravelCardEntryCommentRequestDto }) => updateTravelCardEntryComment(cardId, entryId, payload),
    onSuccess: () => {
      void invalidateTripCardQueries(queryClient)
    },
  })
}
