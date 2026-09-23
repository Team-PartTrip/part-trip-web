import { type useNavigate } from '@tanstack/react-router'

import { paths } from '@/shared/config'
import { isPositiveSafeInteger } from '@/shared/utils'

import { clearPlannerSession } from './planner-session'
import { clearPlannerCreationDraft } from './planner-creation'
import { type usePlannerState } from './usePlannerState'

type State = ReturnType<typeof usePlannerState>
type Navigate = ReturnType<typeof useNavigate>

export function usePlannerLifecycleFlow({ navigate, state }: { navigate: Navigate; state: State }) {
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

  return { handleSelectPlanner, handleStartNewPlanner }
}
