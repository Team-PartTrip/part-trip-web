import { useDeferredValue } from 'react'
import { useNavigate, useParams } from '@tanstack/react-router'

import { usePlannerCandidateFlow } from './usePlannerCandidateFlow'
import { usePlannerData } from './usePlannerData'
import { usePlannerDestinationFlow } from './usePlannerDestinationFlow'
import { usePlannerGroupFlow } from './usePlannerGroupFlow'
import { usePlannerLifecycleFlow } from './usePlannerLifecycleFlow'
import { usePlannerMutations } from './usePlannerMutations'
import { usePlannerState } from './usePlannerState'
import { usePlannerVoteFlow } from './usePlannerVoteFlow'
import { plannerCategories, type PlannerCategory, type PlannerStep } from './types'
import { isPositiveSafeInteger } from '@/shared/utils'

export { plannerCategories } from './types'

export function usePlannerFlow(step: PlannerStep) {
  const navigate = useNavigate()
  const { placeId } = useParams({ strict: false })
  const state = usePlannerState()
  const searchKeyword = useDeferredValue(state.cityName?.trim() ?? '')
  const data = usePlannerData(
    step,
    state.voteCategory,
    state.activePlannerId,
    state.activeVoteId,
    searchKeyword,
  )
  const mutations = usePlannerMutations()
  const vote = usePlannerVoteFlow({ data, navigate, mutations, state, step })
  const group = usePlannerGroupFlow({
    canManagePlanner: vote.canManagePlanner,
    mutations,
    navigate,
    state,
    step,
  })
  const destination = usePlannerDestinationFlow({
    data,
    navigate,
    state,
    updatePlannerMutation: mutations.updatePlannerMutation,
  })
  const candidate = usePlannerCandidateFlow({ canManagePlanner: vote.canManagePlanner, data, navigate, mutations, placeId, state })
  const planner = usePlannerLifecycleFlow({
    canManagePlanner: vote.canManagePlanner,
    data,
    navigate,
    mutations,
    state,
  })
  const setVoteCategory = (category: PlannerCategory) => {
    state.resetVoteSession()
    state.setVoteCategory(category)
  }

  return {
    candidate: {
      ...candidate,
      lineupChoice: state.lineupChoice,
      lineupMode: state.lineupMode,
      plannerCategories,
      setLineupChoice: state.setLineupChoice,
      setLineupMode: state.setLineupMode,
      setVoteCategory,
      voteCategory: state.voteCategory,
    },
    common: {
      errorMessage: state.errorMessage,
      hasActivePlanner: isPositiveSafeInteger(state.activePlannerId),
      hasError: data.hasError,
      isLoading: data.isLoading,
      isSaving: mutations.isSaving,
      navigate,
      plan: data.plan,
      plannerDetail: data.plannerDetail,
      plannerInviteLink: data.plannerDetail?.inviteLink ?? '',
    },
    destination,
    group: {
      ...group,
      invitationError: data.invitationError,
      invitationLoading: data.invitationLoading,
      invitations: data.invitations,
      members: data.members,
    },
    planner: {
      ...planner,
      confirmedPlaces: data.confirmedPlaces,
      planners: data.planners,
    },
    vote: {
      ...vote,
      votesError: data.votesError,
    },
  }
}
