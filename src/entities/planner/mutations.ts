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

type QueryKey = readonly unknown[]

function usePlannerMutation<TData, TVariables>(
  mutationFn: MutationFunction<TData, TVariables>,
  getQueryKeys: (data: TData, variables: TVariables) => QueryKey[],
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn,
    onSuccess: (data, variables) => Promise.all(
      getQueryKeys(data, variables).map((queryKey) => queryClient.invalidateQueries({ queryKey })),
    ),
  })
}

export function useCreatePlannerMutation() {
  return usePlannerMutation((payload: CreatePlannerRequestDto) => createPlanner(payload), () => [plannerQueryKeys.list()])
}

export function useGeneratePlannerMutation() {
  return usePlannerMutation((payload: GeneratePlannerRequestDto) => generatePlanner(payload), (schedule) => [
    plannerQueryKeys.list(),
    ...(schedule.plannerId ? [plannerQueryKeys.detail(schedule.plannerId), plannerQueryKeys.schedule(schedule.plannerId)] : []),
  ])
}

export function useJoinPlannerMutation() {
  return usePlannerMutation((payload: JoinPlannerRequestDto) => joinPlanner(payload), (planner) => [
    plannerQueryKeys.list(),
    ...(planner.plannerId ? [plannerQueryKeys.detail(planner.plannerId), plannerQueryKeys.members(planner.plannerId)] : []),
  ])
}

export function useConfirmPlannerMutation() {
  return usePlannerMutation((plannerId: number) => confirmPlanner(plannerId), (_result, plannerId) => [
    plannerQueryKeys.list(),
    plannerQueryKeys.detail(plannerId),
    plannerQueryKeys.schedule(plannerId),
  ])
}

export function useSavePlannerScheduleMutation() {
  return usePlannerMutation(({ plannerId, payload }: { plannerId: number; payload: SavePlannerScheduleRequestDto }) =>
    savePlannerSchedule(plannerId, payload),
  (_schedule, { plannerId }) => [plannerQueryKeys.schedule(plannerId)],
  )
}

export function useAcceptPlannerInvitationMutation() {
  return usePlannerMutation((invitationId: number) => acceptPlannerInvitation(invitationId), (invitation) => [
    plannerQueryKeys.invitations(),
    plannerQueryKeys.list(),
    ...(invitation.plannerId ? [plannerQueryKeys.detail(invitation.plannerId), plannerQueryKeys.members(invitation.plannerId)] : []),
  ])
}

export function useRejectPlannerInvitationMutation() {
  return usePlannerMutation((invitationId: number) => rejectPlannerInvitation(invitationId), (invitation) => [
    plannerQueryKeys.invitations(),
    plannerQueryKeys.list(),
    ...(invitation.plannerId ? [plannerQueryKeys.detail(invitation.plannerId)] : []),
  ])
}

export function useCancelPlannerInvitationMutation() {
  return usePlannerMutation(
    ({ plannerId, invitationId }: { plannerId: number; invitationId: number }) =>
      cancelPlannerInvitation(plannerId, invitationId),
    (_result, { plannerId }) => [
      plannerQueryKeys.invitations(),
      plannerQueryKeys.list(),
      plannerQueryKeys.detail(plannerId),
      plannerQueryKeys.members(plannerId),
    ],
  )
}

export function useRemovePlannerMemberMutation() {
  return usePlannerMutation(
    ({ plannerId, memberUserId }: { plannerId: number; memberUserId: string }) =>
      removePlannerMember(plannerId, memberUserId),
    (_result, { plannerId }) => [
      plannerQueryKeys.list(),
      plannerQueryKeys.detail(plannerId),
      plannerQueryKeys.members(plannerId),
    ],
  )
}
