import { queryOptions, useQuery } from '@tanstack/react-query'

import {
  getMyPlannerInvitations,
  getMyPlanners,
  getPlannerBlocks,
  getPlannerDetail,
  getPlannerMembers,
  getPlannerSchedule,
} from './api'
import { plannerQueryKeys } from './query-keys'

const isPositiveInteger = (value: number) => Number.isInteger(value) && value > 0

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
    enabled: enabled && isPositiveInteger(plannerId),
  })

export function usePlannerDetailQuery(plannerId: number, enabled = true) {
  return useQuery(plannerDetailQueryOptions(plannerId, enabled))
}

export const plannerMembersQueryOptions = (plannerId: number, enabled = true) =>
  queryOptions({
    queryKey: plannerQueryKeys.members(plannerId),
    queryFn: () => getPlannerMembers(plannerId),
    enabled: enabled && isPositiveInteger(plannerId),
  })

export function usePlannerMembersQuery(plannerId: number, enabled = true) {
  return useQuery(plannerMembersQueryOptions(plannerId, enabled))
}

export const plannerScheduleQueryOptions = (plannerId: number, enabled = true) =>
  queryOptions({
    queryKey: plannerQueryKeys.schedule(plannerId),
    queryFn: () => getPlannerSchedule(plannerId),
    enabled: enabled && isPositiveInteger(plannerId),
  })

export function usePlannerScheduleQuery(plannerId: number, enabled = true) {
  return useQuery(plannerScheduleQueryOptions(plannerId, enabled))
}
