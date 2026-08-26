import { queryOptions, useQuery } from '@tanstack/react-query'

import { getMyPlanners, getPlannerDetail, getPlannerMembers } from './api'
import { plannerQueryKeys } from './query-keys'

export const myPlannersQueryOptions = (enabled = true) =>
  queryOptions({
    queryKey: plannerQueryKeys.list(),
    queryFn: getMyPlanners,
    enabled,
  })

export function useMyPlannersQuery(enabled = true) {
  return useQuery(myPlannersQueryOptions(enabled))
}

export const plannerDetailQueryOptions = (plannerId: number, enabled = true) =>
  queryOptions({
    queryKey: plannerQueryKeys.detail(plannerId),
    queryFn: () => getPlannerDetail(plannerId),
    enabled: enabled && Number.isInteger(plannerId) && plannerId > 0,
  })

export function usePlannerDetailQuery(plannerId: number, enabled = true) {
  return useQuery(plannerDetailQueryOptions(plannerId, enabled))
}

export const plannerMembersQueryOptions = (plannerId: number, enabled = true) =>
  queryOptions({
    queryKey: plannerQueryKeys.members(plannerId),
    queryFn: () => getPlannerMembers(plannerId),
    enabled: enabled && Number.isInteger(plannerId) && plannerId > 0,
  })

export function usePlannerMembersQuery(plannerId: number, enabled = true) {
  return useQuery(plannerMembersQueryOptions(plannerId, enabled))
}
