import { useMutation, useQueryClient } from '@tanstack/react-query'

import { createPlanner, createVote, joinPlanner, type CreatePlannerRequestDto, type CreateVoteRequestDto, type JoinPlannerRequestDto } from './api'
import { plannerQueryKeys } from './query-keys'

export function useCreatePlannerMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreatePlannerRequestDto) => createPlanner(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: plannerQueryKeys.all }),
  })
}

export function useJoinPlannerMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: JoinPlannerRequestDto) => joinPlanner(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: plannerQueryKeys.all }),
  })
}

export function useCreateVoteMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ plannerId, payload }: { plannerId: number; payload: CreateVoteRequestDto }) => createVote(plannerId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: plannerQueryKeys.all }),
  })
}
