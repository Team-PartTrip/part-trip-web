import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'

import { useMyPlannersQuery } from '@/entities/planner'
import { PLANNER_GROUP_SETTINGS_KEY, paths } from '@/shared/config'
import { removeSessionValue } from '@/shared/libs/session-storage'
import { clearPlannerCreationDraft } from './planner-creation'
import { activatePlannerSession, clearPlannerSession } from './planner-session'
import { isPositiveSafeInteger } from '@/shared/utils'

export function usePlannerListFlow() {
  const navigate = useNavigate()
  const plannersQuery = useMyPlannersQuery()
  const [errorMessage, setErrorMessage] = useState('')

  const handleSelectPlanner = (plannerId?: number) => {
    if (!isPositiveSafeInteger(plannerId)) {
      setErrorMessage('선택한 여행 계획을 확인할 수 없습니다.')
      return
    }
    activatePlannerSession(plannerId)
    navigate({ to: '/planner/$plannerId', params: { plannerId: String(plannerId) } })
  }

  const handleStartNewPlanner = () => {
    clearPlannerSession()
    clearPlannerCreationDraft()
    removeSessionValue(PLANNER_GROUP_SETTINGS_KEY)
    setErrorMessage('')
    navigate({ to: paths.plannerDestination })
  }

  return {
    refetch: plannersQuery.refetch,
    isFetching: plannersQuery.isFetching,
    errorMessage,
    hasError: plannersQuery.isError,
    isLoading: plannersQuery.isLoading,
    planners: plannersQuery.data ?? [],
    handleSelectPlanner,
    handleStartNewPlanner,
  }
}
