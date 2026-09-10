import type {
  ConfirmedPlaceResponseDto,
  PlannerInvitationResponseDto,
  PlannerMemberResponseDto,
  VoteStatusResponseDto,
} from '@/entities/planner'
import type { TourPlaceResponseDto } from '@/entities/travel'

import { normalizeStatus } from './status.ts'

type SelectedPlace = {
  item: Pick<TourPlaceResponseDto, 'placeName'>
}

type PlannerPageModelProps = {
  confirmedPlaces: ConfirmedPlaceResponseDto[]
  currentUserName: string
  invitations: PlannerInvitationResponseDto[]
  members: PlannerMemberResponseDto[]
  profileId?: string
  selectedPlaces: SelectedPlace[]
  votes: VoteStatusResponseDto[]
  voteCategory: string
}

export function getPlannerPageModel({
  confirmedPlaces,
  currentUserName,
  invitations,
  members,
  profileId,
  selectedPlaces,
  votes,
  voteCategory,
}: PlannerPageModelProps) {
  const otherMembers = members.filter((member) =>
    profileId
      ? member.userId !== profileId
      : member.nickName !== currentUserName,
  )
  const pendingInvitations = invitations.filter(
    (invitation) =>
      !['ACCEPTED', 'REJECTED', 'CANCELED', 'CANCELLED'].includes(
        normalizeStatus(invitation.status),
      ),
  )
  const finalPlaces: ConfirmedPlaceResponseDto[] = confirmedPlaces.length
    ? confirmedPlaces
    : selectedPlaces.map(({ item }) => ({
        category: voteCategory,
        categoryLabel: voteCategory,
        placeName: item.placeName,
        voteCount: undefined,
      }))

  return {
    confirmedCount: votes.filter(
      (vote) => vote.confirmedOptionId != null || normalizeStatus(vote.status) === 'CONFIRMED',
    ).length,
    finalPlaces,
    hasOpenVote: votes.some(
      (vote) => normalizeStatus(vote.status) === 'OPEN' && vote.voteId != null,
    ),
    otherMembers,
    pendingInvitations,
    votingCount: votes.filter((vote) => normalizeStatus(vote.status) === 'OPEN').length,
  }
}
