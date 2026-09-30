import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'

import { useMyPlannersQuery } from '@/entities/planner'
import { paths } from '@/shared/config'
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
    navigate({ to: paths.plannerProgress })
  }

  const handleStartNewPlanner = () => {
    clearPlannerSession()
    clearPlannerCreationDraft()
    setErrorMessage('')
    navigate({ to: paths.plannerDestination })
  }

  return {
    errorMessage,
    hasError: plannersQuery.isError,
    isLoading: plannersQuery.isLoading,
    planners: plannersQuery.data ?? [],
    handleSelectPlanner,
    handleStartNewPlanner,
  }
}
