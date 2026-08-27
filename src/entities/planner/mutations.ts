import { useMutation, useQueryClient } from '@tanstack/react-query'

import {
  castBallot,
  closeVote,
  confirmVote,
  createPlanner,
  createVote,
  joinPlanner,
  savePlannerTravelPlan,
  type CreatePlannerRequestDto,
  type CreateVoteRequestDto,
  type JoinPlannerRequestDto,
  type SavePlannerTravelPlanRequestDto,
  type VoteBallotRequestDto,
  type VoteConfirmRequestDto,
} from './api'
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

export function useSavePlannerTravelPlanMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ plannerId, payload }: { plannerId: number; payload: SavePlannerTravelPlanRequestDto }) =>
      savePlannerTravelPlan(plannerId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: plannerQueryKeys.all }),
  })
}

export function useCastBallotMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ plannerId, voteId, payload }: { plannerId: number; voteId: number; payload: VoteBallotRequestDto }) =>
      castBallot(plannerId, voteId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: plannerQueryKeys.all }),
  })
}

export function useCloseVoteMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ plannerId, voteId }: { plannerId: number; voteId: number }) =>
      closeVote(plannerId, voteId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: plannerQueryKeys.all }),
  })
}

export function useConfirmVoteMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ plannerId, voteId, payload }: { plannerId: number; voteId: number; payload: VoteConfirmRequestDto }) =>
      confirmVote(plannerId, voteId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: plannerQueryKeys.all }),
  })
}
