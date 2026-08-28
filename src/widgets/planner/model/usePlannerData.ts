import { useState } from 'react'

import {
  useMyPlannersQuery,
  usePlannerConfirmedPlacesQuery,
  usePlannerDetailQuery,
  usePlannerMembersQuery,
  usePlannerVoteQuery,
  usePlannerVotesQuery,
} from '@/entities/planner'
import {
  useCountriesQuery,
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
  const needsMembers = step === 'group' || step === 'progress'
  const needsVotes = step === 'explore' || step === 'vote' || step === 'lineup' || step === 'progress' || step === 'final'
  const needsVoteDetail = step === 'vote' &&
    isPositiveSafeInteger(activePlannerId) &&
    isPositiveSafeInteger(activeVoteId)
  const needsConfirmedPlaces = step === 'final'
  const [overriddenPlan, setOverriddenPlan] = useState<PlannerPlan>()
  const countriesQuery = useCountriesQuery(countryKeyword, step === 'destination')
  const plannersQuery = useMyPlannersQuery(step === 'list')
  const plannerDetailQuery = usePlannerDetailQuery(
    activePlannerId,
    needsPlannerDetail,
  )
  const plannerMembersQuery = usePlannerMembersQuery(activePlannerId, needsMembers)
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

  return {
    countries: countriesQuery.data ?? [],
    hasError:
      countriesQuery.isError ||
      placesQuery.isError ||
      plannersQuery.isError ||
      plannerDetailQuery.isError ||
      plannerMembersQuery.isError ||
      confirmedPlacesQuery.isError ||
      votesQuery.isError ||
      voteDetailQuery.isError,
    isLoading:
      countriesQuery.isLoading ||
      placesQuery.isLoading ||
      plannersQuery.isLoading ||
      plannerDetailQuery.isLoading ||
      plannerMembersQuery.isLoading ||
      confirmedPlacesQuery.isLoading ||
      votesQuery.isLoading ||
      voteDetailQuery.isLoading,
    places: placesQuery.data ?? [],
    plan,
    plannerDetail: plannerDetailQuery.data,
    planners: plannersQuery.data ?? [],
    confirmedPlaces: confirmedPlacesQuery.data?.places ?? [],
    members: plannerMembersQuery.data ?? [],
    setPlan: setOverriddenPlan,
    voteDetail: voteDetailQuery.data,
    votes: votesQuery.data ?? [],
  }
}
