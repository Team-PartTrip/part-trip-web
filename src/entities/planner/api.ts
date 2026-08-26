import { apiClient } from '@/shared/libs/api-client'

export type CreatePlannerRequestDto = {
  title: string
  memberCount: number
  isSolo: boolean
  countryName: string
  cityName: string
  startDate: string
  endDate: string
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

const PLANNER_API_PATHS = {
  base: '/planners',
  detail: (plannerId: number) => `/planners/${plannerId}`,
  members: (plannerId: number) => `/planners/${plannerId}/members`,
  votes: (plannerId: number) => `/planners/${plannerId}/votes`,
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

export async function joinPlanner(payload: JoinPlannerRequestDto): Promise<PlannerJoinResponseDto> {
  const { data } = await apiClient.post<PlannerJoinResponseDto>(PLANNER_API_PATHS.join, payload)
  return data
}

export async function createVote(plannerId: number, payload: CreateVoteRequestDto): Promise<VoteCreateResponseDto> {
  const { data } = await apiClient.post<VoteCreateResponseDto>(PLANNER_API_PATHS.votes(plannerId), payload)
  return data
}
