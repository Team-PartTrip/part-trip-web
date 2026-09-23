import { queryOptions, useQuery } from '@tanstack/react-query'
import { getGuardianLinks, getLinkedSeniors, getSeniorLocation, getSeniorPlanners, getSeniorSchedule } from './api'

export const guardianQueryKeys = {
  all: ['guardians'] as const,
  links: () => [...guardianQueryKeys.all, 'links'] as const,
  seniors: () => [...guardianQueryKeys.all, 'seniors'] as const,
  seniorPlanners: (seniorUserId: string) => [...guardianQueryKeys.all, 'senior-planners', seniorUserId] as const,
  seniorSchedule: (seniorUserId: string, plannerId: number) => [...guardianQueryKeys.all, 'senior-schedule', seniorUserId, plannerId] as const,
  seniorLocation: (seniorUserId: string) => [...guardianQueryKeys.all, 'senior-location', seniorUserId] as const,
}

export const guardianLinksQueryOptions = () =>
  queryOptions({ queryKey: guardianQueryKeys.links(), queryFn: getGuardianLinks })

export const linkedSeniorsQueryOptions = () =>
  queryOptions({ queryKey: guardianQueryKeys.seniors(), queryFn: getLinkedSeniors })

export function useGuardianLinksQuery() {
  return useQuery(guardianLinksQueryOptions())
}

export function useLinkedSeniorsQuery() {
  return useQuery(linkedSeniorsQueryOptions())
}

export function useSeniorPlannersQuery(seniorUserId?: string) {
  return useQuery({
    queryKey: guardianQueryKeys.seniorPlanners(seniorUserId ?? ''),
    queryFn: () => getSeniorPlanners(seniorUserId!),
    enabled: Boolean(seniorUserId),
  })
}

export function useSeniorScheduleQuery(seniorUserId?: string, plannerId?: number) {
  return useQuery({
    queryKey: guardianQueryKeys.seniorSchedule(seniorUserId ?? '', plannerId ?? 0),
    queryFn: () => getSeniorSchedule(seniorUserId!, plannerId!),
    enabled: Boolean(seniorUserId && plannerId),
  })
}

export function useSeniorLocationQuery(seniorUserId?: string) {
  return useQuery({
    queryKey: guardianQueryKeys.seniorLocation(seniorUserId ?? ''),
    queryFn: () => getSeniorLocation(seniorUserId!),
    enabled: Boolean(seniorUserId),
    refetchInterval: seniorUserId ? 60_000 : false,
  })
}
