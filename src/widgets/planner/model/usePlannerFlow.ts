import { useNavigate } from '@tanstack/react-router'

import { usePlannerData } from './usePlannerData'
import { usePlannerGroupFlow } from './usePlannerGroupFlow'
import { usePlannerLifecycleFlow } from './usePlannerLifecycleFlow'
import { usePlannerMutations } from './usePlannerMutations'
import { usePlannerState } from './usePlannerState'
import type { PlannerStep } from './types'
import { isPositiveSafeInteger } from '@/shared/utils'

export function usePlannerFlow(step: PlannerStep) {
  const navigate = useNavigate()
  const state = usePlannerState()
  const data = usePlannerData(step, state.activePlannerId)
  const mutations = usePlannerMutations()
  const canManagePlanner = isPositiveSafeInteger(state.activePlannerId) &&
    data.plannerDetail?.role?.trim().toUpperCase() === 'OWNER'
  const group = usePlannerGroupFlow({
    canManagePlanner,
    mutations,
    navigate,
    state,
    step,
  })
  const planner = usePlannerLifecycleFlow({
    navigate,
    state,
  })

  return {
    common: {
      errorMessage: state.errorMessage,
      hasError: data.hasError,
      isLoading: data.isLoading,
      isSaving: mutations.isSaving,
      navigate,
      plannerDetail: data.plannerDetail,
    },
    group: {
      ...group,
      canManagePlanner,
      invitationError: data.invitationError,
      invitationLoading: data.invitationLoading,
      invitations: data.invitations,
      members: data.members,
    },
    planner: {
      ...planner,
      planners: data.planners,
    },
  }
}
