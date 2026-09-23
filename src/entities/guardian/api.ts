import { apiClient } from '@/shared/libs/api-client'
import type { PlannerListResponseDto, PlannerScheduleResponseDto } from '@/entities/planner'

export type GuardianLinkDto = {
  linkId?: number
  userId?: string
  nickName?: string
  linkedAt?: string
}

export type GuardianInviteDto = {
  code: string
  expiresAt: string
}

export type GuardianLocationDto = {
  latitude: number
  longitude: number
  recordedAt: string
}

const paths = {
  links: '/guardians/me',
  seniors: '/guardians/seniors',
  seniorPlanners: (seniorUserId: string) => `/guardians/seniors/${encodeURIComponent(seniorUserId)}/planners`,
  seniorSchedule: (seniorUserId: string, plannerId: number) => `/guardians/seniors/${encodeURIComponent(seniorUserId)}/planners/${plannerId}/schedule`,
  seniorLocation: (seniorUserId: string) => `/guardians/seniors/${encodeURIComponent(seniorUserId)}/location`,
  invite: '/guardians/invite',
  accept: '/guardians/accept',
  unlink: (linkId: number) => `/guardians/${linkId}`,
} as const

export async function getGuardianLinks(): Promise<GuardianLinkDto[]> {
  const { data } = await apiClient.get<GuardianLinkDto[]>(paths.links)
  return data
}

export async function getLinkedSeniors(): Promise<GuardianLinkDto[]> {
  const { data } = await apiClient.get<GuardianLinkDto[]>(paths.seniors)
  return data
}

export async function getSeniorPlanners(seniorUserId: string): Promise<PlannerListResponseDto[]> {
  const { data } = await apiClient.get<PlannerListResponseDto[]>(paths.seniorPlanners(seniorUserId))
  return data
}

export async function getSeniorSchedule(seniorUserId: string, plannerId: number): Promise<PlannerScheduleResponseDto> {
  const { data } = await apiClient.get<PlannerScheduleResponseDto>(paths.seniorSchedule(seniorUserId, plannerId))
  return data
}

export async function getSeniorLocation(seniorUserId: string): Promise<GuardianLocationDto> {
  const { data } = await apiClient.get<GuardianLocationDto>(paths.seniorLocation(seniorUserId))
  return data
}

export async function createGuardianInvite(): Promise<GuardianInviteDto> {
  const { data } = await apiClient.post<GuardianInviteDto>(paths.invite)
  return data
}

export async function acceptGuardianInvite(code: string): Promise<GuardianLinkDto> {
  const { data } = await apiClient.post<GuardianLinkDto>(paths.accept, { code })
  return data
}

export async function unlinkGuardian(linkId: number): Promise<void> {
  await apiClient.delete(paths.unlink(linkId))
}
