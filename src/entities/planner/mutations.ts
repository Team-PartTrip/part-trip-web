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
  regeneratePlanner,
  type CreatePlannerRequestDto,
  type GeneratePlannerRequestDto,
  type JoinPlannerRequestDto,
  type SavePlannerScheduleRequestDto,
} from './api'
import type { PlannerScheduleResponseDto } from './types'
import { tripCardQueryKeys } from '../trip-card/query-keys'
import { travelQueryKeys } from '../travel/query-keys'
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
  return useGeneratedScheduleMutation((payload: GeneratePlannerRequestDto) => generatePlanner(payload))
}

function useGeneratedScheduleMutation<T>(mutationFn: MutationFunction<PlannerScheduleResponseDto, T>) {
  const client = useQueryClient()
  return useMutation({ mutationFn, onSuccess: async schedule => {
    if (schedule.plannerId) {
      await client.cancelQueries({ queryKey: plannerQueryKeys.schedule(schedule.plannerId) })
      client.setQueryData(plannerQueryKeys.schedule(schedule.plannerId), schedule)
      // GET schedule returns an empty warnings list; keep generation warnings through route polling.
      client.setQueryData(plannerQueryKeys.warnings(schedule.plannerId), schedule.warnings ?? [])
      await client.invalidateQueries({ queryKey: plannerQueryKeys.detail(schedule.plannerId) })
    }
    await client.invalidateQueries({ queryKey: plannerQueryKeys.list() })
  } })
}

export function useRegeneratePlannerMutation() {
  return useGeneratedScheduleMutation((plannerId: number) => regeneratePlanner(plannerId))
}

export function useJoinPlannerMutation() {
  return usePlannerMutation((payload: JoinPlannerRequestDto) => joinPlanner(payload), (planner) => [
    plannerQueryKeys.list(),
    tripCardQueryKeys.all,
    travelQueryKeys.dday(),
    ...(planner.plannerId ? [plannerQueryKeys.detail(planner.plannerId), plannerQueryKeys.members(planner.plannerId)] : []),
  ])
}

export function useConfirmPlannerMutation() {
  return usePlannerMutation((plannerId: number) => confirmPlanner(plannerId), (_result, plannerId) => [
    plannerQueryKeys.list(),
    tripCardQueryKeys.all,
    travelQueryKeys.dday(),
    plannerQueryKeys.detail(plannerId),
    plannerQueryKeys.schedule(plannerId),
  ])
}

export function useSavePlannerScheduleMutation() {
  const client = useQueryClient()
  return usePlannerMutation(({ plannerId, payload }: { plannerId: number; payload: SavePlannerScheduleRequestDto }) =>
    savePlannerSchedule(plannerId, payload).then(schedule => {
      client.setQueryData(plannerQueryKeys.warnings(plannerId), [])
      return schedule
    }),
  (_schedule, { plannerId }) => [plannerQueryKeys.schedule(plannerId)],
  )
}

export function useAcceptPlannerInvitationMutation() {
  return usePlannerMutation((invitationId: number) => acceptPlannerInvitation(invitationId), (invitation) => [
    plannerQueryKeys.invitations(),
    tripCardQueryKeys.all,
    travelQueryKeys.dday(),
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
      tripCardQueryKeys.all,
      travelQueryKeys.dday(),
      plannerQueryKeys.detail(plannerId),
      plannerQueryKeys.members(plannerId),
    ],
  )
}
