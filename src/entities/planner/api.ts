import { apiClient } from '@/shared/libs/api-client'

export type CreatePlannerRequestDto = {
  title: string
  memberCount: number
  isSolo: boolean
  countryName?: string
  cityName?: string
  startDate?: string
  endDate?: string
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
  inviteCode?: string
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
  inviteCode?: string
}

export type PlannerMemberResponseDto = {
  userId?: string
  nickName?: string
  role?: string
  joinedAt?: string
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
}

export type SavePlannerTravelPlanRequestDto = {
  countryName: string
  cityName: string
  startDate: string
  endDate: string
}

export type PlannerTravelPlanResponseDto = {
  plannerId?: number
  planId?: number
  title?: string
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
  selectedByMe?: boolean
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
  options?: VoteOptionStatusResponseDto[]
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

const PLANNER_API_PATHS = {
  base: '/planners',
  detail: (plannerId: number) => `/planners/${plannerId}`,
  members: (plannerId: number) => `/planners/${plannerId}/members`,
  travelPlan: (plannerId: number) => `/planners/${plannerId}/travel-plan`,
  confirmedPlaces: (plannerId: number) => `/planners/${plannerId}/confirmed-places`,
  votes: (plannerId: number) => `/planners/${plannerId}/votes`,
  vote: (plannerId: number, voteId: number) => `/planners/${plannerId}/votes/${voteId}`,
  ballot: (plannerId: number, voteId: number) => `/planners/${plannerId}/votes/${voteId}/ballot`,
  closeVote: (plannerId: number, voteId: number) => `/planners/${plannerId}/votes/${voteId}/close`,
  confirmVote: (plannerId: number, voteId: number) => `/planners/${plannerId}/votes/${voteId}/confirm`,
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

export async function getPlannerMembers(plannerId: number): Promise<PlannerMemberResponseDto[]> {
  const { data } = await apiClient.get<PlannerMemberResponseDto[]>(PLANNER_API_PATHS.members(plannerId))
  return data
}

export async function savePlannerTravelPlan(
  plannerId: number,
  payload: SavePlannerTravelPlanRequestDto,
): Promise<PlannerTravelPlanResponseDto> {
  const { data } = await apiClient.put<PlannerTravelPlanResponseDto>(
    PLANNER_API_PATHS.travelPlan(plannerId),
    payload,
  )
  return data
}

export async function getConfirmedPlaces(plannerId: number): Promise<PlannerFinalResponseDto> {
  const { data } = await apiClient.get<PlannerFinalResponseDto>(PLANNER_API_PATHS.confirmedPlaces(plannerId))
  return data
}

export async function joinPlanner(payload: JoinPlannerRequestDto): Promise<PlannerJoinResponseDto> {
  const { data } = await apiClient.post<PlannerJoinResponseDto>(PLANNER_API_PATHS.join, payload)
  return data
}

export async function createVote(plannerId: number, payload: CreateVoteRequestDto): Promise<VoteCreateResponseDto> {
  const { data } = await apiClient.post<VoteCreateResponseDto>(PLANNER_API_PATHS.votes(plannerId), payload)
  return data
}

export async function getVotes(plannerId: number): Promise<VoteStatusResponseDto[]> {
  const { data } = await apiClient.get<VoteStatusResponseDto[]>(PLANNER_API_PATHS.votes(plannerId))
  return data
}

export async function getVote(plannerId: number, voteId: number): Promise<VoteStatusResponseDto> {
  const { data } = await apiClient.get<VoteStatusResponseDto>(PLANNER_API_PATHS.vote(plannerId, voteId))
  return data
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
  payload?: VoteConfirmRequestDto,
): Promise<VoteConfirmResponseDto> {
  const { data } = await apiClient.post<VoteConfirmResponseDto>(
    PLANNER_API_PATHS.confirmVote(plannerId, voteId),
    payload,
  )
  return data
}
