import { useMutation, useQueryClient } from '@tanstack/react-query'

import {
  castBallot,
  acceptPlannerInvitation,
  addPlannerPlaces,
  addVoteOption,
  cancelPlannerInvitation,
  closeVote,
  confirmPlanner,
  confirmVote,
  createPlanner,
  createVote,
  deletePlanner,
  deleteVoteOption,
  joinPlanner,
  remindPlannerMembers,
  rejectPlannerInvitation,
  removePlannerMember,
  selectRandomPlannerPlace,
  updatePlanner,
  type CreatePlannerRequestDto,
  type CreateVoteRequestDto,
  type JoinPlannerRequestDto,
  type PlannerCartRequestDto,
  type SavePlannerTravelPlanRequestDto,
  type VoteBallotRequestDto,
  type VoteConfirmRequestDto,
  type VoteOptionCreateRequestDto,
} from './api'
import { plannerQueryKeys } from './query-keys'

export function useCreatePlannerMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreatePlannerRequestDto) => createPlanner(payload),
    onSuccess: () => { void queryClient.invalidateQueries({ queryKey: plannerQueryKeys.all }) },
  })
}

export function useJoinPlannerMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: JoinPlannerRequestDto) => joinPlanner(payload),
    onSuccess: () => { void queryClient.invalidateQueries({ queryKey: plannerQueryKeys.all }) },
  })
}

export function useUpdatePlannerMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ plannerId, payload }: { plannerId: number; payload: SavePlannerTravelPlanRequestDto }) => updatePlanner(plannerId, payload),
    onSuccess: () => { void queryClient.invalidateQueries({ queryKey: plannerQueryKeys.all }) },
  })
}

export function useCastBallotMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ plannerId, voteId, payload }: { plannerId: number; voteId: number; payload: VoteBallotRequestDto }) =>
      castBallot(plannerId, voteId, payload),
    onSuccess: () => { void queryClient.invalidateQueries({ queryKey: plannerQueryKeys.all }) },
  })
}

export function useCloseVoteMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ plannerId, voteId }: { plannerId: number; voteId: number }) =>
      closeVote(plannerId, voteId),
    onSuccess: () => { void queryClient.invalidateQueries({ queryKey: plannerQueryKeys.all }) },
  })
}

export function useConfirmVoteMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ plannerId, voteId, payload }: { plannerId: number; voteId: number; payload: VoteConfirmRequestDto }) =>
      confirmVote(plannerId, voteId, payload),
    onSuccess: () => { void queryClient.invalidateQueries({ queryKey: plannerQueryKeys.all }) },
  })
}

export function useAddPlannerPlacesMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ plannerId, payload }: { plannerId: number; payload: PlannerCartRequestDto }) => addPlannerPlaces(plannerId, payload),
    onSuccess: () => { void queryClient.invalidateQueries({ queryKey: plannerQueryKeys.all }) },
  })
}

export function useSelectRandomPlannerPlaceMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (plannerId: number) => selectRandomPlannerPlace(plannerId),
    onSuccess: () => { void queryClient.invalidateQueries({ queryKey: plannerQueryKeys.all }) },
  })
}

export function useConfirmPlannerMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (plannerId: number) => confirmPlanner(plannerId),
    onSuccess: () => { void queryClient.invalidateQueries({ queryKey: plannerQueryKeys.all }) },
  })
}

export function useRemindPlannerMembersMutation() {
  return useMutation({ mutationFn: (plannerId: number) => remindPlannerMembers(plannerId) })
}

export function useDeleteVoteOptionMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ plannerId, voteId, optionId }: { plannerId: number; voteId: number; optionId: number }) => deleteVoteOption(plannerId, voteId, optionId),
    onSuccess: () => { void queryClient.invalidateQueries({ queryKey: plannerQueryKeys.all }) },
  })
}

export function useAddVoteOptionMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ plannerId, voteId, payload }: { plannerId: number; voteId: number; payload: VoteOptionCreateRequestDto }) =>
      addVoteOption(plannerId, voteId, payload),
    onSuccess: () => { void queryClient.invalidateQueries({ queryKey: plannerQueryKeys.all }) },
  })
}

export function useCreateVoteMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ plannerId, payload }: { plannerId: number; payload: CreateVoteRequestDto }) =>
      createVote(plannerId, payload),
    onSuccess: () => { void queryClient.invalidateQueries({ queryKey: plannerQueryKeys.all }) },
  })
}

export function useDeletePlannerMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (plannerId: number) => deletePlanner(plannerId),
    onSuccess: () => { void queryClient.invalidateQueries({ queryKey: plannerQueryKeys.all }) },
  })
}

export function useAcceptPlannerInvitationMutation() {
  const queryClient = useQueryClient()
  return useMutation({ mutationFn: (invitationId: number) => acceptPlannerInvitation(invitationId), onSuccess: () => { void queryClient.invalidateQueries({ queryKey: plannerQueryKeys.all }) } })
}

export function useRejectPlannerInvitationMutation() {
  const queryClient = useQueryClient()
  return useMutation({ mutationFn: (invitationId: number) => rejectPlannerInvitation(invitationId), onSuccess: () => { void queryClient.invalidateQueries({ queryKey: plannerQueryKeys.all }) } })
}

export function useCancelPlannerInvitationMutation() {
  const queryClient = useQueryClient()
  return useMutation({ mutationFn: ({ plannerId, invitationId }: { plannerId: number; invitationId: number }) => cancelPlannerInvitation(plannerId, invitationId), onSuccess: () => { void queryClient.invalidateQueries({ queryKey: plannerQueryKeys.all }) } })
}

export function useRemovePlannerMemberMutation() {
  const queryClient = useQueryClient()
  return useMutation({ mutationFn: ({ plannerId, memberUserId }: { plannerId: number; memberUserId: string }) => removePlannerMember(plannerId, memberUserId), onSuccess: () => { void queryClient.invalidateQueries({ queryKey: plannerQueryKeys.all }) } })
}
