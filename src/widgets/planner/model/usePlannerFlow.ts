import { useNavigate } from '@tanstack/react-router'

import { paths } from '@/shared/config'
import { isPositiveSafeInteger } from '@/shared/utils'

import { usePlannerData } from './usePlannerData'
import { usePlannerGroupFlow } from './usePlannerGroupFlow'
import { usePlannerMutations } from './usePlannerMutations'
import { usePlannerState } from './usePlannerState'
import { canManagePlanner as hasPlannerManagementRole } from './planner-role'
import { clearPlannerCreationDraft } from './planner-creation'
import { clearPlannerSession } from './planner-session'
import type { PlannerStep } from './types'

export function usePlannerFlow(step: PlannerStep) {
  const navigate = useNavigate()
  const state = usePlannerState()
  const data = usePlannerData(step, state.activePlannerId)
  const mutations = usePlannerMutations()
  const canManagePlanner = isPositiveSafeInteger(state.activePlannerId) &&
    hasPlannerManagementRole(data.plannerDetail?.role)
  const group = usePlannerGroupFlow({
    canManagePlanner,
    mutations,
    navigate,
    state,
    step,
  })
  const handleSelectPlanner = (plannerId?: number) => {
    if (!isPositiveSafeInteger(plannerId)) {
      state.setErrorMessage('선택한 여행 계획을 확인할 수 없습니다.')
      return
    }
    state.activatePlanner(plannerId)
    navigate({ to: paths.plannerProgress })
  }

  const handleStartNewPlanner = () => {
    clearPlannerSession()
    clearPlannerCreationDraft()
    state.setStoredActivePlannerId(0)
    state.setErrorMessage('')
    navigate({ to: paths.plannerDestination })
  }

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
      handleSelectPlanner,
      handleStartNewPlanner,
      planners: data.planners,
    },
  }
}
