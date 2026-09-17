import type {
  PlannerInvitationResponseDto,
  PlannerMemberResponseDto,
  VoteStatusResponseDto,
} from '@/entities/planner'

import { normalizeStatus } from './status.ts'
import { isConfirmedPlannerOption } from './selectors.ts'

type PlannerPageModelProps = {
  currentUserName: string
  invitations: PlannerInvitationResponseDto[]
  members: PlannerMemberResponseDto[]
  profileId?: string
  votes: VoteStatusResponseDto[]
}

export function getPlannerPageModel({
  currentUserName,
  invitations,
  members,
  profileId,
  votes,
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
  return {
    confirmedCount: votes.reduce((count, vote) => {
      const confirmedOptions = vote.options.filter((option) => isConfirmedPlannerOption(vote, option))
      return count + (confirmedOptions.length || (vote.confirmedOptionId != null || normalizeStatus(vote.status) === 'CONFIRMED' ? 1 : 0))
    }, 0),
    hasOpenVote: votes.some(
      (vote) => normalizeStatus(vote.status) === 'OPEN' && vote.voteId != null,
    ),
    otherMembers,
    pendingInvitations,
    votingCount: votes.filter((vote) => normalizeStatus(vote.status) === 'OPEN').length,
  }
}
