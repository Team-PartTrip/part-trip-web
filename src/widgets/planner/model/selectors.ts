import type { VoteStatusResponseDto } from '@/entities/planner'
import type { TourPlaceResponseDto } from '@/entities/travel'
import { isPositiveSafeInteger } from '../../../shared/utils/number.ts'

import { normalizeStatus } from './status.ts'

function isSamePlace(left: TourPlaceResponseDto, right: TourPlaceResponseDto) {
  if (isPositiveSafeInteger(left.tourPlaceId) && isPositiveSafeInteger(right.tourPlaceId)) {
    return left.tourPlaceId === right.tourPlaceId
  }
  const leftKey = [left.placeName, left.address, left.imageUrl].filter(Boolean).join('|')
  const rightKey = [right.placeName, right.address, right.imageUrl].filter(Boolean).join('|')
  return Boolean(leftKey) && leftKey === rightKey
}

export function getSelectedPlaceIndexes(places: TourPlaceResponseDto[], selectedPlaces: TourPlaceResponseDto[]) {
  return places.flatMap((place, index) => selectedPlaces.some((selected) => isSamePlace(place, selected)) ? [index] : [])
}

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

export function getCandidateManagementState(
  votes: VoteStatusResponseDto[],
  votesLoading: boolean,
  votesError: boolean,
) {
  const allVotesOpen = votes.every((vote) => normalizeStatus(vote.status) === 'OPEN')
  const hasNonOpenVote = !votesLoading && !votesError && votes.length > 0 && !allVotesOpen
  const canManageCandidates = !votesLoading && !votesError && allVotesOpen
  const candidateManagementError = votesLoading
    ? '투표 상태를 확인하는 중입니다.'
    : votesError
      ? '투표 상태를 불러오지 못했습니다. 새로고침 후 다시 시도해주세요.'
      : hasNonOpenVote
        ? '투표가 시작되거나 마감된 뒤에는 후보를 변경할 수 없습니다.'
        : ''
  return { canManageCandidates, candidateManagementError }
}
