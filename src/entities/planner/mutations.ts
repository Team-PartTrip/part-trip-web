import {
  useMutation,
  useQueryClient,
  type MutationFunction,
} from '@tanstack/react-query'

import {
  castBallot,
  cancelPlaceVote,
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

function usePlannerMutation<TData, TVariables>(
  mutationFn: MutationFunction<TData, TVariables>,
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: plannerQueryKeys.all })
    },
  })
}

export function useCreatePlannerMutation() {
  return usePlannerMutation((payload: CreatePlannerRequestDto) => createPlanner(payload))
}

export function useJoinPlannerMutation() {
  return usePlannerMutation((payload: JoinPlannerRequestDto) => joinPlanner(payload))
}

export function useUpdatePlannerMutation() {
  return usePlannerMutation(
    ({ plannerId, payload }: { plannerId: number; payload: SavePlannerTravelPlanRequestDto }) =>
      updatePlanner(plannerId, payload),
  )
}

export function useCastBallotMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ plannerId, voteId, payload }: { plannerId: number; voteId: number; payload: VoteBallotRequestDto }) =>
      castBallot(plannerId, voteId, payload),
    onSuccess: (_data, { plannerId }) => {
      void queryClient.invalidateQueries({ queryKey: plannerQueryKeys.votes(plannerId) })
    },
  })
}

export function useCancelPlaceVoteMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ plannerId, tourPlaceId }: { plannerId: number; tourPlaceId: number }) =>
      cancelPlaceVote(plannerId, tourPlaceId),
    onSuccess: (_data, { plannerId }) => {
      void queryClient.invalidateQueries({ queryKey: plannerQueryKeys.votes(plannerId) })
    },
  })
}

export function useCloseVoteMutation() {
  return usePlannerMutation(
    ({ plannerId, voteId }: { plannerId: number; voteId: number }) =>
      closeVote(plannerId, voteId),
  )
}

export function useConfirmVoteMutation() {
  return usePlannerMutation(
    ({ plannerId, voteId, payload }: { plannerId: number; voteId: number; payload: VoteConfirmRequestDto }) =>
      confirmVote(plannerId, voteId, payload),
  )
}

export function useAddPlannerPlacesMutation() {
  return usePlannerMutation(
    ({ plannerId, payload }: { plannerId: number; payload: PlannerCartRequestDto }) =>
      addPlannerPlaces(plannerId, payload),
  )
}

export function useSelectRandomPlannerPlaceMutation() {
  return usePlannerMutation((plannerId: number) => selectRandomPlannerPlace(plannerId))
}

export function useConfirmPlannerMutation() {
  return usePlannerMutation((plannerId: number) => confirmPlanner(plannerId))
}

export function useRemindPlannerMembersMutation() {
  return useMutation({ mutationFn: (plannerId: number) => remindPlannerMembers(plannerId) })
}

export function useDeleteVoteOptionMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ plannerId, voteId, optionId }: { plannerId: number; voteId: number; optionId: number }) =>
      deleteVoteOption(plannerId, voteId, optionId),
    onSuccess: (_data, { plannerId }) => {
      void queryClient.invalidateQueries({ queryKey: plannerQueryKeys.votes(plannerId) })
    },
  })
}

export function useAddVoteOptionMutation() {
  return usePlannerMutation(
    ({ plannerId, voteId, payload }: { plannerId: number; voteId: number; payload: VoteOptionCreateRequestDto }) =>
      addVoteOption(plannerId, voteId, payload),
  )
}

export function useCreateVoteMutation() {
  return usePlannerMutation(
    ({ plannerId, payload }: { plannerId: number; payload: CreateVoteRequestDto }) =>
      createVote(plannerId, payload),
  )
}

export function useDeletePlannerMutation() {
  return usePlannerMutation((plannerId: number) => deletePlanner(plannerId))
}

export function useAcceptPlannerInvitationMutation() {
  return usePlannerMutation((invitationId: number) => acceptPlannerInvitation(invitationId))
}

export function useRejectPlannerInvitationMutation() {
  return usePlannerMutation((invitationId: number) => rejectPlannerInvitation(invitationId))
}

export function useCancelPlannerInvitationMutation() {
  return usePlannerMutation(
    ({ plannerId, invitationId }: { plannerId: number; invitationId: number }) =>
      cancelPlannerInvitation(plannerId, invitationId),
  )
}

export function useRemovePlannerMemberMutation() {
  return usePlannerMutation(
    ({ plannerId, memberUserId }: { plannerId: number; memberUserId: string }) =>
      removePlannerMember(plannerId, memberUserId),
  )
}
