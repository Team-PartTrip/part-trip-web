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
  useMoreTourPlacesQuery,
  usePopularCitiesQuery,
  useTourPlacesQuery,
} from '@/entities/travel'
import { isPositiveSafeInteger } from '@/shared/utils'
import type { PlannerCityResponseDto } from '@/entities/planner'

import type { PlannerStep } from './types'

type PlannerPlan = {
  cityName?: string
  countryName?: string
  cities?: PlannerCityResponseDto[]
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
  selectedPlaceCountryName = '',
  selectedPlaceCityName = '',
  confirmedLocally = false,
) {
  const needsPlaces =
    step === 'explore' ||
    step === 'vote' ||
    step === 'place'
  const hasActivePlanner = isPositiveSafeInteger(activePlannerId)
  const needsPlannerDetail = hasActivePlanner && step !== 'list'
  const needsMembers = step === 'group' || step === 'progress'
  const requiresMembers = step === 'group' || step === 'progress'
  const needsInvitations = step === 'group'
  const needsVotes = step === 'explore' || step === 'vote' || step === 'progress' || step === 'place'
  const requiresVotes = step === 'vote' || step === 'progress' || step === 'place'
  const needsVoteDetail = step === 'vote' &&
    hasActivePlanner &&
    isPositiveSafeInteger(activeVoteId)
  const requiresVoteList = requiresVotes && !needsVoteDetail
  const [overriddenPlan, setOverriddenPlan] = useState<PlannerPlan>()
  const countriesQuery = useCountriesQuery(countryKeyword, step === 'destination')
  const popularCitiesQuery = usePopularCitiesQuery(8, step === 'destination')
  const plannersQuery = useMyPlannersQuery(step === 'list')
  const plannerDetailQuery = usePlannerDetailQuery(
    activePlannerId,
    needsPlannerDetail,
  )
  const needsConfirmedPlaces = step === 'progress' &&
    (confirmedLocally || plannerDetailQuery.data?.status?.toUpperCase() === 'CONFIRMED')
  const plannerMembersQuery = usePlannerMembersQuery(activePlannerId, needsMembers)
  const plannerInvitationsQuery = usePlannerInvitationsQuery(needsInvitations)
  const votesQuery = usePlannerVotesQuery(activePlannerId, needsVotes)
  const voteDetailQuery = usePlannerVoteQuery(activePlannerId, activeVoteId, needsVoteDetail)
  const confirmedPlacesQuery = usePlannerConfirmedPlacesQuery(activePlannerId, needsConfirmedPlaces)
  const plannerPlan = plannerDetailQuery.data
    ? {
        cityName: plannerDetailQuery.data.cityName,
        countryName: plannerDetailQuery.data.countryName,
        cities: plannerDetailQuery.data.cities,
        endDate: plannerDetailQuery.data.endDate,
        headcount: plannerDetailQuery.data.memberCount,
        startDate: plannerDetailQuery.data.startDate,
      }
    : undefined
  const plan = overriddenPlan ?? plannerPlan
  const placeCountryName = selectedPlaceCountryName || plan?.countryName || ''
  const placeCityName = selectedPlaceCityName || plan?.cityName || ''
  const placesQuery = useTourPlacesQuery(
    placeCountryName,
    placeCityName,
    category,
    needsPlaces,
  )
  const morePlacesQuery = useMoreTourPlacesQuery(placeCountryName, placeCityName, category)
  const additionalPlaces = morePlacesQuery.data?.pages.flatMap((page) => page.places ?? []) ?? []
  const seenPlaceIds = new Set<number>()
  const places = [...(placesQuery.data ?? []), ...additionalPlaces].filter((place) => {
    if (place.tourPlaceId == null) return true
    if (seenPlaceIds.has(place.tourPlaceId)) return false
    seenPlaceIds.add(place.tourPlaceId)
    return true
  })
  const canUseVoteDetail = step === 'vote' && Boolean(voteDetailQuery.data)

  return {
    countries: countriesQuery.data ?? [],
    popularCities: popularCitiesQuery.data ?? [],
    hasError:
      countriesQuery.isError ||
      placesQuery.isError ||
      plannersQuery.isError ||
      plannerDetailQuery.isError ||
      (requiresMembers && plannerMembersQuery.isError) ||
      confirmedPlacesQuery.isError ||
      (requiresVotes && votesQuery.isError && !canUseVoteDetail) ||
      (step === 'vote' && needsVoteDetail && voteDetailQuery.isError),
    isLoading:
      countriesQuery.isLoading ||
      placesQuery.isLoading ||
      plannersQuery.isLoading ||
      plannerDetailQuery.isLoading ||
      (requiresMembers && plannerMembersQuery.isLoading) ||
      confirmedPlacesQuery.isLoading ||
      (requiresVoteList && votesQuery.isLoading) ||
      (needsVoteDetail && voteDetailQuery.isLoading),
    places,
    fetchMorePlaces: () => morePlacesQuery.fetchNextPage({ throwOnError: true }),
    hasMorePlaces: Boolean(placeCountryName && placeCityName && category) && (!morePlacesQuery.data || morePlacesQuery.hasNextPage),
    isLoadingMorePlaces: morePlacesQuery.isFetchingNextPage,
    morePlacesError: morePlacesQuery.isError,
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
    votesError: needsVotes && votesQuery.isError,
    votesLoading: needsVotes && votesQuery.isLoading,
  }
}
