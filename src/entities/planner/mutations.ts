import {
  useMutation,
  useQueryClient,
  type MutationFunction,
} from '@tanstack/react-query'

import {
  acceptPlannerInvitation,
  cancelPlannerInvitation,
  confirmPlanner,
  createPlanner,
  generatePlanner,
  joinPlanner,
  rejectPlannerInvitation,
  removePlannerMember,
  savePlannerSchedule,
  type CreatePlannerRequestDto,
  type GeneratePlannerRequestDto,
  type JoinPlannerRequestDto,
  type SavePlannerScheduleRequestDto,
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

export function useGeneratePlannerMutation() {
  return usePlannerMutation((payload: GeneratePlannerRequestDto) => generatePlanner(payload))
}

export function useJoinPlannerMutation() {
  return usePlannerMutation((payload: JoinPlannerRequestDto) => joinPlanner(payload))
}

export function useConfirmPlannerMutation() {
  return usePlannerMutation((plannerId: number) => confirmPlanner(plannerId))
}

export function useSavePlannerScheduleMutation() {
  return usePlannerMutation(({ plannerId, payload }: { plannerId: number; payload: SavePlannerScheduleRequestDto }) =>
    savePlannerSchedule(plannerId, payload),
  )
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
