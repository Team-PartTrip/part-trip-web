import { useCallback, useEffect, type FormEvent } from 'react'
import { useNavigate } from '@tanstack/react-router'

import {
  useCreatePlannerMutation,
  useJoinPlannerMutation,
  usePlannerDetailQuery,
  usePlannerMembersQuery,
  useRemovePlannerMemberMutation,
} from '@/entities/planner'
import { PLANNER_GROUP_SETTINGS_KEY, paths } from '@/shared/config'
import { writeSessionValue } from '@/shared/libs/session-storage'
import { isPositiveSafeInteger } from '@/shared/utils'
import { isValidPlannerMemberCount } from './member-count'
import { usePlannerState } from './usePlannerState'
import { canManagePlanner as hasPlannerManagementRole } from './planner-role'

export function usePlannerGroupFlow() {
  const navigate = useNavigate()
  const state = usePlannerState()
  const { activePlannerId, activatePlanner, autoJoinInviteCodeRef, errorMessage, inviteCode, inviteCodeFromUrlRef, isSolo, memberCount, setErrorMessage, setInviteCode, setIsSolo, setMemberCount } = state
  const detailQuery = usePlannerDetailQuery(activePlannerId)
  const membersQuery = usePlannerMembersQuery(activePlannerId)
  const createPlannerMutation = useCreatePlannerMutation()
  const joinPlannerMutation = useJoinPlannerMutation()
  const removePlannerMemberMutation = useRemovePlannerMemberMutation()
  const canManagePlanner = isPositiveSafeInteger(activePlannerId) && hasPlannerManagementRole(detailQuery.data?.role)

  const saveGroupSettings = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextMemberCount = isSolo ? 1 : Number(memberCount)
    if (!isValidPlannerMemberCount(nextMemberCount, isSolo)) {
      setErrorMessage(isSolo ? '혼자 여행은 1명으로 설정해주세요.' : '함께 여행은 2명에서 30명 사이로 입력해주세요.')
      return
    }
    try {
      setErrorMessage('')
      const nextGroupSettings = { isSolo, memberCount: nextMemberCount }
      writeSessionValue(PLANNER_GROUP_SETTINGS_KEY, JSON.stringify(nextGroupSettings))
      if (!isPositiveSafeInteger(activePlannerId)) {
        const planner = await createPlannerMutation.mutateAsync({
          isSolo,
          memberCount: nextMemberCount,
          title: '나의 여행 계획',
        })
        if (!isPositiveSafeInteger(planner.plannerId)) throw new Error('plannerId is missing')
        activatePlanner(planner.plannerId)
      }
      navigate({ to: paths.plannerDestination })
    } catch {
      setErrorMessage('여행 그룹을 저장하지 못했습니다.')
    }
  }

  const handleJoinPlanner = useCallback(async () => {
    if (!inviteCode.trim()) {
      setErrorMessage('초대 코드를 입력해주세요.')
      return
    }
    try {
      setErrorMessage('')
      const joined = await joinPlannerMutation.mutateAsync({ inviteCode: inviteCode.trim() })
      const plannerId = joined.plannerId
      if (!isPositiveSafeInteger(plannerId)) throw new Error('plannerId is missing')
      activatePlanner(plannerId)
      navigate({ to: paths.plannerProgress })
    } catch {
      setErrorMessage('초대 코드로 여행 그룹에 참여하지 못했습니다.')
    }
  }, [activatePlanner, inviteCode, joinPlannerMutation, navigate, setErrorMessage])

  useEffect(() => {
    const code = inviteCodeFromUrlRef.current.trim()
    if (!code || autoJoinInviteCodeRef.current === code) return
    autoJoinInviteCodeRef.current = code
    void handleJoinPlanner()
  }, [autoJoinInviteCodeRef, handleJoinPlanner, inviteCodeFromUrlRef])

  const handleRemovePlannerMember = async (memberUserId?: string) => {
    if (!canManagePlanner || !isPositiveSafeInteger(activePlannerId) || !memberUserId?.trim()) {
      setErrorMessage('내보낼 멤버 정보를 확인할 수 없습니다.')
      return
    }
    try {
      setErrorMessage('')
      await removePlannerMemberMutation.mutateAsync({ memberUserId: memberUserId.trim(), plannerId: activePlannerId })
    } catch {
      setErrorMessage('멤버를 내보내지 못했습니다.')
    }
  }

  return {
    canManagePlanner,
    errorMessage,
    hasError: detailQuery.isError || membersQuery.isError,
    isLoading: detailQuery.isLoading || membersQuery.isLoading,
    isManagingMembers: removePlannerMemberMutation.isPending,
    isSaving: createPlannerMutation.isPending,
    inviteCode,
    isSolo,
    joinPlannerPending: joinPlannerMutation.isPending,
    memberCount,
    members: membersQuery.data ?? [],
    plannerDetail: detailQuery.data,
    saveGroupSettings,
    handleJoinPlanner,
    handleRemovePlannerMember,
    setInviteCode,
    setIsSolo,
    setMemberCount,
  }
}
