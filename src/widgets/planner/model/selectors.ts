import type { PlannerVoteSelection, VoteStatusResponseDto } from '@/entities/planner'
import { isPositiveSafeInteger } from '../../../shared/utils/number.ts'

import { normalizeStatus } from './status.ts'

export function getActiveVote(
  votes: VoteStatusResponseDto[],
  voteDetail: VoteStatusResponseDto | undefined,
  voteCategory: string,
  activeVoteId: number,
) {
  const categoryVote = votes.find((vote) => vote.category === voteCategory || vote.categoryLabel === voteCategory)
  return (voteDetail?.category === voteCategory || voteDetail?.categoryLabel === voteCategory ? voteDetail : undefined) ??
    categoryVote ??
    (voteDetail?.voteId === activeVoteId ? voteDetail : undefined) ??
    votes.find((vote) => vote.voteId === activeVoteId)
}

export function getTopVoteOptions(vote: Pick<VoteStatusResponseDto, 'options'>) {
  const options = vote.options ?? []
  const highestVoteCount = Math.max(...options.map((option) => option.voteCount ?? 0), 0)
  return highestVoteCount > 0
    ? options.filter((option) => (option.voteCount ?? 0) === highestVoteCount)
    : []
}

export function canClosePlannerVotes(votes: VoteStatusResponseDto[]) {
  const openVotes = votes.filter((vote) => normalizeStatus(vote.status) === 'OPEN')
  return openVotes.length > 0 && openVotes.every((vote) =>
    isPositiveSafeInteger(vote.voteId) &&
    isPositiveSafeInteger(vote.eligibleMemberCount) &&
    Number.isSafeInteger(vote.votedMemberCount) &&
    (vote.votedMemberCount ?? 0) >= vote.eligibleMemberCount!,
  )
}

export function getPlannerConfirmationSelections(votes: VoteStatusResponseDto[]): PlannerVoteSelection[] {
  const selections = votes.flatMap((vote) => {
    const status = normalizeStatus(vote.status)
    const confirmedOptions = vote.options.filter((option) =>
      option.confirmed === true || option.optionId === vote.confirmedOptionId,
    )
    const options = confirmedOptions.length
      ? confirmedOptions
      : status === 'CLOSED'
        ? getTopVoteOptions(vote)
        : []
    return options.flatMap((option) =>
      isPositiveSafeInteger(vote.voteId) && isPositiveSafeInteger(option.optionId)
        ? [{ voteId: vote.voteId, optionId: option.optionId }]
        : [],
    )
  })
  return [...new Map(selections.map((selection) => [`${selection.voteId}:${selection.optionId}`, selection])).values()]
}
