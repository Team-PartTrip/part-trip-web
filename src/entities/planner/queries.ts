import { queryOptions, useQuery } from '@tanstack/react-query'

import {
  getMyPlannerInvitations,
  getMyPlanners,
  getPlannerBlocks,
  getPlannerConfirmedPlaces,
  getPlannerDetail,
  getPlannerMembers,
  getPlannerSchedule,
  getPlannerScheduleCandidates,
  getPlannerSurvey,
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

export function usePlannerSurveyQuery(plannerId: number, enabled = true) {
  return useQuery({
    queryKey: plannerQueryKeys.survey(plannerId),
    queryFn: () => getPlannerSurvey(plannerId),
    enabled: enabled && isPositiveSafeInteger(plannerId),
    retry: false,
  })
}

export function usePlannerWarningsQuery(plannerId: number) {
  return useQuery({
    queryKey: plannerQueryKeys.warnings(plannerId),
    queryFn: (): NonNullable<import('./types').PlannerScheduleResponseDto['warnings']> => [],
    enabled: false,
  })
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

export const plannerMembersQueryOptions = (plannerId: number, enabled = true, poll = false) =>
  queryOptions({
    refetchInterval: poll ? 5000 : false,
    retry: (count, error) => ![400, 403, 404].includes((error as { response?: { status?: number } }).response?.status ?? 0) && count < 2,
    queryKey: plannerQueryKeys.members(plannerId),
    queryFn: () => getPlannerMembers(plannerId),
    enabled: enabled && isPositiveSafeInteger(plannerId),
  })

export function usePlannerMembersQuery(plannerId: number, enabled = true, poll = false) {
  return useQuery(plannerMembersQueryOptions(plannerId, enabled, poll))
}

export const plannerScheduleQueryOptions = (plannerId: number, enabled = true) =>
  queryOptions({
    queryKey: plannerQueryKeys.schedule(plannerId),
    queryFn: () => getPlannerSchedule(plannerId),
    enabled: enabled && isPositiveSafeInteger(plannerId),
    refetchOnMount: 'always',
  })

export function usePlannerScheduleQuery(plannerId: number, enabled = true) {
  return useQuery(plannerScheduleQueryOptions(plannerId, enabled))
}

export function usePlannerConfirmedPlacesQuery(plannerId: number, enabled = true) {
  return useQuery({
    queryKey: plannerQueryKeys.confirmedPlaces(plannerId),
    queryFn: () => getPlannerConfirmedPlaces(plannerId),
    enabled: enabled && isPositiveSafeInteger(plannerId),
  })
}

export function usePlannerScheduleCandidatesQuery(plannerId: number, date: string, query: string, enabled = true) {
  return useQuery({
    queryKey: plannerQueryKeys.scheduleCandidates(plannerId, date, query),
    queryFn: () => getPlannerScheduleCandidates(plannerId, date, query),
    enabled: enabled && isPositiveSafeInteger(plannerId) && Boolean(date),
  })
}
