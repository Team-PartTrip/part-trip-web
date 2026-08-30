import { useState } from 'react'

import {
  useMyPlannersQuery,
  usePlannerInvitationsQuery,
  usePlannerConfirmedPlacesQuery,
  usePlannerDetailQuery,
  usePlannerMembersQuery,
  usePlannerVoteQuery,
  usePlannerVotesQuery,
} from '@/entities/planner'
import {
  useCountriesQuery,
  usePopularCitiesQuery,
  useTourPlacesQuery,
} from '@/entities/travel'
import { isPositiveSafeInteger } from '@/shared/utils'

import type { PlannerStep } from './types'

type PlannerPlan = {
  cityName?: string
  countryName?: string
  endDate?: string
  headcount?: number
  startDate?: string
}

export function usePlannerData(
  step: PlannerStep,
  category: string | undefined,
  activePlannerId: number,
  activeVoteId: number,
  countryKeyword = '',
) {
  const needsPlaces =
    step === 'explore' ||
    step === 'vote' ||
    step === 'lineup' ||
    step === 'final' ||
    step === 'place'
  const hasActivePlanner = isPositiveSafeInteger(activePlannerId)
  const needsPlannerDetail = hasActivePlanner && step !== 'list' && step !== 'create'
  const needsMembers = step === 'group' || step === 'progress' || step === 'final'
  const requiresMembers = step === 'group' || step === 'progress'
  const needsInvitations = step === 'group'
  const needsVotes = step === 'explore' || step === 'vote' || step === 'lineup' || step === 'progress' || step === 'final'
  const requiresVotes = step === 'vote' || step === 'progress'
  const needsVoteDetail = step === 'vote' &&
    isPositiveSafeInteger(activePlannerId) &&
    isPositiveSafeInteger(activeVoteId)
  const requiresVoteList = requiresVotes && !needsVoteDetail
  const needsConfirmedPlaces = step === 'final'
  const [overriddenPlan, setOverriddenPlan] = useState<PlannerPlan>()
  const countriesQuery = useCountriesQuery(countryKeyword, step === 'destination')
  const popularCitiesQuery = usePopularCitiesQuery(50, step === 'destination')
  const plannersQuery = useMyPlannersQuery(step === 'list')
  const plannerDetailQuery = usePlannerDetailQuery(
    activePlannerId,
    needsPlannerDetail,
  )
  const plannerMembersQuery = usePlannerMembersQuery(activePlannerId, needsMembers)
  const plannerInvitationsQuery = usePlannerInvitationsQuery(needsInvitations)
  const votesQuery = usePlannerVotesQuery(activePlannerId, needsVotes)
  const voteDetailQuery = usePlannerVoteQuery(activePlannerId, activeVoteId, needsVoteDetail)
  const confirmedPlacesQuery = usePlannerConfirmedPlacesQuery(activePlannerId, needsConfirmedPlaces)
  const plannerPlan = plannerDetailQuery.data
    ? {
        cityName: plannerDetailQuery.data.cityName,
        countryName: plannerDetailQuery.data.countryName,
        endDate: plannerDetailQuery.data.endDate,
        headcount: plannerDetailQuery.data.memberCount,
        startDate: plannerDetailQuery.data.startDate,
      }
    : undefined
  const plan = overriddenPlan ?? plannerPlan
  const placesQuery = useTourPlacesQuery(
    plan?.countryName,
    plan?.cityName,
    category,
    needsPlaces,
  )
  const canUseVoteDetail = step === 'vote' && Boolean(voteDetailQuery.data)

  return {
    countries: countriesQuery.data ?? [],
    popularCities: popularCitiesQuery.data ?? [],
    hasError:
      countriesQuery.isError ||
      (step === 'destination' && popularCitiesQuery.isError) ||
      placesQuery.isError ||
      plannersQuery.isError ||
      plannerDetailQuery.isError ||
      (requiresMembers && plannerMembersQuery.isError) ||
      confirmedPlacesQuery.isError ||
      (requiresVotes && votesQuery.isError && !canUseVoteDetail) ||
      (step === 'vote' && needsVoteDetail && voteDetailQuery.isError),
    isLoading:
      countriesQuery.isLoading ||
      (step === 'destination' && popularCitiesQuery.isLoading) ||
      placesQuery.isLoading ||
      plannersQuery.isLoading ||
      plannerDetailQuery.isLoading ||
      (requiresMembers && plannerMembersQuery.isLoading) ||
      confirmedPlacesQuery.isLoading ||
      (requiresVoteList && votesQuery.isLoading) ||
      (needsVoteDetail && voteDetailQuery.isLoading),
    places: placesQuery.data ?? [],
    plan,
    plannerDetail: plannerDetailQuery.data,
    planners: plannersQuery.data ?? [],
    confirmedPlaces: confirmedPlacesQuery.data?.places ?? [],
    members: plannerMembersQuery.data ?? [],
    invitations: plannerInvitationsQuery.data ?? [],
    invitationError: plannerInvitationsQuery.isError,
    invitationLoading: plannerInvitationsQuery.isLoading,
    setPlan: setOverriddenPlan,
    voteDetail: voteDetailQuery.data,
    votes: votesQuery.data ?? [],
  }
}
