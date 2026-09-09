import { type useNavigate } from '@tanstack/react-router'

import { type usePlannerData } from './usePlannerData'
import { type usePlannerMutations } from './usePlannerMutations'
import { clearPlannerSession } from './planner-session'
import { type usePlannerState } from './usePlannerState'
import { paths, ACTIVE_VOTE_CATEGORY_KEY } from '@/shared/config'
import { removeSessionValue, writeSessionValue } from '@/shared/libs/session-storage'
import { getErrorMessage, isPositiveSafeInteger } from '@/shared/utils'

type Data = ReturnType<typeof usePlannerData>
type Mutations = ReturnType<typeof usePlannerMutations>
type State = ReturnType<typeof usePlannerState>
type Navigate = ReturnType<typeof useNavigate>

type Props = {
  canManagePlanner: boolean
  data: Data
  navigate: Navigate
  mutations: Mutations
  state: State
}

export function usePlannerLifecycleFlow({ canManagePlanner, data, navigate, mutations, state }: Props) {
  const {
    activePlannerId,
    clearSelected,
    plannerConfirmationKey,
    resetVoteSession,
    setCityName,
    setConfirmedPlannerId,
    setCountryInfoId,
    setCountryName,
    setEndDate,
    setErrorMessage,
    setSelectedDestination,
    setStartDate,
    setStoredActivePlannerId,
  } = state
  const { votes } = data
  const { confirmPlannerMutation, deletePlannerMutation } = mutations

  const handleConfirmPlan = async () => {
    if (!canManagePlanner) {
      setErrorMessage('먼저 여행 계획을 저장해주세요.')
      return false
    }
    try {
      setErrorMessage('')
      if (!isPositiveSafeInteger(activePlannerId) || votes.length === 0) {
        setErrorMessage('확정할 투표 결과를 확인할 수 없습니다.')
        return false
      }
      await confirmPlannerMutation.mutateAsync(activePlannerId)
      writeSessionValue(plannerConfirmationKey, 'true')
      setConfirmedPlannerId(activePlannerId)
      return true
    } catch {
      setErrorMessage('최종 계획을 확정하지 못했습니다.')
      return false
    }
  }

  const handleDeletePlanner = async (plannerId?: number) => {
    if (!isPositiveSafeInteger(plannerId)) {
      setErrorMessage('삭제할 플래너 정보를 확인할 수 없습니다.')
      return
    }
    try {
      setErrorMessage('')
      await deletePlannerMutation.mutateAsync(plannerId)
      if (plannerId === activePlannerId) {
        clearPlannerSession(plannerId)
        setStoredActivePlannerId(0)
        clearSelected()
        resetVoteSession()
        setConfirmedPlannerId(0)
      }
    } catch (error) {
      setErrorMessage(getErrorMessage(error))
    }
  }

  const handleSelectPlanner = (plannerId?: number) => {
    if (!isPositiveSafeInteger(plannerId)) {
      setErrorMessage('선택한 여행 계획을 확인할 수 없습니다.')
      return
    }
    state.activatePlanner(plannerId)
    navigate({ to: paths.plannerProgress })
  }

  const handleStartNewPlanner = () => {
    clearPlannerSession()
    removeSessionValue(ACTIVE_VOTE_CATEGORY_KEY)
    setStoredActivePlannerId(0)
    setSelectedDestination(undefined)
    setCountryInfoId('')
    setCountryName(undefined)
    setCityName(undefined)
    setStartDate(undefined)
    setEndDate(undefined)
    clearSelected()
    resetVoteSession()
    setConfirmedPlannerId(0)
    navigate({ to: paths.plannerGroup })
  }

  return {
    confirmPlannerPending: confirmPlannerMutation.isPending,
    deletePlannerPending: deletePlannerMutation.isPending,
    handleConfirmPlan,
    handleDeletePlanner,
    handleSelectPlanner,
    handleStartNewPlanner,
  }
}
