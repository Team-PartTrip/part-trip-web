import { queryOptions, useQuery } from '@tanstack/react-query'

import {
  getMyPlannerInvitations,
  getMyPlanners,
  getPlannerBlocks,
  getPlannerDetail,
  getPlannerMembers,
  getPlannerSchedule,
  getPlannerScheduleCandidates,
} from './api'
import { isPositiveSafeInteger } from '@/shared/utils'
import { plannerQueryKeys } from './query-keys'

export const myPlannersQueryOptions = (enabled = true) =>
  queryOptions({ queryKey: plannerQueryKeys.list(), queryFn: getMyPlanners, enabled })

export function useMyPlannersQuery(enabled = true) {
  return useQuery(myPlannersQueryOptions(enabled))
}

export const plannerBlocksQueryOptions = (enabled = true) =>
  queryOptions({ queryKey: plannerQueryKeys.blocks(), queryFn: getPlannerBlocks, enabled })

export function usePlannerBlocksQuery(enabled = true) {
  return useQuery(plannerBlocksQueryOptions(enabled))
}

export const plannerInvitationsQueryOptions = (enabled = true) =>
  queryOptions({ queryKey: plannerQueryKeys.invitations(), queryFn: getMyPlannerInvitations, enabled })

export function usePlannerInvitationsQuery(enabled = true) {
  return useQuery(plannerInvitationsQueryOptions(enabled))
}

export const plannerDetailQueryOptions = (plannerId: number, enabled = true) =>
  queryOptions({
    queryKey: plannerQueryKeys.detail(plannerId),
    queryFn: () => getPlannerDetail(plannerId),
    enabled: enabled && isPositiveSafeInteger(plannerId),
  })

export function usePlannerDetailQuery(plannerId: number, enabled = true) {
  return useQuery(plannerDetailQueryOptions(plannerId, enabled))
}

export const plannerMembersQueryOptions = (plannerId: number, enabled = true) =>
  queryOptions({
    queryKey: plannerQueryKeys.members(plannerId),
    queryFn: () => getPlannerMembers(plannerId),
    enabled: enabled && isPositiveSafeInteger(plannerId),
  })

export function usePlannerMembersQuery(plannerId: number, enabled = true) {
  return useQuery(plannerMembersQueryOptions(plannerId, enabled))
}

export const plannerScheduleQueryOptions = (plannerId: number, enabled = true) =>
  queryOptions({
    queryKey: plannerQueryKeys.schedule(plannerId),
    queryFn: () => getPlannerSchedule(plannerId),
    enabled: enabled && isPositiveSafeInteger(plannerId),
  })

export function usePlannerScheduleQuery(plannerId: number, enabled = true) {
  return useQuery(plannerScheduleQueryOptions(plannerId, enabled))
}

export function usePlannerScheduleCandidatesQuery(plannerId: number, date: string, query: string, enabled = true) {
  return useQuery({
    queryKey: plannerQueryKeys.scheduleCandidates(plannerId, date, query),
    queryFn: () => getPlannerScheduleCandidates(plannerId, date, query),
    enabled: enabled && isPositiveSafeInteger(plannerId) && Boolean(date),
  })
}
