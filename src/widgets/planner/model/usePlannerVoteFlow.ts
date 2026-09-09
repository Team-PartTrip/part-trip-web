import { type useNavigate } from '@tanstack/react-router'

import { getActiveVote } from './selectors'
import { type usePlannerData } from './usePlannerData'
import { type usePlannerMutations } from './usePlannerMutations'
import { type usePlannerState } from './usePlannerState'
import type { PlannerStep } from './types'
import { paths } from '@/shared/config'
import { isPositiveSafeInteger } from '@/shared/utils'
import { normalizeStatus } from './status'

type Data = ReturnType<typeof usePlannerData>
type Mutations = ReturnType<typeof usePlannerMutations>
type State = ReturnType<typeof usePlannerState>
type Navigate = ReturnType<typeof useNavigate>

type Props = {
  data: Data
  navigate: Navigate
  mutations: Mutations
  state: State
  step: PlannerStep
}

function isPlannerLeader(role?: string) {
  const normalizedRole = role?.trim().toUpperCase() ?? ''
  return ['ADMIN', 'CREATOR', 'GROUP_LEADER', 'HOST', 'LEADER', 'OWNER', '그룹장', '방장']
    .some((value) => normalizedRole.includes(value))
}

export function usePlannerVoteFlow({ data, navigate, mutations, state, step }: Props) {
  const {
    activePlannerId,
    activeVoteId,
    hasConfirmedLocally,
    remindFeedback,
    selectedOptionId,
    setErrorMessage,
    setRemindFeedback,
    setSelectedOptionId,
    voteCategory,
  } = state
  const { plannerDetail, votes, voteDetail } = data
  const {
    castBallotMutation,
    closeVoteMutation,
    confirmVoteMutation,
    deleteVoteOptionMutation,
    remindPlannerMembersMutation,
  } = mutations
  const activeVote = getActiveVote(votes, voteDetail, voteCategory, activeVoteId)
  const isConfirmed = hasConfirmedLocally || normalizeStatus(plannerDetail?.status) === 'CONFIRMED'
  const openVotes = votes.filter((vote) => normalizeStatus(vote.status) === 'OPEN')
  const canCloseVotes = openVotes.length > 0 && openVotes.every((vote) => isPositiveSafeInteger(vote.voteId) && vote.options.some((option) => option.selectedByMe))
  const canManagePlanner = isPositiveSafeInteger(activePlannerId) && isPlannerLeader(plannerDetail?.role)
  const isRemindAvailable = canManagePlanner && openVotes.length > 0

  const handleCastBallot = async (optionId?: number) => {
    if (normalizeStatus(activeVote?.status) !== 'OPEN' || activeVote?.deadlinePassed === true || !isPositiveSafeInteger(activePlannerId) || !isPositiveSafeInteger(activeVote?.voteId) || !isPositiveSafeInteger(optionId)) {
      setErrorMessage('투표할 후보 정보를 확인할 수 없습니다.')
      return
    }
    try {
      setErrorMessage('')
      await castBallotMutation.mutateAsync({
        payload: { optionId },
        plannerId: activePlannerId,
        voteId: activeVote.voteId,
      })
      setSelectedOptionId(optionId)
    } catch {
      setErrorMessage('투표를 저장하지 못했습니다.')
    }
  }

  const handleConfirmVote = async (voteId?: number, optionId?: number) => {
    const vote = votes.find((item) => item.voteId === voteId)
    if (!canManagePlanner || !isPositiveSafeInteger(activePlannerId) || !isPositiveSafeInteger(voteId) || !isPositiveSafeInteger(optionId) || normalizeStatus(vote?.status) !== 'CLOSED') {
      setErrorMessage('확정할 마감 투표 정보를 확인할 수 없습니다.')
      return
    }
    try {
      setErrorMessage('')
      await confirmVoteMutation.mutateAsync({ payload: { optionId }, plannerId: activePlannerId, voteId })
    } catch {
      setErrorMessage('투표 결과를 확정하지 못했습니다.')
    }
  }

  const handleDeleteVoteOption = async (optionId?: number) => {
    if (!isPositiveSafeInteger(activePlannerId) || !isPositiveSafeInteger(activeVote?.voteId) || !isPositiveSafeInteger(optionId) || normalizeStatus(activeVote.status) !== 'OPEN') {
      setErrorMessage('삭제할 후보 정보를 확인할 수 없습니다.')
      return
    }
    try {
      setErrorMessage('')
      await deleteVoteOptionMutation.mutateAsync({ optionId, plannerId: activePlannerId, voteId: activeVote.voteId })
    } catch {
      setErrorMessage('후보를 삭제하지 못했습니다.')
    }
  }

  const handleCloseVote = async () => {
    if (!canManagePlanner || !canCloseVotes) {
      setErrorMessage('모든 카테고리 투표를 완료한 뒤 마감할 수 있습니다.')
      return
    }
    try {
      setErrorMessage('')
      for (const vote of openVotes) {
        if (vote.voteId != null) await closeVoteMutation.mutateAsync({ plannerId: activePlannerId, voteId: vote.voteId })
      }
      if (step === 'vote') navigate({ to: paths.plannerProgress })
    } catch {
      setErrorMessage('투표를 마감하지 못했습니다.')
    }
  }

  const handleRemindMembers = async () => {
    if (!isRemindAvailable) {
      setErrorMessage('진행 중인 투표가 없거나 그룹장만 사용할 수 있습니다.')
      return
    }
    try {
      setErrorMessage('')
      const result = await remindPlannerMembersMutation.mutateAsync(activePlannerId)
      setRemindFeedback([result.message ?? '재촉 알림을 전송했습니다.', result.notifiedCount == null ? '' : `${result.notifiedCount}명에게 알림 전송`].filter(Boolean).join(' · '))
    } catch {
      setErrorMessage('재촉 알림을 보내지 못했습니다.')
    }
  }

  return {
    activeVote,
    canCloseVotes,
    canManagePlanner,
    castBallotPending: castBallotMutation.isPending,
    closeVotePending: closeVoteMutation.isPending,
    confirmVotePending: confirmVoteMutation.isPending,
    deleteVoteOptionPending: deleteVoteOptionMutation.isPending,
    handleCastBallot,
    handleCloseVote,
    handleConfirmVote,
    handleDeleteVoteOption,
    handleRemindMembers,
    isConfirmed,
    isRemindAvailable,
    remindFeedback,
    remindPending: remindPlannerMembersMutation.isPending,
    selectedOptionId,
    votes,
  }
}
