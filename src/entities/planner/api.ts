import { apiClient } from '@/shared/libs/api-client'

import type {
  CreatePlannerRequestDto,
  GeneratePlannerRequestDto,
  JoinPlannerRequestDto,
  PlannerBlockResponseDto,
  PlannerConfirmResponseDto,
  PlannerCreateResponseDto,
  PlannerDetailResponseDto,
  PlannerInvitationResponseDto,
  PlannerJoinResponseDto,
  PlannerListResponseDto,
  PlannerMemberResponseDto,
  PlannerScheduleResponseDto,
  PlannerScheduleCandidateDto,
  SavePlannerScheduleRequestDto,
} from './types'

export type {
  CreatePlannerRequestDto,
  GeneratePlannerRequestDto,
  JoinPlannerRequestDto,
  PlannerBlockDto,
  PlannerBlockResponseDto,
  PlannerConfirmResponseDto,
  PlannerCreateResponseDto,
  PlannerDetailResponseDto,
  PlannerInvitationResponseDto,
  PlannerJoinResponseDto,
  PlannerListResponseDto,
  PlannerMemberResponseDto,
  PlannerScheduleResponseDto,
  PlannerScheduleDayDto,
  PlannerSchedulePlaceDto,
  PlannerScheduleSlotDto,
  PlannerScheduleCandidateDto,
  SavePlannerScheduleRequestDto,
} from './types'

const PLANNER_API_PATHS = {
  base: '/planners',
  blocks: '/planners/blocks',
  generate: '/planners/generate',
  detail: (plannerId: number) => `/planners/${plannerId}`,
  invitations: '/planners/invitations/me',
  invitation: (invitationId: number, action: 'accept' | 'reject') => `/planners/invitations/${invitationId}/${action}`,
  cancelInvitation: (plannerId: number, invitationId: number) => `/planners/${plannerId}/invitations/${invitationId}`,
  members: (plannerId: number) => `/planners/${plannerId}/members`,
  member: (plannerId: number, memberUserId: string) => `/planners/${plannerId}/members/${memberUserId}`,
  confirm: (plannerId: number) => `/planners/${plannerId}/confirm`,
  schedule: (plannerId: number) => `/planners/${plannerId}/schedule`,
  scheduleCandidates: (plannerId: number) => `/planners/${plannerId}/schedule/candidates`,
  join: '/planners/join',
} as const

export async function getPlannerBlocks(): Promise<PlannerBlockResponseDto[]> {
  const { data } = await apiClient.get<PlannerBlockResponseDto[]>(PLANNER_API_PATHS.blocks)
  return data
}

export async function generatePlanner(payload: GeneratePlannerRequestDto): Promise<PlannerScheduleResponseDto> {
  const { data } = await apiClient.post<PlannerScheduleResponseDto>(PLANNER_API_PATHS.generate, payload)
  return data
}

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

export async function getPlannerSchedule(plannerId: number): Promise<PlannerScheduleResponseDto> {
  const { data } = await apiClient.get<PlannerScheduleResponseDto>(PLANNER_API_PATHS.schedule(plannerId))
  return data
}

export async function getPlannerScheduleCandidates(
  plannerId: number,
  date: string,
  query: string,
): Promise<PlannerScheduleCandidateDto[]> {
  const { data } = await apiClient.get<PlannerScheduleCandidateDto[]>(PLANNER_API_PATHS.scheduleCandidates(plannerId), {
    params: { date, q: query || undefined },
  })
  return data
}

export async function savePlannerSchedule(
  plannerId: number,
  payload: SavePlannerScheduleRequestDto,
): Promise<PlannerScheduleResponseDto> {
  const { data } = await apiClient.put<PlannerScheduleResponseDto>(PLANNER_API_PATHS.schedule(plannerId), payload)
  return data
}

export async function joinPlanner(payload: JoinPlannerRequestDto): Promise<PlannerJoinResponseDto> {
  const { data } = await apiClient.post<PlannerJoinResponseDto>(PLANNER_API_PATHS.join, payload)
  return data
}

export async function confirmPlanner(plannerId: number): Promise<PlannerConfirmResponseDto> {
  const { data } = await apiClient.post<PlannerConfirmResponseDto>(PLANNER_API_PATHS.confirm(plannerId))
  return data
}
