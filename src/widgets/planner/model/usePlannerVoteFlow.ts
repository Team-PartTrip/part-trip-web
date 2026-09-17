import { type useNavigate } from '@tanstack/react-router'

import { canClosePlannerVotes, getActiveVote } from './selectors'
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
  return normalizedRole === 'OWNER'
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
    cancelPlaceVoteMutation,
    castBallotMutation,
    closeVoteMutation,
    deleteVoteOptionMutation,
    remindPlannerMembersMutation,
  } = mutations
  const activeVote = getActiveVote(votes, voteDetail, voteCategory, activeVoteId)
  const isConfirmed = hasConfirmedLocally || normalizeStatus(plannerDetail?.status) === 'CONFIRMED'
  const openVotes = votes.filter((vote) => normalizeStatus(vote.status) === 'OPEN')
  const canCloseVotes = canClosePlannerVotes(votes)
  const canManagePlanner = isPositiveSafeInteger(activePlannerId) && isPlannerLeader(plannerDetail?.role)
  const isRemindAvailable = canManagePlanner && openVotes.length > 0

  const handleCastBallot = async (optionId?: number, tourPlaceId?: number, selected = false) => {
    if (normalizeStatus(activeVote?.status) !== 'OPEN' || activeVote?.deadlinePassed === true || !isPositiveSafeInteger(activePlannerId) || !isPositiveSafeInteger(activeVote?.voteId) || !isPositiveSafeInteger(optionId)) {
      setErrorMessage('투표할 후보 정보를 확인할 수 없습니다.')
      return
    }
    try {
      setErrorMessage('')
      if (selected) {
        if (!isPositiveSafeInteger(tourPlaceId)) {
          setErrorMessage('투표를 취소할 장소 정보를 확인할 수 없습니다.')
          return
        }
        setSelectedOptionId(undefined)
        await cancelPlaceVoteMutation.mutateAsync({ plannerId: activePlannerId, tourPlaceId })
        return
      }
      setSelectedOptionId(optionId)
      await castBallotMutation.mutateAsync({
        payload: { optionId },
        plannerId: activePlannerId,
        voteId: activeVote.voteId,
      })
    } catch {
      setSelectedOptionId(selected ? optionId : undefined)
      setErrorMessage('투표 상태를 변경하지 못했습니다.')
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
    castBallotPending: castBallotMutation.isPending || cancelPlaceVoteMutation.isPending,
    closeVotePending: closeVoteMutation.isPending,
    deleteVoteOptionPending: deleteVoteOptionMutation.isPending,
    handleCastBallot,
    handleCloseVote,
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
