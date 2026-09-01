import { apiClient } from '@/shared/libs/api-client'

export type CreatePlannerRequestDto = {
  title: string
  memberCount: number
  isSolo: boolean
}

export type PlannerCreateResponseDto = {
  plannerId?: number
  title?: string
  status?: string
  memberCount?: number
  startDate?: string
  endDate?: string
  countryName?: string
  cityName?: string
  inviteLink?: string
}

export type PlannerListResponseDto = {
  plannerId?: number
  title?: string
  countryName?: string
  cityName?: string
  startDate?: string
  endDate?: string
  status?: string
  role?: string
  memberCount?: number
  joinedMemberCount?: number
}

export type PlannerDetailResponseDto = {
  plannerId?: number
  title?: string
  countryName?: string
  cityName?: string
  startDate?: string
  endDate?: string
  status?: string
  role?: string
  memberCount?: number
  joinedMemberCount?: number
  inviteLink?: string
}

export type PlannerMemberResponseDto = {
  invitationId?: number
  status?: string
  userId?: string
  nickName?: string
  role?: string
  joinedAt?: string
}

export type InvitePlannerMembersRequestDto = {
  userIds: string[]
}

export type PlannerInvitationResponseDto = {
  createdAt?: string
  invitedByUserId?: string
  invitedUserId?: string
  invitationId?: number
  plannerId?: number
  plannerTitle?: string
  respondedAt?: string
  status?: string
}

export type PlannerInviteResponseDto = {
  inviteLink?: string
  invitedCount?: number
  invitations?: PlannerInvitationResponseDto[]
}

export type JoinPlannerRequestDto = {
  inviteCode: string
}

export type PlannerJoinResponseDto = {
  plannerId?: number
  title?: string
  role?: string
  status?: string
  memberCount?: number
  joinedMemberCount?: number
}

export type CreateVoteRequestDto = {
  category: string
  placeId?: number
  deadline?: string
}

export type VoteCreateResponseDto = {
  voteId?: number
  plannerId?: number
  planId?: number
  category?: string
  categoryLabel?: string
  status?: string
  deadline?: string
  createdAt?: string
  count?: number
}

export type SavePlannerTravelPlanRequestDto = {
  memberCount?: number
  isSolo?: boolean
  countryName: string
  cityName: string
  startDate: string
  endDate: string
}

export type PlannerTravelPlanResponseDto = {
  plannerId?: number
  planId?: number
  title?: string
  memberCount?: number
  isSolo?: boolean
  countryName?: string
  cityName?: string
  startDate?: string
  endDate?: string
}

export type ConfirmedPlaceResponseDto = {
  voteId?: number
  category?: string
  categoryLabel?: string
  optionId?: number
  tourPlaceId?: number
  placeName?: string
  imageUrl?: string
  address?: string
  rating?: number
  voteCount?: number
}

export type PlannerFinalResponseDto = {
  plannerId?: number
  title?: string
  countryName?: string
  cityName?: string
  startDate?: string
  endDate?: string
  status?: string
  places?: ConfirmedPlaceResponseDto[]
}

export type VoteOptionStatusResponseDto = {
  optionId?: number
  tourPlaceId?: number
  placeName?: string
  imageUrl?: string
  address?: string
  rating?: number
  addedByUserId?: string
  voteCount?: number
  selectedByMe: boolean
  confirmed?: boolean
}

export type VoteStatusResponseDto = {
  voteId?: number
  plannerId?: number
  category?: string
  categoryLabel?: string
  status?: string
  deadline?: string
  deadlinePassed?: boolean
  eligibleMemberCount?: number
  votedMemberCount?: number
  confirmedOptionId?: number
  options: VoteOptionStatusResponseDto[]
}

export type VoteBallotRequestDto = {
  optionId: number
}

export type VoteBallotResponseDto = {
  voteRecordId?: number
  voteId?: number
  optionId?: number
  placeName?: string
  changed?: boolean
  votedAt?: string
}

export type VoteConfirmRequestDto = {
  optionId?: number
}

export type VoteConfirmResponseDto = {
  voteId?: number
  voteStatus?: string
  confirmedOptionId?: number
  tourPlaceId?: number
  placeName?: string
  voteCount?: number
  plannerStatus?: string
}

export type VoteCloseResponseDto = {
  voteId?: number
  status?: string
  totalVoteCount?: number
  highestVoteCount?: number
  topOptionIds?: number[]
  tied?: boolean
}

export type VoteReminderResponseDto = {
  message?: string
  notifiedCount?: number
}

export type PlannerCartRequestDto = {
  placeIds: number[]
}

export type VoteOptionCreateRequestDto = {
  tourPlaceId?: number
  placeName?: string
}

export type VoteOptionCreateResponseDto = {
  optionId?: number
  voteId?: number
  tourPlaceId?: number
  placeName?: string
  addedByUserId?: string
  createdAt?: string
}

export type RandomPlaceResponseDto = {
  placeId?: number
  placeName?: string
}

export type PlannerConfirmResponseDto = {
  confirmedSchedule?: ConfirmedPlaceResponseDto[]
  plannerId?: number
}

export type PlannerConfirmRequestDto = {
  selections?: Array<{
    voteId: number
    optionId: number
  }>
}

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
  cart: (plannerId: number) => `/planners/${plannerId}/cart`,
  random: (plannerId: number) => `/planners/${plannerId}/cart/random`,
  confirm: (plannerId: number) => `/planners/${plannerId}/confirm`,
  confirmedPlaces: (plannerId: number) => `/planners/${plannerId}/confirmed-places`,
  votes: (plannerId: number) => `/planners/${plannerId}/votes`,
  vote: (plannerId: number, voteId: number) => `/planners/${plannerId}/votes/${voteId}`,
  ballot: (plannerId: number, voteId: number) => `/planners/${plannerId}/votes/${voteId}/ballot`,
  closeVote: (plannerId: number, voteId: number) => `/planners/${plannerId}/votes/${voteId}/close`,
  confirmVote: (plannerId: number, voteId: number) => `/planners/${plannerId}/votes/${voteId}/confirm`,
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

export async function getConfirmedPlaces(plannerId: number): Promise<PlannerFinalResponseDto> {
  const { data } = await apiClient.get<PlannerFinalResponseDto>(PLANNER_API_PATHS.confirmedPlaces(plannerId))
  return data
}

export async function joinPlanner(payload: JoinPlannerRequestDto): Promise<PlannerJoinResponseDto> {
  const { data } = await apiClient.post<PlannerJoinResponseDto>(PLANNER_API_PATHS.join, payload)
  return data
}

export async function addPlannerPlaces(plannerId: number, payload: PlannerCartRequestDto): Promise<string> {
  const { data } = await apiClient.post<string>(PLANNER_API_PATHS.cart(plannerId), payload)
  return data
}

export async function selectRandomPlannerPlace(plannerId: number): Promise<RandomPlaceResponseDto> {
  const { data } = await apiClient.post<RandomPlaceResponseDto>(PLANNER_API_PATHS.random(plannerId))
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

export async function closeVote(plannerId: number, voteId: number): Promise<VoteCloseResponseDto> {
  const { data } = await apiClient.post<VoteCloseResponseDto>(PLANNER_API_PATHS.closeVote(plannerId, voteId))
  return data
}

export async function confirmVote(
  plannerId: number,
  voteId: number,
  payload: VoteConfirmRequestDto,
): Promise<VoteConfirmResponseDto> {
  const { data } = await apiClient.post<VoteConfirmResponseDto>(
    PLANNER_API_PATHS.confirmVote(plannerId, voteId),
    payload,
  )
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
