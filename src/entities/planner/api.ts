import { apiClient } from '@/shared/libs/api-client'

import type {
  CreatePlannerRequestDto,
  PlannerCreateResponseDto,
  PlannerListResponseDto,
  PlannerDetailResponseDto,
  PlannerMemberResponseDto,
  InvitePlannerMembersRequestDto,
  PlannerInvitationResponseDto,
  PlannerInviteResponseDto,
  JoinPlannerRequestDto,
  PlannerJoinResponseDto,
  CreateVoteRequestDto,
  VoteCreateResponseDto,
  SavePlannerTravelPlanRequestDto,
  PlannerTravelPlanResponseDto,
  PlannerConfirmedPlacesResponseDto,
  VoteStatusResponseDto,
  VoteBallotRequestDto,
  VoteBallotResponseDto,
  VoteCloseResponseDto,
  VoteReminderResponseDto,
  VoteOptionCreateRequestDto,
  VoteOptionCreateResponseDto,
  PlannerConfirmResponseDto,
  PlannerConfirmRequestDto,
} from './types'

export type {
  CreatePlannerRequestDto,
  PlannerCreateResponseDto,
  PlannerListResponseDto,
  PlannerDetailResponseDto,
  PlannerCityRequestDto,
  PlannerCityResponseDto,
  PlannerMemberResponseDto,
  InvitePlannerMembersRequestDto,
  PlannerInvitationResponseDto,
  PlannerInviteResponseDto,
  JoinPlannerRequestDto,
  PlannerJoinResponseDto,
  CreateVoteRequestDto,
  VoteCreateResponseDto,
  SavePlannerTravelPlanRequestDto,
  PlannerTravelPlanResponseDto,
  ConfirmedPlaceResponseDto,
  PlannerConfirmedPlacesResponseDto,
  VoteOptionStatusResponseDto,
  VoteStatusResponseDto,
  VoteBallotRequestDto,
  VoteBallotResponseDto,
  VoteCloseResponseDto,
  VoteReminderResponseDto,
  VoteOptionCreateRequestDto,
  VoteOptionCreateResponseDto,
  PlannerConfirmResponseDto,
  PlannerConfirmRequestDto,
  PlannerVoteSelection,
} from './types'
const PLANNER_API_PATHS = {
  base: '/planners',
  detail: (plannerId: number) => `/planners/${plannerId}`,
  invitations: '/planners/invitations/me',
  invitation: (invitationId: number, action: 'accept' | 'reject') => `/planners/invitations/${invitationId}/${action}`,
  cancelInvitation: (plannerId: number, invitationId: number) => `/planners/${plannerId}/invitations/${invitationId}`,
  members: (plannerId: number) => `/planners/${plannerId}/members`,
  member: (plannerId: number, memberUserId: string) => `/planners/${plannerId}/members/${memberUserId}`,
  invite: (plannerId: number) => `/planners/${plannerId}/members`,
  update: (plannerId: number) => `/planners/${plannerId}/travel-plan`,
  confirm: (plannerId: number) => `/planners/${plannerId}/confirm`,
  confirmedPlaces: (plannerId: number) => `/planners/${plannerId}/confirmed-places`,
  votes: (plannerId: number) => `/planners/${plannerId}/votes`,
  vote: (plannerId: number, voteId: number) => `/planners/${plannerId}/votes/${voteId}`,
  ballot: (plannerId: number, voteId: number) => `/planners/${plannerId}/votes/${voteId}/ballot`,
  placeBallot: (plannerId: number, tourPlaceId: number) => `/planners/${plannerId}/places/${tourPlaceId}/ballot`,
  closeVote: (plannerId: number, voteId: number) => `/planners/${plannerId}/votes/${voteId}/close`,
  option: (plannerId: number, voteId: number, optionId: number) => `/planners/${plannerId}/votes/${voteId}/options/${optionId}`,
  options: (plannerId: number, voteId: number) => `/planners/${plannerId}/votes/${voteId}/options`,
  remind: (plannerId: number) => `/planners/${plannerId}/votes/remind`,
  join: '/planners/join',
} as const

export async function getMyPlanners(): Promise<PlannerListResponseDto[]> {
  const { data } = await apiClient.get<PlannerListResponseDto[]>(PLANNER_API_PATHS.base)
  return data
}

export async function createPlanner(payload: CreatePlannerRequestDto): Promise<PlannerCreateResponseDto> {
  const { data } = await apiClient.post<PlannerCreateResponseDto>(PLANNER_API_PATHS.base, payload)
  return data
}

export async function getPlannerDetail(plannerId: number): Promise<PlannerDetailResponseDto> {
  const { data } = await apiClient.get<PlannerDetailResponseDto>(PLANNER_API_PATHS.detail(plannerId))
  return data
}

export async function deletePlanner(plannerId: number): Promise<void> {
  await apiClient.delete(PLANNER_API_PATHS.detail(plannerId))
}

export async function updatePlanner(plannerId: number, payload: SavePlannerTravelPlanRequestDto): Promise<PlannerTravelPlanResponseDto> {
  const { data } = await apiClient.put<PlannerTravelPlanResponseDto>(PLANNER_API_PATHS.update(plannerId), payload)
  return data
}

export async function getPlannerMembers(plannerId: number): Promise<PlannerMemberResponseDto[]> {
  const { data } = await apiClient.get<PlannerMemberResponseDto[]>(PLANNER_API_PATHS.members(plannerId))
  return data
}

