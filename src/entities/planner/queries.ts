import { queryOptions, useQuery } from '@tanstack/react-query'

import {
  getConfirmedPlaces,
  getMyPlanners,
  getPlannerDetail,
  getPlannerMembers,
  getVote,
  getVotes,
} from './api'
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

export const plannerConfirmedPlacesQueryOptions = (plannerId: number, enabled = true) =>
  queryOptions({
    queryKey: plannerQueryKeys.confirmedPlaces(plannerId),
    queryFn: () => getConfirmedPlaces(plannerId),
    enabled: enabled && Number.isInteger(plannerId) && plannerId > 0,
  })

export function usePlannerConfirmedPlacesQuery(plannerId: number, enabled = true) {
  return useQuery(plannerConfirmedPlacesQueryOptions(plannerId, enabled))
}

export const plannerVotesQueryOptions = (plannerId: number, enabled = true) =>
  queryOptions({
    queryKey: plannerQueryKeys.votes(plannerId),
    queryFn: () => getVotes(plannerId),
    enabled: enabled && Number.isInteger(plannerId) && plannerId > 0,
  })

export function usePlannerVotesQuery(plannerId: number, enabled = true) {
  return useQuery(plannerVotesQueryOptions(plannerId, enabled))
}

export const plannerVoteQueryOptions = (plannerId: number, voteId: number, enabled = true) =>
  queryOptions({
    queryKey: plannerQueryKeys.vote(plannerId, voteId),
    queryFn: () => getVote(plannerId, voteId),
    enabled:
      enabled &&
      Number.isInteger(plannerId) &&
      plannerId > 0 &&
      Number.isInteger(voteId) &&
      voteId > 0,
  })

export function usePlannerVoteQuery(plannerId: number, voteId: number, enabled = true) {
  return useQuery(plannerVoteQueryOptions(plannerId, voteId, enabled))
}
