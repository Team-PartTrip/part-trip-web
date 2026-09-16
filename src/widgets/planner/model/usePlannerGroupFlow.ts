import { useCallback, useEffect, type FormEvent } from 'react'
import { type useNavigate } from '@tanstack/react-router'

import { type usePlannerMutations } from './usePlannerMutations'
import { type usePlannerState } from './usePlannerState'
import { isValidPlannerMemberCount } from './member-count'
import type { PlannerStep } from './types'
import { PLANNER_GROUP_SETTINGS_KEY, paths } from '@/shared/config'
import { writeSessionValue } from '@/shared/libs/session-storage'
import { isPositiveSafeInteger } from '@/shared/utils'

type State = ReturnType<typeof usePlannerState>
type Mutations = ReturnType<typeof usePlannerMutations>
type Navigate = ReturnType<typeof useNavigate>

type Props = {
  canManagePlanner: boolean
  mutations: Mutations
  navigate: Navigate
  state: State
  step: PlannerStep
}

export function usePlannerGroupFlow({ canManagePlanner, mutations, navigate, state, step }: Props) {
  const {
    activePlannerId,
    activatePlanner,
    autoJoinInviteCodeRef,
    inviteCode,
    inviteCodeFromUrlRef,
    isSolo,
    memberCount,
    setErrorMessage,
    setHeadcount,
    setInviteCode,
    setIsSolo,
    setMemberCount,
    setSavedGroupSettings,
  } = state
  const {
    acceptPlannerInvitationMutation,
    cancelPlannerInvitationMutation,
    createPlannerMutation,
    joinPlannerMutation,
    rejectPlannerInvitationMutation,
    removePlannerMemberMutation,
  } = mutations
  const isManagingMembers =
    acceptPlannerInvitationMutation.isPending ||
    rejectPlannerInvitationMutation.isPending ||
    cancelPlannerInvitationMutation.isPending ||
    removePlannerMemberMutation.isPending

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
      setSavedGroupSettings(nextGroupSettings)
      setHeadcount(String(nextMemberCount))
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
    if (step !== 'group' || !code || autoJoinInviteCodeRef.current === code) return
    autoJoinInviteCodeRef.current = code
    void handleJoinPlanner()
  }, [autoJoinInviteCodeRef, handleJoinPlanner, inviteCodeFromUrlRef, step])

  const handleAcceptPlannerInvitation = async (invitationId?: number) => {
    if (!isPositiveSafeInteger(invitationId)) {
      setErrorMessage('초대 정보를 확인할 수 없습니다.')
      return
    }
    try {
      setErrorMessage('')
      const invitation = await acceptPlannerInvitationMutation.mutateAsync(invitationId)
      if (isPositiveSafeInteger(invitation.plannerId)) {
        activatePlanner(invitation.plannerId)
        navigate({ to: paths.plannerProgress })
      }
    } catch {
      setErrorMessage('초대를 수락하지 못했습니다.')
    }
  }

  const handleRejectPlannerInvitation = async (invitationId?: number) => {
    if (!isPositiveSafeInteger(invitationId)) {
      setErrorMessage('초대 정보를 확인할 수 없습니다.')
      return
    }
    try {
      setErrorMessage('')
      await rejectPlannerInvitationMutation.mutateAsync(invitationId)
    } catch {
      setErrorMessage('초대를 거절하지 못했습니다.')
    }
  }

  const handleCancelPlannerInvitation = async (invitationId?: number) => {
    if (!canManagePlanner || !isPositiveSafeInteger(activePlannerId) || !isPositiveSafeInteger(invitationId)) {
      setErrorMessage('취소할 초대 정보를 확인할 수 없습니다.')
      return
    }
    try {
      setErrorMessage('')
      await cancelPlannerInvitationMutation.mutateAsync({ invitationId, plannerId: activePlannerId })
    } catch {
      setErrorMessage('초대를 취소하지 못했습니다.')
    }
  }

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
    handleAcceptPlannerInvitation,
    handleCancelPlannerInvitation,
    handleJoinPlanner,
    handleRejectPlannerInvitation,
    handleRemovePlannerMember,
    inviteCode,
    isSolo,
    isManagingMembers,
    joinPlannerPending: joinPlannerMutation.isPending,
    memberCount,
    saveGroupSettings,
    setInviteCode,
    setIsSolo,
    setMemberCount,
  }
}