export async function invitePlannerMembers(plannerId: number, payload: InvitePlannerMembersRequestDto): Promise<PlannerInviteResponseDto> {
  const { data } = await apiClient.post<PlannerInviteResponseDto>(PLANNER_API_PATHS.invite(plannerId), payload)
  return data
}

export async function getMyPlannerInvitations(): Promise<PlannerInvitationResponseDto[]> {
  const { data } = await apiClient.get<PlannerInvitationResponseDto[]>(PLANNER_API_PATHS.invitations)
  return data
}

export async function acceptPlannerInvitation(invitationId: number): Promise<PlannerInvitationResponseDto> {
  const { data } = await apiClient.post<PlannerInvitationResponseDto>(PLANNER_API_PATHS.invitation(invitationId, 'accept'))
  return data
}

export async function rejectPlannerInvitation(invitationId: number): Promise<PlannerInvitationResponseDto> {
  const { data } = await apiClient.post<PlannerInvitationResponseDto>(PLANNER_API_PATHS.invitation(invitationId, 'reject'))
  return data
}

export async function cancelPlannerInvitation(plannerId: number, invitationId: number): Promise<void> {
  await apiClient.delete(PLANNER_API_PATHS.cancelInvitation(plannerId, invitationId))
}

export async function removePlannerMember(plannerId: number, memberUserId: string): Promise<void> {
  await apiClient.delete(PLANNER_API_PATHS.member(plannerId, memberUserId))
}

export async function getConfirmedPlaces(plannerId: number): Promise<PlannerConfirmedPlacesResponseDto> {
  const { data } = await apiClient.get<PlannerConfirmedPlacesResponseDto>(PLANNER_API_PATHS.confirmedPlaces(plannerId))
  return data
}

export async function joinPlanner(payload: JoinPlannerRequestDto): Promise<PlannerJoinResponseDto> {
  const { data } = await apiClient.post<PlannerJoinResponseDto>(PLANNER_API_PATHS.join, payload)
  return data
}

export async function confirmPlanner(plannerId: number, payload?: PlannerConfirmRequestDto): Promise<PlannerConfirmResponseDto> {
  const { data } = payload
    ? await apiClient.post<PlannerConfirmResponseDto>(PLANNER_API_PATHS.confirm(plannerId), payload)
    : await apiClient.post<PlannerConfirmResponseDto>(PLANNER_API_PATHS.confirm(plannerId))
  return data
}

export async function createVote(plannerId: number, payload: CreateVoteRequestDto): Promise<VoteCreateResponseDto> {
  const { data } = await apiClient.post<VoteCreateResponseDto>(PLANNER_API_PATHS.votes(plannerId), payload)
  return data
}

export async function getVotes(plannerId: number): Promise<VoteStatusResponseDto[]> {
  const { data } = await apiClient.get<VoteStatusResponseDto[]>(PLANNER_API_PATHS.votes(plannerId))
  return data.map(normalizeVoteStatusResponse)
}

export async function getVote(plannerId: number, voteId: number): Promise<VoteStatusResponseDto> {
  const { data } = await apiClient.get<VoteStatusResponseDto>(PLANNER_API_PATHS.vote(plannerId, voteId))
  return normalizeVoteStatusResponse(data)
}

function normalizeVoteStatusResponse(vote: VoteStatusResponseDto): VoteStatusResponseDto {
  return {
    ...vote,
    options: (vote.options ?? []).map((option) => ({
      ...option,
      selectedByMe: option.selectedByMe === true,
    })),
  }
}

export async function castBallot(
  plannerId: number,
  voteId: number,
  payload: VoteBallotRequestDto,
): Promise<VoteBallotResponseDto> {
  const { data } = await apiClient.put<VoteBallotResponseDto>(
    PLANNER_API_PATHS.ballot(plannerId, voteId),
    payload,
  )
  return data
}

export async function cancelPlaceVote(plannerId: number, tourPlaceId: number): Promise<void> {
  await apiClient.delete(PLANNER_API_PATHS.placeBallot(plannerId, tourPlaceId))
}

export async function castPlaceVote(plannerId: number, tourPlaceId: number): Promise<VoteBallotResponseDto> {
  const { data } = await apiClient.put<VoteBallotResponseDto>(PLANNER_API_PATHS.placeBallot(plannerId, tourPlaceId))
  return data
}

export async function closeVote(plannerId: number, voteId: number): Promise<VoteCloseResponseDto> {
  const { data } = await apiClient.post<VoteCloseResponseDto>(PLANNER_API_PATHS.closeVote(plannerId, voteId))
  return data
}

export async function remindPlannerMembers(plannerId: number): Promise<VoteReminderResponseDto> {
  const { data } = await apiClient.post<VoteReminderResponseDto>(PLANNER_API_PATHS.remind(plannerId))
  return data
}

export async function deleteVoteOption(plannerId: number, voteId: number, optionId: number): Promise<void> {
  await apiClient.delete(PLANNER_API_PATHS.option(plannerId, voteId, optionId))
}

export async function addVoteOption(
  plannerId: number,
  voteId: number,
  payload: VoteOptionCreateRequestDto,
): Promise<VoteOptionCreateResponseDto> {
  const { data } = await apiClient.post<VoteOptionCreateResponseDto>(
    PLANNER_API_PATHS.options(plannerId, voteId),
    payload,
  )
  return data
}
